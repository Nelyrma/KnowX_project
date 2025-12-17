import { useState } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Send, Close } from '@mui/icons-material';

const MessageForm = ({ offerId, receiverId, receiverName, open, onClose }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/messages', {
                receiver_id: receiverId,
                offer_id: offerId,
                content: content.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setContent('');
            onClose();
        } catch (err) {
            alert('❌ Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Send message to {receiverName}
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
      
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        label="Your message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        disabled={loading}
                    />
                </DialogContent>
        
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading || !content.trim()}
                        startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default MessageForm;
