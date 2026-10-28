import { z } from "zod";

export const leadIntents = ["portfolio-review", "call-plabita", "general"] as const;

// Shared by the lead form and /api/lead. Email and city are optional so the
// two-field homepage form (name + mobile) validates.
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^(\+?91)?[6-9]\d{9}$/.test(v), "Enter a 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  intent: z.enum(leadIntents).default("general"),
});

export type Lead = z.infer<typeof leadSchema>;
