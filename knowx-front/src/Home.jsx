import { useState, useEffect } from "react";
import axios from "axios";
import theme from './theme';
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Box,
    AppBar,
    Toolbar,
    Grid,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import { Logout, Person, Add, Search, Email } from '@mui/icons-material';

const Home = () => {
    const [offers, setOffers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Vérification du token et récupération de l'user ID
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setUserId(decoded.userId);
        } catch (err) {
            console.error('Error decoding token:', err);
        }
    }, [navigate]);

    // déconnexion
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Fonction de suppression d'offre
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

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/offers');
                setOffers(res.data);
            } catch (err) {
                console.error('Error loading offers:', err);
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };
        fetchOffers();
    }, [navigate]);

    // Filtrage des offres basé sur la recherche
    const filteredOffers = offers.filter(offer =>
        offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.skills_offered?.some(skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Container maxWidth="xl" sx={{ minHeight: '100vh', backgroundColor: 'background.default', p: 0 }}>
            {/* Header - MODIFIÉ */}
            <AppBar position="static">
                <Toolbar>
                    {/* Logo/Titre à gauche */}
                    <Typography variant="h6" sx={{ 
                        flexGrow: 1, 
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }} onClick={() => navigate('/home')}>
                        KnowX
                    </Typography>

                    {/* Actions principales à droite */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Bouton Create Offer - visible et important */}
                        <Button 
                            color="inherit" 
                            startIcon={<Add />} 
                            onClick={() => navigate('/create-offer')}
                            sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                            }}
                        >
                            Create Offer
                        </Button>

                        {/* Séparateur visuel */}
                        <Box sx={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.3)', mx: 1 }} />

                        {/* Messages */}
                        <Button 
                            color="inherit" 
                            startIcon={<Email />} 
                            onClick={() => navigate('/messages')}
                        >
                            Messages
                        </Button>

                        {/* Profile */}
                        <Button 
                            color="inherit" 
                            startIcon={<Person />} 
                            onClick={() => navigate('/profile')}
                        >
                            Profile
                        </Button>

                        {/* Séparateur visuel */}
                        <Box sx={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.3)', mx: 1 }} />

                        {/* Logout */}
                        <Button 
                            color="inherit" 
                            startIcon={<Logout />} 
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* HERO SECTION & SEARCH BAR */}
            <Box sx={{
                textAlign: 'center',
                py: 8,
                background: `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.background.default})`,
            }}>
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                        Share Your Skills
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
                        Find help or offer your expertise
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Search for Python, React, Design..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ maxWidth: 600, mx: 'auto' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Container>
            </Box>

            {/* Offers grid */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={3}>
                    {filteredOffers.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography variant="h6" textAlign="center" color="textSecondary">
                                {searchTerm ? 'No matching offers found.' : 'No offers available yet.'}
                            </Typography>
                        </Grid>
                    ) : (
                        filteredOffers.map((offer) => (
                            <Grid item xs={12} sm={6} md={4} key={offer.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Chip
                                            label={`Need help with ${offer.skills_offered?.[0] || 'Unknown'}`}
                                            color="primary"
                                            variant="filled"
                                            sx={{ mb: 2, fontWeight: 'bold' }}
                                        />
                                        <Typography variant="h6" gutterBottom>
                                            {offer.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                            {offer.description && offer.description.length > 100
                                                ? `${offer.description.substring(0, 100)}...`
                                                : offer.description
                                            }
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => navigate(`/offer/${offer.id}`)}
                                        >
                                            VIEW
                                        </Button>
                                        {userId === offer.user_id && (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() => navigate(`/edit-offer/${offer.id}`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteOffer(offer.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </Container>
    );
};

export default Home;
