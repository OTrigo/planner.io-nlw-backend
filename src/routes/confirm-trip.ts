import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("pt-br");
dayjs.extend(localizedFormat);

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      return { tripId: request.params.tripId };
    }
  );
}
