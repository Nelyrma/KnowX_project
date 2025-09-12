import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Chip,
    InputAdornment,
    Paper
} from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';

const CreateOffer = () => {
    const [title, setTitle] = useState('');
    const [currentSkill, setCurrentSkill] = useState('');
    const [skills, setSkills] = useState([]);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleAddSkill = () => {
        if (currentSkill && !skills.includes(currentSkill)) {
            setSkills([...skills, currentSkill]);
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3001/api/offers', {
                title,
                skills_offered: skills,
                description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('✅ Offer created successfully!');
            navigate('/home');
        } catch (err) {
            alert('❌ Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <Container maxWidth="sm">
            {/* Header avec bouton retour */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                pt: 3,
                borderBottom: 1,
                borderColor: 'divider',
                pb: 3
            }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate('/home')}
                    sx={{ 
                        mr: 3,
                        color: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                            transform: 'translateX(-2px)',
                            transition: 'all 0.2s ease'
                        }
                    }}
                    variant="outlined"
                    size="medium"
                >
                    Back
                </Button>
                <Typography 
                    variant="h4" 
                    component="h1"
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'text.primary',
                        flexGrow: 1
                    }}
                >
                    Create New Offer
                </Typography>
            </Box>

            {/* Formulaire dans une carte */}
            <Paper elevation={3} sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                    {/* Titre */}
                    <TextField
                        fullWidth
                        label="Offer Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        required
                        placeholder="ex: Need help with JavaScript"
                    />

                    {/* Compétences avec chips */}
                    <TextField
                        fullWidth
                        label="Skills Wanted"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        margin="normal"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={handleAddSkill}>Add</Button>
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Enter a skill and press Add"
                    />
                    
                    {/* Liste des compétences ajoutées */}
                    <Box sx={{ my: 2 }}>
                        {skills.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                onDelete={() => handleRemoveSkill(skill)}
                                sx={{ m: 0.5 }}
                            />
                        ))}
                    </Box>

                    {/* Description */}
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                        placeholder="Describe what kind of help you need..."
                    />

                    {/* Bouton de soumission */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        startIcon={<Add />}
                    >
                        Publish Offer
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateOffer;
