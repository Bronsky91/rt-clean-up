import React from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  if (router.pathname.startsWith("/clean/")) {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  } else {
    return <Component {...pageProps} />;
  }
}
