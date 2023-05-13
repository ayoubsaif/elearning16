import React, { useContext, useState} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LoginIcon from "@mui/icons-material/Login";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import AuthService from "../services/AuthService";
import { UserContext } from "../App";

const LoginModal = ({ open, onClose, notification }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useContext(UserContext);
  const [loginAlert, setLoginAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email and password
    if (!email || !password) {
      console.log("Please enter email and password.");
      return;
    }

    // Make API call with email and password
    try {
      const data = await AuthService.login(email, password);
      sessionStorage.setItem("token", data.jwt);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      setUserData({
        isLogged: true,
        jwt: data.jwt,
        user: data.user,
      });
      notification(t("loginSuccess"), 'success');
      onClose();
    } catch (error) {
      setLoginAlert(true);
    }
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("login")}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("email")}
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t("password")}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {/*<FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={t("remember_me")}
          />*/}
          
          {loginAlert &&
              <Alert severity="error" onClose={() => setLoginAlert(false)}>
                {t("loginError")}
              </Alert>
            }
          <Grid container sx={{mt: 2}}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<LoginIcon />}
            >
              {t("login")}
            </Button>
            {/*<Grid item xs>
              <Link href="#" variant="body2">
                {t("forgot_password")}
              </Link>
            </Grid>*/}
            <Grid item>
              <Link href={'/signup'} variant="body2">
                {t("dont_have_an_account")}
              </Link>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginModal;
