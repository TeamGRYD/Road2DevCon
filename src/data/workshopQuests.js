export const workshopQuests = [
  {
    id: 1,
    title: 'Build a Censorship-Resistant Open-Source Message Board',
    subtitle: 'Based on Presentations 1 & 2 - Censorship Resistance & Open Source',
    time: '12:15 PM – 1:05 PM',
    color: '#06b6d4',
    colorSecondary: '#f97316',
    icon: '📝',
    difficulty: 'Beginner',
    duration: '~50 minutes',
    overview: `In this quest, you'll deploy your very first smart contract to a real Ethereum testnet! You'll build a message board where anyone can post messages that can never be deleted, censored, or modified - demonstrating the power of censorship resistance. You'll also verify your contract's source code on Etherscan, making it fully open source.`,
    prerequisites: [
      'A laptop with a modern browser (Chrome or Brave recommended)',
      'MetaMask browser extension installed (metamask.io)',
      'Some Sepolia test ETH (we\'ll get this in Step 1)'
    ],
    tools: [
      { name: 'MetaMask', url: 'https://metamask.io', desc: 'Your Ethereum wallet - browser extension' },
      { name: 'Remix IDE', url: 'https://remix.ethereum.org', desc: 'Browser-based smart contract development environment' },
      { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io', desc: 'Block explorer to view your deployed contracts' },
      { name: 'Sepolia Faucet', url: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia', desc: 'Get free test ETH for Sepolia' }
    ],
    steps: [
      {
        title: 'Step 1: Set Up MetaMask & Get Test ETH',
        content: `**If you don't have MetaMask:**
1. Go to [metamask.io](https://metamask.io) and install the browser extension
2. Create a new wallet - **save your seed phrase securely!**
3. Click the network dropdown (top-left) → "Show test networks" → Select **Sepolia**

**Get free test ETH:**
1. Go to [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
2. Paste your MetaMask wallet address
3. Request Sepolia ETH (you'll receive 0.05 ETH - more than enough!)
4. Wait ~30 seconds for the ETH to appear in your MetaMask

> 💡 **Alternative faucets** if Google's is busy: [sepolia-faucet.pk910.de](https://sepolia-faucet.pk910.de) or [Alchemy Sepolia Faucet](https://sepoliafaucet.com)

**Verify**: You should see a non-zero ETH balance on Sepolia network in MetaMask.`
      },
      {
        title: 'Step 2: Open Remix IDE & Create Your Contract',
        content: `1. Open [remix.ethereum.org](https://remix.ethereum.org) in your browser
2. In the file explorer (left panel), click the 📄 icon to create a new file
3. Name it: \`MessageBoard.sol\`
4. Paste the following code:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title CensorshipResistantMessageBoard
/// @notice A message board where messages can never be
///         deleted, modified, or censored - once posted, 
///         they exist forever on the Ethereum blockchain.
contract MessageBoard {
    
    struct Message {
        address author;      // Who posted the message
        string content;      // The message text
        uint256 timestamp;   // When it was posted (Unix time)
    }
    
    // All messages ever posted - stored permanently on-chain
    Message[] public messages;
    
    // Event emitted when a new message is posted
    event MessagePosted(
        uint256 indexed messageId,
        address indexed author,
        string content,
        uint256 timestamp
    );
    
    /// @notice Post a new message to the board.
    /// @dev Anyone can call this - no access restrictions!
    ///      This is what makes it censorship-resistant.
    /// @param _content The message to post
    function postMessage(string calldata _content) external {
        require(bytes(_content).length > 0, "Message cannot be empty");
        require(bytes(_content).length <= 500, "Message too long (max 500 chars)");
        
        uint256 id = messages.length;
        messages.push(Message({
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp
        }));
        
        emit MessagePosted(id, msg.sender, _content, block.timestamp);
    }
    
    /// @notice Get the total number of messages posted.
    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }
    
    /// @notice Get a specific message by its ID.
    function getMessage(uint256 _id) external view returns (
        address author,
        string memory content,
        uint256 timestamp
    ) {
        require(_id < messages.length, "Message does not exist");
        Message storage m = messages[_id];
        return (m.author, m.content, m.timestamp);
    }
    
    /// @notice Get the most recent N messages.
    /// @param _count Number of recent messages to retrieve
    function getRecentMessages(uint256 _count) external view returns (Message[] memory) {
        uint256 total = messages.length;
        if (_count > total) _count = total;
        
        Message[] memory recent = new Message[](_count);
        for (uint256 i = 0; i < _count; i++) {
            recent[i] = messages[total - _count + i];
        }
        return recent;
    }
}
\`\`\`

> 💡 **Read the code!** Notice there's no \`onlyOwner\`, no \`delete\` function, no \`admin\` role. Anyone can post, and NO ONE can remove messages. This is censorship resistance in code.`
      },
      {
        title: 'Step 3: Compile the Contract',
        content: `1. In Remix, click the **Solidity Compiler** tab (left sidebar - the "S" icon)
2. Set the compiler version to **0.8.19** or higher (any 0.8.x works)
3. Click **"Compile MessageBoard.sol"**
4. You should see a ✅ green checkmark - no errors!

> ⚠️ **If you get errors**: Make sure the compiler version matches the \`pragma solidity ^0.8.19;\` in your code. The version in the dropdown should be 0.8.19 or higher.`
      },
      {
        title: 'Step 4: Deploy to Sepolia Testnet',
        content: `1. Click the **Deploy & Run Transactions** tab (left sidebar - the Ethereum icon)
2. In the **"ENVIRONMENT"** dropdown, select **"Injected Provider - MetaMask"**
3. MetaMask will pop up - make sure you're on **Sepolia Test Network**
4. Your account address and balance should appear in Remix
5. Make sure **"MessageBoard"** is selected in the contract dropdown
6. Click **"Deploy"** 🚀
7. MetaMask pops up - click **"Confirm"** to approve the transaction
8. Wait ~15-30 seconds for the transaction to be confirmed

**Your contract is now permanently deployed on the Ethereum Sepolia testnet!** 🎉

> 📋 **Copy the contract address** from the "Deployed Contracts" section at the bottom of the Deploy panel. You'll need this for the next steps!`
      },
      {
        title: 'Step 5: Interact with Your Message Board',
        content: `In the **Deployed Contracts** section at the bottom of Remix:

1. **Post your first message:**
   - Expand the contract functions
   - Find \`postMessage\`
   - Type a message in the input field (e.g., "Hello DevCon 8! 🇮🇳")
   - Click \`postMessage\` → Confirm in MetaMask
   - Wait for the transaction to confirm

2. **Read your message:**
   - Click \`getMessageCount\` → Should return \`1\`
   - Enter \`0\` in \`getMessage\` → Click it → See your message!
   - Notice the \`author\` address matches YOUR wallet address

3. **Post more messages:**
   - Post 2-3 more messages
   - Ask your neighbor to use YOUR contract address to post a message from THEIR wallet
   - See how multiple authors can contribute!

> 🤔 **Discussion point**: Can you find a function to DELETE a message? No! That's the point - once posted, these messages are permanent and uncensorable.`
      },
      {
        title: 'Step 6: View on Etherscan (Open Source Verification)',
        content: `1. Go to [sepolia.etherscan.io](https://sepolia.etherscan.io)
2. Paste your **contract address** in the search bar
3. You'll see:
   - The creation transaction
   - All messages posted (as transactions)
   - The contract's bytecode

**Verify your source code (make it open source!):**
1. On the contract page, click **"Contract"** tab → **"Verify and Publish"**
2. Select:
   - Compiler Type: **Solidity (Single file)**
   - Compiler Version: **v0.8.19** (match what you used in Remix)
   - License: **MIT**
3. Paste your Solidity source code
4. Click **"Verify and Publish"**

🎉 Your contract is now **open source**: anyone in the world can read the source code and verify it does exactly what it claims!

> 💡 **This is the Open Source principle in action**: Trust through transparency. Anyone can inspect the code and verify there are no hidden admin functions or backdoors.`
      },
      {
        title: 'Step 7: Reflect & Discuss',
        content: `**You've just built a censorship-resistant, open-source application!** 🎉

**Discussion questions for your table:**
1. What would happen if a government ordered this message board taken down?
   - *Answer: The smart contract would keep running. It's deployed on 900,000+ validators worldwide.*
2. How is this different from posting on Twitter/X or Instagram?
   - *Answer: Those platforms can delete your posts, ban your account, or shadow-ban you. This message board has no admin.*
3. What are the downsides of a censorship-resistant message board?
   - *Answer: Spam, harmful content, illegal content - all become permanent too. This is the fundamental tension of censorship resistance.*
4. Why is open-source verification important?
   - *Answer: Without seeing the source code, you'd have to trust that the bytecode doesn't have hidden functions. Verification lets anyone audit the code.*

**🏆 Bonus challenge**: Modify the contract to add an \`upvote\` function that lets users upvote messages (track upvote count per message). Can you do it without adding any way to remove messages?`
      }
    ]
  },
  {
    id: 2,
    title: 'Build a Secure Private Voting Contract',
    subtitle: 'Based on Presentations 3 & 4 - Privacy & Security',
    time: '2:40 PM – 3:30 PM',
    color: '#a855f7',
    colorSecondary: '#10b981',
    icon: '🗳️',
    difficulty: 'Beginner to Intermediate',
    duration: '~50 minutes',
    overview: `In this quest, you'll build a voting smart contract that uses the commit-reveal scheme for privacy and implements security best practices. Voters hash their vote to keep it secret during voting, then reveal it after everyone has committed. You'll apply the Checks-Effects-Interactions pattern, access control, and input validation - the security patterns from Presentation 4.`,
    prerequisites: [
      'Completed Workshop Quest 1 (or comfortable with Remix + MetaMask)',
      'MetaMask connected to Sepolia with some test ETH',
      'Basic understanding of Solidity from Quest 1'
    ],
    tools: [
      { name: 'Remix IDE', url: 'https://remix.ethereum.org', desc: 'We\'ll continue using Remix' },
      { name: 'Keccak256 Hash Tool', url: 'https://emn178.github.io/online-tools/keccak_256.html', desc: 'Online tool to compute keccak256 hashes (for commit phase)' },
      { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io', desc: 'Verify transactions and contract state' }
    ],
    steps: [
      {
        title: 'Step 1: Understand Commit-Reveal Voting',
        content: `**The problem with simple on-chain voting:**
If you just store votes directly (\`vote(1)\`), everyone can see how you voted because blockchain transactions are public. This enables:
- Voter coercion ("I can see you voted against me!")
- Strategic voting (waiting to see how others vote before deciding)
- Vote buying (proving how you voted to get paid)

**The solution: Commit-Reveal**
1. **Commit phase**: You hash your vote with a secret password → \`keccak256(vote + secret)\` → Submit the hash
   - Nobody can see your actual vote - they only see a random-looking hash
2. **Reveal phase**: After everyone has committed, you reveal your original vote and secret
   - The contract verifies that \`keccak256(vote + secret)\` matches your committed hash
   - If it matches, your vote is counted

> 💡 **This is the Privacy principle in action**: The commit-reveal scheme ensures your vote is hidden during the voting period, just like a sealed ballot box.`
      },
      {
        title: 'Step 2: Create the Voting Contract',
        content: `1. Open [Remix IDE](https://remix.ethereum.org)
2. Create a new file: \`SecureVote.sol\`
3. Paste the following code:

\`\`\`solidity
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
\`\`\`

> 💡 **Read the code carefully!** Notice the security patterns: \`onlyAdmin\`, \`onlyDuringCommit\`, \`onlyDuringReveal\` modifiers (access control), \`require\` statements (input validation), and Checks-Effects-Interactions ordering.`
      },
      {
        title: 'Step 3: Compile & Deploy',
        content: `1. Click the **Solidity Compiler** tab → Select compiler **0.8.19**+
2. Click **"Compile SecureVote.sol"**: should compile with ✅
3. Go to **Deploy & Run Transactions** tab
4. Select **"Injected Provider - MetaMask"** (make sure you're on Sepolia)
5. Expand the deploy parameters and fill in:
   - \`_question\`: \`"Should Ethereum focus more on scaling or privacy?"\`
   - \`_option1\`: \`"Scaling"\`
   - \`_option2\`: \`"Privacy"\`
   - \`_commitMinutes\`: \`10\` (10 minutes to commit)
   - \`_revealMinutes\`: \`10\` (10 minutes to reveal)
6. Click **"Deploy"** → Confirm in MetaMask
7. Wait for deployment confirmation

> 📋 **Save the contract address!** Share it with your table mates so they can vote too.
>
> ⏰ **Note on timing**: For the workshop, we use 10-minute phases. In a real election, these would be hours or days.`
      },
      {
        title: 'Step 4: Commit Your Vote (Privacy Phase)',
        content: `Now let's vote! First, you need to create your commitment hash.

**Generate your commitment hash:**
1. In the Deployed Contract section, find the \`computeCommitment\` function
2. Enter your vote:
   - \`_vote\`: \`1\` (for Scaling) or \`2\` (for Privacy)
   - \`_secret\`: Any secret string, e.g., \`"my-secret-password-123"\`
3. Click \`computeCommitment\` → It returns a \`bytes32\` hash
4. **Copy this hash**: this is your commitment

**Submit your commitment:**
1. Find the \`commitVote\` function
2. Paste your commitment hash
3. Click \`commitVote\` → Confirm in MetaMask

> 🔒 **Privacy check**: Look at the transaction on Etherscan. Can anyone see how you voted? **No!** They can only see a random-looking hash. Your actual vote is hidden until the reveal phase.
>
> 📝 **IMPORTANT**: Remember your vote (1 or 2) AND your secret! You'll need both to reveal your vote.`
      },
      {
        title: 'Step 5: Reveal Your Vote',
        content: `After the commit deadline passes (10 minutes), anyone can start the reveal phase.

**Transition to reveal phase:**
1. After 10 minutes, click \`startRevealPhase\` → Confirm in MetaMask
2. Check \`currentPhase\` - it should now return \`1\` (Reveal)

**Reveal your vote:**
1. Find the \`revealVote\` function
2. Enter:
   - \`_vote\`: The same vote you used when committing (1 or 2)
   - \`_secret\`: The same secret string you used
3. Click \`revealVote\` → Confirm in MetaMask

> ✅ If the hash matches, your vote is counted!
> ❌ If you enter the wrong vote or wrong secret, the transaction will REVERT - proving you can't change your vote after committing.

**Check the results:**
- Click \`getResults\` to see the current vote tally
- Click \`option1Votes\` and \`option2Votes\` to see individual counts

> 💡 **This is Privacy in action**: Nobody could see your vote during the commit phase. Only after everyone committed (sealed ballot box) were votes revealed.`
      },
      {
        title: 'Step 6: Security Analysis - "Break It" Challenge',
        content: `Now let's think like an attacker! 🔴

**Challenge**: Discuss with your table mates - what would happen if we REMOVED each security pattern?

**1. Remove \`onlyDuringCommit\` modifier:**
- ❌ People could commit votes during the reveal phase
- ❌ They could see other revealed votes and then commit strategically
- **Security principle violated**: Access Control

**2. Remove the hash verification in \`revealVote\`:**
- ❌ People could commit hash of vote "1" but reveal vote "2"
- ❌ Votes would be meaningless - anyone could claim any vote
- **Security principle violated**: Input Validation

**3. Swap the order - do external calls BEFORE state updates:**
- ❌ Potential for reentrancy attacks
- ❌ An attacker could reveal multiple times and inflate votes
- **Security principle violated**: Checks-Effects-Interactions

**4. Remove the \`require(!v.hasRevealed)\` check:**
- ❌ Same person could reveal their vote multiple times
- ❌ One person gets multiple votes!
- **Security principle violated**: State Management

> 🛡️ **Key takeaway**: Every \`require\` statement and every modifier exists for a specific security reason. Removing ANY of them creates a vulnerability.`
      },
      {
        title: 'Step 7: Reflect & Discuss',
        content: `**Congratulations!** You've built a privacy-preserving, secure voting contract! 🎉

**Discussion questions:**
1. **How does commit-reveal compare to real-world sealed ballot voting?**
   - *Both hide individual votes until counting time. Commit-reveal is the digital equivalent.*

2. **What's the weakness of commit-reveal?**
   - *If a voter doesn't reveal, their vote is lost. In a real system, you'd need incentive mechanisms (like requiring a deposit).*

3. **How would Zero-Knowledge proofs improve this?**
   - *ZK proofs could let you verify a vote without ever revealing it - true end-to-end privacy, not just delayed revelation.*

4. **What security pattern was most surprising to learn about?**
   - *Discuss: Checks-Effects-Interactions, reentrancy guards, access control modifiers.*

5. **Could this contract be used for a real election?**
   - *Not directly - it lacks identity verification, sybil resistance, and sophisticated ZK privacy. But it demonstrates the core concepts!*

**🏆 Bonus challenges:**
- Add a \`deposit\` requirement: voters must stake 0.001 ETH to commit, which they get back when they reveal (incentivizes revealing)
- Add multiple options (not just 2)
- Add an \`emergencyStop\` function that only the admin can call (discuss: is this centralization?)`
      }
    ]
  }
];
