import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Loader from '../components/Loader';

const ForgotPassword = () => {

  const navigate = useNavigate();
  const [email,setEmail] = useState('')
  const [mailSending, setMailSending] = useState(false);

  const {backendURL} = useContext(AppContext)

  const handleSubmit = async(e)=>{
    e.preventDefault();
      axios.defaults.withCredentials = true;
      setMailSending(true)
      try{
        const {data} = await axios.post(`${backendURL}/api/auth/send-reset-otp`, { email })
        if(data.success){
          navigate('/reset-password')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
      }catch(error){
        toast.error(error.response?.data.message || "Failed To Send OTP");
      }finally{
        setMailSending(false);
        setEmail('')
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
        <h1 className="mb-4 text-center text-3xl font-semibold text-white">Forgot password?</h1>
        <p className="mb-6 text-center text-sm">No worries, we'll send you reset instructions.</p>

        <form onSubmit={!mailSending ? handleSubmit : (e)=>(e.preventDefault())}>

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
            <button className="flex justify-center items-center w-full cursor-pointer rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 py-3 font-medium tracking-wide text-white">{ mailSending ? <Loader/> : 'Reset Password'}</button>
        </form>

        <p className="mt-5 text-center text-sm flex items-center justify-center gap-2 text-slate-400 cursor-pointer" onClick={()=>{navigate('/login')}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M4 12H20M4 12L8 8M4 12L8 16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            <span>Back to log in</span>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword