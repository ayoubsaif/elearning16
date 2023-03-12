// Create a dashboard shows the user's name and email address
//  and a logout button.

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Button,
    Link,
    Toolbar,
    Typography,
} from '@mui/material';

function Dashboard() {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My App
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                </Toolbar>
            </AppBar>
            <Typography variant="h2" component="h1" align="center" sx={{ mt: 4 }}>
                Welcome to My App
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                This is the home page of my app. Use the login button in the navbar to log in.
            </Typography>
        </div>
    );
}

export default Dashboard;