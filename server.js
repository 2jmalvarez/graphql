const express = require('express');
const { graphqlHTTP } = require('express-graphql'); 
const { buildSchema } = require('graphql');
const cors = require("cors");
const morgan = require("morgan");
require("./database");
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
  clientes: () => { return clientes; },
 
  cliente: ( data ) => {
    for ( var i=0; i<clientes.length; i++ )
        if ( clientes[i].id==data.id )
            return clientes[i];
 
    return null;
    },
 
  addCliente: ( data ) => {
    var c={ 'id': counter, 'nombre':data.nombre, 'telefono':data.telefono };
    clientes.push( c );
    counter++;
    return c;
    },
};
 
// Arrancamos el servidor web
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.set("port", process.env.PORT || 3000);

// Middlewares
// const corsOptions = {origin: "http://localhost:4200"}
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// starting the server
app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
