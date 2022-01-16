import clientPromise from "../../lib/mongodb";
import verifyPassword from "../../helpers/verifyPassword";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body;

    const user = await clientPromise.then((client) =>
      client.db("meli").collection("users").findOne({ email })
    );

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      res.end();
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      res
        .status(400)
        .json({
          message:
            "Erro ao realizar login. Verifique o email e senha digitados.",
        });
      res.end();
    }

    const token = await jwt.sign(
      { name: user.name, email: user.email },
      process.env.SECRET_KEY
    );

    res.json({ name: user.name, email: user.email, token });
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Erro ao buscar dados do usuário. Tente novamente daqui alguns minutos.",
      });
    res.end();
  }
}
