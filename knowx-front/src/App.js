import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import SignupForm from './SignupForm';
import Login from './Login';
import Profile from './Profile';
import Home from './Home';
import CreateOffer from './CreateOffer';
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
        </ThemeProvider>
    );
}

export default App;
