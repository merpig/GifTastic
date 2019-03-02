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



var apiKey = "api_key=m9Tkfcf0aYqCDBLLxrx9C3429jX4IH4x&limit=1&tag=";
var queryURL ="http://api.giphy.com/v1/gifs/random?";

function giphyThemes(element) {
    var btnTheme = $(element).text();

    $.ajax({
        url: queryURL+apiKey+btnTheme,
        method: "GET"
    }).then(function(response) {

        giphyLink = response.data.image_url;
        var gifDiv = $(".giphyDiv");
        var imgTag = $("<img>").attr("src", giphyLink);
        gifDiv.append(imgTag);
    });  
}

$(document).ready(function() {
    

    // The default set of meme themes

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
            
            themeBtnsDiv.prepend(tempBtn).append($("<br>"));

        }
    }

    generateBtns(themes);

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

