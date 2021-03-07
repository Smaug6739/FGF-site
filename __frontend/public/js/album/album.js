
window.onload = function(){
    let page = window.location.href.split('/').reverse()[0]
    const pageSuivante = parseInt(page) + 1
    const pagePrecedente = parseInt(page) - 1
    document.getElementById("suivant").setAttribute("href", `/album/${pageSuivante}`)
    document.getElementById("precedent").setAttribute("href", `/album/${pagePrecedente}`)

    /* ALBUM */
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var imgs = document.getElementsByClassName("image")
    const imgsArray = Array.from(imgs)
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    imgsArray.forEach(function(img) {
    img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
    }
    });


    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }
}