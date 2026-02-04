let sqState = "start"
let sqButtons = []

function resetSideQuest() {
  sqState = "start"
  sqButtons = []
}

// Branching story states
const sq = {
  start: {
    text: "Side Quest\n\nYou find a lost phone on the ground\nWhat do you do",
    choices: [
      { label: "Return it", next: "returnIt", effect: { trust: 1, karma: 1 } },
      { label: "Keep it", next: "keepIt", effect: { karma: -1 } }
    ]
  },

  returnIt: {
    text: "You return it to the owner\nThey offer you a ride home\nDo you accept",
    choices: [
      { label: "Accept", next: "acceptRide", effect: { trust: 1, health: 1 } },
      { label: "Decline", next: "declineRide", effect: { trust: -1 } }
    ]
  },

  keepIt: {
    text: "You keep it\nLater you feel guilty\nA stranger asks if you saw a lost phone",
    choices: [
      { label: "Tell the truth", next: "truth", effect: { trust: 1, karma: -1 } },
      { label: "Lie", next: "lie", effect: { trust: -1, karma: -1 } }
    ]
  },

  acceptRide: {
    text: "You get home safely\nYou see someone drop their groceries\nDo you help",
    choices: [
      { label: "Help", next: "endingCheck", effect: { karma: 1, trust: 1 } },
      { label: "Walk past", next: "endingCheck", effect: { karma: -1 } }
    ]
  },

  declineRide: {
    text: "You walk home alone\nIt takes longer and you feel exhausted\nContinue",
    choices: [
      { label: "Continue", next: "endingCheck", effect: { health: -1 } }
    ]
  },

  truth: {
    text: "You admit it and return the phone\nThey are upset but relieved\nContinue",
    choices: [
      { label: "Continue", next: "endingCheck", effect: { trust: -1 } }
    ]
  },

  lie: {
    text: "You lie and walk away\nYou feel stressed and unsafe\nContinue",
    choices: [
      { label: "Continue", next: "endingCheck", effect: { health: -1 } }
    ]
  },

  endingGood: {
    text: "Ending Unlocked\n\nGood ending\nPeople trust you and you feel supported",
    choices: [
      { label: "Back to game", next: "back", effect: {} }
    ]
  },

  endingNeutral: {
    text: "Ending Unlocked\n\nNeutral ending\nYou move on with no big change",
    choices: [
      { label: "Back to game", next: "back", effect: {} }
    ]
  },

  endingBad: {
    text: "Ending Unlocked\n\nBad ending\nYou lose trust and feel worse after it",
    choices: [
      { label: "Back to game", next: "back", effect: {} }
    ]
  }
}

function drawSideQuest() {
  background(240)

  fill(0)
  textAlign(CENTER, TOP)
  textSize(36)
  text("Side Quest", width / 2, 60)

  drawStats()

  let node = sq[sqState]

  fill(0)
  textAlign(CENTER, TOP)
  textSize(18)
  text(node.text, width / 2, 200)

  sqButtons = []

  let startY = 560
  let gap = 90

  for (let i = 0; i < node.choices.length; i++) {
    let c = node.choices[i]
    let btn = {
      x: width / 2,
      y: startY + i * gap,
      w: 260,
      h: 70,
      label: c.label,
      index: i
    }
    sqButtons.push(btn)
    drawSQButton(btn)
  }

  cursor(anySQHover() ? HAND : ARROW)
}

function drawStats() {
  fill(0)
  textAlign(LEFT, TOP)
  textSize(16)

  text("Trust " + playerStats.trust, 70, 130)
  text("Health " + playerStats.health, 270, 130)
  text("Karma " + playerStats.karma, 470, 130)
}

function sideQuestMousePressed() {
  for (let i = 0; i < sqButtons.length; i++) {
    if (isHover(sqButtons[i])) {
      pickChoice(sqButtons[i].index)
      return
    }
  }
}

function sideQuestKeyPressed() {
  if (keyCode === ESCAPE) currentScreen = "game"
}

function pickChoice(i) {
  let node = sq[sqState]
  let choice = node.choices[i]

  applyEffect(choice.effect)

  if (choice.next === "endingCheck") {
    goToEnding()
    return
  }

  if (choice.next === "back") {
    currentScreen = "game"
    return
  }

  sqState = choice.next
}

function applyEffect(effect) {
  if (effect.trust) playerStats.trust += effect.trust
  if (effect.health) playerStats.health += effect.health
  if (effect.karma) playerStats.karma += effect.karma

  if (playerStats.health < 0) playerStats.health = 0
}

function goToEnding() {
  if (playerStats.karma >= 1 && playerStats.trust >= 1 && playerStats.health >= 2) {
    endingsUnlocked.good = true
    sqState = "endingGood"
    return
  }

  if (playerStats.karma <= -1 || playerStats.trust <= -1 || playerStats.health <= 0) {
    endingsUnlocked.bad = true
    sqState = "endingBad"
    return
  }

  endingsUnlocked.neutral = true
  sqState = "endingNeutral"
}

function drawSQButton(btn) {
  rectMode(CENTER)

  let hover = isHover(btn)

  noStroke()
  if (hover) fill(200, 200, 255)
  else fill(220, 220, 255)

  rect(btn.x, btn.y, btn.w, btn.h, 12)

  fill(0)
  textAlign(CENTER, CENTER)
  textSize(22)
  text(btn.label, btn.x, btn.y)
}

function anySQHover() {
  for (let i = 0; i < sqButtons.length; i++) {
    if (isHover(sqButtons[i])) return true
  }
  return false
}
