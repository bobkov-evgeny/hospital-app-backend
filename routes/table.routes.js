const { Router } = require("express");
const Item = require("../models/Item");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = Router();



router.get("/totalItems", (req, res) => {
    try {
        const data = Item.find()
        res.send({data: data})
    } catch (err) {
        console.log(err);
        res.json('Что-то пошло не так. Лог в консоли')
    }
})

router.post("/saveItem", async (req, res) => {
    try {
        const { name, doctor, date, complains } = req.body;
        const item = new Item({ name, doctor, date, complains });
        await item.save();

    } catch (err) {

    }
})
