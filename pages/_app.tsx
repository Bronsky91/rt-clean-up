import React from "react";
import "../styles/globals.scss";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
