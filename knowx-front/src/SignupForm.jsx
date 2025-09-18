import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

function SignupForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3001/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("✅ Account created successfully!");
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                setTimeout(() => navigate("/home"), 1000);
            } else {
                setMessage(data.error || "❌ Something went wrong");
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            {/* Header simplifié */}
            <Box sx={{ textAlign: 'center', mb: 4, mt: 8 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main',
                    mb: 1
                }}>
                    Join KnowX
                </Typography>
                <Typography variant="h6" component="h2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your account and start sharing skills
                </Typography>
            </Box>

            {/* Formulaire */}
            <Paper elevation={3} sx={{ p: 4, mb: 8 }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        margin="normal"
                        variant="outlined"
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                        sx={{ 
                            mt: 3, 
                            py: 1.5,
                            fontSize: '1.1rem'
                        }}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>

                    {message && (
                        <Alert severity={message.includes("✅") ? "success" : "error"} sx={{ mt: 2 }}>
                            {message}
                        </Alert>
                    )}
                </form>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                        Already have an account?{" "}
                        <Link 
                            to="/login" 
                            style={{ 
                                color: '#ff9bb3', 
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Sign in here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default SignupForm;
