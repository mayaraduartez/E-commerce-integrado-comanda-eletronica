var senha = document.getElementById('senha');
var olho= document.getElementById("olho")

olho.addEventListener('mousedown', function() {
  senha.setAttribute("type", "text");
  console.log('mouseover');
});


olho.addEventListener('mouseup', function() {
  senha.setAttribute("type", "password");
  console.log('mouseout');
});
