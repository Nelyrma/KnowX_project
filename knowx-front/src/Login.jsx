import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3001/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);  // stock the token
            alert('Connected !');
            navigate('/home'); // Redirect to the home page
        } catch (err) {
            alert('Connection error : ' + (err.response?.data?.error ||
                err.message));
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h2>Welcome back !</h2>
            <input
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ margin: '10px 0', padding: '10px', width: '100%' }}
            />
            <br />
            <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ margin: '10px 0', padding: '10px', width: '100%' }}
            />
            <br />
            <button 
                onClick={handleLogin}
                style={{ padding: '10px', width: '100%', margin: '10px 0' }}
            >
                Login
            </button>
            
            <p>
                Don't have an account?
                <span onClick={() => navigate('/signup')} 
                style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
                    Sign up
                </span>
            </p>
        </div>
    );
};

export default Login;
