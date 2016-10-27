'use strict';

// Global variables
var _EMOTIONS = ["positive", "negative", "anger", "anticipation", "disgust", "fear", "joy", "sadness", "surprise", "trust"];

// Function that takes in a String tweet and returns an array of individual lowercase words
function extractWords(tweet){
    tweet = tweet.toLowerCase();
    var wordsArray = tweet.split(/\W+/);
    var wordsArrayFiltered = [];
    wordsArray.forEach(function(currentWord) {
        if(currentWord.length > 1){
            wordsArrayFiltered.push(currentWord);
        }
    });
    return wordsArrayFiltered;
}

// Function that determines each word's sentiment; takes in an array of words and returns a new object
// The new object's keys are the sentiments while the values are arrays of words that have that sentiment
function findSentimentWords(wordsArray){
    var sentimentWordMap = {};
    wordsArray.forEach(function(currentWord){ // For each word in our array of words
        if (_SENTIMENTS[currentWord] !== undefined){
            var currentSentiments = _SENTIMENTS[currentWord]; // Represents the different sentiments for this word
            _EMOTIONS.forEach(function(emotion){ // For each emotion within the global variable _EMOTIONS...
                    if (!(emotion in sentimentWordMap)){ // If the emotion isn't already a key in the sentimentWordMap
                        sentimentWordMap[emotion] = []; // Then declare a new array for this emotion key
                    }
                    if(emotion in currentSentiments){ // If the current emotion exists in my array of currentSentiments for this word
                        sentimentWordMap[emotion].push(currentWord);
                    }
             });
        }
    });
    return sentimentWordMap;
}

console.log(findSentimentWords(extractWords("Amazingly, I prefer a #rainy day to #sunshine.")));





