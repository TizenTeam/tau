function displayHelp {
	echo "You can use following options:"
	echo "./run.sh 'name=DisplayedAppName&path=pathToApp'"
}

CUR=$(cd $(dirname $0) && pwd)
CHROME=google-chrome
NOW=`date +%s`
TMPDIR="/tmp/.ThemeEditor"
USER_DATA_DIR="$TMPDIR/$NOW"

if test -z "$1"
then
	START_CONFIG=""
	displayHelp
else
	START_CONFIG="?"$1
fi

if [ "$OS" == "darwin" ] || [ "$(uname)" == "Darwin" ]; then
	CHROME_PATH=/Applications
	CHROME="$CHROME_PATH/Google Chrome.app/Contents/MacOS/Google Chrome"
	if ! test -e "$CHROME"; then
		CHROME_PATH=~/Desktop
		CHROME="$CHROME_PATH/Google Chrome.app/Contents/MacOS/Google Chrome"
	fi
fi

rm -rf $TMPDIR
mkdir $TMPDIR
mkdir $USER_DATA_DIR

"$CHROME" --user-data-dir=$USER_DATA_DIR --no-first-run --no-default-browser-check --allow-file-access-from-files --disable-web-security --start-maximized --app="file://$CUR/index.html$START_CONFIG"
