import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

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

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // handle form submit
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
                setTimeout(() => navigate("/home"), 1000); // redirection after 2sec
          
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
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h2>Welcome!</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="last_name"
                    placeholder="Enter your name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    name="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={styles.button}
                >
                    Sign up
                </button>
            </form>
            {message && <p>{message}</p>}
            <p>- or -</p>
            <p>
                Have an account?
                <span onClick={() => navigate('/login')} style={{ color: 'blue', cursor: 'pointer' }}>
                    Sign in
                </span>
            </p>
        </div>
    );
}

const styles = {
    input: {
        display: "block",
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#f8a5a5",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
};

export default SignupForm;
