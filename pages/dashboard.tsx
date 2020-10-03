import Link from "next/link";
import PageLayout from "../layouts/page-layout";
import styles from "../styles/DashboardPage.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Home from ".";

export default function DashboardPage(props) {
  const router = useRouter();

  const isAuth = props.auth;
  useEffect(() => {
    if (isAuth) return; // do nothing if the user is logged in
    router.replace("/dashboard", "/", { shallow: true });
  }, [isAuth]);

  if (!isAuth) return <Home />;

  return (
    <div className={styles.dashboardContainer}>
      <Link href="/import-data">
        <a>
          <div className={styles.buttonContainer}>
            <img src="/sql-block.svg"></img>
            <div className={styles.upperText}>SQL FILE</div>
            <div className={styles.lowerText}>Upload</div>
          </div>
        </a>
      </Link>
      <Link href="/data-cleanup">
        <a>
          <div className={styles.buttonContainer}>
            <img src="/clean-up-block.svg"></img>
            <div className={styles.upperText}>DATA CLEANUP</div>
            <div className={styles.lowerText}>Tool</div>
          </div>
        </a>
      </Link>

      {/* No Excel page/function yet */}
      <Link href="#">
        <a>
          <div className={styles.buttonContainer}>
            <img src="/excel-block.svg"></img>
            <div className={styles.upperText}>DOWNLOAD</div>
            <div className={styles.lowerText}>Excel</div>
          </div>
        </a>
      </Link>
    </div>
  );
}

DashboardPage.Layout = PageLayout;
