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

// In-memory storage for responses
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
	// Compute response time on the server side
	const responseTime = Date.now() - buzzerActivatedAt;
	const newResponse = { name, responseTime };
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
