// QuantumChatApp with Group Chat Feature

import React, { useState, useEffect, useRef } from "react";
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
  const me = auth?.user?.username || "Unknown";
  const isHacker = me === "Hacker";

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [to, setTo] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [hideEnc, setHideEnc] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users`)
      .then((res) => setUsers(res.data.filter((u) => u.username !== me)))
      .catch(console.error);

    axios.get(`${import.meta.env.VITE_API_URL}/groups`, { params: { user: me } })
      .then((res) => setGroups(res.data))
      .catch(console.error);
  }, [me]);

  useEffect(() => {
    const loadMessages = () => {
      const params = isHacker
        ? { from: "Hacker" }
        : activeGroup
        ? { group: activeGroup }
        : { from: me, to: to ? simulateKyberAesDecrypt(to) : null };

      axios.get(`${import.meta.env.VITE_API_URL}/messages`, { params })
        .then((res) => setMsgs(res.data))
        .catch(console.error);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [me, to, activeGroup, isHacker]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const push = (msg) => {
    const encrypted = simulateKyberAesEncrypt(msg);
    const payload = activeGroup
      ? { from: me, group: activeGroup, message: encrypted }
      : { from: me, to: to ? simulateKyberAesDecrypt(to) : null, message: encrypted };

    axios.post(`${import.meta.env.VITE_API_URL}/send`, payload)
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
      axios.post(`${import.meta.env.VITE_API_URL}/upload`, fd)
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

  const createGroup = () => {
    const groupName = prompt("Enter new group name:");
    if (!groupName) return;
    const members = prompt("Enter usernames to add (comma-separated):");
    axios.post(`${import.meta.env.VITE_API_URL}/groups`, {
      name: groupName,
      members: [me, ...members.split(",").map((m) => m.trim())],
    })
      .then(() => window.location.reload())
      .catch(console.error);
  };

  const wrapper = "chat-dark";
  const accent = "bg-amber-600";
  const bubbleMe = "bg-amber-700 text-white";
  const bubbleYou = "bg-slate-700 text-white";
  const contactBG = "bg-slate-800 hover:bg-slate-700 text-white";

  return (
    <div className={`${wrapper} qca-layout`}>
      <aside className="qca-sidebar">
        <div className="qca-topbar-container">
          <div className="qca-sidebar-greeting">
            <div className="text-2xl font-bold">Hi</div>
            <div className="opacity-70">@{me}</div>
          </div>
        </div>

        {!isHacker && (
          <>
            <div className="qca-contacts-header">Contacts</div>
            <div className="qca-contacts-list">
              {users.map((u) => (
                <button key={u.username} onClick={() => {
                  setTo(u.username);
                  setActiveGroup(null);
                }}
                  className={`truncate font-medium transition ${
                    to === u.username ? `${accent} text-white shadow-lg ring-2` : contactBG
                  }`}
                >
                  {simulateKyberAesDecrypt(u.username)}
                </button>
              ))}

              <div className="qca-contacts-header mt-4">Groups</div>
              {groups.map((g) => (
                <button key={g.id} onClick={() => {
                  setActiveGroup(g.name);
                  setTo(null);
                }}
                  className={`truncate font-medium transition ${
                    activeGroup === g.name ? `${accent} text-white shadow-lg ring-2` : contactBG
                  }`}
                >
                  #{g.name}
                </button>
              ))}

              <button onClick={createGroup} className="qca-theme-toggle-button mt-2">+ Create Group</button>
            </div>

            <div className="qca-signout-wrapper mt-auto pt-4">
              <button className="qca-theme-toggle-button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </>
        )}
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="qca-chat-panel-container">
          <div className="qca-chat-status-box">
            <div className="qca-chat-status-label">
              {isHacker
                ? "🕁️ Viewing all messages"
                : activeGroup
                ? `Group: #${activeGroup}`
                : to
                ? `Chat with ${simulateKyberAesDecrypt(to)}`
                : "Select a contact or group"}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {msgs
              .filter((m) => !(isHacker && hideEnc && isEncrypted(m.message)))
              .map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.from === me ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`max-w-xl p-3 rounded-2xl text-sm break-words shadow-md ${
                    m.from === me ? bubbleMe : bubbleYou
                  }`}
                >
                  {isHacker && (
                    <div className="text-xs opacity-70 mb-1 font-mono">
                      {m.sender || m.from} → {m.receiver || m.to || `#${m.group}`}
                    </div>
                  )}
                  {m.message?.startsWith("📎 File:") ? (
                    <a
                      href={m.message.replace("📎 File: ", "")}
                      target="_blank"
                      rel="noreferrer"
                      className="qca-chat-file-link underline font-semibold"
                    >
                      {m.message.split("/").pop()}
                    </a>
                  ) : isHacker ? (
                    hideEnc ? "[Encrypted hidden]" : m.message
                  ) : (
                    `${m.sender === me ? "You: " : "${m.receiver}"}${simulateKyberAesDecrypt(m.message)}`
                  )}
                </motion.div>
              ))}
            <div ref={endRef} />
          </div>

          {!isHacker && (
            <div className="qca-chat-input-wrapper">
              <div className="qca-chat-input-bar">
                <label htmlFor="file-in" className="qca-input-ctrl file-label cursor-pointer border px-3 py-2 rounded bg-slate-700 text-white">
                  {file ? `${file.name}` : "📎"}
                </label>
                <input id="file-in" type="file" className="qca-hidden-file-input" onChange={(e) => setFile(e.target.files[0])} />
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" className="qca-input-ctrl qca-message-input" />
                <button onClick={send} className={`qca-input-ctrl ${accent} hover:bg-amber-700 px-5 text-white rounded`}>
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
  