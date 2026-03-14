const express = require("express");
const cors = require("cors");

const { generateKeys, signData, verifySignature } = require("./crypto");
const Blockchain = require("./blockchain");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Blockchain instance
const debtChain = new Blockchain();

// Temporary storage for requests
let requests = [];

// Generate RSA Keys
app.get("/api/generate-keys", (req, res) => {

    const keys = generateKeys();

    res.json({
        message: "Keys generated successfully",
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
    });

});

// Create debt request
app.post("/api/request", (req, res) => {

    const request = req.body;

    requests.push(request);

    res.json({
        message: "Request stored successfully",
        data: request
    });

});

// Get all requests
app.get("/api/requests", (req, res) => {
    res.json(requests);
});

// Sign contract and store in blockchain
app.post("/api/sign-contract", (req, res) => {

    const { contractData, privateKey } = req.body;

    try {

        const signature = signData(contractData, privateKey);

        // Add block
        debtChain.addBlock({
            contractData,
            signature
        });

        res.json({
            message: "Contract signed successfully",
            contractData,
            signature
        });

    } catch (error) {

        res.status(500).json({
            message: "Signing failed",
            error: error.message
        });

    }

});

// Verify contract signature
app.post("/api/verify-contract", (req, res) => {

    const { contractData, signature, publicKey } = req.body;

    try {

        const valid = verifySignature(contractData, signature, publicKey);

        res.json({
            message: "Verification complete",
            valid
        });

    } catch (error) {

        res.status(500).json({
            message: "Verification failed",
            error: error.message
        });

    }

});

// Get blockchain
app.get("/api/blockchain", (req, res) => {
    res.json(debtChain.chain);
});

// Verify blockchain integrity
app.get("/api/verify-chain", (req, res) => {

    res.json({
        valid: debtChain.isChainValid()
    });

});

// 🚨 Tamper attack demo
app.get("/api/tamper", (req, res) => {

    if (debtChain.chain.length > 1) {
        debtChain.chain[1].data = "HACKED CONTRACT DATA";
    }

    res.json({
        message: "Blockchain tampered! Now check integrity."
    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});