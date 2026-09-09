import type { Candidate, Interview, InterviewEvent, Prisma } from "@prisma/client";
import { prisma } from "../db/client.js";

type CreateCandidateInput = {
  name: string;
  role: string;
  experience: string;
};

export const interviewRepository = {
  async createInterview(input: CreateCandidateInput): Promise<Interview & { candidate: Candidate }> {
    return prisma.interview.create({
      data: {
        status: "READY",
        candidate: {
          create: input,
        },
      },
      include: { candidate: true },
    });
  },

  async findById(id: string): Promise<(Interview & { candidate: Candidate; events: InterviewEvent[] }) | null> {
    return prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: true,
        events: { orderBy: { sequence: "asc" } },
      },
    });
  },

  async appendEvent(
    interviewId: string,
    type: string,
    payload: Prisma.InputJsonValue,
  ): Promise<InterviewEvent> {
    const latest = await prisma.interviewEvent.findFirst({
      where: { interviewId },
      orderBy: { sequence: "desc" },
      select: { sequence: true },
    });

    return prisma.interviewEvent.create({
      data: {
        interviewId,
        sequence: (latest?.sequence ?? 0) + 1,
        type,
        payload,
      },
    });
  },

  async transition(
    id: string,
    status: "CREATED" | "READY" | "INTRO" | "QUESTIONING" | "CODING" | "FOLLOW_UP" | "EVALUATING" | "COMPLETED",
  ) {
    return prisma.interview.update({
      where: { id },
      data: {
        status,
        ...(status === "INTRO" ? { startedAt: new Date() } : {}),
        ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
      },
      include: { candidate: true },
    });
  },
};
