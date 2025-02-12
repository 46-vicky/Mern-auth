import User from '../models/authModel.js';

export const getUserData = async (req, res)=>{

    const {userId} = req.body;

    try{

        const user = await User.findOne({_id: userId});

        if(!user){

            return res.status(400).json({success: false, message : "Invalid User"})

        }

        return res.status(200).json({
            success : true,
            userData : {
                username : user.username,
                isVerified : user.isVerified
            }
        })

    }catch(error){

        return res.status(400).json({success : false, message : error.message})

    }
     
}