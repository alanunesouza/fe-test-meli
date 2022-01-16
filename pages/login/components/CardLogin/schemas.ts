import * as yup from "yup";

export const schemaEmail = yup
  .object({
    email: yup
      .string()
      .email("Informe um e-mail válido.")
      .required("Preencha esse dado."),
  })
  .required();

export const schemaPassword = yup
  .object({
    password: yup
      .string()
      .min(8, "Sua senha deve ter pelo menos 8 caracteres.")
      .required("Informe sua senha."),
  })
  .required();
