// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

/**
 * @title GaslessForwarder
 * @notice ERC-2771 forwarder for Road to DevCon. A participant signs an
 *         EIP-712 ForwardRequest in their wallet (no gas), and the gas
 *         station (api/relay.js) submits it here and pays for the transaction.
 * @dev The forwarder appends `from` to the calldata. Contracts that trust it
 *      (ProfileRegistry, QuizScoresV2, FeedContract) read the participant via
 *      _msgSender(). Signatures are checked on-chain, so the relayer cannot
 *      act for a wallet without that wallet's signature.
 *      Nonces are unordered (any unused value, picked at random by the
 *      frontend), so a participant can have several requests in flight.
 *      A failing call reverts the whole transaction, nonce included, so a
 *      request is never consumed without taking effect.
 */
contract GaslessForwarder {
    struct ForwardRequest {
        address from;
        address to;
        uint256 nonce;
        uint256 deadline;
        bytes data;
    }

    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    bytes32 public constant FORWARD_REQUEST_TYPEHASH = keccak256(
        "ForwardRequest(address from,address to,uint256 nonce,uint256 deadline,bytes data)"
    );
    bytes32 private constant NAME_HASH = keccak256("Road2DevConForwarder");
    bytes32 private constant VERSION_HASH = keccak256("1");

    /// @dev secp256k1n / 2, upper bound for `s` (rejects malleable signatures)
    uint256 private constant MAX_S =
        0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0;

    /// @notice wallet => nonce => already executed
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    event Executed(address indexed from, address indexed to, uint256 nonce);

    // ============================================================
    // RELAY
    // ============================================================

    /**
     * @notice Check a request without executing it.
     */
    function verify(ForwardRequest calldata _req, bytes calldata _signature)
        external
        view
        returns (bool)
    {
        return _req.from != address(0) &&
            block.timestamp <= _req.deadline &&
            !usedNonces[_req.from][_req.nonce] &&
            _recoverSigner(_hashRequest(_req), _signature) == _req.from;
    }

    /**
     * @notice Execute a signed request. Anyone may submit it and pay the gas.
     * @dev Bubbles up the target's revert reason on failure.
     */
    function execute(ForwardRequest calldata _req, bytes calldata _signature)
        external
        returns (bytes memory)
    {
        require(_req.from != address(0), "Invalid sender");
        require(block.timestamp <= _req.deadline, "Request expired");
        require(!usedNonces[_req.from][_req.nonce], "Nonce already used");
        require(_recoverSigner(_hashRequest(_req), _signature) == _req.from, "Invalid signature");

        usedNonces[_req.from][_req.nonce] = true;

        (bool success, bytes memory result) = _req.to.call(abi.encodePacked(_req.data, _req.from));
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }

        emit Executed(_req.from, _req.to, _req.nonce);
        return result;
    }

    // ============================================================
    // VIEW FUNCTIONS
    // ============================================================

    /**
     * @notice EIP-712 domain separator (recomputed per call, so it follows forks).
     */
    function domainSeparator() public view returns (bytes32) {
        return keccak256(
            abi.encode(EIP712_DOMAIN_TYPEHASH, NAME_HASH, VERSION_HASH, block.chainid, address(this))
        );
    }

    // ============================================================
    // INTERNAL HELPERS
    // ============================================================

    function _hashRequest(ForwardRequest calldata _req) internal view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                FORWARD_REQUEST_TYPEHASH,
                _req.from,
                _req.to,
                _req.nonce,
                _req.deadline,
                keccak256(_req.data)
            )
        );
        return keccak256(abi.encodePacked("\x19\x01", domainSeparator(), structHash));
    }

    /**
     * @dev Recover the signer of an EIP-712 digest. Returns address(0) for
     *      malformed or malleable signatures.
     */
    function _recoverSigner(bytes32 _digest, bytes calldata _sig) internal pure returns (address) {
        if (_sig.length != 65) return address(0);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := calldataload(_sig.offset)
            s := calldataload(add(_sig.offset, 32))
            v := byte(0, calldataload(add(_sig.offset, 64)))
        }

        if (v < 27) v += 27;
        if (v != 27 && v != 28) return address(0);
        if (uint256(s) > MAX_S) return address(0);

        return ecrecover(_digest, v, r, s);
    }
}
