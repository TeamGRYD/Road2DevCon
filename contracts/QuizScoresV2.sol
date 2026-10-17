// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

interface IProfileRegistry {
    function isRegistered(address _wallet) external view returns (bool);
}

/**
 * @title QuizScoresV2
 * @notice Stores quiz scores for one Road to DevCon event. Profiles (name,
 *         X username) live in the shared ProfileRegistry, not here.
 * @dev Enforces:
 *      - Registered profile (in ProfileRegistry) required to submit
 *      - Admin-signed score submission, bound to this contract and chain
 *      - One attempt per quiz per wallet (no retakes)
 *      A wallet joins this event's leaderboard on its first score submission.
 */
contract QuizScoresV2 {
    /// @notice The admin address whose signatures authorize score submissions
    address public immutable admin;
    /// @notice Shared profile registry
    IProfileRegistry public immutable registry;

    mapping(address => uint256[4]) private scores; // Scores for Quiz 0-3
    mapping(address => bool) private isParticipant;
    /// @notice Tracks whether a wallet has already attempted a given quiz
    mapping(address => mapping(uint8 => bool)) public hasAttempted;
    /// @notice Nonce per wallet to prevent signature replay attacks
    mapping(address => uint256) public nonces;

    address[] private participantAddresses;

    event ScoreSubmitted(
        address indexed wallet,
        uint8 quizId,
        uint256 score
    );

    /// @param _admin           The wallet address authorized to sign quiz scores
    /// @param _profileRegistry Deployed ProfileRegistry address
    constructor(address _admin, address _profileRegistry) {
        require(_admin != address(0), "Invalid admin address");
        require(_profileRegistry != address(0), "Invalid registry address");
        admin = _admin;
        registry = IProfileRegistry(_profileRegistry);
    }

    // ============================================================
    // SCORE SUBMISSION (requires admin signature)
    // ============================================================

    /**
     * @notice Submit a quiz score with an admin-signed authorization.
     * @dev The admin backend signs
     *      keccak256(address(this), chainid, wallet, quizId, score, nonce).
     *      Including the contract address and chain ID stops a signature
     *      issued for one event contract from being replayed on another.
     * @param _quizId    Quiz index (0-3)
     * @param _score     Score earned (0-2000)
     * @param _nonce     Must match the current nonce for msg.sender
     * @param _signature 65-byte ECDSA signature from the admin wallet
     */
    function submitScore(
        uint8 _quizId,
        uint256 _score,
        uint256 _nonce,
        bytes calldata _signature
    ) external {
        require(registry.isRegistered(msg.sender), "Not registered");
        require(_quizId < 4, "Invalid quiz ID (must be 0-3)");
        require(_score <= 2000, "Score exceeds maximum (2000)");
        require(!hasAttempted[msg.sender][_quizId], "Already attempted this quiz");
        require(_nonce == nonces[msg.sender], "Invalid nonce");

        // Reconstruct the message the admin should have signed
        bytes32 messageHash = keccak256(
            abi.encodePacked(address(this), block.chainid, msg.sender, _quizId, _score, _nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        address signer = _recoverSigner(ethSignedHash, _signature);
        require(signer == admin, "Invalid signature");

        // Store score and mark as attempted (Checks-Effects-Interactions)
        hasAttempted[msg.sender][_quizId] = true;
        scores[msg.sender][_quizId] = _score;
        nonces[msg.sender]++;

        if (!isParticipant[msg.sender]) {
            isParticipant[msg.sender] = true;
            participantAddresses.push(msg.sender);
        }

        emit ScoreSubmitted(msg.sender, _quizId, _score);
    }

    // ============================================================
    // VIEW FUNCTIONS
    // ============================================================

    /**
     * @notice Check if an address has a profile in the ProfileRegistry.
     * @dev Pass-through kept so the quiz API can call it on the event contract.
     */
    function isRegistered(address _wallet) external view returns (bool) {
        return registry.isRegistered(_wallet);
    }

    /**
     * @notice Get a wallet's scores for this event.
     */
    function getScores(address _wallet) external view returns (uint256[4] memory) {
        return scores[_wallet];
    }

    /**
     * @notice Get all participant addresses for leaderboard enumeration.
     */
    function getAllParticipants() external view returns (address[] memory) {
        return participantAddresses;
    }

    /**
     * @notice Get total number of participants (wallets with at least one score).
     */
    function getParticipantCount() external view returns (uint256) {
        return participantAddresses.length;
    }

    /**
     * @notice Batch-read scores for leaderboard.
     * @dev Names/X usernames are resolved via ProfileRegistry.getProfilesBatch.
     * @param _start Start index (inclusive)
     * @param _count Number of participants to read
     */
    function getLeaderboardBatch(uint256 _start, uint256 _count)
        external
        view
        returns (
            address[] memory wallets,
            uint256[4][] memory batchScores
        )
    {
        uint256 total = participantAddresses.length;
        if (_start >= total) {
            return (new address[](0), new uint256[4][](0));
        }

        uint256 end = _start + _count;
        if (end > total) end = total;
        uint256 len = end - _start;

        wallets = new address[](len);
        batchScores = new uint256[4][](len);

        for (uint256 i = 0; i < len; i++) {
            address addr = participantAddresses[_start + i];
            wallets[i] = addr;
            batchScores[i] = scores[addr];
        }
    }

    // ============================================================
    // INTERNAL HELPERS
    // ============================================================

    /**
     * @dev Recover the signer from an Ethereum signed message hash and signature.
     */
    function _recoverSigner(bytes32 _ethSignedHash, bytes calldata _sig)
        internal
        pure
        returns (address)
    {
        require(_sig.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := calldataload(_sig.offset)
            s := calldataload(add(_sig.offset, 32))
            v := byte(0, calldataload(add(_sig.offset, 64)))
        }

        if (v < 27) v += 27;
        require(v == 27 || v == 28, "Invalid signature v value");

        address recovered = ecrecover(_ethSignedHash, v, r, s);
        require(recovered != address(0), "Invalid signature");
        return recovered;
    }
}
