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
    Divider,
    Grid,
    Card,
    CardMedia,
    Modal,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { ArrowBack, Close, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import MessageForm from './MessageForm';

const RequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [messageFormOpen, setMessageFormOpen] = useState(false); // State pour le formulaire

    // Gestion de l'affichage en plein écran de l'image
    const [openModal, setOpenModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Gestion du clavier pour le modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!openModal) return;
            if (e.key === 'ArrowLeft') {
                const screenshots = offer?.screenshots || [];
                setCurrentIndex(prev => prev === 0 ? Math.max(0, screenshots.length - 1) : prev - 1);
            }
            if (e.key === 'ArrowRight') {
                const screenshots = offer?.screenshots || [];
                setCurrentIndex(prev => prev === Math.max(0, screenshots.length - 1) ? 0 : prev + 1);
            }
            if (e.key === 'Escape') setOpenModal(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [openModal, offer?.screenshots]);

    // Chargement de l'offre
    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/offers/${id}`);
                setOffer(res.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error loading request:', err);
                alert('Cannot load request details.');
                navigate('/home');
            }
        };
        fetchOffer();
    }, [id, navigate]);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!offer) return <Typography>Request not found</Typography>;

    const screenshots = offer.screenshots || [];

    // Gestion de la navigation dans le modal
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
    };

    const handleImageClick = (index) => {
        setCurrentIndex(index);
        setOpenModal(true);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Bouton retour */}
            <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} sx={{ mb: 3 }}>
                Back to requests
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

                {/* Affichage des images uploadés*/}
                {offer.screenshots && offer.screenshots.length > 0 && (
                    <>
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Screenshots ({offer.screenshots.length})
                        </Typography>
                        <Grid container spacing={2}>
                            {offer.screenshots.map((url, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card 
                                        sx={{ 
                                            borderRadius: 1, 
                                            overflow: 'hidden', 
                                            boxShadow: 1,
                                            cursor: 'zoom-in',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                transition: 'transform 0.2s ease'
                                            }
                                        }}
                                        onClick={() => handleImageClick(index)}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={`http://localhost:3001${url}`}
                                            alt={`Screenshot ${index + 1}`}
                                            sx={{
                                                height: isMobile ? 120 : 160,
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {/* Informations supplémentaires */}
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                        Posted by: {offer.user_name || 'Anonymous'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Posted on: {new Date(offer.created_at).toLocaleDateString()}
                    </Typography>
                </Box>

                {/* BOUTON CONTACT */}
                <Button 
                    variant="contained" 
                    size="large" 
                    sx={{ mt: 3 }}
                    onClick={() => setMessageFormOpen(true)} // Ouvre le formulaire
                >
                    💬 Contact {offer.user_name}
                </Button>
            </Paper>

            {/* FORMULAIRE DE MESSAGE */}
            <MessageForm
                offerId={offer.id}
                receiverId={offer.user_id}
                receiverName={offer.user_name}
                open={messageFormOpen}
                onClose={() => setMessageFormOpen(false)}
            />

            {/* MODAL POUR L'AFFICHAGE PLEIN ÉCRAN */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.9)',
                    p: 2
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        outline: 'none',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        width: '100%'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={`http://localhost:3001${screenshots[currentIndex]}`}
                        alt={`Screenshot ${currentIndex + 1}`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            borderRadius: 4
                        }}
                    />

                    {/* Flèche gauche */}
                    {screenshots.length > 1 && (
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                position: 'absolute',
                                left: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'white',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                            }}
                        >
                            <KeyboardArrowLeft fontSize="large" />
                        </IconButton>
                    )}

                    {/* Flèche droite */}
                    {screenshots.length > 1 && (
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'white',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                            }}
                        >
                            <KeyboardArrowRight fontSize="large" />
                        </IconButton>
                    )}

                    {/* Bouton fermer */}
                    <IconButton
                        onClick={() => setOpenModal(false)}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <Close />
                    </IconButton>

                    {/* Indicateur (1/3) */}
                    {screenshots.length > 1 && (
                        <Typography
                            variant="caption"
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            {currentIndex + 1} / {screenshots.length}
                        </Typography>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default RequestDetail;
