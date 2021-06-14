const { Socket } = require('dgram');
const express = require('express');
const path = require('path')
const app = express();
const http = require('http').createServer(app);  
const io = require("socket.io")(http); 
// agora nossa aplicação consegue utilizar requisições ws e http

app.use(express.static(path.join(__dirname, 'public'))) // dizemos onde irá ficar os arquivos estáticos
app.set('views', path.join(__dirname, 'public')) // dizemos onde ficará as views da nossa aplicação
app.engine('html', require('ejs').renderFile) // e dizemos qual engine vamos usar, no caso, o ejs
app.set('view engine', 'html')

app.use('/', (req, res)=>{
    res.render('index.html')
})

let messages = []

io.on('connection', socket=>{
    console.log(`Socket conectado #${socket.id}`)

    socket.emit('previousMessages', messages)

    socket.on('sendMessage', message=>{
        messages.push(message)
        socket.broadcast.emit('receivedMessage', message)
    })

})

http.listen(3000)