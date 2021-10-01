const { Schema, model } = require("mongoose");

const schema = new Schema(
	{
		userName: { type: String, required: true },
		doctorName: { type: String, required: true },
		date: { type: String, required: true },
		complains: { type: String, required: true },
	},
	{ collection: "items" }
);

module.exports = model("Item", schema);
