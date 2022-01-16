import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LoginPage, { getServerSideProps } from "./index.page";
import { steps } from "./components/CardLogin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/dist/client/router"), "useRouter");

describe("LoginPage", () => {
  it("should render correctly", () => {
    useRouter.mockImplementation(() => ({
      pathname: "/login",
    }));

    const { getByTestId, queryByTestId } = render(<LoginPage />);

    const title = getByTestId("step-title");
    const emailInserted = queryByTestId("email-inserted");
    const input = getByTestId(`input-${steps[0].fieldName}`);
    const buttonSubmit = getByTestId("button-submit");
    const errorMessage = getByTestId("message-error");

    expect(title).toHaveTextContent(steps[0].title);
    expect(emailInserted).toBeNull();
    expect(input).toBeVisible();
    expect(buttonSubmit).toBeVisible();
    expect(errorMessage).toHaveTextContent("");
  });

  describe("error scenarios", () => {
    it("should return error when try submit with input email empty", async () => {
      useRouter.mockImplementation(() => ({
        pathname: "/login",
        prefetch: jest.fn(),
      }));
      const { getByTestId } = render(<LoginPage />);

      const buttonSubmit = getByTestId("button-submit");

      await act(async () => {
        fireEvent.click(buttonSubmit);
      });

      const errorMessage = screen.getByTestId("message-error");
      expect(errorMessage).toHaveTextContent("Preencha esse dado.");
    });

    it("should return error when try submit with invalid email", async () => {
      useRouter.mockImplementation(() => ({
        pathname: "/login",
      }));
      const { getByTestId } = render(<LoginPage />);

      const input = getByTestId(`input-${steps[0].fieldName}`);
      const buttonSubmit = getByTestId("button-submit");

      await act(async () => {
        fireEvent.change(input, { target: { value: "aaa@" } });
        fireEvent.click(buttonSubmit);
      });

      const errorMessage = screen.getByTestId("message-error");
      expect(errorMessage).toHaveTextContent("Informe um e-mail válido.");
    });

    it("should return error when try submit with invalid password", async () => {
      useRouter.mockImplementation(() => ({
        pathname: "/login",
      }));
      const { getByTestId } = render(<LoginPage />);

      const inputEmail = getByTestId(`input-${steps[0].fieldName}`);
      const buttonSubmit = getByTestId("button-submit");

      await act(async () => {
        fireEvent.change(inputEmail, { target: { value: "teste@teste.com" } });
        fireEvent.click(buttonSubmit);
      });

      await act(async () => {
        const inputPassword = screen.getByTestId(`input-${steps[1].fieldName}`);
        fireEvent.change(inputPassword, { target: { value: "teste" } });
        fireEvent.click(buttonSubmit);
      });

      const errorMessage = screen.getByTestId("message-error");
      expect(errorMessage).toHaveTextContent(
        "Sua senha deve ter pelo menos 8 caracteres."
      );
    });
  });

  describe("testing getServerSideProps", () => {
    it("should return props with success", async () => {
      const ctx: any = {
        req: {
          headers: {
            cookie: "",
          },
        },
      };

      const props = await getServerSideProps(ctx);

      expect(props).toEqual({
        props: {},
      });
    });

    it("should redirecting when user is logged", async () => {
      const ctx: any = {
        req: {
          headers: {
            cookie: "nextauth.token=a5b76320-cf27-4133-b440-e2ba69c1960d",
          },
        },
      };

      const props = await getServerSideProps(ctx);

      expect(props).toEqual({
        redirect: {
          destination: "/review",
          permanent: false,
        },
      });
    });
  });
});
