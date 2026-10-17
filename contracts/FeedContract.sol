// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

interface IProfileRegistry {
    function isRegistered(address _wallet) external view returns (bool);
}

/**
 * @title FeedContract
 * @notice Topic-based media feed for Road to DevCon. Registered participants
 *         submit X / YouTube / Instagram posts to a topic and up/downvote
 *         each other's submissions.
 * @dev Topics are defined off-chain in src/config/topics.js (append-only IDs);
 *      the frontend ignores topic IDs it doesn't know. Media is stored as a
 *      canonical (platform, mediaId) pair rather than a raw URL, so the same
 *      post can't be submitted twice to one topic.
 *      Feed votes are unrelated to quiz scores.
 */
contract FeedContract {
    /// @dev Append-only: new platforms go at the end
    enum Platform { X, YouTube, Instagram }

    struct Submission {
        uint256 id;
        uint8 topicId;
        Platform platform;
        string mediaId; // tweet ID | YouTube video ID | Instagram shortcode
        address submitter;
        uint64 timestamp;
        uint32 upvotes;
        uint32 downvotes;
        bool hidden;
    }

    /// @notice Shared profile registry
    IProfileRegistry public immutable registry;
    /// @notice Moderator (can hide submissions)
    address public owner;

    /// @notice Submissions by ID (IDs start at 1)
    mapping(uint256 => Submission) public submissions;
    uint256 public submissionCount;
    mapping(uint8 => uint256[]) private topicSubmissions;
    /// @notice topicId => keccak256(platform, mediaId) => already submitted
    mapping(uint8 => mapping(bytes32 => bool)) public mediaSubmitted;
    /// @notice submissionId => voter => -1 | 0 | 1
    mapping(uint256 => mapping(address => int8)) public userVotes;

    event Submitted(
        uint256 indexed id,
        uint8 indexed topicId,
        address indexed submitter,
        Platform platform,
        string mediaId
    );
    event Voted(
        uint256 indexed id,
        address indexed voter,
        int8 value,
        uint32 upvotes,
        uint32 downvotes
    );
    event HiddenSet(uint256 indexed id, bool hidden);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRegistered() {
        require(registry.isRegistered(msg.sender), "Not registered");
        _;
    }

    /// @param _profileRegistry Deployed ProfileRegistry address
    constructor(address _profileRegistry) {
        require(_profileRegistry != address(0), "Invalid registry address");
        registry = IProfileRegistry(_profileRegistry);
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // ============================================================
    // SUBMISSIONS
    // ============================================================

    /**
     * @notice Submit a post to a topic.
     * @param _topicId  Topic ID from src/config/topics.js
     * @param _platform Media platform
     * @param _mediaId  Canonical media ID: 1-32 chars of [A-Za-z0-9_-]
     */
    function submit(uint8 _topicId, Platform _platform, string calldata _mediaId)
        external
        onlyRegistered
    {
        require(_isValidMediaId(bytes(_mediaId)), "Invalid media ID");

        bytes32 mediaKey = keccak256(abi.encode(_platform, _mediaId));
        require(!mediaSubmitted[_topicId][mediaKey], "Already submitted to this topic");
        mediaSubmitted[_topicId][mediaKey] = true;

        uint256 id = ++submissionCount;
        submissions[id] = Submission({
            id: id,
            topicId: _topicId,
            platform: _platform,
            mediaId: _mediaId,
            submitter: msg.sender,
            timestamp: uint64(block.timestamp),
            upvotes: 0,
            downvotes: 0,
            hidden: false
        });
        topicSubmissions[_topicId].push(id);

        emit Submitted(id, _topicId, msg.sender, _platform, _mediaId);
    }

    // ============================================================
    // VOTING
    // ============================================================

    /**
     * @notice Upvote (1), downvote (-1) or clear (0) your vote on a submission.
     * @dev Replaces any previous vote by the caller.
     */
    function vote(uint256 _id, int8 _value) external onlyRegistered {
        require(_value >= -1 && _value <= 1, "Invalid vote value");

        Submission storage s = submissions[_id];
        require(s.id != 0, "Submission not found");
        require(!s.hidden, "Submission hidden");
        require(s.submitter != msg.sender, "Cannot vote on own submission");

        int8 previous = userVotes[_id][msg.sender];
        require(previous != _value, "Vote unchanged");

        if (previous == 1) s.upvotes--;
        else if (previous == -1) s.downvotes--;

        if (_value == 1) s.upvotes++;
        else if (_value == -1) s.downvotes++;

        userVotes[_id][msg.sender] = _value;

        emit Voted(_id, msg.sender, _value, s.upvotes, s.downvotes);
    }

    // ============================================================
    // MODERATION
    // ============================================================

    /**
     * @notice Hide or unhide a submission (spam, NSFW, off-topic).
     */
    function setHidden(uint256 _id, bool _hidden) external onlyOwner {
        require(submissions[_id].id != 0, "Submission not found");
        submissions[_id].hidden = _hidden;
        emit HiddenSet(_id, _hidden);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid owner address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

    // ============================================================
    // VIEW FUNCTIONS
    // ============================================================

    /**
     * @notice Number of submissions in a topic (including hidden ones).
     */
    function getTopicCount(uint8 _topicId) external view returns (uint256) {
        return topicSubmissions[_topicId].length;
    }

    /**
     * @notice Page through a topic's submissions in submission order.
     * @dev Hidden submissions are included; the frontend filters them.
     * @param _topicId Topic ID
     * @param _start   Start index (inclusive)
     * @param _count   Number of submissions to read
     */
    function getTopicBatch(uint8 _topicId, uint256 _start, uint256 _count)
        external
        view
        returns (Submission[] memory batch)
    {
        uint256[] storage ids = topicSubmissions[_topicId];
        uint256 total = ids.length;
        if (_start >= total) {
            return new Submission[](0);
        }

        uint256 end = _start + _count;
        if (end > total) end = total;
        uint256 len = end - _start;

        batch = new Submission[](len);
        for (uint256 i = 0; i < len; i++) {
            batch[i] = submissions[ids[_start + i]];
        }
    }

    /**
     * @notice Batch-read a user's votes (-1 / 0 / 1) for many submissions.
     */
    function getUserVotes(address _user, uint256[] calldata _ids)
        external
        view
        returns (int8[] memory votes)
    {
        votes = new int8[](_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            votes[i] = userVotes[_ids[i]][_user];
        }
    }

    // ============================================================
    // INTERNAL HELPERS
    // ============================================================

    /**
     * @dev 1-32 bytes, each [A-Za-z0-9_-]. Covers tweet IDs, YouTube IDs and
     *      Instagram shortcodes, and guarantees the value is safe to place in
     *      embed URLs.
     */
    function _isValidMediaId(bytes calldata _id) internal pure returns (bool) {
        if (_id.length == 0 || _id.length > 32) return false;
        for (uint256 i = 0; i < _id.length; i++) {
            bytes1 c = _id[i];
            bool ok = (c >= 0x30 && c <= 0x39) || // 0-9
                (c >= 0x41 && c <= 0x5A) ||       // A-Z
                (c >= 0x61 && c <= 0x7A) ||       // a-z
                c == 0x2D ||                      // -
                c == 0x5F;                        // _
            if (!ok) return false;
        }
        return true;
    }
}
