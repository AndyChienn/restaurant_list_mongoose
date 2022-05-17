const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const { redirect } = require('express/lib/response')
const mongoose = require('mongoose')
const db = mongoose.connection

const Restaurant = require('./models/Restaurant')
const bodyParser = require('body-parser')
const urlencoded = require('body-parser/lib/types/urlencoded')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })


db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})




// render indexed.hbs

app.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .then(console.log('index rendered!'))
    .catch(error => console.log(error))
})

// add restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const body = req.body
  return Restaurant.create(body)
    .then(console.log('new restaurant added,req.body', body))
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id.toString())
  res.render("show", { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render("index", { restaurants: restaurants, keyword: keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})