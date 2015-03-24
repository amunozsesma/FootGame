/**************************************************
** USER CLASS
**************************************************/
var User = function(name, team, socket) {
    
    this.id;
	this.name = name;
    this.team = team;
	this.socket = socket;

    this.stats;
}

exports.User = User;