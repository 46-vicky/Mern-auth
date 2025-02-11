import jwt from 'jsonwebtoken'
import User from "../models/authModel.js"

const protectRoute = async (req,res,next)=>{

    const {token} = req.cookies;

    if(!token){

        return res.status(400).json({error : "Unauthorized : No token Provided"});

    }

    try{

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedToken){
    
            return res.status(400).json({error : "Unauthorized : Invalid Token"});
    
        }
    
        const user = await User.findOne({_id : decodedToken.userId});
    
        if(!user){
            
            return res.status(400).json({error : "User Not Found"})
    
        }
    
        req.body.userId = decodedToken.userId;

        next()

    }catch(error){

        console.log(error.message)

        res.status(500).json({error : "Internal Server Error"})

    }

}

export default protectRoute