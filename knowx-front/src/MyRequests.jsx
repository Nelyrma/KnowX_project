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
    Paper,
    Box,
    Alert
} from '@mui/material';
import { ArrowBack, Edit, Delete, PlayArrow, Check } from '@mui/icons-material';

const MyRequests = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyOffers();
    }, []);

    const fetchMyOffers = async () => {
        try {
            setError('');
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/offers/my-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Normalise les données (statut en minuscule)
            const normalized = res.data.map(offer => ({
                ...offer,
                status: (offer.status || 'pending').trim().toLowerCase()
            }));
            setOffers(normalized);
        } catch (err) {
            console.error('Error loading requests:', err);
            setError('Failed to load your requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateOfferStatus = async (offerId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:3001/api/offers/${offerId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Mise à jour locale
            setOffers(prev => 
                prev.map(offer => 
                    offer.id === offerId 
                        ? { ...offer, status: newStatus } 
                        : offer
                )
            );
        } catch (err) {
            console.error('Status update error:', err);
            alert('Failed to update status: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    const handleDeleteOffer = async (offerId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/api/offers/${offerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOffers(offers.filter(offer => offer.id !== offerId));
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return (
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h5">Loading your requests...</Typography>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                gap: 2
            }}>
                <Button 
                    onClick={() => navigate('/home')}
                    sx={{ 
                        minWidth: 'auto',
                        p: 0.5,
                        color: 'text.secondary',
                        '&:hover': { bgcolor: 'transparent', color: 'primary.main' }
                    }}
                >
                    <ArrowBack sx={{ fontSize: 28 }} />
                </Button>
    
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    My Requests
                </Typography>
            </Box>

            {/* Résumé des statuts */}
            <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                mb: 4, 
                flexWrap: 'wrap',
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
            }}>
                <Chip 
                    label={`${offers.filter(o => o.status === 'pending').length} Pending`} 
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                />
                <Chip 
                    label={`${offers.filter(o => o.status === 'in progress').length} In Progress`} 
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                />
                <Chip 
                    label={`${offers.filter(o => o.status === 'resolved').length} Resolved`} 
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                />
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
            )}

            {/* Grille des demandes */}
            <Grid container spacing={4} justifyContent="center">
                {offers.length === 0 ? (
                    <Grid item xs={12}>
                        <Paper 
                            sx={{ 
                                p: { xs: 4, md: 6 }, 
                                textAlign: 'center',
                                background: 'linear-gradient(to bottom, #f5f7fa, #e4e7eb)',
                                borderRadius: 3
                            }}
                        >
                            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                                No requests yet
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                                Create your first request and get help from the community!
                            </Typography>
                            <Button 
                                variant="contained" 
                                size="large"
                                startIcon={<Edit />}
                                onClick={() => navigate('/create-request')}
                                sx={{ 
                                    px: 4, 
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Create Your First Request
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
                                    maxWidth: 420,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2.5,
                                    borderLeft: 6,
                                    borderColor: 
                                        offer.status === 'pending' ? 'grey.400' :
                                        offer.status === 'in progress' ? 'warning.main' :
                                        'success.main',
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    {/* Badges */}
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={offer.skills_offered?.[0] || 'Skill?'}
                                            size="small"
                                            sx={{ 
                                                fontWeight: 600,
                                                bgcolor: 'primary.main',
                                                color: 'white'
                                            }}
                                        />
                                        <Chip
                                            label={
                                                offer.status === 'pending' ? 'Pending' :
                                                offer.status === 'in progress' ? 'In Progress' :
                                                'Resolved'
                                            }
                                            size="small"
                                            color={
                                                offer.status === 'pending' ? 'default' :
                                                offer.status === 'in progress' ? 'warning' :
                                                'success'
                                            }
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>

                                    {/* Titre */}
                                    <Typography 
                                        variant="h6" 
                                        gutterBottom 
                                        sx={{ 
                                            fontWeight: 'bold',
                                            minHeight: '56px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {offer.title}
                                    </Typography>

                                    {/* Description */}
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                            minHeight: '72px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            mb: 2
                                        }}
                                    >
                                        {offer.description || 'No description provided.'}
                                    </Typography>

                                    {/* Date */}
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary" 
                                        display="block"
                                        sx={{ 
                                            mt: 'auto',
                                            pt: 1,
                                            borderTop: '1px dashed',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        Created: {new Date(offer.created_at).toLocaleDateString()}
                                    </Typography>
                                </CardContent>

                                {/* Actions */}
                                <CardActions sx={{ p: 2, pt: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {/* Boutons de statut */}
                                    {offer.status === 'pending' && (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="warning"
                                            startIcon={<PlayArrow />}
                                            onClick={() => updateOfferStatus(offer.id, 'in progress')}
                                            sx={{ flex: '1 1 auto', minWidth: 120 }}
                                        >
                                            Start Helping
                                        </Button>
                                    )}
                                    {offer.status === 'in progress' && (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            startIcon={<Check />}
                                            onClick={() => updateOfferStatus(offer.id, 'resolved')}
                                            sx={{ flex: '1 1 auto', minWidth: 120 }}
                                        >
                                            Mark Resolved
                                        </Button>
                                    )}

                                    {/* Gestion */}
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<Edit />}
                                        onClick={() => navigate(`/edit-request/${offer.id}`)}
                                        sx={{ flex: '1 1 auto', minWidth: 90 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={() => handleDeleteOffer(offer.id)}
                                        sx={{ flex: '1 1 auto', minWidth: 90 }}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Call-to-action fixe en bas (optionnel mais joli) */}
            <Box sx={{ 
                mt: 6, 
                textAlign: 'center',
                p: 3,
                background: 'rgba(106, 17, 203, 0.05)',
                borderRadius: 2
            }}>
                <Typography variant="h6" color="primary.main" gutterBottom>
                    Need more help?
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Edit />}
                    onClick={() => navigate('/create-request')}
                    sx={{ 
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold'
                    }}
                >
                    Create Another Request
                </Button>
            </Box>
        </Container>
    );
};

export default MyRequests;
