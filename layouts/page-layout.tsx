import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/PageLayout.module.scss";
import { useState } from "react";
import RedtailAuthModal from "../components/redtailAuthModal";

export default function PageLayout({ children }) {
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Redtail Clean Up Tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/linkpoint-logo.png" alt="LinkPoint Solutions Logo" />
        </div>
        <div className={styles.h1}>RedTail Clean Up Tool</div>
      </header>
      <div className={styles.wrapper}>
        <nav className={styles.nav}>
          <div className={styles.topNav}>
            <Link href="/dashboard">
              <a
                className={
                  router.pathname === "/dashboard"
                    ? styles.active
                    : styles.inactive
                }
              >
                DASHBOARD
              </a>
            </Link>
            {/* <Link href="/contacts">
            <a
              className={
                router.pathname == "/contacts" ? styles.active : styles.inactive
              }
            >
              CONTACTS
            </a>
          </Link> */}
            <Link href="/data-cleanup">
              <a
                className={
                  router.pathname === "/data-cleanup"
                    ? styles.active
                    : styles.inactive
                }
              >
                DATA CLEANUP
              </a>
            </Link>
            <Link href="/import-data">
              <a
                className={
                  router.pathname === "/import-data"
                    ? styles.active
                    : styles.inactive
                }
              >
                IMPORT DATA
              </a>
            </Link>
          </div>
          <div className={styles.redtailConnectContainer} onClick={openModal}>
            <img
              className={styles.redtailConnectImg}
              src="redtail-logo.png"
            ></img>
            <div className={styles.redtailConnectText}>Connect</div>
          </div>
        </nav>
        <main className={styles.main}>{children}</main>
      </div>
      <RedtailAuthModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
      ></RedtailAuthModal>
    </div>
  );
}
