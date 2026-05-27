import { z } from "zod";

export const FriendshipStatusSchema = z.enum([
  "None",
  "Pending",
  "Accepted",
  "Declined",
]);

export const FriendshipSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional().nullable(),
  requesterId: z.number(),
  requesterNickname: z.string().optional().nullable(),
  receiverId: z.number(),
  receiverNickname: z.string().optional().nullable(),
  status: FriendshipStatusSchema,
});

export const FriendshipCreateSchema = z.object({
  requesterId: z.coerce.number().min(1),
  receiverId: z.coerce.number().min(1),
});

export const FriendshipUpdateSchema = z.object({
  id: z.coerce.number().min(1),
  status: z.enum(["Accepted", "Declined"]),
});

export type IFriendship = z.infer<typeof FriendshipSchema>;
export type IFriendshipCreate = z.infer<typeof FriendshipCreateSchema>;
export type IFriendshipUpdate = z.infer<typeof FriendshipUpdateSchema>;
export type IFriendshipStatus = z.infer<typeof FriendshipStatusSchema>;
