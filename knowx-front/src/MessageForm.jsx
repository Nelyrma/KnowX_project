import { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress,
    Box,
    useMediaQuery,
    Typography,
    useTheme
} from '@mui/material';
import { Send, Close, Email } from '@mui/icons-material';

const MessageForm = ({ offerId, receiverId, receiverName, open, onClose }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmallMobile = useMediaQuery('(max-width: 400px)');

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
            // Optionnel: notification de succès
            // alert('Message sent successfully!');
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 2,
                    m: isMobile ? 0 : 2,
                    minHeight: isMobile ? '100vh' : 'auto',
                    maxHeight: isMobile ? '100vh' : 'calc(100vh - 64px)'
                }
            }}
        >
            {/* Header avec titre responsive */}
            <DialogTitle sx={{ 
                pr: 8,
                pb: 2,
                pt: { xs: 3, sm: 2.5 },
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <Email 
                        sx={{ 
                            color: 'primary.main',
                            fontSize: { xs: 24, sm: 28 }
                        }} 
                    />
                    <Box>
                        <Typography 
                            variant={isMobile ? "h6" : "h5"} 
                            component="div"
                            sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '1.125rem', sm: '1.25rem' }
                            }}
                        >
                            Send message
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                mt: 0.5
                            }}
                        >
                            To: {receiverName}
                        </Typography>
                    </Box>
                </Box>
                
                <IconButton 
                    onClick={onClose} 
                    sx={{ 
                        position: 'absolute', 
                        right: { xs: 12, sm: 8 }, 
                        top: { xs: 12, sm: 8 },
                        color: 'text.secondary'
                    }}
                    size={isMobile ? "medium" : "small"}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
      
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ 
                    pt: { xs: 3, sm: 2.5 },
                    pb: { xs: 2, sm: 1.5 }
                }}>
                    <TextField
                        autoFocus={!isMobile} // Sur mobile, le clavier s'ouvre automatiquement
                        multiline
                        rows={isSmallMobile ? 6 : (isMobile ? 8 : 6)}
                        fullWidth
                        variant="outlined"
                        label="Your message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontSize: { xs: '0.9375rem', sm: '1rem' }
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: { xs: '0.9375rem', sm: '1rem' }
                            }
                        }}
                        helperText="Be clear and specific about what help you need"
                        FormHelperTextProps={{
                            sx: { 
                                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                mx: 0
                            }
                        }}
                        inputProps={{
                            maxLength: 1000
                        }}
                    />
                    
                    {/* Compteur de caractères */}
                    <Typography 
                        variant="caption" 
                        color={content.length > 900 ? 'error' : 'text.secondary'}
                        sx={{ 
                            display: 'block', 
                            textAlign: 'right',
                            mt: 1,
                            fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                        }}
                    >
                        {content.length}/1000 characters
                    </Typography>
                </DialogContent>
        
                {/* Actions avec disposition responsive */}
                <DialogActions sx={{ 
                    p: { xs: 3, sm: 2.5 },
                    pt: { xs: 2, sm: 1.5 },
                    borderTop: 1,
                    borderColor: 'divider',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 1 },
                    bgcolor: 'background.default'
                }}>
                    <Button 
                        onClick={onClose} 
                        disabled={loading}
                        variant="outlined"
                        fullWidth={isMobile}
                        size={isMobile ? "large" : "medium"}
                        sx={{ 
                            order: { xs: 2, sm: 1 },
                            fontSize: { xs: '1rem', sm: '0.9375rem' }
                        }}
                    >
                        Cancel
                    </Button>
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading || !content.trim()}
                        startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                        fullWidth={isMobile}
                        size={isMobile ? "large" : "medium"}
                        sx={{ 
                            order: { xs: 1, sm: 2 },
                            fontSize: { xs: '1rem', sm: '0.9375rem' },
                            fontWeight: 600
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default MessageForm;
