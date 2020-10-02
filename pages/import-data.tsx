import PageLayout from "../layouts/page-layout";
import styles from "../styles/ImportDataPage.module.scss";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { API_URL } from "../constants";

export default function ImportDataPage() {
  const router = useRouter();

  const hiddenFileInput = React.useRef(null);

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  const isFileSQL = (file: File) => {
    // TODO: check if file extension is .sql
  };

  const fileUpload = (file: File) => {
    const url = API_URL + "/rt/backup-upload";
    // const url = "api/backup-upload";
    const formData = new FormData();
    formData.append("backup", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
      withCredentials: true,
    };
    console.log("uploading...");
    return axios.post(url, formData, config);
  };

  const dropHandler = (e) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    console.log(e.dataTransfer.files);
    // TODO: Grab file, isFileSQL() and upload
  };

  const dragOverHandler = (e) => {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    // TODO: isFileSQL() and upload
    fileUpload(file).then((response) => {
      // console.log(response.data);
      // After submit move to Contact Clean Up Form Page
      const databaseName = response.data.databaseName;
      router.push({
        pathname: "/dashboard",
      });
    });
  };

  return (
    <div className={styles.importPageContainer}>
      <div className={styles.importTitle}>Import Redtail Backup Data</div>
      <div
        className={styles.uploadContainer}
        onClick={handleClick}
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
      >
        <div className={styles.uploadInput}>
          <img src="drop-file.png" className={styles.dropImage}></img>
          <input
            ref={hiddenFileInput}
            type="file"
            className={styles.fileUpload}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

ImportDataPage.Layout = PageLayout;
