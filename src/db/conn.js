const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
mongoose.connect("mongodb://localhost:27017/PakScholarsInstitute", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`no connection`);
})