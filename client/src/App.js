import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AdminQuiz from './AdminQuiz';
import UserQuiz from './UserQuiz';
import './App.css';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<UserQuiz />} />
				<Route path="/admin" element={<AdminQuiz />} />
			</Routes>
		</Router>
	);
}

export default App;
