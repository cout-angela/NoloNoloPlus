const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
module.exports = Company;