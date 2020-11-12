import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RedtailAuthModal from "../components/modals/redtail-auth-modal";
import PageLayout from "../layouts/page-layout";
import styles from "../styles/DashboardPage.module.scss";
import Login from "./login";

export default function DashboardPage(props) {
  const router = useRouter();
  const isAuth = props.isAuth;

  const [modalIsOpen, setIsOpen] = useState(false);
  const [isRedtailAuth, setRedtailAuth] = useState(props.rtAuth);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);

    router.reload();
  };

  useEffect(() => {
    if (isAuth) return; // do nothing if the user is logged in
    router.replace(router.pathname, "/login", { shallow: true });
  }, [isAuth]);

  if (!isAuth) return <Login />;

  const cleanupClickHandler = (e) => {
    if (!isRedtailAuth) openModal();
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* <Link href="/import-data">
        <a>
          <div className={styles.buttonContainer}>
            <img src="/sql-block.svg"></img>
            <div className={styles.upperText}>SQL FILE</div>
            <div className={styles.lowerText}>Upload</div>
          </div>
        </a>
      </Link> */}
      <Link href={isRedtailAuth ? "/data-cleanup" : "/"}>
        <a onClick={cleanupClickHandler}>
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
            <div className={styles.upperText}>EXCEL</div>
            <div className={styles.lowerText}>Convert</div>
          </div>
        </a>
      </Link>
      <RedtailAuthModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
      ></RedtailAuthModal>
    </div>
  );
}

DashboardPage.Layout = PageLayout;
