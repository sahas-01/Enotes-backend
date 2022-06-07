const router = require('express').Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

//Creating the user
router.post('/', [

    body('name', 'Name is required').isLength({ min: 3 }),
    body('email', 'Invalid email, please enter a valid email address').isEmail(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        let salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securedPassword
        });
        const payload = {
            user: {
                id: user.id
            }
        };
        console.log(payload.id);
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.status(201).json({ authToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }

});


//Authenticating the user and generating the token

router.post('/login', [
    body('email', 'Invalid email, Please enter a valid email address').isEmail(),
    body('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Login with proper credentials please' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Login with proper credentials please' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.status(200).json({ authToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/getuser', fetchUser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;