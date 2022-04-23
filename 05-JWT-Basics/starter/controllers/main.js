require('dotenv').config();
const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom-error')

const login = async (req, res) => {
   const { username, password } = req.body
   //3 formas de fazer a validação
   //mongoose validation
   //Joi
   //check in the controller
   if (!username || !password) {
      throw new CustomAPIError('Please provide email and password', 400)
   }

   //just for demo, normally provided by DB
   const id = new Date().getDate()
   //try to keep payload small, batter experience for user
   //just for demo, in production use long, complex and unguessable string value
   const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '10d' })

   res.status(200).json({ msg: 'user created: ', token })
}

const dashboard = async (req, res) => {
   const luckyNumber = Math.floor(Math.random() * 100)
   res.status(200).json({ msg: `hello, john doe`, secret: `here is your authorized data, your lucky number is ${luckyNumber}` })
}

module.exports = {
   login, dashboard
}