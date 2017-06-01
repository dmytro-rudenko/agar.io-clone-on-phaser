var width = window.innerWidth;
var height = window.innerHeight;

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });//генерируем canvas на phaser, с высотой и шириной экрана пользователя.
var player;
var bg; //фон страницы
var map_size = 4000; //размер карты
var balls; // 
var player_size = 1;
var moveBullets;
var colors = ["yellow", "blue", "orange", "pink"];

function preload() {
    game.load.image('unit', 'img/unit.png');
    game.load.image('bullet', 'img/bullet.png');
    game.load.image('background', 'img/grid.png');
}

function create() {


    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.advancedTiming = true;
    game.time.desiredFps = 60; //fps
    game.time.slowMotion = 2.0;

    bg = game.add.tileSprite(0, 0, map_size, map_size, 'background'); //карта и картинка сетки
    game.world.setBounds(0, 0, map_size, map_size); //размер карты
    game.stage.backgroundColor = "#000"; //черный фон

    balls = game.add.group();
    balls.enableBody = true;
    for (var i = 0; i < 150; i++) {
        var rand = Math.floor(Math.random() * 4);
        var bounces = generateCircle(colors[rand], 10);
        var ball = balls.create(game.world.randomX, game.world.randomY, bounces);
    } // создаем гранулы

    setInterval(function() {
        for (var i = 0; i < 150; i++) {
            var rand = Math.floor(Math.random() * 5);
            var bounces = generateCircle(colors[rand], 10);
            var bounces = generateCircle('yellow', 10);
            var ball = balls.create(game.world.randomX, game.world.randomY, bounces);
        }
    }, 300000); //создаем новые гранулы

    var bmd = generateCircle('red', 20); // рисуем круг самописной функцией диаметром 20px

    player = game.add.sprite(game.world.centerX, game.world.centerY, bmd); //создаем юнита
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.setTo(0.5, 0.5); //центрируем
    game.camera.follow(player);
    player.body.collideWorldBounds = true; //не дает юниту выйти за границы страницы
}
function update() {
    //player.rotation = game.physics.arcade.angleToPointer(player);
    game.input.addMoveCallback(function() {
        game.physics.arcade.moveToPointer(player, game.physics.arcade.distanceToPointer(player) / 2 + 250);
    });
    game.physics.arcade.collide(player, balls, collisionHandler, processHandler, this);
}
function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteInfo(player, 32, height - 100);
}
// функция для отрисовки круга
function generateCircle(color, size) {
    var bitmapSize = size * 2
    var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
    bmd.ctx.fillStyle = color;
    bmd.ctx.beginPath();
    bmd.ctx.arc(size, size, size, 0, Math.PI * 2, true);
    bmd.ctx.closePath();
    bmd.ctx.fill();
    return bmd;
}
//Проверка столкновения
function processHandler(player, ball) {
    return true;
}

//событие при столкновении с гранулой
function collisionHandler(player, ball) {
    ball.kill(); //уничтожаем гранулу
    player_size++; 
    player.scale.set(1 + player_size / 4 / 10); //меняем размер юнита
    game.physics.arcade.moveToPointer(player, game.physics.arcade.distanceToPointer(player) / 2 + 250); //вызываем фукнцию повторно, чтобы не терялась скорость если пользователь не двигает мышью
}
