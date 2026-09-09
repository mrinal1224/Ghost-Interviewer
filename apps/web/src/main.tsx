import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles.css";

const queryClient = new QueryClient();

function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">GHOST INTERVIEWER / ALPHA</p>
        <h1>Meet your next interviewer.</h1>
        <p className="lede">
          Adaptive technical interviews with voice, coding, real-time interaction,
          and a brutally honest post-interview report.
        </p>
        <div className="actions">
          <button type="button">Start an interview</button>
          <span>Architecture first. AI second.</span>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
