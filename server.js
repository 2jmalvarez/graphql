const express = require('express');
const cors = require("cors");
const morgan = require("morgan");

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

require("./database");
const Clientes = require('./modelos/clientes')

// Arrancamos el servidor web
var app = express();
app.set("port", process.env.PORT || 3000);

// Middlewares
// const corsOptions = {origin: "http://localhost:4200"}
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


// starting the server
app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}

      http://localhost:${app.get("port")}

  `);
});



app.get('/', function (req, res) {
  res.redirect('/graphql')
})












async function verifyToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauhtorized Request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
      return res.status(401).send('Unauhtorized Request');
    }

    const payload = await jwt.verify(token, 'secretkey');
    // console.log('=================payload===================');
    // console.log(payload);
    // console.log('==================payload==================');
    if (!payload) {
      return res.status(401).send('Unauhtorized Request');
    }

    if (req.userId != undefined) {
      console.log('===================a=================');
      console.log(req.userId);
      console.log('===================a=================');
    }
    req.userId = payload._id;
    next();
  } catch (e) {
    //console.log(e)
    return res.status(401).send('Unauhtorized Request');
  }
}

















// Construimos el schema
var schema = buildSchema(`
 
  type Cliente {
    id: Int
    nombre: String
    telefono: String
    }
 
  type Query {
        clientes: [Cliente]
        cliente(id: Int): Cliente
    }
 
  type Mutation {
        addCliente(nombre: String, telefono: String, pass: String): Cliente
    }
 
`);

var clientes = [];
var counter = 1;

// Función para resolver las peticiones
var root = {
  clientes: async () => { return await Clientes.find(); },

  cliente: (data) => {
    for (var i = 0; i < clientes.length; i++)
      if (clientes[i].id == data.id)
        return clientes[i];

    return null;
  },

  addCliente: async (data) => {
    var c = { 'nombre': data.nombre, 'telefono': data.telefono };
    if (data.pass == '123j') {
      const cliente = new Clientes(c)


      //     console.log("base",base);

      await cliente.save()
        .then(a => res.json(a))
        .catch(error => console.log(error))

      return cliente;

    }
    else
      return {error: 'contraseña incorrecta' }
  },
};


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));