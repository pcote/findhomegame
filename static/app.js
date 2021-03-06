$(function(){

    /************** Sprite Class ******************/
    function Sprite(){
        this.FRAME_WIDTH = 400;
        this.FRAME_HEIGHT = 600;
        this.DIRECTION_DOWN = 0;
        this.DIRECTION_UP = 1;
        this.DIRECTION_LEFT = 2;
        this.DIRECTION_RIGHT = 3;

        this.currentWalkFrame = -1;
        this.MAX_WALK_FRAME = 3;
        this.currentDirection = 0;
        this.currentWalkFrame = 0;
        this.currentXPos = 0;
        this.currentYPos = 0;

        this.trajectoryMap = [];
        this.trajectoryMap[this.DIRECTION_DOWN] = {x: 0, y: 10};
        this.trajectoryMap[this.DIRECTION_UP] = {x: 0, y: -10};
        this.trajectoryMap[this.DIRECTION_LEFT] = {x: -10, y: 0};
        this.trajectoryMap[this.DIRECTION_RIGHT] = {x: 10, y: 0};

        this.turn = function(newDirection){
            this.currentDirection = newDirection;
        };

        this.takeStep = function(){
            this.currentWalkFrame += 1;
            if(this.currentWalkFrame > this.MAX_WALK_FRAME){
                this.currentWalkFrame = 0;
            }
        };


        this.getOffsets = function(){
            var offsets = {
                walk: this.currentWalkFrame * this.FRAME_WIDTH,
                direction: this.currentDirection * this.FRAME_HEIGHT,
                x: this.currentXPos,
                y: this.currentYPos
            };
            return offsets;
        };


        this.moveForward = function(){
            this.currentXPos += this.trajectoryMap[this.currentDirection].x;
            this.currentYPos += this.trajectoryMap[this.currentDirection].y;
        };

    }


    /*********** Action Mappings for controller button presses. *********/
    LEFT_BUTTON = 14;
    RIGHT_BUTTON = 15;
    UP_BUTTON = 12;
    DOWN_BUTTON = 13;

    var buttonActionMap = [];
    buttonActionMap[LEFT_BUTTON] = function(){
        boy.turn(boy.DIRECTION_LEFT);
        boy.moveForward();
    };

    buttonActionMap[RIGHT_BUTTON] = function(){
        boy.turn(boy.DIRECTION_RIGHT);
        boy.moveForward();
    };

    buttonActionMap[UP_BUTTON] = function(){
        boy.turn(boy.DIRECTION_UP);
        boy.moveForward();
    };

    buttonActionMap[DOWN_BUTTON] = function(){
        boy.turn(boy.DIRECTION_DOWN);
        boy.moveForward();
    };


    var gameLogicId;
    var renderId;

    /******** Interval Callback function to poll for button presses. ***********/
    gameLogic = function(evt){
        var gamepad = navigator.getGamepads()[0];
        if(!gamepad){
            return;
        }

        var i;
        for(i=0; i<gamepad.buttons.length; i++){
            var btn = gamepad.buttons[i];
            if(btn.pressed){
                buttonActionMap[i]();
            }
        }

        boy.takeStep();
    };


    /**************** Interval callback function for the animation walk cycle **********/
    var render = function(evt){
        var  SCREEN_WIDTH = 800;
        var SCREEN_HEIGHT = 800;

        var offsets = boy.getOffsets();
        var canv = document.getElementById("gameCanvas");
        var cxt = canv.getContext("2d");
        cxt.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        var boyImage = $("#boyImage")[0];
        cxt.drawImage(boyImage,
                      offsets.walk, offsets.direction,
                      boy.FRAME_WIDTH, boy.FRAME_HEIGHT,
                      offsets.x, offsets.y,
                      Math.round(boy.FRAME_WIDTH / 4), Math.round(boy.FRAME_HEIGHT / 4));
    };

    var boy = new Sprite();
    gameLogicId = setInterval(gameLogic, 200);
    renderId = setInterval(render, 200);

});
