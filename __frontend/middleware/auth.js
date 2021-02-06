module.exports = async (req, res, next) => {
    try{
        if (!req.session || !req.session.user) throw "No connected"
        else next()
    }catch(err){
        res.redirect('/member/login')
    }
};