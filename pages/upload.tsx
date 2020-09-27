import Head from "next/head";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { API_URL } from "../constants";

export default function Upload() {
  const router = useRouter();
  const [file, updateFormData] = useState({ file: null });

  const onFormSubmit = (e) => {
    e.preventDefault(); // Stop form submit
    fileUpload(file).then((response) => {
      // console.log(response.data);
      // After submit move to Contact Clean Up Form Page
      const databaseName = response.data.databaseName;
      router.push({
        pathname: "/clean/contact-form",
        query: { databaseName },
      });
    });
  };

  const onChange = (e) => {
    updateFormData({ file: e.target.files[0] });
  };

  const fileUpload = (f) => {
    const url = API_URL + "/rt/backup-upload";
    // const url = "api/backup-upload";
    const formData = new FormData();
    formData.append("backup", f.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={onFormSubmit}>
          <h1>RT Backup Upload</h1>
          <input onChange={onChange} type="file" />
          <button type="submit">Upload</button>
        </form>
      </main>
    </div>
  );
}
