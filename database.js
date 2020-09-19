const mongoose = require("mongoose");

// const URI = "mongodb://localhost/mean-crud";
const URI = "mongodb+srv://juan:juan@elcluster-r0s4h.mongodb.net/apigraphql?retryWrites=true&w=majority";

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then((db) => console.log("db is connected"))
  .catch((err) => console.error(err));

module.exports = mongoose;
