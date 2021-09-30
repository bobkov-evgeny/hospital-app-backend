const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json({ extended: true }));
app.use(cors({
	origin: 'http://localhost:4200'
}))

app.use("/", require("./routes/app.routes"));



async function start() {
	try {
		await mongoose.connect(config.get("mongoUri"), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		app.listen(5000, () =>
			console.log(`App has been started on port 5000...`)
		);
	} catch (err) {
		console.log("Server Error", err.message);
		process.exit(1);
	}
}

start();
