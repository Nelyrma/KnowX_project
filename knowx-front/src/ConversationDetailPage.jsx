import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    List,
    ListItem,
    Avatar,
    IconButton,
    CircularProgress,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { ArrowBack, Send, KeyboardArrowDown } from '@mui/icons-material';

const ConversationDetailPage = () => {
    const { userId: otherUserId } = useParams();
    const [conversation, setConversation] = useState([]);
    const [otherUser, setOtherUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Récupérer l'ID utilisateur une seule fois au début
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(decoded.userId);
            } catch (err) {
                console.error('Error decoding token:', err);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Charger la conversation quand currentUserId est disponible
    useEffect(() => {
        if (currentUserId && otherUserId) {
            fetchConversation();
        }
    }, [currentUserId, otherUserId]);

    // Scroll automatique vers les nouveaux messages
    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversation = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `http://localhost:3001/api/messages/conversation/${otherUserId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setConversation(res.data);
            
            // Trouver les infos de l'autre utilisateur
            if (res.data.length > 0) {
                const firstMessage = res.data[0];
                const isSender = firstMessage.sender_id === currentUserId;
                setOtherUser({
                    id: isSender ? firstMessage.receiver_id : firstMessage.sender_id,
                    name: isSender ? 
                        `${firstMessage.receiver_first_name} ${firstMessage.receiver_last_name}` :
                        `${firstMessage.sender_first_name} ${firstMessage.sender_last_name}`,
                    firstName: isSender ? firstMessage.receiver_first_name : firstMessage.sender_first_name
                });
            } else {
                // Si pas de messages, récupérer les infos de l'autre utilisateur via une autre API
                fetchOtherUserInfo();
            }
        } catch (err) {
            console.error('Error fetching conversation:', err);
            alert('Cannot load conversation');
        } finally {
            setLoading(false);
        }
    };

    const fetchOtherUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `http://localhost:3001/api/users/${otherUserId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setOtherUser({
                id: otherUserId,
                name: `${res.data.first_name} ${res.data.last_name}`,
                firstName: res.data.first_name
            });
        } catch (err) {
            console.error('Error fetching user info:', err);
            setOtherUser({
                id: otherUserId,
                name: 'Unknown User',
                firstName: 'User'
            });
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/messages', {
                receiver_id: otherUserId,
                content: newMessage.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewMessage('');
            await fetchConversation(); // Recharger la conversation
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Error sending message');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'short'
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container 
            maxWidth="md" 
            sx={{ 
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                p: 0,
                overflow: 'hidden'
            }}
        >
            {/* Header fixe */}
            <Paper 
                elevation={2} 
                sx={{ 
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    borderRadius: 0,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 2 },
                    borderBottom: 1,
                    borderColor: 'divider'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                        onClick={() => navigate('/messages')} 
                        sx={{ mr: { xs: 1, sm: 2 } }}
                        size={isMobile ? "small" : "medium"}
                    >
                        <ArrowBack sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                    
                    <Avatar 
                        sx={{ 
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            mr: { xs: 1.5, sm: 2 },
                            bgcolor: 'primary.main',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        {otherUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontSize: { xs: '1rem', sm: '1.125rem' },
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {otherUser?.name || 'Unknown User'}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                display: 'block'
                            }}
                        >
                            {conversation.length === 0 ? 'Start conversation' : 'Active now'}
                        </Typography>
                    </Box>
                    
                    {/* Bouton scroll vers le bas sur desktop */}
                    {!isMobile && conversation.length > 5 && (
                        <IconButton 
                            onClick={scrollToBottom}
                            size="small"
                            sx={{ ml: 1 }}
                        >
                            <KeyboardArrowDown />
                        </IconButton>
                    )}
                </Box>
            </Paper>

            {/* Zone des messages */}
            <Paper 
                elevation={0} 
                sx={{ 
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 1.5, sm: 2 },
                    bgcolor: 'background.default'
                }}
            >
                {conversation.length === 0 ? (
                    <Box sx={{ 
                        textAlign: 'center', 
                        py: { xs: 8, sm: 12 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Avatar 
                            sx={{ 
                                width: { xs: 64, sm: 80 },
                                height: { xs: 64, sm: 80 },
                                mb: 3,
                                bgcolor: 'primary.light',
                                fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}
                        >
                            {otherUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Typography 
                            variant="h6" 
                            color="text.secondary" 
                            sx={{ 
                                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                                mb: 1
                            }}
                        >
                            No messages yet
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                maxWidth: 400
                            }}
                        >
                            Start the conversation by sending a message to {otherUser?.firstName || 'this user'}
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
                        {conversation.map((message, index) => {
                            const isOwnMessage = message.sender_id === currentUserId;
                            const showDate = index === 0 || 
                                new Date(message.created_at).toDateString() !== 
                                new Date(conversation[index - 1].created_at).toDateString();

                            return (
                                <Box key={message.id}>
                                    {/* Séparateur de date */}
                                    {showDate && (
                                        <Box sx={{ 
                                            textAlign: 'center', 
                                            my: { xs: 2, sm: 3 },
                                            px: { xs: 1, sm: 2 }
                                        }}>
                                            <Paper 
                                                elevation={0}
                                                sx={{ 
                                                    display: 'inline-block',
                                                    px: { xs: 2, sm: 3 },
                                                    py: { xs: 0.5, sm: 1 },
                                                    bgcolor: 'action.hover',
                                                    borderRadius: 20
                                                }}
                                            >
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ 
                                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {formatDate(message.created_at)}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    )}

                                    <ListItem 
                                        sx={{ 
                                            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                            px: { xs: 0.5, sm: 1 },
                                            py: 0.5
                                        }}
                                    >
                                        <Box sx={{ 
                                            maxWidth: { xs: '85%', sm: '70%' },
                                            display: 'flex',
                                            flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                                            alignItems: 'flex-end',
                                            gap: 1
                                        }}>
                                            {/* Avatar seulement pour les messages reçus */}
                                            {!isOwnMessage && (
                                                <Avatar 
                                                    sx={{ 
                                                        width: { xs: 28, sm: 32 },
                                                        height: { xs: 28, sm: 32 },
                                                        display: { xs: 'none', sm: 'flex' }
                                                    }}
                                                >
                                                    {otherUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                                </Avatar>
                                            )}
                                            
                                            {/* Bulle de message */}
                                            <Paper 
                                                elevation={0} 
                                                sx={{ 
                                                    p: { xs: 1.5, sm: 2 },
                                                    bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                                                    color: isOwnMessage ? 'white' : 'text.primary',
                                                    borderRadius: 2,
                                                    borderTopLeftRadius: !isOwnMessage && !isMobile ? 0 : 2,
                                                    borderTopRightRadius: isOwnMessage && !isMobile ? 0 : 2,
                                                    position: 'relative',
                                                    wordBreak: 'break-word',
                                                    maxWidth: '100%'
                                                }}
                                            >
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        fontSize: { xs: '0.9375rem', sm: '1rem' },
                                                        lineHeight: 1.4
                                                    }}
                                                >
                                                    {message.content}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        display: 'block',
                                                        textAlign: 'right',
                                                        color: isOwnMessage ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                                        mt: 0.5,
                                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                                    }}
                                                >
                                                    {formatTime(message.created_at)}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    </ListItem>
                                </Box>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </List>
                )}
            </Paper>

            {/* Zone d'input des messages */}
            <Paper 
                elevation={3} 
                sx={{ 
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1000,
                    borderRadius: 0,
                    borderTop: 1,
                    borderColor: 'divider',
                    p: { xs: 2, sm: 2.5 }
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 1.5 },
                    alignItems: 'flex-end'
                }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                        multiline
                        maxRows={isMobile ? 3 : 4}
                        disabled={sending}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontSize: { xs: '0.9375rem', sm: '1rem' },
                                alignItems: 'flex-start'
                            }
                        }}
                        InputProps={{
                            sx: {
                                py: { xs: 1, sm: 1.25 }
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={sendMessage}
                        disabled={sending || !newMessage.trim()}
                        sx={{ 
                            minWidth: 'auto',
                            width: { xs: 56, sm: 64 },
                            height: { xs: 56, sm: 64 },
                            borderRadius: '50%',
                            p: 0
                        }}
                    >
                        {sending ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <Send sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        )}
                    </Button>
                </Box>
                
                {/* Indicateur de caractères sur mobile */}
                {isMobile && newMessage.length > 0 && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                            display: 'block',
                            textAlign: 'right',
                            mt: 0.5,
                            fontSize: '0.75rem'
                        }}
                    >
                        {newMessage.length}/500
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default ConversationDetailPage;
