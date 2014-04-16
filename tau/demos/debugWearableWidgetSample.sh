#!/bin/sh
cd WearableWidgetSample; rm -f ../WearableWidgetSample.wgt; zip -r ../WearableWidgetSample.wgt .; sdb root on; sdb shell wrt-installer -un 1234567890.wearablewidgetsample; sdb install ../WearableWidgetSample.wgt; sdb shell wrt-launcher -ds 1234567890.wearablewidgetsample -t 30 | grep port: | cut -f2 -d\ | xargs -I{} sh -c "sdb forward tcp:55555 tcp:{}"; cd ..; google-chrome http://127.0.0.1:55555/inspector.html?page=1;

