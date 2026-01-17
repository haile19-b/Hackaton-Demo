import express, { Request,Response } from "express";
import cors from "cors"
import routes, { router } from "./routes"
import { errorHandler } from "./middlewares/error-handler";
import { env } from "./env";


const PORT = env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use(errorHandler);

app.get("/",(req:Request,res:Response) => {
    res.send("HELLO from Backend!")
})

app.use("/api",routes)

app.listen(PORT,()=>{
    console.log(`🚀 server is running on: http://localhost:${PORT}`)
})