const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const { engine } = require("express-handlebars");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Initialization
const app = express();
require('./database');

//Settings
app.set("port", 3000);

app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
   
  })
);

app.set('view engine', '.hbs');

//Middlewares

app.use( morgan('dev'));
app.use( express.json());
app.use( express.urlencoded( {extended:false }) );

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'publlc/uploads'),
    filename: (req, file, callback) => {
        callback( null, uuidv4() + path.extname(file.originalname).toLowerCase() );
    }

});
app.use(multer( {storage} ).single('image'));


//routes
app.use( require('./routes/index.routes'));

module.exports = app;


