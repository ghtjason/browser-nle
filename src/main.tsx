import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/open-sans";

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {localStorage.getItem("chakra-ui-color-mode") ? (
      <></>
    ) : (
      <>{localStorage.setItem("chakra-ui-color-mode", "dark")}</>
    )}
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
