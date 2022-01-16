import { Button, FormControl, OutlinedInput } from "@material-ui/core";
import { InputLabel } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styles from "./CardLogin.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextError from "../../../../components/TextError";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { schemaEmail, schemaPassword } from "./schemas";
import { AuthContext } from "../../../../contexts/AuthContext";
import nProgress from "nprogress";

type TInputs = { [key: string]: string };

type TStep = {
  title: string;
  fieldName: string;
  textSubmit: string;
  label: string;
  inputType: string;
  schema: yup.AnyObjectSchema;
};

export const steps: TStep[] = [
  {
    title: "Olá! Para continuar, digite o seu e-mail",
    fieldName: "email",
    textSubmit: "Continuar",
    label: "E-mail",
    inputType: "input",
    schema: schemaEmail,
  },
  {
    title: "Agora, sua senha do Mercado Livre",
    fieldName: "password",
    textSubmit: "Entrar",
    label: "Senha",
    inputType: "password",
    schema: schemaPassword,
  },
];

const CardLogin = () => {
  const [stepSelected, setStepSelected] = useState(0);
  const [email, setEmail] = useState("");
  const { signIn } = useContext(AuthContext);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<TInputs>({
    resolver: yupResolver(steps[stepSelected].schema),
    mode: "onBlur",
  });
  const onSubmit: SubmitHandler<TInputs> = useCallback(
    async (data) => {
      nProgress.start();
      if (data?.email) {
        setEmail(data?.email);
        setStepSelected(1);
      } else {
        const signInResponse = await signIn({ email, password: data.password });

        if (!signInResponse.isOk) {
          setError("password", {
            message: signInResponse.message,
          });
        }
      }
      nProgress.done();
    },
    [email, setError, signIn]
  );

  useEffect(() => {
    if (isSubmitSuccessful && control) {
      reset({ password: "" });
    }
  }, [isSubmitSuccessful, reset, control]);

  const renderStep = useCallback(
    ({ title, fieldName, textSubmit, label, inputType }: TStep) => (
      <>
        <h1 className={styles.cardTitle} data-testid="step-title">
          {title}
        </h1>

        {email && (
          <div className={styles.inputLogged} data-testid="email-inserted">
            <AccountCircle />
            <p className={styles.inputLoggedText}>{email}</p>

            <Button
              size="small"
              onClick={() => {
                reset();
                setEmail("");
                setStepSelected(0);
              }}
              data-testid="button-remove-email"
            >
              <HighlightOffIcon fontSize="small" color="action" />
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            render={({ field: { value, name, ...props } }) => (
              <FormControl
                fullWidth={true}
                variant="outlined"
                error={!!errors?.[fieldName]}
                margin="dense"
              >
                <InputLabel shrink htmlFor={name} error={!!errors?.[fieldName]}>
                  {label}
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id={name}
                  inputProps={{
                    "data-testid": `input-${name}`,
                  }}
                  value={value}
                  type={inputType}
                  {...props}
                />
                <TextError>{errors?.[fieldName]?.message}</TextError>
              </FormControl>
            )}
            name={fieldName}
            defaultValue=""
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            className={styles.buttonSubmit}
            size="large"
            data-testid="button-submit"
          >
            {textSubmit}
          </Button>
        </form>
      </>
    ),
    [control, email, errors, handleSubmit, onSubmit]
  );

  return <div className={styles.card}>{renderStep(steps[stepSelected])}</div>;
};

export default CardLogin;
