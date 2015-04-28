/**************************************************
** USER CLASS
**************************************************/
var User = function(name, team, teamName, id) {
    
    this.id = id;
	this.name = name;
    this.team = team;
    this.temaName = teamName;
}

exports.User = User;
