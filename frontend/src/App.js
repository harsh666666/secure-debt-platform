import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const backendURL = "https://secure-debt-platform.onrender.com";

  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [contractData, setContractData] = useState("");
  const [signature, setSignature] = useState("");

  const [blockchain, setBlockchain] = useState([]);
  const [ledger, setLedger] = useState([]);

  const generateKeys = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/generate-keys`);
      setPublicKey(res.data.publicKey);
      setPrivateKey(res.data.privateKey);
      alert("Keys generated");
    } catch (err) {
      alert("Error generating keys");
    }
  };

  const createRequest = async () => {
    try {
      await axios.post(`${backendURL}/api/request`, {
        from,
        to,
        amount,
        message,
      });
      alert("Request created");
      setFrom(""); setTo(""); setAmount(""); setMessage("");
    } catch (err) {
      alert("Error creating request");
    }
  };

  const signContract = async () => {
    if (!privateKey) return alert("Generate keys first");
    try {
      const res = await axios.post(`${backendURL}/api/sign-contract`, {
        contractData,
        privateKey,
      });
      setSignature(res.data.signature);
      alert("Signed successfully");
    } catch (err) {
      alert("Error signing");
    }
  };

  const verifySignature = async () => {
    if (!publicKey) return alert("Generate keys first");
    try {
      const res = await axios.post(`${backendURL}/api/verify-contract`, {
        contractData,
        signature,
        publicKey,
      });
      alert("Valid: " + res.data.valid);
    } catch (err) {
      alert("Error verifying");
    }
  };

  const viewBlockchain = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/blockchain`);
      setBlockchain(res.data);
    } catch (err) {
      alert("Error fetching blockchain");
    }
  };

  const checkIntegrity = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/verify-chain`);
      alert("Blockchain valid: " + res.data.valid);
    } catch (err) {
      alert("Error checking integrity");
    }
  };

  const tamperBlockchain = async () => {
    try {
      await axios.get(`${backendURL}/api/tamper`);
      alert("Blockchain tampered");
    } catch (err) {
      alert("Error tampering");
    }
  };

  const viewLedger = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/ledger`);
      setLedger(res.data);
    } catch (err) {
      alert("Error fetching ledger");
    }
  };

  return (
    <div className="App">
      <h1>Secure Debt Platform</h1>

      <button onClick={generateKeys}>Generate Keys</button>

      <h2>Create Request</h2>
      <input placeholder="From" value={from} onChange={e => setFrom(e.target.value)} />
      <input placeholder="To" value={to} onChange={e => setTo(e.target.value)} />
      <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <input placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={createRequest}>Create</button>

      <h2>Sign Contract</h2>
      <textarea value={contractData} onChange={e => setContractData(e.target.value)} />
      <button onClick={signContract}>Sign</button>

      <h2>Verify</h2>
      <button onClick={verifySignature}>Verify</button>

      <h2>Blockchain</h2>
      <button onClick={viewBlockchain}>View</button>
      <button onClick={checkIntegrity}>Check</button>
      <button onClick={tamperBlockchain}>Tamper</button>
      <button onClick={viewLedger}>Ledger</button>

      {blockchain.map((b, i) => (
        <div key={i}><p>{JSON.stringify(b)}</p></div>
      ))}

      {ledger.map((l, i) => (
        <div key={i}><p>{JSON.stringify(l)}</p></div>
      ))}
    </div>
  );
}

export default App;