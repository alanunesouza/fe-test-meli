import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { AxiosResponse } from "axios";

import frontApi from "../helpers/frontApi";
import jwt from "jsonwebtoken";

type User = {
  name: string;
  email: string;
  token: string;
};

type SignInData = {
  email: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<{
    isOk: boolean;
    message: any;
  }>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      const tokenDecode: any = jwt.decode(token);

      setUser({
        token,
        email: tokenDecode.email,
        name: tokenDecode.name,
      });
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    try {
      const response: AxiosResponse<User, any> = await frontApi.post(
        "/api/signIn",
        { email, password }
      );

      setCookie(undefined, "nextauth.token", response.data.token, {
        maxAge: 60 * 60 * 1,
      });

      setUser(response.data);

      Router.push("/review");

      return { isOk: true, message: null };
    } catch (error) {
      return { isOk: false, message: error.response.data.message };
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
