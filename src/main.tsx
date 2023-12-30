import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {localStorage.getItem('chakra-ui-color-mode')? <></>:<>{localStorage.setItem('chakra-ui-color-mode', 'dark')}</>}
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
