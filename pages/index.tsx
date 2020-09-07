import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

export default function Home() {
  const initialFormData = Object.freeze({
    username: "",
    password: "",
  });

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios
      .post("/api/hello", { data: formData })
      .then((res) => console.log(res));
    console.log("testing form");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </main>
    </div>
  );
}
