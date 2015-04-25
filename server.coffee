express = require "express"
path = require "path"
logger = require "morgan"
bodyParser = require "body-parser"
Sequelize = require "sequelize"
moment = require "moment"

sequelize = new Sequelize "nba-agc", "root", "",
  port:    3306,
  host: 'localhost',
  logging: false


connectDb = ->
  sequelize.sync()
  .complete (err) ->
    if not not err then console.log "Unable to connect to database"

connectDb()

app = express()

app.set 'port', process.env.PORT || 3005
app.use bodyParser.json()
app.use bodyParser.urlencoded( extended: true )
app.use express.static(path.join(__dirname, 'public'), maxAge: 86400000 )

app.listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get('port')

app.use logger('tiny')

app.get '/api', (req, res) ->
  res.send {done: false}


app.post '/api/amountDue', (req, res) ->
  theYear = parseInt req.body.yearCalled
  atBar = 2015 - theYear

  res.send amount: 50000

app.get '*', (req, res) ->
  res.redirect 302, "/##{req.originalUrl}"

app.use (err, req, res) ->
  console.error err.stack
  res.send { message: err.message }, 500