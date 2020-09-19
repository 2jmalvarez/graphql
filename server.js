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
        addCliente(nombre: String, telefono: String): Cliente
    }
 
`);
 
var clientes = [];
var counter=1;
 
// Función para resolver las peticiones
var root = {
  clientes: async () => { return await Clientes.find(); },
 
  cliente: ( data ) => {
    for ( var i=0; i<clientes.length; i++ )
        if ( clientes[i].id==data.id )
            return clientes[i];
 
    return null;
    },
 
  addCliente: async ( data ) => {
    var c={ 'nombre':data.nombre, 'telefono':data.telefono };
    
    const cliente = new Clientes(c)


    //     console.log("base",base);

    await cliente.save()
            .then(a => res.json(a))
            .catch(error => console.log(error))
    
    return cliente;
    },
};


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));