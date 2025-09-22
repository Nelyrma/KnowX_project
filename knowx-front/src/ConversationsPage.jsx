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
  Badge
} from '@mui/material';
import { ArrowBack, MarkEmailRead, Chat } from '@mui/icons-material';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;
    return message.sender_id === userId ? 
      { id: message.receiver_id, name: `${message.receiver_first_name} ${message.receiver_last_name}` } :
      { id: message.sender_id, name: `${message.sender_first_name} ${message.sender_last_name}` };
  };

  if (loading) return <Typography>Loading conversations...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/home')}
          sx={{ mr: 3 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Messages
        </Typography>
        <Chip 
          label={`${conversations.length} conversations`} 
          color="primary" 
          sx={{ ml: 2 }}
        />
      </Box>

      <Paper elevation={2}>
        {conversations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No conversations yet
            </Typography>
          </Box>
        ) : (
          <List>
            {conversations.map((conversation, index) => {
              const otherUser = getOtherUser(conversation);
              return (
                <Box key={conversation.id}>
                  <ListItem 
                    alignItems="flex-start"
                    button
                    onClick={() => navigate(`/conversation/${otherUser.id}`)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" component="span">
                            {otherUser.name}
                          </Typography>
                          {conversation.unread_count > 0 && (
                            <Badge 
                              badgeContent={conversation.unread_count} 
                              color="primary"
                              sx={{ ml: 2 }}
                            >
                              <Chat />
                            </Badge>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary" paragraph>
                            {conversation.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.offer_title && `Regarding: ${conversation.offer_title} • `}
                            {new Date(conversation.created_at).toLocaleString()} • 
                            {conversation.message_count} messages
                          </Typography>
                        </Box>
                      }
                    />
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
