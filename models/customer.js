const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    avatar: {
        type: String,
    },
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
    password: {
        type: String,
        required: true
    },
    rentals: [{type: Schema.Types.ObjectId, ref: 'Rental'}],
    notes: [{
        note: {
            type: String
        },
        simpleHWman_id: {
            type: Schema.Types.ObjectId, ref: 'SimpleHWman', required: true
        }
    }],
    broken: {
        min: 0,
        type: Number,
        required: true
    },
    late_Pays: {
        min: 0,
        type: Number,
        required: true
    },
    banned : {
        type: Boolean,
        required: true
    },
    fidelity : {
        type: Number,
        min: 0,
        required: true
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;