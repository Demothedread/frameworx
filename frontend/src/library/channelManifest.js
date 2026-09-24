export const sharedResources = {
  media: { image: "image", video: "video", code: "code", text: "text" },
  packages: ["react", "three.js", "socket.io", "web-audio", "knowledge-graph"],
  controls: ["keyboard", "pointer", "touch"],
};

export const channelManifest = [
  {
    id: "field-notes", index: "01", title: "Field Notes", program: "Editorial desk", mood: "paper", media: "text",
    description: "Writing, arguments, research fragments, and annotated source material.",
    resources: ["text", "image", "knowledge-graph"],
    render: () => <article className="program program-notes"><p className="program-kicker">THE WORKING MARGIN</p><h2>Arguments<br/>with their<br/><em>machinery visible.</em></h2><div className="margin-lines"><span>CLAIM</span><span>EVIDENCE</span><span>COUNTERWEIGHT</span></div></article>,
  },
  {
    id: "screen-tests", index: "02", title: "Screen Tests", program: "Moving-image bay", mood: "signal", media: "video",
    description: "Film work, interactive studies, video, motion tests, and media experiments.",
    resources: ["video", "web-audio", "pointer"],
    render: () => <article className="program program-screen"><div className="scanlines"/><p className="program-kicker">SIGNAL / LIVE</p><div className="play-mark">▶</div><h2>MAKE THE<br/>FRAME<br/><em>ANSWER BACK.</em></h2></article>,
  },
  {
    id: "case-files", index: "03", title: "Case Files", program: "Evidence engine", mood: "archive", media: "text",
    description: "Legal research, consumer systems analysis, chronology, and documentary evidence.",
    resources: ["text", "image", "knowledge-graph"],
    render: () => <article className="program program-case"><div className="case-stamp">EXHIBIT / OPEN</div><h2>FACTS ARE<br/>NEVER<br/><em>NEUTRAL.</em></h2><div className="case-tabs"><span>01</span><span>02</span><span>03</span><span>04</span></div></article>,
  },
  {
    id: "signal-room", index: "04", title: "Signal Room", program: "Code console", mood: "terminal", media: "code",
    description: "Programs, tools, agent systems, network experiments, and live interfaces.",
    resources: ["code", "socket.io", "three.js", "keyboard"],
    render: () => <article className="program program-signal"><p className="program-kicker">SYSTEM READY</p><pre>{"> frameworx.run()\n  channel: autonomous\n  media: any\n  state: live_"}</pre><h2>PROGRAMS<br/>WITH THEIR<br/><em>OWN VOLITION.</em></h2></article>,
  },
];
