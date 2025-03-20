const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

let responses = [];
let buzzerActive = false;
let buzzerActivatedAt = null;

app.get('/responses', (req, res) => {
	res.json(responses);
});

app.post('/buzz', (req, res) => {
	if (!buzzerActive) {
		return res.status(403).json({ message: 'Buzzer is disabled' });
	}

	const { name, responseTime } = req.body;
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

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
