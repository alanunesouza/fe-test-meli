import React from "react";
import styles from "./TextError.module.css";

type TProps = {
  children: string | undefined;
};

const TextError = ({ children }: TProps) => {
  return (
    <span className={styles.text} data-testid="message-error">
      {children}
    </span>
  );
};

export default TextError;
