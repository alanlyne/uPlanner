//Dearbhla Stobie
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCWp_N65JXOPuwlAVXTiivENLC4SxiKlEs",
    authDomain: "uplanner-353.firebaseapp.com",
    databaseURL: "https://uplanner-353.firebaseio.com",
    projectId: "uplanner-353",
    storageBucket: "uplanner-353.appspot.com",
    messagingSenderId: "602004830237"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

//funtion for signing up
function doRegister()
{
  //taking all inputed values
	firstName=document.getElementById("firstName").value;
	surname=document.getElementById("surname").value;
	email=document.getElementById("email").value;
	password=document.getElementById("psw").value;
	if(document.getElementById("plannerType").checked){
	  var uType = document.getElementById("plannerType").value;

	}
	if(document.getElementById("clientType").checked){
	 uType = document.getElementById("clientType").value;

	}
  //connect with firebase and create a new user with details
	firebase
	.auth()
	.createUserWithEmailAndPassword(email, password)
	.then(function()
	{
	  //using user id add user information to database
		var user = firebase.auth().currentUser;
    var uid=user.uid;
		var mydata = database.ref('/usersInfo/'+uid);
  		mydata.child('details').set({'email': email ,'firstName':firstName  ,"surname":surname , "type": uType});
  	//load main page whe complete
  	var user = firebase.auth().currentUser;
    var uid=user.uid;
		setCookie(uid,10);
		loadDashboard();
	})
	.catch(function(error)
		{
		  // Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(errorMessage);
		})


}
//function to login
function doLogin()
{
	username=document.getElementById("email").value;
	password=document.getElementById("psw").value;
//connect to firebase and verify details are correct, load dashboard when done.
	firebase
		.auth()
		.signInWithEmailAndPassword(username, password)
		.then(function(){
		  var user = firebase.auth().currentUser;
      var uid=user.uid;
		  setCookie(uid,10);
		  loadDashboard();
		})
		.catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.error(errorMessage)
		});
}

function loadDashboard(){
  window.location.replace("homePage.html"); //replace placeholder.html with what ever dashboard you want to use.
}

var eventNames = ["","","","",""]; //assign array for event names, current max is 5
function getEvents(){
    var user = firebase.auth().currentUser;
    var uid=user.uid
    var mydata = database.ref('/usersInfo/'+ uid );
    mydata.on('value',
		  function(snapshot)
		  {
		  console.log("got snapshot");
			var result=snapshot.val(); //get JSON from database
			console.log(result);
			var resultS=JSON.stringify(result['events'],null,4); //JSON to string
			console.log(resultS);
			//var string = "";
			var count = 0; //keeps count of input in to array
	    //var eventCount = 0;
			var displayCount = 0;//keeps track of divs created
			for(var i in result.events){ //loop through events in the JSON file
			  var temp1 = resultS.split('    "'); //get event name
			  console.log(temp1);
			  var bracketCount =0;
			  for(var k=0;k<resultS.length;k++){
          if(resultS.charAt(k) == '}'){
            bracketCount++;
          }
          if(bracketCount==1){
            resultS = resultS.substring(k,resultS.length());
            break;
          }
        }
			  var temp2 = temp1[1].split('"');
			  //eventCount +=5;
			  console.log(temp2);
			  eventNames[count] = temp2[0];//.substring(0,temp2.length-2);
			  console.log(eventNames);
			  var dets  = ["","","","" ]; //array of event details
			  var countD= 0;//keeps count of input in to array
			  for(var j in result.events[i]){
			    dets[countD]=result.events[i][j] + " "; //adding input in to array
			    countD ++; //increment the count for the array
			  }
			  console.log(dets);



			  var t = document.createElement('div');
        t.setAttribute("id", "title"+displayCount);
        t.setAttribute("class", "title");
        document.getElementById("display").appendChild(t);

        var b = document.createElement('div');
        b.setAttribute("id","body"+displayCount);
        b.setAttribute("class","bdy");
        document.getElementById("display").appendChild(b);

        //display the event name followed by respective details to page
        document.getElementById("title"+displayCount).innerHTML = eventNames[count] + "<br>";
        document.getElementById('body'+displayCount).innerHTML += "Client Name:  "+dets[0]+"<br>";
        document.getElementById('body'+displayCount).innerHTML += "Event Date:  "+dets[1]+"<br>";
        document.getElementById('body'+displayCount).innerHTML += "Location:  "+dets[2]+"<br>";
        document.getElementById('body'+displayCount).innerHTML += "Occasion:  "+dets[3]+"<br>";
        document.getElementById('body'+displayCount).innerHTML += "<br>";



        displayCount++;
        count++;
			}

		  });
}

function setCookie(cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = "userid=" + cvalue + ";" + expires + ";path=/";
}
function getCookie() {
  var name = "userid=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function displayUserWelcome(){
  var uid = getCookie();
  var mydata = database.ref('/usersInfo/'+ uid + '/details');
  mydata.on('value',
		  function(snapshot)
		  {
		    console.log("got snapshot");
  			var result=snapshot.val(); //get JSON from database
  			console.log(result);

        document.getElementById('welcome').innerHTML = "Welcome "+ result['firstName']+"!";
        document.getElementById('messagePart').innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		  });
}

function checkType(){
  var uid = getCookie();
  var mydata = database.ref('/usersInfo/'+ uid + '/details');
  mydata.on('value',
		  function(snapshot)
		  {
		    console.log("got snapshot");
  			var result=snapshot.val(); //get JSON from database
  			console.log(result);
        if(result['type'] == 'planner'){
          window.location.replace("eventManage.html");
        }
        else{
          window.location.replace("eventView.html");
        }
		  });
    }
