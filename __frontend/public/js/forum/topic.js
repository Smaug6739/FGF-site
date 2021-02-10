let page = window.location.href.split('/').reverse()[0]
let topic = window.location.href.split('/').reverse()[1]

if(page.includes('#')) {
  page = window.location.href.split('/').reverse()[1]
  topic = window.location.href.split('/').reverse()[2]
}
const pageSuivante = parseInt(page) + 1
const pagePrecedente = parseInt(page) - 1
document.getElementById("suivant").setAttribute("href", `/forum/topic/${topic}/${pageSuivante}`)
document.getElementById("precedent").setAttribute("href", `/forum/topic/${topic}/${pagePrecedente}`)
function viewEdit(id, texte){
document.getElementById(`edit-${id}`).innerHTML = `<form action="/forum/message/update/${id}" method="POST">
                                                      <textarea id = "content" class="form-control" placeholder="Votre réponce"cols="30" rows="5" name="contentEdit">${texte}</textarea>
                                                      <button type="submit" class="btn btn-success" id="send">Poster</button>
                                                      </form>`
}
function report(topicId, id) {
  if(!id) id = 0
  document.getElementById(id).innerHTML = '<div class="alert alert-success report-message" role="alert"> Le message à été reporté ! </div>'
  fetch(`/forum/report/topic/${topicId}/${page}/${id}`)
}