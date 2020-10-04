import Axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "react-modal";
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
      API_URL + "/users/redtail-auth",
      { data: formData },
      { withCredentials: true }
    )
      .then((res) => {
        console.log("Redtail Auth Submitted");
        router.push({
          pathname: "/data-cleanup",
        });
      })
      .catch((reason) => alert("Auth failed"));
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "50rem",
      height: "40rem",
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
      contentLabel="Login"
      ariaHideApp={false}
    >
      <h1>Connect Your Redtail Account</h1>
      <button onClick={props.closeModal}>close</button>
      <label>
        Redtail Username:
        <input
          type="text"
          name="username"
          onChange={handleChange}
          value={formData.username}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
      </label>
      <input type="submit" value="Connect" onClick={handleSubmit} />
    </Modal>
  );
}
