import { GetServerSidePropsContext } from "next";
import React from "react";
import { parseCookies } from "nookies";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { "nextauth.token": token } = parseCookies(ctx);

  return {
    redirect: {
      destination: token ? "/review" : "/login",
      permanent: false,
    },
  };
}

const Index = () => {
  return <div />;
};

export default Index;
