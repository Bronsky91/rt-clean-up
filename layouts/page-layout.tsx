import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/PageLayout.module.scss";

export default function PageLayout({ children }) {
  const router = useRouter();

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
          <Link href="/dashboard">
            <a
              className={
                router.pathname == "/dashboard"
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
                router.pathname == "/data-cleanup"
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
                router.pathname == "/import-data"
                  ? styles.active
                  : styles.inactive
              }
            >
              IMPORT DATA
            </a>
          </Link>
        </nav>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
