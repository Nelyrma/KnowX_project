import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Grid,
    Button,
    Chip,
    Paper
} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';

const MyOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyOffers();
    }, []);

    const fetchMyOffers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/offers/my-offers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOffers(res.data);
        } catch (err) {
            console.error('Error loading offers:', err);
            alert('Cannot load your offers');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOffer = async (offerId) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/api/offers/${offerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOffers(offers.filter(offer => offer.id !== offerId));
            alert('✅ Offer deleted!');
        } catch (err) {
            alert('❌ Error: ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return (
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
            <Typography>Loading your offers...</Typography>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header - BIEN ESPACÉ */}
            <Paper elevation={2} sx={{ p: 4, mb: 6, textAlign: 'center' }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate('/home')}
                    sx={{ mb: 3 }}
                    variant="outlined"
                >
                    Back to Home
                </Button>
                
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    My Offers
                </Typography>
                
                <Chip 
                    label={`${offers.length} offer${offers.length !== 1 ? 's' : ''}`} 
                    color="primary" 
                    sx={{ fontSize: '1.1rem', p: 2 }}
                />
                
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Manage your skill offers and help requests
                </Typography>
            </Paper>

            {/* Grille des offres - CENTRÉE */}
            <Grid 
                container 
                spacing={4} 
                justifyContent="center"
                sx={{ mb: 8 }}
            >
                {offers.length === 0 ? (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 6, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom color="text.secondary">
                                📭 No offers yet
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                You haven't created any offers yet.
                            </Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<Edit />}
                                onClick={() => navigate('/create-offer')}
                            >
                                Create Your First Offer
                            </Button>
                        </Paper>
                    </Grid>
                ) : (
                    offers.map((offer) => (
                        <Grid 
                            item 
                            xs={12} sm={6} md={4} 
                            key={offer.id}
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <Card 
                                sx={{ 
                                    width: '100%',
                                    maxWidth: 400,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 8
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Chip
                                        label={`Help with ${offer.skills_offered?.[0] || 'Unknown'}`}
                                        color="primary"
                                        sx={{ mb: 2, fontWeight: 'bold' }}
                                    />
                                    <Typography variant="h6" gutterBottom sx={{ minHeight: '64px' }}>
                                        {offer.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            minHeight: '80px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {offer.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                        Created: {new Date(offer.created_at).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', p: 2, gap: 1 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<Edit />}
                                        onClick={() => navigate(`/edit-offer/${offer.id}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        startIcon={<Delete />}
                                        onClick={() => handleDeleteOffer(offer.id)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default MyOffers;
