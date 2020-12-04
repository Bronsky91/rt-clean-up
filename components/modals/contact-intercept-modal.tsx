import Modal from "react-modal";
import styles from "../../styles/RedtailModal.module.scss";

export default function ContactInterceptModal(props) {
  const handleProceed = () => {
    if (props.isContactInterceptProceedPrev) {
      props.contactPrevLoad();
    } else {
      props.contactNextLoad();
    }
    props.closeModal();
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
  };

  return (
    <Modal isOpen={props.modalIsOpen} style={customStyles} ariaHideApp={false}>
      <div className={styles.container}>
        <div className={styles.h1}>
          <span className={styles.warning}>WARNING:</span>
          <br />
          Form contains invalid data and cannot be saved until corrected. Are
          you sure you wish to navigate away? Unsaved changes will be lost.
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.blueButton} onClick={handleProceed}>
            PROCEED
          </button>
          <button className={styles.blueButton} onClick={handleCancel}>
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
}
