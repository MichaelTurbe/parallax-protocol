import { z } from "zod";

const Actor = z.object({
  name: z.string(),
});

module.exports = Actor;
