'use strict';

// Function that makes 16 cards show up, randomly chosen from the _CARDS global variable. 
function createGrid(){
    // Shuffle and choose 8 cards, duplicate the cards to make 16, shuffle again
    var sample = _.sampleSize(_CARDS, 8);
    var cardSet = [];
    sample.forEach(function(card){
        cardSet.push(card);
        cardSet.push(card);
    });
    var cardSet = _.shuffle(cardSet);
    // Determine how large we'll make our cards based on screen size
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var cardWidth = windowWidth / 4;
    var cardHeight =  (windowHeight - $('header').height()) / 4 - 20;
    var grid = $('#grid');
    grid.empty(); // Clear the grid 
    var currentRowId = 1;
    var itemInRow = 0;
    $(grid).append("<span role=\"row\" id=\"row" + currentRowId + "\"></span>"); // Fencepost problem - start by adding a new row
    for(var i = 0; i < 16; i++){ // For every card on the screen 
        itemInRow ++;
        var cardUrl = cardSet[i][1];
        console.log(cardUrl);
        var cardClass = "cardNo" + cardSet[i][0];
        var currentButton = $("<button class=\"floatingCard " + cardClass + "\" role=\"gridcell\" aria-label=\"Card\"><span class=\"sr-only sr-only-focusable\" aria-live=\"polite\">Number " + cardSet[i][0] + "</span></button>");
        currentButton.click(flipCard);
        $("#row" + currentRowId).append(currentButton);
        $(currentButton).css({'background-image': 'url(' + cardUrl + ")"});
        if (itemInRow == 4){
            $(grid).append("<br>"); // Put a break after 4 items
            itemInRow = 0; // Reset what item I'm on
            currentRowId = currentRowId + 1; 
            $(grid).append("<span role=\"row\" id=\"row" + currentRowId + "\"></span>"); // Add a new row everytime you get to 4th item
        }
    }
    // Code to make sure it stays square and adjusts based on what will fit on the screen
    if (cardWidth > cardHeight){
        $('.floatingCard').css({'width': (cardHeight + 'px'), 'height': (cardHeight + 'px')});
    }
    else {
        $('.floatingCard').css({'width': (cardWidth + 'px'), 'height': (cardWidth + 'px')});
    }
}

// Helper method called on when a card is clicked. Takes in the current card as a parameter.
function flipCard(card){
    console.log('test click');
}

$('#startButton').click(function(event){ // When I click on start button, create grid
    createGrid();
});