import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add a custom font loader for the Ghibli-inspired look
const linkItems = [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: ""
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700&family=Caveat:wght@400;500;600;700&display=swap"
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
  }
];

linkItems.forEach(item => {
  const link = document.createElement('link');
  Object.entries(item).forEach(([key, value]) => {
    if (value !== undefined) {
      link.setAttribute(key, value);
    }
  });
  document.head.appendChild(link);
});

// Add title
const title = document.createElement('title');
title.textContent = 'Whimsi - Daily Affirmations';
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
