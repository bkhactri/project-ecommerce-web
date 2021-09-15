exports.render404ForUser = async (req, res, next) => {
    return res.status(404).render('404-User', {
        pageTitle: 'Page Not Found',
        path: '',
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
    });
};

exports.render404ForAdmin = (req, res, next) => {
    res.status(404).render('404-Admin', {
        pageTitle: 'Page Not Found',
        path: ''
    });
}