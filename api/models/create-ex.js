const mongoose = require('mongoose');

const CreatexSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId , ref:'User'},
    title: String,
    description: String,
    datefrom: Date,
    dateto: Date ,
});

const createxModel = mongoose.model('Createx', CreatexSchema);

module.exports = createxModel;