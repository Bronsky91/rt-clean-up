import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { API_URL } from "../../constants";
import styles from "../../styles/Home.module.scss";

export default function Home() {
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
    axios
      .post(
        API_URL + "/users/redtail-auth",
        { data: formData },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Redtail Auth Submitted");
        router.push({
          pathname: "/clean/contact",
        });
      })
      .catch((reason) => alert("Auth failed"));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Redtail Clean Up Tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Connect Your Redtail Account</h1>
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
      </main>
    </div>
  );
}
