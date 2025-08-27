
import { useState, useEffect } from "react";
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:3001/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.error('Error retrieving profile', err);
            }
        };
        fetchProfile();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Profile of {user.first_name} {user.last_name}</h1>
            <p>Email: {user.email}</p>
            <h3>Skills offered:</h3>
            <ul>
                {user.skills_offered.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
            <h3>Desired skills</h3>
            <ul>
                {user.skills_wanted.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;
