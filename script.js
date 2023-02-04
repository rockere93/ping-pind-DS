'use strict'
let player = document.querySelector(".player");
let enemy = document.querySelector(".enemy");
let ball = document.querySelector('.ball');
let field = document.querySelector('.gamefield');
let startWindow = document.querySelector('.startWindow');
let pointsWindow = document.querySelector('.points');
let pointsOfPlayer = document.getElementById('playerPoints');
let pointsOfEnemy = document.getElementById('enemyPoints');
let died = document.querySelector('.died');
let win = document.querySelector('.win');
let startText = document.querySelector('.startText');
let continueText = document.querySelector('.continueText');
let positionOfPlayer;
let positionOfEnemy;
let animationOfEnemy;
let gameOnOff;
let clearBlinkAnimation;
let ballPositionLeft = transformPxToNumber(getComputedStyle(ball).left);
let ballPositionTop = transformPxToNumber(getComputedStyle(ball).top);

/* ________Размеры элементов под конкретный экран______________ */

let racketWidth = transformPxToNumber(getComputedStyle(player).width);
let fieldWidth = transformPxToNumber(getComputedStyle(field).width);
let ballWidth = transformPxToNumber(getComputedStyle(ball).width);
let fieldHeight = transformPxToNumber(getComputedStyle(field).height);
let racketHeight = transformPxToNumber(getComputedStyle(player).height);


/* ________Игровые настройки______________ */
let msSpeedAnimationBall = 3;
let sizeStepBall = 1;
let speedMoveBallTop = getRandomIntInclusive(3 * sizeStepBall, 7 * sizeStepBall);
let speedMoveBallLeft = 15 * sizeStepBall;
let ballStepSizeLeft = (speedMoveBallLeft * fieldHeight / 10000).toFixed(1);
let ballStepSizeTop = (speedMoveBallTop * fieldHeight / 10000 * randomDirectionBall()).toFixed(1);


/* __________Адаптация анимации для Firefox____________ */
if (navigator.userAgent.indexOf("Firefox") > -1) {
    msSpeedAnimationBall = 9;
    sizeStepBall = 3;
    speedMoveBallTop = getRandomIntInclusive(3 * sizeStepBall, 7 * sizeStepBall);
    speedMoveBallLeft = 15 * sizeStepBall;
    ballStepSizeLeft = (speedMoveBallLeft * fieldHeight / 10000).toFixed(1);
    ballStepSizeTop = (speedMoveBallTop * fieldHeight / 10000 * randomDirectionBall()).toFixed(1);
};




/* ________Адаптация под размер окна______________ */

window.addEventListener("resize", function () {
    racketWidth = transformPxToNumber(getComputedStyle(player).width);
    fieldWidth = transformPxToNumber(getComputedStyle(field).width);
    ballWidth = transformPxToNumber(getComputedStyle(ball).width);
    fieldHeight = transformPxToNumber(getComputedStyle(field).height);
    racketHeight = transformPxToNumber(getComputedStyle(player).height);
    ballStepSizeLeft = speedMoveBallLeft * fieldHeight / 10000;
    ballStepSizeTop = speedMoveBallTop * fieldHeight / 10000 * randomDirectionBall();
})


/* ________Трансформации ______________ */

function transformVhToPx(numberValue) {
    return fieldWidth / 100 * numberValue
}

function randomDirectionBall() {
    let randomNumber = getRandomIntInclusive(-1, 1);
    do {
        randomNumber = getRandomIntInclusive(-1, 1);
    } while (randomNumber === 0);
    return randomNumber
}

function transformPxToNumber(styleValue) {
    let string = styleValue.length;
    let i = string - 2;
    return Number(styleValue.slice(0, i));
}



function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random() * (max - min + 1)) + min);
};



/* ________Движение ракеток______________ */


function moveRacketDown(stepInPx, racket) {
    let position = transformPxToNumber(getComputedStyle(racket).top);
    if (Math.floor(position) <= Math.floor(fieldHeight - racketHeight) && Math.ceil(position + racketHeight + stepInPx) < fieldHeight * 0.985 /* из-за ширины border */) {
        position += stepInPx;
        position += "px";
        racket.style.top = position;
    } else {
        racket.style.top = Math.ceil(fieldHeight - racketHeight);
    }
}

function moveRacketUp(stepInPx, racket) {
    let position = transformPxToNumber(getComputedStyle(racket).top);
    if (position >= 0 + stepInPx) {
        position -= stepInPx;
        position += "px";
        racket.style.top = position;
    } else {
        racket.style.top = 0;
    }
}

function returnOlayersCenter() {
    player.style.top = '45vh';
    enemy.style.top = '45vh'
}

/* ________Управление игрока ______________ */

document.addEventListener('keydown', function (event) {
    if (event.code == "ArrowDown") {
        moveRacketDown(transformVhToPx(1.8), player);
    }
    else if (event.code == "ArrowUp") {
        moveRacketUp(transformVhToPx(1.8), player);
    }
});


/* ________Поведение противника ______________ */


function enemyMovers() {
    let ballPositionTop = transformPxToNumber(getComputedStyle(ball).top);
    let enemyPositionTop = transformPxToNumber(getComputedStyle(enemy).top);

    if (ballPositionTop > enemyPositionTop + racketHeight) {
        moveRacketDown(transformVhToPx(0.5), enemy);
    } else if (ballPositionTop < enemyPositionTop + racketHeight / 2) {
        moveRacketUp(transformVhToPx(0.5), enemy);
    }
}

function enemyOnOff(onOff) {
    clearInterval(animationOfEnemy);
    animationOfEnemy = null;
    if (onOff === 'on') {
        animationOfEnemy = setInterval(enemyMovers, 25);
    } else if (onOff === 'off') {
        clearInterval(animationOfEnemy);
        animationOfEnemy = null;
    }
}

/* ________Контроль меню ______________ */

function addPointSubject(subjectPoints) {
    let pointsPlayer = subjectPoints.textContent;
    pointsPlayer = Number(pointsPlayer) + 1;
    subjectPoints.textContent = pointsPlayer;
}

function disabledWindowsMenu() {
    if (startWindow.classList.contains('disabled') === false) {
        startWindow.classList.add('disabled');
    } else if (pointsWindow.classList.contains('disabled') === false) {
        pointsWindow.classList.add('disabled');
    };
}

function activationWindowPoints() {
    pointsWindow.classList.remove("disabled");
    clearBlinkAnimation = setInterval(blinkAnimation, 600, continueText)
}

function changeTextWindowPoints(winOrDied) {
    switch (winOrDied) {
        case "win":
            win.classList.remove('disabled');
            died.classList.add('disabled');
            break
        case "died":
            died.classList.remove('disabled');
            win.classList.add('disabled')
    }
}

function blinkAnimation(element) {
    if (element.classList.contains('disabled')) {
        element.classList.remove('disabled')
    } else {
        element.classList.add('disabled')
    }
}



/* ________________________________Поведение мяча ___________________________________*/

/* ________Движение мяча ______________ */


function ballMove(top, left, ballPositionLeft, ballPositionTop) {
    ballPositionLeft -= left;
    ball.style.left = ballPositionLeft + 'px';
    ballPositionTop -= top;
    ball.style.top = ballPositionTop + 'px';
};

function changeDirectionHit() {
    ballStepSizeLeft *= -1;
    ballStepSizeLeft = ballStepSizeLeft.toFixed(1);
}

function returnBallCenter() {
    ball.style.top = '50vh';
    ball.style.left = '50vh';
}

    /* ________Фиксатор отскока и пропуска мяча ______________ */

function hitTheBall(ballPositionTop, ballPositionLeft) {
    let enemyPositionTop = transformPxToNumber(getComputedStyle(enemy).top);
    let playerPositionTop = transformPxToNumber(getComputedStyle(player).top);

    /* ________Фиксатор отражения или пропуска мяча слева______________ */

    if (Number(ballPositionLeft.toFixed(1)) <= Number(racketWidth.toFixed(1))) {

        if (Number(ballPositionTop.toFixed(1)) > Number((playerPositionTop - ballWidth * 2).toFixed(1)) && Number(ballPositionTop.toFixed(1)) < Number((playerPositionTop + racketHeight + ballWidth / 2).toFixed(1))) {
            return 'playerHit';
        } else {
            return 'playerFall'
        }

    }
    /* ________Фиксатор отражения или пропуска мяча справа______________ */

    else if (Math.floor(ballPositionLeft) >= Math.floor(fieldWidth - racketWidth - ballWidth * 2)) {
        if (Math.floor(ballPositionTop) > Math.ceil(enemyPositionTop - ballWidth / 2) && Math.floor(ballPositionTop) < Math.ceil(enemyPositionTop + racketHeight + ballWidth / 2)) {
            return 'enemyHit';
        } else {
            return 'enemyFall'
        }
    }
    else {
        return false
    }
}

    /* ________Измение траектории мяча при ударе ракеткой______________ */


function getPlaceContactRacketWithBall(racket, ballPositionTop) {
    let racketPosition = transformPxToNumber(getComputedStyle(racket).top);
    let pointHit = Math.floor(ballPositionTop - racketPosition);
    return Math.round(pointHit / ballWidth);

}

function setDirectionHit(coeffic, reflect) {
    ballStepSizeLeft *= -1;
    ballStepSizeLeft = ballStepSizeLeft.toFixed(1);
    ballStepSizeTop = coeffic * fieldHeight / 10000 * reflect;
    ballStepSizeTop = ballStepSizeTop.toFixed(1);
}

function hitBallChangeDirection(racket, ballPositionTop) {
    switch (getPlaceContactRacketWithBall(racket, ballPositionTop)) {
        case 0:
            setDirectionHit(7 * sizeStepBall, -1);
            break
        case 1:
            setDirectionHit(5 * sizeStepBall, -1);
            break
        case 2:
            setDirectionHit(3 * sizeStepBall, -1);
            break
        case 3:
            setDirectionHit(3 * sizeStepBall, 1);
            break
        case 4:

            setDirectionHit(5 * sizeStepBall, 1);
            break
        case 5:
            setDirectionHit(7 * sizeStepBall, 1);
            break
    }


}

/* ________Звук при отражении ракеткой______________ */

function ston1() {
    let audio = new Audio();
    audio.src = 'sound/ston1.wav'; 
    audio.autoplay = true; 
}

function ston2() {
    let audio = new Audio(); 
    audio.src = 'sound/ston2.wav'; 
    audio.autoplay = true; 
}

function ston3() {
    let audio = new Audio(); 
    audio.src = 'sound/ston3.wav'; 
    audio.autoplay = true; 
}

function ston4() {
    let audio = new Audio(); 
    audio.src = 'sound/ston4.mp3'; 
    audio.autoplay = true; 
}




/* ________Все взаимодействия мяча______________ */

function ballMoveAnimation() {
    ballPositionLeft = transformPxToNumber(getComputedStyle(ball).left);
    ballPositionTop = transformPxToNumber(getComputedStyle(ball).top);

    switch (hitTheBall(ballPositionTop, ballPositionLeft)) {
        case 'playerHit':
            hitBallChangeDirection(player, ballPositionTop);
            ball.style.left = racketWidth * 1.3 + 'px';
            ballPositionLeft = racketWidth * 1.3;
            ballMove(ballStepSizeTop, ballStepSizeLeft, ballPositionLeft, ballPositionTop);
            ston1();
            enemyOnOff('on');

            return setTimeout(ballMoveAnimation, msSpeedAnimationBall, ballStepSizeTop, ballStepSizeLeft)
        case 'enemyHit':
            changeDirectionHit()
            ballPositionLeft = fieldWidth - racketWidth * 3;
            ballMove(ballStepSizeTop, ballStepSizeLeft, ballPositionLeft, ballPositionTop);
            ston2();
            enemyOnOff('off');
            return setTimeout(ballMoveAnimation, msSpeedAnimationBall, ballStepSizeTop, ballStepSizeLeft)
        case 'playerFall':
            ston3();
            addPointSubject(pointsOfEnemy);
            returnBallCenter();
            changeDirectionHit();
            clearInterval(gameOnOff);
            document.addEventListener('keydown', gameStart);
            changeTextWindowPoints('died');
            activationWindowPoints();
            enemyOnOff('on');
            returnOlayersCenter()
            break
        case 'enemyFall':
            ston4();
            addPointSubject(pointsOfPlayer);
            returnBallCenter()
            changeDirectionHit();
            clearInterval(gameOnOff);
            document.addEventListener('keydown', gameStart);
            changeTextWindowPoints('win');
            activationWindowPoints();
            enemyOnOff('off');
            returnOlayersCenter()
            break

        /* ________Отражение мяча сверху и снизу ______________ */

        case false:
            if (Math.floor(ballPositionTop) <= 1 || Math.floor(ballPositionTop) >= Math.floor(fieldWidth - ballWidth * 2)) {
                ballStepSizeTop *= -1;
                ballStepSizeTop = ballStepSizeTop.toFixed(1);
                ballMove(ballStepSizeTop, ballStepSizeLeft, ballPositionLeft, ballPositionTop);
                return setTimeout(ballMoveAnimation, msSpeedAnimationBall, ballStepSizeTop, ballStepSizeLeft)
            }

            else { ballMove(ballStepSizeTop, ballStepSizeLeft, ballPositionLeft, ballPositionTop) };
            return setTimeout(ballMoveAnimation, msSpeedAnimationBall, ballStepSizeTop, ballStepSizeLeft)

    }
}


/* ________Запуск игры ______________ */

function gameStart(evt) {
    if (evt.code == "Space") {
        disabledWindowsMenu();
        gameOnOff = setTimeout(ballMoveAnimation, msSpeedAnimationBall, ballStepSizeTop, ballStepSizeLeft);
        document.removeEventListener('keydown', gameStart);
        clearInterval(clearBlinkAnimation);
    }
}

document.addEventListener('keydown', gameStart);
clearBlinkAnimation = setInterval(blinkAnimation, 600, startText);