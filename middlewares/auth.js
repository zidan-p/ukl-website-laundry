let auth = {
    auth_Login : async (req, res, next) => {
        // console.log(req.session.isLogin)

        if((req.session.isLogin == false) || (req.session.isLogin == null)){
            console.log('auth untuk login -------->')
            res.redirect('/login');
            return false
        }

        console.log("untuk banding dengan false"+(req.session.isLogin == false));
        console.log('untuk banding dengan null'+(req.session.isLogin == null))
        console.log("cek session ==================>")
        console.log(req.session)

        next();
    },
    auth_hasLogin : async (req, res, next) => {
        console.log("cek untuk auth sudah login")
        console.log(req.session)
        if(req.session.isLogin){
            res.redirect('/app/')
            
        }else{
            next();
        }
    }
}

module.exports = auth

