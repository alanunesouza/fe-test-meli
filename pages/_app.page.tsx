import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ViewportProvider } from "../hooks/useViewPort";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { AuthProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  Router.events.on("routeChangeStart", nProgress.start);
  Router.events.on("routeChangeError", nProgress.done);
  Router.events.on("routeChangeComplete", nProgress.done);

  return (
    <ViewportProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ViewportProvider>
  );
}
export default MyApp;
