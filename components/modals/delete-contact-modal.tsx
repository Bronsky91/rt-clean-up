import Modal from "react-modal";
import styles from "../../styles/RedtailModal.module.scss";

export default function DeleteContactModal(props) {
  const handleDelete = () => {
    props.closeModal();
    props.deleteContact();
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
          Are you sure you want to delete this contact?
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.redButton} onClick={handleDelete}>
            DELETE
          </button>
          <button className={styles.blueButton} onClick={handleCancel}>
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
}
