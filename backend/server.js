const express = require("express");
const cors = require("cors");

// Import crypto functions
const { generateKeys, signMessage, verifySignature } = require("./crypto");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Secure Debt Platform Backend Running");
});


// ===============================
// Generate RSA Keys
// ===============================
app.get("/api/generate-keys", (req, res) => {

    const keys = generateKeys();

    res.json({
        message: "Keys generated successfully",
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
    });

});


// ===============================
// Sign Message
// ===============================
app.post("/api/sign", (req, res) => {

    const { message, privateKey } = req.body;

    if (!message || !privateKey) {
        return res.status(400).json({
            error: "Message and privateKey required"
        });
    }

    const signature = signMessage(message, privateKey);

    res.json({
        message: "Message signed successfully",
        signature: signature
    });

});


// ===============================
// Verify Signature
// ===============================
app.post("/api/verify-signature", (req, res) => {

    const { message, signature, publicKey } = req.body;

    if (!message || !signature || !publicKey) {
        return res.status(400).json({
            error: "message, signature and publicKey required"
        });
    }

    const valid = verifySignature(message, signature, publicKey);

    res.json({
        valid: valid
    });

});


// ===============================
// Start Server
// ===============================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});