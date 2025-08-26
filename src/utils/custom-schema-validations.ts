import dayjs from "dayjs";
import { z } from "zod";
import {
  ERROR_MESSAGE,
  FILE_ERROR_MESSAGE,
} from "../components/error-message/error-message.constant";

const stringRequired = z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined) return "";
    return arg;
  },
  z
    .string()
    .refine((val) => val.trim() !== "", { message: ERROR_MESSAGE.required })
);

const numberRequired = z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined) return 0;
    return arg;
  },
  z.coerce
    .number()
    .refine((val) => val > 0, { message: ERROR_MESSAGE.required })
);

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

const dateRequired = z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined || arg === "") {
      return "";
    }
    return arg;
  },
  z.union([
    z.string().refine((val) => val.trim() !== "", {
      message: ERROR_MESSAGE.required,
    }),
    z.date().refine((val) => dayjs(val, "YYYY-MM-DD", true).isValid(), {
      message: ERROR_MESSAGE.validate,
    }),
  ])
);

const emailRequired = z.preprocess(
  (arg) => (typeof arg === "string" ? arg.trim() : ""),
  z
    .string()
    .min(1, { message: ERROR_MESSAGE.required })
    .email({ message: "Formato de e-mail inválido" })
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
  path: (string | number)[]
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

const numberOptional = z.coerce.number().optional();
const stringOptional = z.coerce.string().optional();
const dateOptional = z.union([z.string(), z.date(), z.null()]).optional();
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
