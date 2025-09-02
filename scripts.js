/*****************************************************
 scripts.js – Comprehensive Final Version
*****************************************************/

/**
 * Features:
 * - Typed Resume: start, pause, continue, end
 * - Passcode Riddle => 'html'
 * - Pyodide-based Python Games:
 *    python-game, python-snake, python-pong,
 *    python-invaders, python-adventure
 * - Easter Eggs:
 *    egg1 => python-egg1 (Glitch Cube),
 *    egg2 => python-egg2 (Grid Orb),
 *    egg5 => python-egg5 (Full-Screen Glitch)
 * - Floating / bobbing elements
 * - Ambient random glitch effect
 * - No "Unknown command" text (invalid commands are ignored)
 * - Background music toggle
 */

// ------------------------
// BACKGROUND MUSIC TOGGLE
// ------------------------
const bgMusic = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');
let isMuted = false;

audioToggle.addEventListener('click', () => {
  if (!isMuted) {
    bgMusic.pause();
    audioToggle.textContent = '[ UNMUTE ]';
  } else {
    bgMusic.play().catch(() => {});
    audioToggle.textContent = '[ MUTE ]';
  }
  isMuted = !isMuted;
});

// Auto-play on first click
document.body.addEventListener(
  'click',
  () => {
    if (!bgMusic.paused && !isMuted) return;
    bgMusic.play().catch(()=>{});
  },
  { once: true }
);

// ------------------------
// SCROLL FADE – HERO
// ------------------------
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  const hero = document.getElementById('heroWireframe');
  const fadeDist = 600;  
  let ratio = scrollY / fadeDist;
  if (ratio < 0) ratio = 0;
  if (ratio > 1) ratio = 1;
  hero.style.opacity = (1 - ratio).toString();
});

// ------------------------
// INTERSECTION OBSERVER
//   - For commands section & resume
// ------------------------
const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
    }
  });
}, observerOptions);

const commandsSection = document.querySelector('.commands-key-section');
const resumeSection = document.querySelector('.formal-resume');
if (commandsSection) observer.observe(commandsSection);
if (resumeSection) observer.observe(resumeSection);

// ------------------------
// AMBIENT GLITCH OVERLAY (random bug-out)
//   triggers every 10–20 seconds
// ------------------------
const ambientGlitch = document.getElementById('ambientGlitchOverlay');
if (ambientGlitch) {
  setInterval(() => {
    ambientGlitch.style.display = 'block';
    setTimeout(() => {
      ambientGlitch.style.display = 'none';
    }, 300);
  }, Math.floor(Math.random() * 10000) + 10000); // 10–20 sec
}

// ------------------------
// LOAD PYODIDE & game.py
// ------------------------
let pyodideReady = false;
let pyodide = null;

async function loadPythonEnv() {
  console.log("Loading Pyodide...");
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
  });
  console.log("Pyodide loaded. Fetching 'game.py'...");
  try {
    const code = await (await fetch("game.py")).text();
    pyodide.FS.writeFile("game.py", code);
    console.log("Successfully wrote game.py into Pyodide FS.");
    pyodideReady = true;
  } catch (err) {
    console.error("Failed to fetch or write game.py", err);
  }
}
loadPythonEnv();

// Helper to capture Python prints and display in #linesContainer
function pyPrint(msg) {
  linesContainer.textContent += msg + "\n";
  linesContainer.scrollTop = linesContainer.scrollHeight;
}

// ------------------------
// TERMINAL & COMMANDS
// ------------------------
const linesContainer = document.getElementById('linesContainer');
const commandInput = document.getElementById('commandInput');
const warningOverlay = document.getElementById('warningOverlay');

// Resume typing logic
let typingInterval = null;
let paused = false;
let currentLine = 0;
let currentChar = 0;

const resumeLines = [
  "Justin PuffPaff",
  "Web Developer",
  "Experience: This Is Music LLC (2019–Present)",
  "Skills: HTML, CSS, JS, Python",
  "Certifications: Meta Back-end, Front-end, Python Developer",
  "Contact: CEO@ThisIsMusic.org | 615-604-0683 | linkedin.com/in/justin-puffpaff"
];

// Easter Eggs
const eggSection1 = document.getElementById('eggSection1'); // glitch cube
const eggSection2 = document.getElementById('eggSection2'); // grid orb
const eggSection5 = document.getElementById('eggSection5'); // full-screen glitch

if (eggSection1) eggSection1.style.display = "none";
if (eggSection2) eggSection2.style.display = "none";
if (eggSection5) eggSection5.style.display = "none";

// Listen for Enter in the terminal input
commandInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const raw = commandInput.value.trim();
    commandInput.value = '';
    processTerminalInput(raw);
  }
});

function processTerminalInput(raw) {
  let cmd = raw.toLowerCase();

  // If user typed rock/paper/scissors alone => python-game guess
  if (["rock","paper","scissors"].includes(cmd)) {
    cmd = `python-game ${cmd}`;
  }

  // If typed "snake", "pong", "invaders", "adventure" => start them
  if (cmd === "snake") {
    cmd = "python-snake start";
  } else if (cmd.startsWith("snake ")) {
    cmd = "python-snake " + cmd.slice(6);
  }

  if (cmd === "pong") {
    cmd = "python-pong start";
  } else if (cmd.startsWith("pong ")) {
    cmd = "python-pong " + cmd.slice(5);
  }

  if (cmd === "invaders") {
    cmd = "python-invaders start";
  } else if (cmd.startsWith("invaders ")) {
    cmd = "python-invaders " + cmd.slice(9);
  }

  if (cmd === "adventure") {
    cmd = "python-adventure start";
  } else if (cmd.startsWith("adventure ")) {
    cmd = "python-adventure " + cmd.slice(10);
  }

  // Easter Eggs
  if (cmd === "egg1") {
    cmd = "python-egg1 start";
  }
  if (cmd === "egg2") {
    cmd = "python-egg2 start";
  }
  if (cmd === "egg5") {
    cmd = "python-egg5 start";
  }

  handleCommand(cmd);
}

function handleCommand(cmd) {
  const parts = cmd.split(" ");
  const mainCmd = parts[0];
  const subCmd = parts.slice(1).join(" ");

  switch (mainCmd) {
    // --------------------------------------
    // TYPED RESUME COMMANDS
    // --------------------------------------
    case 'start':
      linesContainer.textContent += "\n> Starting resume typing...\n";
      if (!typingInterval) startTyping();
      paused = false;
      break;

    case 'pause':
      paused = true;
      linesContainer.textContent += "\n> Typing paused.\n";
      break;

    case 'continue':
      paused = false;
      linesContainer.textContent += "\n> Resuming typing...\n";
      break;

    case 'end':
      linesContainer.textContent += "\n> Riddle passcode prompt...\n";
      stopTyping();
      warningOverlay.style.display = 'flex';
      break;

    case 'help':
      linesContainer.textContent += "\nAvailable commands:\nstart, pause, continue, end, python-game, python-calc, python-snake, python-pong, python-invaders, python-adventure, egg1, egg2, egg5, clear, help\n";
      break;

    case 'clear':
      linesContainer.textContent = '';
      break;

    // --------------------------------------
    // PYTHON GAMES
    // --------------------------------------
    case 'wizard':
      runWizard(subCmd);
      break;
 
    case 'dnd':
      runPythonDnd(subCmd);
      break;

    case 'python-game':
      runPythonRPS(subCmd);
      break;

    case 'python-calc':
      runPythonCalc(subCmd);
      break;

    case 'python-snake':
      runPythonSnake(subCmd);
      break;

    case 'python-pong':
      runPythonPong(subCmd);
      break;

    case 'python-invaders':
      runPythonInvaders(subCmd);
      break;

    case 'python-adventure':
      runPythonAdventure(subCmd);
      break;

    // --------------------------------------
    // EASTER EGGS
    // --------------------------------------
    case 'python-egg1':
      runPythonEgg1(subCmd);
      break;

    case 'python-egg2':
      runPythonEgg2(subCmd);
      break;

    case 'python-egg5':
      runPythonEgg5(subCmd);
      break;

    // --------------------------------------
    // NO "Unknown command"
    // --------------------------------------
    default:
      // silently ignore invalid or misspelled commands
      break;
  }
}

function startTyping() {
  typingInterval = setInterval(() => {
    if (!paused) {
      if (currentLine < resumeLines.length) {
        if (currentChar < resumeLines[currentLine].length) {
          linesContainer.textContent += resumeLines[currentLine].charAt(currentChar);
          currentChar++;
        } else {
          linesContainer.textContent += "\n";
          currentLine++;
          currentChar = 0;
        }
        linesContainer.scrollTop = linesContainer.scrollHeight;
      } else {
        stopTyping();
      }
    }
  }, 50);
}

function stopTyping() {
  clearInterval(typingInterval);
  typingInterval = null;
}

// --------------------------------------
//  RUN Python code – WIZARD  (Wizard Game)
// --------------------------------------
async function runWizard(arg) {
  if (!pyodideReady) {
    pyPrint("> Pyodide not ready.");
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code = `
import game
js.pyPrint(game.wizard_action("${sub}"))
`;
    if (sub === "start") {
      code = `
import game
js.pyPrint(game.wizard_start())
`;
    }
    pyodide.runPython(code);
  } catch (err) {
    pyPrint("Error in Wizard game:\n" + err);
  }
}

// --------------------------------------
//  RUN Python code – RPS
// --------------------------------------
async function runPythonRPS(arg) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code;
    if (sub === "start") {
      code = `
import game
js.pyPrint(game.rps_start())
`;
    } else {
      code = `
import game
js.pyPrint(game.rps_guess("${sub}"))
`;
    }
    pyodide.runPython(code);
  } catch (err) {
    pyPrint("Error in python-game:\n" + err);
  }
}

// --------------------------------------
//  RUN Python code – D&D (Dice Roller)
// --------------------------------------
async function runPythonDnd(arg) {
  if (!pyodideReady) {
    pyPrint("> Pyodide not ready.");
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code;
    if (sub === "start") {
      code = `
import game
js.pyPrint(game.dnd_start())
`;
    } else {
      code = `
import game
js.pyPrint(game.dnd_action("${sub}"))
`;
    }
    pyodide.runPython(code);
  } catch (err) {
    pyPrint("Error in D&D:\n" + err);
  }
}

// --------------------------------------
//  RUN Python code – CALC
// --------------------------------------
async function runPythonCalc(expr) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const theExpr = expr.trim();
  try {
    redirectPyOutput();
    let code;
    if (!theExpr) {
      code = `
import game
js.pyPrint(game.calc())
`;
    } else {
      code = `
import game
js.pyPrint(game.calc_eval("${theExpr}"))
`;
    }
    pyodide.runPython(code);
  } catch (err) {
    pyPrint("Error in python-calc:\n" + err);
  }
}

// --------------------------------------
//  RUN Python code – SNAKE
// --------------------------------------
async function runPythonSnake(arg) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code;
    if (sub === "start") {
      code = `
import game
js.pyPrint(game.snake_start())
`;
    } else {
      code = `
import game
js.pyPrint(game.snake_move("${sub}"))
`;
    }
    pyodide.runPython(code);
  } catch (err) {
    pyPrint("Error in python-snake:\n" + err);
  }
}

// --------------------------------------
//  RUN Python code – PONG
// --------------------------------------
async function runPythonPong(arg) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code;
    if (sub === "start") {
      code = `
import game
js.pyPrint(game.pong_start())
`;
    } else {
      code = `
import game
js.pyPrint(game.pong_action("${sub}"))
`;
    }
    pyodide.runPython(code);
  } catch (err) {
    pyPrint("Error in python-pong:\n" + err);
  }
}

// --------------------------------------
//  RUN Python code – INVADERS
// --------------------------------------
async function runPythonInvaders(arg) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code;
    if (sub === "start") {
      code = `
import game
js.pyPrint(game.space_invaders_start())
`;
    } else {
      code = `
import game
js.pyPrint(game.space_invaders_action("${sub}"))
`;
    }
    pyodide.runPython(code);
  } catch (err) {
    pyPrint("Error in python-invaders:\n" + err);
  }
}

// --------------------------------------
//  RUN Python code – ADVENTURE
// --------------------------------------
async function runPythonAdventure(arg) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code;
    if (sub === "start") {
      code = `
import game
js.pyPrint(game.text_adventure_start())
`;
    } else {
      code = `
import game
js.pyPrint(game.text_adventure_action("${sub}"))
`;
    }
    pyodide.runPython(code);
  } catch (err) {
    pyPrint("Error in python-adventure:\n" + err);
  }
}

// --------------------------------------
//  EASTER EGGS
// --------------------------------------
async function runPythonEgg1(arg) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code = `
import game
js.pyPrint(game.egg1_start())
`;
    pyodide.runPython(code);

    if (eggSection1) {
      eggSection1.style.display = "block";
    }
    linesContainer.textContent += "\n> Easter Egg #1 revealed!\n";

  } catch (err) {
    pyPrint("Error in python-egg1:\n" + err);
  }
}

async function runPythonEgg2(arg) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code = `
import game
js.pyPrint(game.egg2_start())
`;
    pyodide.runPython(code);

    if (eggSection2) {
      eggSection2.style.display = "block";
    }
    linesContainer.textContent += "\n> Easter Egg #2 revealed!\n";

  } catch (err) {
    pyPrint("Error in python-egg2:\n" + err);
  }
}

async function runPythonEgg5(arg) {
  if (!pyodideReady) {
    linesContainer.textContent += "\n> Pyodide not ready.\n";
    return;
  }
  const sub = arg.trim() || "start";
  try {
    redirectPyOutput();
    let code = `
import game
js.pyPrint(game.egg5_start())
`;
    pyodide.runPython(code);

    if (eggSection5) {
      eggSection5.style.display = "block";
      // Hide it after 3 seconds
      setTimeout(() => {
        eggSection5.style.display = "none";
      }, 3000);
    }
    linesContainer.textContent += "\n> Easter Egg #5 triggered!\n";

  } catch (err) {
    pyPrint("Error in python-egg5:\n" + err);
  }
}

// --------------------------------------
//  PASSCODE RIDDLE
// --------------------------------------
const passcodeBtn = document.getElementById('passcodeBtn');
const passcodeInput = document.getElementById('passcodeInput');
const accessStatus = document.getElementById('accessStatus');

passcodeBtn.addEventListener('click', () => {
  const value = passcodeInput.value.trim().toLowerCase();
  // Riddle answer is "html"
  if (value === 'html') {
    warningOverlay.style.display = 'none';
    linesContainer.textContent += "\n> Correct answer! Riddle solved.\n";
  } else {
    accessStatus.textContent = 'Access Denied';
  }
});

// --------------------------------------
//  Helper: redirect Python stdout to JS
// --------------------------------------
function redirectPyOutput() {
  pyodide.runPython(`
import sys
import js
class TerminalWriter:
  def write(self, s):
    if s.strip():
      js.pyPrint(s.rstrip("\\n"))
sys.stdout = TerminalWriter()
sys.stderr = TerminalWriter()
`);
}

// --------------------------------------
//  PYTHON GAMES – WIZARD 
// --------------------------------------
function pyPrint(msg) {
  const line = document.createElement('div');
  
  if (msg.includes("Cavern of the Evil Wizard") || msg.includes("wizard") || msg.includes("HP")) {
    line.classList.add('wizard-message');
  }

  line.textContent = msg;
  linesContainer.appendChild(line);
  linesContainer.scrollTop = linesContainer.scrollHeight;
}
