module.exports = function(req,res,next){
  
  if(req.isAuthenticated()&&req.user.admin==true){
    return next();
  }
  res.redirect('/menu');
}



