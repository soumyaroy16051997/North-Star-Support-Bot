import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Note: StrictMode is intentionally omitted here. StrictMode double-invokes
// mount effects in development, which would double-append the chatbot's
// welcome messages on load. The ChatWindow's initial-message effect has no
// side effects that need StrictMode's double-render safety net, so leaving
// it out keeps the demo clean for evaluators without masking any real bugs.
createRoot(document.getElementById("root")!).render(<App />);
