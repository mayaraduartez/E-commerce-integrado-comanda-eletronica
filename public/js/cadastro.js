const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  var elemento = document.getElementById("cadastr");
  if (elemento){
  event.preventDefault();
  var password = document.getElementById("senha");
  var regex =
    /^(?=(?:.*?[A-Z]){1})(?=(?:.*?[0-9]){1})(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%;*(){}_+^&]*$/;

    if (password.value.length < 8) {
      alert("A senha deve conter no minímo 8 digitos!");
      password.focus();
      return false;
    } else if (!regex.exec(password.value)) {
      alert(
        "A senha deve conter no mínimo 1 caracter em maiúsculo, 1 número e 1 caracter especial!"
      );
      password.focus();
      return false;
    } else {
      form.submit();
    }
  
}
});
