const mongoose = require('mongoose');

const stallSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId , ref:'User'},
    name: String,
    photos:[String],
    videos: [String],
    exhibition: { type: mongoose.Schema.Types.ObjectId, ref: 'create-ex' },
});

const StallModel = mongoose.model('Stall', stallSchema);

module.exports = StallModel ;         