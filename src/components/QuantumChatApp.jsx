// src/components/QuantumChatApp.jsx
// DM-only. Encrypted usernames are canonical IDs for API; display uses decrypted text.
// WhatsApp-like layout: my messages (right), theirs (left).

import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  simulateKyberAesEncrypt,
  simulateKyberAesDecrypt,
  isEncrypted,
} from "../crypto/kyber_aes";
import { useNavigate } from "react-router-dom";
import "../chat.css";

const QuantumChatApp = ({ auth }) => {
  const navigate = useNavigate();

  // Display name for header (likely plaintext)
  const mePlain = auth?.user?.username || "Unknown";
  const isHacker = mePlain === "Hacker";

  const [allUsers, setAllUsers] = useState([]); // [{ cipher, plain }]
  const [contacts, setContacts] = useState([]); // allUsers minus me
  const [meCipher, setMeCipher] = useState(null);

  const [toCipher, setToCipher] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [hideEnc, setHideEnc] = useState(false);

  const endRef = useRef(null);

  // Theme classes
  const wrapper = "chat-dark";
  const accent = "bg-amber-600";
  const contactBG = "bg-slate-800 hover:bg-slate-700 text-white";

  // Load users, derive meCipher, then build contacts list
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users`)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const mappedAll = rows.map((u) => {
          const cipher = u?.username ?? "";
          const plain = simulateKyberAesDecrypt(cipher) || cipher;
          return { cipher, plain };
        });

        setAllUsers(mappedAll);

        if (!isHacker) {
          const mine = mappedAll.find((x) => x.plain === mePlain);
          setMeCipher(mine?.cipher || mePlain); // fallback to plaintext if DB is plaintext
        } else {
          setMeCipher("Hacker");
        }

        setContacts(mappedAll.filter((x) => x.plain !== mePlain));
      })
      .catch(console.error);
  }, [mePlain, isHacker]);

  // Poll messages
  useEffect(() => {
    const loadMessages = () => {
      if (!isHacker && (!meCipher || !toCipher)) return;

      const params = isHacker ? { from: "Hacker", to: "*" } : { from: meCipher, to: toCipher };
      axios
        .get(`${import.meta.env.VITE_API_URL}/messages`, { params })
        .then((res) => setMsgs(Array.isArray(res.data) ? res.data : []))
        .catch(console.error);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [meCipher, toCipher, isHacker]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // Send helpers
  const push = (msg) => {
    if (!isHacker && (!meCipher || !toCipher)) return;
    const encrypted = simulateKyberAesEncrypt(msg);

    const payload = isHacker
      ? { from: meCipher, to: meCipher, message: encrypted }
      : { from: meCipher, to: toCipher, message: encrypted };

    axios
      .post(`${import.meta.env.VITE_API_URL}/send`, payload)
      .then(() => {
        setText("");
        setFile(null);
      })
      .catch(console.error);
  };

  const send = () => {
    if (!text.trim() && !file) return;
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      axios
        .post(`${import.meta.env.VITE_API_URL}/upload`, fd)
        .then((r) => push(`📎 File: ${r.data.url}`))
        .catch(console.error);
    } else {
      push(text.trim());
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toPlain = useMemo(() => {
    if (!toCipher) return null;
    const rec = allUsers.find((u) => u.cipher === toCipher);
    return rec?.plain || toCipher;
  }, [toCipher, allUsers]);

  return (
    <div className={`${wrapper} qca-layout`}>
      <aside className="qca-sidebar">
        <div className="qca-topbar-container">
          <div className="qca-sidebar-greeting">
            <div className="text-2xl font-bold">Hi</div>
            <div className="opacity-70">@{mePlain}</div>
          </div>
        </div>

        {!isHacker && (
          <>
            <div className="qca-contacts-header">CONTACTS</div>
            <div className="qca-contacts-list">
              {contacts.map((u) => (
                <button
                  key={u.cipher}
                  onClick={() => setToCipher(u.cipher)}
                  className={`truncate font-medium transition ${
                    toCipher === u.cipher ? `${accent} text-white shadow-lg ring-2` : contactBG
                  }`}
                  title={u.plain}
                >
                  {isEncrypted(u.cipher) && "🔒 "}
                  {u.plain}
                </button>
              ))}
            </div>

            <div className="qca-signout-wrapper mt-auto pt-4">
              <button className="qca-theme-toggle-button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </>
        )}

        {isHacker && (
          <div className="mt-4 space-y-2">
            <div className="qca-contacts-header">Hacker Controls</div>
            <button className="qca-theme-toggle-button" onClick={() => setHideEnc((v) => !v)}>
              {hideEnc ? "Show Encrypted" : "Hide Encrypted"}
            </button>

            <div className="qca-signout-wrapper mt-8 pt-4">
              <button className="qca-theme-toggle-button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="qca-chat-panel-container">
          {/* Header */}
          <div className="qca-chat-status-box">
            <div className="qca-chat-status-label">
              {isHacker
                ? "🕵️ Viewing all messages"
                : toCipher
                ? `Chat with ${isEncrypted(toCipher) ? "🔒 " : ""}${toPlain}`
                : "Select a contact"}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {msgs
              .filter((m) => !(isHacker && hideEnc && isEncrypted(m.message)))
              .map((m, i) => {
                const senderCipher = m.sender ?? m.from;
                const receiverCipher = m.receiver ?? m.to;

                const senderPlain = simulateKyberAesDecrypt(senderCipher) || senderCipher;
                const receiverPlain = simulateKyberAesDecrypt(receiverCipher) || receiverCipher;

                const mine = senderCipher === meCipher || senderPlain === mePlain;

                return (
                  <div key={i} className={`qca-msg-row ${mine ? "mine" : "theirs"}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`qca-bubble ${mine ? "mine" : "theirs"}`}
                    >
                      {isHacker && (
                        <span className="qca-meta">
                          {senderPlain} → {receiverPlain}
                        </span>
                      )}

                      {m.message?.startsWith("📎 File:") ? (
                        <a
                          href={m.message.replace("📎 File: ", "")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {m.message.split("/").pop()}
                        </a>
                      ) : isHacker ? (
                        hideEnc ? "[Encrypted hidden]" : m.message
                      ) : (
                        simulateKyberAesDecrypt(m.message)
                      )}
                    </motion.div>
                  </div>
                );
              })}
            <div ref={endRef} />
          </div>

          {/* Input */}
          {!isHacker && (
            <div className="qca-chat-input-wrapper">
              <div className="qca-chat-input-bar">
                <label
                  htmlFor="file-in"
                  className="qca-input-ctrl file-label cursor-pointer border px-3 py-2 rounded bg-slate-700 text-white"
                >
                  {file ? `${file.name}` : "📎"}
                </label>
                <input
                  id="file-in"
                  type="file"
                  className="qca-hidden-file-input"
                  onChange={(e) => setFile(e.target.files[0])}
                  disabled={!toCipher}
                />

                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={toCipher ? "Type a message…" : "Select a contact to start chatting…"}
                  className="qca-input-ctrl qca-message-input"
                  disabled={!toCipher}
                />

                <button
                  onClick={send}
                  disabled={!toCipher}
                  className={`qca-input-ctrl ${accent} hover:bg-amber-700 px-5 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuantumChatApp;
