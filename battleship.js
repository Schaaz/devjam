const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
// Option choosing
let angle = 0;
var temp=0;

function flip(){
const optionShips = Array.from(optionContainer.children)
if(angle === 0){
	optionShips.forEach(optionShip => optionShip.style.transform = 'rotate(90deg)')
	angle = 90
}
	else{
		optionShips.forEach(optionShip => optionShip.style.transform = 'rotate(0deg)')
		angle = 0
}
// optionShips.forEach(optionShip => optionShip.style.transform = 'rotate(90deg)')
}
flipButton.addEventListener('click',flip)
	
//Creating Boards
const width = 10

function createBoard(color,user){
  const gameBoardContainer = document.createElement('div')
  gameBoardContainer.classList.add('game-board')
  gameBoardContainer.style.backgroundColor = color
  gameBoardContainer.id = user
  
  for(let i=0; i<width * width; i++){
	const block = document.createElement('div')
	block.classList.add('block')
	block.id = i
	gameBoardContainer.append(block)
 }
 gamesBoardContainer.append(gameBoardContainer)
}
createBoard('blue', 'player')
createBoard('pink', 'computer')
  
// creating ships
class Ship{
	constructor(name, length){
		this.name = name
		this.length =length
	}
}

const destroyer = new Ship('destroyer', 2)
const submarine =new Ship('submarine', 3)
const cruiser =new Ship('cruiser',3)
const battleship =new Ship('battleship',4)
const carrier=new Ship('carrier',5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]

function addShipPiece(ship) {
	const allBoardBlocks = document.querySelectorAll('#computer div')
	let randomStartIndex = Math.floor(Math.random() * width * width)
	let randomBoolean = Math.random()<0.5
	let isHorizontal = randomBoolean
	let validStart = isHorizontal? randomStartIndex <= width*width - ship.length ? randomStartIndex : 
	width*width - ship.length : randomStartIndex <= width * width - ship.length*width? randomStartIndex : randomStartIndex - (ship.length-1)*width
	let shipBlocks = []
	for (let i=0;i<ship.length;i++){
		if (isHorizontal){
			shipBlocks.push(allBoardBlocks[Number(validStart)+i])
		} else{
			shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
		}
	}
	let valid
	if (isHorizontal){
		shipBlocks.every((_shipBlock, index)=>
		    valid = shipBlocks[0].id%width < width - shipBlocks.length + index +1)
	} else{
		shipBlocks.every((_shipBlock, index)=>
		    valid = shipBlocks[0].id < 90 + (width*index+1))
	}
	const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))
	if (valid && notTaken){
		shipBlocks.forEach(shipBlock => {
			shipBlock.classList.add(ship.name)
			shipBlock.classList.add('taken')
	
		})
	} else{
		addShipPiece(ship)
	}

}
ships.forEach(ship => addShipPiece(ship))
