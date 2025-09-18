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
  Divider
} from '@mui/material';
import { ArrowBack, MarkEmailRead } from '@mui/icons-material';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      // Met à jour localement l'état du message
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  if (loading) return <Typography>Loading messages...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/home')}
          sx={{ mr: 3 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          My Messages
        </Typography>
        <Chip 
          label={`${messages.length} messages`} 
          color="primary" 
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Liste des messages */}
      <Paper elevation={2}>
        {messages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No messages yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Your messages will appear here when someone contacts you.
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message, index) => (
              <Box key={message.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="span">
                          {message.sender_first_name} {message.sender_last_name}
                        </Typography>
                        {!message.is_read && (
                          <Chip 
                            label="New" 
                            color="primary" 
                            size="small" 
                            sx={{ ml: 2 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.primary" paragraph>
                          {message.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Regarding: {message.offer_title || 'Unknown offer'}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  {!message.is_read && (
                    <Button
                      size="small"
                      startIcon={<MarkEmailRead />}
                      onClick={() => markAsRead(message.id)}
                      sx={{ ml: 2 }}
                    >
                      Mark as read
                    </Button>
                  )}
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default MessagesPage;
