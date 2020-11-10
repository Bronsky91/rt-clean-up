import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/PageLayout.module.scss";
import { useState } from "react";
import RedtailAuthModal from "../components/redtail-auth-modal";
import Axios from "axios";

export default function PageLayout({ children }) {
  const router = useRouter();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [isRedtailAuth, setRedtailAuth] = useState(children.props.rtAuth);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);

    Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/rt-auth-check`, {
      withCredentials: true,
    })
      .then((res) => {
        setRedtailAuth(res.data.rtAuth);
      })
      .catch(() => setRedtailAuth(false));
  };

  const cleanupClickHandler = (e) => {
    localStorage.clear();
    if (!isRedtailAuth) openModal();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Redtail Clean Up Tool</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css"
        />
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/linkpoint-logo.png" alt="LinkPoint Solutions Logo" />
        </div>
        <div className={styles.h1}>RedTail Clean Up Tool</div>
      </header>
      <div className={styles.wrapper}>
        <nav
          className={
            router.pathname === "/data-cleanup"
              ? styles.shrunkNav
              : styles.expandedNav
          }
        >
          <div className={styles.navLinks}>
            <Link href="/">
              <a
                className={
                  router.pathname === "/" ? styles.active : styles.inactive
                }
              >
                {router.pathname !== "/" ? (
                  <img src="/dashboard-icon.png" />
                ) : (
                  "DASHBOARD"
                )}
              </a>
            </Link>
            <Link href={isRedtailAuth ? "/data-cleanup" : "/"}>
              <a
                className={
                  router.pathname !== "/" ? styles.active : styles.inactive
                }
                onClick={cleanupClickHandler}
              >
                {
                  // TODO: Fix to accomodate for more than one page
                }
                {router.pathname !== "/" ? (
                  <img src="/data-cleanup-icon.png" />
                ) : (
                  "DATA CLEANUP"
                )}
              </a>
            </Link>
            {/* <Link href="/import-data">
              <a
                className={
                  router.pathname === "/import-data"
                    ? styles.active
                    : styles.inactive
                }
              >
                IMPORT DATA
              </a>
            </Link> */}
          </div>
          <div className={styles.redtailConnectContainer} onClick={openModal}>
            <img
              className={styles.redtailConnectImg}
              src={isRedtailAuth ? "redtail-logo-fill.png" : "redtail-logo.png"}
            ></img>
            {router.pathname === "/data-cleanup" ? (
              ""
            ) : (
              <div className={styles.redtailConnectText}>
                {isRedtailAuth ? "Connected" : "Connect"}
              </div>
            )}
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
