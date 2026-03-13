const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "my_super_secret_key";

let blockchain = [];


// Create Block
function createBlock(data) {

  const previousHash =
    blockchain.length > 0
      ? blockchain[blockchain.length - 1].hash
      : "0";

  const blockData = {
    data: data,
    previousHash: previousHash
  };

  const hash = CryptoJS.SHA256(
    JSON.stringify(blockData)
  ).toString();

  const block = {
    ...blockData,
    hash: hash
  };

  blockchain.push(block);

  return block;
}


// Verify Entire Blockchain
function verifyBlockchain() {

  for (let i = 1; i < blockchain.length; i++) {

    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    const recalculatedHash = CryptoJS.SHA256(
      JSON.stringify({
        data: currentBlock.data,
        previousHash: currentBlock.previousHash
      })
    ).toString();

    if (currentBlock.hash !== recalculatedHash) {
      return false;
    }

    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }

  }

  return true;
}


// Create repayment request
app.post("/api/request", (req, res) => {

  const { from, to, amount, message } = req.body;

  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2);

  const data = { from, to, amount, message, timestamp, nonce };

  const signature = CryptoJS.HmacSHA256(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();

  const signedRequest = {
    ...data,
    signature
  };

  createBlock(signedRequest);

  res.json({
    message: "Request stored successfully",
    data: signedRequest
  });

});


// Get all blockchain blocks
app.get("/api/requests", (req, res) => {
  res.json(blockchain);
});


// Verify signature
app.post("/api/verify", (req, res) => {

  const { from, to, amount, message, timestamp, nonce, signature } = req.body;

  const data = { from, to, amount, message, timestamp, nonce };

  const newSignature = CryptoJS.HmacSHA256(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();

  if (newSignature === signature) {
    res.json({
      verified: true,
      message: "Signature is valid"
    });
  } else {
    res.json({
      verified: false,
      message: "Signature is invalid or data tampered"
    });
  }

});


// Verify Blockchain Integrity
app.get("/api/verify-chain", (req, res) => {

  const isValid = verifyBlockchain();

  if (isValid) {
    res.json({
      valid: true,
      message: "Blockchain is valid"
    });
  } else {
    res.json({
      valid: false,
      message: "Blockchain has been tampered"
    });
  }

});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});