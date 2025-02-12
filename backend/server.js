import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDb from "./db/connectDb.js"
import authRoute from "./routes/authRoutes.js"
import userRoute from "./routes/userRoutes.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials : true
}))

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)

app.listen(port,()=>{
    console.log(`Server Running on PORT : ${port}`)
    connectDb()
})
