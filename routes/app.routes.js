const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Item = require("../models/Item");
const router = Router();


////////////////
// TABLE DATA ////
////////////////

router.get("/totalItems", (req, res) => {
	try {
		const data = User.find().then(result => {
			res.json(result)
		})
	} catch (err) {
		console.log(err);
		res.json('Что-то пошло не так. Лог в консоли')
	}
})



////////////////////////
// USER AUTHORIZATION ////
////////////////////////


router.post("/checkToken", async (req, res) => {
	try {
		const {authToken, userId} = req.body;
		if(jwt.decode(authToken).userId === userId) res.json({valid: true})
	} catch (err) {
		res.json({ valid: false });
	}
})

router.post(
	"/register",
	[
		check("email", "Некорректный email").isEmail(),
		check("password", "Минимальная длина пароля 6 символов").isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Некорректные данные при регистрации",
				});
			}

			const { email, password } = req.body;

			const candidate = await User.findOne({ email });

			if (candidate) {
				return res
					.status(400)
					.json({ message: "Такой пользователь уже существует" });
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({ email, password: hashedPassword });

			await user.save();

			const userData = await User.findOne({ email });
			const token = jwt.sign({ userId: userData.id }, config.get("jwtSecret"), {
				expiresIn: "1h",
			});

			res.status(201).json({ token: token });
		} catch (err) {
			res
				.status(500)
				.json({ message: "Что-то пошло не так, попробуйте снова." });
		}
	}
);

router.post(
	"/login",
	[
		check("email", "Введите корректный email").normalizeEmail().isEmail(),
		check("password", "Введите пароль").exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Некорректные данные при входе в систему",
				});
			}

			const { email, password } = req.body;

			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: "Пользователь не найден" });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ message: "Неверный пароль, попробуйте снова" });
			}

			const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
				expiresIn: "1h",
			});

			res.json({ token, userId: user.id });
		} catch (err) {
			res
				.status(500)
				.json({ message: "Что-то пошло не так, попробуйте снова." });
		}
	}
);

module.exports = router;
