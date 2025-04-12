exports.matchLogin = (req, res, path) => {
    const cookieData = req?.cookies?.admin
    console.log(cookieData)
    if (!cookieData) {
        res.redirect('/login')
    } else {
        res.render(path)
    }
}