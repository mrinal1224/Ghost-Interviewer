import type { FastifyInstance } from "fastify";
import type { InterviewSession } from "@ghost-interviewer/contracts";

const sessions = new Map<string, InterviewSession>();

export async function interviewRoutes(app: FastifyInstance) {
  app.post<{ Body: { userId?: string } }>("/interviews", async (request, reply) => {
    const userId = request.body?.userId ?? "anonymous";
    const id = crypto.randomUUID();
    const session: InterviewSession = {
      id,
      userId,
      status: "created",
      createdAt: new Date().toISOString()
    };

    sessions.set(id, session);
    return reply.code(201).send(session);
  });

  app.get<{ Params: { id: string } }>("/interviews/:id", async (request, reply) => {
    const session = sessions.get(request.params.id);

    if (!session) {
      return reply.code(404).send({ error: "INTERVIEW_NOT_FOUND" });
    }

    return session;
  });
}
