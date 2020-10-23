import React from "react";
import axios from "axios";
import "../styles/globals.scss";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { process.env.NEXT_PUBLIC_API_URL } from "../constants";
import cookie from "cookie";
import Cookies from "js-cookie";

export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.getInitialProps = async (args) => {
  let pageProps = { isAuth: false, rtAuth: false };
  let jwt;

  if (args.ctx.req && args.ctx.req.headers.cookie) {
    const cookies = cookie.parse(args.ctx.req.headers.cookie);
    jwt = cookies.jwt;
  } else {
    jwt = Cookies.get("jwt");
  }

  const headers = jwt ? { cookie: jwt } : {};
  const result = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/users/auth-check", {
    withCredentials: true,
    validateStatus: (status) => status < 500,
    headers,
  });

  pageProps.isAuth = result.status === 200;
  pageProps.rtAuth = result.data.rtAuth;

  return {
    pageProps,
  };
};
