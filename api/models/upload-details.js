const mongoose = require('mongoose');

const uploadDetailsSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId , ref:'User'},
    name: String,
    description: String,
    price: String,
    imgId:String,
    stall: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const uploadDetailsModel = mongoose.model('UploadDetails', uploadDetailsSchema);

module.exports = uploadDetailsModel;