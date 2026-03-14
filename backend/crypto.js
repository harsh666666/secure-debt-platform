const forge = require("node-forge");

// Generate RSA key pair
function generateKeys() {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

    return {
        publicKey,
        privateKey
    };
}

// Sign data using private key
function signData(data, privateKeyPem) {

    // Fix formatting issues from JSON requests
    privateKeyPem = privateKeyPem
        .replace(/\\n/g, "\n")
        .replace(/\r/g, "")
        .trim();

    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    const md = forge.md.sha256.create();
    md.update(data, "utf8");

    const signature = privateKey.sign(md);

    return forge.util.encode64(signature);
}
// Verify signature using public key
function verifySignature(data, signature64, publicKeyPem) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    const md = forge.md.sha256.create();
    md.update(data, "utf8");

    const signature = forge.util.decode64(signature64);

    return publicKey.verify(md.digest().bytes(), signature);
}

module.exports = {
    generateKeys,
    signData,
    verifySignature
};