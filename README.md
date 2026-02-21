# Versusy Admin

React admin panel for managing Versus entities. Requires a Spring Boot backend on `http://localhost:8080`.

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`. API calls are proxied to `http://localhost:8080` under `/api`.

## Backend API (Spring Boot)

The app expects the following endpoints on `localhost:8080`. Mount them under `/api` (e.g. `/api/auth/login`) or adjust the proxy in `vite.config.js`.

### Auth

- **POST `/api/auth/login`**  
  Body: `{ "username": "string", "password": "string" }`  
  - Success: `200` and optionally `{ "token": "jwt..." }` or `{ "username": "..." }`. If `token` is present, the frontend stores it and sends `Authorization: Bearer <token>` on subsequent requests.  
  - Failure: `401` or `4xx` with optional `{ "message": "..." }`.

- **POST `/api/auth/logout`** (optional)  
  Clears server session if you use session-based auth.

### Versus (protected)

- **GET `/api/versus`**  
  Returns an array of versus, e.g.:  
  `[{ "id": 1, "name1": "...", "name2": "...", "image1Url": "...", "image2Url": "..." }]`  
  Use `image1`/`image2` or `image1Url`/`image2Url`; the UI accepts both.

- **GET `/api/versus/:id`**  
  Returns a single versus: `{ "id", "name1", "name2", "image1Url", "image2Url" }`.

- **POST `/api/versus`**  
  Create: `multipart/form-data` with `name1`, `name2`, `image1`, `image2` (files).  
  If your backend expects JSON (e.g. URLs only), you can change `src/api/client.js` to send JSON instead of FormData.

- **PUT `/api/versus/:id`**  
  Update: same as POST (FormData with names and optional image files).

- **DELETE `/api/versus/:id`**  
  Returns `204` or `200` on success.

Ensure CORS allows `http://localhost:3000` if you call the backend by origin instead of using the Vite proxy.
