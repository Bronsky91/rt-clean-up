import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { GOOGLE_AUTH_URL } from "../constants";
import PageLayout from "../layouts/page-layout";
import Modal from "react-modal";

export default function Home() {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "50rem",
      height: "40rem",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div>
      <Head>
        <title>Redtail Clean Up Tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal isOpen={true} style={customStyles} contentLabel="Example Modal">
        <h2 className={styles.loginTitle}>Redtail Clean Up Tool</h2>
        <div className={styles.loginButton}>
          <a href={GOOGLE_AUTH_URL}>
            <img src="/btn_google_signin_dark_normal_web@2x.png"></img>
          </a>
        </div>
      </Modal>
    </div>
  );
}

Home.Layout = PageLayout;
