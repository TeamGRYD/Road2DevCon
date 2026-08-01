---
sidebar_position: 2
title: "Quest 1: Message Board"
---

# 📝 Quest 1: Build a Censorship-Resistant Open-Source Message Board

> Based on Presentations 1 & 2 — Censorship Resistance & Open Source

**Difficulty:** Beginner | **Duration:** ~50 minutes

## Overview

In this quest, you'll deploy your very first smart contract to a real Ethereum testnet! You'll build a message board where anyone can post messages that can never be deleted, censored, or modified — demonstrating the power of censorship resistance. You'll also verify your contract's source code on Etherscan, making it fully open source.

## Prerequisites

- A laptop with a modern browser (Chrome or Brave recommended)
- MetaMask browser extension installed ([metamask.io](https://metamask.io))
- Some Sepolia test ETH (we'll get this in Step 1)

## Tools

| Tool | Description | Link |
|------|-------------|------|
| MetaMask | Your Ethereum wallet | [metamask.io](https://metamask.io) |
| Remix IDE | Browser-based development environment | [remix.ethereum.org](https://remix.ethereum.org) |
| Sepolia Etherscan | Block explorer for Sepolia testnet | [sepolia.etherscan.io](https://sepolia.etherscan.io) |
| Sepolia Faucet | Get free test ETH | [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) |

---

## Step 1: Set Up MetaMask & Get Test ETH

**If you don't have MetaMask:**

1. Go to [metamask.io](https://metamask.io) and install the browser extension
2. Create a new wallet — **save your seed phrase securely!**
3. Click the network dropdown (top-left) → "Show test networks" → Select **Sepolia**

**Get free test ETH:**

1. Go to [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
2. Paste your MetaMask wallet address
3. Request Sepolia ETH (you'll receive 0.05 ETH — more than enough!)
4. Wait ~30 seconds for the ETH to appear in your MetaMask

:::tip Alternative Faucets
If Google's faucet is busy: [sepolia-faucet.pk910.de](https://sepolia-faucet.pk910.de) or [Alchemy Sepolia Faucet](https://sepoliafaucet.com)
:::

**Verify**: You should see a non-zero ETH balance on Sepolia network in MetaMask.

## Step 2: Open Remix IDE & Create Your Contract

1. Open [remix.ethereum.org](https://remix.ethereum.org) in your browser
2. In the file explorer (left panel), click the 📄 icon to create a new file
3. Name it: `MessageBoard.sol`
4. Paste the following code:

```solidity
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
```

:::info Read the Code!
Notice there's no `onlyOwner`, no `delete` function, no `admin` role. Anyone can post, and NO ONE can remove messages. This is censorship resistance in code.
:::

## Step 3: Compile the Contract

1. In Remix, click the **Solidity Compiler** tab (left sidebar — the "S" icon)
2. Set the compiler version to **0.8.19** or higher (any 0.8.x works)
3. Click **"Compile MessageBoard.sol"**
4. You should see a ✅ green checkmark — no errors!

:::warning If you get errors
Make sure the compiler version matches the `pragma solidity ^0.8.19;` in your code. The version in the dropdown should be 0.8.19 or higher.
:::

## Step 4: Deploy to Sepolia Testnet

1. Click the **Deploy & Run Transactions** tab (left sidebar — the Ethereum icon)
2. In the **"ENVIRONMENT"** dropdown, select **"Injected Provider - MetaMask"**
3. MetaMask will pop up — make sure you're on **Sepolia Test Network**
4. Your account address and balance should appear in Remix
5. Make sure **"MessageBoard"** is selected in the contract dropdown
6. Click **"Deploy"** 🚀
7. MetaMask pops up — click **"Confirm"** to approve the transaction
8. Wait ~15-30 seconds for the transaction to be confirmed

**Your contract is now permanently deployed on the Ethereum Sepolia testnet!** 🎉

:::tip Save the Contract Address
Copy the contract address from the "Deployed Contracts" section at the bottom of the Deploy panel. You'll need this for the next steps!
:::

## Step 5: Interact with Your Message Board

In the **Deployed Contracts** section at the bottom of Remix:

**Post your first message:**

1. Expand the contract functions
2. Find `postMessage`
3. Type a message in the input field (e.g., "Hello DevCon 8! 🇮🇳")
4. Click `postMessage` → Confirm in MetaMask
5. Wait for the transaction to confirm

**Read your message:**

1. Click `getMessageCount` → Should return `1`
2. Enter `0` in `getMessage` → Click it → See your message!
3. Notice the `author` address matches YOUR wallet address

**Post more messages:**

1. Post 2-3 more messages
2. Ask your neighbor to use YOUR contract address to post a message from THEIR wallet
3. See how multiple authors can contribute!

:::note Discussion Point
Can you find a function to DELETE a message? No! That's the point — once posted, these messages are permanent and uncensorable.
:::

## Step 6: View on Etherscan (Open Source Verification)

1. Go to [sepolia.etherscan.io](https://sepolia.etherscan.io)
2. Paste your **contract address** in the search bar
3. You'll see the creation transaction, all messages posted (as transactions), and the contract's bytecode

**Verify your source code (make it open source!):**

1. On the contract page, click **"Contract"** tab → **"Verify and Publish"**
2. Select:
   - Compiler Type: **Solidity (Single file)**
   - Compiler Version: **v0.8.19** (match what you used in Remix)
   - License: **MIT**
3. Paste your Solidity source code
4. Click **"Verify and Publish"**

🎉 Your contract is now **open source**: anyone in the world can read the source code and verify it does exactly what it claims!

## Step 7: Reflect & Discuss

**You've just built a censorship-resistant, open-source application!** 🎉

**Discussion questions:**

1. **What would happen if a government ordered this message board taken down?**
   The smart contract would keep running. It's deployed on 900,000+ validators worldwide.

2. **How is this different from posting on Twitter/X or Instagram?**
   Those platforms can delete your posts, ban your account, or shadow-ban you. This message board has no admin.

3. **What are the downsides of a censorship-resistant message board?**
   Spam, harmful content, illegal content — all become permanent too. This is the fundamental tension of censorship resistance.

4. **Why is open-source verification important?**
   Without seeing the source code, you'd have to trust that the bytecode doesn't have hidden functions. Verification lets anyone audit the code.

---

## 🏆 Bonus Challenge

Modify the contract to add an `upvote` function that lets users upvote messages (track upvote count per message). Can you do it without adding any way to remove messages?

## Related Resources

- [Presentation 1: Censorship Resistance](/presentations/censorship-resistance)
- [Presentation 2: Open Source](/presentations/open-source)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Remix IDE Documentation](https://remix-ide.readthedocs.io/)
- [Etherscan Verification Guide](https://docs.etherscan.io/tutorials/verifying-contracts-programmatically)
