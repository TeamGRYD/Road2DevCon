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

/// @dev Subset of an earlier ProfileRegistry deployment needed for migration
interface ILegacyProfileRegistry {
    function getProfilesPage(uint256 _start, uint256 _count)
        external
        view
        returns (
            address[] memory wallets,
            string[] memory names,
            string[] memory xUsernames
        );
}

/**
 * @title ProfileRegistry
 * @notice Single source of truth for participant profiles (name + X username)
 *         across all Road to DevCon events, quizzes and the Feed.
 * @dev Lifecycle:
 *      1. Deploy. Registration is closed.
 *      2. Owner calls migrateFromRegistry() for an earlier ProfileRegistry
 *         and/or migrateFrom() for each legacy QuizScores contract, newest
 *         first. Profile data is read on-chain from the source contract, so
 *         the owner cannot inject arbitrary profiles.
 *      3. Owner calls finalizeMigration(). Migration closes permanently,
 *         registration opens, and the owner has no further privileges.
 *      Registration supports gasless calls through the ERC-2771
 *      GaslessForwarder; direct calls from the participant's wallet still work.
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
    /// @notice ERC-2771 forwarder allowed to relay gasless calls
    address public immutable trustedForwarder;
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

    /// @param _trustedForwarder Deployed GaslessForwarder address (address(0) disables gasless calls)
    constructor(address _trustedForwarder) {
        owner = msg.sender;
        trustedForwarder = _trustedForwarder;
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
        address sender = _msgSender();
        require(migrationFinalized, "Registration not open yet");
        require(!profiles[sender].registered, "Already registered");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_name).length <= 64, "Name too long");
        require(bytes(_xUsername).length > 0, "X username required");
        require(bytes(_xUsername).length <= 32, "X username too long");

        bytes32 usernameHash = keccak256(abi.encodePacked(_toLower(_xUsername)));
        require(xUsernameTaken[usernameHash] == address(0), "X username already taken");

        _store(sender, _name, _xUsername, usernameHash);
        emit ProfileRegistered(sender, _name, _xUsername);
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

        _migrate(_legacy, wallets, names, xUsernames);
    }

    /**
     * @notice Copy profiles from an earlier ProfileRegistry deployment.
     * @dev Same skip rules as migrateFrom(). Safe to re-run over the same range.
     * @param _oldRegistry Earlier ProfileRegistry address
     * @param _start       Start index in its profile list (inclusive)
     * @param _count       Number of profiles to process
     */
    function migrateFromRegistry(address _oldRegistry, uint256 _start, uint256 _count) external onlyOwner {
        require(!migrationFinalized, "Migration finalized");

        (
            address[] memory wallets,
            string[] memory names,
            string[] memory xUsernames
        ) = ILegacyProfileRegistry(_oldRegistry).getProfilesPage(_start, _count);

        _migrate(_oldRegistry, wallets, names, xUsernames);
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
     * @notice ERC-2771: whether `_forwarder` may relay calls for participants.
     */
    function isTrustedForwarder(address _forwarder) public view returns (bool) {
        return _forwarder != address(0) && _forwarder == trustedForwarder;
    }

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

    /**
     * @dev ERC-2771: the participant is appended to the calldata when the
     *      call comes through the trusted forwarder.
     */
    function _msgSender() internal view returns (address) {
        if (isTrustedForwarder(msg.sender) && msg.data.length >= 20) {
            return address(bytes20(msg.data[msg.data.length - 20:]));
        }
        return msg.sender;
    }

    function _migrate(
        address _source,
        address[] memory _wallets,
        string[] memory _names,
        string[] memory _xUsernames
    ) internal {
        for (uint256 i = 0; i < _wallets.length; i++) {
            address wallet = _wallets[i];

            if (profiles[wallet].registered) {
                emit MigrationSkipped(wallet, _source, SKIP_WALLET_EXISTS);
                continue;
            }

            bytes32 usernameHash = keccak256(abi.encodePacked(_toLower(_xUsernames[i])));
            if (xUsernameTaken[usernameHash] != address(0)) {
                emit MigrationSkipped(wallet, _source, SKIP_X_USERNAME_TAKEN);
                continue;
            }

            _store(wallet, _names[i], _xUsernames[i], usernameHash);
            emit ProfileMigrated(wallet, _source);
        }
    }

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
