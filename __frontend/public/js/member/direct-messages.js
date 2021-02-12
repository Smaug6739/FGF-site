const search_bar = document.getElementById('search')


// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;






inputBox.onkeyup = (e)=>{
    let userData = e.target.value;
    let emptyArray = [];
    if(userData){
      $.post("http://localhost:8080/api/v1/members/search", {
            search:userData
        }, function(data) {
        if(data) {
              emptyArray = data.result.filter((data)=>{
              return data.member_pseudo.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
          });
              emptyArray = emptyArray.map((data)=>{
              return data = '<li>'+ data.member_pseudo +'</li>';
          });
            searchWrapper.classList.add("active"); //show autocomplete box
            showSuggestions(emptyArray);
            let allList = suggBox.querySelectorAll("li");
            for (let i = 0; i < allList.length; i++) {
                allList[i].setAttribute("onclick", "select(this)");
            }
          }
        }, "json")
        
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    searchWrapper.classList.remove("active");
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}


