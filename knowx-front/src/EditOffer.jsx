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
    IconButton
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';

const EditOffer = () => {
    const { id } = useParams(); // Récupérer l'ID de l'offre depuis l'URL
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [currentSkill, setCurrentSkill] = useState('');
    const [offerData, setOfferData] = useState({
        title: '',
        description: '',
        skills_offered: []
    });

    // Récupérer les données de l'offre à éditer
    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:3001/offers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOfferData(res.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error loading offer:', err);
                alert('The offer could not be loaded.');
                navigate('/home');
            }
        };
        fetchOffer();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // URL et envoi des données MODIFIÉS pour l'API
            await axios.put(`http://localhost:3001/api/offers/${id}`, offerData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('✅ Offer successfully modified !');
            navigate('/home');
        } catch (err) {
            // Gestion d'erreur MODIFIÉE pour correspondre à ton backend
            alert('❌ Error: ' + (err.response?.data?.error || err.message));
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
                <Typography variant="h4">Edit offer</Typography>
            </Box>

        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Title of the offer"
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
                label="Skills offered"
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
    </Container>
  );
};

export default EditOffer;
