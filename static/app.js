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
                direction: this.currentDirection * this.FRAME_HEIGHT
            };
            return offsets;
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
    };

    buttonActionMap[RIGHT_BUTTON] = function(){
        boy.turn(boy.DIRECTION_RIGHT);
    };

    buttonActionMap[UP_BUTTON] = function(){
        boy.turn(boy.DIRECTION_UP);
    };

    buttonActionMap[DOWN_BUTTON] = function(){
        boy.turn(boy.DIRECTION_DOWN);
    };


    /******** Interval Callback function to poll for button presses. ***********/
    pollController = function(evt){
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

    };

    /**************** Interval callback function for the animation walk cycle **********/
    var animateWalk = function(evt){
        boy.takeStep();

        var offsets = boy.getOffsets();
        var canv = document.getElementById("gameCanvas");
        var cxt = canv.getContext("2d");
        var boyImage = $("#boyImage")[0];
        cxt.drawImage(boyImage,
                      offsets.walk, offsets.direction,
                      boy.FRAME_WIDTH, boy.FRAME_HEIGHT,
                      0, 0,
                      boy.FRAME_WIDTH, boy.FRAME_HEIGHT);
    };

    var boy = new Sprite();
    setInterval(pollController, 125);
    setInterval(animateWalk, 250);

});