const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");

require('dotenv').config()

// IMPORT MODELS
require('./models/Product')
require('./models/Form')
require('./models/Counter')
require('./models/Respond')
require('./models/Polygon')






const app = express();

mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/final`);
mongoose.connect( `mongodb+srv://mmd:ssd@cluster0-sfn9i.mongodb.net/test?retryWrites=true&w=majority`);

app.use(bodyParser.json());
app.use(cors());

//IMPORT ROUTES
require('./routes/productRoutes')(app);
require('./routes/counterRoutes')(app);
require('./routes/formRoutes')(app);
require('./routes/polygonRoutes')(app);



if (process.env.NODE_ENV === 'production') { 
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});