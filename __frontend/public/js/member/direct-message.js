
function viewEdit(id, texte){
    document.getElementById(`edit-${id}`).innerHTML = `<form action="/member/messages-prives/update/${id}" method="POST">
                                                          <textarea id = "content" class="form-control" placeholder="Votre réponce"cols="30" rows="5" name="contentEdit">${texte}</textarea>
                                                          <button type="submit" class="btn btn-success" id="send">Mettre a jour</button>
                                                          </form>`
    }