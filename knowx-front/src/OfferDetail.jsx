import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    Chip,
    Button,
    Paper,
    Divider
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const OfferDetail = () => {
    const { id } = useParams(); // Récupère l'ID de l'URL
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/offers/${id}`);
                setOffer(res.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error loading offer:', err);
                alert('Cannot load offer details.');
                navigate('/home');
            }
        };
        fetchOffer();
    }, [id, navigate]);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!offer) return <Typography>Offer not found</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Bouton retour */}
            <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} sx={{ mb: 3 }}>
                Back to offers
            </Button>

            {/* Carte de détail de l'offre */}
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {offer.title}
                </Typography>

                {/* Chips pour les compétences */}
                <Box sx={{ my: 2 }}>
                    <Typography variant="h6" gutterBottom>Skills needed:</Typography>
                    {offer.skills_offered?.map((skill, index) => (
                        <Chip key={index} label={skill} sx={{ m: 0.5 }} />
                    ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Description complète */}
                <Typography variant="h6" gutterBottom>Description:</Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {offer.description}
                </Typography>

                {/* Informations supplémentaires */}
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                        Posted by: {offer.user_name || 'Anonymous'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Posted on: {new Date(offer.created_at).toLocaleDateString()}
                    </Typography>
                </Box>

                {/* Bouton de contact */}
                <Button variant="contained" size="large" sx={{ mt: 3 }}>
                    Contact
                </Button>
            </Paper>
        </Container>
    );
};

export default OfferDetail;