import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const socket = io(SERVER_URL);

function Admin() {
	const [responses, setResponses] = useState([]);
	const [canBuzz, setCanBuzz] = useState(false);

	useEffect(() => {
		fetchResponses();

		socket.on('newBuzz', (user) => {
			setResponses((prev) => [...prev, user]);
		});

		socket.on('reset', () => {
			setResponses([]);
		});

		return () => {
			socket.off('newBuzz');
			socket.off('reset');
		};
	}, []);

	const fetchResponses = async () => {
		const res = await fetch(`${SERVER_URL}/responses`);
		const data = await res.json();
		setResponses(data);
	};

	const handleReset = async () => {
		await fetch(`${SERVER_URL}/reset`, { method: 'DELETE' });
		setResponses([]);
		alert('Responses cleared');
	};

	const enableBuzzers = () => {
		const activationTime = Date.now();
		setCanBuzz(true);
		socket.emit('buzzerStatus', true, activationTime);

		setTimeout(() => {
			setCanBuzz(false);
			socket.emit('buzzerStatus', false);
		}, 10000);
	};

	const formatTime = (duration) => {
		if (duration < 1000) {
			return `${duration}ms`;
		}
		return `${(duration / 1000).toFixed(2)}s`;
	};

	return (
		<div className="admin-container">
			<h1 className="admin-title">Admin Dashboard</h1>
			<div className="button-container">
				<button
					className="adminbutton"
					id="acceptbutton"
					onClick={enableBuzzers}>
					Accept Responses
				</button>
				<button className="adminbutton" id="resetbutton" onClick={handleReset}>
					Reset Responses
				</button>
			</div>

			<h2 className="response-title">Responses</h2>
			<ul className="response-list">
				{responses.map((user, index) => (
					<li key={index} className="response-item">
						<span className="user-name">{user.name}</span>
						<span className="response-time">
							{formatTime(user.responseTime)}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Admin;
