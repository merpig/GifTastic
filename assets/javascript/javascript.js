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
var favoritesTags = [];

// api variables
var apiKey = "api_key=m9Tkfcf0aYqCDBLLxrx9C3429jX4IH4x&limit=1&tag=";
var queryURL ="https://api.giphy.com/v1/gifs/random?";

// gif counter to ensure unique id's
var gifCount = 0;

//Before working on this function, make sure to add appropriate tags to achieve sorting
 function organizeBy(myStr){
     console.log(myStr);
  }

// Contains the ajax call for giphy api.
// **Placed outside $(document).ready(...) so that new elements can access func
function giphyThemes(element) {
    var btnTheme = $(element).text().toLowerCase();
    $.ajax({
        url: (queryURL+apiKey+btnTheme),
        method: "GET"
    }).then(function(response) {
        //console.log(response);
        gifCount++;
        
        var giphyLink = response.data.image_url;
        var giphyTitle= response.data.title;
        var giphyDateC= response.data.import_datetime.slice(0,10)
                                                     .replace("-", "")
                                                     .replace("-", "");
        var giphyTimeC= response.data.import_datetime.slice(-8)
                                                     .replace(":", "")
                                                     .replace(":", "");
        //console.log(giphyDateC);
        //console.log(giphyTimeC)
        var uniqueId = giphyTitle.replace(/\s/g,'');
        var gifDiv = $(".giphyDiv");
        var gifRap = $("<div class='row parent'>");
        var favDiv = $("<div class='col-sm-3 text-center favDiv'>");
        var imgDiv = $("<div class='col-sm-9 imgDiv'>").text(giphyTitle);
        var imgTag = $("<img>").attr(
            {   
                "src"   : giphyLink,
                "class" : "favCheckBox",
                "id"    : uniqueId,
                "gifTitle" : giphyTitle,
                "theme" : btnTheme,
                "dateC"  : giphyDateC,
                "timeC"  : giphyTimeC
            });
        var favBtn = $("<div class='starDiv'><input class='star' onclick='fav(this)' type='checkbox' name='favorite' value='" + uniqueId + "'></div>");
        var savBtn = $("<div class='saveDiv'><button id='" + giphyLink + "'onclick='downLoad(this)'> <i class='fa fa-download' ></i></button></div>");
        var delBtn = $("<div class='delDiv'><button onclick='deleteGif(this)'><i class='fa fa-trash'></i></button></div>");
        favDiv.append(favBtn);
        favDiv.append(savBtn);
        favDiv.append(delBtn);
        gifRap.append("<hr>");
        gifRap.append(favDiv);
        gifRap.append(imgDiv.append(imgTag));
        gifDiv.prepend(gifRap);
        gifDiv.show();
        
    }); 
    $(".giphyDiv").scrollTop(0); 
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
            console.log("Gif downloaded")
        }
    });
}

// Allows user to favorite and save images in local storage
// **Placed outside $(document).ready(...) so that new elements can access func
function fav(element){
    event.preventDefault();
    var imgID = $(element).val();
    var imgTag = $("#" + imgID)[0];
    //console.log(imgTag);
    imgSrc = imgTag.src

    var favTitle = $("#" + imgID).attr("gifTitle"); // To be saved at index 0 of favoritesTags
    var favTheme = $("#" + imgID).attr("theme");    // To be saved at index 1 of favoritesTags
    var favDateC = $("#" + imgID).attr("dateC");    // To be saved at index 2 of favoritesTags
    var favTimeC = $("#" + imgID).attr("timeC");    // To be saved at index 3 of favoritesTags

    
    var today = new Date();
    var month0 = "";
    var day0 = "";

    if(today.getMonth()+1 < 10) month0 += 0;
    if(today.getDate()+1 < 10) day0 += 0;
    var dateAdded = today.getFullYear()+ month0 + (today.getMonth()+1) + day0 + today.getDate(); // To be saved at index 4 of favoritesTags
    var timeAdded = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();        // To be saved at index 5 of favoritesTags
    
    favoritesTags.push([favTitle,favTheme,favDateC,favTimeC,dateAdded,timeAdded]);

    localStorage.setItem("favoriteTagList",JSON.stringify( favoritesTags ));

    if(!localStorage.getItem(imgSrc)){
        favorites.push(imgSrc);
        localStorage.setItem("favoriteList",JSON.stringify( favorites ));
        var favChild = $("<div class='favChild'>");
        favChild.append($("<img src='" + imgSrc + "'>"));
        favChild.prepend($("<i class='fa fa-window-close' aria-hidden='true' onclick='deleteBtn(this)'></i>"));
        $(".gifFavDiv").prepend(favChild);
    }
    $(".gifFavDiv").scrollTop(0);
    console.log("Gif favorited");
}

function deleteGif(element){
    
    $(element).parent().parent().parent().remove();
    console.log("Gif deleted");
}

// Deletes the buttons!
// Also used to removes favorites as parent distance from child is the same
function deleteBtn(element){
    var tempParent = $(element).parent();
    var tempGif;
    var tempClassName = tempParent[0].className;
    var tempStr = "Theme button (" + $(element).parent().children().text() + ") ";
    if(tempClassName === "favChild"){
        tempStr = "Favorited gif "
        tempGif = tempParent.children('img')[0].currentSrc;
        $.each(favorites, function(i){
            if(favorites[i]===tempGif) {
                favorites.splice(i,1);
                favoritesTags.splice(i,1);
                localStorage.setItem("favoriteList",JSON.stringify( favorites ));
                localStorage.setItem("favoriteTagList",JSON.stringify( favoritesTags ));
            }
        });
    }
    $(element).parent().remove();
    console.log(tempStr + "deleted");
}

// Function to display any favorited gifs
function generateFavs(){
    if (!localStorage.getItem("favoriteList")) console.log("No saved favorites to load");
    else if(localStorage.getItem("favoriteList")){
        favorites = JSON.parse(localStorage.getItem("favoriteList"));
        if(favorites.length===0){
            console.log("No saved favorites to load"); 
            return;
        }
        //console.log(favorites.length===0);
        $.each(favorites, function(i){
            
            var favChild = $("<div class='favChild'>");
            favChild.append($("<img src='" + favorites[i] + "'>"));
            favChild.prepend($("<i class='fa fa-window-close' aria-hidden='true' onclick='deleteBtn(this)'></i>"));
            $(".gifFavDiv").prepend(favChild);
            console.log("Saved favorites loaded");
        });

    }
    
}

$(document).ready(function() {
    
    // generate fav gifs
    generateFavs();
    
    // Function to create buttons
    function generateBtns(arr){
        var tempBtnStr = "Theme button(s) added: ";
        for(var i = 0; i < arr.length; i++){
            var themeBtnsDiv = $(".theme-btns");
            var themeBtnDiv = $("<div class='themeBtnDiv'>");
            var tempBtn;
            
            if(arr.length>1){
                tempBtnStr += ", " + arr[i];
                tempBtn = $("<button>")
                    .attr({
                        "class"   : "btn btn-default btnStyle",
                        "onclick" : "giphyThemes(this)"
                        })
                    .text(arr[i]);
                
            }
            else{
                tempBtnStr += arr[i];
                tempBtn = $("<button>")
                    .attr({
                        "class"   : "btn btn-default btnStyle",
                        "onclick" : "giphyThemes(this)"
                        })
                    .text(arr[i]);
            }
            
            themeBtnDiv.prepend(tempBtn);
            themeBtnDiv.prepend($("<i class='fa fa-window-close' aria-hidden='true' onclick='deleteBtn(this)'></i>"));
            themeBtnsDiv.prepend(themeBtnDiv);
        }
        console.log(tempBtnStr);
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

    $("#input-theme").keypress(function(event){
        if(event.keyCode === 13 || event.which ===13){
            $("#add-theme").trigger("click");

        }

    });
})