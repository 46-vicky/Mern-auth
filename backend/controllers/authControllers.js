import User from "../models/authModel.js";
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js";
import transporter from "../utils/nodemailer.js";

export const register = async (req,res)=>{

    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({success : false, message : "Missing Details"})
    }

    try{

        const isUserExistense = await User.findOne({email})

        if(isUserExistense){
            return res.status(400).json({success : false, message : "Email Already Exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password : hashedPassword
        })

        if(newUser){

            generateToken(newUser._id, res);

            await newUser.save();

            const mailOptions = {
                from: process.env.SENDER_MAIL,
                to: email,
                subject: "Welcome to MERN Auth Project",
                text: `Welcome to MERN Auth Project. Your account has been created with email: ${email}`
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email Sent: ${info.messageId}`);
            } catch (error) {
                console.error("Error sending email:", error);
            }

            res.status(200).json({ success: true, message: "Signed Up" });

        }

    }catch(error){

        res.status(400).json({success : false, message : error.message})

    }
}

export const login = async (req,res)=>{
    try{
        const {email,password} = req.body
        
        if(!email || !password){
           return res.status(400).json({success : false, message : "Missing Field"})
        }

        const isValidUser = await User.findOne({email});

        if(!isValidUser){
            return res.status(400).json({success : false, message : "Invalid Email"})
        }

        const isVaildPassword = await bcrypt.compare(password, isValidUser.password)

        if(!isVaildPassword){
            return res.status(400).json({success : false, message : "Invalid Password"})
        }

        generateToken(isValidUser._id, res);

        res.status(200).json({success : true, message : "Logged In"})

    }catch(error){

        res.status(400).json({success : false, message : error.message})

    }
}

export const logout = async (req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly : true,
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            secure : process.env.NODE_ENV === "production",
        })

        res.status(200).json({success : true, message : "Logged Out"})
        
    }catch(error){

        res.status(400).json({success : false, message : error.message})

    }
}


export const verifyUser = async (req,res)=>{
    try{
        const {userId} = req.body;

        const user = await User.findOne({_id:userId})

        if(!user){
           return res.status(400).json({success: false, message : "Invalid User"})
        }

        if(user.isVerified){

            return res.status(400).json({success:false, message : "User Already Verified"})

        }else{

            const otp = String(Math.floor(Math.random() * 900000) + 100000)

            const expiredTime = Date.now() + (5 * 60 * 1000)

            user.verifyOtp = otp;

            user.verifyOtpExpiresAt = expiredTime

            await user.save();

            const mailOptions = {
                from: process.env.SENDER_MAIL,
                to: user.email,
                subject: "Verify Email",
                text: `Your Mern Auth Project Email Verification OTP is : ${otp}`
            }
            try {
                
                const info = await transporter.sendMail(mailOptions);

                console.log(`Email Sent: ${info.messageId}`);

            } catch (error) {

                console.error("Error sending email:", error);

            }

            res.status(200).json({ success: true, message: "Verify Mail Sended" });
        }

    }catch(error){

        res.status(400).json({success: false, message : error.message})

    }
}

export const verifyOtp = async (req,res)=>{
    try{
        const {userId, otp} = req.body;

        if(!userId || !otp){

            return res.status(400).json({success:false, message : "Missing Field"})

        }

        const user = await User.findById(userId);

        if(user.verifyOtp !== '' && user.verifyOtp !== otp){

            return res.status(400).json({success:false, message : "Invalid OTP"})

        } 
        
        if(Date.now() > user.verifyOtpExpiresAt){

            return res.status(400).json({success:false, message : "OTp Expired Please Try Again"})

        }

        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiresAt = 0;

        await user.save()

        res.status(200).json({success: true, message : "Verification Successfully!"})

    }catch(error){
        
        console.log("Error in verify OTP Controller")

        res.status(400).json({success: false, message : error.message})
    }
}