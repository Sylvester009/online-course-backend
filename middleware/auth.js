const User = require('../models/User');
const jwt = require('jsonwebtoken');

//check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    //make sure token exist
    if (!token) {
        res.status(401).json({
            "error": "Kindly login to access this endpoint"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.user = await User.findById(decoded.id);
        if (!req.user){
            res.status(404).json({
                "error": "No user found"
            });
        }
        next()
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

//middleware to check admin
exports.isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        res.status(401).json({
            "error": "Only Admins can access"
        });
        //return next(new ErrorResponse("Only Admins can access", 401))
    }
    next();
};