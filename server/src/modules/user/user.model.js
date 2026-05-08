const express = require("express");
const mongoose = require("mongoose")
const router = express.Router();

const userSchema = new mongoose.Schema({
name: {
    type: String,
    required: [true, "Please provide name"],
    trim: true,
    minlength: 3
},

email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
},

password: {
    type: String,
    required: true,
    minlength: 6,
},

role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
},

verificationToken: { type: String},

isVerified: {
    type: Boolean,
    default: false
},

verified: { type: Date},

passwordToken: { type: String},
passwordTokenExpirationDate: { type: Date},
},

{ timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);