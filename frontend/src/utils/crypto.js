import CryptoJS from "crypto-js";

const SECRET_KEY = "my_super_secret_key";

export function signMessage(message) {
  return CryptoJS.HmacSHA256(message, SECRET_KEY).toString();
}