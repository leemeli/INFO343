'use strict';

function createGrid(){
    var sample = _.sampleSize(_CARDS, 8);
    var cardSet = [];
    sample.forEach(function(card){
        cardSet.push(card);
        cardSet.push(card);
    });
    var cardSet = _.shuffle(cardSet);
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var cardWidth = windowWidth / 4;
    var cardHeight =  (windowHeight - $('header').height()) / 4 - 40;
    var grid = $('#grid');
    var currentRowId = 1;
    var itemInRow = 0;
    $(grid).append("<span role=\"row\" id=\"row" + currentRowId + "\"></span>");
    for(var i = 0; i < 16; i++){
        itemInRow ++;
        var cardUrl = cardSet[i][1];
        console.log(cardUrl);
        var cardClass = "cardNo" + cardSet[i][0];
        var toAppend = "<button class=\"floatingCard " + cardClass + "\" role=\"gridcell\" aria-label=\"Card\"><span class=\"sr-only sr-only-focusable\" aria-live=\"polite\">Number " + cardSet[i][0] + "</span></button>";
        $("#row" + currentRowId).append(toAppend);
        $("." + cardClass).css({'background-image': 'url(' + cardUrl + ")"});
        var currentButton = $('.' + cardClass);
        if (itemInRow == 4){
            $(grid).append("<br>");
            itemInRow = 0;
            currentRowId = currentRowId + 1;
            $(grid).append("<span role=\"row\" id=\"row" + currentRowId + "\"></span>");
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

$('#startButton').click(function(event){
    createGrid();
});