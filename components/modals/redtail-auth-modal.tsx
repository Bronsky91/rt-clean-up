import Axios from "axios";
import Loader from "react-loader-spinner";
import { useState } from "react";
import Modal from "react-modal";
import styles from "../../styles/RedtailModal.module.scss";

export default function RedtailAuthModal(props) {
  const initialFormData = Object.freeze({
    username: "",
    password: "",
  });

  const [formData, setFormData] = useState(initialFormData);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (event) => {
    const target = event.target;
    setFormData({
      ...formData,
      // Trimming any whitespace
      [target.name]: target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingPage(true);

    Axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/redtail-auth`,
      { data: formData },
      { withCredentials: true }
    )
      .then((res) => {
        props.closeModal();
        setLoadingPage(false);
        setIsError(false);
      })
      .catch((reason) => {
        setIsError(true);
        setLoadingPage(false);
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
      contentLabel="Redtail Login"
      ariaHideApp={false}
    >
      <div className={styles.container}>
        <div className={styles.top}>
          <img className={styles.linkPointLogo} src="linkpoint-logo.png"></img>
          <input
            type="image"
            src="close.png"
            onClick={props.closeModal}
            className={styles.close}
          ></input>
        </div>
        <div className={styles.signIn}>
          <img src="redtail-logo.png" className={styles.redtailLogo}></img>
          <h1 className={styles.title}>Sign In</h1>
        </div>
        <div className={styles.subtext}>
          {isError ? "Unable to Connect to Redtail, Try again" : ""}
        </div>
        <form onSubmit={handleSubmit}>
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
                <input
                  type="text"
                  placeholder="Username"
                  className={styles.textInput}
                  name="username"
                  onChange={handleChange}
                  value={formData.username}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.textInput}
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                />
              </>
            )}
          </div>
          <input
            type="submit"
            value="Connect"
            className={styles.connectButton}
          />
        </form>
      </div>
    </Modal>
  );
}
