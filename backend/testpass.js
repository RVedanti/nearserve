import bcrypt from 'bcryptjs'

const hash = '$2b$10$qpg7mzJQtFNiFX4XDb9ifuD6JXTP4ROjjrHYfUzLpjAzI.UxZtTnW'
const result = await bcrypt.compare('Vedanti@123', hash)
console.log('Password match:', result)
