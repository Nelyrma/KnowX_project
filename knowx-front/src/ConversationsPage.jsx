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
  Chip,
  Button,
  Divider,
  Badge,
  Avatar,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ArrowBack, Chat, Email } from '@mui/icons-material';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      alert('Cannot load conversations');
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (message) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { id: null, name: 'Unknown User' };
      
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.userId;
      
      return message.sender_id === userId ? 
        { 
          id: message.receiver_id, 
          name: `${message.receiver_first_name || ''} ${message.receiver_last_name || ''}`.trim() || 'User',
          firstName: message.receiver_first_name || 'User'
        } :
        { 
          id: message.sender_id, 
          name: `${message.sender_first_name || ''} ${message.sender_last_name || ''}`.trim() || 'User',
          firstName: message.sender_first_name || 'User'
        };
    } catch (err) {
      console.error('Error parsing token:', err);
      return { id: null, name: 'Unknown User', firstName: 'User' };
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
              mr: 2,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateX(-2px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <ArrowBack sx={{ fontSize: { xs: 24, sm: 28 } }} />
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
            Conversations
          </Typography>
        </Box>

        {/* Compteur et actions */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
          mt: { xs: 1, sm: 0 }
        }}>
          <Chip 
            icon={<Chat />}
            label={`${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`} 
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
              onClick={fetchConversations}
              variant="outlined"
              sx={{ ml: 2 }}
            >
              Refresh
            </Button>
          )}
        </Box>
      </Box>

      {/* Liste des conversations */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden'
        }}
      >
        {conversations.length === 0 ? (
          <Box sx={{ 
            p: { xs: 6, sm: 8 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Email 
              sx={{ 
                fontSize: 60, 
                color: 'text.secondary', 
                mb: 2,
                opacity: 0.6
              }} 
            />
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 1,
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              No conversations yet
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                maxWidth: 400,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
              }}
            >
              Start a conversation by messaging someone about their request.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {conversations.map((conversation, index) => {
              const otherUser = getOtherUser(conversation);
              const hasUnread = conversation.unread_count > 0;
              
              return (
                <Box key={conversation.id || index}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{
                      p: { xs: 2, sm: 3 },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        cursor: 'pointer'
                      },
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}
                    onClick={() => otherUser.id && navigate(`/conversation/${otherUser.id}`)}
                  >
                    {/* Avatar et infos utilisateur */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: { xs: 2, sm: 0 },
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <Avatar 
                        sx={{ 
                          mr: 2,
                          bgcolor: hasUnread ? 'primary.main' : 'grey.400',
                          width: { xs: 48, sm: 56 },
                          height: { xs: 48, sm: 56 },
                          fontWeight: 'bold'
                        }}
                      >
                        {otherUser.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          flexWrap: 'wrap',
                          gap: 1
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontSize: { xs: '1rem', sm: '1.125rem' },
                              fontWeight: hasUnread ? 700 : 600
                            }}
                          >
                            {otherUser.name}
                          </Typography>
                          
                          {hasUnread && (
                            <Badge 
                              badgeContent={conversation.unread_count} 
                              color="primary"
                              sx={{ 
                                '& .MuiBadge-badge': {
                                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                  height: { xs: 18, sm: 20 },
                                  minWidth: { xs: 18, sm: 20 }
                                }
                              }}
                            />
                          )}
                        </Box>
                        
                        {/* Titre de l'offre (si disponible) */}
                        {conversation.offer_title && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              color: 'primary.main',
                              fontWeight: 500,
                              mt: 0.5,
                              fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                            }}
                          >
                            {conversation.offer_title}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Dernier message et métadonnées */}
                    <Box sx={{ 
                      flex: 1,
                      mb: { xs: 2, sm: 0 },
                      px: { xs: 0, sm: 3 },
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      {/* Dernier message (tronqué) */}
                      <Typography 
                        variant="body2" 
                        color="text.primary"
                        sx={{ 
                          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                          fontWeight: hasUnread ? 600 : 400,
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4
                        }}
                      >
                        {conversation.content || 'No messages yet'}
                      </Typography>
                      
                      {/* Métadonnées */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: { xs: 0.5, sm: 1 },
                        alignItems: 'center'
                      }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {new Date(conversation.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        
                        <Box 
                          sx={{ 
                            width: 4, 
                            height: 4, 
                            borderRadius: '50%', 
                            bgcolor: 'text.secondary',
                            opacity: 0.6
                          }} 
                        />
                        
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          {conversation.message_count || 0} message{conversation.message_count !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Indicateur de statut sur mobile */}
                    {isMobile && hasUnread && (
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          right: 16,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main'
                        }}
                      />
                    )}
                  </ListItem>
                  
                  {index < conversations.length - 1 && <Divider />}
                </Box>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default ConversationsPage;
