(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'db546YUL4ZOPbXl4CD+grcB', 'Global', __filename);
// scripts/Global.js

/**
 * Created by skyxu on 2018/3/26.
 */

"use strict";

window.Global = window.Global || {};
Global.gameType = 1; // 表示游戏模式（1：人机， 2：人人）
Global.level = 1; // 表示难度等级

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
        //# sourceMappingURL=Global.js.map
        