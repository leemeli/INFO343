'use strict';

function createGrid(){
    var sample = _.sampleSize(_CARDS, 8);
    var cardSet = [];
    sample.forEach(function(card){
        cardSet.push(card);
        cardSet.push(card);
    });
    var cardSet = _.shuffle(cardSet);
    console.log(cardSet);
}

$('#startButton').click(function(event){
    createGrid();
});