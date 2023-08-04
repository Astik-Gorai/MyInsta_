// import { Button } from '@mui/material'
// import React, {useState} from 'react'
// import {db,auth,storage} from './firebase';
// // import firebase from 'firebase';
// // import firestore from 'firebase/firestore';
// import firebase from 'firebase/app';

// import { getStorage, ref } from "firebase/storage";

import 'firebase/compat/storage';
import firebase from 'firebase/compat/app';

import { Button } from '@mui/material';
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes,uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore"; 
import { firestore } from 'firebase/app';
import { collection, addDoc,serverTimestamp } from 'firebase/firestore';
import { db,auth,storage } from './firebase';
// import {auth,storage} from './firebase';

import { getAuth } from 'firebase/auth';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc } from 'firebase/firestore';
import './imageUpload.css';


export default function ImageUpload({username}) {
    // const db = firestore();
    const [caption,setCaption] = useState('');
    const [progress,setProgress] = useState(0);

    const [image,setImage] = useState(null);
    
    const handelChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]); 
        }
    }
    const handleUpload = (e) => {
        if (image) {
            const storageRef = ref(storage, `images/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed', 
            (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      console.log('File available at', downloadURL);

      // Test Start

      setProgress(0);
      setCaption("");
      setImage(null);

      const postsCollectionRef  = collection(db, 'posts');
    //   postsCollectionRef.add({
    //     caption:caption,
    //     imageUrl: downloadURL,
        // username:username
    //   });
    addDoc(postsCollectionRef, {
        // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        timestamp: serverTimestamp(),
        caption: caption,
        imageUrl: downloadURL,
        username:username,
      })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    //   db.collection("posts").add({
        // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     caption:caption,
    //     imageUrl: downloadURL,
    //     username:username
    // });
    
       

      // Test End
        
    });
  }
);

// Below Code Works fine
// const uploadTask = ref(storage, `images/${image.name}`);
        //    uploadBytes(uploadTask, image)
        //       .then((snapshot) => {
        //         // const storageRef = ref(storage, 'some-child');
                
        //         uploadBytes(uploadTask, image).then((snapshot) => {
        //             alert('Uploaded a blob or file!');
        //           });
                  

        //       })
        //       .catch((error) => {
        //         console.error('Error uploading file:', error);
        //       });
           

//             uploadTask.on('state_changed', 
//   (snapshot) => {
//     // Observe state change events such as progress, pause, and resume
//     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log('Upload is ' + progress + '% done');
//     switch (snapshot.state) {
//       case 'paused':
//         console.log('Upload is paused');
//         break;
//       case 'running':
//         console.log('Upload is running');
//         break;
//     }
//   }, 
//   (error) => {
//     // Handle unsuccessful uploads
//   }, 
//   () => {
//     // Handle successful uploads on complete
//     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//       console.log('File available at', downloadURL);
//     });
//   }
// );
            }
 
}
    // YouTube Code

    // const handleUpload = (e) => {
        
    //     // var storage = firebase.storage();
    //     const file = e.target.files[0];
    //     // var storageRef = storage.ref();
    //     // var uploadTask = storageRef.child('images/${image.name}').put(image);
    //     const uploadTask2 = ref(storage, 'images/${image.name}');
    //     // const uploadTask = storage.ref('images/${image.name}').put(image);
    //     uploadBytes(uploadTask2, file).then((snapshot) => {
    //         console.log('Uploaded a blob or file!');
    //       });
        // uploadTask.on(
        //     "state_changed",
        //        (snapshot) => {
        //         // progress function
        //         const progress = Math.round(
        //             (snapshot.byteTransformed/snapshot.totalBytes)*100
        //         );
        //         setProgress(progress);
        //     }, 
        //     (error) => {
        //         // Error function
        //         console.log(error);
        //         alert(error.message);
        //     },
        //     () => {
        //         // Complete function
                // storage.ref("images")
                // .child(image.name)
                // .getDownloadURL()
                // .then(url => {
                    // Post image inside db
                    // db.collection("posts").add({
                    //     // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    //     caption:caption,
                    //     imageUrl: url,
                    //     username:username
                    // });
                    // setProgress(0);
                    // setCaption("");
                    // setImage("");
                // })
            // }
        // )
    // }
    // const handelUpload = async (e) => {
    //     const storage = getStorage();
    //     const storageRef = ref(storage, 'images/' + image.name);
    //     const uploadTask = uploadBytes(storageRef, image);
    
    //     uploadTask.on(
    //       'state_changed',
    //       (snapshot) => {
    //         const progress = Math.round(
    //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //         );
    //         setProgress(progress);
    //       },
    //       (error) => {
    //         console.log(error);
    //         alert(error.message);
    //       },
    //       async () => {
    //         const downloadURL = await getDownloadURL(storageRef);
    //         await addDoc(collection(db, 'posts'), {
    //           caption: caption,
    //           imageUrl: downloadURL,
    //           username: username,
    //         });
    //         setProgress(0);
    //         setCaption('');
    //         setImage('');
    //       }
    //     );
    //   };


    // const handleUpload = async (e) => {
    //     const storage = getStorage();
    //     const storageRef = ref(storage, 'images/' + image.name);
    //     const uploadTask = uploadBytes(storageRef, image);
      
    //     uploadTask.onStateChanged(
    //         (snapshot) => {
    //           const progress = Math.round(
    //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //           );
    //           setProgress(progress);
    //         },
    //         (error) => {
    //           console.log(error);
    //           alert(error.message);
    //         },
    //         async () => {
    //           const downloadURL = await getDownloadURL(storageRef);
    //           await addDoc(collection(db, 'posts'), {
    //             caption: caption,
    //             imageUrl: downloadURL,
    //             username: username,
    //           });
        
    //           setProgress(0);
    //           setCaption('');
    //           setImage('');
    //         }
    //       );
    //     };
  return (
    <div className="imageupload">
        {/* <h1>Yay !!</h1> */}
        {/* I Want to have ...
        Caption Input
        File Picker
        Post Button */}
        <progress className='imageupolad__progress' value={progress} max="100"/>
        <input type="text" placeholder="Enter a Caption...." onChange = {event => setCaption(event.target.value)}value={caption}/>
        <input type="file" name="" id="" onChange={handelChange} />
        <Button onClick={handleUpload}>Upload</Button>
    </div>
  )
}
