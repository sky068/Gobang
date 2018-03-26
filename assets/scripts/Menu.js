cc.Class({
    extends: cc.Component,

    properties: {
    },

    startGame:function(event, customData) {
        cc.assert(customData === "1" || customData==="2", "Btn customData must be 1(computer) or 2(personal)!");
        // 1: 人机   2: 人人
        Global.gameType = parseInt(customData);
        cc.log(Global.gameType + ", type:" + typeof Global.gameType);
        cc.director.loadScene("Game");
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },

    // update (dt) {},
});
