import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post.js";
import logo from "./logo2.png";
import { db, auth, storage } from "./firebase.js";
import { collection, onSnapshot } from "firebase/firestore";
// import Modal from '@material-ui/core/modal';
// import { makeStyles } from '@material-ui/core/styles';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Avatar from '@mui/material/Avatar';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

// import InstagramEmbed from 'react-instagram-embed';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import ImageUpload from "./ImageUpload";
import { Helmet } from "react-helmet";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  // const classes = useStyles();
  // const [modalStyle] = useState(getModalStyle);
  // Code Using Firebase

  const [posts, setPosts] = useState([]);
  // For Modal
  // const [open,setOpen] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handelSignIn = () => setOpenSignIn(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const [openSignIn, setOpenSignIn] = useState(false);

  // Authentication Code Old Version
  // useEffect(()=> {
  //   const unsubscribe = auth.onAuthStateChanged((authUser) => {
  //     if(authUser){
  //       // User has logged in
  //       console.log(authUser);
  //       setUser(authUser);

  //       if(authUser.displayName){
  //         // Dont update user name
  //       }else{
  //         // If we just created someone
  //         return authUser.updateProfile({
  //           displayName: username,
  //         });
  //       }

  //     }else{
  //       // User has logged out
  //       setUser(null);
  //     }
  //   })

  //   return ()=> {
  //     // Perform some cleanup actions
  //     unsubscribe();
  //   }
  // },[user,username]);
  // useEffect( ()=> {
  //   db.collection('posts').onSnapshot(snapshot => {
  //     // Every time a post is added this code fires....
  //     setPosts(snapshot.docs.map(doc => doc.doc.data()));
  //   })
  // },[]);

  // Authentication Code New Version

  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(user);
        setUser(user);
        if (user.displayName) {
          // No need to update the user's display name
          // Here We Can simply print those things
          const displayName = user.displayName;
          const email = user.email;
          const photoURL = user.photoURL;
          const emailVerified = user.emailVerified;
          // console.log(displayName, email, photoURL,emailVerified);
        } else {
          updateProfile(auth.currentUser, {
            displayName: username.trim(),
          })
            .then(() => {
              // Profile updated!
              // ...
            })
            .catch((error) => {
              // An error occurred
              // ...
            });
        }
      }else {
        // User is signed out
        // ...
        setUser(null);
      }
    });
    return ()=>authListener();
  }, [username]);
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
  //     setPosts(snapshot.docs.map((doc) => doc.data()));
  //   });

  //   return () => unsubscribe();
  // }, []);

  // Code for assigning the posts in our state variable.

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     // User created successfully
    //     const user = userCredential.username;
    //     // Do something with the user
    //     alert('User registered:', {username});

    //   })
    //   .catch((error) => {
    //     // Error occurred during user creation
    //     alert('Registration error:', error.message);
    //   });
    createUserWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error.message)
    ).then(()=>{
      // alert("Sucessfully Signed up! "+ username);
    })
    .catch((error) => alert(error.message));
    // auth.createUserWithEmailAndPassword(email, password)
    //   .catch((error) => alert(error.message));
    setOpen(false);
  };
  const signIn = (event) => {
    event.preventDefault();
    // auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // alert("Hey Welcome ! "+ user.displayName);
      })
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  // Code Without FireBase

  // const [posts,setPosts] = useState([
  //   {
  //     username:"itsastik" ,
  //     imageUrl : "https://www.pngkit.com/png/detail/760-7605662_download-instagram-written-logo-png.png" ,caption : "Wow ! It is amazing"
  //   },
  //   {
  //     username : "blackHat" ,
  //     imageUrl : "https://www.cnet.com/a/img/resize/29abd0be3fc18b00d868886d24dc767c37ade8ed/hub/2019/08/21/dce143f1-e7e7-4011-9777-e0d1effa0259/facebook-logo-2.jpg?auto=webp&fit=crop&height=630&width=1200",
  //     caption : "Trying to find myself"
  //   },
  //   {
  //     username : "rituMahapatra",
  //      imageUrl : "https://www.ecommercenext.org/wp-content/uploads/2019/11/TikTok-scaled.png",
  //       caption : "The Best is yet to come"

  //   }

  // ]);
  return (
    <div className="app">
      {/* Code for change the name of our react app */}
      <Helmet>
        <title>MyInsta</title>

      </Helmet>
      {/* // Code For Modal */}
      {/* <Modal>
        open = {open}
        onClose =  = { () => setOpen(false) }
    
    <div style = {modalStyle} className="classes.paper">
      <h2>I am a modal</h2>
    </div>
      </Modal> */}


      <div className="app__header">
        <img className="app__headerImage" src={logo} alt="Insta" />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={handleOpen}>Sign UP</Button>
            <Button onClick={handelSignIn}>Sign In</Button>
          </div>

          // <Button onClick = {handelSignIn}>Sign In</Button>
        )}

        {/* <img src="logo.jpeg" alt="Logo"> */}
        {/* // Code For Module */}
        <div>
          {/* {user ? (
              <Button onClick={() => auth.signOut()}>Log Out</Button>
          ): (
            <div className="app__loginContainer">
                <Button onClick={handleOpen}>Sign UP</Button>
                <Button onClick = {handelSignIn}>Sign In</Button>
            </div>
            
            // <Button onClick = {handelSignIn}>Sign In</Button>
          )
          } */}
          {/* // <Button onClick={handleOpen}>Sign UP</Button> */}
          {/* Moal for sign up Widget */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {/* Welcome User!! */}
                <center>
                  <img
                    className="app__headerImage"
                    src={logo}
                    alt="Insta Logo"
                  />
                </center>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {/* Hey Welcome !! Please Sign Up here, If you have already done this , Please Log in from here  */}

                <form className="app__signup">
                  <Input
                    required
                    placeholder="User Name"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Input
                    required
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    required
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type="submit" onClick={signUp}>
                    Sign Up
                  </Button>
                </form>
              </Typography>
            </Box>
          </Modal>
          {/* Modal for SignIn Widget */}
          <Modal
            open={openSignIn}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {/* Welcome User!! */}
                <center>
                  <img
                    className="app__headerImage"
                    src={logo}
                    alt="Insta Logo"
                  />
                </center>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {/* Hey Welcome !! Please Sign Up here, If you have already done this , Please Log in from here  */}

                <form className="app__signup">
                  <Input
                    required
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    required
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type="submit" onClick={signIn}>
                    Sign In
                  </Button>
                </form>
              </Typography>
            </Box>
          </Modal>
          
          
          {user?(
            <div className="user__into">
              <Avatar
              className ="user__avatar"
              alt={user.displayName}
              src="abc.jpg"
            />
            <a className="myPost" href="/myPost"><h4>{user.displayName}</h4></a>
              {/* <h4>{user.displayName}</h4> */}
              {/* <h4>{username}</h4> */}
            </div>
          ):(
            <h4>NULL</h4>
          )
          }
          
        </div>

        {/* // End For Module ( From Material UI) */}
      </div>

      {/* Lets Code for router */}

        {/* Code For Creating Chat Space */}
        {/* <h6>Want to chat with friends? <a href="#">Click here</a></h6> */}

      {/* <h1>I can do it !</h1> */}
      {/* Header */}
      {/* {
        posts.map(post => (
          <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
        } */}
    <div className="content__body">
      <div className="app__post">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postid={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        {/* <div className="chat__space">
          <h1>Chat Space :Comming Soon </h1>
        </div> */}
    </div>
     
      {/* Post */}
      {/* 
      <Post username ="itsastik" imageUrl="https://www.pngkit.com/png/detail/760-7605662_download-instagram-written-logo-png.png" caption = "Wow ! It is amazing"/>
      <Post username="blackHat" imageUrl= "https://www.cnet.com/a/img/resize/29abd0be3fc18b00d868886d24dc767c37ade8ed/hub/2019/08/21/dce143f1-e7e7-4011-9777-e0d1effa0259/facebook-logo-2.jpg?auto=webp&fit=crop&height=630&width=1200" caption="Trying to find myself"/>
      <Post username="rituMahapatra" imageUrl="https://www.ecommercenext.org/wp-content/uploads/2019/11/TikTok-scaled.png" caption="The Best is yet to come"/> */}
      {/* <Post/> */}
      {/* Post */}
      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry You need to Login to Upload</h3>
      )}
    </div>
  );
}

export default App;

// UseEffect : Runs a specific piece of code on a specific condition.
// useEffect(() => {
// This is where the code runs
//},[ Condition])
// If We leave blank in the condition portion then the useEffect Will run when the page refreshes

// Here our requirement is to load this code when the page refreshes and also in every single time when the posts changes.

// The onSnapshot function runs whenever there is some changes on the database

// If we give unique id to each component then react process it easily, it updates only in the required components ,without bothering about the other components.
// Without Key react refreshes the whole tree but with using key it only adds or removes that component into the tree.

// onAuthStateChanged() function will listen on any single authentication change on our app

// If a user has logged in our app and then he refreshes the page then also the user remains in the logged in state, because the state variable keeps track of this.
