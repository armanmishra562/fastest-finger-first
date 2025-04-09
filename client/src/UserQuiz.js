import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const socket = io(SERVER_URL);

function UserQuiz() {
	const [name, setName] = useState('');
	const [isNameSet, setIsNameSet] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState(null);
	const [hasAnswered, setHasAnswered] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState('');
	const [feedback, setFeedback] = useState('');
	const [timeOver, setTimeOver] = useState(false);

	// Start a 30-second timer when a new question is received
	useEffect(() => {
		socket.on('newQuestion', (qData) => {
			setCurrentQuestion({
				question: qData.question,
				options: qData.options,
				correctAnswer: qData.correctAnswer,
			});
			setHasAnswered(false);
			setSelectedAnswer('');
			setFeedback('');
			setTimeOver(false);
			// Start a timeout of 30 seconds to indicate time is over
			const timer = setTimeout(() => setTimeOver(true), 30000);
			return () => clearTimeout(timer);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, []);

	const handleNameSubmit = () => {
		if (!name) return alert('Enter your name');
		setIsNameSet(true);
	};

	const handleAnswer = async (answer) => {
		if (hasAnswered || timeOver) return;
		setSelectedAnswer(answer);
		const res = await fetch(`${SERVER_URL}/answer`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, answer }),
		});
		const data = await res.json();
		// Check if answer submission was accepted
		if (res.ok) {
			setHasAnswered(true);
			setFeedback(data.isCorrect ? 'Correct!' : 'Wrong Answer');
		} else {
			setFeedback(data.message);
		}
	};

	// Determine CSS class for option item based on answer state
	const getOptionClass = (option) => {
		if (!currentQuestion) return 'option-item';
		// Before answering, glow blue
		if (!hasAnswered && !timeOver) return 'option-item glowing-blue';
		// After answering or time over, mark borders:
		if (option === currentQuestion.correctAnswer) return 'option-item correct';
		if (option === selectedAnswer && option !== currentQuestion.correctAnswer)
			return 'option-item wrong';
		return 'option-item';
	};

	return (
		<div className="user-container">
			<h1 className="title">Quiz Game</h1>

			<div className="input-group">
				<input
					required=""
					name="text"
					autoComplete="off"
					className="input"
					type="text"
					placeholder=""
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={isNameSet}
				/>
				<label className="user-label">Your Name</label>
			</div>

			{!isNameSet && (
				<button className="subbutton" onClick={handleNameSubmit}>
					Submit Name
				</button>
			)}

			{currentQuestion && (
				<div className="question-container">
					<h2 className="question-text">{currentQuestion.question}</h2>
					<div className="options-grid">
						<div className="column">
							{currentQuestion.options.slice(0, 2).map((option, index) => (
								<div
									key={index}
									className={getOptionClass(option)}
									onClick={() => handleAnswer(option)}>
									{option}
								</div>
							))}
						</div>
						<div className="column">
							{currentQuestion.options.slice(2).map((option, index) => (
								<div
									key={index}
									className={getOptionClass(option)}
									onClick={() => handleAnswer(option)}>
									{option}
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{hasAnswered || timeOver ? (
				<h2 className="feedback">{feedback}</h2>
			) : null}
		</div>
	);
}

export default UserQuiz;
