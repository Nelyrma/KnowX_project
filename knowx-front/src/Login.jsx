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
        <div style={{ padding: '20px' }}>
            <h2>Welcome back !</h2>
            <input
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
