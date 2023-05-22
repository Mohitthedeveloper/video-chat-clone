const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:r', (req, res) => {
  res.render('r', { rId: req.params.r })
})

io.on('connection', socket => {
  socket.on('join-r', (rId, userId) => {
    socket.join(rId)
    socket.to(rId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(rId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)