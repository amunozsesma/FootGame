/**************************************************
** CONFIG CLASS
**************************************************/
var Config = function(numPlayers, numRows, numColumns, overallTimeout) {
    
	this.numPlayers = numPlayers;
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.overallTimeout = 30000;
}

exports.Config = Config;