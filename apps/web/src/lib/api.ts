export interface InterviewSetup {
  name: string;
  role: "frontend" | "backend" | "fullstack";
  experience: "0-1" | "1-3" | "3+";
}

export interface InterviewSession {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  candidate?: InterviewSetup;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function createInterview(input: InterviewSetup): Promise<InterviewSession> {
  const response = await fetch(`${API_BASE_URL}/api/v1/interviews`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      userId: "anonymous",
      candidate: input,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to create interview session");
  }

  return response.json() as Promise<InterviewSession>;
}

export async function getInterview(id: string): Promise<InterviewSession> {
  const response = await fetch(`${API_BASE_URL}/api/v1/interviews/${id}`);

  if (!response.ok) {
    throw new Error("Interview session not found");
  }

  return response.json() as Promise<InterviewSession>;
}
