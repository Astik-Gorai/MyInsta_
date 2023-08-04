import React, { useEffect, useState } from "react";
// import logo from './logo.jpeg';
import './Post.css';
import Avatar from '@mui/material/Avatar';
import {db,auth,storage} from './firebase';
import { collection, onSnapshot,doc,addDoc, serverTimestamp,query,orderBy } from 'firebase/firestore';

// import firebase from 'firebase';

function Post({postid,user,username,imageUrl,caption}){
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState("");

    // Function Which is responsible for assigning the comments

   useEffect(() => {
        let unsubscribe;
        if (postid) {
          const postRef = doc(db, 'posts', postid);
          const commentsRef = collection(postRef, 'comments');
          const orderedCommentsRef = query(commentsRef, orderBy('timestamp', 'desc'));
          unsubscribe = onSnapshot(orderedCommentsRef, (snapshot) => {
            const temp = snapshot.docs.map((doc) => doc.data());
            setComments(temp);
          });
        }
      
        return () => unsubscribe();
      }, [postid]);


    const postComment = (event)=>{
        event.preventDefault();
        const postRef = doc(db,'posts',postid);
        const commentsRef = collection(postRef, 'comments');
        addDoc(commentsRef,{
            timestamp: serverTimestamp(),
            text:comment,
            username:user.displayName,

        })
        .then((docRef) =>{
            console.log('Document written with ID: ', docRef.id);
        })
        .catch((err) =>{
            console.error('Error adding document: ', err);
        });
        // db.collection("posts").doc(postid).collection("comments").add({
        //     text: comment,
        //     username: user.displayName,
        //     timestamp : Timestamp(),
        // });
        setComment('');
    }
    // useEffect(() => {
    //     let unsubscribe;
    //     if(postid){
    //         unsubscribe = onSnapshot(collection(db, 'posts', postid, 'comments'),(snapshot)=>{
    //             // setComments(snapshot.docs.map((doc)=>({
    //             //     id:doc.id,
    //             //     comment: doc.data()
    //             // })));
    //             setComments(snapshot.docs.map((doc)=> doc.data));
    //         })
    //         return () => unsubscribe();
    //     }
    //     // const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
    //     //   const postsData = snapshot.docs.map((doc) => {
    //     //     const postData = doc.data();
    //     //     const postId = doc.id;
      
    //     //     // Fetch comments for each post
    //     //     const commentsRef = collection(db, 'posts', postId, 'comments');
    //     //     const commentsSnapshot =  getDocs(commentsRef);
    //     //     const commentsData = commentsSnapshot.docs.map((commentDoc) => ({
    //     //       id: commentDoc.id,
    //     //       comment: commentDoc.data()
    //     //     }));
      
    //     //     return {
    //     //       id: postId,
    //     //       post: postData,
    //     //       comments: commentsData
    //     //     };
    //     //   });
      
    //     //   setComments(postsData);
    //     // });
      
    //     return () => unsubscribe();
    //   }, [postid]);
      
    // useEffect(() => {
    //     let unsubscribe;
    //     if(postid){
    //         unsubscribe = db
    //         .collection("posts")
    //         .doc(postid)
    //         .collection("comments")
    //         .orderBy('timestamp','desc')
    //         .onSnapshot(snapshot => {
    //             setComments(snapshot.docs.map((doc)=> doc.data));
    //         });
    //     }
    //     return () =>{
    //         unsubscribe();

    //     };
    // },[postid]);
    // // useEffect(() => {
    // //     let unsubscribe;
    // //     if (postid) {
    // //       unsubscribe = onSnapshot(collection(db,"posts"),)
    // //     }
    // //     return () => {
    // //       unsubscribe();
    // //     };
    // //   }, [postid]);
    // const postComment = (event) =>{
    //     event.preventDefault();
    //     db.collection("posts").doc(postid).collection("comments").add({
    //         text:comment,
    //         username: user.displayName,
    //         timestamp : firebase.firestore.FieldValue.serverTimestamp()
    //     })
    //     setComment('');
    // }
    return (
        <div className="post">
            {/* Header  --> Avatar * User Name */}
            <div className="post__header">
                <Avatar
                    className = "post__avatar"
                    alt = {username}
                    src="jhfds.jpg"
                />
                <h3>{username}</h3>
            </div>
            
            {/* Image */}

            <img className="post__image" src={imageUrl} alt="post" />
            {/* User Name * Caption */}
            <h4 className="post__text"> <strong>{username} :</strong> {caption}</h4>

            <div className="post__comments">
                {comments.map((comment) => (
                <p>
                    <b>{comment.username}</b> {comment.text}
                </p>
        ))}
        </div>

            {user && (
                <form className="post__commentBox">
                <input
                    className="post__input" type="text" placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button className="post__button" 
                disabled={!comment} type="submit" onClick = {postComment} 
                >
                    Post
                </button>
            </form>
            )}
        </div>
    )
}

export default Post;