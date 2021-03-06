import mongoose from 'mongoose'
import ContactSchema from '../models/appModel'

const Contact = mongoose.model('Contact', ContactSchema)

//    '/' endpoint    
export const getInitialResponse = (req, res) => {
  if (!req.query.email) {
    res.send('Please execute request with your email in query')
  } else if (!!req.query.email) {
    res.send(`
      Create a user with mandatory email field \n
      if your user exists -> navigate to your user endpoit '/:yourEmail'
    `)
  }
}

const checkUser = (user, cb) => {
  Contact.find({ email: user.email }, (err, contact) => {
    if (!!contact.length) {
      cb('User already exists', null)
    } else {
      user.save((err, contact) => {
        cb(err, user)
      })
    }  
  })
}

export const addNewContact = (req, res) => {
  const message = 'Add firstName, lastName, company and phone to your contact'
  let newContact = new Contact({ ...req.body, message })
  checkUser(newContact, (err, user) => {
    if (err || !user) return res.json({status: 500, error: err})
    res.json(user)
  })
}


//   '/:email' endpoint 
export const getContactWithEmail = (req, res) => {
  Contact.find({email: req.params.userEmail}, (err, contact) => {
    if (err) return res.send({ status: res.statusCode, error: err })
    else if (contact.length === 0) return res.send('Contact doesn\'t exist, check email address')
    
    res.json(contact)
  })
}

export const postEmptyBody = (req, res) => {
  res.send('Place your email to the request body and post it in appropriate endpoint')
}

export const updateContact = (req, res) => {
  const message = 'Delete company from your contact'
  const newContact = !!req.body.company ? { ...req.body, message } : req.body
  Contact.findOneAndUpdate({ email: req.params.userEmail }, newContact, { new: true }, (err, contact) => {
    if (err) res.send(err)
    
    res.json(contact)
  })
}

export const deleteContact = (req, res) => {
  Contact.remove({ email: req.params.userEmail }, (err, contact) => {
    if (err) res.send(err)

    res.json({ message: 'Successfully deleted contact'})
  })
}