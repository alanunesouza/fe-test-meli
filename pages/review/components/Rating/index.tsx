import React from "react";
import styles from "./Rating.module.css";

const Rating = ({ id, onClick, valueDefault }: any) => {
  return (
    <div>
      <div className={styles.rate}>
        <input
          type="radio"
          id={`${id}-star5`}
          name={`rate-${id}`}
          data-testid="rate-5"
          value="5"
          onClick={onClick}
          checked={valueDefault && valueDefault === "5"}
          readOnly={valueDefault !== "0"}
        />
        <label htmlFor={`${id}-star5`} title="text">
          5 stars
        </label>
        <input
          type="radio"
          id={`${id}-star4`}
          data-testid="rate-4"
          name={`rate-${id}`}
          value="4"
          onClick={onClick}
          checked={valueDefault && valueDefault === "4"}
          readOnly={valueDefault !== "0"}
        />
        <label htmlFor={`${id}-star4`} title="text">
          4 stars
        </label>
        <input
          type="radio"
          id={`${id}-star3`}
          data-testid="rate-3"
          name={`rate-${id}`}
          value="3"
          onClick={onClick}
          checked={valueDefault && valueDefault === "3"}
          readOnly={valueDefault !== "0"}
        />
        <label htmlFor={`${id}-star3`} title="text">
          3 stars
        </label>
        <input
          type="radio"
          id={`${id}-star2`}
          data-testid="rate-2"
          name={`rate-${id}`}
          value="2"
          onClick={onClick}
          checked={valueDefault && valueDefault === "2"}
          readOnly={valueDefault !== "0"}
        />
        <label htmlFor={`${id}-star2`} title="text">
          2 stars
        </label>
        <input
          type="radio"
          id={`${id}-star1`}
          data-testid="rate-1"
          name={`rate-${id}`}
          value="1"
          onClick={onClick}
          checked={valueDefault && valueDefault === "1"}
          readOnly={valueDefault !== "0"}
        />
        <label htmlFor={`${id}-star1`} title="text">
          1 star
        </label>
      </div>
    </div>
  );
};

export default Rating;
