// frontend/src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const backendURL = "https://secure-debt-platform.onrender.com";

  // RSA keys
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  // Debt request
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // Contract
  const [contractData, setContractData] = useState("");
  const [signature, setSignature] = useState("");

  // Blockchain and ledger
  const [blockchain, setBlockchain] = useState([]);
  const [ledger, setLedger] = useState([]);

  // Generate RSA Keys
  const generateKeys = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/generate-keys`);
      setPublicKey(res.data.publicKey);
      setPrivateKey(res.data.privateKey);
      alert("Keys generated successfully");
    } catch (err) {
      console.error(err);
      alert("Error generating keys");
    }
  };

  // Create Debt Request
  const createRequest = async () => {
    try {
      await axios.post(`${backendURL}/api/request`, {
        from,
        to,
        amount,
        message
      });

      alert("Debt request created");

      setFrom("");
      setTo("");
      setAmount("");
      setMessage("");

    } catch (err) {
      console.error(err);
      alert("Error creating request");
    }
  };

  // Sign Contract
  const signContract = async () => {

    if (!privateKey) {
      alert("Generate keys first");
      return;
    }

    try {

      const res = await axios.post(`${backendURL}/api/sign-contract`, {
        contractData,
        privateKey
      });

      setSignature(res.data.signature);

      alert("Contract signed and stored in blockchain");

    } catch (err) {
      console.error(err);
      alert("Error signing contract");
    }
  };

  // Verify Signature
  const verifySignature = async () => {

    if (!publicKey) {
      alert("Generate keys first");
      return;
    }

    try {

      const res = await axios.post(`${backendURL}/api/verify-contract`, {
        contractData,
        signature,
        publicKey
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
      alert("Blockchain valid: " + res.data.valid);

    } catch (err) {
      console.error(err);
      alert("Error checking blockchain integrity");
    }
  };

  // Tamper Blockchain
  const tamperBlockchain = async () => {

    try {

      await axios.get(`${backendURL}/api/tamper`);
      alert("Blockchain tampered (attack simulation)");

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
      alert("Error fetching ledger");
    }
  };

  return (

    <div className="App">

      <h1>Secure Debt Repayment Platform</h1>

      {/* KEY GENERATION */}

      <section>

        <h2>RSA Key Generation</h2>

        <button onClick={generateKeys}>Generate Keys</button>

        {publicKey && (
          <div>
            <p><b>Public Key</b></p>
            <textarea value={publicKey} readOnly rows="4" cols="60" />
          </div>
        )}

        {privateKey && (
          <div>
            <p><b>Private Key</b></p>
            <textarea value={privateKey} readOnly rows="6" cols="60" />
          </div>
        )}

      </section>

      {/* CREATE REQUEST */}

      <section>

        <h2>Create Debt Request</h2>

        <input placeholder="From" value={from} onChange={(e)=>setFrom(e.target.value)} />

        <input placeholder="To" value={to} onChange={(e)=>setTo(e.target.value)} />

        <input placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />

        <input placeholder="Message" value={message} onChange={(e)=>setMessage(e.target.value)} />

        <button onClick={createRequest}>Create Request</button>

      </section>

      {/* SIGN CONTRACT */}

      <section>

        <h2>Sign Contract</h2>

        <textarea
        placeholder="Contract Data"
        value={contractData}
        onChange={(e)=>setContractData(e.target.value)}
        rows="3"
        cols="60"
        />

        <button onClick={signContract}>Sign Contract</button>

        {signature && (
          <div>
            <p><b>Signature</b></p>
            <textarea value={signature} readOnly rows="4" cols="60" />
          </div>
        )}

      </section>

      {/* VERIFY SIGNATURE */}

      <section>

        <h2>Verify Signature</h2>

        <textarea
        placeholder="Contract Data"
        value={contractData}
        onChange={(e)=>setContractData(e.target.value)}
        rows="3"
        cols="60"
        />

        <textarea
        placeholder="Signature"
        value={signature}
        onChange={(e)=>setSignature(e.target.value)}
        rows="4"
        cols="60"
        />

        <textarea
        placeholder="Public Key"
        value={publicKey}
        onChange={(e)=>setPublicKey(e.target.value)}
        rows="4"
        cols="60"
        />

        <button onClick={verifySignature}>Verify Signature</button>

      </section>

      {/* BLOCKCHAIN */}

      <section>

        <h2>Blockchain Controls</h2>

        <button onClick={viewBlockchain}>View Blockchain</button>

        <button onClick={checkIntegrity}>Check Blockchain Integrity</button>

        <button onClick={tamperBlockchain}>Tamper Blockchain (Attack Demo)</button>

        <button onClick={viewLedger}>View Debt Ledger</button>

        <h3>Blockchain Explorer</h3>

        {blockchain.map((block, index) => (

          <div key={index} style={{border:"1px solid black", margin:"10px", padding:"10px"}}>

            <p><b>Index:</b> {block.index}</p>

            <p><b>Timestamp:</b> {block.timestamp}</p>

            <p><b>Data:</b> {JSON.stringify(block.data)}</p>

            <p><b>Hash:</b> {block.hash}</p>

            <p><b>Previous Hash:</b> {block.previousHash}</p>

          </div>

        ))}

        <h3>Debt Transaction Ledger</h3>

        {ledger.map((item, index)=>(
          <div key={index}>
            <p>{JSON.stringify(item)}</p>
          </div>
        ))}

      </section>

    </div>
  );
}

export default App;