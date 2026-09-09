export type InterviewStatus =
  | "created"
  | "ready"
  | "intro"
  | "questioning"
  | "coding"
  | "follow_up"
  | "evaluating"
  | "completed";

export type InterviewEventType =
  | "INTERVIEW_CREATED"
  | "INTERVIEW_STARTED"
  | "QUESTION_PRESENTED"
  | "CANDIDATE_RESPONSE_RECEIVED"
  | "CODING_STARTED"
  | "CODE_SUBMITTED"
  | "FOLLOW_UP_REQUESTED"
  | "INTERVIEW_COMPLETED";

export interface CandidateProfile {
  name: string;
  role: "frontend" | "backend" | "fullstack";
  experience: "0-1" | "1-3" | "3+";
}

export interface CreateInterviewRequest {
  name: string;
  role: CandidateProfile["role"];
  experience: CandidateProfile["experience"];
}

export interface InterviewSession {
  id: string;
  userId: string;
  status: InterviewStatus;
  createdAt: string;
  candidate: CandidateProfile;
}

export interface InterviewEvent {
  id: string;
  sessionId: string;
  type: InterviewEventType;
  sequence: number;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface HealthResponse {
  status: "ok";
  service: "api";
  timestamp: string;
}
