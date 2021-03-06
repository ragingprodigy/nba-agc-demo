express = require "express"
path = require "path"
logger = require "morgan"
bodyParser = require "body-parser"
moment = require "moment"

stormpathExpressSdk = require "stormpath-sdk-express"
spMiddleware = stormpathExpressSdk.createMiddleware()

mongoose = require "mongoose"
mongoose.connect "mongodb://nba-agc:graceLIMITED12@dogen.mongohq.com:10039/nba-agc"
models = require("./models")(mongoose)

# Seed the App
models.Lawyer.collection.remove ->
  # Add new Lawyer Records
  models.Lawyer.collection.insert [
    {
      firstName: "James"
      middleName: "F"
      lastName: "Ibori"
    },
    {
      firstName: "Ikechukwu"
      middleName: "Chukuwuka"
      lastName: "Kelechukwu"
    },
    {
      firstName: "Sanni"
      middleName: "M"
      lastName: "Mohammed"
    }
  ], (err, inserted) ->
    console.log "Inserted #{inserted.length} records"

    models.San.collection.remove ->
      # Add new San Record
      models.Lawyer.find (err, records) ->
        if err then console.log err
        else
          models.San.create
            lawyer: records[0]._id
          , (err, record) ->
              console.log "Added one SAN record"

app = express()

app.set 'port', process.env.PORT || 3005
app.use bodyParser.json()
app.use bodyParser.urlencoded( extended: true )
app.use express.static(path.join(__dirname, 'public'), maxAge: 86400000 )

server = require('http').createServer(app)

server.listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get('port')

app.use logger('tiny')

spMiddleware.attachDefaults(app)

app.get '/api', spMiddleware.authenticate, (req, res) ->
  res.send {done: false}


app.post '/api/amountDue', (req, res) ->
  theYear = parseInt req.body.yearCalled
  # atBar = 2015 - theYear

  txn_data =
    amount: 50000
    txn_ref: randomString(32).toUpperCase()
    mToken: randomString 8
    clientKey: "nba_agc"

  # save transaction data in a database

  # Send transaction Init Email
  console.log "For Transaction at ", new Date(), " ==> ", txn_data

  res.send txn_data

app.post '/callback', (req, res) ->
  console.log req.body

  # Retrieve transaction status and display to the user

  # Send transaction status email to the user

  res.redirect 302, "/#callback"

app.get '*', (req, res) ->
  res.redirect 302, "/##{req.originalUrl}"

app.use (err, req, res) ->
  console.error err.stack
  res.send { message: err.message }, 500


randomString = (length) ->
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1)