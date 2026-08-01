// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

/**
 * @title QuizScores
 * @notice Stores quiz scores for "Road to DevCon 8: Workshops Edition" participants
 * @dev Enforces:
 *      - One-time registration with unique X usernames
 *      - Admin-signed score submission (prevents forged scores)
 *      - One attempt per quiz per wallet (no retakes)
 */
contract QuizScores {
    struct Participant {
        string name;
        string xUsername;
        uint256[4] quizScores; // Scores for Quiz 0-3
        bool registered;
    }

    /// @notice The admin address whose signatures authorize score submissions
    address public immutable admin;

    mapping(address => Participant) private participants;
    /// @notice Maps keccak256(xUsername) => wallet to enforce unique X usernames
    mapping(bytes32 => address) public xUsernameTaken;
    /// @notice Tracks whether a wallet has already attempted a given quiz
    mapping(address => mapping(uint8 => bool)) public hasAttempted;
    /// @notice Nonce per wallet to prevent signature replay attacks
    mapping(address => uint256) public nonces;

    address[] private participantAddresses;

    event ParticipantRegistered(
        address indexed wallet,
        string name,
        string xUsername
    );

    event ScoreSubmitted(
        address indexed wallet,
        uint8 quizId,
        uint256 score
    );

    /// @param _admin The wallet address authorized to sign quiz scores
    constructor(address _admin) {
        require(_admin != address(0), "Invalid admin address");
        admin = _admin;
    }

    // ============================================================
    // REGISTRATION (called by student from their own wallet)
    // ============================================================

    /**
     * @notice Register as a participant. Name and X username are permanent.
     * @dev Each X username can only be claimed by one wallet. Registration
     *      is a one-time operation; calling again will revert.
     * @param _name      Display name of the participant
     * @param _xUsername  X (Twitter) username (without @)
     */
    function register(string calldata _name, string calldata _xUsername) external {
        require(!participants[msg.sender].registered, "Already registered");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_name).length <= 64, "Name too long");
        require(bytes(_xUsername).length > 0, "X username required");
        require(bytes(_xUsername).length <= 32, "X username too long");

        bytes32 usernameHash = keccak256(abi.encodePacked(_toLower(_xUsername)));
        require(
            xUsernameTaken[usernameHash] == address(0),
            "X username already taken"
        );

        participants[msg.sender] = Participant({
            name: _name,
            xUsername: _xUsername,
            quizScores: [uint256(0), 0, 0, 0],
            registered: true
        });
        xUsernameTaken[usernameHash] = msg.sender;
        participantAddresses.push(msg.sender);

        emit ParticipantRegistered(msg.sender, _name, _xUsername);
    }

    // ============================================================
    // SCORE SUBMISSION (requires admin signature)
    // ============================================================

    /**
     * @notice Submit a quiz score with an admin-signed authorization.
     * @dev The admin backend signs keccak256(wallet, quizId, score, nonce)
     *      after the student completes the quiz server-side. This prevents
     *      score forging via manual transaction encoding.
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
        require(participants[msg.sender].registered, "Not registered");
        require(_quizId < 4, "Invalid quiz ID (must be 0-3)");
        require(_score <= 2000, "Score exceeds maximum (2000)");
        require(!hasAttempted[msg.sender][_quizId], "Already attempted this quiz");
        require(_nonce == nonces[msg.sender], "Invalid nonce");

        // Reconstruct the message the admin should have signed
        bytes32 messageHash = keccak256(
            abi.encodePacked(msg.sender, _quizId, _score, _nonce)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        address signer = _recoverSigner(ethSignedHash, _signature);
        require(signer == admin, "Invalid signature");

        // Store score and mark as attempted (Checks-Effects-Interactions)
        hasAttempted[msg.sender][_quizId] = true;
        participants[msg.sender].quizScores[_quizId] = _score;
        nonces[msg.sender]++;

        emit ScoreSubmitted(msg.sender, _quizId, _score);
    }

    // ============================================================
    // VIEW FUNCTIONS
    // ============================================================

    /**
     * @notice Get a participant's data by their wallet address.
     * @param _wallet The wallet address to look up
     * @return name       Display name
     * @return xUsername   X username
     * @return quizScores Array of 4 quiz scores
     */
    function getParticipant(address _wallet)
        external
        view
        returns (
            string memory name,
            string memory xUsername,
            uint256[4] memory quizScores
        )
    {
        Participant storage p = participants[_wallet];
        require(p.registered, "Participant not found");
        return (p.name, p.xUsername, p.quizScores);
    }

    /**
     * @notice Check if an address is registered.
     */
    function isRegistered(address _wallet) external view returns (bool) {
        return participants[_wallet].registered;
    }

    /**
     * @notice Get all participant addresses for leaderboard enumeration.
     * @return Array of all registered wallet addresses
     */
    function getAllParticipants() external view returns (address[] memory) {
        return participantAddresses;
    }

    /**
     * @notice Get total number of registered participants.
     */
    function getParticipantCount() external view returns (uint256) {
        return participantAddresses.length;
    }

    /**
     * @notice Batch-read participant data for leaderboard.
     * @dev Returns parallel arrays for efficient off-chain processing.
     * @param _start Start index (inclusive)
     * @param _count Number of participants to read
     */
    function getLeaderboardBatch(uint256 _start, uint256 _count)
        external
        view
        returns (
            address[] memory wallets,
            string[] memory names,
            string[] memory xUsernames,
            uint256[4][] memory scores
        )
    {
        uint256 total = participantAddresses.length;
        if (_start >= total) {
            return (
                new address[](0),
                new string[](0),
                new string[](0),
                new uint256[4][](0)
            );
        }

        uint256 end = _start + _count;
        if (end > total) end = total;
        uint256 len = end - _start;

        wallets = new address[](len);
        names = new string[](len);
        xUsernames = new string[](len);
        scores = new uint256[4][](len);

        for (uint256 i = 0; i < len; i++) {
            address addr = participantAddresses[_start + i];
            Participant storage p = participants[addr];
            wallets[i] = addr;
            names[i] = p.name;
            xUsernames[i] = p.xUsername;
            scores[i] = p.quizScores;
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

    /**
     * @dev Convert a string to lowercase for case-insensitive username comparison.
     */
    function _toLower(string calldata _str) internal pure returns (string memory) {
        bytes memory bStr = bytes(_str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint256 i = 0; i < bStr.length; i++) {
            if (bStr[i] >= 0x41 && bStr[i] <= 0x5A) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
}
