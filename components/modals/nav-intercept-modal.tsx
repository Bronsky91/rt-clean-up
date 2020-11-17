import Modal from "react-modal";
import styles from "../../styles/RedtailModal.module.scss";
import { useRouter } from "next/router";

export default function NavInterceptModal(props) {
  const router = useRouter();

  const handleProceed = () => {
    props.closeModal();
    router.push(props.interceptedRoute);
  };

  const handleCancel = () => {
    props.closeModal();
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "65rem",
      height: "25rem",
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
      contentLabel="Test"
      ariaHideApp={false}
    >
      <div className={styles.container}>
        <div className={styles.h1}>
          <span className={styles.warning}>WARNING:</span>
          <br />
          Unsaved changes will be lost, are you sure you wish to navigate away?
        </div>

        <div className={styles.navInterceptButtonContainer}>
          <button className={styles.redButton} onClick={handleProceed}>
            PROCEED
          </button>
          <button className={styles.redButton} onClick={handleCancel}>
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
}
