# Secure Debt Repayment Platform

A blockchain-based platform for creating and verifying digitally signed debt contracts.

## Features

- Create debt repayment requests
- RSA public/private key generation
- Digital signature for contracts
- Signature verification
- Blockchain-based contract storage
- Tamper detection
- Blockchain explorer
- Debt transaction ledger

## Tech Stack

Frontend: React.js  
Backend: Node.js + Express  
Cryptography: RSA Digital Signatures  
Data Integrity: Custom Blockchain implementation

## Live Demo

Frontend: https://secure-debt-platform.vercel.app  
Backend API: https://secure-debt-platform.onrender.com

## How It Works

1. User creates a debt contract.
2. Contract is digitally signed using RSA private key.
3. Signed contract is stored as a block in the blockchain.
4. Anyone can verify the signature using the public key.
5. Blockchain integrity ensures contracts cannot be modified.

## Security

- SHA256 hashing
- Digital signature verification
- Blockchain immutability
