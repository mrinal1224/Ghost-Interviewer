import { FormEvent, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import { createInterview, getInterview, type InterviewSetup } from "./lib/api.js";
import { InterviewRoom } from "./components/InterviewRoom.js";
import "./styles.css";

const queryClient = new QueryClient();

const defaultSetup: InterviewSetup = {
  name: "",
  role: "frontend",
  experience: "0-1",
};

function App() {
  const pathSessionId = window.location.pathname.match(/^\/interview\/([^/]+)$/)?.[1] ?? null;
  const [setup, setSetup] = useState<InterviewSetup>(defaultSetup);
  const [sessionId, setSessionId] = useState<string | null>(pathSessionId);

  const createMutation = useMutation({
    mutationFn: createInterview,
    onSuccess: (session) => {
      setSessionId(session.id);
      window.history.pushState({}, "", `/interview/${session.id}`);
    },
  });

  const sessionQuery = useQuery({
    queryKey: ["interview", sessionId],
    queryFn: () => getInterview(sessionId!),
    enabled: Boolean(sessionId),
    retry: 1,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createMutation.mutate(setup);
  }

  if (sessionId) {
    if (sessionQuery.isPending) {
      return <main className="room-shell"><div className="room-card"><p className="eyebrow">GHOST INTERVIEWER / LOADING</p><h1>Preparing your room.</h1></div></main>;
    }

    if (sessionQuery.isError || !sessionQuery.data) {
      return <main className="room-shell"><div className="room-card"><p className="eyebrow">GHOST INTERVIEWER / ERROR</p><h1>Session not found.</h1><button className="primary-action" type="button" onClick={() => { setSessionId(null); window.history.pushState({}, "", "/"); }}>Start a new interview</button></div></main>;
    }

    return <InterviewRoom session={sessionQuery.data} />;
  }

  return (
    <main className="shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">GHOST INTERVIEWER / ALPHA</p>
          <h1>Meet your next interviewer.</h1>
          <p className="lede">
            A technical interview that listens, adapts, challenges your thinking, and remembers how you reason.
          </p>
          <div className="proof-row">
            <span>Adaptive questioning</span>
            <span>Voice-first</span>
            <span>Code evaluation</span>
          </div>
        </div>

        <form className="setup-card" onSubmit={handleSubmit}>
          <div>
            <p className="card-kicker">BEFORE WE BEGIN</p>
            <h2>Set up your interview</h2>
            <p className="muted">Three details. Then the room opens.</p>
          </div>

          <label>
            <span>Your name</span>
            <input required value={setup.name} onChange={(event) => setSetup({ ...setup, name: event.target.value })} placeholder="e.g. Mrinal" />
          </label>

          <label>
            <span>Target role</span>
            <select value={setup.role} onChange={(event) => setSetup({ ...setup, role: event.target.value as InterviewSetup["role"] })}>
              <option value="frontend">Frontend Engineer</option>
              <option value="backend">Backend Engineer</option>
              <option value="fullstack">Fullstack Engineer</option>
            </select>
          </label>

          <label>
            <span>Experience</span>
            <select value={setup.experience} onChange={(event) => setSetup({ ...setup, experience: event.target.value as InterviewSetup["experience"] })}>
              <option value="0-1">0–1 years</option>
              <option value="1-3">1–3 years</option>
              <option value="3+">3+ years</option>
            </select>
          </label>

          {createMutation.isError && <p className="error-message">Could not start the interview. Is the API running on port 4000?</p>}

          <button className="primary-action" type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating room…" : "Begin interview →"}
          </button>
          <p className="fine-print">Your session opens in a dedicated interview room.</p>
        </form>
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
