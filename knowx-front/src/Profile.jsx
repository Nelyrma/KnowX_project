
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [skillsOffered, setSkillsOffered] = useState('');
    const [skillsWanted, setSkillsWanted] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:3001/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setSkillsOffered(res.data.skills_offered?.join(', ') || '');
                setSkillsWanted(res.data.skills_wanted?.join(', ') || '');
            } catch (err) {
                console.error('Error', err);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.patch('http://localhost:3001/auth/profile', {
                skills_offered: skillsOffered.split(',').map(s => s.trim()),
                skills_wanted: skillsWanted.split(',').map(s => s.trim())
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('✅ Profile updated !');
            navigate('/home');
        } catch (err) {
            alert('❌ Error: ' + (err.response?.data?.error || err.message));
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
    <div style={{ padding: '20px' }}>
        <h2>Edit my profile</h2>
        <p>Name: {user.first_name} {user.last_name}</p>
      
        <div>
            <label>Skills offered (separated by commas):</label>
            <input 
                type="text" 
                value={skillsOffered} 
                onChange={(e) => setSkillsOffered(e.target.value)}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
        </div>

        <div>
            <label>Required skills (separated by commas):</label>
            <input 
                type="text" 
                value={skillsWanted} 
                onChange={(e) => setSkillsWanted(e.target.value)}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
        </div>

        <button onClick={handleUpdate} style={{ marginTop: '10px', padding: '10px' }}>
            💾 Save
        </button>
    </div>
    );
};

export default Profile;
