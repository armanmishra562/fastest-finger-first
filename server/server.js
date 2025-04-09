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

// Configure multer for file uploads (Excel files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route: Upload quiz questions via Excel file
// Expected Excel columns: "Question", "OptionA", "OptionB", "OptionC", "OptionD", "CorrectAnswer"
app.post('/upload-questions', upload.single('file'), (req, res) => {
	try {
		const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data = XLSX.utils.sheet_to_json(sheet);

		// Map each row into a question object
		questions = data.map((row) => ({
			question: row.Question,
			options: [row.OptionA, row.OptionB, row.OptionC, row.OptionD],
			correctAnswer: row.CorrectAnswer,
		}));

		// Reset state for a fresh quiz
		currentQuestionIndex = -1;
		responses = [];
		questionStartTime = null;

		res.json({
			message: 'Questions uploaded successfully',
			questionsCount: questions.length,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error processing Excel file' });
	}
});

// Route: Admin starts a new question
app.post('/start-question', (req, res) => {
	if (questions.length === 0) {
		return res
			.status(400)
			.json({ message: 'No questions available. Please upload questions.' });
	}
	currentQuestionIndex++;
	if (currentQuestionIndex >= questions.length) {
		currentQuestionIndex = 0; // Loop back if end is reached
	}
	responses = []; // Clear previous responses
	questionStartTime = Date.now(); // Capture the start time

	const currentQuestion = questions[currentQuestionIndex];
	// Broadcast the question (including the correct answer for later highlighting, but hidden until time is up)
	io.emit('newQuestion', {
		questionIndex: currentQuestionIndex,
		question: currentQuestion.question,
		options: currentQuestion.options,
		correctAnswer: currentQuestion.correctAnswer,
	});
	res.json({ message: 'Question started', currentQuestion });
});

// Route: User submits their answer
app.post('/answer', (req, res) => {
	if (currentQuestionIndex === -1 || !questionStartTime) {
		return res.status(400).json({ message: 'No active question.' });
	}
	// Check if answer is submitted within 30 seconds
	if (Date.now() - questionStartTime > 30000) {
		return res.status(400).json({ message: 'Time for answering has expired.' });
	}

	const { name, answer } = req.body;
	const currentQuestion = questions[currentQuestionIndex];
	const isCorrect =
		answer.trim().toLowerCase() ===
		currentQuestion.correctAnswer.trim().toLowerCase();

	// Compute response time on server side
	const responseTime = Date.now() - questionStartTime;
	const newResponse = {
		name,
		answer,
		isCorrect,
		responseTime,
		timestamp: Date.now(),
	};
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
