import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const createDebtRequest = (data) => API.post("/request", data);

export const getRequests = () => API.get("/requests");