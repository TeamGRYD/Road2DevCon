// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

/// @dev Subset of the v1 QuizScores interface needed for migration
interface ILegacyQuizScores {
    function getLeaderboardBatch(uint256 _start, uint256 _count)
        external
        view
        returns (
            address[] memory wallets,
            string[] memory names,
            string[] memory xUsernames,
            uint256[4][] memory scores
        );
}

/**
 * @title ProfileRegistry
 * @notice Single source of truth for participant profiles (name + X username)
 *         across all Road to DevCon events, quizzes and the Feed.
 * @dev Lifecycle:
 *      1. Deploy. Registration is closed.
 *      2. Owner calls migrateFrom() for each legacy QuizScores contract,
 *         newest event first. Profile data is read on-chain from the legacy
 *         contract, so the owner cannot inject arbitrary profiles.
 *      3. Owner calls finalizeMigration(). Migration closes permanently,
 *         registration opens, and the owner has no further privileges.
 */
contract ProfileRegistry {
    struct Profile {
        string name;
        string xUsername;
        bool registered;
    }

    uint8 private constant SKIP_WALLET_EXISTS = 1;
    uint8 private constant SKIP_X_USERNAME_TAKEN = 2;

    /// @notice Address allowed to run the one-time migration
    address public immutable owner;
    /// @notice True once migration is closed and registration is open
    bool public migrationFinalized;

    mapping(address => Profile) private profiles;
    /// @notice Maps keccak256(lowercase xUsername) => wallet to enforce unique X usernames
    mapping(bytes32 => address) public xUsernameTaken;

    address[] private profileAddresses;

    event ProfileRegistered(address indexed wallet, string name, string xUsername);
    event ProfileMigrated(address indexed wallet, address indexed legacySource);
    /// @param reason 1 = wallet already registered, 2 = X username held by another wallet
    event MigrationSkipped(address indexed wallet, address indexed legacySource, uint8 reason);
    event MigrationFinalized();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ============================================================
    // REGISTRATION (called by participant from their own wallet)
    // ============================================================

    /**
     * @notice Register a profile. Name and X username are permanent.
     * @dev Opens only after migration is finalized, so a new user cannot
     *      claim an X username that belongs to a not-yet-migrated profile.
     * @param _name      Display name of the participant
     * @param _xUsername X (Twitter) username (without @)
     */
    function register(string calldata _name, string calldata _xUsername) external {
        require(migrationFinalized, "Registration not open yet");
        require(!profiles[msg.sender].registered, "Already registered");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_name).length <= 64, "Name too long");
        require(bytes(_xUsername).length > 0, "X username required");
        require(bytes(_xUsername).length <= 32, "X username too long");

        bytes32 usernameHash = keccak256(abi.encodePacked(_toLower(_xUsername)));
        require(xUsernameTaken[usernameHash] == address(0), "X username already taken");

        _store(msg.sender, _name, _xUsername, usernameHash);
        emit ProfileRegistered(msg.sender, _name, _xUsername);
    }

    // ============================================================
    // MIGRATION (owner only, before finalization)
    // ============================================================

    /**
     * @notice Copy profiles from a legacy QuizScores contract.
     * @dev Reads directly from the legacy contract. Wallets that are already
     *      registered, or whose X username is held by another wallet, are
     *      skipped with a MigrationSkipped event. Safe to re-run over the
     *      same range (already-migrated wallets are skipped).
     * @param _legacy Legacy QuizScores contract address
     * @param _start  Start index in the legacy participant list (inclusive)
     * @param _count  Number of participants to process
     */
    function migrateFrom(address _legacy, uint256 _start, uint256 _count) external onlyOwner {
        require(!migrationFinalized, "Migration finalized");

        (
            address[] memory wallets,
            string[] memory names,
            string[] memory xUsernames,
        ) = ILegacyQuizScores(_legacy).getLeaderboardBatch(_start, _count);

        for (uint256 i = 0; i < wallets.length; i++) {
            address wallet = wallets[i];

            if (profiles[wallet].registered) {
                emit MigrationSkipped(wallet, _legacy, SKIP_WALLET_EXISTS);
                continue;
            }

            bytes32 usernameHash = keccak256(abi.encodePacked(_toLower(xUsernames[i])));
            if (xUsernameTaken[usernameHash] != address(0)) {
                emit MigrationSkipped(wallet, _legacy, SKIP_X_USERNAME_TAKEN);
                continue;
            }

            _store(wallet, names[i], xUsernames[i], usernameHash);
            emit ProfileMigrated(wallet, _legacy);
        }
    }

    /**
     * @notice Permanently close migration and open registration.
     */
    function finalizeMigration() external onlyOwner {
        require(!migrationFinalized, "Migration finalized");
        migrationFinalized = true;
        emit MigrationFinalized();
    }

    // ============================================================
    // VIEW FUNCTIONS
    // ============================================================

    /**
     * @notice Check if an address has a profile.
     */
    function isRegistered(address _wallet) external view returns (bool) {
        return profiles[_wallet].registered;
    }

    /**
     * @notice Get a profile by wallet address.
     */
    function getProfile(address _wallet)
        external
        view
        returns (string memory name, string memory xUsername)
    {
        Profile storage p = profiles[_wallet];
        require(p.registered, "Profile not found");
        return (p.name, p.xUsername);
    }

    /**
     * @notice Resolve many wallets at once (leaderboards, feed cards).
     * @dev Unregistered wallets return empty strings and registered = false.
     */
    function getProfilesBatch(address[] calldata _wallets)
        external
        view
        returns (
            string[] memory names,
            string[] memory xUsernames,
            bool[] memory registered
        )
    {
        uint256 len = _wallets.length;
        names = new string[](len);
        xUsernames = new string[](len);
        registered = new bool[](len);

        for (uint256 i = 0; i < len; i++) {
            Profile storage p = profiles[_wallets[i]];
            names[i] = p.name;
            xUsernames[i] = p.xUsername;
            registered[i] = p.registered;
        }
    }

    /**
     * @notice Get total number of profiles.
     */
    function getProfileCount() external view returns (uint256) {
        return profileAddresses.length;
    }

    /**
     * @notice Enumerate profiles in registration order.
     * @param _start Start index (inclusive)
     * @param _count Number of profiles to read
     */
    function getProfilesPage(uint256 _start, uint256 _count)
        external
        view
        returns (
            address[] memory wallets,
            string[] memory names,
            string[] memory xUsernames
        )
    {
        uint256 total = profileAddresses.length;
        if (_start >= total) {
            return (new address[](0), new string[](0), new string[](0));
        }

        uint256 end = _start + _count;
        if (end > total) end = total;
        uint256 len = end - _start;

        wallets = new address[](len);
        names = new string[](len);
        xUsernames = new string[](len);

        for (uint256 i = 0; i < len; i++) {
            address addr = profileAddresses[_start + i];
            Profile storage p = profiles[addr];
            wallets[i] = addr;
            names[i] = p.name;
            xUsernames[i] = p.xUsername;
        }
    }

    // ============================================================
    // INTERNAL HELPERS
    // ============================================================

    function _store(
        address _wallet,
        string memory _name,
        string memory _xUsername,
        bytes32 _usernameHash
    ) internal {
        profiles[_wallet] = Profile({name: _name, xUsername: _xUsername, registered: true});
        xUsernameTaken[_usernameHash] = _wallet;
        profileAddresses.push(_wallet);
    }

    /**
     * @dev Convert a string to lowercase for case-insensitive username comparison.
     */
    function _toLower(string memory _str) internal pure returns (string memory) {
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
