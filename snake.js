document.addEventListener('DOMContentLoaded', function() {
    // Глобальная область видимости
    window.scope = scope || {};

    // Canvas плюшки
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    // Размеры ячеек змеи и "еды"
    var cw = 10,
        speed = 1,
        gameLoop,
        d,
        food,
        score,
        time = 0,
        maxTime = 10,
        scoreResult = 0;

    // Создаем змею
    var snakeArray;

    function createSnake() {
        var length = 5;
        snakeArray = [];
        for (var i = length-1; i >= 0; i--) {
            snakeArray.push({x: i, y: 0});
        }
    }

    // Создаем рандомно пищу для змеи
    function createFood() {
        food = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
        };
        scoreResult = 100 - Math.floor(time * (100 / maxTime));
        if (time >= maxTime) {
            scoreResult = 10;
        }
        console.log(scoreResult);
        time = 0;
    }

    // Инициализация всех елементов
    function init(selectedSpeed) {
        speed = selectedSpeed || speed;
        d = "right";
        score = 0;
        createSnake();
        createFood();
        // Движение змеи
        if (typeof gameLoop != "undefined") clearInterval(gameLoop);
        gameLoop = setInterval(paint, (250 / speed));
    }

    init();

    // Рисуем змею
    function paint() {

        // Рисуем фон canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, w, h);

        // Движение змеи (увеличивая координаты)
        var nx = snakeArray[0].x;
        var ny = snakeArray[0].y;

        if (d == "right") nx++;
        else if (d == "left") nx--;
        else if (d == "up") ny--;
        else if (d == "down") ny++;

        // Перезапуск игры в случае столкновение с границами или самой змеей
        if (nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || checkCollision(nx, ny, snakeArray)) {
            if (getCookie('score') < score) {
                document.cookie = "score=" + score;
                userInfoScore.innerHTML = score;
                API.updateScore(score);
                console.log(1);
                scope.createTableList(true);
            }
            init();
            return;
        }

        // Удаляем (каждый запуск paint функции) ячейку в конце и добавляем ее в начало меняя координаты
        // Также проверяем если первый елемент массива (голова змеи)
        // соответствует координатам "еды" для змеи то не удаляем ячейку в "хвосте"
        var tail;
        if (nx == food.x && ny == food.y) {

            tail = {x: nx, y: ny};
            score += 100;
            // Создаем новуе "еду" если голова змеи "съела" ее (координаты первого элемента массива совпали с рандомной "едой")
            createFood();

            setInterval(function() {
                time++;
            }, 1000);
        } else {
            tail = snakeArray.pop();
            tail.x = nx; tail.y = ny;
        }

        snakeArray.unshift(tail);

        for (var i = 0; i < snakeArray.length; i++) {
            var c = snakeArray[i];
            paintCell(c.x, c.y, 'red');
            paintCell(food.x, food.y, 'green');
        }

        var scoreText = "Счет: " + score;
        ctx.fillText(scoreText, 5, h - 5);
    }

    // Рисует ячейки (в указаном размере var cw = 10;)
    function paintCell(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    // Проверка столкновений
    function checkCollision(x, y, array) {
        for (var i = 0; i < array.length; i++) {
            if(array[i].x == x && array[i].y == y) {
                return true;
            }
        }
        return false;
    }


    // События нажатий клавишь для движения змеи
    document.addEventListener("keydown", function(e) {
        var key = e.which;
        if (key == "65" && d != "right" || key == "37" && d != "right") d = "left";
        else if (key == "68" && d != "left" || key == "39" && d != "left") d = "right";
        else if (key == "87" && d != "down" || key == "38" && d != "down") d = "up";
        else if (key == "83" && d != "up" || key == "40" && d != "up") d = "down";
    });

    // Передаем в глобальную область
    scope.init = init;

}, false);


