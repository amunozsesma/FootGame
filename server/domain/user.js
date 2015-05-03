/**************************************************
** USER CLASS
**************************************************/
var User = function(name, team, teamName, id) {
    this.id = id;
	this.name = name;
    this.team = team;
    this.teamName = teamName;
};

User.prototype.setPlayerPosition = function() {

};

//TODO rename to build and this class to UserBuilder. 
//  This method is here as the class can get more complex and you might want to only return certain properties and in a different way
User.prototype.generateMessage = function() {
	return this;
};

exports.User = User;
