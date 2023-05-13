import { Typography, Container, Link, Grid } from '@mui/material';
import { Box } from '@mui/system';
import Layout from '../Layout';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

function NotFound() {
  const { t } = useTranslation();
  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <img src={'/assets/404.svg'} alt={t("not_found")} style={{ maxWidth: "100%" }} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <Typography variant='h3'>{t("not_found")}</Typography>
            <Typography variant="body1">{t("not_found_message")}</Typography>
            <Link to="/" component={RouterLink}>{t("back_to_home")}</Link>
          </Grid>
        </Grid>
      </Box>   
    </Layout>
  );
}

export default NotFound;
