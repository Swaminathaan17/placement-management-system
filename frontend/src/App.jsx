import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Sections from './pages/Sections';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                />
                <Route
                    path="/students"
                    element={<ProtectedRoute><Students /></ProtectedRoute>}
                />
                <Route
                    path="/sections"
                    element={<ProtectedRoute><Sections /></ProtectedRoute>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
