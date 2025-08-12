// NotificationContainer.js
import React, { useContext, useEffect, useRef, useState } from "react";
import Notification from "./Notification";
import { SharedStateContext } from "../../context/SharedStateContext";

export default function NotificationContainer() {
  const { eventBus } = useContext(SharedStateContext);
  const [notifications, setNotifications] = useState([]);
  const timers = useRef({});

  useEffect(() => {
    if (!eventBus) return;
    const handler = (payload) => {
      const id = Date.now() + Math.random();
      setNotifications((prev) => [
        ...prev,
        { id, message: payload.message || String(payload) },
      ]);
      timers.current[id] = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        delete timers.current[id];
      }, 5000);
    };
    eventBus.on("notification", handler);
    return () => {
      eventBus.off("notification", handler);
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, [eventBus]);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
      }}
      aria-live="polite"
    >
      {notifications.map((n) => (
        <div key={n.id} style={{ pointerEvents: "auto" }}>
          <Notification message={n.message} onClose={() => handleClose(n.id)} />
        </div>
      ))}
    </div>
  );
}