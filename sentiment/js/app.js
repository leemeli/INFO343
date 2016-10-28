'use strict';

// Global variables
var _EMOTIONS = ["positive", "negative", "anger", "anticipation", "disgust", "fear", "joy", "sadness", "surprise", "trust"];
var inputValue;

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

// Function takes in an array of tweet data and returns an object that contains the data of interest 
function analyzeTweets(tweetArray){
    var analyzedInfoArray = []; // Format - [emotion: [percent of all tweets, [array of most common words in order]], emotion:...etc
    var rawDataArray = []; // Format - [count of words, all words used]
    var totalLength = 0;
    tweetArray.forEach(function(currentTweetInfo){
        var currentTweet = currentTweetInfo["text"];
        var filteredTweetWordsArray = extractWords(currentTweet);
        var tweetEmotions = findSentimentWords(filteredTweetWordsArray); // Array with emotions and words that correspond to it
        var hashtags = hashtagFilterArray(currentTweetInfo.entities["hashtags"]); // hashtags is a list of hashtags for this specific emotion
        totalLength = totalLength + filteredTweetWordsArray.length; // add to total amount of words included
        for (var i = 0; i < _EMOTIONS.length; i ++){ // for each emotion we need to look at
            // tweetEmotions[_EMOTIONS[i]]; // Represents the  words that correspond to the current emotion
            var emotion = _EMOTIONS[i];
            if (!(emotion in rawDataArray)){ // If the emotion isn't already a key in the analyzedInfoArray
                rawDataArray[emotion] = []; // Then declare a new array for this emotion key
                rawDataArray[emotion][0] = 0;
                rawDataArray[emotion][1] = [];
                rawDataArray[emotion][2] = [];
            }
            if (tweetEmotions[emotion] !== undefined){
                rawDataArray[emotion][0] = rawDataArray[emotion][0] + tweetEmotions[emotion].length;
                rawDataArray[emotion][1] = rawDataArray[emotion][1].concat(tweetEmotions[emotion]);
                if (tweetEmotions[emotion].length > 0){ // If this tweet has this sentiment
                    rawDataArray[emotion][2] = rawDataArray[emotion][2].concat(hashtags); // add current tweet's hashtags to corresponding emotion
                }
            }
        }
    });
    // Now the rawDataArray is complete in the format: [emotion: [int count of words, [string wordsused, string wordsused2..]...]
    // Can now process the rawData into the analyzedInfoArray
    for (var i = 0; i < _EMOTIONS.length; i ++){ // for each emotion we need to look at
        var emotion = _EMOTIONS[i];
        if (!(emotion in analyzedInfoArray)){ // If the emotion isn't already a key in the analyzedInfoArray
            analyzedInfoArray[emotion] = []; // Then declare a new array for this emotion key
            analyzedInfoArray[emotion][1] = [];
            analyzedInfoArray[emotion][3] = [];
        }
        analyzedInfoArray[emotion][0] = rawDataArray[emotion][0] / totalLength * 100; // Calculate percentage of emotion and throw into array
        analyzedInfoArray[emotion][1] = sortByFrequencyAndRemoveDuplicates(rawDataArray[emotion][1]); // Call on helper method from stackoverflow
        analyzedInfoArray[emotion][2] = sortByFrequencyAndRemoveDuplicates(rawDataArray[emotion][2]);
    }
    // The returned object should contain the following information for each sentiment:
    // The percentage of words across all tweets that have the sentiment
    // The most common words across all tweets that have that sentiment (in order!)
    // Returned array has the following format: 
    // [emotion: [percent of all tweets, [array of most common words in order]], emotion:...etc
    return analyzedInfoArray;
}

// Helper method that takes in an array of hashtags for an individual tweet and a String of an emotion
// Example of the format of the "tweetHashtags" array: [{ "indices": [9, 21], "text": "GeekGirlCon" }, ...]
// Should return an array of Strings (hashtags)
function hashtagFilterArray(tweetHashtags){
    var hashtagArray = [];
    if (tweetHashtags !== undefined){
        for (var i = 0; i < tweetHashtags.length; i ++){ // For the number of hashtags are in the tweet
            hashtagArray.push(tweetHashtags[i]["text"]); // Add the hashtag to the array
        }
    }
    return hashtagArray;
}

// This function is copied from a user from Stackoverflow: 
// http://stackoverflow.com/questions/3579486/sort-a-javascript-array-by-frequency-and-then-filter-repeats
// Basically sorts by highest occurrence to lowest occurrence and filters out duplicates 
function sortByFrequencyAndRemoveDuplicates(array) {
    var frequency = {}, value;

    // compute frequencies of each value
    for(var i = 0; i < array.length; i++) {
        value = array[i];
        if(value in frequency) {
            frequency[value]++;
        }
        else {
            frequency[value] = 1;
        }
    }

    // make array from the frequency object to de-duplicate
    var uniques = [];
    for(value in frequency) {
        uniques.push(value);
    }

    // sort the uniques array in descending order by frequency
    function compareFrequency(a, b) {
        return frequency[b] - frequency[a];
    }

    return uniques.sort(compareFrequency);
}

// To test steps 1-3: console.log(analyzeTweets(_SAMPLE_TWEETS));

// Function that displays statistics to the page with the passed in data array
// Passed in array has the following format: 
// [emotion: [percent of all tweets, [array of most common words in order]], emotion:...etc
function showStatistics(tweetDataArray){
    $('tbody').empty('tr');
    for(var i = 0; i < _EMOTIONS.length; i ++){
        var emotion = _EMOTIONS[i];
        var currentEmotionRow = $('<tr></tr>');
        $('tbody').append(currentEmotionRow);
        $(currentEmotionRow).append('<th>' + emotion + '</th>');
        var percentTweets = numeral(tweetDataArray[emotion][0]).format('0.00') + '%';
        $(currentEmotionRow).append('<th>' + percentTweets + '</th>');
        var exampleWords = tweetDataArray[emotion][1].slice(0, 3).join(', '); 
        $(currentEmotionRow).append('<th>' + exampleWords + '</th>');
        var hashtagWords = tweetDataArray[emotion][2].slice(0, 3).join(', #');
        if (hashtagWords.length > 0){
            hashtagWords = '#' + hashtagWords;
        } 
        $(currentEmotionRow).append('<th>' + hashtagWords + '</th>');
    }
}

// This function use AJAX to request to download the file, analyze results by calling on analyzeTweets function, 
// and then display results by calling on showStatistics method.
function loadTweets(jsonFileURL){
    fetch(jsonFileURL)
    .then(function(response) {
        return response.json(); // convert to JSON
    }).then(function(body) {
        // What to do with json file
        showStatistics(analyzeTweets(body));
    });
}
 
$('#searchButton').click(function(event) {
    inputValue = document.getElementById("searchBox").value;
    var urlString = 'https://faculty.washington.edu/joelross/proxy/twitter/timeline/?screen_name=' + inputValue + '&count=100';
    loadTweets(urlString);
});

loadTweets('https://info343-au16.github.io/challenges-leemeli/sentiment/data/tweets.json');



