import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateOffer = () => {
    const [title, setTitle] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3001/api/offers', {
                title,
                skills_offered: skills.split(',').map(skill => skill.trim()),
                description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Offer created !');
            navigate('/home');
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div>
            <h2>Create an offer</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) =>
                    setTitle(e.target.value)} required />
                <input type="text" placeholder="Skills (separated by commas)"
                    value={skills} onChange={(e) => setSkills(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) =>
                    setDescription(e.target.value)} required />
                <button type="submit">Publish</button>
            </form>
        </div>
    );
};

export default CreateOffer;
