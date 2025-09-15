
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Chip,
    Paper,
    Divider,
    Avatar
} from '@mui/material';
import { Save, ArrowBack, Person } from '@mui/icons-material';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [currentSkillOffered, setCurrentSkillOffered] = useState('');
    const [currentSkillWanted, setCurrentSkillWanted] = useState('');
    const [skillsOffered, setSkillsOffered] = useState([]);
    const [skillsWanted, setSkillsWanted] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:3001/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setSkillsOffered(res.data.skills_offered || []);
                setSkillsWanted(res.data.skills_wanted || []);
            } catch (err) {
                console.error('Error', err);
            }
        };
        fetchProfile();
    }, []);

    const handleAddSkill = (type) => {
        if (type === 'offered' && currentSkillOffered && !skillsOffered.includes(currentSkillOffered)) {
            setSkillsOffered([...skillsOffered, currentSkillOffered]);
            setCurrentSkillOffered('');
        }
        if (type === 'wanted' && currentSkillWanted && !skillsWanted.includes(currentSkillWanted)) {
            setSkillsWanted([...skillsWanted, currentSkillWanted]);
            setCurrentSkillWanted('');
        }
    };

    const handleRemoveSkill = (skillToRemove, type) => {
        if (type === 'offered') {
            setSkillsOffered(skillsOffered.filter(skill => skill !== skillToRemove));
        } else {
            setSkillsWanted(skillsWanted.filter(skill => skill !== skillToRemove));
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.patch('http://localhost:3001/auth/profile', {
                skills_offered: skillsOffered,
                skills_wanted: skillsWanted
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('✅ Profile updated successfully!');
            navigate('/home');
        } catch (err) {
            alert('❌ Error: ' + (err.response?.data?.error || err.message));
        }
    };

    if (!user) return (
        <Container maxWidth="sm">
            <Typography>Loading...</Typography>
        </Container>
    );

    return (
        <Container maxWidth="md">
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pt: 3 }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate('/home')}
                    sx={{ mr: 3, color: 'primary.main' }}
                    variant="outlined"
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Edit My Profile
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Informations utilisateur */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ width: 64, height: 64, mr: 3, bgcolor: 'primary.main' }}>
                        <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h6">
                            {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.email}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Compétences offertes */}
                <Typography variant="h6" gutterBottom>
                    Skills I Can Offer
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Add a skill"
                        value={currentSkillOffered}
                        onChange={(e) => setCurrentSkillOffered(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('offered'))}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => handleAddSkill('offered')}>
                                    Add
                                </Button>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Box>
                        {skillsOffered.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                onDelete={() => handleRemoveSkill(skill, 'offered')}
                                sx={{ m: 0.5 }}
                                color="primary"
                            />
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Compétences recherchées */}
                <Typography variant="h6" gutterBottom>
                    Skills I'm Looking For
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Add a skill"
                        value={currentSkillWanted}
                        onChange={(e) => setCurrentSkillWanted(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('wanted'))}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => handleAddSkill('wanted')}>
                                    Add
                                </Button>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Box>
                        {skillsWanted.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                onDelete={() => handleRemoveSkill(skill, 'wanted')}
                                sx={{ m: 0.5 }}
                                color="secondary"
                            />
                        ))}
                    </Box>
                </Box>

                {/* Bouton de sauvegarde */}
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleUpdate}
                    startIcon={<Save />}
                    sx={{ mt: 3 }}
                >
                    Save Changes
                </Button>
            </Paper>
        </Container>
    );
};

export default Profile;
