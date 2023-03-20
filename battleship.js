const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const startButton = document.querySelector('#start-button')
const infoDisplay = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')

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
let notdropped
function getValidity(allBoardBlocks, isHorizontal, startIndex, ship){
	let validStart = isHorizontal? startIndex <= width*width - ship.length ? startIndex : 
	width*width - ship.length : startIndex <= width * width - ship.length*width? startIndex : startIndex - (ship.length-1)*width
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
		    // valid = shipBlocks[0].id % width !== width - (shipBlocks.legth - (index + 1)))
			valid = shipBlocks[0].id%width < width - shipBlocks.length + index +1
	)} else{
		shipBlocks.every((_shipBlock, index)=>
		    valid = shipBlocks[0].id < 90 + (width*index+1))
	}

	const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))

	return{ shipBlocks, valid, notTaken}
}

function addShipPiece(user, ship, startId) {
	// const allBoardBlocks = document.querySelectorAll('user div')
	let allBoardBlocks
	if (user==='player'){
		allBoardBlocks = document.querySelectorAll('#player div')
	} else{
		allBoardBlocks = document.querySelectorAll('#computer div')
	}
	let randomStartIndex = Math.floor(Math.random() * width * width)
	let startIndex = startId? startId: randomStartIndex
	let randomBoolean = Math.random()<0.5
	let isHorizontal = user === 'player'? angle === 0: randomBoolean
	// let validStart = isHorizontal? startIndex <= width*width - ship.length ? startIndex : 
	// width*width - ship.length : startIndex <= width * width - ship.length*width? startIndex : startIndex - (ship.length-1)*width
	// let shipBlocks = []
	
	// for (let i=0;i<ship.length;i++){
	// 	if (isHorizontal){
	// 		shipBlocks.push(allBoardBlocks[Number(validStart)+i])
	// 	} else{
	// 		shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
	// 	}
	// }
	// let valid
	// if (isHorizontal){
	// 	shipBlocks.every((_shipBlock, index)=>
	// 	    // valid = shipBlocks[0].id % width !== width - (shipBlocks.legth - (index + 1)))
	// 		valid = shipBlocks[0].id%width < width - shipBlocks.length + index +1
	// )} else{
	// 	shipBlocks.every((_shipBlock, index)=>
	// 	    valid = shipBlocks[0].id < 90 + (width*index+1))
	// }

	// const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))
	const { shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)
	if (valid && notTaken){
		shipBlocks.forEach(shipBlock => {
			shipBlock.classList.add(ship.name)
			shipBlock.classList.add('taken')
	
		})
	} else{
		if (user === 'computer'){ addShipPiece('computer',ship)}
		if (user === 'player'){ notdropped = true}
	}

}
ships.forEach(ship => addShipPiece('computer',ship))
//drag player ships
optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip=> optionShip.addEventListener('dragstart',dragStart))

const allPlayerBlocks = document.querySelectorAll ('#player div')
allPlayerBlocks.forEach(playerblock=> {
	playerblock.addEventListener('dragover', dragOver)
	playerblock.addEventListener('drop',dropShip)
})
let draggedShip
function dragStart(e){
	notdropped = false
	draggedShip = e.target
	console.log(e.target)
}
function dragOver(e){
	e.preventDefault()
	const ship = ships[draggedShip.id]
    highlightArea(e.target.id, ship)
}
function dropShip(e){
	const startId = e.target.id
	const ship = ships[draggedShip.id]
	addShipPiece('player',ship,startId)
	if (!notdropped){
		draggedShip.remove()
	}
	draggedShip = null
	
}
//highlight
function highlightArea(startIndex, ship){
	
	const allBoardBlocks = document.querySelectorAll('#player div')
	let isHorizontal = angle === 0
	
	const { shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)
    
	if (valid && notTaken){
		shipBlocks.forEach(shipBlock=>{
			shipBlock.classList.add('hover')
			setTimeout( ()=> shipBlock.classList.remove('hover'),500)
		})
	}
}
//gamelogic
let gameOver = false
let playerTurn

//start game
function startGame(){
	if (playerTurn === undefined){
		if (optionContainer.children.length != 0){
			infoDisplay.textContent = 'Please place all your pieces first!'
		} else{
			const allBoardBlocks = document.querySelectorAll('#computer div')
			allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
			playerTurn = true
			turnDisplay.textContent = "Your turn"
			infoDisplay.textContent = "The game has started..."
		}
	}
	
}
startButton.addEventListener('click', startGame)

let playerHits = []
let computerHits = []
const playerSunkShips = []
const computerSunkShips = [] 

function handleClick(e){
	if (!gameOver){
		if (!e.target.classList.contains('boom') && !(e.target.classList.contains('empty'))){
		if (e.target.classList.contains('taken')){
			e.target.classList.add('boom')
			infoDisplay.textContent = "You hit the computer's ship!"
			var classes = Array.from(e.target.classList)
			classes = classes.filter(className => className !== 'block')
			classes = classes.filter(className => className !== 'boom')
			classes = classes.filter(className => className !== 'taken')
			playerHits.push(...classes)
			checkScore('player', playerHits, playerSunkShips)
		}
		if (!e.target.classList.contains('taken')){
			infoDisplay.textContent = "You missed this time."
			e.target.classList.add('empty')
		}
		playerTurn = false
		const allBoardBlocks = document.querySelectorAll('#computer div')
		allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
		setTimeout(computerGo, 3000)
	} else {
		infoDisplay.textContent = "Hit a different block!"
	}
	}
}
//computer turn
function computerGo(){
	if (!gameOver){
		turnDisplay.textContent = "Computer's Turn!"
		infoDisplay.textContent = "The Computer is thinking..."
		setTimeout(()=>{
			let randomGo = Math.floor(Math.random()*width*width)
			const allBoardBlocks = document.querySelectorAll('#player div')
			if (allBoardBlocks[randomGo].classList.contains('taken') && 
			    allBoardBlocks[randomGo].classList.contains('boom')){
					computerGo()
					return
			} else if (allBoardBlocks[randomGo].classList.contains('taken') && 
			    !allBoardBlocks[randomGo].classList.contains('boom')){
					allBoardBlocks[randomGo].classList.add('boom')
					infoDisplay.textContent = "The Computer hit your ship!!"
					let classes = Array.from(allBoardBlocks[randomGo].classList)
			        classes = classes.filter(className => className !== 'block')
					classes = classes.filter(className => className !== 'boom')
					classes = classes.filter(className => className !== 'taken')
					computerHits.push(...classes)
					checkScore('computer', computerHits, computerSunkShips)
				}
				else{
					infoDisplay.textContent = "Nothing hit this time."
					allBoardBlocks[randomGo].classList.add('empty')
				}
		}, 3000)
		setTimeout(()=>{
			playerTurn = true
			turnDisplay.textContent = "It is your turn!"
			infoDisplay.textContent = "Please take your turn!"
			allBoardBlocks = document.querySelectorAll('#computer div')
			allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
		}, 6000)
	}
}
function checkScore(user, userHits, userSunkShips){

	function checkShip(shipName, shipLength) {
		if (userHits.filter(storedShipName => storedShipName === shipName).length === shipLength){
			
			if (user === 'player'){
				playerHits = userHits.filter(storedShipName => storedShipName!== shipName)
				infoDisplay.textContent = "You sunk the computer's "+shipName
			}
			if (user === 'computer'){
				computerHits = userHits.filter(storedShipName => storedShipName!== shipName)
				infoDisplay.textContent = "The computer sunk your "+shipName
			}
			userSunkShips.push(shipName)
		}
	}
	checkShip('destroyer', 2)
	checkShip('submarine', 3)
	checkShip('cruiser', 3)
	checkShip('battleship', 4)
	checkShip('carrier', 5)
	console.log('playerHits', playerHits)
	console.log('playerSunkShips', playerSunkShips)
	console.log('computerHits', computerHits)
	console.log('computerSunkShips', computerSunkShips)

	if (playerSunkShips.length === 5){
		infoDisplay.textContent = "You sunks all the computer's ships!! YOU WON!!"
		gameOver = true
	}
	if (computerSunkShips.length === 5){
		infoDisplay.textContent = "The computer sunk all your ships!! YOU SUCK!!"
		gameOver = true
	}
	
}
