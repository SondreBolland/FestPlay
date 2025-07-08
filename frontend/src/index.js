import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

const container = document.getElementById("app");
const root = createRoot(container);
try {
  root.render(<App />);
} catch (e) {
  console.error("Error rendering App:", e);
}

//root.render(<App />);
