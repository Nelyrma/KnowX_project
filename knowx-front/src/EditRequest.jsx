import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Chip,
    InputAdornment,
    IconButton,
    Paper,
    Grid,
    Card,
    CardMedia
} from '@mui/material';
import { ArrowBack, Save, Add, Delete } from '@mui/icons-material';

const EditRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [currentSkill, setCurrentSkill] = useState('');
    const [offerData, setOfferData] = useState({
        title: '',
        description: '',
        skills_offered: []
    });
    const [images, setImages] = useState([]); // Nouvelles images à uploader
    const [existingScreenshots, setExistingScreenshots] = useState([]); // URLs des images déjà sauvegardées
    const [deletedScreenshotUrls, setDeletedScreenshotUrls] = useState([]); // URLs marquées pour suppression

    // Récupérer les données de l'offre à éditer
    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:3001/api/offers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOfferData({
                    title: res.data.title,
                    description: res.data.description,
                    skills_offered: res.data.skills_offered || []
                });
                setExistingScreenshots(res.data.screenshots || []);
                setIsLoading(false);
            } catch (err) {
                console.error('Error loading offer:', err);
                alert('The offer could not be loaded.');
                navigate('/home');
            }
        };
        fetchOffer();
    }, [id, navigate]);

    // Ajouter de nouvelles images
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

    // Supprimer une nouvelle image (non encore uploadée)
    const removeNewImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    // Supprimer une image existante (déjà uploadée)
    const removeExistingScreenshot = (urlToRemove) => {
        setExistingScreenshots(existingScreenshots.filter(url => url !== urlToRemove));
        setDeletedScreenshotUrls([...deletedScreenshotUrls, urlToRemove]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            // Champs texte
            formData.append('title', offerData.title);
            formData.append('description', offerData.description);
            offerData.skills_offered.forEach(skill => formData.append('skills_offered[]', skill));

            // Nouvelles images à uploader
            images.forEach(file => formData.append('images', file));

            // URLs à supprimer
            deletedScreenshotUrls.forEach(url => formData.append('deleted_screenshots[]', url));

            await axios.put(`http://localhost:3001/api/offers/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            navigate('/home');
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleChange = (e) => {
        setOfferData({ ...offerData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = () => {
        if (currentSkill && !offerData.skills_offered.includes(currentSkill)) {
            setOfferData({
                ...offerData,
                skills_offered: [...offerData.skills_offered, currentSkill]
            });
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setOfferData({
            ...offerData,
            skills_offered: offerData.skills_offered.filter(skill => skill !== skillToRemove)
        });
    };

    if (isLoading) return <Typography>Chargement...</Typography>;

    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/home')} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4">Edit request</Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title of the request"
                        name="title"
                        value={offerData.title}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={offerData.description}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Skills wanted"
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
                    />
                    {/* Affiche les compétences sous forme de chips */}
                    <Box sx={{ my: 2 }}>
                        {offerData.skills_offered.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                onDelete={() => handleRemoveSkill(skill)}
                                sx={{ m: 0.5 }}
                            />
                        ))}
                    </Box>

                    {/* SECTION IMAGES EXISTANTES */}
                    {existingScreenshots.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Current screenshots
                            </Typography>
                            <Grid container spacing={1}>
                                {existingScreenshots.map((url, index) => (
                                    <Grid item key={index}>
                                        <Card sx={{ width: 80, height: 80, position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                image={`http://localhost:3001${url}`}
                                                alt={`Current ${index + 1}`}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <IconButton
                                                size="small"
                                                color="error"
                                                sx={{
                                                    position: 'absolute',
                                                    top: -6,
                                                    right: -6,
                                                    bgcolor: 'white',
                                                    '&:hover': { bgcolor: 'error.light' }
                                                }}
                                                onClick={() => removeExistingScreenshot(url)}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}

                    {/* SECTION AJOUT DE NOUVELLES IMAGES */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Add new screenshots (optional)
                        </Typography>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<Add />}
                            size="small"
                        >
                            Add images
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>

                        {/* Prévisualisation des nouvelles images */}
                        {images.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {images.map((file, index) => (
                                    <Box key={index} sx={{ position: 'relative' }}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`new preview ${index}`}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                objectFit: 'cover',
                                                borderRadius: 4,
                                                border: '1px solid #ddd'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            sx={{
                                                position: 'absolute',
                                                top: -6,
                                                right: -6,
                                                bgcolor: 'white',
                                                '&:hover': { bgcolor: 'error.light' }
                                            }}
                                            onClick={() => removeNewImage(index)}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<Save />}
                        sx={{ mt: 3 }}
                    >
                        Save changes
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default EditRequest;
