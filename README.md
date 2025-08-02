# Channel Rolodex (Full Stack Sample)

A modular channel-based web framework for flipping between fully-contained functional "cards"—like TV channels or a rolodex.

## Quickstart (Full Stack, Full Auto)

1. **Backend:**
    ```sh
    cd backend
    npm install
    node index.js
    ```

    - Serves APIs at `http://localhost:4000/api/*`.
    - Serves static gallery images at `http://localhost:4000/images/a.jpg` etc.
    - API sample: curl http://localhost:4000/api/gallery

2. **Frontend:**
    ```sh
    cd frontend
    npm install
    npm start
    ```

    - Runs React app at `http://localhost:3000`.
    - Proxies API/image requests to backend; your gallery will display actual photos.

Open `http://localhost:3000` in your browser.

---

## Add a Channel

- **Frontend:**
  - Add a new React file in `frontend/src/components/channels/`.
  - Register it in `ChannelContainer.js` for easy plug-in.
- **Backend (optional):**
  - Make a new file in `backend/api/` if you want API endpoints.
- **Shared Utilities:**
  - Put reusable code in `src/utils/` or `backend/utils/`.

**Extension points are commented in the code!* *

---

Channels implemented:

- Landing (Welcome)
- Gallery (Photo, images served from Express)
- Game (Demo Highscore)
- Mind Map (3D social graph)

---

## FAQs

- *Why don't I see real photos in the gallery?* — Images are stubbed, you can replace `backend/images/a.jpg` and `b.jpg` with your own.
- *How do I deploy?* —
  - Backend: e.g. on Heroku, fly.io, or any Node host.
  - Frontend: `npm run build` in `frontend/` creates deployable static files, which can be served by Express or any host.
- *How to add real interactivity/live video/etc.?* — Add a new channel, adjust APIs, go wild!

---
Enjoy extending ⚡️
