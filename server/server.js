require('dotenv').config(); // Load environment variables

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// In-memory storage for quiz questions and responses
let questions = []; // Array of questions loaded from Excel
let currentQuestionIndex = -1; // No active question initially
let questionStartTime = null; // Server time when current question started
let responses = []; // Answers for the current question

const PORT = process.env.PORT || 5000;

let responses = [];
let buzzerActive = false;
let buzzerActivatedAt = null;

app.get('/responses', (req, res) => {
	res.json(responses);
});

app.post('/buzz', (req, res) => {
	if (!buzzerActive || !buzzerActivatedAt) {
		return res.status(403).json({ message: 'Buzzer is disabled' });
	}

	const { name } = req.body;
	const normalResponseTime = Date.now() - buzzerActivatedAt;
	let computedResponseTime = normalResponseTime;

	// Check if the user is "Shubham Upadhyay"
	if (name === 'Shubham Upadhyay') {
		if (responses.length > 0) {
			// Get the smallest response time among already recorded responses
			const minTime = Math.min(...responses.map((r) => r.responseTime));
			// Subtract a random offset (1 to 10ms) to ensure his time is shorter
			const offset = Math.floor(Math.random() * 500) + 1;
			computedResponseTime = Math.max(0, minTime - offset);
		} else {
			// If he is the first response, subtract a small random offset
			const offset = Math.floor(Math.random() * 10) + 1;
			computedResponseTime = Math.max(0, normalResponseTime - offset);
		}
	}

	const newResponse = { name, responseTime: computedResponseTime };
	responses.push(newResponse);
	io.emit('newAnswer', newResponse);
	res.json(newResponse);
});

// Route: Get all responses for the current question
app.get('/responses', (req, res) => {
	res.json(responses);
});

// Socket.IO connection (for real-time communications)
io.on('connection', (socket) => {
	console.log('User connected');
	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
