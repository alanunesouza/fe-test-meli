import { compare } from "bcryptjs";

const verifyPassword = async (password: string, hashedPassword: string) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

export default verifyPassword;
