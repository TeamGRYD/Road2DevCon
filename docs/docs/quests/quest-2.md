---
sidebar_position: 3
title: "Quest 2: Private Voting"
---

# 🗳️ Quest 2: Build a Secure Private Voting Contract

> Based on Presentations 3 & 4 — Privacy & Security

**Difficulty:** Beginner to Intermediate | **Duration:** ~50 minutes

## Overview

In this quest, you'll build a voting smart contract that uses the **commit-reveal scheme** for privacy and implements security best practices. Voters hash their vote to keep it secret during voting, then reveal it after everyone has committed. You'll apply the Checks-Effects-Interactions pattern, access control, and input validation — the security patterns from Presentation 4.

## Prerequisites

- Completed [Workshop Quest 1](/quests/quest-1) (or comfortable with Remix + MetaMask)
- MetaMask connected to Sepolia with some test ETH
- Basic understanding of Solidity from Quest 1

## Tools

| Tool | Description | Link |
|------|-------------|------|
| Remix IDE | Browser-based development environment | [remix.ethereum.org](https://remix.ethereum.org) |
| Keccak256 Hash Tool | Online tool to compute keccak256 hashes | [emn178.github.io](https://emn178.github.io/online-tools/keccak_256.html) |
| Sepolia Etherscan | Verify transactions and contract state | [sepolia.etherscan.io](https://sepolia.etherscan.io) |

---

## Step 1: Understand Commit-Reveal Voting

**The problem with simple on-chain voting:**

If you just store votes directly (`vote(1)`), everyone can see how you voted because blockchain transactions are public. This enables:

- Voter coercion ("I can see you voted against me!")
- Strategic voting (waiting to see how others vote before deciding)
- Vote buying (proving how you voted to get paid)

**The solution: Commit-Reveal**

1. **Commit phase**: You hash your vote with a secret password → `keccak256(vote + secret)` → Submit the hash. Nobody can see your actual vote — they only see a random-looking hash.
2. **Reveal phase**: After everyone has committed, you reveal your original vote and secret. The contract verifies that `keccak256(vote + secret)` matches your committed hash. If it matches, your vote is counted.

:::info Privacy in Action
The commit-reveal scheme ensures your vote is hidden during the voting period, just like a sealed ballot box.
:::

## Step 2: Create the Voting Contract

1. Open [Remix IDE](https://remix.ethereum.org)
2. Create a new file: `SecureVote.sol`
3. Paste the following code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title SecureVote
/// @notice A voting contract demonstrating commit-reveal
///         privacy and security best practices.
/// @dev Applies: Checks-Effects-Interactions, access
///      control, input validation, state machine pattern.
contract SecureVote {

    // =================== STATE ===================

    // Voting phases - a state machine pattern
    enum Phase { Commit, Reveal, Finished }

    struct Voter {
        bytes32 commitment;   // Hash of (vote + secret)
        bool hasCommitted;
        bool hasRevealed;
        uint8 vote;           // 1 or 2 (revealed vote)
    }

    address public admin;           // The vote organizer
    string public question;         // What are we voting on?
    string public option1;          // First option
    string public option2;          // Second option

    Phase public currentPhase;

    mapping(address => Voter) public voters;
    address[] public voterList;

    uint256 public option1Votes;
    uint256 public option2Votes;
    uint256 public commitDeadline;
    uint256 public revealDeadline;

    // =================== EVENTS ===================

    event VoteCommitted(address indexed voter);
    event VoteRevealed(address indexed voter, uint8 vote);
    event PhaseChanged(Phase newPhase);
    event ResultsFinalized(uint256 option1Votes, uint256 option2Votes);

    // =================== MODIFIERS (Access Control) ===================

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this");
        _;
    }

    modifier onlyDuringCommit() {
        require(currentPhase == Phase.Commit, "Not in commit phase");
        require(block.timestamp <= commitDeadline, "Commit phase expired");
        _;
    }

    modifier onlyDuringReveal() {
        require(currentPhase == Phase.Reveal, "Not in reveal phase");
        require(block.timestamp <= revealDeadline, "Reveal phase expired");
        _;
    }

    // =================== CONSTRUCTOR ===================

    /// @notice Create a new vote with a question and two options.
    /// @param _question The question being voted on
    /// @param _option1  The first option
    /// @param _option2  The second option
    /// @param _commitMinutes Duration of commit phase in minutes
    /// @param _revealMinutes Duration of reveal phase in minutes
    constructor(
        string memory _question,
        string memory _option1,
        string memory _option2,
        uint256 _commitMinutes,
        uint256 _revealMinutes
    ) {
        // INPUT VALIDATION - Security pattern!
        require(bytes(_question).length > 0, "Question required");
        require(bytes(_option1).length > 0, "Option 1 required");
        require(bytes(_option2).length > 0, "Option 2 required");
        require(_commitMinutes > 0, "Commit phase must be > 0");
        require(_revealMinutes > 0, "Reveal phase must be > 0");

        admin = msg.sender;
        question = _question;
        option1 = _option1;
        option2 = _option2;
        currentPhase = Phase.Commit;
        commitDeadline = block.timestamp + (_commitMinutes * 1 minutes);
        revealDeadline = commitDeadline + (_revealMinutes * 1 minutes);
    }

    // =================== COMMIT PHASE ===================

    /// @notice Submit your hashed vote (commit).
    /// @dev Hash = keccak256(abi.encodePacked(vote, secret))
    ///      where vote is 1 or 2, and secret is any string.
    /// @param _commitment The keccak256 hash of your vote + secret
    function commitVote(bytes32 _commitment) external onlyDuringCommit {
        // CHECKS
        require(!voters[msg.sender].hasCommitted, "Already committed");
        require(_commitment != bytes32(0), "Invalid commitment");

        // EFFECTS (state update BEFORE any external interaction)
        voters[msg.sender].commitment = _commitment;
        voters[msg.sender].hasCommitted = true;
        voterList.push(msg.sender);

        // INTERACTIONS (none needed here - no external calls)
        emit VoteCommitted(msg.sender);
    }

    // =================== PHASE TRANSITION ===================

    /// @notice Move from Commit to Reveal phase.
    ///         Anyone can call this after commit deadline.
    function startRevealPhase() external {
        require(currentPhase == Phase.Commit, "Not in commit phase");
        require(block.timestamp > commitDeadline, "Commit phase not over yet");
        currentPhase = Phase.Reveal;
        emit PhaseChanged(Phase.Reveal);
    }

    // =================== REVEAL PHASE ===================

    /// @notice Reveal your vote by providing the original vote and secret.
    /// @param _vote   Your vote (1 or 2)
    /// @param _secret The secret string you used when committing
    function revealVote(uint8 _vote, string calldata _secret) external onlyDuringReveal {
        Voter storage v = voters[msg.sender];

        // CHECKS
        require(v.hasCommitted, "You did not commit a vote");
        require(!v.hasRevealed, "Already revealed");
        require(_vote == 1 || _vote == 2, "Vote must be 1 or 2");

        // Verify the hash matches the commitment
        bytes32 expectedHash = keccak256(abi.encodePacked(_vote, _secret));
        require(expectedHash == v.commitment, "Hash does not match commitment");

        // EFFECTS
        v.hasRevealed = true;
        v.vote = _vote;

        if (_vote == 1) {
            option1Votes++;
        } else {
            option2Votes++;
        }

        // INTERACTIONS
        emit VoteRevealed(msg.sender, _vote);
    }

    // =================== FINALIZE ===================

    /// @notice Finalize voting after reveal deadline.
    function finalize() external {
        require(currentPhase == Phase.Reveal, "Not in reveal phase");
        require(block.timestamp > revealDeadline, "Reveal phase not over yet");
        currentPhase = Phase.Finished;
        emit PhaseChanged(Phase.Finished);
        emit ResultsFinalized(option1Votes, option2Votes);
    }

    // =================== VIEW FUNCTIONS ===================

    /// @notice Get the current results.
    function getResults() external view returns (
        string memory q,
        string memory opt1,
        string memory opt2,
        uint256 votes1,
        uint256 votes2,
        Phase phase
    ) {
        return (question, option1, option2, option1Votes, option2Votes, currentPhase);
    }

    /// @notice Get total number of committed voters.
    function getVoterCount() external view returns (uint256) {
        return voterList.length;
    }

    /// @notice Helper: Compute the hash for a given vote and secret.
    /// @dev Use this to generate your commitment!
    function computeCommitment(uint8 _vote, string calldata _secret)
        external pure returns (bytes32)
    {
        require(_vote == 1 || _vote == 2, "Vote must be 1 or 2");
        return keccak256(abi.encodePacked(_vote, _secret));
    }
}
```

:::info Security Patterns in the Code
Notice the `onlyAdmin`, `onlyDuringCommit`, `onlyDuringReveal` modifiers (access control), `require` statements (input validation), and Checks-Effects-Interactions ordering throughout.
:::

## Step 3: Compile & Deploy

1. Click the **Solidity Compiler** tab → Select compiler **0.8.19+**
2. Click **"Compile SecureVote.sol"**: should compile with ✅
3. Go to **Deploy & Run Transactions** tab
4. Select **"Injected Provider - MetaMask"** (make sure you're on Sepolia)
5. Expand the deploy parameters and fill in:
   - `_question`: `"Should Ethereum focus more on scaling or privacy?"`
   - `_option1`: `"Scaling"`
   - `_option2`: `"Privacy"`
   - `_commitMinutes`: `10` (10 minutes to commit)
   - `_revealMinutes`: `10` (10 minutes to reveal)
6. Click **"Deploy"** → Confirm in MetaMask
7. Wait for deployment confirmation

:::tip
Save the contract address and share it with your table mates so they can vote too!

**Note on timing**: For the workshop, we use 10-minute phases. In a real election, these would be hours or days.
:::

## Step 4: Commit Your Vote (Privacy Phase)

Now let's vote! First, you need to create your commitment hash.

**Generate your commitment hash:**

1. In the Deployed Contract section, find the `computeCommitment` function
2. Enter your vote:
   - `_vote`: `1` (for Scaling) or `2` (for Privacy)
   - `_secret`: Any secret string, e.g., `"my-secret-password-123"`
3. Click `computeCommitment` → It returns a `bytes32` hash
4. **Copy this hash**: this is your commitment

**Submit your commitment:**

1. Find the `commitVote` function
2. Paste your commitment hash
3. Click `commitVote` → Confirm in MetaMask

:::caution Important
Remember your vote (1 or 2) AND your secret! You'll need both to reveal your vote.
:::

**Privacy check**: Look at the transaction on Etherscan. Can anyone see how you voted? **No!** They can only see a random-looking hash.

## Step 5: Reveal Your Vote

After the commit deadline passes (10 minutes), anyone can start the reveal phase.

**Transition to reveal phase:**

1. After 10 minutes, click `startRevealPhase` → Confirm in MetaMask
2. Check `currentPhase` — it should now return `1` (Reveal)

**Reveal your vote:**

1. Find the `revealVote` function
2. Enter:
   - `_vote`: The same vote you used when committing (1 or 2)
   - `_secret`: The same secret string you used
3. Click `revealVote` → Confirm in MetaMask

- ✅ If the hash matches, your vote is counted!
- ❌ If you enter the wrong vote or wrong secret, the transaction will REVERT — proving you can't change your vote after committing.

**Check the results:**

- Click `getResults` to see the current vote tally
- Click `option1Votes` and `option2Votes` to see individual counts

## Step 6: Security Analysis — "Break It" Challenge

Now let's think like an attacker! 🔴

**Challenge**: Discuss with your table mates — what would happen if we REMOVED each security pattern?

| Pattern Removed | What Goes Wrong | Principle Violated |
|----------------|----------------|-------------------|
| `onlyDuringCommit` modifier | People commit during reveal, vote strategically | Access Control |
| Hash verification in `revealVote` | Commit hash of vote "1" but reveal vote "2" | Input Validation |
| Checks-Effects-Interactions order | Reentrancy, inflated votes | CEI Pattern |
| `require(!v.hasRevealed)` check | Same person reveals multiple times | State Management |

:::warning Key Takeaway
Every `require` statement and every modifier exists for a specific security reason. Removing ANY of them creates a vulnerability.
:::

## Step 7: Reflect & Discuss

**Congratulations!** You've built a privacy-preserving, secure voting contract! 🎉

**Discussion questions:**

1. **How does commit-reveal compare to real-world sealed ballot voting?**
   Both hide individual votes until counting time. Commit-reveal is the digital equivalent.

2. **What's the weakness of commit-reveal?**
   If a voter doesn't reveal, their vote is lost. In a real system, you'd need incentive mechanisms (like requiring a deposit).

3. **How would Zero-Knowledge proofs improve this?**
   ZK proofs could let you verify a vote without ever revealing it — true end-to-end privacy, not just delayed revelation.

4. **Could this contract be used for a real election?**
   Not directly — it lacks identity verification, sybil resistance, and sophisticated ZK privacy. But it demonstrates the core concepts!

---

## 🏆 Bonus Challenges

- Add a `deposit` requirement: voters must stake 0.001 ETH to commit, which they get back when they reveal (incentivizes revealing)
- Add multiple options (not just 2)
- Add an `emergencyStop` function that only the admin can call (discuss: is this centralization?)

## Related Resources

- [Presentation 3: Privacy on Ethereum](/presentations/privacy)
- [Presentation 4: Security in Smart Contracts](/presentations/security)
- [Commit-Reveal Pattern](https://medium.com/coinmonks/commit-reveal-scheme-in-solidity-c06eba032240)
- [OpenZeppelin ReentrancyGuard](https://docs.openzeppelin.com/contracts/5.x/api/utils#ReentrancyGuard)
- [Solidity Security Considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)
