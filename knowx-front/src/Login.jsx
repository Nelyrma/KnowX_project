import { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3001/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);  // stock the token
            alert('Connected !');
        } catch (err) {
            alert('Connection error');
        }
    };

    return (
        <div>
            <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
