const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//defining schema
const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    conformPassword: {
        type: String,
        //required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//Authentication part
//here we will use methods because we are working on instances not on complete model
customerSchema.methods.getToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, "thisisourfirstprojectinsoftwareengineering");
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (e) {
        //res.send(e);
        console.log("Error in generating token:", e);
    }
}

//encryption using bcrypt
customerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.conformPassword = await bcrypt.hash(this.password, 10);
        this.conformPassword = undefined;
    }
    next();
})


const Register = new mongoose.model("Register", customerSchema);
module.exports = Register;