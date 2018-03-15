import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import routes from './src/routes/appRoutes'

const app = express();
const PORT = 8000;

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/RESTdb')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

routes(app);

app.get('/', (req, res) =>
  res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () =>
  console.log(`Your server is running on port ${PORT}`)
);