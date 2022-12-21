let results = localStorage.getItem('results10') == undefined ? null : JSON.parse(localStorage.getItem('results10'));
let puzzleNow;
let size = 4;
let blocksArray;
let mode = 'stop';
let time = 0;
let timeStart;
let moveCount = 0;
let emptyPosition;
let resultsDOM;
const body = document.querySelector('body');
let header;
let buttons;
let info;
let main;
let field;
let fieldSizeSelect;
let pauseText;





function createDocument() {
    const soundElement = document.createElement('div');
    soundElement.innerHTML = `<audio class="audio" " src="../sound.mp3"></audio>`;
    const sound = document.createElement('button');
    sound.classList.add('sound');
    sound.classList.add('on');
    sound.innerHTML = `<i class="material-icons">volume_down</i>`;

    sound.addEventListener('click', () => {
        if (sound.classList.contains('on')) {
            sound.classList.remove('on');
            sound.innerHTML = `<i class="material-icons">volume_off</i>`;
        } else {
            playSound();
            sound.classList.add('on');
            sound.innerHTML = `<i class="material-icons">volume_down</i>`;
        }
    });




    header = document.createElement('header');
    header.className = 'header';
    header.id = 'header';

    buttons = document.createElement('div');
    buttons.className = 'buttons';
    buttons.id = 'buttons';

    buttons.innerHTML = `
		<div class="button" id="startButton">New Game</div>
		<div class="button" id="pauseButton">${mode === 'stop' ? 'Pause' : 'Continue'}</div>
		<div class="button" id="saveButton">Save</div>
		<div class="button" id="resultsButton">Results</div>`;

    info = document.createElement('div');
    info.className = 'info';

    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);

    info.innerHTML = `<label class="label__text">Turns:</label>
	<label class="label__value" id='moveCountValue'>${moveCount}</label>
	<label class="label__text">Time:</label>
	<label class="label__value" id='timeValue'>${minutes}:${seconds}</label>`;

    field = document.createElement('main');
    field.id = 'field';

    resultsDOM = document.createElement('div');
    resultsDOM.className = 'resultsBG';
    resultsDOM.innerHTML = `
    <div class='table'>
        <div class='table__button'>
            <div class='congratulations' id='congratulations'></div>
            <input type="button" onclick='closeResults()' value='X'>
        </div>
        <div class='table__content'>
            <div class='table__part' id="tableLeftPart">
            </div>
            <div class='table__part' id='tableRightPart'>
            </div>
        </div>
		</div>`;

    pauseText = document.createElement('div');
    pauseText.className = 'pause__text';
    pauseText.innerText = 'GAME PAUSED';


    fieldSizeSelect = document.createElement('select');
    fieldSizeSelect.addEventListener('change', () => {
        changeSize(fieldSizeSelect.value);
    });

    for (let i = 3; i <= 8; i++) {
        let option = document.createElement('option');
        if (i === size) {
            option.selected = true;
        }
        option.innerText = `${i}x${i}`;
        option.value = i + '';
        fieldSizeSelect.appendChild(option);
    }


    info.appendChild(soundElement);
    info.appendChild(fieldSizeSelect);
    info.appendChild(sound);
    header.appendChild(buttons);
    header.appendChild(info);
    body.appendChild(header);
    body.appendChild(field);
    body.appendChild(pauseText);
    body.appendChild(resultsDOM);

    buttons.addEventListener('click', function (event) {
        let target = event.target;
        switch (target.id) {
            case 'startButton':
                startGame();
                break;
            case 'pauseButton':
                pauseStart();
                break;
            case 'saveButton':
                save();
                break;
            case 'resultsButton':
                showResults();
                break;
        }
    });
    let tables = document.getElementsByTagName('select'),
        length = tables.length,
        i, wrapper;

    for (i = 0; i < length; i++) {
        wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'box');
        tables[i].parentNode.insertBefore(wrapper, tables[i]);
        wrapper.appendChild(tables[i]);
    }

    field.onmousedown = (event) => {
        let target = event.target; // где был клик?
        if (target.id !== 'field' && mode == 'start' && event.which == 1) {
            let posMouseDownX = event.clientX;// будем выводить горизонтальные координаты относительно окна браузера
            let posMouseDownY = event.clientY;// будем выводить вертикальные координаты относительно окна браузера

            let positionNow = Number.parseInt(target.id); //принимает строку в качестве аргумента и возвращает целое число
            let newPosition = Number.parseInt(emptyPosition);
            let block = blocksArray[target.id];
            let blockHeight = field.offsetWidth / size;
            let changePosition = function () {
                target.style.transition = 'top 0.2s linear, left 0.2s linear';
                document.onmousemove = null;
                document.onmouseup = null;
                moveCount++;
                document.getElementById('moveCountValue').innerText = moveCount;
                emptyPosition = target.id;
                target.id = newPosition;
                blocksArray[target.id] = block;
                blocksArray[emptyPosition] = null;
                target.style.left = block.x * blockHeight + 'px';
                target.style.top = block.y * blockHeight + 'px';
                if (sound.classList.contains('on')) {
                    playSound();
                };
                isFinished();
            };


            if (positionNow + 1 === newPosition && block.x < size - 1) {
                document.onmouseup = function () {
                    block.x++;
                    changePosition();

                };
                document.onmousemove = function (event1) {
                    target.style.transition = 'top 0.2s linear, left 0.2s linear';
                    let newPosMouseX = event1.clientX;
                    let distance = newPosMouseX - posMouseDownX;
                    distance = distance > 0 ? distance < blockHeight + 1 ? distance : blockHeight : 0;
                    target.style.left = block.x * blockHeight + distance + 'px';
                };

            } else if (positionNow - 1 === newPosition && block.x > 0) {
                document.onmouseup = function () {
                    block.x--;
                    changePosition();
                };
                document.onmousemove = function (event1) {
                    target.style.transition = 'top 0.2s linear, left 0.2s linear';
                    let newPosMouseX = event1.clientX;
                    let distance = posMouseDownX - newPosMouseX;
                    distance = distance > 0 ? distance < blockHeight + 1 ? distance : blockHeight : 0;
                    target.style.left = block.x * blockHeight - distance + 'px';
                };


            } else if (positionNow + size === newPosition) {
                document.onmouseup = function () {
                    block.y++;
                    changePosition();
                };
                document.onmousemove = function (event1) {
                    target.style.transition = 'top 0.2s linear, left 0.2s linear';
                    let newPosMouseY = event1.clientY;
                    let distance = newPosMouseY - posMouseDownY;
                    distance = distance > 0 ? distance < blockHeight + 1 ? distance : blockHeight : 0;
                    target.style.top = block.y * blockHeight + distance + 'px';
                };

            } else if (positionNow - size === newPosition) {
                document.onmouseup = function () {
                    block.y--;
                    changePosition();
                };
                document.onmousemove = function (event1) {
                    target.style.transition = 'top 0.2s linear, left 0.2s linear';
                    let newPosMouseY = event1.clientY;
                    let distance = posMouseDownY - newPosMouseY;
                    distance = distance > 0 ? distance < blockHeight + 1 ? distance : blockHeight : 0;
                    target.style.top = block.y * blockHeight - distance + 'px';
                };
            }
        }
    };

}

function playSound() {
    const audio = document.querySelector('.audio');
    if (!audio) return;
    audio.play();
};




function changeSize(n) {
    clearTimer();
    size = Number.parseInt(n);
    pauseStart('stop');
    createBlocksArray();
    createField();
};

function createBlocksArray() {
    blocksArray = {};
    for (let i = 0, k = 0; i < size; i++) {
        for (let j = 0; j < size && k < size * size - 1; j++, k++) {
            let value = i * size + j + 1;
            blocksArray[value] = { x: j, y: i, value: value }
        }
    }
    blocksArray[size * size] = null;
};

function createField() {
    field.innerHTML = "";
    field.style.height = field.offsetWidth + 'px';
    let blockHeight = field.offsetWidth / size;
    let randPic = Math.floor(Math.random() * 21);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (blocksArray[i * size + j + 1] != null) {
                let blockInArray = blocksArray[i * size + j + 1];
                let block = document.createElement('div');
                block.className = 'block';
                block.innerText = blockInArray.value;
                block.id = i * size + j + 1 + '';
                block.style.background = `url(../img/${randPic}.jpg)`
                block.style.height = blockHeight - 3 + 'px';
                block.style.width = blockHeight - 3 + 'px';
                block.style.fontSize = blockHeight * 0.33 + 'px';
                block.style.left = blockInArray.x * blockHeight + 'px';
                block.style.top = blockInArray.y * blockHeight + 'px';
                block.style.backgroundPosition = `left -${block.style.left} top -${block.style.top}`
                block.style.backgroundSize = '720px';
                block.style.zIndex = blockInArray.value + 10 + '';
                field.appendChild(block);
            }
        }
    }

}


function startGame() {
    clearTimer();
    createBlocksArray();
    pauseStart('start');
    localStorage.removeItem('puzzleNow');
    let aimArray = [];
    emptyPosition = size * size;
    for (let i = 1; i < size * size; i++) {
        aimArray.push(i);
    }
    for (let i = 0, k = 0; i < size; i++) {
        for (let j = 0; j < size && k < size * size - 1; j++, k++) {
            let rand = Math.floor(Math.random() * (aimArray.length));
            blocksArray[i * size + j + 1].value = aimArray[rand];
            aimArray.splice(rand, 1);
        }

    }

    createField();
    checkNormalField();
    timerInterval();


}

//to start game
function startNewGame() {
    menu.innerHTML = 'New Game';
    //shuffle and check if it's solvable
    random = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].sort(() => Math.random() - 0.5);
    console.log('random array: ', random);
    let sum = 0;
    let row = empty.top / keySize + 1;
    for (let i = 0; i < random.length; i++) {

        let k = i + 1;
        while (k < random.length) {
            if (random[k] < random[i]) {
                sum = sum + 1;
            };
            k++;
        };
        console.log(`random[i] = ${random[i]}, sum = ${sum}`);

    };
    sum = sum + row;
    console.log(`row is: ${row}`);
    console.log('sum is: ', sum);
    if (sum % 2 !== 0) {
        //if not solvable, randomize again
        startNewGame();
    };

    //change html with our random numbers
    newGameLayout();
    // put down counter
    //countDown();
};



function checkNormalField() {
    let array = [];
    for (let i = 0, k = 1; i < size; i++) {
        let subArray = [];
        for (let j = 0; j < size; j++, k++) {
            subArray.push(blocksArray[k]);
        }
        array.push(subArray);
    }
    let wrongCount = 0;

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length - 1; j++) {
            for (let k = j + 1; k < array[i].length; k++) {
                if (array[i][j] != null && array[i][k] != null && array[i][j].value > array[i][k].value) {
                    wrongCount++;
                }
            }
        }
    }
    if (wrongCount % 2 != 0) {
        let block = array[0][size - 1].value;
        array[0][size - 1].value = array[0][size - 2].value;
        array[0][size - 2].value = block;
    }
    wrongCount = 0;

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length - 1; j++) {
            for (let k = j + 1; k < array[i].length; k++) {
                if (array[i][j] != null && array[i][k] != null && array[i][j].value > array[i][k].value) {
                    wrongCount++;
                }
            }
        }
    }
}

function pauseStart(newMode) {
    if (newMode === undefined) {
        mode = mode === 'stop' ? mode : mode === 'start' ? 'pause' : 'start';
    } else {
        mode = newMode;
    }
    if (mode === 'pause') {
        field.style.display = 'none';
        pauseText.style.display = 'block';
        document.getElementById('pauseButton').innerText = 'Start';

    } else if (mode === 'start') {
        timerInterval();
        field.style.display = 'block';
        pauseText.style.display = 'none';
        document.getElementById('pauseButton').innerText = 'Pause'
    }
}

function timerInterval() {
    timeStart = new Date().getTime();
    let timer = setInterval(function () {
        if (mode !== 'start') {
            time += new Date().getTime() - timeStart;
            clearInterval(timer);
        }
        else {
            let distance = new Date().getTime() - timeStart + time;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (seconds < 10) {
                document.getElementById("timeValue").innerText = `${minutes} : 0${seconds}`;

            } else {
                document.getElementById("timeValue").innerText = `${minutes} : ${seconds}`;
            }
        }
    }, 1000);

}


function save() {
    if (mode !== 'stop') {
        puzzleNow = {
            blocksArray: blocksArray,
            time: time + new Date().getTime() - timeStart,
            moveCount: moveCount,
            size: size,
            emptyPosition: emptyPosition
        };
        localStorage.setItem('puzzleNow', JSON.stringify(puzzleNow));
    }

}


function showResults() {
    resultsDOM.style.display = 'flex';
    let bestTime = document.getElementById('tableLeftPart');
    let bestMove = document.getElementById('tableRightPart');

    bestTime.innerHTML = `<div class='table__header'>Best Time</div>`;
    bestMove.innerHTML = `<div class='table__header'>Best Moves</div>`;

    if (results !== null) {
        for (let i = 0; i < results.bestMove.length; i++) {
            let element = document.createElement('div');
            let minutes = Math.floor((results.bestMove[i].time % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((results.bestMove[i].time % (1000 * 60)) / 1000);

            element.innerText = `Time ${minutes} : ${seconds}, Moves ${results.bestMove[i].move} (${results.bestMove[i].size}x${results.bestMove[i].size})`;
            if (i % 2 === 0) {
                element.className = 'even';
            }
            bestMove.appendChild(element);
        }
        for (let i = 0; i < results.bestTime.length; i++) {
            let element = document.createElement("div");
            let minutes = Math.floor((results.bestTime[i].time % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((results.bestTime[i].time % (1000 * 60)) / 1000);

            element.innerText = `Time ${minutes} : ${seconds}, Moves ${results.bestTime[i].move} (${results.bestTime[i].size}x${results.bestTime[i].size})`;
            if (i % 2 == 0) {
                element.className = 'even';
            }
            bestTime.appendChild(element);
        }
    }
}

function isFinished() {
    // let finish = true;
    if (emptyPosition == size * size) {
        let finish = true;
        for (let i = 1; i < size * size - 1 && finish === true; i++) {
            if (blocksArray[i].value != i) {
                finish = false;
                break;
            }
        }
        if (finish) {
            time += new Date().getTime() - timeStart;
            let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((time % (1000 * 60)) / 1000);
            document.getElementById('congratulations').innerText =
                `Oh yeah! You solved the puzzle in ${minutes} : ${seconds} and ${moveCount} moves`;
            document.getElementById('congratulations').animate([
                // keyframes
                { transform: 'translate(0)' },
                { color: 'red' },
                { transform: 'rotate(0deg) scale(1.027) skew(1deg) translate(0px)' },
                { color: 'blue' },
                { transform: 'rotate(0deg) scale(1.193) skew(1deg) translate(0px)' },
                { color: 'green' },
                { transform: 'rotate(0deg) scale(0) skew(0) translate(0px);' },
                { color: 'yellow' }

            ], {
                // timing options
                duration: 2000,
                iterations: Infinity
            });
            writeResults();
            showResults();
            clearTimer();
            pauseStart('stop')
        }
    }
}

function clearTimer() {
    moveCount = 0;
    document.getElementById('moveCountValue').innerText = moveCount;
    time = 0;
    document.getElementById('timeValue').innerText = `0 : 00`;
}

if (localStorage.getItem('puzzleNow')) {
    puzzleNow = JSON.parse(localStorage.getItem('puzzleNow'));
    size = puzzleNow.size;
    time = puzzleNow.time;
    moveCount = puzzleNow.moveCount;
    blocksArray = puzzleNow.blocksArray;
    emptyPosition = puzzleNow.emptyPosition;
}





createDocument();


if (puzzleNow === undefined) {
    changeSize(size);
}
else {
    createField();
    pauseStart('pause');
}

window.onresize = function () {
    createField();
};

function closeResults() {
    document.getElementById('congratulations').innerText = '';
    resultsDOM.style.display = 'none';
}

function writeResults() {
    if (results === null) {
        results = {
            bestTime: [{ time: time, move: moveCount, size: size }],
            bestMove: [{ time: time, move: moveCount, size: size }]
        };
    }
    else {
        if (results.bestTime.length < 10) {
            results.bestTime.push({ time: time, move: moveCount, size: size });
        }
        else {
            let max = 0;
            for (let i = 0; i < results.bestTime.length; i++) {
                if (results.bestTime[i].time > results.bestTime[max].time) {
                    max = i;
                }
            }
            if (time < results.bestTime[max].time) {
                results.bestTime[max] = { time: time, move: moveCount, size: size };
            }
        }
        if (results.bestMove.length < 10) {
            results.bestMove.push({ time: time, move: moveCount, size: size });
        }
        else {
            let max = 0;
            for (let i = 0; i < results.bestMove.length; i++) {
                if (results.bestMove[i].move > results.bestMove[max].move) {
                    max = i;
                }
            }
            if (moveCount < results.bestMove[max].move) {
                results.bestMove[max] = { time: time, move: moveCount, size: size };
            }
        }
    }
    localStorage.setItem('results10', JSON.stringify(results));
}

