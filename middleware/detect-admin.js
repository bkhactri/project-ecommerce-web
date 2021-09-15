const Admin = require('../models/adminModel');
module.exports = (req, res, next) => {
    res.locals.session = req.session;
    if (!req.session.passport) {
        return next();
    }
    Admin.findById(req.session.passport.user)
        .then(user => {
            if (!user) {
                return next();
            }
            req.admin = user;
            next();
        })
        .catch(err => {
            throw new Error(err); //k hay
            // next(); // bo qua loi va tiep tuc khong lam dung chuong trinh
        });
}