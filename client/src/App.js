import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from './UserPage';
import Admin from './Admin';
import './App.css';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<UserPage />} />
				<Route path="/admin" element={<Admin />} />
			</Routes>
		</Router>
	);
}

export default App;
