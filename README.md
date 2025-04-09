# 🎯 Real-Time Quiz Game

A real-time quiz game application with a buzzer-like system and dynamic leaderboard. The game consists of an admin panel to control the quiz flow and a user interface where participants submit answers. Built using **React** for frontend and **Node.js + Socket.IO** for backend.

---

## 🚀 Features

- 🔄 Real-time question & answer sync with Socket.IO
- 🧠 Quiz question upload via Excel file (admin)
- ⏱ Server-side response time tracking (accurate & fair)
- 🔐 Admin control panel (question flow, timing, and results)
- 🧑‍💻 Easy user interface
- 📊 Response dashboard with timestamps and correctness

---

## 🧾 Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Excel Template](#excel-template)
- [Admin & User Instructions](#admin--user-instructions)
- [Deployment on Render](#deployment-on-render)
- [Troubleshooting](#troubleshooting)

---

## 🌐 Demo

Access the game:

- **User Panel:**  
  `https://fff-buzzer.onrender.com/#/`

- **Admin Panel:**  
  `https://fff-buzzer.onrender.com/#/admin`

---

## ⚙️ Tech Stack

- **Frontend:** React, React Router (HashRouter), CSS Modules
- **Backend:** Express.js, Socket.IO, Multer, XLSX
- **Deployment:** Render.com (frontend + backend)

---

## 🛠 Getting Started

### 📦 Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create a `.env` file:
   ```
   PORT=5000
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   node index.js
   ```

> The backend handles socket communication, Excel parsing, question state, and response time tracking.

---

### 💻 Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Create a `.env` file:
   ```
   REACT_APP_SERVER_URL=http://localhost:5000
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm start
   ```

> Frontend uses `HashRouter` for deployment compatibility (no route-based reload issues).

---

## 📄 Excel Template

Upload a `.xlsx` file with **exact** column headers:

| Question                        | OptionA           | OptionB           | OptionC         | OptionD         | CorrectAnswer        |
|---------------------------------|-------------------|-------------------|------------------|------------------|----------------------|
| What is 2+2?                    | 2                 | 3                 | 4                | 5                | 4                    |
| Capital of India?              | Mumbai            | Delhi             | Kolkata          | Chennai          | Delhi                |

### ✅ Important Rules:
- First row must be headers.
- `CorrectAnswer` should exactly match one of the options.
- Upload via the admin panel using the “Upload Questions” button.

---

## 🧑‍💻 Admin & User Instructions

### 👨‍🏫 Admin Instructions

1. Access the admin panel:
   ```
   http://localhost:3000/#/admin
   ```

2. Upload Excel file:
   - Click “Upload Questions”.
   - A 3-second confirmation dialog shows on success.

3. Start Question:
   - Click “Start Next Question”.
   - Users can respond for 30 seconds.
   - Responses collected only during this window.

4. Monitor Answers:
   - Live feed of responses, with name, answer, correctness, timestamp, and response time.

---

### 👨‍🎓 User Instructions

1. Access the user panel:
   ```
   http://localhost:3000/#/
   ```

2. Enter your name (one-time):
   - Field gets disabled after submission.

3. Wait for question:
   - Appears automatically when admin starts it.

4. Submit answer:
   - Options shown in 2-column grid:
     - Column 1: Option A & B
     - Column 2: Option C & D
   - Click one within 30 seconds.

5. Feedback:
   - Blue glowing border at first.
   - Green for correct, red for incorrect options after timeout or answer submission.

---

## 🌍 Deployment on Render

### Frontend

1. Build React app:
   ```bash
   npm run build
   ```

2. Deploy on Render as a static site:
   - Use `HashRouter` to prevent route mismatch.
   - Access `/#/admin` and `/#/` reliably.

### Backend

1. Deploy Express app as a Web Service.
2. Set environment variable:
   - `PORT=10000` or any available port.

---

## 🧪 Troubleshooting

### Admin Page Not Accessible?

- Use hash-based routing (`/#/admin`) instead of `/admin`.

### Excel Upload Not Working?

- Check column names.
- File must be `.xlsx`.

### Delayed or Inconsistent Response Times?

- All response times are recorded **server-side**, eliminating client delay inconsistencies.

---

## 📜 License

Open-source under the [MIT License](LICENSE)

---

## 💬 Contact

Made by [Arman Kumar Mishra]
```

---
