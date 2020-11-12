import Axios from "axios";
import Modal from "react-modal";
import styles from "../../styles/RedtailModal.module.scss";

export default function RedtailSettingsModal(props) {
  const redtailLogout = () => {
    Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/redtail-logout`, {
      withCredentials: true,
    });
  };

  const handleClose = (e) => {
    props.closeModal(false);
  };

  const handleSwitchClick = (e) => {
    redtailLogout();
    // True is Switching Account
    props.closeModal(true);
  };

  const handleLogoutClick = (e) => {
    redtailLogout();
    props.closeModal(false);
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
          <div className={styles.redButton} onClick={handleSwitchClick}>
            Switch Account
          </div>
          <div className={styles.redButton} onClick={handleLogoutClick}>
            Log Out
          </div>
        </div>
      </div>
    </Modal>
  );
}
