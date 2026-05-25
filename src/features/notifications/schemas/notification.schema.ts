import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  userId: z.number(),
  type: z.string(),
  message: z.string(),
  relatedLink: z.string().optional().nullable(),
  read: z.boolean(),
});

export const NotificationCreateSchema = z.object({
  userId: z.coerce.number().min(1),
  type: z.string().trim().min(1, "O tipo é obrigatório."),
  message: z.string().trim().min(1, "A mensagem é obrigatória."),
  relatedLink: z.string().optional(),
});

export const NotificationUpdateSchema = z.object({
  id: z.coerce.number().min(1),
  read: z.coerce.boolean(),
});

export type INotification = z.infer<typeof NotificationSchema>;
export type INotificationCreate = z.infer<typeof NotificationCreateSchema>;
export type INotificationUpdate = z.infer<typeof NotificationUpdateSchema>;
