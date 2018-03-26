"use strict";
cc._RF.push(module, '62f01Zz0/pBNoRz/1ELgDhe', 'Menu');
// scripts/Menu.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

cc.Class({
    extends: cc.Component,

    properties: {},

    startGame: function startGame(event, customData) {
        cc.assert(customData === "1" || customData === "2", "Btn customData must be 1(computer) or 2(personal)!");
        // 1: 人机   2: 人人
        Global.gameType = parseInt(customData);
        cc.log(Global.gameType + ", type:" + _typeof(Global.gameType));
        cc.director.loadScene("Game");
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();