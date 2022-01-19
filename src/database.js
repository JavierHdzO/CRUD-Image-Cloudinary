const { connect } = require('mongoose');
require('dotenv').config();

(async ()=> {
    try {
       await connect(process.env.MONGODB_URI)
       .then( db => console.log('Database is connected', db.connection.name))
       .catch(err => console.error(err));
       

    } catch (error) {
        console.error(error);
    }
})();