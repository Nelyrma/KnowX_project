import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import SignupForm from './SignupForm';
import Login from './Login';
import Profile from './Profile';
import Home from './Home';
import CreateOffer from './CreateOffer';
import EditOffer from './EditOffer';
import OfferDetail from './OfferDetail';
import ProtectedRoute from './ProtectedRoute';
import MessagesPage from './MessagesPage';


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
                    <Route
                        path="/edit-offer/:id"
                        element={
                            <ProtectedRoute>
                                <EditOffer />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/offer/:id"
                        element={
                            <ProtectedRoute>
                                <OfferDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <MessagesPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
