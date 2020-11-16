import Axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import styles from "../../styles/RedtailModal.module.scss";
import Loader from "react-loader-spinner";
import { delay } from "../../utils/delay";

export default function RedtailSettingsModal(props) {
  const [loadingPage, setLoadingPage] = useState(false);

  const redtailLogout = () => {
    Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/redtail-logout`, {
      withCredentials: true,
    });
    // Adding delay so the logout process isn't so quick and jarring to the user
    return delay(1000);
  };

  const handleClose = (e) => {
    props.closeModal(false);
  };

  const handleSwitchClick = (e) => {
    setLoadingPage(true);
    redtailLogout().then(() => {
      setLoadingPage(false);
      // True is Switching Account
      props.closeModal(true);
    });
  };

  const handleLogoutClick = (e) => {
    setLoadingPage(true);
    redtailLogout().then(() => {
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
      contentLabel="Redtail Settings"
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
          <img src="redtail-logo.png" className={styles.redtailLogo}></img>
          <h1 className={styles.title}>Settings</h1>
        </div>
        <div className={styles.inputContainer}>
          {loadingPage ? (
            <div className={styles.spinner}>
              <Loader
                type="Rings"
                color="#ae3636"
                height={100}
                width={100}
              ></Loader>
            </div>
          ) : (
            <>
              <div className={styles.redButton} onClick={handleSwitchClick}>
                Switch Account
              </div>
              <div className={styles.redButton} onClick={handleLogoutClick}>
                Log Out
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
