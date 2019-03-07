exports.get404 = (req,res)=>{
    // path di sini hanya tambahan info
    // bukan path url
    // itu ada di routes or app.js
    res.status(404).render('404', {docTitle: 'not found', path:''});
};
