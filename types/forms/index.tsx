import { z } from "zod";

export const createServerSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});

export type CreateServerInputs = z.infer<typeof createServerSchema>;
