const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bundleSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    products: [
        {
            listing: {type: Schema.Types.ObjectId, ref: 'Listing'},
            product: {type: Number}
        }
    ],
    price: {
        base: {
            type: Number,
            required: true
        },
        modifiers: [{
            reason: {
                type:String
            },
            sign: {
                type:String
            },
            quantity: {
                type: Number
            },
            apply: {
                type:String
            }}
        ],
        fidelity: {
            type: Number,
            required: true
        }
    },
}, { timestamps: true });

const Bundle = mongoose.model('Bundle', bundleSchema);
module.exports = Bundle;