const User = require('../models/User');


//load all users
exports.allUsers = async (req, res, next) => {
    // enable pagination
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();
    try {
        const users = await User.find().sort({ createdAt: -1}).select('-password')
            .skip(pageSize * (page-1))
            .limit(pageSize)

        res.status(200).json({
            success: true,
            data: users,
            page,
            pages: Math.ceil(count / pageSize),
            count
        })
        next();
    } catch (error) {
        return next(error);
    }
}


// load single-user by id
exports.singleUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: user
        })
        next();
    } catch (error) {
        return next(error);
    }
}

//edit user
exports.editUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .select('-password');
        res.status(200).json({
            success: true,
            data: user
        })
        next()
    } catch (error) {
        return next(error);
    }
}

//delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "user deleted successfully"
        })
        next()
    } catch (error) {
        return next(error);
    }
}