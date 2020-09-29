import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/CleanUpLayout.module.scss";

export default function CleanUpLayout({ children }) {
  const router = useRouter();
  const { databaseName } = router.query;

  return (
    <div className={styles.container}>
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
              query: { databaseName },
            }}
          >
            <a>DASHBOARD</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/contacts",
              query: { databaseName },
            }}
          >
            <a>CONTACTS</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/data-cleanup",
              query: { databaseName },
            }}
          >
            <a>DATA CLEANUP</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/import-data",
              query: { databaseName },
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
