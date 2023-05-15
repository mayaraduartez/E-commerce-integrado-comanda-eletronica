module.exports = function(req,res,next){
  console.log(req.user)
  if(req.isAuthenticated()&&req.user.admin==true){
    return next();
  }
  res.redirect('/menu');
}



