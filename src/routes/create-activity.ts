import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import "dayjs/locale/pt-br";
import dayjs from "../lib/dayjs";

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date(),
        }),
      },
    },
    async (request, reply) => {
      const { title, occurs_at } = request.body;
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new Error(`Trip not found`);
      }

      if (dayjs(occurs_at).isBefore(trip.starts_at)) {
        throw new Error("Invalid activity date.");
      }

      if (dayjs(occurs_at).isAfter(trip.ends_at)) {
        throw new Error("Invalid activity date.");
      }

      const activity = await prisma.activity.create({
        data: {
          title: title,
          occurs_at: occurs_at,
          trip_id: tripId,
        },
      });

      return { activityId: activity.id };
    }
  );
}
