/**************************************************
** BALL CLASS
**************************************************/
var Ball = function(position) {
    
    this.position = position;
}

Ball.prototype.updatePosition = function(position) {
    
    this.position = position;
}

exports.Ball = Ball;