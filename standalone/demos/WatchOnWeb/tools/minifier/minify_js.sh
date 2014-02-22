#! /bin/bash

echo minify all js
cat ../../js/common/sprintf.js ../../js/myTap.js ../../js/scroller.js ../../js/sectionchanger.js ../../js/common/Sandbox.js ../../js/common/UEI.js ../../js/common/STMS.js ../../js/common/Remocon.js ../../js/common/SceneManager.js ../../js/common/IndicatorTab.js ../../js/WR.func.js ../../js/WR.events.js ../../js/WR.init.js ../../js/view_list.js ../../js/view_remote.js ../../js/view_dynamic_setting.js ../../js/app.js > w-all.js
java -jar yuicompressor-2.4.8.jar w-all.js -o ../../js/w-all-min.js
