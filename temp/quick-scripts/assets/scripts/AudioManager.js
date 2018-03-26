(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/AudioManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1735bO7945OSJ2Jf79x9MEm', 'AudioManager', __filename);
// scripts/AudioManager.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        winAudio: {
            default: null,
            url: cc.AudioClip
        },

        loseAudio: {
            default: null,
            url: cc.AudioClip
        },

        computePlaceAudio: {
            default: null,
            url: cc.AudioClip
        },

        playerPlaceAudio: {
            default: null,
            url: cc.AudioClip
        },

        bgmAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    playBgmMusic: function playBgmMusic() {
        cc.audioEngine.playMusic(this.bgmAudio, true);
    },
    pauseBgmMusic: function pauseBgmMusic() {
        cc.audioEngine.pauseMusic();
    },
    _playSFX: function _playSFX(clip) {
        cc.audioEngine.playEffect(clip, false);
    },
    playWin: function playWin() {
        this._playSFX(this.winAudio);
    },
    playLose: function playLose() {
        this._playSFX(this.loseAudio);
    },
    playComputePlaceChess: function playComputePlaceChess() {
        this._playSFX(this.computePlaceAudio);
    },
    playPlayerPlaceChess: function playPlayerPlaceChess() {
        this._playSFX(this.playerPlaceAudio);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=AudioManager.js.map
        