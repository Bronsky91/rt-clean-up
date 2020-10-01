import PageLayout from "../layouts/page-layout";
import styles from "../styles/ImportDataPage.module.scss";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { API_URL } from "../constants";

export default function ImportDataPage() {
  const router = useRouter();
  const [file, updateFormData] = useState({ file: null });

  const onFormSubmit = (e) => {
    e.preventDefault(); // Stop form submit
    fileUpload(file).then((response) => {
      // console.log(response.data);
      // After submit move to Contact Clean Up Form Page
      const databaseName = response.data.databaseName;
      router.push({
        pathname: "/dashboard",
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
      withCredentials: true,
    };
    return axios.post(url, formData, config);
  };

  return (
    <div className={styles.importPageContainer}>
      <div className={styles.importTitle}>Import Redtail Backup Data</div>
      <div className={styles.uploadContainer}>
        <main className={styles.uploadInput}>
          <form onSubmit={onFormSubmit}>
            <input onChange={onChange} type="file" />
            <button type="submit">Upload</button>
          </form>
        </main>
      </div>
    </div>
  );
}

ImportDataPage.Layout = PageLayout;
