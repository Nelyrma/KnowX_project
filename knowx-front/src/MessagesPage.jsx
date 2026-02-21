import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ArrowBack, MarkEmailRead, Reply, Send, Close, Person, Email } from '@mui/icons-material';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      alert('Cannot load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/messages/${messageId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleReply = (message) => {
    setCurrentMessage(message);
    setReplyOpen(true);
  };

  const sendReply = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/messages', {
        receiver_id: currentMessage.sender_id,
        offer_id: currentMessage.offer_id,
        content: replyContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReplyOpen(false);
      setReplyContent('');
      setCurrentMessage(null);
      alert('Reply sent successfully!');
    } catch (err) {
      alert('Error sending reply: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      {/* Header responsive */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        mb: { xs: 3, sm: 4 },
        gap: { xs: 2, sm: 0 }
      }}>
        {/* Bouton retour et titre */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <IconButton 
            onClick={() => navigate('/home')}
            sx={{ 
              mr: { xs: 1, sm: 2 },
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateX(-2px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <ArrowBack sx={{ 
              fontSize: { xs: 24, sm: 28 }
            }} />
          </IconButton>
          
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1.5rem', sm: '2rem' },
              fontWeight: 'bold'
            }}
          >
            My Messages
          </Typography>
        </Box>

        {/* Compteur de messages */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
          mt: { xs: 1, sm: 0 }
        }}>
          <Chip 
            icon={<Email />}
            label={`${messages.length} message${messages.length !== 1 ? 's' : ''}`} 
            color="primary" 
            variant="outlined"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              height: { xs: 32, sm: 36 }
            }}
          />
          
          {/* Bouton de rafraîchissement sur mobile */}
          {isMobile && (
            <Button 
              size="small" 
              onClick={fetchMessages}
              variant="outlined"
              sx={{ ml: 2 }}
            >
              Refresh
            </Button>
          )}
        </Box>
      </Box>

      {/* Liste des messages - version responsive */}
      {messages.length === 0 ? (
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
            borderRadius: { xs: 2, sm: 3 }
          }}
        >
          <Email sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No messages yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your messages will appear here when someone contacts you.
          </Typography>
        </Paper>
      ) : (
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: { xs: 2, sm: 3 },
            overflow: 'hidden'
          }}
        >
          <List sx={{ p: 0 }}>
            {messages.map((message, index) => (
              <Box key={message.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    p: { xs: 2, sm: 3 },
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {/* Avatar et infos de l'expéditeur */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: { xs: 2, sm: 0 },
                    width: { xs: '100%', sm: 'auto' }
                  }}>
                    <Avatar sx={{ 
                      mr: 2,
                      bgcolor: 'primary.main',
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 }
                    }}>
                      <Person />
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            fontWeight: 600
                          }}
                        >
                          {message.sender_first_name} {message.sender_last_name}
                        </Typography>
                        
                        {!message.is_read && (
                          <Chip 
                            label="New" 
                            color="primary" 
                            size="small" 
                            sx={{ 
                              ml: { xs: 1, sm: 2 },
                              fontSize: { xs: '0.625rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 }
                            }}
                          />
                        )}
                      </Box>
                      
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'block',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {new Date(message.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                      
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'block',
                          mt: 0.5,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Regarding: {message.offer_title || 'Unknown offer'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Contenu du message */}
                  <Box sx={{ 
                    flex: 1,
                    mb: { xs: 2, sm: 0 },
                    px: { xs: 0, sm: 2 },
                    width: { xs: '100%', sm: 'auto' }
                  }}>
                    <Typography 
                      variant="body2" 
                      color="text.primary"
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Box>
                  
                  {/* Boutons d'actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'row', sm: 'column' }, 
                    gap: 1,
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                  }}>
                    {!message.is_read && (
                      <Button
                        size="small"
                        startIcon={<MarkEmailRead />}
                        onClick={() => markAsRead(message.id)}
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          minWidth: { xs: 'auto', sm: 140 }
                        }}
                      >
                        <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>
                          Mark as read
                        </Typography>
                        <Typography sx={{ display: { xs: 'inline', sm: 'none' } }}>
                          Mark read
                        </Typography>
                      </Button>
                    )}
                    
                    <Button
                      size="small"
                      variant={!message.is_read ? "contained" : "outlined"}
                      startIcon={<Reply />}
                      onClick={() => handleReply(message)}
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        minWidth: { xs: 'auto', sm: 140 }
                      }}
                    >
                      <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        Reply
                      </Typography>
                      <Typography sx={{ display: { xs: 'inline', sm: 'none' } }}>
                        Reply
                      </Typography>
                    </Button>
                  </Box>
                </ListItem>
                
                {index < messages.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      )}

      {/* Reply Dialog responsive */}
      <Dialog 
        open={replyOpen} 
        onClose={() => setReplyOpen(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          pr: 8,
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Reply to {currentMessage?.sender_first_name}
          <IconButton 
            onClick={() => setReplyOpen(false)} 
            sx={{ 
              position: 'absolute', 
              right: 8, 
              top: 8 
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
          >
            Regarding: {currentMessage?.offer_title}
          </Typography>
          
          <TextField
            autoFocus
            multiline
            rows={isMobile ? 6 : 4}
            fullWidth
            variant="outlined"
            label="Your reply message"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              sx: { fontSize: { xs: '0.9375rem', sm: '1rem' } }
            }}
            InputLabelProps={{
              sx: { fontSize: { xs: '0.9375rem', sm: '1rem' } }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={() => setReplyOpen(false)} 
            fullWidth={isMobile}
            sx={{ 
              order: { xs: 2, sm: 1 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={sendReply} 
            variant="contained" 
            startIcon={<Send />}
            disabled={!replyContent.trim()}
            fullWidth={isMobile}
            sx={{ 
              order: { xs: 1, sm: 2 },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 1, sm: 0 }
            }}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MessagesPage;
