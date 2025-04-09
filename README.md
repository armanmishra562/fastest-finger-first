# 🎯 Real-Time Quiz Game

A real-time quiz game with buzzer functionality. Admin can control question flow and track answers. Users participate live with fair server-side response timing.

---

## 📚 Table of Contents

- [🌐 Demo](#-demo)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Features](#-features)
- [🛠 Getting Started](#-getting-started)
  - [📦 Backend Setup](#-backend-setup)
  - [💻 Frontend Setup](#-frontend-setup)
- [📄 Excel Template](#-excel-template)
- [👨‍🏫 Admin & User Instructions](#-admin--user-instructions)
  - [👨‍🏫 Admin Instructions](#-admin-instructions)
  - [👨‍🎓 User Instructions](#-user-instructions)
- [🌍 Deployment on Render](#-deployment-on-render)
- [🧪 Troubleshooting](#-troubleshooting)
- [📜 License](#-license)
- [💬 Contact](#-contact)

---

## 🌐 Demo

- **User Panel:**  
  [`https://fff-buzzer.onrender.com/#/`](https://fff-buzzer.onrender.com/#/)

- **Admin Panel:**  
  [`https://fff-buzzer.onrender.com/#/admin`](https://fff-buzzer.onrender.com/#/admin)

---

## ⚙️ Tech Stack

- **Frontend:** React, React Router (`HashRouter`)
- **Backend:** Node.js, Express, Socket.IO, XLSX
- **Deployment:** Render.com

---

## 🚀 Features

- Real-time quiz & response sync
- Server-based response time recording
- Excel-based question upload
- Question timers (30s)
- Visual feedback with color-coded options
- Glowing effect on new questions
- Admin panel to control flow
- Accurate leaderboard & answer display

---

## 🛠 Getting Started

### 📦 Backend Setup

```bash
cd server
```

1. Create a `.env` file:
   ```env
   PORT=5000
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the backend:
   ```bash
   node index.js
   ```

---

### 💻 Frontend Setup

```bash
cd client
```

1. Create a `.env` file:
   ```env
   REACT_APP_SERVER_URL=http://localhost:5000
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start frontend:
   ```bash
   npm start
   ```

---

## 📄 Excel Template

Upload an Excel file (`.xlsx`) with the following structure:

| Question             | OptionA | OptionB | OptionC | OptionD | CorrectAnswer |
|----------------------|---------|---------|---------|---------|----------------|
| What is 2+2?         | 2       | 3       | 4       | 5       | 4              |
| Capital of India?    | Mumbai  | Delhi   | Kolkata | Chennai | Delhi          |

- **Headers must be present.**
- **CorrectAnswer must match one of the options.**

---

## 👨‍🏫 Admin & User Instructions

### 👨‍🏫 Admin Instructions

1. Access admin panel:  
   `http://localhost:3000/#/admin`

2. Upload Excel:
   - Use **Upload Questions**
   - Confirmation shown for 3 seconds

3. Start questions:
   - Click **Start Next Question**
   - Accept answers for 30 seconds
   - Responses close automatically

4. Response Results:
   - Answers displayed with name, timestamp, and correctness
   - Color-coded (green/red)

---

### 👨‍🎓 User Instructions

1. Access user panel:  
   `http://localhost:3000/#/`

2. Enter name once
3. Wait for question to appear
4. Select answer within 30 seconds
5. Feedback:
   - Blue glow for active options
   - Green for correct answer
   - Red for incorrect options after timeout or submission

---

## 🌍 Deployment on Render

### Frontend

1. Build:
   ```bash
   npm run build
   ```

2. Deploy as a **static site** on Render:
   - Use **HashRouter** for routing

### Backend

- Deploy as a **web service**
- Set environment variable:
  ```
  PORT=10000
  ```

---

## 🧪 Troubleshooting

| Issue | Solution |
|-------|----------|
| Admin route not working | Use `/#/admin` instead of `/admin` |
| Excel upload fails | Use correct template with headers |
| Delay in responses | All timings are server-calculated |

---

## 📜 License

Licensed under the MIT License.

---

## 💬 Contact

Created by **Arman Kumar Mishra**
