import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const socket = io(SERVER_URL);

function AdminQuiz() {
	const [file, setFile] = useState(null);
	const [uploadMessage, setUploadMessage] = useState('');
	const [currentQuestion, setCurrentQuestion] = useState(null);
	const [responses, setResponses] = useState([]);

	// Handle Excel file change
	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	// Upload questions using the Excel file, then show confirmation for 3 seconds
	const handleUpload = async () => {
		if (!file) return;
		const formData = new FormData();
		formData.append('file', file);
		const res = await fetch(`${SERVER_URL}/upload-questions`, {
			method: 'POST',
			body: formData,
		});
		const data = await res.json();
		setUploadMessage(data.message);
		setTimeout(() => setUploadMessage(''), 3000);
	};

	// Start next quiz question
	const startQuestion = async () => {
		const res = await fetch(`${SERVER_URL}/start-question`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();
		setCurrentQuestion(data.currentQuestion);
		setResponses([]);
	};

	useEffect(() => {
		fetch(`${SERVER_URL}/responses`)
			.then((res) => res.json())
			.then((data) => setResponses(data));

		socket.on('newAnswer', (response) => {
			setResponses((prev) => [...prev, response]);
		});

		socket.on('newQuestion', (qData) => {
			setCurrentQuestion({
				question: qData.question,
				options: qData.options,
				correctAnswer: qData.correctAnswer,
			});
			setResponses([]);
		});

		return () => {
			socket.off('newAnswer');
			socket.off('newQuestion');
		};
	}, []);

	const formatTime = (duration) => {
		return duration < 1000
			? `${duration}ms`
			: `${(duration / 1000).toFixed(2)}s`;
	};

	const formatTimestamp = (timestamp) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString();
	};

	return (
		<div className="admin-container">
			<h1 className="admin-title">Admin Quiz Dashboard</h1>

			<div>
				<input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
				<button className="adminbutton" onClick={handleUpload}>
					Upload Questions
				</button>
				{uploadMessage && <p>{uploadMessage}</p>}
			</div>

			<div className="button-container">
				<button className="adminbutton" onClick={startQuestion}>
					Start Next Question
				</button>
			</div>

			{currentQuestion && (
				<div className="question-display">
					<h2 className="question-text">{currentQuestion.question}</h2>
					<ul className="options-list">
						{currentQuestion.options.map((option, index) => (
							<li key={index} className="option-item">
								{option}
							</li>
						))}
					</ul>
				</div>
			)}

			<h2 className="response-title">Responses</h2>
			<ul className="response-list">
				{responses.map((resp, index) => (
					<li key={index} className="response-item">
						<span className="user-name">{resp.name}</span> -
						<span className="user-answer">{resp.answer}</span> -
						<span className="answer-status">
							{resp.isCorrect ? 'Correct' : 'Wrong'}
						</span>{' '}
						-
						<span className="response-time">
							{formatTime(resp.responseTime)}
						</span>{' '}
						-
						<span className="timestamp">{formatTimestamp(resp.timestamp)}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default AdminQuiz;
