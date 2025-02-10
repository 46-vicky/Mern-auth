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
                from : process.env.SENDER_MAIL,
                to : email,
                subject : 'Welcom to Mern Auth Project',
                text : `Welcom to Mern Auth Project. Your Account has been Created with email : ${email}`,
            }

            await transporter.sendMail(mailOptions, (error, info)=>{
                if(error){
                    console.log(error)
                }else{
                    console.log(`Email is Sent : ${info.message}`)
                }
            })

            res.status(200).json({success : true, message : "Signed Up"})
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