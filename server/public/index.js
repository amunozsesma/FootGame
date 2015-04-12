
	var socket;			
    var localUser;
    var user;

function init() {
    
    var User = function(name, teamName) {
    this.id;
	this.name = name;
    this.teamName = teamName;
}
	
	remoteUsers = [];
    
	localUser = {};
    
     socket = io();
    
	setEventHandlers();
};

var setEventHandlers = function() {

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New user message received
	socket.on("new user", onNewUser);
    
	// End of turn
	socket.on("end of turn", onEndOfTurn);
    
    //New turn
	//socket.on("new turn", onEndOfTurn);

	// Player removed message received
	socket.on("remove user", onRemoveUser);
    
    //The game starts, send initial state
    socket.on("game start", onGameStart);
};

function onSocketConnected() {
	console.log("Connected to socket server");
	// Create local player and send data to the game server
    var params = parseQueryString();
    localUser = new User(params["name"], params["team"]); 
    localUser.id = socket.id;
	socket.emit("new user", {name: localUser.name, teamName: localUser.teamName});
};

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

function onNewUser(data) {
    
	console.log("New user connected: "+data.id);

	// Add remote user
	var newUser = new User(data.name, data.teamName);
	newUser.id = data.id;

	// Add new user to the remote users array
	remoteUsers.push(newUser);
};

function onEndOfTurn(data) {

    alert("End of turn");
    var userState = {
                     "player1": {"x":3, "y":0, "action":"pass"},
				     "player2": {"x":3, "y":2, "action":"shoot"},
					 "player3": {"x":3, "y":4, "action":"move"}}
    socket.emit("end of turn", {userState: userState});

}


function ready() {
    
    
    socket.emit("user ready", {user: localUser});
}

function finishTurn() {

     var userState = {
                         "player1": {"x":3, "y":0, "action":"pass"},
                         "player2": {"x":3, "y":2, "action":"shoot"},
                         "player3": {"x":3, "y":4, "action":"move"}}
     socket.emit("end of turn", {userState: userState});
}

function onGameStart (data) {
    
    state = data.state;
    
    var jsonData = JSON.stringify(data.state);
    
    document.getElementById("state").innerHTML = jsonData;
    
}



// Remove user
function onRemoveUser(data) {
	var removeUser = userById(data.id);

	// Player not found
	if (!removeUser) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove user from array
	remoteUsers.splice(remoteUsers.indexOf(removeUser), 1);
};


// Find user by ID
function UserById(id) {
	var i;
	for (i = 0; i < remoteUser.length; i++) {
		if (remoteUsers[i].id == id)
			return remoteUsers[i];
	};
	
	return false;
};

var parseQueryString = function() {

    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};


init();
