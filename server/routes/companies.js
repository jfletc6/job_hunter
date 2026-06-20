import express from 'express'
import Company from '../models/Company.js'

const router = express.Router()

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find()
    res.json(companies)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add a company
router.post('/', async (req, res) => {
  const company = new Company(req.body)
  try {
    const newCompany = await company.save()
    res.status(201).json(newCompany)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete a company
router.delete('/:id', async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id)
    res.json({ message: 'Company deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router