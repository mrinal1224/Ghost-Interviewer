import type { InterviewEventType, InterviewStatus } from "@ghost-interviewer/contracts";

const transitions: Record<InterviewStatus, Partial<Record<InterviewEventType, InterviewStatus>>> = {
  created: { INTERVIEW_STARTED: "ready" },
  ready: { INTERVIEW_STARTED: "intro" },
  intro: { QUESTION_PRESENTED: "questioning" },
  questioning: {
    CANDIDATE_RESPONSE_RECEIVED: "questioning",
    CODING_STARTED: "coding",
    FOLLOW_UP_REQUESTED: "follow_up",
    INTERVIEW_COMPLETED: "evaluating"
  },
  coding: {
    CODE_SUBMITTED: "questioning",
    FOLLOW_UP_REQUESTED: "follow_up",
    INTERVIEW_COMPLETED: "evaluating"
  },
  follow_up: {
    QUESTION_PRESENTED: "questioning",
    CANDIDATE_RESPONSE_RECEIVED: "questioning",
    INTERVIEW_COMPLETED: "evaluating"
  },
  evaluating: { INTERVIEW_COMPLETED: "completed" },
  completed: {}
};

export function transition(
  current: InterviewStatus,
  event: InterviewEventType
): InterviewStatus {
  const next = transitions[current][event];

  if (!next) {
    throw new Error(`Invalid interview transition: ${current} -> ${event}`);
  }

  return next;
}
