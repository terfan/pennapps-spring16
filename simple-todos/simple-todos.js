function getTweets(s)
{
    Meteor.call("getTweetHTTP", [s], function(error, results) {
        console.log(error, results)
        return results
    });
}

function getSentiment(s)
{
    Meteor.call("getAlchHTTP", [s], function(error, results) {
        //console.log(results.data["docSentiment"]["score"]); //results.data should be a JSON object
        var score = results.data["docSentiment"]["score"];
        $("#location").text(s + " " + score);
        return score
    });
}

if (Meteor.isServer) {

    Meteor.methods({
        getTweetHTTP: function (text) {
            this.unblock();
            var Twit = Meteor.npmRequire('twit');
            var T = new Twit({
              consumer_key:         'm8NoL2ItBndouXornHnfK4NpV'
            , consumer_secret:      'iH8Nd5KDnaFsiKm6WBjtrzRfqFZIrneKzjYuwgdLD5zv6NhskH'
            , access_token:         '18587879-1Wb4NapQZbxv7TaQkuYaolQQmm3GAX58x4x1GKI1c'
            , access_token_secret:  'snXzqqVEsxDjjz3zvYPCk3m8au6qLbrrpI3dIQgeamVXi'
          })

            Tweets.remove({});

            T.get('search/tweets', { q: text, count: 10}, Meteor.bindEnvironment(function(err, data, response) {
              var results = data["statuses"];
              var numTweets = 0;
              var totalScore = 0;
              for (var i = 0; i < results.length; i++) {
                //console.log("tweet: "+ results[i].text);
                url = "http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?apikey=71f47e1c649e3d40189aa73c7ca18bb9142e2d8a&outputMode=json&text=" + results[i].text;

                var score = Meteor.http.call("GET", url).data["docSentiment"]["score"];
                var positive = false;
                if (score != undefined) {
                  totalScore = totalScore + (score*1);
                  console.log(totalScore);
                  if ((score*1) > 0) {
                    positive = true;
                  }
                  Tweets.insert({text: results[i].text, score: score, positive: positive});
                  numTweets++;
                  console.log("num "+numTweets);
                }
              }
              //var avg = (totalScore*1) / (numTweets*1);
              //console.log(text);
              //console.log(avg);

              //Tweets.insert({text: text});
              //Tweets.insert({text: text, avg: avg});
              //return data["statuses"]
            }))
        }
    });

    Meteor.methods({
        getAlchHTTP: function (text) {
            this.unblock();
            url = "http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?apikey=0e2d5d3c35387b178bd6f8d27c2e44ca83fbc5aa&outputMode=json&text=" + text;

            return Meteor.http.call("GET", url);
        }
    });
}
 
Tweets = new Mongo.Collection("tweets");

if (Meteor.isClient) {
  // This code only runs on the client

  Template.body.helpers({
     tweets: function () {
        return Tweets.find({});
      }
    });

Template.body.events({
    "submit .new-location": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;

      getSentiment(text);

 
      // Clear form
      event.target.text.value = "";
    },

    "submit .tweet": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;

      Meteor.call("getTweetHTTP", [text], function(error, results) {
        //console.log("TEST" + results); //results.data should be a JSON object
        //var score = results.data["text"];
        //$("#tweet").text(s + " " + );
        //return score
        //console.log(results)
        return results
        //return Tweets.count();
    });
 
      // Clear form
      event.target.text.value = "";
    }

  });
}