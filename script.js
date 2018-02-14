///////////////////////////////
//  javascript for XRI Therapy
//
/////////////////////////////

var mousedownOnDot = 0;  // Global ID of mouse down interval
var zoom = 0
var lock = 0;
var locksize = 0;

//------------------------------------------------------------------------------
// Open the option nagivation bar
function openNav() {
    var Navvar = document.getElementById("mySidenav").style.width;
    document.getElementById("options").value = "Close";
    if (Navvar != "250px") {
        document.getElementById("mySidenav").style.width = "250px";
    }
    else {
        document.getElementById("mySidenav").style.width = "0px";
        document.getElementById("options").value = "Options";
    }
}

//------------------------------------------------------------------------------
// Closes the option nav
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("options").value = "Options";
}

//------------------------------------------------------------------------------
// Locks the dot in place
function lockplace() {
    if (lock == 0) {
        lock = 1;
        document.getElementById("LockP").innerHTML = "Move Dots:Off";
    }
    else {
        lock = 0;
        document.getElementById("LockP").innerHTML = "Move Dots:On";
    }
}

//------------------------------------------------------------------------------
// Lock the size of the dots in place
function Locksize() {
    if (locksize == 0){
        locksize = 1;
        document.getElementById("LockS").innerHTML = "Change Dot Size:Off";
    }
    else {
        locksize = 0;
        document.getElementById("LockS").innerHTML = "Change Dot Size:On";
    }
}

//------------------------------------------------------------------------------
// When the enter key is click go to that page
function enterPressed(event) {
    if (event.keyCode == 13) {
        goButtonClicked();
    }
}

//------------------------------------------------------------------------------
// Gets boolean value for zooming in or out and modifies page accordingly
function handleZooming(zoomIn) {
    var page = document.getElementById("page");
    if (zoomIn) {
        zoom++
    } else {
        zoom--
    }
    page.setZoomLevel(zoom);
}
//------------------------------------------------------------------------------
// Auto complete search bar
function getAutoCompleteTags(event) {
    // Get query URL for suggestions based upon given string
    var query = "http://suggestqueries.google.com/complete/search?client=chrome&q=" + document.getElementById("tags").value;

    // Initialize blob to get response
    var blob = null;

    // Initialize XML request and set its fields
    var xhr = new XMLHttpRequest();
    xhr.open("GET", query);
    xhr.responseType = "blob";

    // Define behavior of request upon loading data
    xhr.onload = function() {
        // Get response
        blob = xhr.response;

        // Initialize file reader to process response
        var myReader = new FileReader();

        // Define behavior once reader has been loaded
        myReader.addEventListener("loadend", function(e) {
            // Get string from reader
            var str = e.srcElement.result;

            // Process text response up to first '['
            var i = 1;
            var currChar = str[i];
            while (currChar != '[') {
                currChar = str[i++];
            }

            // Get next char after '['
            currChar = str[i++];

            // Create list for all autocomplete tags
            var taglist = [];

            // Create string to contain current tag
            var currTagString = "";

            // Add to current tag until ']' is read or 5 tags are found
            while (currChar != ']' && taglist.length < 5) {
                // Check for '"'
                if (currChar == '\"') {
                    // Check if there is another tag
                    if(str[i] == ',') {
                        taglist.push(currTagString);
                        i++;
                        currChar = str[i];
                        currTagString = "";
                    }
                    // Advance to the next character
                    else {
                        currChar = str[i++];
                    }
                }
                // Add char into tag string otherwise
                else {
                    currTagString = currTagString + currChar;
                    currChar = str[i++];
                }
            }

            // Set processed tags as autocomplete tags
            $("#tags").autocomplete({
                source: taglist
            });

            // Get automatically created autocomplete widget and color it white
            var autoCompleteList = document.getElementById("ui-id-1");
            autoCompleteList.style.backgroundColor = "white";
            autoCompleteList.style.zIndex = 3;
            });
            myReader.readAsText(blob);
    }
    xhr.send();
}

//------------------------------------------------------------------------------
// Create the length of the search bar
function changeAddressBarLength() {
    var buttonWidth = window.innerWidth*0.02;
    document.getElementById("backButton").style.width = buttonWidth + "px";
    document.getElementById("forwardButton").style.width = buttonWidth + "px";
    document.getElementById("home").style.width = buttonWidth + "px";
    document.getElementById("reload").style.width = buttonWidth + "px";
    document.getElementById("go").style.width = buttonWidth + "px";
    document.getElementById("options").style.width = buttonWidth + "px";
    document.getElementById("tags").style.width = (window.innerWidth * 0.8425) + "px";
}
//------------------------------------------------------------------------------
// Determine whether given positions and widths are valid
function checkBounds(dot1posx, dot2posx, posy, width, height, toAdd) {
    return (dot2posx + width < window.innerWidth) &&
           (dot1posx - toAdd > 0) && (posy + height < window.innerHeight)
           && (posy - toAdd > 0);
}
//------------------------------------------------------------------------------
// Catches click event on go button, get URL and give it to a nagivation function
function Search(){
    var urlre = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    if (urlre.test(document.getElementById("tags").value)) {
        document.getElementById("page").loadURL(document.getElementById("tags").value);
    } else {
        document.getElementById("page").loadURL(createSearchURL());
    }
}
//------------------------------------------------------------------------------
//searches for a particulr URL
function createSearchURL(){
    var tokens = (document.getElementById("tags").value).split(" ");
    var searchURL = "https://www.google.com/search?as_q=";
    for (var i = 0; i < tokens.length - 1; i++) {
        searchURL += tokens[i] + "+";
    }
    searchURL += tokens[tokens.length - 1];
    return searchURL;
}
//------------------------------------------------------------------------------
// Catches click event on back button and navigates back
function backButtonClicked() {
    var page = document.getElementById("page");
    if (page.canGoBack()) {
        page.goBack();
    }
}
//------------------------------------------------------------------------------
// Catches click event on refresh button and refreshes the page
function refreshButtonClicked() {
    var page = document.getElementById("page");
    page.stop();
    page.reload();
}
//------------------------------------------------------------------------------
// Catches click event on refresh button and refreshes the page
function goHomeButtonClicked() {
    var page = document.getElementById("page");
    page.stop();
    navigateTo("https://www.google.com/")
}
//------------------------------------------------------------------------------
//Naviagte to webpage specifed
function navigateTo(url) {
  //resetExitedState();
  document.querySelector('webview').src = url;
}
//------------------------------------------------------------------------------
function forwardButtonClicked() {
    var page = document.getElementById("page");
    if (page.canGoForward()) {
        page.goForward();
    }
}
//------------------------------------------------------------------------------
// To be called once upon loading the body; resizes the window and begins
// updating left side of browser
function onLoadTasks() {
    reLocateReSize();
    setInterval(updateCopy, 750);
}
//------------------------------------------------------------------------------
// Updates the image copy page on the left of the browser
function updateCopy() {
    var page = document.getElementById("page");
    page.capturePage(function(image) {
        var copypage = document.getElementById("copypage");
        var img = image.toDataURL();
        copypage.src = img;
    });
}
//------------------------------------------------------------------------------
// Increases or decreases size of dot when scrolled
function dotScrolled(event) {
    if(locksize == 0){
        var dot1 = document.getElementById("picture1");
        var dot2 = document.getElementById("picture2");

        // Value to augment both width and height of dots
        var toAdd = 0;

        // If scrolling up
        if (event.deltaY > 0) {
            toAdd = 3;
        // If scrolling down
        } else {
            toAdd = -3;
        }

        // Check if change goes out of bounds
        if (checkBounds(parseInt(dot1.style.left), parseInt(dot2.style.left),
                        parseInt(dot1.style.top), parseInt(dot1.style.width) + toAdd,
                        parseInt(dot1.style.height) + toAdd, toAdd)) {
            // Apply changes to dot size
            dot1.style.width = (parseInt(dot1.style.width) + toAdd) + "px";
            dot1.style.height = (parseInt(dot1.style.height) + toAdd) + "px";
            dot2.style.width = (parseInt(dot2.style.width) + toAdd) + "px";
            dot2.style.height = (parseInt(dot2.style.height) + toAdd) + "px";
        }
    }
}
//------------------------------------------------------------------------------
// Sets value indicating dot is being clicked
function dotClicked(event) {
    if(lock == 0){
        if (!mousedownOnDot) {
            if (event.target.id == "picture1") {
                mousedownOnDot = 1;
            } else {
                mousedownOnDot = 2;
            }
        }
    }
}
//------------------------------------------------------------------------------
// Sets value indicating dot is no longer being clicked
function dotReleased(event) {
     if (mousedownOnDot) {
         mousedownOnDot = 0;
     }
}
//------------------------------------------------------------------------------
// Modifies the dots' positions when mouse moves while clicking dot
function dotMoved(event) {
     if (mousedownOnDot) {
         var dot1 = document.getElementById("picture1");
         var dot2 = document.getElementById("picture2");

         // Get dots' position information
         var currDot1Left = parseFloat(dot1.style.left);
         var currDot1Top = parseFloat(dot1.style.top);
         var currDot2Left = parseFloat(dot2.style.left);
         var currDot2Top = parseFloat(dot2.style.top);

         // Delta value used to modify dots' positions
         var xdif = 0;
         var ydif = 0;

         /* Offset to make up for discrepancy in actual mouse position and
            the position given in event */
         var clickOffset = -parseInt(dot1.style.width)/2;

         // If dot 1 is being clicked
         if (mousedownOnDot == 1) {
             xdif = event.pageX - currDot1Left + clickOffset;
             ydif = event.pageY - currDot1Top + clickOffset;
         // If dot 2 is being clicked
         } else {
             xdif = event.pageX - currDot2Left + clickOffset;
             ydif = event.pageY - currDot2Top + clickOffset;
         }

         // Check if change goes out of bounds
         if (checkBounds(currDot1Left + xdif, currDot2Left + xdif,
                         currDot1Top + ydif, parseInt(dot1.style.width),
                         parseInt(dot1.style.height), 0)) {
             // Apply changes to position
             dot1.style.left = (currDot1Left + xdif) + "px";
             dot1.style.top = (currDot1Top + ydif) + "px";
             dot2.style.left = (currDot2Left + xdif) + "px";
             dot2.style.top = (currDot2Top + ydif) + "px";
         }
     }
}
//------------------------------------------------------------------------------
// Changes the location and size of dots based upon the window size
function reLocateReSize() {
     changeAddressBarLength();

     if (window.innerWidth < 1097 || window.innerHeight < 600) {
         window.resizeTo(1097,600);
     }

     var dot1 = document.getElementById("picture1");
     var dot2 = document.getElementById("picture2");

     /* Get information about window for calculating dots' positions and
        sizes */
     var x = window.innerWidth/4;
     var y = window.innerHeight/2;
     var x2 = x*3;
     // Get dot size from average of width and height
     var dotWidthHeight = (x + (y/2))/8;
     // Want the middle of dot at 1/4 point, not the left and top
     var offset = dotWidthHeight/2;
     // Offset to account for placement of left (image) side
     // TODO: Make this offset work for all window sizes
     var dot2offset = offset/6;

     // Place the first dot in the correct location and modify its size
     dot1.style.left = (x - offset) + "px";
     dot1.style.top = (y - offset) + "px";
     dot1.style.width = dotWidthHeight + "px";
     dot1.style.height = dotWidthHeight + "px";

     // Place the second dot in the correct location and modify its size
     dot2.style.left = (x2 - offset - dot2offset) + "px";
     dot2.style.top = (y - offset) + "px";
     dot2.style.width = dotWidthHeight + "px";
     dot2.style.height = dotWidthHeight + "px";
}
//------------------------------------------------------------------------------
