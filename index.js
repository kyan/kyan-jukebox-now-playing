const express = require('express')
const app = express()
const mongoose = require('mongoose')

const mongodbUrl = process.env.MONGO_DB_CONNECTION_URL
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  poolSize: 10,
  keepAlive: 120,
  bufferMaxEntries: 0,
  useUnifiedTopology: true,
  useCreateIndex: true
}

mongoose.connect(mongodbUrl, options).then(() => {
  console.info('Mongodb Connected')

  const settingSchema = mongoose.Schema({
    key: mongoose.Schema.Types.String,
    value: mongoose.Schema.Types.Mixed
  })
  const Setting = mongoose.model('Setting', settingSchema)

  app.listen(3000, () => console.log('server started'))
  app.use(express.json())
  app.post('/jukebox', (req, res) => {
    return res.status(200)
      .send(req.body)
    // Setting.findOne({ key: 'slack' })
    //   .then(state => {
    //     return res.status(200)
    //       .send(state.value.currentTrack)
    //   })
    //   .catch((error) => console.error(`Error finding slack: ${error.message}`))
  })
}).catch(err => {
  console.error('Mongodb Connect failed: ', err.message)
})
