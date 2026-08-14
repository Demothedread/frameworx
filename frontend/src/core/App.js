import React from "react";
import RolodexDeck from "../components/RolodexDeck";
import "../styles/frameworx.css";

export default function App() {
  return <main className="frameworx-app">
    <RolodexDeck />
    <section className="shared-library">
      <p>SHARED LIBRARY / COMMON GROUND</p>
      <h1>Every card is a<br/><em>small sovereign program.</em></h1>
      <div><span>Media adapters</span><span>Interaction controls</span><span>Resource registry</span><span>Content mapping</span></div>
    </section>
  </main>;
}
