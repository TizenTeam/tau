WatchOnSandbox( "STMS", function( m ) {
var STMS = m.STMS,
map = {
IDS_ST_BODY_VOLUME_M_SOUND_ABB: "Volume",
IDS_SR_BODY_AIR_CONDITIONER: "Air conditioner",
IDS_SR_BODY_AUSTRIA_M_COUNTRYNAME: "Austria",
IDS_SR_BODY_BELGIUM_M_COUNTRYNAME: "Belgium",
IDS_SR_BODY_CHINA_M_COUNTRYNAME: "China",
IDS_SR_BODY_DENMARK_M_COUNTRYNAME: "Denmark",
IDS_SR_BODY_FAN_SPEED_DOWN: "Fan speed down",
IDS_SR_BODY_FAN_SPEED_UP: "Fan speed up",
IDS_SR_BODY_FINLAND_M_COUNTRYNAME: "Finland",
IDS_SR_BODY_FRANCE_M_COUNTRYNAME: "France",
IDS_SR_BODY_GERMANY_M_COUNTRYNAME: "Germany",
IDS_SR_BODY_IRELAND_M_COUNTRYNAME: "Ireland",
IDS_SR_BODY_ITALY_M_COUNTRYNAME: "Italy",
IDS_SR_BODY_LUXEMBOURG_M_COUNTRYNAME: "Luxembourg",
IDS_SR_BODY_MODE: "Mode",
IDS_SR_BODY_NORWAY_M_COUNTRYNAME: "Norway",
IDS_SR_BODY_POLAND_M_COUNTRYNAME: "Poland",
IDS_SR_BODY_PORTUGAL_M_COUNTRYNAME: "Portugal",
IDS_SR_BODY_SET_UP: "Set up",
IDS_SR_BODY_SOUTH_KOREA_M_COUNTRYNAME: "South Korea",
IDS_SR_BODY_SPAIN_M_COUNTRYNAME: "Spain",
IDS_SR_BODY_SWEDEN_M_COUNTRYNAME: "Sweden",
IDS_SR_BODY_SWITZERLAND_M_COUNTRYNAME: "Switzerland",
IDS_SR_BODY_UNITED_KINGDOM_M_COUNTRYNAME: "United Kingdom",
IDS_SR_BODY_UNITED_STATES_OF_AMERICA_M_COUNTRYNAME: "United States of America",
IDS_SR_BUTTON_BACK: "Back",
IDS_SR_BUTTON_CANCEL_ABB: "Cancel",
IDS_SR_BUTTON_DELETE: "Delete",
IDS_SR_BUTTON_DONE: "Done",
IDS_SR_BUTTON_EXIT: "Exit",
IDS_SR_BUTTON_INFO: "Info",
IDS_SR_BUTTON_MENU: "Menu",
IDS_SR_BUTTON_MUTE: "Mute",
IDS_SR_BUTTON_OK: "OK",
IDS_SR_BUTTON_POWER: "Power",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY: "Select your country",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY_REGION: "Select your country/region",
IDS_SR_BUTTON_SHOW_OTHER_BRANDS: "Show other brands",
IDS_SR_BUTTON_SOURCE_T_SMART_REMOTE: "Source",
IDS_SR_BUTTON_TEMP_DOWN_M_TEMPERATURE: "Temp down",
IDS_SR_BUTTON_TEMP_UP_M_TEMPERATURE: "Temp up",
IDS_SR_BUTTON_TV: "TV",
IDS_SR_BUTTON_YES: "Yes",
IDS_SR_HEADER_ALL_BRANDS: "All brands",
IDS_SR_HEADER_DELETE_ABB: "Delete",
IDS_SR_HEADER_RESET: "Reset",
IDS_SR_HEADER_WATCHON_M_APPLICATION: "WatchON",
IDS_SR_OPT_ADD_DEVICE_ABB: "Add device",
IDS_SR_OPT_STB_ABB: "STB",
IDS_YSM_POP_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Set up the remote control on your device?",
IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB: "Show all brands",
IDS_YSM_BUTTON_VOL_UC: "VOL",
IDS_YSM_BUTTON_CH: "CH",
IDS_YSM_BUTTON_NO: "No",
IDS_SAPPS_BODY_NOTICE: "Notice",
IDS_MSGF_HEADER_OPTION: "Option",
IDS_MSGF_HEADER_OPTIONS: "Options",
IDS_SSCHOL_HEADER_COMPLETED: "Completed",
IDS_YSM_HEADER_SET_UP_REMOTE_ABB: "Set up remote",
IDS_YSM_BODY_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Set up the remote control on your device?",
IDS_YSM_BODY_LATIN_COUNTRIES_ABB: "Latin countries",
IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON: "Point your watch towards the %s and tap the power button.",
IDS_YSM_BODY_TAP_THE_BUTTON_ABB: "Tap the button.",
IDS_YSM_BODY_DID_IT_WORK_Q_ABB: "Did it work?",
IDS_YSM_HEADER_SETUP_COMPLETE_ABB: "Setup complete",
IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE: "%s remote control setup is complete.",
IDS_YSM_BODY_THIS_MODEL_IS_NOT_SUPPORTED: "This model is not supported.",
IDS_YSM_BODY_THE_REMOTE_CONTROL_WILL_BE_REMOVED: "The remote control will be removed.",
IDS_YSM_BODY_FAN_SPEED_ABB: "Fan speed",
IDS_YSM_BODY_MODE_ABB2: "Mode",
IDS_YSM_OPT_AV_RECEIVER_ABB2: "AV receiver",
IDS_YSM_BODY_BLUE: "Blue",
IDS_YSM_BODY_CHANNEL_DOWN_ABB: "Channel down",
IDS_YSM_BODY_CHANNEL_LIST_ABB: "Channel list",
IDS_YSM_BODY_CHANNEL_UP_ABB: "Channel up",
IDS_YSM_BODY_DISK_MENU_ABB: "Disk menu",
IDS_YSM_BODY_DOWN: "Down",
IDS_YSM_BODY_DVR: "DVR",
IDS_YSM_BODY_EJECT_ABB: "Eject",
IDS_YSM_BODY_FAST_FORWARD_ABB: "Fast forward",
IDS_YSM_BODY_FAVOURITE_ABB: "Favorite",
IDS_YSM_BODY_FORMAT_HASPECT_ABB: "Format (Aspect)",
IDS_YSM_BODY_GREEN_ABB: "Green",
IDS_YSM_BODY_HDMI_PD_ABB: "HDMI %d",
IDS_YSM_BODY_INPUT_ABB: "Input",
IDS_YSM_BODY_LEFT: "Left",
IDS_YSM_BODY_LIST: "List",
IDS_YSM_BODY_OTHER_COUNTRIES_ABB: "Other countries",
IDS_YSM_BODY_PAUSE: "Pause",
IDS_YSM_BODY_PLAY: "Play",
IDS_YSM_BODY_PREVIOUS: "Previous",
IDS_YSM_BODY_PRE_CHANNEL_ABB: "Pre channel",
IDS_YSM_BODY_RED: "Red",
IDS_YSM_BODY_REWIND_ABB: "Rewind",
IDS_YSM_BODY_RIGHT_ABB2: "Right",
IDS_YSM_BODY_SELECT: "Select",
IDS_YSM_BODY_SOUND_MODE_ABB: "Sound mode",
IDS_YSM_BODY_START_SETUP_OF_STB_REMOTE_CONTROL: "Start setup of STB remote control.",
IDS_YSM_BODY_STOP: "Stop",
IDS_YSM_BODY_SUBTITLES_ABB2: "Subtitles",
IDS_YSM_BODY_SUBWOOFER_ABB: "Subwoofer",
IDS_YSM_BODY_SURROUND_ABB: "Surround",
IDS_YSM_BODY_TITLE_MENU_ABB: "Title menu",
IDS_YSM_BODY_UP: "Up",
IDS_YSM_BODY_YELLOW_ABB: "Yellow",
IDS_YSM_BUTTON_CLEAR_HISTORY_ABB: "Clear history",
IDS_YSM_BUTTON_DONE: "Done",
IDS_YSM_BUTTON_HISTORY: "History",
IDS_YSM_BUTTON_MENU: "Menu",
IDS_YSM_BUTTON_NEXT: "Next",
IDS_YSM_BUTTON_RETURN_UC: "RETURN",
IDS_YSM_BUTTON_SMART_HUB: "Smart Hub",
IDS_YSM_BUTTON_TOOLS_UC: "TOOLS",
IDS_YSM_BUTTON_VIDEO: "Video",
IDS_YSM_BUTTON_VOD: "VOD",
IDS_YSM_HEADER_HELP: "Help",
IDS_YSM_OPT_0: "0",
IDS_YSM_OPT_1: "1",
IDS_YSM_OPT_2: "2",
IDS_YSM_OPT_3: "3",
IDS_YSM_OPT_4: "4",
IDS_YSM_OPT_5: "5",
IDS_YSM_OPT_6: "6",
IDS_YSM_OPT_7: "7",
IDS_YSM_OPT_8: "8",
IDS_YSM_OPT_9: "9",
IDS_YSM_OPT_ENTER: "Enter",
IDS_YSM_OPT_POWER: "Power",
IDS_YSM_OPT_RECORD: "Record",
IDS_YSM_OPT_VOLUME_DOWN: "Volume down",
IDS_YSM_OPT_VOLUME_UP: "Volume up",
IDS_YSM_TAB4_GUIDE: "Guide",
IDS_CHATON_BODY_INDIA_M_COUNTRYNAME: "India",
IDS_CHATON_BODY_NETHERLANDS_M_COUNTRYNAME: "Netherlands",
IDS_WCL_BODY_RUSSIA_M_COUNTRYNAME: "Russia",
IDS_CHATON_BODY_AUSTRALIA_M_COUNTRYNAME: "Australia",
IDS_CHATON_BODY_SAUDI_ARABIA_M_COUNTRYNAME: "Saudi Arabia",
IDS_CHATON_BODY_CANADA_M_COUNTRYNAME: "Canada",
IDS_CHATON_BODY_BRAZIL_M_COUNTRYNAME: "Brazil",
IDS_CHATON_BODY_MEXICO_M_COUNTRYNAME: "Mexico",
IDS_CHATON_BODY_ARGENTINA_M_COUNTRYNAME: "Argentina",
IDS_CHATON_BODY_CHILE_M_COUNTRYNAME: "Chile",
IDS_CHATON_BODY_PERU_M_COUNTRYNAME: "Peru",
IDS_CHATON_BODY_COLOMBIA_M_COUNTRYNAME: "Colombia",
IDS_COM_POP_TRY_AGAIN: "Try again.",
IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB: "Change device",
IDS_YSM_BODY_TEMP_M_TEMPERATURE_ABB: "Temp.",
IDS_MSGF_BODY_REMOTE: "Remote",
IDS_YSM_OPT_TEMP_DOWN_ABB: "Temp. down",
IDS_YSM_OPT_TEMP_UP_ABB: "Temp. up",
IDS_YSM_OPT_TURBO_ABB: "Turbo",
IDS_YSM_OPT_DISPLAY_ABB: "Display",
IDS_YSM_OPT_DELIMITER_ABB: "Delimiter",
IDS_YSM_OPT_INTERNET_ABB: "Internet",
IDS_YSM_OPT_PIP: "PiP",
IDS_YSM_OPT_PIP_SWAP_ABB: "PiP swap",
IDS_YSM_OPT_PIP_CHANNEL_MINUS_ABB: "PiP channel -",
IDS_YSM_OPT_PIP_CHANNEL_PLUS_ABB: "PiP channel +",
IDS_YSM_OPT_PIP_MOVE_ABB: "PiP move",
IDS_YSM_OPT_DTV: "DTV",
IDS_YSM_OPT_COMPONENT_PD_ABB: "Component %d",
IDS_YSM_OPT_USB: "USB",
IDS_YSM_OPT_PICTURE_ABB2: "Picture",
IDS_YSM_OPT_3D: "3D",
IDS_YSM_OPT_REPLAY_ABB: "Replay",
IDS_YSM_OPT_DAY_MINUS: "Day -",
IDS_YSM_OPT_DAY_PLUS: "Day +",
IDS_YSM_OPT_RADIO: "Radio",
IDS_YSM_OPT_TV_RADIO_ABB: "TV/radio",
IDS_YSM_OPT_SWING_DOWN_ABB: "Swing down",
IDS_YSM_OPT_SWING_LEFT_ABB: "Swing left",
IDS_YSM_OPT_SWING_RIGHT_ABB: "Swing right",
IDS_YSM_OPT_SWING_UP_ABB: "Swing up",
IDS_YSM_OPT_PVR_MENU_ABB: "PVR menu",
IDS_YSM_OPT_RETURN_TO_LIVE_ABB: "Return to Live",
IDS_YSM_OPT_POWER_OFF_ABB2: "Power off",
IDS_YSM_OPT_POWER_ON_ABB: "Power on",
IDS_CHATON_BODY_JAPAN_M_COUNTRYNAME: "Japan",
IDS_YSM_BODY_VOL_M_VOLUME_ABB: "Vol",
IDS_YSM_HEADER_TV_AND_STB_ABB: "TV and STB",
IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB: "Sleep"};
STMS.setStmsMap( map );
STMS.refreshAllStr();
});