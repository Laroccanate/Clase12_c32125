const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const ProductosApi = require('./public/Api/productos')
const productosApi = new ProductosApi('./public/Api/productos.txt')

const ChatApi = require('./public/Api/chat')
const chatApi = new ChatApi('./public/Api/chat.txt')


const products = [ {
    "title": "imagenprueba",
    "price": "1200",
    "thumbnail": "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Instagram-512.png",
    "id": 1
  },
  {
    "title": "imagenprueba2",
    "price": "2000",
    "thumbnail": "https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_instagram-128.png",
    "id": 2
  }];

const chat = [];


//Servidor, socket y api

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});


//Socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');
    //Cargo el historial de mensajes cuando un nuevo cliente se conecta
    const productoListar =   await productosApi.listarAll()
    await socket.emit('producto', productoListar);

    await socket.on('new-producto',  async productos => {
        const productoGuardar = await productosApi.guardar(productos)
        const productoListar =   await productosApi.listarAll()
        //Esnvio un nuevo mensaje a todos los clientes que estén conectado en ese momento
        io.sockets.emit('producto', productoListar);
    });

    const chatListar =   await chatApi.listarAll()
    await socket.emit('mensaje', chatListar);

    await socket.on('new-mensaje',  async productos => {
        const chatGuardar = await chatApi.guardar(productos)
        const chatListar =   await chatApi.listarAll()
        io.sockets.emit('mensaje', chatListar);
    });

});

//Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//Inicia el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
