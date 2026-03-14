import React, { useState } from "react";
import "./App.css";

function App() {

  const backendURL = "http://localhost:5000";

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [blocks, setBlocks] = useState([]);
  const [chainStatus, setChainStatus] = useState("");

  const [contractData, setContractData] = useState("");
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [verificationResult, setVerificationResult] = useState("");

  // Create request
  const createRequest = async () => {

    const request = {
      from,
      to,
      amount,
      message
    };

    const res = await fetch(`${backendURL}/api/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    const data = await res.json();
    alert(data.message);
  };

  // Load blockchain
  const loadBlockchain = async () => {

    const res = await fetch(`${backendURL}/api/blockchain`);
    const data = await res.json();

    setBlocks(data);

  };

  // Verify blockchain integrity
  const verifyChain = async () => {

    const res = await fetch(`${backendURL}/api/verify-chain`);
    const data = await res.json();

    if (data.valid) {
      setChainStatus("✅ Blockchain Valid");
    } else {
      setChainStatus("❌ Blockchain Tampered");
    }

  };

  // Verify contract signature
  const verifyContract = async () => {

    const res = await fetch(`${backendURL}/api/verify-contract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contractData,
        signature,
        publicKey
      })
    });

    const data = await res.json();

    if (data.valid) {
      setVerificationResult("✅ Signature Valid");
    } else {
      setVerificationResult("❌ Signature Invalid");
    }

  };

  // Tamper blockchain (demo)
  const tamperBlockchain = () => {

    if (blocks.length > 1) {

      const tampered = [...blocks];
      tampered[1].data = "HACKED DATA";

      setBlocks(tampered);

      alert("Block tampered! Now check blockchain integrity.");

    } else {

      alert("Need at least 2 blocks to tamper.");

    }

  };

  return (
    <div className="App">

      <h1>Secure Debt Repayment Platform</h1>

      <h2>Create Debt Request</h2>

      <input
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      <input
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <button onClick={createRequest}>
        Create Request
      </button>

      <button onClick={loadBlockchain}>
        View Blockchain
      </button>

      <button onClick={verifyChain}>
        Check Blockchain Integrity
      </button>

      <button onClick={tamperBlockchain}>
        Tamper Blockchain
      </button>

      <p>{chainStatus}</p>

      <hr />

      <h2>Verify Contract Signature</h2>

      <textarea
        placeholder="Contract Data"
        value={contractData}
        onChange={(e) => setContractData(e.target.value)}
      />

      <textarea
        placeholder="Signature"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
      />

      <textarea
        placeholder="Public Key"
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
      />

      <br /><br />

      <button onClick={verifyContract}>
        Verify Signature
      </button>

      <p>{verificationResult}</p>

      <hr />

      <h2>Blockchain Explorer</h2>

      {blocks.map((block, index) => (

        <div key={index} className="block">

          <h3>Block #{index}</h3>

          <p><b>Data:</b> {JSON.stringify(block.data)}</p>

          <p><b>Previous Hash:</b> {block.previousHash}</p>

          <p><b>Hash:</b> {block.hash}</p>

        </div>

      ))}

    </div>
  );

}

export default App;