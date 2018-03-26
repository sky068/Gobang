

cc.Class({
    extends: cc.Component,

    properties: {
        resultSprite: {
            default: null,
            type: cc.Sprite,
        }, 
        resultLabel: {
            default: null,
            type: cc.Label,
        },
        stepLabel: {
            default: null,
            type: cc.Label,
        },
        timeLabel: {
            default: null,
            type: cc.Label,
        },
        newChessTip: {
            default: null,
            type: cc.Node
        },
        chessPrefab: {
            default: null,
            type: cc.Prefab,
        },
        chessList: {
            default: [],
            type: [cc.Node],
        },
        whiteSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        blackSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        // 当前最新的落子，根据这个落子去判断输赢
        touchChess: {
            default: null,
            type: cc.Node,
            visiable: false,
        },
        gameState: 'white',
        fiveGroup: [],
        fiveGroupScore: [],
        audioManager: cc.Node,
        steps: 0,
        time: 0,
        gameOver: false,
        stepOrderIndex: []
    },

    restartGame () {
        cc.director.loadScene('Game');
    },

    toMenu () {
        cc.director.loadScene('Menu');
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.resultSprite.node.active = false;
        this.newChessTip.node.active = false;

        this.steps = 0;
        this.time = 0;
        this.gameOver = false;

        this.audioManager = this.audioManager.getComponent('AudioManager');

        let self = this;
        // 初始化棋盘
        for(let y = 0; y < 15; y++) {
            for(let x = 0; x < 15; x++) {
                let newChess = cc.instantiate(this.chessPrefab);
                this.node.addChild(newChess);
                newChess.setPosition(cc.p(x*40 + 20, y*40 + 20));
                newChess.tag = y * 15 + x;

                newChess.on(cc.Node.EventType.TOUCH_END, function(event){
                    if (newChess.getComponent(cc.Sprite).spriteFrame === null){
                        self.touchChess = newChess;
                        self.stepOrderIndex.push(newChess.tag);
                        self.audioManager.playPlayerPlaceChess();
                        if (Global.gameType === 1){
                            self.computerPlay(newChess);
                        } else {
                            self.personalPlay(newChess);
                        }
                    }
                });

                this.chessList.push(newChess);
            }
        }

        // 白棋先在棋盘正中下一子
        this.chessList[112].getComponent(cc.Sprite).spriteFrame = self.whiteSpriteFrame;
        if (Global.gameType === 2){
            this.stepOrderIndex.push(this.chessList[112].tag);
        }
        this.timeLabel.node.active = true;
        this.audioManager.playComputePlaceChess();
        // 下一步应该下黑棋
        this.gameState = 'black';
        // 添加五元数组,就是棋盘中能横竖撇捺能成五的个数，总共572个，找出他们相对于棋盘二维数组的位置索引
        //横向
        for(let y=0;y<15;y++){
            for(let x=0;x<11;x++){
                this.fiveGroup.push([y*15+x,y*15+x+1,y*15+x+2,y*15+x+3,y*15+x+4]);
            }  
        }
        //纵向
        for(let x=0;x<15;x++){
            for(let y=0;y<11;y++){
                this.fiveGroup.push([y*15+x,(y+1)*15+x,(y+2)*15+x,(y+3)*15+x,(y+4)*15+x]);
            }
        }
        //右上斜向
        for(let b=-10;b<=10;b++){
            for(let x=0;x<11;x++){
                if(b+x<0||b+x>10){
                    continue;
                }else{
                    this.fiveGroup.push([(b+x)*15+x,(b+x+1)*15+x+1,(b+x+2)*15+x+2,(b+x+3)*15+x+3,(b+x+4)*15+x+4]);
                }
            }
        }
        //右下斜向
        for(let b=4;b<=24;b++){
            for(let y=0;y<11;y++){
                if(b-y<4||b-y>14){
                    continue;
                }else{
                    this.fiveGroup.push([y*15+b-y,(y+1)*15+b-y-1,(y+2)*15+b-y-2,(y+3)*15+b-y-3,(y+4)*15+b-y-4]);
                }
            }
        }
    },

    // 人机对战
    computerPlay(chess){
        if(this.gameState === 'black'){
            chess.getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;
            // self.newChessTip.node.setPosition(this.getPositionX() - 300, this.getPositionY() - 300);
            this.judgeOver();
            if(this.gameState === 'white'){
                this.scheduleOnce(function(){
                    this.ai();
                }, 0.3);
            }
        }
    },

    // 人人对战
    personalPlay(chess){
        if(this.gameState === 'black'){
            chess.getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;
        } else if (this.gameState === 'white'){
            chess.getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
        }
        this.newChessTip.node.setPosition(chess.getPositionX() - 300, chess.getPositionY() - 300);
        this.newChessTip.node.active = true;
        this.steps ++;
        this.judgeOver();
    },

    ai () {
        this.steps++;
        // 评分，根据五元组里的黑白棋子的不同个数去计算每个点的可能得分
        for(let i = 0; i < this.fiveGroup.length; i++) {
            let blackCount = 0; // 五元组中黑棋的个数
            let whiteCount = 0; // 五元组中白棋的个数
            for(let index = 0; index < 5; index++) {
                if ((this.chessList[this.fiveGroup[i][index]].getComponent(cc.Sprite)).spriteFrame == this.blackSpriteFrame) {
                    blackCount++;
                } else if ((this.chessList[this.fiveGroup[i][index]].getComponent(cc.Sprite)).spriteFrame == this.whiteSpriteFrame) {
                    whiteCount++;
                }
            }

            if (blackCount + whiteCount == 0) {
                this.fiveGroupScore[i] = 7;
            } else if(blackCount > 0 && whiteCount > 0) {
                this.fiveGroupScore[i] = 0;
            } else if(blackCount == 0 && whiteCount == 1) {
                this.fiveGroupScore[i] = 35;
            } else if(blackCount == 0 && whiteCount == 2) {
                this.fiveGroupScore[i] = 800;
            } else if(blackCount == 0 && whiteCount == 3) {
                this.fiveGroupScore[i] = 15000;
            } else if(blackCount == 0 && whiteCount == 4) {
                this.fiveGroupScore[i] = 800000;
            } else if(whiteCount == 0 && blackCount == 1) {
                this.fiveGroupScore[i] = 15;
            } else if(whiteCount == 0 && blackCount == 2) {
                this.fiveGroupScore[i] = 400;
            } else if(whiteCount == 0 && blackCount == 3) {
                this.fiveGroupScore[i] = 1800;
            } else if(whiteCount == 0 && blackCount == 4) {
                this.fiveGroupScore[i] = 100000;
            }
        }
        // 找出最高分的五元组
        let highScore = 0;
        let position = 0;
        for(let i = 0; i < this.fiveGroupScore.length; i++) {
            if(this.fiveGroupScore[i] > highScore) {
                highScore = this.fiveGroupScore[i];
                position = i;
            }
        }
        // 在最高分的五元组里的可以下子的位置找到最优的下子位置
        // 每次找能下子的最后一个位置
        let spaceFlag = false;
        let index = 0;
        for(let i = 0; i < 5; i++) {
            if(!spaceFlag) {
                if(this.chessList[this.fiveGroup[position][i]].getComponent(cc.Sprite).spriteFrame == null) {
                    index = i;
                } else {
                    spaceFlag = true;
                }
            }
            if(spaceFlag && this.chessList[this.fiveGroup[position][i]].getComponent(cc.Sprite).spriteFrame == null) {
                index = i;
                break;
            }
        }
        // 在最优位置下子
        this.chessList[this.fiveGroup[position][index]].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
        this.stepOrderIndex.push(this.fiveGroup[position][index]);
        this.newChessTip.node.setPosition(this.chessList[this.fiveGroup[position][index]].getPositionX() - 300, this.chessList[this.fiveGroup[position][index]].getPositionY() - 300);
        this.newChessTip.node.active = true;
        this.audioManager.playComputePlaceChess();
        this.touchChess = this.chessList[this.fiveGroup[position][index]];
        this.judgeOver();
    },

    judgeOver () {
        let touchX = this.touchChess.tag % 15;
        let touchY = parseInt(this.touchChess.tag / 15);
        let fiveCount = 0;
        // 横向判断
        for(let i = touchX - 4; i <= touchX + 4; i++) {
            if(i < 0 || i > 14) {
                continue;
            } else {
                if((this.chessList[touchY * 15 + i].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                    fiveCount++;
                    if(fiveCount == 5) {
                        this.showResult();
                        return;
                    }
                } else {
                    fiveCount = 0;
                }
            }
        }
        // 竖向判断
        for(let i = touchY - 4; i <= touchY + 4; i++) {
            if(i < 0 || i > 14) {
                continue;
            } else {
                if((this.chessList[i * 15 + touchX].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame ) {
                    fiveCount++;
                    if(fiveCount == 5) {
                        this.showResult();
                        return;
                    }
                } else {
                    fiveCount = 0;
                }
            }
        }
        // 撇向判断
        for(let i = touchX - 4, j = touchY - 4; (i <= touchX + 4) && (j <= touchY + 4); i++, j++) {
            if (i < 0 || j < 0 || i > 14 || j > 14) {
                continue;
            } else {
                if((this.chessList[j * 15 + i].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                    fiveCount++;
                    if(fiveCount == 5) {
                        this.showResult();
                        return;
                    }
                } else {
                    fiveCount = 0;
                }
            }
        }
        
        // 捺向判断
        for(let i = touchX - 4, j = touchY + 4; (i <= touchX + 4) && (j <= touchY - 4); i++, j++) {
            if (i < 0 || j < 0 || i > 14 || j > 14) {
                continue;
            } else {
                if((this.chessList[j * 15 + i].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                    fiveCount++;
                    if(fiveCount == 5) {
                        this.showResult();
                        return;
                    }
                } else {
                    fiveCount = 0;
                }
            }
        }
        
        // 没有输赢则交换下子顺序
        if(this.gameState === 'black') {
            this.gameState = 'white';
        } else {
            this.gameState = 'black';
        }
    },

    showResult () {
        this.gameOver = true;
        let des = "";
        if (Global.gameType === 1){
            if(this.gameState === 'black') {
                this.resultLabel.string = "你赢了";
                this.audioManager.playWin();
            } else {
                this.resultLabel.string = "你输了";
                this.audioManager.playLose();
            }
            this.stepLabel.string = "走了".concat(this.steps).concat("步");
        } else {
            this.resultLabel.string = this.gameState + "赢了";
            this.audioManager.playWin();
        }

        this.audioManager.pauseBgmMusic();
        this.resultSprite.node.active = true;
        this.gameState = 'over';
    },

    giveUp () {
        if (Global.gameType === 1){
            this.gameState = 'white';
        } else {
            if (this.gameState === 'white'){
                this.gameState = 'black';
            } else {
                this.gameState = 'white';
            }
        }
        this.showResult();
    },

    // 悔棋
    retract () {
        if(this.stepOrderIndex.length != 0) {
            this.steps--;
            this.chessList[this.stepOrderIndex.pop()].getComponent(cc.Sprite).spriteFrame = null;
            if (Global.gameType === 1){
                this.chessList[this.stepOrderIndex.pop()].getComponent(cc.Sprite).spriteFrame = null;
            }
            if(this.stepOrderIndex.length != 0) {
                this.newChessTip.node.setPosition(this.chessList[this.stepOrderIndex[this.stepOrderIndex.length - 1]].getPositionX() - 300, 
                    this.chessList[this.stepOrderIndex[this.stepOrderIndex.length - 1]].getPositionY() - 300);
            } else {
                this.newChessTip.node.setPosition(0, 0);
                this.newChessTip.node.active = false;
            }

            if (Global.gameType === 2){
                if (this.gameState === 'white'){
                    this.gameState = 'black';
                } else {
                    this.gameState = 'white';
                }
            }
        }
    },

    start () {
        this.audioManager.playBgmMusic();
        this.callback = function () {
            this.time++;
        }
        this.schedule(this.callback, 1);
    },

    update (dt) {
        if(!this.gameOver) {
            this.timeLabel.string = "时间：".concat(this.time).concat("秒");
        }
    },
});
