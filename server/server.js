import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import companyRouter from './routes/companies.js'
import userRouter from './routes/users.js'
import authRouter from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = process.env.MONGO_URI
mongoose.connect(uri, { dbName: "job-hunter" })
  .then(() => {
    console.log("Successfully connected to MongoDB via Mongoose!")
  })
  .catch((err) => {
    console.error(err)
  });

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/companies', companyRouter);

app.get('/', (req, res) => {
  res.send('Job Hunter API is running')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))