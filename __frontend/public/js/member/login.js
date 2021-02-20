const URL = window.location.href.split('=')
window.onload = function(){
    if(URL[1] === "banned"){
        document.getElementById('error').innerHTML = "<p class='alert alert-danger'>Vous avez été banni !</p>"
    }
}