import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/PageLayout.module.scss";

export default function PageLayout({ children }) {
  const router = useRouter();
  const { databaseName } = router.query;

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
          <Link
            href={{
              pathname: "/clean/dashboard",
            }}
          >
            <a>DASHBOARD</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/contacts",
            }}
          >
            <a>CONTACTS</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/data-cleanup",
            }}
          >
            <a>DATA CLEANUP</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/import-data",
            }}
          >
            <a>IMPORT DATA</a>
          </Link>
        </nav>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
