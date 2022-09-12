const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    products: [{
        imgs: [String],
        price: {
            base: {
                type: Number,
                required: true
            },
            modifiers: [
                {
                    reason: {
                        type: String
                    },
                    sign: {
                        type: String
                    },
                    quantity: {
                        type: Number
                    },
                    apply: {
                        type: String
                    }
                }
            ],
            fidelity: {
                type: Number,
                required: false
            }
        },
        condition: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: true
        },
        maintenance: {
            type: Date,
        }
    }],
    disabled: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    company: {
        type: String, required: true
    }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;