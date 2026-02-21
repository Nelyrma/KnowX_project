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
    Paper,
    IconButton
} from '@mui/material';
import { ArrowBack, Add, Close } from '@mui/icons-material';
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
        <Container 
            maxWidth="sm" 
            sx={{ 
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 3 }
            }}
        >
            {/* Header responsive */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                mb: { xs: 3, sm: 4 },
                pt: { xs: 2, sm: 3 },
                pb: { xs: 2, sm: 3 },
                gap: { xs: 2, sm: 0 }
            }}>
                {/* Bouton retour */}
                <Box sx={{ 
                    display: 'flex', 
                    width: { xs: '100%', sm: 'auto' },
                    alignItems: 'center',
                    mb: { xs: 1, sm: 0 }
                }}>
                    <IconButton 
                        onClick={() => navigate('/home')}
                        sx={{ 
                            mr: { xs: 1, sm: 2 },
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                                transform: 'translateX(-2px)',
                                transition: 'all 0.2s ease'
                            }
                        }}
                    >
                        <ArrowBack sx={{ 
                            fontSize: { xs: 24, sm: 28 }
                        }} />
                    </IconButton>
                    
                    {/* Titre responsive */}
                    <Typography 
                        variant="h4" 
                        component="h1"
                        sx={{ 
                            fontWeight: 'bold',
                            color: 'text.primary',
                            flexGrow: 1,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                            textAlign: { xs: 'center', sm: 'left' },
                            mt: { xs: 0, sm: 0 }
                        }}
                    >
                        Create New Request
                    </Typography>
                </Box>

                {/* Bouton Demo - positionné différemment selon l'écran */}
                <Box sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    textAlign: { xs: 'center', sm: 'right' }
                }}>
                    <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => {
                            setTitle(DEMO_CREDENTIALS.request.title);
                            setSkills(DEMO_CREDENTIALS.request.skills_offered);
                            setDescription(DEMO_CREDENTIALS.request.description);
                        }}
                        sx={{ 
                            width: { xs: '100%', sm: 'auto' },
                            fontSize: { xs: '0.875rem', sm: '0.875rem' }
                        }}
                    >
                        Demo Request
                    </Button>
                </Box>
            </Box>

            {/* Formulaire dans une carte responsive */}
            <Paper 
                elevation={2} 
                sx={{ 
                    p: { xs: 3, sm: 4 },
                    borderRadius: { xs: 2, sm: 3 }
                }}
            >
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
                        InputProps={{
                            sx: { 
                                fontSize: { xs: '0.9375rem', sm: '1rem' },
                                height: { xs: 48, sm: 56 }
                            }
                        }}
                        InputLabelProps={{
                            sx: { 
                                fontSize: { xs: '0.9375rem', sm: '1rem' }
                            }
                        }}
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
                            sx: { 
                                fontSize: { xs: '0.9375rem', sm: '1rem' },
                                height: { xs: 48, sm: 56 }
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button 
                                        onClick={handleAddSkill}
                                        size={window.innerWidth < 600 ? "small" : "medium"}
                                        sx={{ 
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            minWidth: { xs: 60, sm: 80 }
                                        }}
                                    >
                                        Add
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{
                            sx: { 
                                fontSize: { xs: '0.9375rem', sm: '1rem' }
                            }
                        }}
                        placeholder="Enter a skill and press Add"
                    />
                    
                    {/* Liste des compétences ajoutées */}
                    <Box sx={{ 
                        my: 2,
                        minHeight: '40px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1
                    }}>
                        {skills.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                onDelete={() => handleRemoveSkill(skill)}
                                sx={{ 
                                    m: 0,
                                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                    height: { xs: 28, sm: 32 }
                                }}
                                size={window.innerWidth < 600 ? "small" : "medium"}
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
                        rows={window.innerWidth < 600 ? 3 : 4}
                        required
                        placeholder="Describe what kind of help you need..."
                        InputProps={{
                            sx: { 
                                fontSize: { xs: '0.9375rem', sm: '1rem' }
                            }
                        }}
                        InputLabelProps={{
                            sx: { 
                                fontSize: { xs: '0.9375rem', sm: '1rem' }
                            }
                        }}
                    />

                    {/* Section Upload d'images */}
                    <Box sx={{ mt: 3 }}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                mb: 1,
                                fontSize: { xs: '0.9375rem', sm: '1rem' },
                                fontWeight: 600
                            }}
                        >
                            Add Screenshots (Optional)
                        </Typography>
                        
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<Add />}
                            sx={{ 
                                mb: 2,
                                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                py: { xs: 1, sm: 1.25 }
                            }}
                            size={window.innerWidth < 600 ? "small" : "medium"}
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
                            <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 1, 
                                mt: 2 
                            }}>
                                {images.map((file, index) => (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            position: 'relative',
                                            width: { xs: 70, sm: 80 },
                                            height: { xs: 70, sm: 80 }
                                        }}
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview ${index}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: 4,
                                                border: '1px solid #eee'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                minWidth: 0,
                                                width: { xs: 20, sm: 24 },
                                                height: { xs: 20, sm: 24 },
                                                backgroundColor: 'error.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'error.dark'
                                                },
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                            }}
                                            onClick={() => removeImage(index)}
                                        >
                                            <Close sx={{ fontSize: { xs: 14, sm: 16 } }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        
                        {/* Indication du nombre maximum */}
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                                display: 'block', 
                                mt: 1,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                        >
                            Maximum 5 images • Max size 5 MB each
                        </Typography>
                    </Box>

                    {/* Bouton de soumission */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size={window.innerWidth < 600 ? "medium" : "large"}
                        sx={{ 
                            mt: 3,
                            py: { xs: 1.5, sm: 1.75 },
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            fontWeight: 600
                        }}
                        startIcon={<Add />}
                    >
                        Publish Request
                    </Button>
                </form>
            </Paper>
            
            {/* Espace supplémentaire en bas sur mobile */}
            <Box sx={{ height: { xs: 4, sm: 0 } }} />
        </Container>
    );
};

export default CreateRequest;
