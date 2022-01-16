import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Header from "../../components/Header";
import styles from "./Login.module.css";
import CardLogin from "./components/CardLogin";
import { parseCookies } from "nookies";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { "nextauth.token": token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/review",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const Login: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Mercado Livre - Login</title>
      </Head>

      <Header />

      <div>
        <div className={styles.backgroundTop}></div>
        <CardLogin />
      </div>
    </div>
  );
};

export default Login;
