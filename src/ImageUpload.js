import "firebase/compat/storage";
import firebase from "firebase/compat/app";

import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "firebase/app";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth, storage } from "./firebase";

import { getAuth } from "firebase/auth";

import "./imageUpload.css";

export default function ImageUpload({ username }) {
  // const db = firestore();
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  //const [progress, setProgress] = useState(0);

  const [image, setImage] = useState(null);

  const handelChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    } else if (e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };
  const handleUpload = (e) => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          // console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            // Test Start

            setProgress(0);
            setCaption("");
            setImage(null);

            const postsCollectionRef = collection(db, "posts");

            addDoc(postsCollectionRef, {
              // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              timestamp: serverTimestamp(),
              caption: caption,
              imageUrl: downloadURL,
              username: username,
            })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });

            // Test End
          });
        }
      );
    }
  };
  useEffect(() => {
    const dropContainer = document.getElementById("dropcontainer");
    const fileInput = document.getElementById("images");

    if (dropContainer && fileInput) {
      dropContainer.addEventListener(
        "dragover",
        (e) => {
          e.preventDefault();
        },
        false
      );

      dropContainer.addEventListener("dragenter", () => {
        dropContainer.classList.add("drag-active");
      });

      dropContainer.addEventListener("dragleave", () => {
        dropContainer.classList.remove("drag-active");
      });

      dropContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        dropContainer.classList.remove("drag-active");
        fileInput.files = e.dataTransfer.files;
        handelChange(e); // Call the handelChange function to update the image state
      });
    }
  }, []);
  return (
    <div className="imageupload">
      {image ? (
        <img
          className="image-preview"
          src={URL.createObjectURL(image)}
          alt="Preview"
        />
      ) : (
        <label for="images" class="drop-container" id="dropcontainer">
          <span class="drop-title">Drop files here</span>
          or
          <input
            type="file"
            id="images"
            accept="image/*"
            onChange={handelChange}
            required
          />
        </label>
      )}
      {progress !== 0 && (
        <progress
          className="imageupolad__progress"
          value={progress}
          max="100"
        />
      )}

      <input
        type="text"
        className="caption-input"
        placeholder="Enter a Caption...."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <Button className="upload-button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}
