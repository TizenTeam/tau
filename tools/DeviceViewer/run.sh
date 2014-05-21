CUR=$(cd $(dirname $0) && pwd)
CHROME=google-chrome

if test -z "$1"
then
	START_CONFIG=""
else
	START_CONFIG="#"$1
fi

if [ "$OS" == "darwin" ] || [ "$(uname)" == "Darwin" ]; then
	CHROME_PATH=/Applications
	CHROME="$CHROME_PATH/Google Chrome.app/Contents/MacOS/Google Chrome"
	if ! test -e "$CHROME"; then
		CHROME_PATH=~/Desktop
		CHROME="$CHROME_PATH/Google Chrome.app/Contents/MacOS/Google Chrome"
	fi
fi

"$CHROME" --allow-file-access-from-files --disable-web-security --start-maximized --app="file://$CUR/index.html$START_CONFIG"