import jwt from 'jsonwebtoken'
import User from "../models/authModel.js"

const protectRoute = async (req, res, next)=>{

    console.log('triggered')

    const {token} = req.cookies;

    if(!token){

        return res.status(400).json({success: false, message : "Unauthorized : No token Provided"});

    }

    try{

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedToken){
    
            return res.status(400).json({success: false, message : "Unauthorized : Invalid Token"});
    
        }
    
        const user = await User.findOne({_id : decodedToken.userId});
    
        if(!user){
            
            return res.status(400).json({success: false, message : "User Not Found"})
    
        }
    
        req.body.userId = decodedToken.userId;

        next()

    }catch(error){

        res.status(500).json({success: false, message : "Internal Server Error"})

    }

}

export default protectRoute