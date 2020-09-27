import Head from "next/head";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { API_URL, GOOGLE_AUTH_URL } from "../constants";

export default function Upload() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Redtail Clean Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href={GOOGLE_AUTH_URL}>
          <img src="/google-signin.png"></img>
        </a>
      </main>
    </div>
  );
}
