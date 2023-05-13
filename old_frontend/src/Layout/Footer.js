import React from "react";
import { Box, Typography, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: "auto",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; {new Date().getFullYear()} {t("company_name")}. All rights reserved.
      </Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">Language</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={i18n.language}
          label="Language"
          onChange={(e) =>
            i18n.changeLanguage(e.target.value)
          }
        >
          <MenuItem value={"en-EN"}>{t("english")}</MenuItem>
          <MenuItem value={"es-ES"}>{t("spanish")}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Footer;
