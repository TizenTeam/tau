@echo off
SET bindir=%~dp0
SET appdir=%bindir%\..
SET libdir=%appdir%\lib
java -cp "%libdir%/*" org.mozilla.javascript.tools.shell.Main -require %libdir%\tau-init.js --builder-app-dir=%appdir% %*
@echo on
@exit /B %errorlevel%
