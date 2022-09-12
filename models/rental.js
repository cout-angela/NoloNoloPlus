const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    customer_id: {
        type: String, required: true
    },
    simpleHWman_id: {
        type: String, required: true
    },
    products: [
        {
            listing: {type: String, required: true},
            product: {type: Number}
        }
    ],
    dateStart: {
        type: Date,
        default: true
    },
    rejected: {
        type: Boolean,
        required: true
    },
    neverApproved: {
        type: Boolean,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    },
    price: [{
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
            required: false
        }
    }],
    notes: [{
        note: {
            type: String
        },
        simpleHWman_id: {
            type: Schema.Types.ObjectId, ref: 'SimpleHWman', required: true
        }}
    ],
    neverShowedUp: {
        type: Boolean,
        required: true
    },
    paid: {
        type: Boolean,
        required: true
    },
    damagedProduct: {
        type: Boolean,
        required: true
    },
    companies: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;