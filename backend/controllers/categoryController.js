import asyncHandler from 'express-async-handler'
import Category from '../models/Category.js'

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 })
  res.json({ categories })
})

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon } = req.body
  const exists = await Category.findOne({ name })
  if (exists) {
    res.status(400)
    throw new Error('Category already exists')
  }
  const category = await Category.create({ name, icon })
  res.status(201).json({ category })
})

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }
  await category.deleteOne()
  res.json({ message: 'Category removed' })
})