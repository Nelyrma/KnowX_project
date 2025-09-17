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
import { Logout, Person, Add, Search } from '@mui/icons-material';

const Home = () => {
    const [offers, setOffers] = useState([]);
    const [userId, setUserId] = useState(null); // pour stocker l'ID du user connecté
    const [searchTerm, setSearchTerm] = useState(""); // state pour la recherche
    const navigate = useNavigate();

    // Vérification du token et récupération de l'user ID
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        // décoder le token pour obtenir l'user ID
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
            
            // Mettre à jour la liste des offres
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
            {/* Header */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        KnowX
                    </Typography>
                    <Button color="inherit" startIcon={<Person />} onClick={() => navigate('/profile')}>
                        Profile
                    </Button>
                    <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* HERO SECTION & SEARCH BAR */}
            <Box sx={{
                textAlign: 'center',
                py: 8,
                background: `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.background.default})`,
            }}>
                <Container maxWidth="md">
                    <TextField
                        fullWidth
                        placeholder="Search for a skill..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ maxWidth: 600, mx: 'auto', my: 4 }}
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

            {/* Create Button */}
            <Box textAlign="center" sx={{ mb: 4 }}>
                <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => navigate('/create-offer')}
                    size="large"
                >
                    Create Offer
                </Button>
            </Box>

            {/* Offers grid */}
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
                            {/* CARTE STYLEE MOCKUP */}
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    {/* CHIP pour la compétence principale */}
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
                                    {/* BOUTON VIEW */}
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => navigate(`/offer/${offer.id}`)} // Tu devras créer cette page
                                    >
                                        VIEW
                                    </Button>
                                    {/* Boutons DELETE et EDIT pour le créateur de l'offre */}
                                    {userId === offer.user_id && (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {/* BOUTON EDIT */}
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => navigate(`/edit-offer/${offer.id}`)} // Redirige vers la page d'édition
                                            >
                                                Edit
                                            </Button>
                                            {/* BOUTON DELETE */}
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
    );
};

export default Home;
