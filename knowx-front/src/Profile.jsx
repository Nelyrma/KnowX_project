import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Chip,
    Paper,
    Divider,
    Avatar,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import { Save, ArrowBack, Person, Lock, Delete, Email, Sms, Notifications, Phone } from '@mui/icons-material';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        skills_offered: [],
        skills_wanted: [],
        notification_preferences: { email: true, sms: false, push: true }
    });
    const [currentSkillOffered, setCurrentSkillOffered] = useState('');
    const [currentSkillWanted, setCurrentSkillWanted] = useState('');
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:3001/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setFormData({
                    first_name: res.data.first_name || '',
                    last_name: res.data.last_name || '',
                    email: res.data.email || '',
                    phone_number: res.data.phone_number || '',
                    skills_offered: res.data.skills_offered || [],
                    skills_wanted: res.data.skills_wanted || [],
                    notification_preferences: res.data.notification_preferences || {
                        email: true,
                        sms: false,
                        push: true
                    }
                });
            } catch (err) {
                console.error('Error', err);
                setMessage('Cannot load profile');
            }
        };
        fetchProfile();
    }, []);

    const handleAddSkill = (type) => {
        if (type === 'offered' && currentSkillOffered && !formData.skills_offered.includes(currentSkillOffered)) {
            setFormData({
                ...formData,
                skills_offered: [...formData.skills_offered, currentSkillOffered]
            });
            setCurrentSkillOffered('');
        }
        if (type === 'wanted' && currentSkillWanted && !formData.skills_wanted.includes(currentSkillWanted)) {
            setFormData({
                ...formData,
                skills_wanted: [...formData.skills_wanted, currentSkillWanted]
            });
            setCurrentSkillWanted('');
        }
    };

    const handleRemoveSkill = (skillToRemove, type) => {
        if (type === 'offered') {
            setFormData({
                ...formData,
                skills_offered: formData.skills_offered.filter(skill => skill !== skillToRemove)
            });
        } else {
            setFormData({
                ...formData,
                skills_wanted: formData.skills_wanted.filter(skill => skill !== skillToRemove)
            });
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            // Désactiver SMS si pas de numéro
            const notificationPrefs = { ...formData.notification_preferences };
            if (!formData.phone_number) {
                notificationPrefs.sms = false;
            }
            await axios.put('http://localhost:3001/auth/profile', {
                ...formData,
                notification_preferences: notificationPrefs
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3001/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Password updated successfully!');
            setChangePasswordOpen(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage('Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure? This action cannot be undone!')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:3001/auth/account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token');
            navigate('/login');
            alert('Account deleted successfully');
        } catch (err) {
            setMessage('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    if (!user) return (
        <Container maxWidth="sm">
            <Typography>Loading...</Typography>
        </Container>
    );

    return (
        <Container maxWidth="md">
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4, 
                pt: 3,
                gap: 3
            }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate('/home')}
                    sx={{ 
                        color: 'primary.main',
                        minWidth: '100px'
                    }}
                    variant="outlined"
                >
                    Back
                </Button>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 'bold',
                        flexGrow: 1,
                        textAlign: 'center'
                    }}
                >
                    Edit My Profile
                </Typography>
            </Box>

            {message && (
                <Alert severity={message.includes('✅') ? "success" : "error"} sx={{ mb: 3 }}>
                    {message}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                {/* Informations utilisateur AVEC CHAMPS ÉDITABLES */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ width: 64, height: 64, mr: 3, bgcolor: 'primary.main' }}>
                        <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            placeholder="+33 6 12 34 56 78"
                            InputProps={{
                                startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Compétences offertes */}
                <Typography variant="h6" gutterBottom>
                    Skills I Can Offer
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Add a skill"
                        value={currentSkillOffered}
                        onChange={(e) => setCurrentSkillOffered(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('offered'))}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => handleAddSkill('offered')}>
                                    Add
                                </Button>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Box>
                        {formData.skills_offered.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                onDelete={() => handleRemoveSkill(skill, 'offered')}
                                sx={{ m: 0.5 }}
                                color="primary"
                            />
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Compétences recherchées */}
                <Typography variant="h6" gutterBottom>
                    Skills I'm Looking For
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Add a skill"
                        value={currentSkillWanted}
                        onChange={(e) => setCurrentSkillWanted(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('wanted'))}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => handleAddSkill('wanted')}>
                                    Add
                                </Button>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Box>
                        {formData.skills_wanted.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                onDelete={() => handleRemoveSkill(skill, 'wanted')}
                                sx={{ m: 0.5 }}
                                color="secondary"
                            />
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Préférences de notifications */}
                <Typography variant="h6" gutterBottom>
                    Notification Preferences
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.notification_preferences.email}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    notification_preferences: {
                                        ...formData.notification_preferences,
                                        email: e.target.checked
                                    }
                                })}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email sx={{ mr: 1, fontSize: 20 }} />
                                Email Notifications
                            </Box>
                        }
                    />
                </Box>

                
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.notification_preferences.sms && !!formData.phone_number}
                                onChange={(e) => {
                                    if (!formData.phone_number) {
                                        setMessage('Please add a phone number first');
                                        return;
                                    }
                                    setFormData({
                                        ...formData,
                                        notification_preferences: {
                                            ...formData.notification_preferences,
                                            sms: e.target.checked
                                        }
                                    })
                                }}
                                disabled={!formData.phone_number}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Sms sx={{ mr: 1, fontSize: 20 }} />
                                SMS Notifications
                                {!formData.phone_number && (
                                    <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                                        (Add phone number first)
                                    </Typography>
                                )}
                            </Box>
                        }
                    />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.notification_preferences.push}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    notification_preferences: {
                                        ...formData.notification_preferences,
                                        push: e.target.checked
                                    }
                                })}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Notifications sx={{ mr: 1, fontSize: 20 }} />
                                Push Notifications
                            </Box>
                        }
                    />
                </Box>

                {/* Bouton de sauvegarde */}
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleUpdate}
                    disabled={loading}
                    startIcon={<Save />}
                    sx={{ mt: 3 }}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </Paper>

            {/* Section sécurité */}
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Security
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    onClick={() => setChangePasswordOpen(true)}
                    sx={{ mb: 3 }}
                >
                    Change Password
                </Button>

                <br />

                <Button
                    color="error"
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={handleDeleteAccount}
                >
                    Delete Account
                </Button>
            </Paper>

            {/* Dialog changement de mot de passe */}
            <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleChangePassword} 
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Profile;
