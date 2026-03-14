import React, { useState } from "react";
import axios from "axios";

function App() {

  const [contractData, setContractData] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [blocks, setBlocks] = useState([]);

  const generateKeys = async () => {
    const res = await axios.get("http://localhost:5000/api/generate-keys");
    console.log(res.data);
    alert("Keys generated. Check console.");
  };

  const signContract = async () => {

    const res = await axios.post("http://localhost:5000/api/sign-contract", {
      contractData,
      privateKey
    });

    alert("Contract Signed!");
    console.log(res.data);
  };

  const loadBlockchain = async () => {

    const res = await axios.get("http://localhost:5000/api/blockchain");
    setBlocks(res.data);
  };

  return (

    <div style={{padding:"40px"}}>

      <h1>Secure Debt Platform</h1>

      <button onClick={generateKeys}>
        Generate Keys
      </button>

      <br/><br/>

      <input
        placeholder="Contract Data"
        value={contractData}
        onChange={(e)=>setContractData(e.target.value)}
      />

      <br/><br/>

      <textarea
        placeholder="Paste Private Key"
        value={privateKey}
        onChange={(e)=>setPrivateKey(e.target.value)}
        rows={6}
        cols={50}
      />

      <br/><br/>

      <button onClick={signContract}>
        Sign Contract
      </button>

      <br/><br/>

      <button onClick={loadBlockchain}>
        View Blockchain
      </button>

      <h2>Blockchain</h2>

      {blocks.map((block,i)=>(
        <pre key={i}>
          {JSON.stringify(block,null,2)}
        </pre>
      ))}

    </div>
  );
}

export default App;