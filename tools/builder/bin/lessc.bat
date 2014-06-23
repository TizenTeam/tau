@echo off
SET bindir=%~dp0
SET appdir=%bindir%\..
SET libdir=%appdir%\lib
java -cp "%libdir%/*" org.mozilla.javascript.tools.shell.Main -f %libdir%/less.js %libdir%/lessc.js %*
@echo on
@exit /B %errorlevel%
