var express = require('express');
var cors  = require('cors');
var router = express.Router();
var ImageModel = require("../models/ImageModel")

router.use(cors());

/* Endpoints för galleriet */


// Spara bild

router.post("/", async (req, res) => {
    try {
        const image = new ImageModel(req.body);
        image.save();
        res.json("Bilden är uppe")
    } catch (error) {
        console.log("Något gick fel" + error)
    }
});

// Hämta alla bilder

router.get("/", async (req, res) => {
    try {
        const images = await ImageModel.find()
        res.json(images);
    } catch (error) {
        console.log(error)
    }

})

module.exports = router;
