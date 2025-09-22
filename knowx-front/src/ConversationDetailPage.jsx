import { useState, useEffect } from 'react';
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
  ListItemText,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import { ArrowBack, Send, Person } from '@mui/icons-material';

const ConversationDetailPage = () => {
  const { userId: otherUserId } = useParams();
  const [conversation, setConversation] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Renommé pour plus de clarté
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

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
            `${firstMessage.sender_first_name} ${firstMessage.sender_last_name}`
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
        name: `${res.data.first_name} ${res.data.last_name}`
      });
    } catch (err) {
      console.error('Error fetching user info:', err);
      setOtherUser({
        id: otherUserId,
        name: 'Unknown User'
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

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
      <Typography>Loading conversation...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/messages')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
          <Person />
        </Avatar>
        <Box>
          <Typography variant="h6">
            {otherUser?.name || 'Unknown User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conversation
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Paper elevation={2} sx={{ flex: 1, p: 2, mb: 2, overflow: 'auto' }}>
        {conversation.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <List>
            {conversation.map((message, index) => {
              const isOwnMessage = message.sender_id === currentUserId;
              const showDate = index === 0 || 
                new Date(message.created_at).toDateString() !== 
                new Date(conversation[index - 1].created_at).toDateString();

              return (
                <Box key={message.id}>
                  {/* Date separator */}
                  {showDate && (
                    <Box sx={{ textAlign: 'center', my: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  <ListItem sx={{ 
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    px: 1
                  }}>
                    <Box sx={{ 
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 1
                    }}>
                      {!isOwnMessage && (
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <Person sx={{ fontSize: 16 }} />
                        </Avatar>
                      )}
                      
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2,
                          bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                          color: isOwnMessage ? 'white' : 'text.primary',
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="body1">
                          {message.content}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            textAlign: 'right',
                            color: isOwnMessage ? 'white' : 'text.secondary',
                            mt: 0.5
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
          </List>
        )}
      </Paper>

      {/* Input message */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            multiline
            maxRows={3}
            disabled={sending}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            startIcon={<Send />}
            sx={{ minWidth: 'auto' }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConversationDetailPage;
