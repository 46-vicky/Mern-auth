import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const EmailVerify = () => {

    const navigate = useNavigate();

    const otpLength = 6
    const [otp, setOtp] = useState(Array(otpLength).fill(''));
    const [verifying, setVerifying] = useState(false)
    const inputsRef = useRef([]);
  
    const {backendURL, isLoggedIn} = useContext(AppContext);

    // Handle input change
    const handleChange = (e, index) => {
      const value = e.target.value.replace(/\D/, ''); // Allow only digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Focus next input if value is entered
      if (value && index < otpLength - 1) {
        inputsRef.current[index + 1].focus();
      }
    };
  
    // Handle paste event
    const handlePaste = (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text').trim();
      const digitsOnly = pasteData.replace(/\D/g, '');
      const pasteArray = digitsOnly.split('').slice(0, otpLength);
  
      const newOtp = [...otp];
      pasteArray.forEach((char, idx) => {
        newOtp[idx] = char;
      });
      setOtp(newOtp);
  
      // Focus the appropriate input
      const nextIndex = pasteArray.length >= otpLength ? otpLength - 1 : pasteArray.length;
      inputsRef.current[nextIndex].focus();
    };
  
    const handleKeyDown = (e, index) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && !otp[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
        const currentOTP = otp.join(',')
        setVerifying(true)
        axios.defaults.withCredentials = true;
        try{
          const {data} = await axios.post(`${backendURL}/api/auth/verify-account`,{otp : currentOTP}) 
          if(data.success){
            navigate('/')
            toast.success(data.message)
          }else{
            toast.error(data.message || 'Failed to Verify OTP')
          }
        }catch(error){
          toast.error(error.response?.data.message || 'Failed to Verify OTP')
        }finally{
          setVerifying(false)
        }
    };

    useEffect(()=>{
      if(!isLoggedIn){
        navigate('/')
      }
    },[isLoggedIn])
  
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={()=>navigate('/')}
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h1 className="mb-4 text-center text-3xl font-semibold text-white">Verify OTP</h1>
        <p className="mb-6 text-center text-sm">Enter the 6-digit code we've sent to your mail</p>

        <form onSubmit={!verifying ? handleSubmit : (e)=>(e.preventDefault())}>
              <div className="flex mb-6 gap-4 justify-center">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={value}
                    placeholder="*"
                    ref={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    required
                    className="outline-none w-8 h-8 rounded-sm text-center bg-[#333A5c] font-base text-xl border-1 border-b-blue-300 flex items-center justify-center"
                  />
                ))}
            </div>

            <button className="flex justify-center items-center w-full cursor-pointer rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 py-3 font-medium tracking-wide text-white">{ verifying ? <Loader/> : 'Verify'}</button>
        </form>

        <p className="mt-5 text-center text-sm flex items-center justify-center gap-2 text-slate-400 cursor-pointer" onClick={()=>{navigate('/login')}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M4 12H20M4 12L8 8M4 12L8 16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            <span>Back to log in</span>
        </p>
      </div>
    </div>
  )
}

export default EmailVerify