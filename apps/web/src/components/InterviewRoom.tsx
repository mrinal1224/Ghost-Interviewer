import { useEffect, useMemo, useState } from "react";
import type { InterviewSession } from "../lib/api.js";

interface InterviewRoomProps {
  session: InterviewSession;
}

const phaseLabels: Record<string, string> = {
  intro: "Introduction",
  questioning: "Technical discussion",
  coding: "Coding challenge",
  follow_up: "Follow-up",
};

export function InterviewRoom({ session }: InterviewRoomProps) {
  const [elapsed, setElapsed] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(true);
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [elapsed]);

  const displayName = session.candidate?.name ?? "Candidate";
  const role = session.candidate?.role ?? "fullstack";
  const phase = phaseLabels[session.status] ?? "Interview ready";

  return (
    <main className="room-page">
      <header className="room-header">
        <div>
          <p className="eyebrow">GHOST INTERVIEWER / LIVE</p>
          <h1>Technical Interview</h1>
        </div>
        <div className="room-header-meta">
          <span className={connected ? "connection-pill live" : "connection-pill"}>
            <i /> {connected ? "Connected" : "Connecting"}
          </span>
          <span className="timer">{formattedTime}</span>
        </div>
      </header>

      <section className="room-grid">
        <aside className="room-panel interviewer-panel">
          <div className="avatar-orb" aria-hidden="true">G</div>
          <p className="card-kicker">AI INTERVIEWER</p>
          <h2>The Ghost</h2>
          <p className="muted">Adaptive interviewer · Technical round</p>
          <div className="voice-state">
            <span className="pulse" />
            Listening for your answer
          </div>
        </aside>

        <section className="room-panel conversation-panel">
          <div className="panel-topline">
            <div>
              <span className="card-kicker">CURRENT PHASE</span>
              <strong>{phase}</strong>
            </div>
            <span className="session-tag">#{session.id.slice(0, 8)}</span>
          </div>

          <div className="conversation">
            <div className="message ghost-message">
              <span className="message-label">GHOST</span>
              <p>
                Hi {displayName}. I&apos;ll be your interviewer today. We&apos;re going to focus on how you
                reason, not just whether you know the answer.
              </p>
            </div>
            <div className="message ghost-message active-message">
              <span className="message-label">GHOST</span>
              <p>
                Let&apos;s start simple. Walk me through how you would design a frontend application that
                needs to handle a sudden 10× traffic spike.
              </p>
            </div>
            <div className="response-placeholder">
              <span>⌁</span>
              Your response will appear here when voice input is connected.
            </div>
          </div>

          <div className="composer-hint">
            <span>VOICE INPUT</span>
            <span>WebSocket transport coming next</span>
          </div>
        </section>

        <aside className="room-panel progress-panel">
          <p className="card-kicker">INTERVIEW MAP</p>
          <div className="progress-list">
            {[
              ["intro", "Introduction"],
              ["questioning", "Technical discussion"],
              ["coding", "Coding challenge"],
              ["evaluation", "Evaluation"],
            ].map(([key, label], index) => {
              const active = index === 1;
              return (
                <div className={active ? "progress-item active" : "progress-item"} key={key}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{label}</strong>
                </div>
              );
            })}
          </div>

          <div className="candidate-card">
            <span className="card-kicker">CANDIDATE</span>
            <strong>{displayName}</strong>
            <span>{role.charAt(0).toUpperCase() + role.slice(1)} Engineer</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
