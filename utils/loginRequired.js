module.exports = async (req, res, next) => {
    if(! req.isAuthenticated()){
        req.session.redirectTo = req.params.id;
        return res.redirect('/login')
    }
    next();
}

