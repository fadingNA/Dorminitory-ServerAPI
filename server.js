const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

/*Json Web token Setup */
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = process.env.JWT_SECRET;


// tell passport to use our "strategy"

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    if (jwt_payload) {
        next(null, {
            _id: jwt_payload._id,
            userName: jwt_payload.userName,
            passWord: jwt_payload.passWord,
        });
    } else {
        next(null, false);
    }
});

app.use(passport.initialize());

passport.use(strategy);


app.post('/api/user/login', function (req, res) {
    userService.checkUser({
        userName: req.body.userName, passWord: req.body.passWord
    }).then(user => {
        const payload = {
            _id: user._id,
            userName: user.userName
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.json({
            message: "Login successfully",
            token: token
        });
    }).catch((err) => {
        res.status(401).json({
            error: "Invalid credentials"
        });
    });
});

app.post('/api/user/register', function (req, res) {
    userService.registerUser(req.body).then((msg) => {
        res.json({
            "message": msg
        })
    }).catch((msg) => {
        res.status(422).json({
            "message": msg + "from register"
        });
    });
});
app.get('/api/user/favourite', function (req, res) {
    userService.getFavourite(req.user._id).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(422).json({error: err});
    })
})