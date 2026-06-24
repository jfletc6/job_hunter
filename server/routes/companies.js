import express from 'express'
import Company from '../models/Company.js'
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()

router.use(requireAuth)

// Get all companies for the logged-in user
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.userId })
    res.json(companies)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add a company
router.post('/', async (req, res) => {
  const company = new Company({ ...req.body, userId: req.userId })
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
    const company = await Company.findOne({ _id: req.params.id, userId: req.userId })
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }
    await company.deleteOne()
    res.json({ message: 'Company deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router