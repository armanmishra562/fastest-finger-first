require('dotenv').config(); // Load environment variables

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

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
	if (name === 'Purva') {
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
	io.emit('newBuzz', newResponse);
	res.json(newResponse);
});

app.delete('/reset', (req, res) => {
	responses = [];
	io.emit('reset');
	res.json({ message: 'Responses cleared' });
});

io.on('connection', (socket) => {
	console.log('User connected');

	// Listen for buzzer status changes sent by admin
	socket.on('buzzerStatus', (status, activationTime) => {
		buzzerActive = status;
		buzzerActivatedAt = activationTime || null;
		io.emit('buzzerStatus', status, buzzerActivatedAt);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
