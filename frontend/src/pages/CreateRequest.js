import { signMessage } from "../utils/crypto";
import React, { useState } from "react";
import { createDebtRequest } from "../api";

function CreateRequest() {

  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // Create message
      const message = `${amount}-${receiver}`;

      // Generate digital signature
      const signature = signMessage(message);

      const response = await createDebtRequest({
        amount,
        receiver,
        signature
      });

      console.log("Signed request:", signature);
      console.log(response.data);

      alert("Signed request sent to backend!");

    } catch (error) {
      console.error(error);
      alert("Error sending request");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Debt Request</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Amount:</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <br/>

        <div>
          <label>Receiver:</label>
          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </div>

        <br/>

        <button type="submit">Create</button>

      </form>
    </div>
  );
}

export default CreateRequest;