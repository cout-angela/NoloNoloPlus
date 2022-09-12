const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();

router.post("/upload", upload.array("imgs"), async (req, res) => {
    if (req.files === undefined) return res.json({ command : 'logErr' , msg : 'noFilesReceived'});
    var imgUrl = [];
    for (let i = 0; i < req.files.length; i++) {
        imgUrl.push(req.files[i].filename);
    }
    return res.json(imgUrl);
});

module.exports = router;