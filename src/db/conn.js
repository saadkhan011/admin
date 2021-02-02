const mongoose = require("mongoose");
const url = process.env.MONGODB_URL || 'mongodb://localhost/admin_db' ;

mongoose.connect({
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`no connection`);
})
