import React from "react";
import { sharedResources } from "../library/channelManifest";
export default function ChannelCard({ channel, index, active }) {
  const rotation = index * 90;
  return <section className={"channel-card " + channel.mood + (active ? " is-active" : "")} style={{ "--rotation": rotation + "deg", transform: "rotateY(" + rotation + "deg) translateZ(37vw)" }} aria-hidden={!active}>
    <div className="card-spine"><span>{channel.index}</span><span>{channel.program}</span></div>
    <div className="card-face"><header><span>/ {channel.id}</span><span>{channel.media}</span></header><div className="program-shell">{channel.render()}</div><footer><p>{channel.description}</p><ul>{channel.resources.map((resource) => <li key={resource}>{resource}</li>)}</ul></footer></div>
    <div className="card-back"><span>FRAMEWORX</span><small>{sharedResources.packages.join(" / ")}</small></div>
  </section>;
}
