import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
  name: { 
    type: String,
    unique: true, 
    required: true 
  },
  url: { 
    type: String, 
    required: true, 
    unique: true 
  },
  keywords: [{ 
    type: String }],
  notes: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model('Company', companySchema)