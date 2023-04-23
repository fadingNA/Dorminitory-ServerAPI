const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let mongoDBConnectionString = process.env.MONGO_URL;

let Schema = mongoose.Schema;

let userSchema = new Schema({
    userName: {
        type: String, unique: true
    }, passWord: String, favourites: [String], history: [String],
});
let User;

module.exports.connect = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString);
        db.on('error', err => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

modeule.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.passWord !== userData.passWord2) {
            reject("Password do not match");
        } else {
            bcrypt.hash(userData.password, 10).then(hash => {
                userData.passWrod = hash;
                let newUser = new User(userData);
                newUser.save().then(() => {
                    resolve("user " + userData.userName);
                }).catch(err => {
                    if (err.code === 11000) {
                        reject("User Name already taken");
                    } else {
                        reject("There was an error creating user");
                    }
                })
            }).catch(err => (reject(err)))
        }
    });
};

module.exports.getFavourites = function (id) {
    return new Promise(function (resolve, reject) {
        user.findById(id).exec().then(user => {
            resolve(user.favourites);
        }).catch(err => {
            reject(`Unable to get favourite for user`)
        })
    })
}

module.exports.addFavourite = function (id, favId) {
    return new Promise(function (resolve, reject) {
        User.findById(id).exec().then(user => {
            if (user.favourites.length < 50) {
                User.findByIdAndUpdate()
            }
        })
    })
}