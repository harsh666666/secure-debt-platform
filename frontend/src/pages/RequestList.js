import React from "react";

const RequestList = () => {
  // TODO: fetch request list from backend
  const requests = [];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Debt Requests</h2>
      {requests.length === 0 ? (
        <p>No requests yet</p>
      ) : (
        <ul>
          {requests.map((req, idx) => (
            <li key={idx}>{req.amount} to {req.receiver}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestList;