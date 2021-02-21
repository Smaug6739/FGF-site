window.onload = function(){
    let page = window.location.href.split('/').reverse()[0]
    const pageSuivante = parseInt(page) + 1
    const pagePrecedente = parseInt(page) - 1
    document.getElementById("suivant").setAttribute("href", `/admin/articles/${pageSuivante}`)
    document.getElementById("precedent").setAttribute("href", `/admin/articles/${pagePrecedente}`)
    const URL = window.location.href.split('?')
    if(URL[1] === "success=random"){
        console.log(true)
        document.getElementById('statut').innerHTML = "<br><p class='alert alert-success'>Un article vient d'etre créer.</p>"
    }
    if(URL[1] === "error=random"){
        document.getElementById('statut').innerHTML = "<br><p class='alert alert-danger'>Aucun utilisateur éligible.</p>"
    }


    }