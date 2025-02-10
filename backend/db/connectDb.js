import mongoose from "mongoose";

const connectDb = async ()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL)
          console.log("Mongo DB Connected")
    }catch(error){
        console.log(`Error in Connecting Db : ${error.message}`)
        process.exit(1)
    }
}

export default connectDb