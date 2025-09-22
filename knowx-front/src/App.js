import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import SignupForm from './SignupForm';
import Login from './Login';
import Profile from './Profile';
import Home from './Home';
import CreateRequest from './CreateRequest';
import EditRequest from './EditRequest';
import RequestDetail from './RequestDetail';
import ProtectedRoute from './ProtectedRoute';
import MessagesPage from './MessagesPage';
import MyRequests from './MyRequests';
import ConversationsPage from './ConversationsPage';
import ConversationDetailPage from './ConversationDetailPage';

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
                    <Route path="/create-request" element={<CreateRequest />} />
                    <Route
                        path="/edit-request/:id"
                        element={
                            <ProtectedRoute>
                                <EditRequest />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/offer/:id"
                        element={
                            <ProtectedRoute>
                                <RequestDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/messages" element={<ConversationsPage />} />
                    <Route path="/conversation/:userId" element={<ConversationDetailPage />} />
                    <Route
                        path="/my-requests"
                        element={
                            <ProtectedRoute>
                                <MyRequests />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
