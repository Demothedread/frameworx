import React, { useEffect, useState } from "react";
import { channelManifest } from "../library/channelManifest";
import ChannelCard from "./ChannelCard";

export default function RolodexDeck() {
  const [active, setActive] = useState(0);
  const move = (direction) => setActive((current) => (current + direction + channelManifest.length) % channelManifest.length);
  useEffect(() => {
    const keydown = (event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); };
    window.addEventListener("keydown", keydown); return () => window.removeEventListener("keydown", keydown);
  }, []);
  return <section className="rolodex" aria-label="Frameworx channel rolodex">
    <header className="rolodex-header"><p>FRAMEWORX / PERSONAL SYSTEM</p><span>{String(active + 1).padStart(2, "0")} — {String(channelManifest.length).padStart(2, "0")}</span></header>
    <div className="deck-window"><div className="deck" style={{ transform: "rotateY(" + (-active * 90) + "deg)" }}>
      {channelManifest.map((channel, index) => <ChannelCard channel={channel} index={index} key={channel.id} active={index === active} />)}
    </div></div>
    <nav className="deck-controls" aria-label="Rolodex controls"><button onClick={() => move(-1)} aria-label="Previous channel">← PREV</button>
      <div>{channelManifest.map((channel, index) => <button key={channel.id} onClick={() => setActive(index)} className={active === index ? "active" : ""} aria-label={channel.title}>{channel.index}</button>)}</div>
      <button onClick={() => move(1)} aria-label="Next channel">NEXT →</button>
    </nav>
  </section>;
}
