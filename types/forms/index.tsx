import { z } from "zod";
import { ChannelType } from "@prisma/client";

export const serverSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});

export type ServerInputs = z.infer<typeof serverSchema>;

export const channelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required",
    })
    .refine((name) => name.toLowerCase() !== "general", {
      message: "Channel cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

export type ChannelInputs = z.infer<typeof channelSchema>;
