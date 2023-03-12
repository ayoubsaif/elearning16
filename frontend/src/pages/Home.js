import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Button,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';

function Home() {
  const { t } = useTranslation();
  return (
    <Layout>
      <Typography variant="h2" component="h1" align="center" sx={{ mt: 4 }}>
        Welcome to My App
      </Typography>
      <Typography variant="body1" align="center" sx={{ mt: 2 }}>
        This is the home page of my app. Use the login button in the navbar to log in.
      </Typography>
    </Layout>
  );
}

export default Home;
