
function viewEdit(id, texte){
    document.getElementById(`edit-${id}`).innerHTML = `<form action="/member/messages-prives/update/${id}" method="POST">
                                                          <textarea id = "content" class="form-control" placeholder="Votre réponce"cols="30" rows="5" name="contentEdit">${texte}</textarea>
                                                          <button type="submit" class="button button-success" id="send">Mettre a jour</button>
                                                          </form>`
    }

window.onload = function(){
    const tabURL = window.location.href.split('/').reverse()
    const page = window.location.href.split('/').reverse()[1]
    const channel = window.location.href.split('/').reverse()[0]
    const pageSuivante = parseInt(page) + 1
    const pagePrecedente = parseInt(page) - 1
    document.getElementById("suivant").setAttribute("href", `/member/messages-prives/channel/page/${pageSuivante}/${channel}`)
    document.getElementById("precedent").setAttribute("href", `/member/messages-prives/channel/page/${pagePrecedente}/${channel}`)
}