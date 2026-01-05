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
import { DEMO_CREDENTIALS } from './demoData';

const CreateRequest = () => {
    const [title, setTitle] = useState('');
    const [currentSkill, setCurrentSkill] = useState('');
    const [skills, setSkills] = useState([]);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                alert(`"${file.name}" is not an image.`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`"${file.name}" is too large (max 5 MB).`);
                return false;
            }
            return true;
        });
        const newImages = [...images, ...validFiles].slice(0, 5);
        setImages(newImages);
    };

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        skills.forEach(skill => formData.append('skills_offered[]', skill));
        images.forEach(file => formData.append('images', file));

        try {
            await axios.post('http://localhost:3001/api/offers', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Request created successfully!');
            navigate('/home');
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
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
                    Create New Help Request
                </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => {
                        setTitle(DEMO_CREDENTIALS.request.title);
                        setSkills(DEMO_CREDENTIALS.request.skills_offered);
                        setDescription(DEMO_CREDENTIALS.request.description);
                    }}
                    sx={{ mb: 2 }}
                >
                    Demo Request
                </Button>
            </Box>

            {/* Formulaire dans une carte */}
            <Paper elevation={3} sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                    {/* Titre */}
                    <TextField
                        fullWidth
                        label="Request Title"
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

                    {/* Section Upload d'images */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Add Screenshots (Optional)
                        </Typography>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<Add />}
                            sx={{ mb: 2 }}
                        >
                            Add Images
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>

                        {/* Prévisualisation des images */}
                        {images.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                {images.map((file, index) => (
                                    <Box key={index} sx={{ position: 'relative' }}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview ${index}`}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                objectFit: 'cover',
                                                borderRadius: 4,
                                                border: '1px solid #eee'
                                            }}
                                        />
                                        <Button
                                            size="small"
                                            color="error"
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                minWidth: 0,
                                                p: 0.3
                                            }}
                                            onClick={() => removeImage(index)}
                                        >
                                            ✕
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Bouton de soumission */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        startIcon={<Add />}
                    >
                        Publish Request
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateRequest;
