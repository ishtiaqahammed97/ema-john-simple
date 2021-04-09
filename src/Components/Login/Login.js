
import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManeger';


function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    success: false,
    error: ''
  })
  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  document.title = "Login";

  
  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      setUser(res);
      setLoggedInUser(res);
      history.replace(from);
    })
  };

  const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
      setUser(res);
      setLoggedInUser(res);
      history.replace(from);
    })
  }

  const signOut = () => {
    handleSignOut() 
    .then(res => {
      setUser(res);
      loggedInUser(res);
    })
  };

  const handleBlur = (event) => {
    // console.log(event.target.name)
    // console.log(event.target.value)
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);

    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  };

  const handleSubmit = (event) => {
    // console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      createUserWithEmailAndPassword(user.name,user.email, user.password)
        .then(res => {
          setUser(res);
          setLoggedInUser(res);
          history.replace(from);
        })
    }
    if (!newUser && user.email && user.password) {
       signInWithEmailAndPassword(user.email, user.password)
       .then(res => {
        setUser(res);
        setLoggedInUser(res);
        history.replace(from);
      })
    }
    event.preventDefault();
  }
  return (
    <div className={{ textAlign: 'center' }}>
      { user.isSignedIn ? <button onClick={signOut}> Sign out</button> :
        <button onClick={googleSignIn}> Sign in</button>
      }
      <button onClick={fbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome {user.name} </p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="" id="" />
      <label htmlFor="newUser">New user sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Name" />} <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder="Email address" required /> <br />
        <input type="password" onBlur={handleBlur} name="password" placeholder="Password" required /> <br />
        <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
      </form>
      <p style={{ color: 'red' }}>	{user.error}</p>
      { user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'Logged In'} successfully	{user.error}</p>}

    </div>
  );
}

export default Login;
