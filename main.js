let gameState = "instructions"
let karma = 0
let sceneIndex = 0

let scenes = [
  {
    title: "Scene 1",
    prompt: "You find a lost wallet on the sidewalk.",
    leftText: "Return it to the owner",
    leftKarma: 1,
    rightText: "Keep the money",
    rightKarma: -1
  },
  {
    title: "Scene 2",
    prompt: "A stranger asks you to help carry heavy bags.",
    leftText: "Help them",
    leftKarma: 1,
    rightText: "Ignore them",
    rightKarma: -1
  },
  {
    title: "Scene 3",
    prompt: "You find an injured animal on your path.",
    leftText: "Stop and help it",
    leftKarma: 1,
    rightText: "Keep going.",
    rightKarma: -1
  }
]

function setup() {
  createCanvas(800, 800)
  textAlign(CENTER, CENTER)
  textFont("georgia")
}

function draw() {
  background(127, 176, 105)

  if (gameState === "instructions") {
    drawInstructions()
    return
  }

  if (gameState === "play") {
    drawScene()
    return
  }

  if (gameState === "win") {
    drawWin()
    return
  }

  if (gameState === "lose") {
    drawLose()
    return
  }
}

function mousePressed() {
  if (gameState === "instructions") {
    startGame()
    return
  }

  if (gameState === "win" || gameState === "lose") {
    resetGame()
    return
  }

  if (gameState !== "play") return

  let choseLeft = mouseX < width / 2
  if (choseLeft) applyChoice("left")
  else applyChoice("right")
}

function drawInstructions() {
  background(170, 205, 140); // new nicer matcha color

  fill(255);

  // Title
  textSize(42);
  text("Karma Choice Quest", width / 2, height * 0.25);

  // Instructions
  textSize(20);
  text(
    "Click left or right to choose.\nYour choices change karma!\nGood karma wins :)\nBad karma loses :(",
    width / 2,
    height * 0.5
  );

  // Start text
  textSize(18);
  text("Click anywhere to begin", width / 2, height * 0.7);
}

function startGame() {
  gameState = "play"
  sceneIndex = 0
  karma = 0
}

function drawScene() {
  let s = scenes[sceneIndex]

  fill(255)
  textSize(22)
  text(s.title, width / 2, 60)

  textSize(20)
  text(s.prompt, width / 2, 140)

  textSize(16)
  text("Karma " + karma, width / 2, 190)

  drawButtons(s.leftText, s.rightText)
}

function drawButtons(leftLabel, rightLabel) {
  let btnW = 320
  let btnH = 80
  let y = 320

  noStroke()
  fill(40, 70)
  rect(width * 0.25 - btnW / 2, y - btnH / 2, btnW, btnH, 16)
  rect(width * 0.75 - btnW / 2, y - btnH / 2, btnW, btnH, 16)

  fill(255)
  textSize(16)
  text("LEFT\n" + leftLabel, width * 0.25, y)
  text("RIGHT\n" + rightLabel, width * 0.75, y)

  textSize(12)
  text("Click left side or right side", width / 2, 430)
}

function applyChoice(side) {
  let s = scenes[sceneIndex]

  if (side === "left") karma += s.leftKarma
  else karma += s.rightKarma

  sceneIndex += 1

  if (sceneIndex >= scenes.length) {
    if (karma >= 2) gameState = "win"
    else gameState = "lose"
  }
}

function drawWin() {
  background(70, 150, 90)

  fill(255)
  textSize(40)
  text("You Win", width / 2, 170)

  textSize(18)
  text("Karma " + karma + "\nYour kindness guided you.", width / 2, 250)

  textSize(16)
  text("Click anywhere to restart", width / 2, 360)
}

function drawLose() {
  background(150, 60, 60)

  fill(255)
  textSize(40)
  text("You Lose", width / 2, 170)

  textSize(18)
  text("Karma " + karma + "\nYour choices led to a bad ending.", width / 2, 250)

  textSize(16)
  text("Click anywhere to try again", width / 2, 360)
}

function resetGame() {
  gameState = "instructions"
  karma = 0
  sceneIndex = 0
}