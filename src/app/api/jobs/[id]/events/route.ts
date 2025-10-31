import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobState } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        const json = JSON.stringify(data);
        controller.enqueue(encoder.encode(`data: ${json}\n\n`));
      };

      try {
        let closed = false;

        const checkJob = async () => {
          if (closed) return;

          const job = await prisma.renderJob.findUnique({
            where: { id: params.id },
          });

          if (!job) {
            send({ error: "Job not found" });
            controller.close();
            return;
          }

          send({
            id: job.id,
            projectId: job.projectId,
            state: job.state,
            progress: job.progress,
          });

          if (job.state === JobState.done || job.state === JobState.failed) {
            controller.close();
            return;
          }

          setTimeout(checkJob, 500);
        };

        checkJob();

        request.signal.addEventListener("abort", () => {
          closed = true;
          controller.close();
        });
      } catch (error) {
        console.error("SSE error:", error);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

