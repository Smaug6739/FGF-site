
window.onload = function(){
    let page = window.location.href.split('/').reverse()[0]
    const pageSuivante = parseInt(page) + 1
    const pagePrecedente = parseInt(page) - 1
    document.getElementById("suivant").setAttribute("href", `/member/album/${pageSuivante}`)
    document.getElementById("precedent").setAttribute("href", `/member/album/${pagePrecedente}`)
}