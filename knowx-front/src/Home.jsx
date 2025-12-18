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
    Chip,
    Badge
} from '@mui/material';
import { Logout, Person, Add, Search, Email, List } from '@mui/icons-material';

const Home = () => {
    const [offers, setOffers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
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
                console.error('Error loading requests:', err);
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };
        if (userId) {
            fetchOffers();
        }
    }, [navigate, userId]);

    // Vérifier les messages non lus toutes les 30 secondes
    useEffect(() => {
        if (!userId) return;

        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3001/api/messages/unread-count', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUnreadCount(res.data.count || 0);
            } catch (err) {
                console.warn('Could not fetch unread messages count:', err.message);
            }
        };

        // Première vérif immédiate
        fetchUnreadCount();

        // Vérif toutes les 30 secondes
        const interval = setInterval(fetchUnreadCount, 30_000); // 30 000 ms = 30s

        // Nettoyage à la sortie
        return () => clearInterval(interval);
    }, [userId]);

    // Filtrage des offres basé sur la recherche
    const filteredOffers = offers.filter(offer =>
        offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.skills_offered?.some(skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', width: '100%' }}>
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
                        {/* Bouton Create Request */}
                        <Button 
                            color="inherit" 
                            startIcon={<Add />} 
                            onClick={() => navigate('/create-request')}
                            sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                            }}
                        >
                            Create Request
                        </Button>

                        {/* Séparateur visuel */}
                        <Box sx={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.3)', mx: 1 }} />

                        {/* Messages */}
                        <Button 
                            color="inherit"
                            onClick={() => navigate('/messages')}
                            sx={{
                                minWidth: 'auto',
                                px: 1.5,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Email sx={{ fontSize: 24 }} />
                            <Typography sx={{
                                ml: 1, display: { xs: 'none', sm: 'inline' }
                            }}>
                                Messages
                            </Typography>
                            {unreadCount > 0 && (
                                <Badge
                                    badgeContent={unreadCount}
                                    color="error"
                                    max={99}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: '0.65rem',
                                            height: 18,
                                            minWidth: 18,
                                            right: 0,
                                            top: -10,
                                            transform: 'translateX(0)',
                                            position: 'relative',
                                            marginLeft: '4px'
                                        },
                                        display: 'inline-flex'
                                    }}
                                >
                                    <Box sx={{ width: 0, height: 0 }} /> {/* élément vide pour le Badge */}
                                </Badge>
                            )}
                        </Button>

                        {/* My requests */}
                        <Button
                            color="inherit"
                            startIcon={<List />}
                            onClick={() => navigate('/my-requests')}
                        >
                            My requests
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
                width: '100%',
                mx: 0,
                px: 2
            }}>
                <Container maxWidth="md" sx={{ width: '100%' }}>
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
                        sx={{ 
                            maxWidth: 600, 
                            mx: 'auto',
                            width: '100%'
                        }}
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

            {/* Requests grid - pleine largeur */}
            <Box sx={{ 
                width: '100%',
                py: 6,
                px: { xs: 2, sm: 3, md: 4 }
            }}>
                <Grid 
                    container 
                    spacing={3} 
                    justifyContent="center"
                    sx={{ maxWidth: '1200px', mx: 'auto' }}
                >
                    {filteredOffers.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography variant="h6" textAlign="center" color="textSecondary">
                                {searchTerm ? 'No matching requests found.' : 'No requests available yet.'}
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
                                            boxShadow: 6,
                                            borderColor: 'primary.main'
                                        },
                                        width: '100%',
                                        maxWidth: 340,
                                        border: '1px solid',
                                        borderColor: 
                                            offer.status === 'pending' ? 'grey.300' :
                                            offer.status === 'in progress' ? 'warning.main' :
                                            'success.main'
                                    }}
                                >
                                    <CardContent sx={{ 
                                        flexGrow: 1, 
                                        pb: 0,
                                        '&:last-child': { pb: 0 }
                                    }}>
                                        {/* Badges alignés */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            gap: 1, 
                                            mb: 1.5, 
                                            flexWrap: 'wrap'
                                        }}>
                                            <Chip
                                                label={offer.skills_offered?.[0] || 'Skill?'}
                                                size="small"
                                                sx={{ 
                                                    fontWeight: 600,
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    height: 24
                                                }}
                                            />
                                            <Chip
                                                label={
                                                    offer.status === 'pending' ? 'Pending' :
                                                    offer.status === 'in progress' ? 'In progress' :
                                                    'Resolved'
                                                }
                                                size="small"
                                                color={
                                                    offer.status === 'pending' ? 'default' :
                                                    offer.status === 'in progress' ? 'warning' :
                                                    'success'
                                                }
                                                sx={{ 
                                                    fontWeight: 600,
                                                    height: 24
                                                }}
                                            />
                                        </Box>

                                        {/* Titre principal */}
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                minHeight: '56px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                mb: 1.5
                                            }}
                                        >
                                            {offer.title}
                                        </Typography>

                                        {/* Description */}
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ 
                                                minHeight: '60px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                mb: 2,
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {offer.description || 'No description provided.'}
                                        </Typography>

                                        {/* Barre de progression visuelle */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 0.5,
                                            mb: 2
                                        }}>
                                            {[1, 2, 3].map((step) => (
                                                <Box
                                                    key={step}
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        bgcolor: 
                                                            step === 1 ? 'primary.main' :
                                                            step === 2 && offer.status !== 'pending' ? 'primary.main' :
                                                            step === 3 && offer.status === 'resolved' ? 'primary.main' :
                                                            'grey.400'
                                                    }}
                                                />
                                            ))}
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                {offer.status === 'pending' ? 'New request' :
                                                offer.status === 'in progress' ? 'Help in progress' :
                                                'Completed ✅'}
                                            </Typography>
                                        </Box>
                                    </CardContent>

                                    {/* Bouton amélioré */}
                                    <CardActions sx={{ 
                                        justifyContent: 'center', 
                                        p: 2,
                                        pt: 0 
                                    }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color={
                                                offer.status === 'pending' ? 'primary' :
                                                offer.status === 'in progress' ? 'warning' :
                                                'success'
                                            }
                                            onClick={() => navigate(`/offer/${offer.id}`)}
                                            sx={{ 
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                px: 3,
                                                width: '100%',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                        >
                                            {offer.status === 'pending' ? 'View & Help' :
                                            offer.status === 'in progress' ? 'Continue Helping' :
                                            'See Details'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default Home;
