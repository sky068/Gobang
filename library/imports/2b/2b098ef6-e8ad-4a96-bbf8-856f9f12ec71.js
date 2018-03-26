"use strict";
cc._RF.push(module, '2b098726K1Klrv4hW+fEuxx', 'Game');
// scripts/Game.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        resultSprite: {
            default: null,
            type: cc.Sprite
        },
        resultLabel: {
            default: null,
            type: cc.Label
        },
        stepLabel: {
            default: null,
            type: cc.Label
        },
        timeLabel: {
            default: null,
            type: cc.Label
        },
        newChessTip: {
            default: null,
            type: cc.Node
        },
        chessPrefab: {
            default: null,
            type: cc.Prefab
        },
        chessList: {
            default: [],
            type: [cc.Node]
        },
        whiteSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        blackSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        // 当前最新的落子，根据这个落子去判断输赢
        touchChess: {
            default: null,
            type: cc.Node,
            visiable: false
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

    restartGame: function restartGame() {
        cc.director.loadScene('Game');
    },
    toMenu: function toMenu() {
        cc.director.loadScene('Menu');
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var _this = this;

        this.resultSprite.node.active = false;
        this.newChessTip.node.active = false;

        this.steps = 0;
        this.time = 0;
        this.gameOver = false;

        this.audioManager = this.audioManager.getComponent('AudioManager');

        var self = this;
        // 初始化棋盘
        for (var y = 0; y < 15; y++) {
            var _loop = function _loop(x) {
                var newChess = cc.instantiate(_this.chessPrefab);
                _this.node.addChild(newChess);
                newChess.setPosition(cc.p(x * 40 + 20, y * 40 + 20));
                newChess.tag = y * 15 + x;

                newChess.on(cc.Node.EventType.TOUCH_END, function (event) {
                    if (newChess.getComponent(cc.Sprite).spriteFrame === null) {
                        self.touchChess = newChess;
                        self.stepOrderIndex.push(newChess.tag);
                        self.audioManager.playPlayerPlaceChess();
                        if (Global.gameType === 1) {
                            self.computerPlay(newChess);
                        } else {
                            self.personalPlay(newChess);
                        }
                    }
                });

                _this.chessList.push(newChess);
            };

            for (var x = 0; x < 15; x++) {
                _loop(x);
            }
        }

        // 白棋先在棋盘正中下一子
        this.chessList[112].getComponent(cc.Sprite).spriteFrame = self.whiteSpriteFrame;
        if (Global.gameType === 2) {
            this.stepOrderIndex.push(this.chessList[112].tag);
        }
        this.timeLabel.node.active = true;
        this.audioManager.playComputePlaceChess();
        // 下一步应该下黑棋
        this.gameState = 'black';
        // 添加五元数组,就是棋盘中能横竖撇捺能成五的个数，总共572个，找出他们相对于棋盘二维数组的位置索引
        //横向
        for (var _y = 0; _y < 15; _y++) {
            for (var x = 0; x < 11; x++) {
                this.fiveGroup.push([_y * 15 + x, _y * 15 + x + 1, _y * 15 + x + 2, _y * 15 + x + 3, _y * 15 + x + 4]);
            }
        }
        //纵向
        for (var _x = 0; _x < 15; _x++) {
            for (var _y2 = 0; _y2 < 11; _y2++) {
                this.fiveGroup.push([_y2 * 15 + _x, (_y2 + 1) * 15 + _x, (_y2 + 2) * 15 + _x, (_y2 + 3) * 15 + _x, (_y2 + 4) * 15 + _x]);
            }
        }
        //右上斜向
        for (var b = -10; b <= 10; b++) {
            for (var _x2 = 0; _x2 < 11; _x2++) {
                if (b + _x2 < 0 || b + _x2 > 10) {
                    continue;
                } else {
                    this.fiveGroup.push([(b + _x2) * 15 + _x2, (b + _x2 + 1) * 15 + _x2 + 1, (b + _x2 + 2) * 15 + _x2 + 2, (b + _x2 + 3) * 15 + _x2 + 3, (b + _x2 + 4) * 15 + _x2 + 4]);
                }
            }
        }
        //右下斜向
        for (var _b = 4; _b <= 24; _b++) {
            for (var _y3 = 0; _y3 < 11; _y3++) {
                if (_b - _y3 < 4 || _b - _y3 > 14) {
                    continue;
                } else {
                    this.fiveGroup.push([_y3 * 15 + _b - _y3, (_y3 + 1) * 15 + _b - _y3 - 1, (_y3 + 2) * 15 + _b - _y3 - 2, (_y3 + 3) * 15 + _b - _y3 - 3, (_y3 + 4) * 15 + _b - _y3 - 4]);
                }
            }
        }
    },


    // 人机对战
    computerPlay: function computerPlay(chess) {
        if (this.gameState === 'black') {
            chess.getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;
            // self.newChessTip.node.setPosition(this.getPositionX() - 300, this.getPositionY() - 300);
            this.judgeOver();
            if (this.gameState === 'white') {
                this.scheduleOnce(function () {
                    this.ai();
                }, 0.3);
            }
        }
    },


    // 人人对战
    personalPlay: function personalPlay(chess) {
        if (this.gameState === 'black') {
            chess.getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;
        } else if (this.gameState === 'white') {
            chess.getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
        }
        this.newChessTip.node.setPosition(chess.getPositionX() - 300, chess.getPositionY() - 300);
        this.newChessTip.node.active = true;
        this.steps++;
        this.judgeOver();
    },
    ai: function ai() {
        this.steps++;
        // 评分，根据五元组里的黑白棋子的不同个数去计算每个点的可能得分
        for (var i = 0; i < this.fiveGroup.length; i++) {
            var blackCount = 0; // 五元组中黑棋的个数
            var whiteCount = 0; // 五元组中白棋的个数
            for (var _index = 0; _index < 5; _index++) {
                if (this.chessList[this.fiveGroup[i][_index]].getComponent(cc.Sprite).spriteFrame == this.blackSpriteFrame) {
                    blackCount++;
                } else if (this.chessList[this.fiveGroup[i][_index]].getComponent(cc.Sprite).spriteFrame == this.whiteSpriteFrame) {
                    whiteCount++;
                }
            }

            if (blackCount + whiteCount == 0) {
                this.fiveGroupScore[i] = 7;
            } else if (blackCount > 0 && whiteCount > 0) {
                this.fiveGroupScore[i] = 0;
            } else if (blackCount == 0 && whiteCount == 1) {
                this.fiveGroupScore[i] = 35;
            } else if (blackCount == 0 && whiteCount == 2) {
                this.fiveGroupScore[i] = 800;
            } else if (blackCount == 0 && whiteCount == 3) {
                this.fiveGroupScore[i] = 15000;
            } else if (blackCount == 0 && whiteCount == 4) {
                this.fiveGroupScore[i] = 800000;
            } else if (whiteCount == 0 && blackCount == 1) {
                this.fiveGroupScore[i] = 15;
            } else if (whiteCount == 0 && blackCount == 2) {
                this.fiveGroupScore[i] = 400;
            } else if (whiteCount == 0 && blackCount == 3) {
                this.fiveGroupScore[i] = 1800;
            } else if (whiteCount == 0 && blackCount == 4) {
                this.fiveGroupScore[i] = 100000;
            }
        }
        // 找出最高分的五元组
        var highScore = 0;
        var position = 0;
        for (var _i = 0; _i < this.fiveGroupScore.length; _i++) {
            if (this.fiveGroupScore[_i] > highScore) {
                highScore = this.fiveGroupScore[_i];
                position = _i;
            }
        }
        // 在最高分的五元组里的可以下子的位置找到最优的下子位置
        // 每次找能下子的最后一个位置
        var spaceFlag = false;
        var index = 0;
        for (var _i2 = 0; _i2 < 5; _i2++) {
            if (!spaceFlag) {
                if (this.chessList[this.fiveGroup[position][_i2]].getComponent(cc.Sprite).spriteFrame == null) {
                    index = _i2;
                } else {
                    spaceFlag = true;
                }
            }
            if (spaceFlag && this.chessList[this.fiveGroup[position][_i2]].getComponent(cc.Sprite).spriteFrame == null) {
                index = _i2;
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
    judgeOver: function judgeOver() {
        var touchX = this.touchChess.tag % 15;
        var touchY = parseInt(this.touchChess.tag / 15);
        var fiveCount = 0;
        // 横向判断
        for (var i = touchX - 4; i <= touchX + 4; i++) {
            if (i < 0 || i > 14) {
                continue;
            } else {
                if (this.chessList[touchY * 15 + i].getComponent(cc.Sprite).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                    fiveCount++;
                    if (fiveCount == 5) {
                        this.showResult();
                        return;
                    }
                } else {
                    fiveCount = 0;
                }
            }
        }
        // 竖向判断
        for (var _i3 = touchY - 4; _i3 <= touchY + 4; _i3++) {
            if (_i3 < 0 || _i3 > 14) {
                continue;
            } else {
                if (this.chessList[_i3 * 15 + touchX].getComponent(cc.Sprite).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                    fiveCount++;
                    if (fiveCount == 5) {
                        this.showResult();
                        return;
                    }
                } else {
                    fiveCount = 0;
                }
            }
        }
        // 撇向判断
        for (var _i4 = touchX - 4, j = touchY - 4; _i4 <= touchX + 4 && j <= touchY + 4; _i4++, j++) {
            if (_i4 < 0 || j < 0 || _i4 > 14 || j > 14) {
                continue;
            } else {
                if (this.chessList[j * 15 + _i4].getComponent(cc.Sprite).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                    fiveCount++;
                    if (fiveCount == 5) {
                        this.showResult();
                        return;
                    }
                } else {
                    fiveCount = 0;
                }
            }
        }

        // 捺向判断
        for (var _i5 = touchX - 4, _j = touchY + 4; _i5 <= touchX + 4 && _j <= touchY - 4; _i5++, _j++) {
            if (_i5 < 0 || _j < 0 || _i5 > 14 || _j > 14) {
                continue;
            } else {
                if (this.chessList[_j * 15 + _i5].getComponent(cc.Sprite).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                    fiveCount++;
                    if (fiveCount == 5) {
                        this.showResult();
                        return;
                    }
                } else {
                    fiveCount = 0;
                }
            }
        }

        // 没有输赢则交换下子顺序
        if (this.gameState === 'black') {
            this.gameState = 'white';
        } else {
            this.gameState = 'black';
        }
    },
    showResult: function showResult() {
        this.gameOver = true;
        var des = "";
        if (Global.gameType === 1) {
            if (this.gameState === 'black') {
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
    giveUp: function giveUp() {
        if (Global.gameType === 1) {
            this.gameState = 'white';
        } else {
            if (this.gameState === 'white') {
                this.gameState = 'black';
            } else {
                this.gameState = 'white';
            }
        }
        this.showResult();
    },


    // 悔棋
    retract: function retract() {
        if (this.stepOrderIndex.length != 0) {
            this.steps--;
            this.chessList[this.stepOrderIndex.pop()].getComponent(cc.Sprite).spriteFrame = null;
            if (Global.gameType === 1) {
                this.chessList[this.stepOrderIndex.pop()].getComponent(cc.Sprite).spriteFrame = null;
            }
            if (this.stepOrderIndex.length != 0) {
                this.newChessTip.node.setPosition(this.chessList[this.stepOrderIndex[this.stepOrderIndex.length - 1]].getPositionX() - 300, this.chessList[this.stepOrderIndex[this.stepOrderIndex.length - 1]].getPositionY() - 300);
            } else {
                this.newChessTip.node.setPosition(0, 0);
                this.newChessTip.node.active = false;
            }

            if (Global.gameType === 2) {
                if (this.gameState === 'white') {
                    this.gameState = 'black';
                } else {
                    this.gameState = 'white';
                }
            }
        }
    },
    start: function start() {
        this.audioManager.playBgmMusic();
        this.callback = function () {
            this.time++;
        };
        this.schedule(this.callback, 1);
    },
    update: function update(dt) {
        if (!this.gameOver) {
            this.timeLabel.string = "时间：".concat(this.time).concat("秒");
        }
    }
});

cc._RF.pop();