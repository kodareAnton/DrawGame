var express = require('express');
var router = express.Router();
var ImageModel = require("../models/ImageModel")



router.post("/", async (req, res) => {
    console.log("body" + req.body)
    const image = new ImageModel(req.body);
    await image.save();

    res.status(201).json(image);
});

router.get("/", async (req, res) => {
    try {
        const images = await ImageModel.find()
        res.json(images);
        res.send(images);
    } catch (error) {
        console.log(error)
    }

})

module.exports = router;
