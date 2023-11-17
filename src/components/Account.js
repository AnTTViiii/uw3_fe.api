import React, { useState, useRef } from "react";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import { LoginRounded, LogoutRounded, Error,
        VpnKeyRounded, AccountCircleRounded,
        VisibilityRounded, VisibilityOffRounded, } from "@mui/icons-material";
import { Button, IconButton, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../stores/auth";
import ForgotPassword from "./ForgotPassword";
import axios from "axios";

function Header() {
  const signupRef = useRef();
  const loginRef = useRef();
  const logoutRef = useRef();

  const closeSignupPopup = () => signupRef.current.close();
  const openSignupPopup = () => signupRef.current.open();

  const closeLoginPopup = () => loginRef.current.close();
  const openLoginPopup = () => loginRef.current.open();

  const closeLogoutPopup = () => logoutRef.current.close();
  const openLogoutPopup = () => logoutRef.current.open();

  const navigate = useNavigate();

  const [pw, setPW] = useState(false);
  const handleClickShowPassword = () => {
    setPW(!pw);
  };

  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(error !== null ? true : false);

  const setAlertError = (error) => {
    setError(error);
    setShowAlert(true);
  };
  const dispatch = useDispatch();
  //display User Logo
  const { isAuthed, account } = useSelector((state) => state.auth);
  //login
  const emailLoginRef = useRef();
  const pwLoginRef = useRef();
  
  async function login (event) {
    const email = emailLoginRef.current.value;
    const password = pwLoginRef.current.value;
    console.log(email, password);
    if (!email || !password) {
      return setAlertError("Please fill out all field!");
    }
    //sign in successfully
    event.preventDefault();
    try {
      const user = { 
        email: email,
        password: password,
      };
      await axios.post('http://localhost:9098/api/login', user).then((res) => {
        console.log(res.data);
        if (res.data == null) {
          alert("Email or password is incorrect!");
        } else if (res.data != null) {
          setError(null);
          setShowAlert(false);
          const account = res.data;
          dispatch(authActions.setAuth(account));
          navigate("/home");
          closeLoginPopup();
          alert("Successfully");
        }
      }, fail => {
        console.error(fail);
      });
    } catch (error) {
      alert(error);
    }
  };
  const user = isAuthed ? JSON.parse(localStorage.getItem("user")) : [];
  //Signup
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  //api signup
  async function signup(event) {
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirm = passwordConfirmRef.current.value;
    console.log(username, email, password, passwordConfirm);
    if (!username || !email || !password || !passwordConfirm) {
      return setAlertError("Please fill out all fields!");
    }

    if (password.length < 8 || password.length > 20) {
      return setAlertError("Password must be 8-20 chars!");
    }
    if (
      !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/)
    ) {
      return setAlertError(
        "Password must be include at least 1 lowercase character, 1 uppercase character, 1 special character and 1 number."
      );
    }
    if (password !== passwordConfirm) {
      return setAlertError("The password confirmation does not match!");
    }
    event.preventDefault();
    try {
      const user = { 
        email: email,
        password: password,
        acc: {
          username: username,
        }
      };
      await axios.post('http://localhost:9098/api/acc', user);
      alert("Sign up Successfully!");
    } catch (error) {
      alert(error);
    }
    setError(null);
    setShowAlert(false);
    navigate("/home");
    closeSignupPopup();
  }

  //forgot pw
  const [isOpenFP, setIsOpenFP] = useState(false);
  const forgotPw = () => {
    setIsOpenFP(!isOpenFP);
  };
  //logout
  const handleLogout = () => {
    dispatch(authActions.logout(account));
    navigate("/home");
    closeLogoutPopup();
  };
  return (
    <div className="user">
      {isAuthed ? (
        <div>
          <Popup contentStyle={{ zIndex: "10", width: "14%", minWidth: "max-content", padding: 0, }}
            trigger={
              <img src={user.avatar}
                alt="avt" title={user.username} /> }
            position={"bottom right"} >
            <div className="accountItemPopup row1" onClick={(e) => { navigate("/user"); }}>
              <AccountCircleRounded
                className="userIcon"
                fontSize="small"
                sx={{ color: "white", marginRight: 1 }}
              />
              <p>Profiles</p>
            </div>
            <div className="accountItemPopup row2" onClick={openLogoutPopup}>
              <LogoutRounded
                className="userIcon"
                fontSize="small"
                sx={{ color: "white", marginRight: 1 }}
              />
              <p>Logout</p>
            </div>
          </Popup>
          <Popup ref={logoutRef} modal
            contentStyle={{ zIndex: "11", borderRadius: "10px", padding: "10px 20px 20px", width: "40%", }}>
            <div>
              <h2>Logout</h2>
              <p style={{ margin: "10px 0" }}> Are you sure you want to Logout? </p>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", }}>
                <Button variant="contained" color="inherit"
                  sx={{ backgroundColor: "white", color: "#2a2854", marginRight: "30px",
                    ":hover": { backgroundColor: "whitesmoke", color: "#2a2854", }, }}
                  onClick={closeLogoutPopup} > Cancel </Button>
                <Button variant="contained"
                  sx={{ backgroundColor: "#2a2854", ":hover": { backgroundColor: "#2a2835" }, }}
                  onClick={(e) => { handleLogout(); }}> Confirm </Button>
              </div>
            </div>
          </Popup>
        </div>
      ) : (
        <div>
          <Popup
            contentStyle={{ zIndex: "10", width: "14%", minWidth: "max-content", padding: 0, }}
            trigger={ <img src="https://res.cloudinary.com/dpwehcnso/image/upload/v1687426572/t420uv99c8anfzjw6okq.png" alt="login" /> }
            position={"bottom right"}>
            <div className="accountItemPopup row1" onClick={openLoginPopup}>
              <LoginRounded
                className="userIcon"
                fontSize="small"
                sx={{ color: "white", marginRight: 1 }}
              />
              <p>Login</p>
            </div>
            <div className="accountItemPopup row2" onClick={openSignupPopup}>
              <VpnKeyRounded
                className="userIcon"
                fontSize="small"
                sx={{ color: "white", marginRight: 1 }}
              />
              <p>Signup</p>
            </div>
          </Popup>
        </div>
      )}
      <Popup ref={loginRef} modal
        contentStyle={{ zIndex: "11", margin: "auto", borderRadius: "10px", padding: "20px 20px 5px", width: "45%", maxWidth: "400px", }}>
        <div>
          <div id="fontVI" className="btnCloseForm" onClick={closeLoginPopup}>✖️</div>
          <h2 align="center" style={{marginBlock: 0}}>Login</h2>
          <form className="loginForm">
            <p>Email:</p>
            <p><input type="email" ref={emailLoginRef} /></p>
            <p>Password:</p>
            <p className="pwField">
              <input type={pw ? "text" : "password"} ref={pwLoginRef} />
              <IconButton onClick={handleClickShowPassword} className="showHideIcon">
                {pw ? <VisibilityRounded /> : <VisibilityOffRounded />}
              </IconButton>
            </p>
            {showAlert && (<Alert
                icon={<Error fontSize="inherit" />}
                severity="warning"
                sx={{ margin: "10px 0" }}>
                {error}
            </Alert>)}
            <input type="button" className="btnSubmit" id="fontEN"
              onClick={(e) => { login(e); }} value={`Submit`} />
          </form>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p onClick={forgotPw} style={{color: 'yellow', fontWeight: 'bold'}}>Forgot Password?</p>
            {isOpenFP && <ForgotPassword handleClose={forgotPw} />}
            <p style={{ cursor: "pointer", color: "yellow", fontWeight: "bold", }}
                onClick={(e) => { closeLoginPopup(); openSignupPopup(); }}> Signup here! </p>
          </div>
        </div>
      </Popup>
      <Popup ref={signupRef} modal
        contentStyle={{ zIndex: "11", borderRadius: "10px", padding: "20px 20px 5px", width: "45%", maxWidth: '400px' }}>
        <div>
          <div id='fontVI' className="btnCloseForm" onClick={closeSignupPopup}>✖️</div>
          <h2 align="center" style={{ marginBlock: 0 }}>Signup</h2>
          <form className="loginForm">
            <p>Username:</p>
            <p><input type="text" ref={usernameRef} /></p>
            <p>Email:</p>
            <p><input type="email" ref={emailRef} /></p>
            <p>Password:</p>
            <p className="pwField">
              <input type={pw ? "text" : "password"} ref={passwordRef} />
              <IconButton onClick={handleClickShowPassword} className="showHideIcon">
                {pw ? <VisibilityRounded /> : <VisibilityOffRounded />}
              </IconButton>
            </p>
            <p>Confirm Password:</p>
            <p className="pwField">
              <input type={pw ? "text" : "password"} ref={passwordConfirmRef} />
              <IconButton onClick={handleClickShowPassword} className="showHideIcon">
                {pw ? <VisibilityRounded /> : <VisibilityOffRounded />}
              </IconButton>
            </p>
            {showAlert && (<Alert
                icon={<Error fontSize="inherit" />}
                severity="warning"
                sx={{ margin: "10px 0" }}>
                {error}
            </Alert>)}
            <input type="button" className="btnSubmit" id="fontEN" name="submitSignup" onClick={(e) => { signup(e); }} value={`Submit`} />
          </form>
          <div style={{ textAlign: "center" }}>
            <p>Already have an account?{" "}
              <span style={{ cursor: "pointer", color: "yellow", fontWeight: "bold", }} 
                onClick={(e) => { closeSignupPopup(); openLoginPopup(); }} > Login </span>
            </p>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default Header;