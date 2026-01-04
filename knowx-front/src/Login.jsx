import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:3001/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);

            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.error || 'Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 2, mt: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sign in to your KnowX account
                </Typography>
            </Box>

            {/* Formulaire */}
            <Paper elevation={3} sx={{ p: 4 }}>
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        margin="normal"
                        variant="outlined"
                        placeholder="Enter your email"
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        margin="normal"
                        variant="outlined"
                        placeholder="Enter your password"
                    />

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<LoginIcon />}
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{" "}
                        <Link 
                            to="/signup" 
                            style={{ 
                                color: '#ff9bb3', 
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
