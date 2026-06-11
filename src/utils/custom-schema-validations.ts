import dayjs from "dayjs";
import { z } from "zod";
import {
  ERROR_MESSAGE,
  FILE_ERROR_MESSAGE,
} from "../components/error-message/error-message.constant";

const stringRequired = z
  .string({ message: ERROR_MESSAGE.required })
  .catch("")
  .transform((val) => val.trim())
  .refine((val) => val !== "", { message: ERROR_MESSAGE.required });

const numberRequired = z.coerce
  .number({
    message: ERROR_MESSAGE.required,
  })
  .catch(0)
  .refine((val) => val > 0, { message: ERROR_MESSAGE.required });

const stringOrStringArrayRequired = z.union([
  z.string(),
  z.array(z.string()).refine((arr) => arr.length > 0, {
    message: ERROR_MESSAGE.required,
  }),
]);

const numberOrStringRequired = z.union([
  z.number().refine((val) => val > 0, { message: ERROR_MESSAGE.required }),
  z
    .string()
    .refine((val) => val.trim() !== "", { message: ERROR_MESSAGE.required }),
]);

const stringArrayRequired = z
  .array(z.coerce.string())
  .default([])
  .refine((val) => val.length > 0, {
    message: ERROR_MESSAGE.required,
  });

const numberArrayRequired = z
  .array(z.coerce.number())
  .default([])
  .refine((val) => val.length > 0, {
    message: ERROR_MESSAGE.required,
  });

const dateRequired = z
  .union([z.string(), z.date()])
  .transform((val) => {
    if (!val) return "";

    if (val instanceof Date) {
      if (isNaN(val.getTime())) return "invalid";
      return dayjs(val).format("YYYY-MM-DD");
    }

    return val;
  })
  .refine((val) => val.trim() !== "", {
    message: ERROR_MESSAGE.required,
  })
  .refine((val) => dayjs(val, "YYYY-MM-DD", true).isValid(), {
    message: ERROR_MESSAGE.validate,
  });

const emailRequired = z
  .string()
  .catch("")
  .transform((val) => val.trim())
  .pipe(
    z
      .string()
      .min(1, { message: ERROR_MESSAGE.required })
      .email({ message: "Formato de e-mail inválido" }),
  );

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const fileSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: FILE_ERROR_MESSAGE.invalidType,
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: FILE_ERROR_MESSAGE.maxFileSize,
  });

const fileListRequired = z
  .array(fileSchema)
  .min(1, { message: FILE_ERROR_MESSAGE.requiredFile });

const fileRequired = z.any().superRefine((file, ctx) => {
  if (!(file instanceof File)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: ERROR_MESSAGE.required,
    });
    return;
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: FILE_ERROR_MESSAGE.invalidType,
    });
  }

  if (file.size > MAX_FILE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: FILE_ERROR_MESSAGE.maxFileSize,
    });
  }
});

const addIssuesIfInvalid = (
  ctx: z.RefinementCtx,
  value: unknown,
  validation: z.ZodTypeAny,
  path: (string | number)[],
) => {
  const result = validation.safeParse(value);
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path,
      });
    });
  }
};

// Optional fields

const numberOptional = z.coerce.number().optional();

const stringOptional = z.coerce.string().optional();

const dateOptional = z
  .union([z.string(), z.date()])
  .nullish()
  .transform((val) => {
    if (!val || val === "") return undefined;

    if (val instanceof Date) {
      return isNaN(val.getTime()) ? undefined : val;
    }

    if (typeof val === "string") {
      const parsed = dayjs(val, "YYYY-MM-DD", true);
      return parsed.isValid() ? parsed.toDate() : undefined;
    }

    return undefined;
  });

const stringOrStringArrayOptional = z
  .union([z.string(), z.array(z.string())])
  .optional();

const numberArrayOptional = z.array(z.number()).default([]).optional();

const fileArrayOptional = z.array(fileSchema).optional();

export {
  addIssuesIfInvalid,
  dateOptional,
  dateRequired,
  emailRequired,
  fileArrayOptional,
  fileListRequired,
  fileRequired,
  fileSchema,
  numberArrayOptional,
  numberArrayRequired,
  numberOptional,
  numberOrStringRequired,
  numberRequired,
  stringArrayRequired,
  stringOptional,
  stringOrStringArrayOptional,
  stringOrStringArrayRequired,
  stringRequired,
};

export const PASSWORD_MIN_LENGTH = 6;

export const sanitizePasswordValue = (value: string) =>
  value.replace(/[^\x21-\x7E]/g, "");

export const PASSWORD_RULES: {
  label: string;
  message: string;
  test: (value: string) => boolean;
}[] = [
  {
    label: `Pelo menos ${PASSWORD_MIN_LENGTH} caracteres`,
    message: `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
    test: (value) => value.length >= PASSWORD_MIN_LENGTH,
  },
  {
    label: "Uma letra maiúscula (A-Z)",
    message: "A senha deve conter ao menos uma letra maiúscula.",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    label: "Uma letra minúscula (a-z)",
    message: "A senha deve conter ao menos uma letra minúscula.",
    test: (value) => /[a-z]/.test(value),
  },
  {
    label: "Um número (0-9)",
    message: "A senha deve conter ao menos um número.",
    test: (value) => /[0-9]/.test(value),
  },
  {
    label: "Um caractere especial (ex.: ! @ # $ %)",
    message: "A senha deve conter ao menos um caractere especial (ex.: ! @ # $ %).",
    test: (value) => /[^A-Za-z0-9\s]/.test(value),
  },
];

export const getPasswordError = (value: string): string | null =>
  PASSWORD_RULES.find((rule) => !rule.test(value))?.message ?? null;

export const createPasswordSchema = () =>
  z.string().superRefine((value, ctx) => {
    const message = getPasswordError(value ?? "");
    if (message) {
      ctx.addIssue({ code: "custom", message });
    }
  });
