const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const simpleHWmanSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    companies: [{
        type: String,
        required: true
    }],
    rentals: [{type: Schema.Types.ObjectId, ref: 'Rental'}],
}, { timestamps: true });

const SimpleHWman = mongoose.model('SimpleHWman', simpleHWmanSchema);
module.exports = SimpleHWman;