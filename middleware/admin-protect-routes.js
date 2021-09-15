module.exports = (req, res, next) => {
    if (req.url == '/') {
        req.session.oldUrl = '/admin'
    } else {
        req.session.oldUrl = '/admin' + req.url;
    }
    if (!req.admin) {
        return res.redirect("/admin/login");
    }
    next();
};