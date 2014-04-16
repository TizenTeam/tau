WatchOnSandbox( "STMS", function( m ) {
var STMS = m.STMS,
map = {
IDS_ST_BODY_VOLUME_M_SOUND_ABB: "හඬ තීව්‍රතාවය",
IDS_SR_BODY_AIR_CONDITIONER: "වායු සමීකරණය",
IDS_SR_BODY_AUSTRIA_M_COUNTRYNAME: "ඔස්ට්‍රියාව",
IDS_SR_BODY_BELGIUM_M_COUNTRYNAME: "බෙල්ජියම",
IDS_SR_BODY_CHINA_M_COUNTRYNAME: "චීනය",
IDS_SR_BODY_DENMARK_M_COUNTRYNAME: "ඩෙන්මාර්කය",
IDS_SR_BODY_FAN_SPEED_DOWN: "පංකා වේගය අඩු",
IDS_SR_BODY_FAN_SPEED_UP: "පංකා වේගය වැඩි",
IDS_SR_BODY_FINLAND_M_COUNTRYNAME: "පින්ලන්තය",
IDS_SR_BODY_FRANCE_M_COUNTRYNAME: "ප්‍රංශය",
IDS_SR_BODY_GERMANY_M_COUNTRYNAME: "ජර්මනිය",
IDS_SR_BODY_IRELAND_M_COUNTRYNAME: "අයර්ලන්තය",
IDS_SR_BODY_ITALY_M_COUNTRYNAME: "ඉතාලිය",
IDS_SR_BODY_LUXEMBOURG_M_COUNTRYNAME: "ලක්ස්සෙම්බර්ග්",
IDS_SR_BODY_MODE: "ආකාරය",
IDS_SR_BODY_NORWAY_M_COUNTRYNAME: "නොර්වේ",
IDS_SR_BODY_POLAND_M_COUNTRYNAME: "පෝලන්තය",
IDS_SR_BODY_PORTUGAL_M_COUNTRYNAME: "පෘතුගාලය",
IDS_SR_BODY_SET_UP: "සැකසීම",
IDS_SR_BODY_SOUTH_KOREA_M_COUNTRYNAME: "දකුණු කොරියාව",
IDS_SR_BODY_SPAIN_M_COUNTRYNAME: "ස්පාඤ්ඤය",
IDS_SR_BODY_SWEDEN_M_COUNTRYNAME: "ස්වීඩනය",
IDS_SR_BODY_SWITZERLAND_M_COUNTRYNAME: "ස්විට්සර්ලන්තය",
IDS_SR_BODY_UNITED_KINGDOM_M_COUNTRYNAME: "එක්සත් රාජධානිය",
IDS_SR_BODY_UNITED_STATES_OF_AMERICA_M_COUNTRYNAME: "ඇමරිකා එක්සත් ජනපදය",
IDS_SR_BUTTON_BACK: "ආපසු",
IDS_SR_BUTTON_CANCEL_ABB: "අවලංගු කරන්න",
IDS_SR_BUTTON_DELETE: "මකන්න",
IDS_SR_BUTTON_DONE: "නිමයි",
IDS_SR_BUTTON_EXIT: "ඉවත් වන්න",
IDS_SR_BUTTON_INFO: "තොර",
IDS_SR_BUTTON_MENU: "මෙනුව",
IDS_SR_BUTTON_MUTE: "නිහඬ කර.",
IDS_SR_BUTTON_OK: "හරි",
IDS_SR_BUTTON_POWER: "බලය",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY: "ඔබේ රට තෝරන්න",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY_REGION: "ඔබේ රට/කලාපය තෝරන්න",
IDS_SR_BUTTON_SHOW_OTHER_BRANDS: "වෙනත් වෙළඳ නාම පෙන්වන්න",
IDS_SR_BUTTON_SOURCE_T_SMART_REMOTE: "ප්‍රභවය",
IDS_SR_BUTTON_TEMP_DOWN_M_TEMPERATURE: "උෂ්ණත්වය පහලට",
IDS_SR_BUTTON_TEMP_UP_M_TEMPERATURE: "උෂ්ණත්වය ඉහලට",
IDS_SR_BUTTON_TV: "TV",
IDS_SR_BUTTON_YES: "ඔව්",
IDS_SR_HEADER_ALL_BRANDS: "සියලු වර්ග",
IDS_SR_HEADER_DELETE_ABB: "මකන්න",
IDS_SR_HEADER_RESET: "නැවත සැකසීම",
IDS_SR_HEADER_WATCHON_M_APPLICATION: "WatchON",
IDS_SR_OPT_ADD_DEVICE_ABB: "උපාංගයක් එක් කරන්න",
IDS_SR_OPT_STB_ABB: "STB",
IDS_YSM_POP_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "ඔබේ උපාංගයේ දුරස්ථ පාලකය පිහිටුවන්න ද?",
IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB: "සියලු සන්නම් පෙන්වන්න",
IDS_YSM_BUTTON_VOL_UC: "හඬ",
IDS_YSM_BUTTON_CH: "CH",
IDS_YSM_BUTTON_NO: "නැත",
IDS_SAPPS_BODY_NOTICE: "දැන්වීම",
IDS_MSGF_HEADER_OPTION: "විකල්පය",
IDS_MSGF_HEADER_OPTIONS: "අභිරුචි",
IDS_SSCHOL_HEADER_COMPLETED: "සම්පූර්ණ කරන ලදී",
IDS_YSM_HEADER_SET_UP_REMOTE_ABB: "දුරස්ථ පාලකය පිහිටුව.",
IDS_YSM_BODY_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "ඔබේ උපාංගයේ දුරස්ථ පාලකය පිහිටුවන්න ද?",
IDS_YSM_BODY_LATIN_COUNTRIES_ABB: "ලතින් රටවල්",
IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON: "ඔබේ අත් ඔරලෝසුව %s වෙත යොමු කර බල බොත්තම තට්ටු කරන්න.",
IDS_YSM_BODY_TAP_THE_BUTTON_ABB: "බොත්තම තට්ටු කර.",
IDS_YSM_BODY_DID_IT_WORK_Q_ABB: "ඉන් ප්‍රතිඵ.ක් ලැබිණි ද?",
IDS_YSM_HEADER_SETUP_COMPLETE_ABB: "පිහිටුවීම සම්පූර්.",
IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE: "%s දුරස්ථ පාලන පිහිටුවීම සම්පූර්ණයි.",
IDS_YSM_BODY_THIS_MODEL_IS_NOT_SUPPORTED: "මෙම මාදිළියෙන් සහාය නොදක්වයි.",
IDS_YSM_BODY_THE_REMOTE_CONTROL_WILL_BE_REMOVED: "දුරස්ථ පාලකය ඉවත් කෙරෙනු ඇත.",
IDS_YSM_BODY_FAN_SPEED_ABB: "පංකා වේගය",
IDS_YSM_BODY_MODE_ABB2: "ප්‍රකාරය",
IDS_YSM_OPT_AV_RECEIVER_ABB2: "AV ග්‍රාහකය",
IDS_YSM_BODY_BLUE: "නිල්",
IDS_YSM_BODY_CHANNEL_DOWN_ABB: "චැනලය පහළට",
IDS_YSM_BODY_CHANNEL_LIST_ABB: "නාලිකා ලැයිස්.",
IDS_YSM_BODY_CHANNEL_UP_ABB: "චැනලය ඉහළට",
IDS_YSM_BODY_DISK_MENU_ABB: "ඩිස්ක මෙනුව",
IDS_YSM_BODY_DOWN: "පහළ",
IDS_YSM_BODY_DVR: "DVR",
IDS_YSM_BODY_EJECT_ABB: "ඉවතට ගන්න",
IDS_YSM_BODY_FAST_FORWARD_ABB: "ඉදිරි වේග වාද.",
IDS_YSM_BODY_FAVOURITE_ABB: "ප්‍රියතම",
IDS_YSM_BODY_FORMAT_HASPECT_ABB: "ආකෘතිය (දර්ශනය)",
IDS_YSM_BODY_GREEN_ABB: "කොළ",
IDS_YSM_BODY_HDMI_PD_ABB: "HDMI %d",
IDS_YSM_BODY_INPUT_ABB: "අදානය කරන්න",
IDS_YSM_BODY_LEFT: "වම",
IDS_YSM_BODY_LIST: "ලැයිස්තුව",
IDS_YSM_BODY_OTHER_COUNTRIES_ABB: "වෙනත් රටවල්",
IDS_YSM_BODY_PAUSE: "විරාමය",
IDS_YSM_BODY_PLAY: "වාදනය",
IDS_YSM_BODY_PREVIOUS: "පෙර",
IDS_YSM_BODY_PRE_CHANNEL_ABB: "පූර්ව නාලිකාව",
IDS_YSM_BODY_RED: "රෙඩ්",
IDS_YSM_BODY_REWIND_ABB: "පසු වාදනය කර.",
IDS_YSM_BODY_RIGHT_ABB2: "දකුණ",
IDS_YSM_BODY_SELECT: "තෝරන්න",
IDS_YSM_BODY_SOUND_MODE_ABB: "ශබ්ද ප්‍රකාරය",
IDS_YSM_BODY_START_SETUP_OF_STB_REMOTE_CONTROL: "STB දුරස්ථ පාලකය පිහිටුවීම අරඹන්න.",
IDS_YSM_BODY_STOP: "නවත්වන්න",
IDS_YSM_BODY_SUBTITLES_ABB2: "උපසිරැසි",
IDS_YSM_BODY_SUBWOOFER_ABB: "සබ්වූෆර්",
IDS_YSM_BODY_SURROUND_ABB: "වට",
IDS_YSM_BODY_TITLE_MENU_ABB: "මාතෘකා මෙනුව",
IDS_YSM_BODY_UP: "උඩ",
IDS_YSM_BODY_YELLOW_ABB: "කහ",
IDS_YSM_BUTTON_CLEAR_HISTORY_ABB: "අතීතය මකන්න",
IDS_YSM_BUTTON_DONE: "නිමයි",
IDS_YSM_BUTTON_HISTORY: "අතීතය",
IDS_YSM_BUTTON_MENU: "මෙනුව",
IDS_YSM_BUTTON_NEXT: "ඊළඟ",
IDS_YSM_BUTTON_RETURN_UC: "භාර දෙන්න",
IDS_YSM_BUTTON_SMART_HUB: "ස්මාට් හබ්",
IDS_YSM_BUTTON_TOOLS_UC: "උපකරණ",
IDS_YSM_BUTTON_VIDEO: "වීඩියෝ",
IDS_YSM_BUTTON_VOD: "VOD",
IDS_YSM_HEADER_HELP: "සහාය",
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
IDS_YSM_OPT_ENTER: "ඇතුළු කරන්න",
IDS_YSM_OPT_POWER: "බලය",
IDS_YSM_OPT_RECORD: "පටිගත කරන්න",
IDS_YSM_OPT_VOLUME_DOWN: "හඬ තීව්‍රතාවය අඩු කරන්න",
IDS_YSM_OPT_VOLUME_UP: "හඬ තීව්‍රතාවය වැඩි කරන්න",
IDS_YSM_TAB4_GUIDE: "අත්වැල",
IDS_CHATON_BODY_INDIA_M_COUNTRYNAME: "ඉන්දියාව",
IDS_CHATON_BODY_NETHERLANDS_M_COUNTRYNAME: "නෙදර්ලන්තය",
IDS_WCL_BODY_RUSSIA_M_COUNTRYNAME: "රුසියාව",
IDS_CHATON_BODY_AUSTRALIA_M_COUNTRYNAME: "ඔස්ට්‍රේලියාව",
IDS_CHATON_BODY_SAUDI_ARABIA_M_COUNTRYNAME: "සෞදි අරාබිය",
IDS_CHATON_BODY_CANADA_M_COUNTRYNAME: "කැනඩාව",
IDS_CHATON_BODY_BRAZIL_M_COUNTRYNAME: "බ්‍රසීලය",
IDS_CHATON_BODY_MEXICO_M_COUNTRYNAME: "මෙක්සිකෝව",
IDS_CHATON_BODY_ARGENTINA_M_COUNTRYNAME: "ආජන්ටිනාව",
IDS_CHATON_BODY_CHILE_M_COUNTRYNAME: "චිලී",
IDS_CHATON_BODY_PERU_M_COUNTRYNAME: "පේරු",
IDS_CHATON_BODY_COLOMBIA_M_COUNTRYNAME: "කොලොම්බියාව",
IDS_COM_POP_TRY_AGAIN: "නැවත උත්සාහ කරන්න.",
IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB: "උපාංගය මාරු කර.",
IDS_YSM_BODY_TEMP_M_TEMPERATURE_ABB: "උෂ්ණත්වය.",
IDS_MSGF_BODY_REMOTE: "දුරස්ථ",
IDS_YSM_OPT_TEMP_DOWN_ABB: "උෂ්ණත්වය පහළට",
IDS_YSM_OPT_TEMP_UP_ABB: "උෂ්ණත්වය ඉහළට",
IDS_YSM_OPT_TURBO_ABB: "ටර්බෝ",
IDS_YSM_OPT_DISPLAY_ABB: "පෙන්වන්න",
IDS_YSM_OPT_DELIMITER_ABB: "ඩෙලිමීටර්",
IDS_YSM_OPT_INTERNET_ABB: "අන්තර්ජාලය",
IDS_YSM_OPT_PIP: "PiP",
IDS_YSM_OPT_PIP_SWAP_ABB: "PiP මාරු කිරීම",
IDS_YSM_OPT_PIP_CHANNEL_MINUS_ABB: "PiP නාලිකාව -",
IDS_YSM_OPT_PIP_CHANNEL_PLUS_ABB: "PiP නාලිකාව +",
IDS_YSM_OPT_PIP_MOVE_ABB: "PiP ගෙන යාම",
IDS_YSM_OPT_DTV: "DTV",
IDS_YSM_OPT_COMPONENT_PD_ABB: "සංරචක %d",
IDS_YSM_OPT_USB: "USB",
IDS_YSM_OPT_PICTURE_ABB2: "පිංතූරය",
IDS_YSM_OPT_3D: "3D",
IDS_YSM_OPT_REPLAY_ABB: "යළි ධාවනය කරන්න",
IDS_YSM_OPT_DAY_MINUS: "දිනය -",
IDS_YSM_OPT_DAY_PLUS: "දිනය +",
IDS_YSM_OPT_RADIO: "රේඩියෝව‍",
IDS_YSM_OPT_TV_RADIO_ABB: "TV/රේඩියෝ",
IDS_YSM_OPT_SWING_DOWN_ABB: "පහළට පද්දන්න",
IDS_YSM_OPT_SWING_LEFT_ABB: "වමට පද්දන්න",
IDS_YSM_OPT_SWING_RIGHT_ABB: "දකුණට පද්දන්න",
IDS_YSM_OPT_SWING_UP_ABB: "ඉහළට පද්දන්න",
IDS_YSM_OPT_PVR_MENU_ABB: "PVR මෙනුව",
IDS_YSM_OPT_RETURN_TO_LIVE_ABB: "සජීවී වෙත ආපසු ය",
IDS_YSM_OPT_POWER_OFF_ABB2: "බලය විසන්ධි ක",
IDS_YSM_OPT_POWER_ON_ABB: "බලය ක්‍රියාත්මක ක",
IDS_CHATON_BODY_JAPAN_M_COUNTRYNAME: "ජපානය",
IDS_YSM_BODY_VOL_M_VOLUME_ABB: "ධාරිතාව",
IDS_YSM_HEADER_TV_AND_STB_ABB: "TV හා STB",
IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB: "නිද්‍රාව"};
STMS.setStmsMap( map );
STMS.refreshAllStr();
});