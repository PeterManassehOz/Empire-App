import React, { useState } from "react";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logIn, signUp } from "../../actions/AuthAction";


const Auth = () => {
    
    const loading = useSelector((state) => state.authReducer.loading);
    const [isSignup, setIsSignup] = useState(true);
    const dispatch = useDispatch();
    console.log(loading);
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        confirmpass: "",
    });
    const [confirmPass, setConfirmPass] = useState(true);


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return; // Prevent further submissions while loading

        if (isSignup) {
            data.password === data.confirmpass ? dispatch(signUp(data)) : setConfirmPass(false);
        } else {
            dispatch(logIn(data))
        }
        resetForm();
    };


    const resetForm = () => {
        setConfirmPass(true);
        setData({
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            confirmpass: "",
        });
    };
    

    return (
        <div className="Auth">
            {/*Left Side */}
            <div className="a-left">
                <img src={Logo} alt="" />
                <div className="Webname">
                    <h1>Empire</h1>
                    <h6>See through the eyes of millions</h6>
                </div>
            </div>
            {/*Right Side */}
            <div className="a-right">
            <form className="infoForm authForm" onSubmit={handleSubmit}>
                <h3>{isSignup ? "Sign Up" : "Log In"}</h3>
               
                    {isSignup && (
                        <div>
                           <input type="text" placeholder="First Name" className="infoInput" name="firstname"
                           onChange={handleChange}
                           value={data.firstname || ""}
                           />
                           <input type="text" placeholder="Last Name" className="infoInput" name="lastname" 
                           onChange={handleChange}
                           value={data.lastname || ""}
                           />
                       </div>
                    )}
                 

                <div>
                    <input type="text" placeholder="Username" className="infoInput" name="username" onChange={handleChange} value={data.username || ""}/>
                </div>

                <div>
                    <input type="password" placeholder="Password" className="infoInput" name="password" onChange={handleChange} value={data.password || ""}/>
                    {isSignup && (
                        <input type="password" placeholder="Confirm Password" className="infoInput" name="confirmpass" onChange={handleChange} value={data.confirmpass || ""}/>
                    )}
                    
                </div>

                <span style={{display: confirmPass ? "none" : "block", color: "red", fontSize: "12px", marginTop: "5px"}}>Confirm password does not match </span>

                <div>
                    <span style={{fontSize: "12px", cursor: "pointer"}} onClick={() => (setIsSignup(!isSignup), resetForm())}>{isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}</span>
                </div>
                    <button className="button infoButton" type="submit" disabled={loading}>{loading ? "Loading..." : isSignup ? "Sign Up" : "Log In"}</button>
            </form>
        </div>
        </div>
    )
}

export default Auth