import type { FastifyInstance } from "fastify";
import type { InterviewSession } from "@ghost-interviewer/contracts";

interface CandidateInput {
  name: string;
  role: "frontend" | "backend" | "fullstack";
  experience: "0-1" | "1-3" | "3+";
}

const sessions = new Map<string, InterviewSession>();

export async function interviewRoutes(app: FastifyInstance) {
  app.post<{ Body: { userId?: string; candidate?: CandidateInput } }>(
    "/interviews",
    async (request, reply) => {
      const candidate = request.body?.candidate;

      if (
        !candidate?.name?.trim() ||
        !candidate.role ||
        !candidate.experience
      ) {
        return reply.code(400).send({ error: "INVALID_INTERVIEW_SETUP" });
      }

      const id = crypto.randomUUID();
      const session: InterviewSession = {
        id,
        userId: request.body?.userId ?? "anonymous",
        status: "ready",
        createdAt: new Date().toISOString(),
        candidate,
      };

      sessions.set(id, session);
      return reply.code(201).send(session);
    },
  );

  app.get<{ Params: { id: string } }>(
    "/interviews/:id",
    async (request, reply) => {
      const session = sessions.get(request.params.id);

      if (!session) {
        return reply.code(404).send({ error: "INTERVIEW_NOT_FOUND" });
      }

      return session;
    },
  );
}
