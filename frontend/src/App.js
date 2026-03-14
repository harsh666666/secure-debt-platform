// frontend/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
 function App() {
  const backendURL = "https://secure-debt-platform.onrender.com"; // Replace with local if testing locally

  // States for keys
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  // States for debt request
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // States for contract signing
  const [contractData, setContractData] = useState("");
 const [signature, setSignature] = useState("");

  // Blockchain and Ledger
  const [blockchain, setBlockchain] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [integrity, setIntegrity] = useState(null);

  // Generate RSA Keys
  const generateKeys = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/generate-keys`);
      setPublicKey(res.data.publicKey);
      setPrivateKey(res.data.privateKey);
      alert("Keys generated! Copy your private and public key for signing and verifying.");
    } catch (err) {
      console.error(err);
      alert("Error generating keys");
    }
  };

  // Create Debt Request
  const createRequest = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/request`, {
        from,
        to,
        amount,
        message,
      });
      alert("Request created successfully");
      // Optional: clear fields
      setFrom(""); setTo(""); setAmount(""); setMessage("");
    } catch (err) {
      console.error(err);
      alert("Error creating request");
    }
  };

  // Sign Contract
  const signContract = async () => {
    if (!privateKey) return alert("Generate private key first!");
    try {
      const res = await axios.post(`${backendURL}/api/sign-contract`, {
        contractData,
        privateKey,
      });
      setSignature(res.data.signature);
      alert("Contract signed and stored in blockchain!");
    } catch (err) {
      console.error(err);
      alert("Error signing contract");
    }
  };

  // Verify Signature
  const verifySignature = async () => {
    if (!publicKey) return alert("Generate public key first!");
    try {
      const res = await axios.post(`${backendURL}/api/verify-contract`, {
        contractData,
        signature,
        publicKey,
      });
      alert("Signature valid: " + res.data.valid);
    } catch (err) {
      console.error(err);
      alert("Error verifying signature");
    }
  };

  // View Blockchain
  const viewBlockchain = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/blockchain`);
      setBlockchain(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching blockchain");
    }
  };

  // Check Blockchain Integrity
  const checkIntegrity = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/verify-chain`);
      setIntegrity(res.data.valid);
      alert("Blockchain valid: " + res.data.valid);
    } catch (err) {
      console.error(err);
      alert("Error checking blockchain integrity");
    }
  };

  // Tamper Blockchain (Demo)
  const tamperBlockchain = async () => {
    try {
      await axios.get(`${backendURL}/api/tamper`);
      alert("Blockchain tampered!");
    } catch (err) {
      console.error(err);
      alert("Error tampering blockchain");
    }
  };

  // View Debt Ledger
  const viewLedger = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/ledger`);
      setLedger(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching debt ledger");
    }
  };

  return (
  <div className="App">
     <h1>Secure Debt Repayment Platform</h1>

      {/* Generate Keys */}
      <section>
        <h2>RSA Key Generation</h2>
        <button onClick={generateKeys}>Generate Keys</button>
        {publicKey && (
          <div>
            <p><strong>Public Key:</strong></p>
            <textarea value={publicKey} readOnly rows={4} cols={50} />
          </div>
        )}
        {privateKey && (
          <div>
            <p><strong>Private Key:</strong></p>
            <textarea value={privateKey} readOnly rows={6} cols={50} />
          </div>
        )}
      </section>

      {/* Debt Request */}
      <section>
        <h2>Create Debt Request</h2>
        <input placeholder="From" value={from} onChange={e => setFrom(e.target.value)} />
        <input placeholder="To" value={to} onChange={e => setTo(e.target.value)} />
        <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={createRequest}>Create Request</button>
      </section>

      {/* Sign Contract */}
      <section>
        <h2>Sign Contract</h2>
        <textarea
          placeholder="Contract Data"
          value={contractData}
          onChange={e => setContractData(e.target.value)}
          rows={3} cols={50}
        />
        <button onClick={signContract}>Sign Contract</button>
        {signature && (
          <div>
            <p><strong>Signature:</strong></p>
            <textarea value={signature} readOnly rows={4} cols={50} />
          </div>
        )}
      </section>

      {/* Verify Signature */}
      <section>
        <h2>Verify Signature</h2>
        <textarea
          placeholder="Contract Data"
          value={contractData}
          onChange={e => setContractData(e.target.value)}
          rows={3} cols={50}
        />
        <textarea
          placeholder="Signature"
          value={signature}
          onChange={e => setSignature(e.target.value)}
          rows={4} cols={50}
        />
        <textarea
          placeholder="Public Key"
          value={publicKey}
          onChange={e => setPublicKey(e.target.value)}
          rows={4} cols={50}
        />
        <button onClick={verifySignature}>Verify Signature</button>
      </section>

      {/* Blockchain Controls */}
      <section>
        <h2>Blockchain Controls</h2>
        <button onClick={viewBlockchain}>View Blockchain</button>
        <button onClick={checkIntegrity}>Check Blockchain Integrity</button>
        <button onClick={tamperBlockchain}>Tamper Blockchain (Attack Demo)</button>
        <button onClick={viewLedger}>View Debt Ledger</button>
        <h3>Blockchain Explorer</h3>
        {blockchain.map((block, idx) => (
          <div key={idx} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
            <p><strong>Index:</strong> {block.index}</p>
            <p><strong>Timestamp:</strong> {block.timestamp}</p>
            <p><strong>Data:</strong> {JSON.stringify(block.data)}</p>
            <p><strong>Hash:</strong> {block.hash}</p>
            <p><strong>Previous Hash:</strong> {block.previousHash}</p>
          </div>
        ))}
        <h3>Debt Transaction Ledger</h3>
        {ledger.map((item, idx) => (
          <div key={idx}>
            <p>{JSON.stringify(item)}</p>
          </div>
        ))}
      </section>
    </div>
  ); 
}

export default App;