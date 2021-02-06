function preview_image(event) 
{
    var reader = new FileReader();
    reader.onload = function()
{
    var output = document.getElementById('miniature-form');
    output.src = reader.result
//output.setAttribute("src",`${output.result}`)

}
    reader.readAsDataURL(event.target.files[0]);
}