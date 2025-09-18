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
import { Logout, Person, Add, Search, Email, List } from '@mui/icons-material';

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

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3001/api/offers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filtrer pour exclure les offres de l'utilisateur connecté
                const otherUsersOffers = res.data.filter(offer => offer.user_id !== userId);
                setOffers(otherUsersOffers);
            } catch (err) {
                console.error('Error loading offers:', err);
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };
        if (userId) {
            fetchOffers();
        }
    }, [navigate, userId]);

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
                        {/* Bouton Create Offer */}
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

                        {/* My offers */}
                        <Button
                            color="inherit"
                            startIcon={<List />}
                            onClick={() => navigate('/my-offers')}
                        >
                            My offers
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

            {/* Offers grid - VERSION AMÉLIORÉE */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid 
                    container 
                    spacing={3} 
                    justifyContent="center"
                >
                    {filteredOffers.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography variant="h6" textAlign="center" color="textSecondary">
                                {searchTerm ? 'No matching offers found.' : 'No offers available yet.'}
                            </Typography>
                        </Grid>
                    ) : (
                        filteredOffers.map((offer) => (
                            <Grid 
                                item 
                                xs={12} sm={6} md={4} lg={3}
                                key={offer.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        transition: '0.2s', 
                                        '&:hover': { 
                                            transform: 'translateY(-4px)', 
                                            boxShadow: 6 
                                        },
                                        width: '100%',
                                        maxWidth: 320
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Chip
                                            label={`Need help with ${offer.skills_offered?.[0] || 'Unknown'}`}
                                            color="primary"
                                            variant="filled"
                                            sx={{ mb: 2, fontWeight: 'bold' }}
                                        />
                                        <Typography variant="h6" gutterBottom sx={{ minHeight: '64px' }}>
                                            {offer.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            mt: 1, 
                                            color: 'text.secondary', 
                                            minHeight: '80px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {offer.description}
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
