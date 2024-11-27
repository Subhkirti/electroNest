import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f45e4",
      secondary: "#16a349",
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontSize: "16px",
          textTransform: "initial",
          boxShadow: "none !important",
          padding: "10px 30px",
        },
        
      },
    },
  },
});

export default theme;
