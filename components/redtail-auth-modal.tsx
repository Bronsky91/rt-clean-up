import Axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "react-modal";
import styles from "../styles/RedtailAuth.module.scss";
import { API_URL } from "../constants";

export default function RedtailAuthModal(props) {
  const router = useRouter();

  const initialFormData = Object.freeze({
    username: "",
    password: "",
  });

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const target = event.target;
    updateFormData({
      ...formData,
      // Trimming any whitespace
      [target.name]: target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Axios.post(
      `${API_URL}/users/redtail-auth`,
      { data: formData },
      { withCredentials: true }
    )
      .then((res) => {
        props.closeModal();
      })
      .catch((reason) => alert("Auth failed"));
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
        <div className={styles.subtext}>Connect your to Redtail Database</div>
        <div className={styles.inputContainer}>
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
        </div>
        <input
          type="submit"
          value="Connect"
          onClick={handleSubmit}
          className={styles.connectButton}
        />
      </div>
    </Modal>
  );
}
