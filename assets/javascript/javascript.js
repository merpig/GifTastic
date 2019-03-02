// The default set of meme themes
var themes = [
    "Soccer",
    "Gaming",
    "Food",
    "Sleep",
    "School",
    "Water",
    "Moth",
    "Dog",
    "Cat",
    "Bird",
    "Bug",
    "iPhone"
];

// Holds favorited gifs
var favorites = [];

// api variables
var apiKey = "api_key=QCUadDTpWvHZzMUjNKjEqKCvZvOKcy9O&limit=1&tag=";
var queryURL ="https://api.giphy.com/v1/gifs/random?";

// gif counter to ensure unique id's
var gifCount = 0;

// Contains the ajax call for giphy api.
// **Placed outside $(document).ready(...) so that new elements can access func
function giphyThemes(element) {
    var btnTheme = $(element).text().toLowerCase();
    $.ajax({
        url: (queryURL+apiKey+btnTheme),
        method: "GET"
    }).then(function(response) {
        console.log(response);
        gifCount++;
        var giphyLink = response.data.image_url;
        var giphyTitle= response.data.title;
        var uniqueId = "gif" + gifCount;
        var gifDiv = $(".giphyDiv");
        var gifRap = $("<div class='row parent'>");
        var favDiv = $("<div class='col-sm-3 text-center favDiv'>");
        var imgDiv = $("<div class='col-sm-9 imgDiv'>").text(giphyTitle);
        var imgTag = $("<img>").attr(
            {   
                "src"   : giphyLink,
                "class" : "favCheckBox",
                "id"    : uniqueId
            });
        var favBtn = $("<div class='starDiv'><input class='star' onclick='fav(this)' type='checkbox' name='favorite' value='" + uniqueId + "'></div>");
        var savBtn = $("<div class='saveDiv'><button id='" + giphyLink + "'onclick='downLoad(this)'> <i class='fa fa-download' ></i></button></div>")
        favDiv.append(favBtn);
        favDiv.append(savBtn);
        gifRap.append("<hr>");
        gifRap.append(favDiv);
        gifRap.append(imgDiv.append(imgTag));
        gifDiv.prepend(gifRap);
    });  
}

function downLoad(element){
    $.ajax({
        url: element.id,
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = element.id;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    });
}

// Allows use to favorite and save images in local storage
// **Placed outside $(document).ready(...) so that new elements can access func
function fav(element){
    event.preventDefault();
    var imgID = $(element).val();
    var imgTag = $("#" + imgID)[0];
    imgSrc = imgTag.src
    if(!localStorage.getItem(imgSrc)){
        localStorage.setItem(imgSrc,imgSrc);
        favorites.push(imgSrc);
        localStorage.setItem("favoriteList",JSON.stringify( favorites ));
        $(".gifFavDiv").prepend("<img src='" + imgSrc + "'>");
    }
}

// Function to display any favorited gifs
function generateFavs(){
    if(localStorage.getItem("favoriteList")){
        favorites = JSON.parse(localStorage.getItem("favoriteList"));
        $.each(favorites, function(i){
            $(".gifFavDiv").prepend("<img src='" + favorites[i] + "'>");
        });
    }
}

$(document).ready(function() {
    
    // generate fav gifs
    generateFavs();
    
    // Function to create buttons
    function generateBtns(arr){
        for(var i = 0; i < arr.length; i++){
            var themeBtnsDiv = $(".theme-btns");
            var tempBtn;
            if(arr.length>1)
                tempBtn = $("<button>")
                    .attr({
                        "class"   : "btn btn-default btnStyle",
                        "onclick" : "giphyThemes(this)"
                        })
                    .text(arr[i]);
            else
                tempBtn = $("<button>")
                    .attr({
                        "class"   : "btn btn-default btnStyle",
                        "onclick" : "giphyThemes(this)"
                        })
                    .text(arr[i]);     
            themeBtnsDiv.prepend(tempBtn);
        }
    }

    // generate buttons
    generateBtns(themes);

    // onclick event to add a new button for new themes
    $("#add-theme").on("click", function(event) 
    {
        event.preventDefault(); 
        var inputTheme = $("#input-theme");
        var newTheme = [inputTheme.val()];       
        if(newTheme[0] !== ""){
            themes.push( newTheme );
            generateBtns(themes[themes.length-1]);
        }
        inputTheme.val("");
    });
})