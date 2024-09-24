//Create an array with all 12 semitones of the chromatic scale
//to be used in creating mode's scales
const chromaticScale = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
// Function that uses the mode's formula and a given tone to generate
// a musical scale
function generateScale(formula, tone) {
  for (let i = 0; i < formula.length; i++) {
    for (let j = i + 1; j < formula.length; j++) {
      if (formula[i].includes("#") && formula[j].includes("b")) {
        throw Error("Invalid Formula!");
      }
    }
  }

  const scale = [];
  const intervals = {
    "1": 0,
    "2": 2,
    "3": 4,
    "4": 5,
    "5": 7,
    "6": 9,
    "7": 11,
  };

  let toneIndex = chromaticScale.findIndex((element) => element.includes(tone));
  let step = 0;
  let semitones = 0;

  for (const musicInterval of formula) {
    if (musicInterval.length == 1) {
      step = intervals[musicInterval] - semitones;
    } else {
      step = intervals[musicInterval[1]] - semitones;
    }

    if (musicInterval.includes("b")) {
      step--;
    }
    if (musicInterval.includes("#")) {
      step++;
    }

    semitones += step;
    toneIndex += step;

    if (toneIndex >= chromaticScale.length) {
      toneIndex -= chromaticScale.length;
    }

    scale.push(chromaticScale[toneIndex]);
  }

  

  return scale;
}
// Function that generates names in music notation for chords in an array of chords 
function generateChordName(chords, formula) {
  const tones = {
    "1 3 5": "",
    "1 b3 5": "m",
    "1 3 #5": "+",
    "1 b3 b5": "°",
    "1 3 5 7": "M7",
    "1 3 5 b7": "7",
    "1 b3 5 b7": "m7",
    "1 3 #5 b7": "+7",
    "1 3b 5 7": "m(M7)",
    "1 b3 b5 b7": "m7(b5)",
  };
  const intervals = {
    "1": 0,
    "2": 2,
    "3": 4,
    "4": 5,
    "5": 7,
    "6": 9,
    "7": 11,
  };
  const chordNamed = [];

  for (const chord of chords) {
    let chordTones = "1";
    let tone = chord[0];
    let third = chord[1];
    let fifth = chord[2];
    let seventh = chord[3];

    let toneIndex = chromaticScale.findIndex((element) =>
      element.includes(tone)
    );
    let thirdIndex = chromaticScale.findIndex((element) =>
      element.includes(third)
    );
    let fifthIndex = chromaticScale.findIndex((element) =>
      element.includes(fifth)
    );
    let seventhIndex = chromaticScale.findIndex((element) =>
      element.includes(seventh)
    );

    if (thirdIndex < toneIndex) {
      thirdIndex += chromaticScale.length;
    }
    if (fifthIndex < toneIndex) {
      fifthIndex += chromaticScale.length;
    }
    if (seventhIndex < toneIndex) {
      seventhIndex += chromaticScale.length;
    }

    if (thirdIndex - toneIndex < intervals["3"]) {
      chordTones = chordTones + " b3";
    }
    if (thirdIndex - toneIndex > intervals["3"]) {
      chordTones = chordTones + " #3";
    }
    if (thirdIndex - toneIndex === intervals["3"]) {
      chordTones = chordTones + " 3";
    }

    if (fifthIndex - toneIndex < intervals["5"]) {
      chordTones = chordTones + " b5";
    }
    if (fifthIndex - toneIndex > intervals["5"]) {
      chordTones = chordTones + " #5";
    }
    if (fifthIndex - toneIndex === intervals["5"]) {
      chordTones = chordTones + " 5";
    }

    if (seventhIndex - toneIndex < intervals["7"]) {
      chordTones = chordTones + " b7";
    }
    if (seventhIndex - toneIndex > intervals["7"]) {
      chordTones = chordTones + " #7";
    }
    if (seventhIndex - toneIndex === intervals["7"]) {
      chordTones = chordTones + " 7";
    }

    let name = tone + tones[chordTones];
    chordNamed.push(name);
  }

  return chordNamed;
}
// Function that generates fundamental notes (Tone, 3rd, 5th, and 7th)
// for all notes in a given scale
function generateChord(scale) {
  const chordsScale = [];

  for (let i = 0; i < scale.length; i++) {
    const chord = [];
    chord.push(scale[i]);
    let next = i;

    for (let k = 0; k < 3; k++) {
      next += 2;

      if (next >= scale.length) next -= scale.length;

      chord.push(scale[next]);
    }

    chordsScale.push(chord);
  }

  return chordsScale;
}
// Function that shows the user a tone in the tone selector and generates all
// 7 music modes for this tone. Also, creates an event listener for the tone selector
// to allow the user to change the tone.
function init() {
  let angleUp = document.querySelector(".angle-up");
  let angleDown = document.querySelector(".angle-down");
  let tone = document.querySelector(".tone");
  let step = 0;

  tone.innerText = chromaticScale[step];
  generateModes();

  angleUp.addEventListener("click", () => {
    let newTone = document.createElement("h1");
    let tone = document.querySelector(".tone");

    if (chromaticScale.indexOf(tone.textContent) == chromaticScale.length - 1) {
      step = 0;
    } else {
      step++;
    }

    newTone.textContent = chromaticScale[step];
    newTone.className = "tone";

    tone.parentNode.replaceChild(newTone, tone);
    generateModes();
  });

  angleDown.addEventListener("click", () => {
    let newTone = document.createElement("h1");
    let tone = document.querySelector(".tone");

    step--;

    if (step == -1) {
      step += chromaticScale.length;
    }

    newTone.textContent = chromaticScale[step];
    newTone.className = "tone";

    tone.parentNode.replaceChild(newTone, tone);
    generateModes();
  });
}
// Function that generates the table of all 7 music modes and shows it to the user
function generateModes() {
  const modes = [
    { name: "Ionian", formula: ["1", "2", "3", "4", "5", "6", "7"] },
    { name: "Dorian", formula: ["1", "2", "b3", "4", "5", "6", "b7"] },
    { name: "Phrygian", formula: ["1", "b2", "b3", "4", "5", "b6", "b7"] },
    { name: "Lydian", formula: ["1", "2", "3", "#4", "5", "6", "7"] },
    { name: "Mixolydian", formula: ["1", "2", "3", "4", "5", "6", "b7"] },
    { name: "Aeolian", formula: ["1", "2", "b3", "4", "5", "b6", "b7"] },
    { name: "Locrian", formula: ["1", "b2", "b3", "4", "b5", "b6", "b7"] },
  ];

  let tone = document.querySelector(".tone").innerText;
  let table = document.createElement("table");
  table.className = "table";

  for (const mode of modes) {
    let tableRow = document.createElement("tr");
    let modeTitle = document.createElement("td");
    modeTitle.className = "mode-title";

    modeTitle.innerHTML = mode.name;
    tableRow.appendChild(modeTitle);

    let scale = generateScale(mode.formula, tone);
    let chords = generateChordName(generateChord(scale), mode.formula);

    for (const chord of chords) {
      let chordTd = document.createElement("td");
      chordTd.innerHTML = chord;
      tableRow.appendChild(chordTd);
    }

    table.appendChild(tableRow);
  }

  let oldTable = document.querySelector("table");

  if (oldTable) {
    document.body.replaceChild(table, oldTable);
  } else {
    document.body.appendChild(table);
  }
}
