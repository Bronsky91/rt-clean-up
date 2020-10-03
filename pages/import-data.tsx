import PageLayout from "../layouts/page-layout";
import styles from "../styles/ImportDataPage.module.scss";
import axios from "axios";
import React, { useEffect } from "react";
import Loader from "react-loader-spinner";
import { useState } from "react";
import { API_URL } from "../constants";
import { useRouter } from "next/router";
import Home from ".";



export default function ImportDataPage(props) {
  console.log(props);
  const router = useRouter();

  const isAuth = props.auth;
  useEffect(() => {
    if (isAuth) return; // do nothing if the user is logged in
    router.replace("/import-data", "/", { shallow: true });
  }, [isAuth]);

  if (!isAuth) return <Home />;

  const initialFileMessageState = { show: false, text: "" };
  const [fileError, setShowError] = useState(initialFileMessageState);
  const [processing, setProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

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

    setShowError(initialFileMessageState);
    fileUpload(file);
  };

  const fileIsNotSQL = (fileName: string): boolean => {
    const sqlRegex = /\.sql$/i;
    return sqlRegex.exec(fileName) === null;
  };

  const fileUpload = (file: File) => {
    const url = API_URL + "/rt/backup-upload";

    const formData = new FormData();
    formData.append("backup", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
      withCredentials: true,
    };

    axios.post(url, formData, config).then((res) => {
      if (res.status === 200) {
        setProcessing(true);
        pollProcess();
      }
    });
  };

  const pollProcess = async () => {
    // Our check function
    const checkBackupProcessed = async () => {
      const result = await axios.get(API_URL + `/rt/check-backup-upload`, {
        withCredentials: true,
      });
      if (result.status === 200) {
        setUploadComplete(true);
        setProcessing(false);
      } else if (result.status === 500) {
        setShowError({
          show: true,
          text: "There's already a Database on this Account",
        });
      } else {
        setTimeout(checkBackupProcessed, 1000);
      }
    };

    // Do first check as soon as the JavaScript engine is available to do it
    setTimeout(checkBackupProcessed, 0);
  };

  const dragOverHandler = (e) => {
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
        {fileError.show ? (
          <div className={styles.errorContainer}>
            <div className={styles.errorText}>{fileError.text}</div>
          </div>
        ) : (
          <div className={styles.topContainer}></div>
        )}

        <div className={styles.uploadInput}>
          {processing ? (
            <Loader
              type="Circles"
              color="#1F71A8"
              height={100}
              width={100}
              timeout={0}
            />
          ) : uploadComplete ? (
            <img src="green-check.png" className={styles.dropImage}></img>
          ) : (
            <div>
              <img src="drop-file.png" className={styles.dropImage}></img>
            </div>
          )}
          <input
            ref={hiddenFileInput}
            type="file"
            className={styles.fileUpload}
            onChange={onChange}
            disabled={processing || uploadComplete}
          />
        </div>
        {processing ? (
          <div className={styles.importMessage}>
            <div>Processing your Backup File</div>
            <div className={styles.importSubText}>....</div>
          </div>
        ) : (
          <div className={styles.importMessage}>
            <div>
              {uploadComplete
                ? `Database Imported`
                : `Click and Choose a File or Drag One Here`}
            </div>
            <div className={styles.importSubText}>
              {uploadComplete ? `clean up time!` : `.sql files only`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ImportDataPage.Layout = PageLayout;
