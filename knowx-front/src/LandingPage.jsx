'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';

const LandingPage = () => {
  const theme = useTheme();

  const chipSx = {
    backgroundColor: theme.palette.primary.light,
    color: '#333',
    fontWeight: 'bold',
    mx: 0.5,
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: '#333',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top-right auth links */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Log in — text link */}
        <Typography
          component="a"
          href="/login"
          sx={{
            color: '#555',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            '&:hover': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
            },
          }}
        >
          Log in
        </Typography>

        {/* Sign up — subtle button */}
        <Button
          href="/signup"
          variant="outlined"
          size="small"
          sx={{
            borderColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.9rem',
            px: 1.8,
            py: 0.5,
            borderRadius: '6px',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          Sign up
        </Button>
      </Box>

    {/* Hero */}
    <Box
        sx={{
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', mb: 2 }}>
            Knowledge Shared Is Knowledge Multiplied
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: '#555' }}>
            A minimalist platform for students to exchange skills, just peer-to-peer learning.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/signup"
            sx={{
              backgroundColor: theme.palette.primary.dark,
              ':hover': { backgroundColor: theme.palette.primary.main },
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Get Started — Free & Instant
          </Button>
          <Typography variant="body2" sx={{ mt: 2, color: '#777' }}>
            No payment. No complex setup. Just your skills and curiosity.
          </Typography>
        </Container>
      </Box>

      {/* Problem */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Students know a lot… but have nowhere to share it.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              At schools like Holberton and beyond, learners bring diverse backgrounds — coding, design, languages, ... — yet most collaboration happens by chance, in hallways or group chats.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Without a dedicated space, knowledge stays siloed. Help gets lost. Potential stays untapped.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Solution */}
      <Box sx={{ py: 6, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 6 }}>
            The KnowX Way
          </Typography>
          <Grid container spacing={4}>
            {[
              { title: 'Offer Help', desc: 'List your skills — Python, Git, UX, anything.' },
              { title: 'Find Help', desc: 'Browse & filter requests by topic or status.' },
              { title: 'Match & Learn', desc: 'Respond, chat, and solve it together — peer to peer.' },
            ].map((item, i) => (
              <Grid xs={12} sm={4} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              ✅ Free. Peer-driven. Built for students, by students.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6 }}>
          How It Works
        </Typography>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Simple, intentional, and fast:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip label="Pending" sx={chipSx} />
            <Chip label="In Progress" sx={chipSx} />
            <Chip label="Resolved" sx={chipSx} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            'Sign up in seconds — just email & name.',
            'Post or browse requests. Filter by skill or status.',
            'Offer Help, start a chat, and collaborate.',
            'Update your profile anytime — grow your skill map as you learn.',
          ].map((step, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.5,
                }}
              >
                {i + 1}
              </Box>
              <Typography variant="body1">{step}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 4 }}>
          📱 Fully responsive. Works on laptop, tablet, phone.
        </Typography>
      </Container>

      {/* Why Stand Out */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" sx={{ mb: 6 }}>
            Why KnowX Stands Out
          </Typography>
          <Grid container spacing={3}>
            {[
              { text: '1. No paywalls, no tiers — 100% free for students.' },
              { text: '2. True peer-to-peer: You’re not “customers” — you’re co-learners.' },
              { text: '3. Skills > hierarchy: A first-year can help a senior in design.' },
              { text: '4. Minimalist by design: No noise. Just clear requests and real help.' },
            ].map((item, i) => (
              <Grid xs={12} sm={6} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Typography sx={{ fontSize: '1.5rem', mt: 0.3 }}>{item.icon}</Typography>
                  <Typography variant="body1">{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box
        sx={{
          py: 8,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ mb: 2 }}>
            Join the knowledge loop.
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Sign up in 30 seconds. No credit card. No commitment.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/signup"
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              ':hover': { backgroundColor: '#f0f0f0' },
              fontWeight: 'bold',
            }}
          >
            Start Helping & Learning →
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          color: '#666',
          fontSize: '0.875rem',
        }}
      >
        KnowX — Peer Learning, Simplified<br />
        © {new Date().getFullYear()} KnowX. Made with ♥ for students, everywhere.<br />
        <Box sx={{ mt: 1 }}>
          <a href="/privacy" style={{ color: '#666', margin: '0 8px' }}>Privacy</a> •{' '}
          <a href="/terms" style={{ color: '#666', margin: '0 8px' }}>Terms</a> •{' '}
          <a href="/contact" style={{ color: '#666', margin: '0 8px' }}>Contact</a>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
