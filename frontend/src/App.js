import { useState } from "react";
import "./App.css";

function App() {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [requests, setRequests] = useState([]);
  const [result, setResult] = useState(null);
  const [chainStatus, setChainStatus] = useState("");


  // Create Request
  const createRequest = async () => {

    const response = await fetch("http://localhost:5000/api/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: from,
        to: to,
        amount: amount,
        message: message
      })
    });

    const data = await response.json();

    setResult(data.data);
  };


  // Fetch Blockchain
  const fetchRequests = async () => {

    const response = await fetch("https://your-backend-url.onrender.com/api/request");

    const data = await response.json();

    setRequests(data);
  };


  // Verify Signature
  const verifyRequest = async (req) => {

    const response = await fetch("https://your-backend-url.onrender.com/api/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    });

    const data = await response.json();
    alert(data.message);
  };


  // Tamper Test
  const tamperRequest = (req) => {

    const tampered = {
      ...req,
      amount: 9999
    };

    verifyRequest(tampered);
  };


  // Verify Blockchain
  const verifyBlockchain = async () => {

    const response = await fetch("https://your-backend-url.onrender.com/api/request");

    const data = await response.json();

    setChainStatus(data.message);
  };


  return (
    <div className="container">
          {/* Navbar */}
    <nav>
      <h1>💰 Secure Debt Platform</h1>
      <div>Requests & Blockchain</div>
    </nav>

      <h2>Secure Debt Request Platform</h2>

      <input
        placeholder="From"
        onChange={(e) => setFrom(e.target.value)}
      />

      <input
        placeholder="To"
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Message"
        onChange={(e) => setMessage(e.target.value)}
      />

      <br />

      <button onClick={createRequest}>
        Create Request
      </button>

      <button onClick={fetchRequests}>
        View All Blocks
      </button>

      <button onClick={verifyBlockchain}>
        Check Blockchain Integrity
      </button>

      <br /><br />

      {chainStatus && (
        <h3>{chainStatus}</h3>
      )}

      {result && (
        <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {requests.map((block, index) => (
        <div key={index} className="block">

          <h3>Block {index}</h3>

          <p className="hash">
            <b>Previous Hash:</b> {block.previousHash}
          </p>

          <p className="hash">
            <b>Hash:</b> {block.hash}
          </p>

          <pre>
            {JSON.stringify(block.data, null, 2)}
          </pre>

          <button onClick={() => verifyRequest(block.data)}>
            Verify Signature
          </button>

          <button onClick={() => tamperRequest(block.data)}>
            Tamper & Verify
          </button>

        </div>
      ))}

    </div>
  );
}

export default App;