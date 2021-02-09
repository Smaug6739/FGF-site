window.onload = function(){
    let page = window.location.href.split('/').reverse()[0]
    let categorie = window.location.href.split('/').reverse()[1]
    const pageSuivante = parseInt(page) + 1
    const pagePrecedente = parseInt(page) - 1
    document.getElementById("suivant").setAttribute("href", `/forum/categorie/${categorie}/${pageSuivante}`)
    document.getElementById("precedent").setAttribute("href", `/forum/categorie/${categorie}/${pagePrecedente}`)
}