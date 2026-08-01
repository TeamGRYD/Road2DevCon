// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title QuizScores
 * @notice Stores quiz scores for "Road to DevCon 8: Workshops Edition" participants
 * @dev Each participant's name, X username, and highest scores across 4 quizzes 
 *      are mapped to their connected wallet address.
 */
contract QuizScores {
    struct Participant {
        string name;
        string xUsername;
        uint256[4] quizScores;  // Highest scores for Quiz 0-3
        bool registered;
    }

    mapping(address => Participant) private participants;
    address[] private participantAddresses;

    event ScoreSubmitted(
        address indexed wallet,
        string name,
        string xUsername,
        uint8 quizId,
        uint256 score
    );

    event ParticipantRegistered(
        address indexed wallet,
        string name,
        string xUsername
    );

    /**
     * @notice Register (or update) a participant and submit a quiz score.
     * @dev Only updates the score if the new score is higher than the existing one.
     *      Name and xUsername are set on first call and updated on subsequent calls.
     * @param _name        Display name of the participant
     * @param _xUsername    X (Twitter) username of the participant
     * @param _quizId      Quiz index (0-3)
     * @param _score       Score achieved in the quiz
     */
    function registerAndSubmitScore(
        string calldata _name,
        string calldata _xUsername,
        uint8 _quizId,
        uint256 _score
    ) external {
        require(_quizId < 4, "Invalid quiz ID (must be 0-3)");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_xUsername).length > 0, "X username cannot be empty");
        require(_score <= 2000, "Score exceeds maximum (2000)");

        Participant storage p = participants[msg.sender];

        if (!p.registered) {
            p.registered = true;
            p.name = _name;
            p.xUsername = _xUsername;
            participantAddresses.push(msg.sender);
            emit ParticipantRegistered(msg.sender, _name, _xUsername);
        } else {
            // Update name and xUsername on subsequent submissions
            p.name = _name;
            p.xUsername = _xUsername;
        }

        // Only update if new score is higher
        if (_score > p.quizScores[_quizId]) {
            p.quizScores[_quizId] = _score;
        }

        emit ScoreSubmitted(msg.sender, _name, _xUsername, _quizId, _score);
    }

    /**
     * @notice Get a participant's data by their wallet address.
     * @param _wallet  The wallet address to look up
     * @return name       Display name
     * @return xUsername   X username
     * @return quizScores Array of 4 highest quiz scores
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
     * @param _start  Start index (inclusive)
     * @param _count  Number of participants to read
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
}
