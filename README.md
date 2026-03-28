# Versusy Admin

React admin panel for managing Versus entities. Requires a Spring Boot backend on `http://localhost:8080`.

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:3001`. API calls are proxied to `http://localhost:8080` under `/api`.

## API paths

All URL paths relative to `VITE_API_BASE` or `/api` are defined in **`src/api/routes.js`** (`apiRoutes`). Change that file if your Spring app uses different prefixes or segments.

## Backend API (Spring Boot)

The app expects the following endpoints on `localhost:8080`. Mount them under `/api` (e.g. `/api/auth/login`) or adjust `src/api/routes.js` / the Vite proxy.

### Auth

- **POST `/api/v1/auth/login`** (see `src/api/client.js` for the exact path)  
  Body: `{ "email": "string", "password": "string" }`  
  - Success: `200` with JSON including **`accessToken`** (required) and optionally **`refreshToken`**. The app stores both in `localStorage` and sends `Authorization: Bearer <accessToken>` on every versus (and other authenticated) request.  
  - Failure: `401` or `4xx` with optional `{ "message": "..." }`.

- **POST `/api/v1/auth/logout`** (optional)  
  Called with the same Bearer header if present; the app always clears stored tokens locally afterward.

### Versus (protected)

- **GET `/api/versus`**  
  Returns an array of versus. Images can be sent either as URLs or as **Base64** (e.g. Spring `byte[]` in JSON, which Jackson serializes as Base64):  
  - URLs: `image1Url`, `image2Url` (or `image1`/`image2` as URL strings).  
  - Base64: `image1`, `image2` as Base64 strings; optional `image1ContentType`, `image2ContentType` (default `image/jpeg`).  
  Example: `[{ "id": 1, "name1": "A", "name2": "B", "image1": "<base64>", "image2": "<base64>" }]`

- **GET `/api/versus/:id`**  
  Returns a single versus: `{ "id", "name1", "name2", "image1Url", "image2Url" }`.

- **POST `/api/versus`**  
  Create: `multipart/form-data` with `name1`, `name2`, `image1`, `image2` (files).  
  If your backend expects JSON (e.g. URLs only), you can change `src/api/client.js` to send JSON instead of FormData.

- **PUT `/api/versus/:id`**  
  Update: same as POST (FormData with names and optional image files).

- **DELETE `/api/versus/:id`**  
  Returns `204` or `200` on success.

### Users (protected)

- **GET `/api/users`** – List users (array or Spring `Page` / `_embedded.users`).
- **POST `/api/users`** – Create user; body `{ "email", "password" }` (adjust `createUser` in `client.js` if your DTO differs).
- **DELETE `/api/users/:id`** – Delete user by id.

Ensure CORS allows `http://localhost:3001` if you call the backend by origin instead of using the Vite proxy.

## GitHub Pages

The app is set up to deploy to **https://dario1899.github.io/versusy-admin/**.

1. **Enable GitHub Pages** in the repo: **Settings → Pages → Source** → “Deploy from a branch”. Choose branch `gh-pages`, folder `/ (root)`, Save.

2. **Deploy** from your machine:
   ```bash
   npm install
   npm run deploy
   ```
   This builds the app, copies `index.html` to `404.html` (so client-side routes work), and pushes the `dist` output to the `gh-pages` branch.

3. **Backend URL when deployed:** On GitHub Pages there is no proxy. Set your API base URL at build time, e.g. create `.env.production`:
   ```
   VITE_API_BASE=https://your-spring-boot-server.com/api
   ```
   Then run `npm run deploy` again. Ensure the backend allows CORS from `https://dario1899.github.io`.
