import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const backendURL = "https://secure-debt-platform.onrender.com";

function App() {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [contractData, setContractData] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const [blockchain, setBlockchain] = useState([]);

  // Create debt request
  const createRequest = async () => {

    const res = await axios.post(`${backendURL}/api/request`, {
      from,
      to,
      amount,
      message
    });

    alert(res.data.message);
  };

  // Sign contract
  const signContract = async () => {

    const res = await axios.post(`${backendURL}/api/sign-contract`, {
      contractData,
      privateKey
    });

    setSignature(res.data.signature);

    alert("Contract signed and added to blockchain");
  };

  // Verify signature
  const verifySignature = async () => {

    const res = await axios.post(`${backendURL}/api/verify-contract`, {
      contractData,
      signature,
      publicKey
    });

    alert("Signature valid: " + res.data.valid);
  };

  // Get blockchain
  const viewBlockchain = async () => {

    const res = await axios.get(`${backendURL}/api/blockchain`);

    setBlockchain(res.data);
  };

  // Verify blockchain
  const verifyChain = async () => {

    const res = await axios.get(`${backendURL}/api/verify-chain`);

    alert("Blockchain valid: " + res.data.valid);
  };

  // 🚨 Tamper demo
  const tamperBlockchain = async () => {

    const res = await axios.get(`${backendURL}/api/tamper`);

    alert(res.data.message);
  };

  return (

    <div className="App">

      <h1>Secure Debt Repayment Platform</h1>

      <h2>Create Debt Request</h2>

      <input placeholder="From" onChange={e => setFrom(e.target.value)} />
      <input placeholder="To" onChange={e => setTo(e.target.value)} />
      <input placeholder="Amount" onChange={e => setAmount(e.target.value)} />
      <input placeholder="Message" onChange={e => setMessage(e.target.value)} />

      <button onClick={createRequest}>Create Request</button>

      <h2>Sign Contract</h2>

      <input
        placeholder="Contract Data"
        onChange={e => setContractData(e.target.value)}
      />

      <textarea
        placeholder="Private Key"
        onChange={e => setPrivateKey(e.target.value)}
      />

      <button onClick={signContract}>Sign Contract</button>

      <h2>Verify Contract Signature</h2>

      <textarea
        placeholder="Public Key"
        onChange={e => setPublicKey(e.target.value)}
      />

      <textarea
        placeholder="Signature"
        value={signature}
        onChange={e => setSignature(e.target.value)}
      />

      <button onClick={verifySignature}>Verify Signature</button>

      <h2>Blockchain Controls</h2>

      <button onClick={viewBlockchain}>View Blockchain</button>
      <button onClick={verifyChain}>Check Blockchain Integrity</button>
      <button onClick={tamperBlockchain}>Tamper Blockchain (Attack Demo)</button>

      <h2>Blockchain Explorer</h2>

      {blockchain.map((block, index) => (

        <div key={index} className="block">

          <p><b>Index:</b> {block.index}</p>
          <p><b>Timestamp:</b> {block.timestamp}</p>
          <p><b>Data:</b> {JSON.stringify(block.data)}</p>
          <p><b>Hash:</b> {block.hash}</p>
          <p><b>Previous Hash:</b> {block.previousHash}</p>

        </div>

      ))}

    </div>

  );

}

export default App;