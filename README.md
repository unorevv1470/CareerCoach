# CareerCoach – AI Resume and Interview Assistant

A full-stack MERN application where users create a career profile, generate resume content and role-specific interview questions, and revisit saved generations. Admins can view aggregated usage reports.

## Tech stack
- **Frontend:** React, React Router, Fetch API, Context API, Vite
- **Backend:** Node.js, Express, Mongoose, dotenv, bcrypt, jsonwebtoken
- **Database:** MongoDB
- **AI:** Server-side call to an OpenAI-compatible chat-completions API. The API key stays in the backend `.env` file.

## Features
- User registration and login with hashed passwords and JWT authentication
- User/Admin roles and protected admin endpoint
- Validated profile (education, skills, experience, target role)
- AI resume summary and bullet points based on saved profile information
- AI interview questions for a selected role
- Per-user saved generation history with pagination
- Custom per-user daily generation quota middleware (configurable)
- Admin usage report using MongoDB aggregation pipelines
- Postman collection with automated assertions

## Project structure
```text
careercoach/
├── backend/
│   ├── src/config/          # MongoDB connection
│   ├── src/controllers/     # Request handlers
│   ├── src/middleware/      # JWT, roles and quota middleware
│   ├── src/models/          # User, Profile, Generation
│   ├── src/routes/          # API routes
│   ├── src/services/        # AI provider integration
│   ├── src/server.js
│   └── .env.example
├── frontend/
│   ├── src/context/         # Authentication Context API
│   ├── src/components/      # Protected route
│   ├── src/pages/           # Login, register and dashboard
│   └── .env.example
└── postman/CareerCoach.postman_collection.json
```

## Setup and run
### Requirements
Install Node.js 18+ and MongoDB Community Server (or use a MongoDB Atlas connection string).

### 1. Backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env`, then set `MONGO_URI` and a long random `JWT_SECRET`. For a local demo, keep `AI_MOCK=true`. This provides predictable sample outputs so every API route can be tested without an AI provider key. To enable actual AI responses, set `AI_MOCK=false`, add `AI_API_KEY`, and configure `AI_API_URL` / `AI_MODEL` for your OpenAI-compatible provider.

```bash
npm run dev
```
Backend runs at `http://localhost:5000`. Verify `GET http://localhost:5000/api/health`.

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env` if you want to customize the API URL.
```bash
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`). Register and complete your profile.

## API reference
All protected routes require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | API health check |
| POST | `/api/auth/register` | Public | Create account; body: `name`, `email`, `password` |
| POST | `/api/auth/login` | Public | Login; body: `email`, `password` |
| GET | `/api/auth/me` | User | Current authenticated user |
| GET | `/api/profile` | User | Get own profile |
| PUT | `/api/profile` | User | Create/update own profile |
| POST | `/api/generations/resume` | User + quota | Generate resume summary and bullets |
| POST | `/api/generations/interview` | User + quota | Generate questions; body: `{ "role": "UI/UX Designer" }` |
| GET | `/api/generations/history?page=1&limit=10` | User | Own generation history |
| GET | `/api/admin/usage` | Admin | Aggregated usage report |

Profile body example:
```json
{
  "education": ["B.Tech Computer Science, 2025-2029"],
  "skills": ["Figma", "Communication"],
  "experience": ["Student volunteer"],
  "targetRole": "UI/UX Designer"
}
```

## Admin setup
New registrations intentionally receive the `user` role. To promote a test account, use MongoDB Compass or `mongosh` and update the chosen account:
```javascript
use careercoach
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```
Log in again as that account and use the returned JWT as `adminToken` in Postman. Never expose an admin role selector in public registration.

## Postman testing (required submission evidence)
1. Start MongoDB and the backend. Keep `AI_MOCK=true` for deterministic local API testing.
2. Import `postman/CareerCoach.postman_collection.json` into Postman.
3. Run requests **1–9 in order**. The collection stores the registration/login JWT in its `token` variable and runs assertions for successful responses.
4. For request 10, promote a separate account to `admin` using the command above, log in as that account in Postman, and paste its JWT into the collection's `adminToken` variable. Then run the admin report request.
5. Capture genuine screenshots from the Postman response pane. Ensure each screenshot shows the request name/endpoint, HTTP status, and response body. Include at least: registration (201), login (200), profile save (200), resume generation (201), interview generation (201), history (200), and admin usage report (200).
6. Save screenshots in `docs/postman-screenshots/` in this repository and embed them below. Do not submit empty placeholders; replace these instructions with your actual screenshots before submission.

### Postman output screenshots
Add the actual screenshots to `docs/postman-screenshots/` and keep the image names below, or update the paths to match your filenames.

| API | Screenshot |
|---|---|
| Register | `docs/postman-screenshots/01-register.png` |
| Login | `docs/postman-screenshots/02-login.png` |
| Save profile | `docs/postman-screenshots/03-save-profile.png` |
| Generate resume | `docs/postman-screenshots/04-resume.png` |
| Generate interview questions | `docs/postman-screenshots/05-interview.png` |
| Generation history | `docs/postman-screenshots/06-history.png` |
| Admin usage report | `docs/postman-screenshots/07-admin-report.png` |

> **Submission reminder:** The screenshot files themselves must be committed to GitHub. A list of expected filenames is not a substitute for the screenshots.

## Push to GitHub
Create a new GitHub repository, then from this project folder:
```bash
git init
git add .
git commit -m "Build CareerCoach AI resume and interview assistant"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
Do not commit `.env` files or real API keys. Commit `.env.example` files instead.

## Notes
- The daily quota defaults to 10 generated items per user and resets at local server midnight. Configure it with `USER_DAILY_LIMIT`.
- AI calls are made only by the backend. The frontend never receives the provider key.
- Generated text is a drafting aid. Users should review it for accuracy before using it in job applications.
