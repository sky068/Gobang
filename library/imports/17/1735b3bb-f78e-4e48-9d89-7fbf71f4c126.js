"use strict";
cc._RF.push(module, '1735bO7945OSJ2Jf79x9MEm', 'AudioManager');
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