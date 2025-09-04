import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import Login from './Login';
import Profile from './Profile';
import Home from './Home';
import CreateOffer from './CreateOffer';
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/signup" replace />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-offer" element={<CreateOffer />} />
            </Routes>
        </Router>
    );
}

export default App;
