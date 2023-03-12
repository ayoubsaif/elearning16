import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoginModal from '../components/LoginModal';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

const Layout = ({ props, children }) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const handleLoginClose = () => {
    setLoginModalOpen(false);
  };
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const handleSnaskbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  const handleSnaskbarOpen = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header setLoginModalOpen={setLoginModalOpen} notification={handleSnaskbarOpen} />
      <main style={{ flex: 1, padding: '2rem' }}>
          {children}
        </main>
      <Footer />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnaskbarClose}
        message="I love snacks"
      >
        <Alert onClose={handleSnaskbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>   
      </Snackbar>

      <LoginModal open={loginModalOpen} onClose={handleLoginClose} notification={handleSnaskbarOpen} />
    </div>
  );
};

export default Layout;
