const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const productRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const viewsRoutes = require('./routes/views');

// Configuración de handlebars
app.engine(
  'hbs',
  exphbs({
    extname: 'hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
  })
);
app.set('view engine', 'hbs');
app.set('views', './views');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/productos', productRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/', viewsRoutes);

// Archivos estáticos
app.use(express.static('public'));

// Manejador de eventos para websockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Envío de lista de productos al cliente
  socket.emit('productos', productRoutes.listar());

  // Envío de lista de mensajes al cliente
  socket.emit('messages', chatMessages);

  // Escucho los mensajes enviado por el cliente y se los propago a todos
  socket.on('new-message', (data) => {
    chatMessages.push(data);
    io.sockets.emit('messages', chatMessages);
  });
});

// Inicialización del servidor
const PORT = 8080;

const server = http.listen(PORT, () => {
  console.log(`servidor escuchando en http://localhost:${PORT}`);
});
