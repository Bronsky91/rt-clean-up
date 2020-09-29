import Head from "next/head";
import Link from "next/link";
import styles from "../styles/CleanUpLayout.module.scss";

export default function CleanUpLayout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/lps-logo.png" alt="LinkPOINT Solutions Logo" />
        </div>
        <div className={styles.h1}>RedTail Clean Up Tool</div>
      </header>
      <div className={styles.wrapper}>
        <nav className={styles.nav}>
          <Link
            href={{
              pathname: "/clean/dashboard",
              query: "", // TODO: figure out how to pass databaseName to Layout
            }}
          >
            <a>DASHBOARD</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/contacts",
              query: "", // TODO: figure out how to pass databaseName to Layout
            }}
          >
            <a>CONTACTS</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/data-cleanup",
              query: "", // TODO: figure out how to pass databaseName to Layout
            }}
          >
            <a>DATA CLEANUP</a>
          </Link>
          <Link
            href={{
              pathname: "/clean/import-data",
              query: "", // TODO: figure out how to pass databaseName to Layout
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
