import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const socket = io(SERVER_URL);

function UserPage() {
	const [name, setName] = useState('');
	const [isNameSet, setIsNameSet] = useState(false);
	const [canBuzz, setCanBuzz] = useState(false);
	const [userResponseTime, setUserResponseTime] = useState(null);
	const [buzzerActivatedAt, setBuzzerActivatedAt] = useState(null);
	const [hasBuzzed, setHasBuzzed] = useState(false);

	useEffect(() => {
		socket.on('buzzerStatus', (status, activationTime) => {
			setCanBuzz(status);
			setBuzzerActivatedAt(activationTime);
			if (!status) {
				setUserResponseTime(null);
				setHasBuzzed(false);
			}
		});

		return () => {
			socket.off('buzzerStatus');
		};
	}, []);

	const handleNameSubmit = () => {
		if (!name) return alert('Enter your name');
		setIsNameSet(true);
	};

	const handleBuzz = async () => {
		if (!canBuzz || hasBuzzed) return;

		const buzzTime = Date.now();
		const responseDuration = buzzTime - buzzerActivatedAt;

		await fetch(`${SERVER_URL}/buzz`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, responseTime: responseDuration }),
		});

		setUserResponseTime(responseDuration);
		setHasBuzzed(true);
		setCanBuzz(false);
	};

	const formatTime = (duration) => {
		if (duration < 1000) {
			return `${duration}ms`;
		}
		return `${(duration / 1000).toFixed(2)}s`;
	};

	return (
		<div className="user-container">
			<h1 className="title">Fastest Finger First</h1>

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

			<button
				className="buzzbutton"
				onClick={handleBuzz}
				disabled={!canBuzz || hasBuzzed}>
				<div className="buzztext">BUZZ</div>
			</button>

			{userResponseTime !== null && (
				<h2 className="response-time">
					Your Response Time: {formatTime(userResponseTime)}
				</h2>
			)}
		</div>
	);
}

export default UserPage;
