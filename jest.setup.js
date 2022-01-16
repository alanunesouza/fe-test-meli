/* Global jest */
import "@testing-library/jest-dom/extend-expect";

jest.setTimeout(30000);

jest.mock("next/link", () => {
  return ({ children }) => {
    return children;
  };
});
