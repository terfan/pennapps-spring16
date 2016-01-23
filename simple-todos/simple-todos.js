function getSentiment(s)
{
    Meteor.call("getAlchHTTP", [s], function(error, results) {
        //console.log(results.data["docSentiment"]["score"]); //results.data should be a JSON object
        var score = results.data["docSentiment"]["score"];
        $("#location").text(s + " " + score);
        return score;
    });
}

if (Meteor.isServer) {
    Meteor.methods({
        getAlchHTTP: function (text) {
            this.unblock();
            url = "http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?apikey=0e2d5d3c35387b178bd6f8d27c2e44ca83fbc5aa&outputMode=json&text=" + text;

            return Meteor.http.call("GET", url);
        }
    });
}
 
if (Meteor.isClient) {
  // This code only runs on the client

Template.body.events({
    "submit .new-location": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;

    getSentiment(text);

 
      // Clear form
      event.target.text.value = "";
    }
  });
}