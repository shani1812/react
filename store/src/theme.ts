import { createTheme } from "@mui/material/styles";
import font from "./assests/Quicksand-BoldItalic.otf";

const theme = createTheme({
    palette: {
        background: {
            default: "rgba(255, 192, 203, 0.64)",
        },
        text: {
            primary: "rgb(133, 86, 64)",
            secondary: "#58000F",
        },
    },
    typography: {
        fontFamily: `"Quicksand"`,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'Quicksand';
          src: local('Quicksand'), local('Quicksand'), url(${font}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
        },
    },
});

export default theme;
