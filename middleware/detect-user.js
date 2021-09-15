const User = require('../models/userModel');
module.exports = (req, res, next) => {
    res.locals.session = req.session;
    if (!req.session.passport) {
        return next();
    }
    User.findById(req.session.passport.user)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err); //k hay
            // next(); // bo qua loi va tiep tuc khong lam dung chuong trinh
        });
}