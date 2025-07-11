import React from 'react';

export default function LiveVideo() {
  return (
    <section>
      <h2>Live Video Channel</h2>
      <div style={{border: '2px dashed #aaa', padding: 24, textAlign: 'center'}}>
        {/* Plug in a <video> tag, WebRTC or streaming library here */}
        <p style={{color:'#777', fontStyle:'italic'}}>
          Live video streaming goes here.<br />
          To integrate: embed a livestream player, WebRTC, or YouTube Live component.<br />
          <br />
          (See comments in <b>LiveVideo.js</b> for extension guidance)
        </p>
      </div>
    </section>
  );
}
