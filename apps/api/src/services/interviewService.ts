import type { Prisma } from "@prisma/client";
import { interviewRepository } from "../repositories/interviewRepository.js";
import type { CandidateProfile, InterviewStatus } from "@ghost-interviewer/contracts";

const transitions: Record<InterviewStatus, InterviewStatus[]> = {
  created: ["ready"],
  ready: ["intro"],
  intro: ["questioning"],
  questioning: ["coding", "follow_up", "evaluating"],
  coding: ["questioning", "follow_up", "evaluating"],
  follow_up: ["questioning", "coding", "evaluating"],
  evaluating: ["completed"],
  completed: [],
};

const statusToDb = {
  created: "CREATED",
  ready: "READY",
  intro: "INTRO",
  questioning: "QUESTIONING",
  coding: "CODING",
  follow_up: "FOLLOW_UP",
  evaluating: "EVALUATING",
  completed: "COMPLETED",
} as const;

export async function createInterview(candidate: CandidateProfile) {
  const session = await interviewRepository.createInterview(candidate);
  await interviewRepository.appendEvent(session.id, "INTERVIEW_CREATED", {
    candidate,
  });

  return {
    id: session.id,
    userId: "anonymous",
    status: "ready" as const,
    createdAt: session.createdAt.toISOString(),
    candidate,
  };
}

export async function getInterview(id: string) {
  const session = await interviewRepository.findById(id);
  if (!session) return null;

  return {
    id: session.id,
    status: session.status.toLowerCase() as InterviewStatus,
    createdAt: session.createdAt.toISOString(),
    startedAt: session.startedAt?.toISOString() ?? null,
    completedAt: session.completedAt?.toISOString() ?? null,
    candidate: session.candidate,
    events: session.events.map((event) => ({
      id: event.id,
      sequence: event.sequence,
      type: event.type,
      occurredAt: event.occurredAt.toISOString(),
      payload: event.payload,
    })),
  };
}

export async function transitionInterview(
  id: string,
  nextStatus: InterviewStatus,
  payload: Prisma.InputJsonValue = {},
) {
  const current = await interviewRepository.findById(id);
  if (!current) return null;

  const currentStatus = current.status.toLowerCase() as InterviewStatus;
  if (!transitions[currentStatus].includes(nextStatus)) {
    throw new Error(`INVALID_INTERVIEW_TRANSITION:${currentStatus}:${nextStatus}`);
  }

  const updated = await interviewRepository.transition(id, statusToDb[nextStatus]);
  await interviewRepository.appendEvent(id, `STATE_CHANGED_TO_${nextStatus.toUpperCase()}`, payload);

  return {
    id: updated.id,
    status: nextStatus,
    createdAt: updated.createdAt.toISOString(),
    candidate: updated.candidate,
  };
}
