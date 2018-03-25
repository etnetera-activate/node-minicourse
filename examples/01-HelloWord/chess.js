//odpoved na otazku, zda muze kun dojit z B1 na E6 na prave 5 kroku


var debug = require("debug")("chess")
var moveCounter = 0;

var config = {
  start: [2,1], //B1
  end: [5,6],    //E6
  maxMoves: 5
}
var horseMoves = [
  [ 1, 2],
  [ 2, 1],
  [-1, 2],
  [-2, 1],
  [-1,-2],
  [-2,-1],
  [1, -2],
  [2, -1]
]

function generateHorseMoves(position){
    //debug("Generationg available moves for %O", position)
    var out = []
    var r = position[1]
    var c = position[0]
    for(var i=0; i< horseMoves.length;i++){
      var newC = c+horseMoves[i][0];
      var newR = r+horseMoves[i][1];
      if((newC>=1)&&(newC<=8)&&(newR>=1)&&(newR<=8)) out.push([newC,newR])
    }
    return out;
}

//add new move at the end of move array. Check if this is a target
function moveHorse(moves){
    if((moves[moves.length-1][0] == config.end[0])&&(moves[moves.length-1][1] == config.end[1])){
      debug("Success on %d %o",moves.length-1, moves)
      return;
    }
    if(moves.length >= config.maxMoves+1){
      //debug("Reached max recLevel. Ending at %O" + moves)
      return;
    }
    var availableMoves = generateHorseMoves(moves[moves.length-1]);

    for (var i = 0; i < availableMoves.length ; i++){
      var newMoves = JSON.parse(JSON.stringify(moves))
      //debug("newMoves %O + %O", newMoves, availableMoves[i])
      newMoves.push(availableMoves[i])
      moveCounter++;
      moveHorse(newMoves);
    }
}

moveHorse([config.start])
debug("Total moves: %d", moveCounter)
