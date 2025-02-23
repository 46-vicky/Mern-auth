import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate();

  const {userData, backendURL, setUserData, setIsLoggedIn} = useContext(AppContext);

  const [isOtpSending, setIsOtpSending] = useState(false)

  const sendVerificationOTP = async () => {
    try {
      setIsOtpSending(true);
      axios.defaults.withCredentials = true;

      await toast.promise(
        axios.post(`${backendURL}/api/auth/sent-verify-otp`),
        {
          pending: 'Sending verification code...',
          success: {
            render({ data }) {
              navigate('/email-verify');
              return data.data.message; // Accessing the message from the response
            },
          },
          error: {
            render({ data }) {
              return data.response?.data.message || 'Failed to send verification code';
            },
          },
        }
      );
    } catch (error) {
      toast.error(error.response?.data.message || 'Something went wrong');
    } finally{
      
      setIsOtpSending(false);
    }
  };

  const logout = async ()=>{

    axios.defaults.withCredentials = true;

    try{

      const {data} = await axios.post(`${backendURL}/api/auth/logout`)

      if(data.success){
        setIsLoggedIn(false)
        setUserData(false)
        navigate('/')
      }

    }catch(error){

      toast.error(error.response?.data.message || "Something went Wrong!")

    }

  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32'/>

        {userData ? 
        
        (<div className='w-8 h-8 rounded-full bg-[#1c4057] flex justify-center items-center text-white cursor-pointer relative group'>
          { userData.username[0].toUpperCase()}
          <div className='absolute scale-[0] group-hover:scale-[1] top-0 right-0 z-10  text-black rounded pt-10 origin-top-right'>
            <ul className='bg-[#1c4057] list-none p-2 text-sm m-0 rounded'>
              { !userData.isVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded-sm mb-1 text-white hover:text-[#1c4057]' onClick={!isOtpSending ? sendVerificationOTP : null}>{isOtpSending ? 'Sending' : 'Verify Login'}</li> }
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded-sm pr-10 text-white hover:text-[#1c4057]'>Logout</li>
            </ul>
          </div>
        </div>) 
        : (<button onClick={()=>navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100'>Login <img src={assets.arrow_icon} alt="" /></button>)}
        
    </div>
  )
}

export default Navbar