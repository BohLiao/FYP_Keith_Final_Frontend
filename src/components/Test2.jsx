import React, { useState } from "react";
import "../Test2.css";

const generateRandomKey = (length) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
};

const Test2 = () => {
  const [targetKey, setTargetKey] = useState("Qx7Z");
  const [length, setLength] = useState(4);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const bruteForce = async () => {
    setIsRunning(true);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let attempts = 0;
    const startTime = performance.now();
    const maxAttempts = Math.pow(chars.length, length);
    let found = "";

    const tryKey = async () => {
      let current = "";
      let carry = attempts;
      for (let i = 0; i < length; i++) {
        current = chars[carry % chars.length] + current;
        carry = Math.floor(carry / chars.length);
      }
      return current.padStart(length, chars[0]);
    };

    while (attempts < maxAttempts) {
      const guess = await tryKey();
      if (guess === targetKey) {
        found = guess;
        break;
      }
      attempts++;
    }

    const endTime = performance.now();
    setResult({
      attempts,
      time: (endTime - startTime).toFixed(2),
      found,
      success: found === targetKey,
    });
    setIsRunning(false);
  };

  return (
    <div className="test2-wrapper">
      <h1 className="test2-title">Brute Force Attack Simulation</h1>

      <div className="test2-form">
        <label>Target Key:</label>
        <input
          type="text"
          maxLength={8}
          value={targetKey}
          onChange={(e) => setTargetKey(e.target.value)}
        />

        <label>Key Length:</label>
        <input
          type="number"
          min={1}
          max={8}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />

        <button onClick={bruteForce} disabled={isRunning}>
          {isRunning ? "Running..." : "Start Brute Force"}
        </button>
      </div>

      {result && (
        <div className="test2-results">
          <p><strong>Target Key:</strong> {targetKey}</p>
          <p><strong>Guessed Key:</strong> {result.found}</p>
          <p><strong>Total Attempts:</strong> {result.attempts.toLocaleString()}</p>
          <p><strong>Time Taken:</strong> {result.time} ms</p>
          <p><strong>Status:</strong> {result.success ? "✅ Success" : "❌ Failed"}</p>
        </div>
      )}
    </div>
  );
};

export default Test2;
