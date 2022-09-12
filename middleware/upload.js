const multer = require("multer");
const {GridFsStorage} = require('multer-gridfs-storage');
const dbString = require('../dbString')

const storage = new GridFsStorage({
    url: dbString,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {

        return {
            bucketName: "imgs",
        };
    },
});

module.exports = multer({ storage });