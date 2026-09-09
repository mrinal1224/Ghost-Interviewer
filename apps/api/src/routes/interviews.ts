import type { FastifyInstance } from "fastify";
import type { CandidateProfile, InterviewStatus } from "@ghost-interviewer/contracts";
import { createInterview, getInterview, transitionInterview } from "../services/interviewService.js";

interface CreateInterviewBody {
  userId?: string;
  candidate?: CandidateProfile;
}

export async function interviewRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateInterviewBody }>(
    "/interviews",
    async (request, reply) => {
      const candidate = request.body?.candidate;

      if (!candidate?.name?.trim() || !candidate.role || !candidate.experience) {
        return reply.code(400).send({ error: "INVALID_INTERVIEW_SETUP" });
      }

      const session = await createInterview(candidate);
      return reply.code(201).send(session);
    },
  );

  app.get<{ Params: { id: string } }>(
    "/interviews/:id",
    async (request, reply) => {
      const session = await getInterview(request.params.id);

      if (!session) {
        return reply.code(404).send({ error: "INTERVIEW_NOT_FOUND" });
      }

      return reply.send(session);
    },
  );

  app.post<{ Params: { id: string }; Body: { status?: InterviewStatus } }>(
    "/interviews/:id/transition",
    async (request, reply) => {
      const status = request.body?.status;
      if (!status) {
        return reply.code(400).send({ error: "INVALID_INTERVIEW_STATUS" });
      }

      try {
        const updated = await transitionInterview(request.params.id, status);
        if (!updated) {
          return reply.code(404).send({ error: "INTERVIEW_NOT_FOUND" });
        }

        return reply.send(updated);
      } catch (error) {
        if (error instanceof Error && error.message.startsWith("INVALID_INTERVIEW_TRANSITION:")) {
          return reply.code(409).send({
            error: "INVALID_INTERVIEW_TRANSITION",
            message: error.message,
          });
        }

        throw error;
      }
    },
  );
}
