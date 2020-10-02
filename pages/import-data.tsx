import PageLayout from "../layouts/page-layout";
import styles from "../styles/ImportDataPage.module.scss";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { API_URL } from "../constants";

export default function ImportDataPage() {
  const router = useRouter();

  const initialFileMessageState = { show: false, text: "" };
  const [fileError, setShowError] = useState(initialFileMessageState);
  const [fileSuccess, setShowSuccess] = useState(initialFileMessageState);

  const hiddenFileInput = React.useRef(null);

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  const checkFileAndUpload = (fileArray: File[]) => {
    const file = fileArray[0];

    if (fileArray.length > 1) {
      return setShowError({
        show: true,
        text: "Only Upload one file, Please try again.",
      });
    }

    if (fileIsNotSQL(fileArray[0].name)) {
      return setShowError({
        show: true,
        text: "Incorrect file type, SQL files only. Please try again.",
      });
    }

    console.log('File "Uploaded"!');

    // fileUpload(file).then((response) => {
    //   console.log(response.data);
    //   // TODO: After submit show button to clean up page and disable upload function
    // });
  };

  const fileIsNotSQL = (fileName: string): boolean => {
    const sqlRegex = /\.sql$/i;
    return sqlRegex.exec(fileName) === null;
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

  const dragOverHandler = (e) => {
    console.log("File(s) in drop zone");
    // TODO: CSS Changes to the Drop Zone?
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
  };

  const dropHandler = (e) => {
    console.log("File(s) dropped");
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    checkFileAndUpload(e.dataTransfer.files);
  };

  const onChange = (e) => {
    checkFileAndUpload(e.target.files);
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
        {fileError.show ? <div>{fileError.text}</div> : null}
        <div className={styles.uploadInput}>
          <img src="drop-file.png" className={styles.dropImage}></img>
          <input
            ref={hiddenFileInput}
            type="file"
            className={styles.fileUpload}
            onChange={onChange}
          />
        </div>
        <div>Click and Choose a File or Drag One Here</div>
      </div>
    </div>
  );
}

ImportDataPage.Layout = PageLayout;
