import React from "react";
import axios from "axios";
import "../styles/globals.scss";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { API_URL } from "../constants";

export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.getInitialProps = async (appContext) => {
  let pageProps = { auth: false };
  const result = await axios.get(API_URL + "/users/auth-check", {
    withCredentials: true,
    validateStatus: (status) => status < 500,
  });
  pageProps.auth = result.status === 200;
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
  };
};
