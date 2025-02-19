import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate()

  const [state, setState] = useState("Sign Up");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const {backendURL, setIsLoggedIn} = useContext(AppContext);

  const onSubmitHandler = async (e)=>{

    try{

      e.preventDefault();

      axios.defaults.withCrendentials = true

      if(state === 'Sign Up'){

        const {data} = await axios.post(backendURL+'/api/auth/register',{name, email, password})

        if(data.success){

          setIsLoggedIn(true)

          navigate('/')

        }else{

          toast.error(data.message)

        }

      }else{

        const {data} = await axios.post(backendURL+'/api/auth/login',{email, password})

        if(data.success){

          setIsLoggedIn(true)

          navigate('/')

        }else{

          toast.error(data.message)

        }
        
      }

    }catch(error){

      toast.error(data.message)

    }

  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={()=>navigate('/')}
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create Your account"
            : "Login to Your account!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email id"
              required
              className="bg-transparent outline-none"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <p className="mb-4 text-indigo-500 cursor-pointer flex justify-end" onClick={()=>navigate('/reset-password')}>
            Forgot Password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
