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

export interface InterviewSession {
  id: string;
  userId: string;
  status: InterviewStatus;
  createdAt: string;
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
