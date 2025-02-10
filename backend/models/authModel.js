import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    verifyOtp : {
        type : String,
        default : ''
    },
    verifyOtpExpiresAt : {
        type : Number,
        default : 0
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    resetOtp : {
        type : String,
        default : ''
    },
    resetOtpExpiresAt : {
        type : Number,
        default : 0
    }
})

const User = mongoose.model('user', userSchema)

export default User