const mongoose = require('mongoose')

const stallSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId , ref:'User'},
    name: String,
    photos: [String],
})

const StallModel = mongoose.model('Stall', stallSchema);

module.exports = StallModel ;