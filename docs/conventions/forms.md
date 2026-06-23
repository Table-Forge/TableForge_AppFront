# Forms

This document defines how we manage forms and validation using React Hook Form and Zod.

---

## Reference implementations
- [features/users/schemas/login-request.schema.ts](../../src/features/users/schemas/login-request.schema.ts) — Zod schema.
- [utils/custom-schema-validations.ts](../../src/utils/custom-schema-validations.ts) — Shared validators.

---

## Schema-first types

The Zod schema is the single source of truth for form data.

```ts
export const LoginRequestSchema = z.object({
  email: emailRequired,
  password: stringRequired,
});

export type ILoginRequest = z.infer<typeof LoginRequestSchema>;
```

## Reusable validators

Always use the pre-built Zod primitives in `utils/custom-schema-validations.ts`. They provide consistent error messages in pt-BR.
- `stringRequired`
- `emailRequired`
- `dateRequired`
- `createPasswordSchema()`

## Controlled inputs

We use the `<Controller>` component from `react-hook-form` to wrap our custom `<Input>` components.

```tsx
<Controller
  control={control}
  name="email"
  render={({ field: { onChange, value } }) => (
    <Input
      label="E-mail"
      value={value}
      onChangeText={onChange}
      error={errors.email?.message}
    />
  )}
/>
```

## Keyboard and Focus Management

Mobile forms require special attention to the software keyboard.
- Use the `ScrollToFocusedInputContext` to ensure the active input is always visible when the keyboard opens.
- `<Input>` components have an internal `<ErrorMessage>` sub-component for inline validation feedback.

## Rules

1. **Strict typing**: The form must be strictly typed `useForm<IYourSchema>`.
2. **Portuguese validation**: All validation messages must be in pt-BR.
3. **Submit**: Form submission should generally call a mutation's `mutate` function.

## What NOT to do
- **Don't use uncontrolled inputs for complex forms**: Stick to the `<Controller>` pattern for consistent state management.
- **Don't duplicate validation logic**: If a password needs validation, use the shared `createPasswordSchema()` rather than writing a custom Regex every time.
