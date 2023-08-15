import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post.js";
import logo from "./logo2.png";
import { db, auth, storage } from "./firebase.js";
import { collection, onSnapshot } from "firebase/firestore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";


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


  const [posts, setPosts] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handelSignIn = () => setOpenSignIn(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const [openSignIn, setOpenSignIn] = useState(false);



// Function Used For Authetication

  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (user) => {
      if (user) {

        const uid = user.uid;
        console.log(user);
        setUser(user);
        if (user.displayName) {
          const displayName = user.displayName;
          const email = user.email;
          const photoURL = user.photoURL;
          const emailVerified = user.emailVerified;
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
      } else {
        // User is signed out
        // ...
        setUser(null);
      }
    });
    return () => authListener();
  }, [username]);

  // Function used to load all the post present in the Firestore database.
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

  // Function Used for SignUp
  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .catch((error) => alert(error.message))
      .then(() => {
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  // Function Used for SignIn
  const signIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
      })
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Helmet>
        <title>MyInsta</title>
      </Helmet>
      <div className="app__header">
        <img className="app__headerImage" src={logo} alt="Insta" />
        {user ? (
          <div></div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={handleOpen}>Sign UP</Button>
            <Button onClick={handelSignIn}>Sign In</Button>
          </div>
        )}

        <div>

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

          {user ? (
            <div className="classForNavbar">
              <div className="user__into">
                <Avatar
                  className="user__avatar"
                  alt={user.displayName}
                  src="abc.jpg"
                />
                <a className="myPost" href="/myPost">
                  <h4>{user.displayName}</h4>
                </a>
              </div>
              <div>
                <Button onClick={() => auth.signOut()}>Log Out</Button>
              </div>
            </div>
          ) : (
            <h4>NULL</h4>
          )}
        </div>
      </div>


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
      </div>   
      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry You need to Login to Upload</h3>
      )}
    </div>
  );
}

export default App;

