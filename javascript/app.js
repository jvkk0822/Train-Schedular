  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC8PGOw1cL2OZMbswdyJz82-9NV765N0AY",
    authDomain: "trainscheduler-54be7.firebaseapp.com",
    databaseURL: "https://trainscheduler-54be7.firebaseio.com",
    projectId: "trainscheduler-54be7",
    storageBucket: "",
    messagingSenderId: "711742152914"
  };
  firebase.initializeApp(config);

  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

  var database = firebase.database();

  //   button for adding Trains to System
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    //   grabs conductor input
    var trName = $("#train-name-input").val().trim();
    var trDestination = $("#destination-input").val().trim();
    var trTime = $("#train-time-input").val().trim();
    var trFrequency = $("#frequency-input").val().trim();

    // creates local "temp" object for holding employee data
    var newTrain = {
      trainName: trName,
      destination: trDestination,
      time: trTime,
      frequency: trFrequency
    };
    // uploads train data to Firebase
    database.ref().push(newTrain);

    console.log(newTrain.trName);
    console.log(newTrain.trDestination);
    console.log(newTrain.trTime);
    console.log(newTrain.trFrequency);

    // clears text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
  });

  //   create Firebase event for adding train to the database and a row in the html when conductor adds train
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {


    console.log(childSnapshot.val());

    // store conductor snapshot into a variable
    var trName = childSnapshot.val().trainName;
    var trDestination = childSnapshot.val().destination;
    var trTime = childSnapshot.val().time;
    var trFrequency = childSnapshot.val().frequency;

    // snapshot info = train info
    console.log(trName);
    console.log(trDestination);
    console.log(trTime);
    console.log(trFrequency);

    //   beautify
    //  var trTimePretty = moment.unix(trTime).format("HH:mm");
    //   var trFrequencyPretty = moment.unix(trFrequency).format("mm");

    //   calculate Next Arrival
    var timeConverted = moment(trTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(timeConverted), "minutes");
    var tRemainder = diffTime % trFrequency;
    var minAway = trFrequency - tRemainder;
    //   var minAwayPretty = moment.unix(minAway).format("hh:mm");



    // calculate minutes away
    var trArrival = moment().add(minAway, "minutes").format("hh:mm");
    //   var trArrivalPretty = moment.unix(trArrival).format("m");
    // add each trains data into the table

    $("#train-table > tbody").append("<tr><td>" + trName + "</td><td>" + trDestination + "</td><td>" +
      trFrequency + "</td><td>" + trArrival + "</td><td>" + minAway + "</td></tr>");

    //   trTimePretty + "<tr><td>" + trFrequencyPretty + "<tr><td>"

  });
  