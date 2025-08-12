// Notification.js
import React from "react";

export default function Notification({ message, onClose }) {
  return (
    <div
      style={{
        background: "#222",
        color: "#fff",
        padding: "12px 20px",
        margin: "8px 0",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minWidth: "220px",
        maxWidth: "320px",
        fontSize: "1rem",
        position: "relative",
      }}
    >
      {message}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 4,
          right: 8,
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "1.2em",
          cursor: "pointer",
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}