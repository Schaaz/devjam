const gamesBoardContainer = document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipButton = document.querySelector('#flip-button')

// Option choosing
let angle = 0
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
}
flipButton.addEventListener('click',flip)
	
//Creating Boards
const width = 10

function createBoard(color, user){
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
createBoard('Yellow', 'player')
  
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
	let shipBlocks = []
	for (let i=0;i<ship.length;i++){
		if (isHorizontal){
			shipBlocks.push(allBoardBlocks[Number(randomStartIndex)+i])
		} else{
			shipBlocks.push(allBoardBlocks[Number(randomStartIndex) + i * width])
		}
		shipBlocks.forEach(shipBlock => {
		shipBlock.classList.add(ship.name)
		shipBlock.classList.add('taken')

	})
	}
}
ships.forEach(ship => addShipPiece(ship))
