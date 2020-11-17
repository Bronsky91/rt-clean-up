import Axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import styles from "../../styles/RedtailModal.module.scss";
import Loader from "react-loader-spinner";
import { delay } from "../../utils/delay";

export default function SettingsModal(props) {
  const [loadingPage, setLoadingPage] = useState(false);

  const signOut = () => {
    // Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/redtail-logout`, {
    //   withCredentials: true,
    // });
    // Adding delay so the logout process isn't so quick and jarring to the user
    return delay(1000);
  };

  const handleClose = (e) => {
    props.closeModal(false);
  };

  const handleLogoutClick = (e) => {
    setLoadingPage(true);
    signOut().then(() => {
      setLoadingPage(false);
      props.closeModal(false);
    });
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "65rem",
      height: "60rem",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: { zIndex: 1000 },
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      style={customStyles}
      contentLabel="Settings"
      ariaHideApp={false}
    >
      <div className={styles.container}>
        <div className={styles.top}>
          <img className={styles.linkPointLogo} src="linkpoint-logo.png"></img>
          <input
            type="image"
            src="close.png"
            onClick={handleClose}
            className={styles.close}
          ></input>
        </div>
        <div className={styles.signIn}>
          <div className={styles.settingsTitle}>CleanUp Tool</div>
          <div className={styles.settingsSubTitle}>Settings</div>
        </div>
        <div className={styles.inputContainer}>
          {loadingPage ? (
            <div className={styles.spinner}>
              <Loader
                type="Rings"
                color="#4859a4"
                height={100}
                width={100}
              ></Loader>
            </div>
          ) : (
            <>
              <div className={styles.blueButton} onClick={handleLogoutClick}>
                Logout
              </div>
              <div onClick={handleClose} className={styles.backButton}>
                Back
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
