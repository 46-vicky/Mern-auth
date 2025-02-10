import jwt from "jsonwebtoken"

const generateToken = (userId,res)=>{

    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn : "7d"
    })

    res.cookie("token",token,{
        httpOnly : true,
        sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
        secure : process.env.NODE_ENV === "production",
        maxAge : 7 * 24 * 60 * 60 * 1000
    })
}

export default generateToken