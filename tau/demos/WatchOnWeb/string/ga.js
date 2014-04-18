WatchOnSandbox( "STMS", function( m ) {
var STMS = m.STMS,
map = {
IDS_ST_BODY_VOLUME_M_SOUND_ABB: "Airde",
IDS_SR_BODY_AIR_CONDITIONER: "Aerchóirtheoir",
IDS_SR_BODY_AUSTRIA_M_COUNTRYNAME: "an Ostair",
IDS_SR_BODY_BELGIUM_M_COUNTRYNAME: "An Bheilg",
IDS_SR_BODY_CHINA_M_COUNTRYNAME: "an tSín",
IDS_SR_BODY_DENMARK_M_COUNTRYNAME: "An Danmhairg",
IDS_SR_BODY_FAN_SPEED_DOWN: "Luas fean síos",
IDS_SR_BODY_FAN_SPEED_UP: "Luas fean suas",
IDS_SR_BODY_FINLAND_M_COUNTRYNAME: "an Fhionlainn",
IDS_SR_BODY_FRANCE_M_COUNTRYNAME: "an Fhrainc",
IDS_SR_BODY_GERMANY_M_COUNTRYNAME: "An Ghearmáin",
IDS_SR_BODY_IRELAND_M_COUNTRYNAME: "Éire",
IDS_SR_BODY_ITALY_M_COUNTRYNAME: "an Iodáil",
IDS_SR_BODY_LUXEMBOURG_M_COUNTRYNAME: "Lucsamburg",
IDS_SR_BODY_MODE: "Mód",
IDS_SR_BODY_NORWAY_M_COUNTRYNAME: "an Iorua",
IDS_SR_BODY_POLAND_M_COUNTRYNAME: "an Pholainn",
IDS_SR_BODY_PORTUGAL_M_COUNTRYNAME: "An Phortaingéil",
IDS_SR_BODY_SET_UP: "Socrú",
IDS_SR_BODY_SOUTH_KOREA_M_COUNTRYNAME: "an Chóiré Theas",
IDS_SR_BODY_SPAIN_M_COUNTRYNAME: "An Spáinn",
IDS_SR_BODY_SWEDEN_M_COUNTRYNAME: "An tSualainn",
IDS_SR_BODY_SWITZERLAND_M_COUNTRYNAME: "an Eilvéis",
IDS_SR_BODY_UNITED_KINGDOM_M_COUNTRYNAME: "An Ríocht Aontaithe",
IDS_SR_BODY_UNITED_STATES_OF_AMERICA_M_COUNTRYNAME: "Stáit Aontaithe Mheiriceá",
IDS_SR_BUTTON_BACK: "Siar",
IDS_SR_BUTTON_CANCEL_ABB: "Cuir ar ceal",
IDS_SR_BUTTON_DELETE: "Scrios",
IDS_SR_BUTTON_DONE: "Déanta",
IDS_SR_BUTTON_EXIT: "Scoir",
IDS_SR_BUTTON_INFO: "Faisnéis",
IDS_SR_BUTTON_MENU: "Biachlár",
IDS_SR_BUTTON_MUTE: "Balbh",
IDS_SR_BUTTON_OK: "OK",
IDS_SR_BUTTON_POWER: "Cumhacht",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY: "Roghnaigh do thír",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY_REGION: "Roghnaigh do thír/réigiún",
IDS_SR_BUTTON_SHOW_OTHER_BRANDS: "Taispeáin brandaí eile",
IDS_SR_BUTTON_SOURCE_T_SMART_REMOTE: "Foinse",
IDS_SR_BUTTON_TEMP_DOWN_M_TEMPERATURE: "Teocht síos",
IDS_SR_BUTTON_TEMP_UP_M_TEMPERATURE: "Teocht suas",
IDS_SR_BUTTON_TV: "Teilifís",
IDS_SR_BUTTON_YES: "Déan é",
IDS_SR_HEADER_ALL_BRANDS: "Gach branda",
IDS_SR_HEADER_DELETE_ABB: "Scrios",
IDS_SR_HEADER_RESET: "Athshoc.",
IDS_SR_HEADER_WATCHON_M_APPLICATION: "WatchON",
IDS_SR_OPT_ADD_DEVICE_ABB: "Cuir gléas leis",
IDS_SR_OPT_STB_ABB: "STB",
IDS_YSM_POP_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Socraigh cianrialtán ar do ghléas?",
IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB: "Taispeán gach branda",
IDS_YSM_BUTTON_VOL_UC: "AIRDE",
IDS_YSM_BUTTON_CH: "CNL",
IDS_YSM_BUTTON_NO: "Ná déan é",
IDS_SAPPS_BODY_NOTICE: "Fógra",
IDS_MSGF_HEADER_OPTION: "Rogha",
IDS_MSGF_HEADER_OPTIONS: "Roghanna",
IDS_SSCHOL_HEADER_COMPLETED: "Curtha i gcrích",
IDS_YSM_HEADER_SET_UP_REMOTE_ABB: "Soc. cianrialtán",
IDS_YSM_BODY_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Socraigh cianrialtán ar do ghléas?",
IDS_YSM_BODY_LATIN_COUNTRIES_ABB: "Tíortha Laidineacha",
IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON: "Pointeáil d'uaireadóir i dtreo an %s agus brúigh an chumhachteochair.",
IDS_YSM_BODY_TAP_THE_BUTTON_ABB: "Tap. an cnaipe.",
IDS_YSM_BODY_DID_IT_WORK_Q_ABB: "Ar oibrigh sé?",
IDS_YSM_HEADER_SETUP_COMPLETE_ABB: "Socraithe",
IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE: "Tá socrú cianrialtáin %s críochnaithe.",
IDS_YSM_BODY_THIS_MODEL_IS_NOT_SUPPORTED: "Níl tacú ann don tsamhail seo.",
IDS_YSM_BODY_THE_REMOTE_CONTROL_WILL_BE_REMOVED: "Bainfear an cianrialtán.",
IDS_YSM_BODY_FAN_SPEED_ABB: "Luas fean",
IDS_YSM_BODY_MODE_ABB2: "Mód",
IDS_YSM_OPT_AV_RECEIVER_ABB2: "Faighteoir AV",
IDS_YSM_BODY_BLUE: "Gorm",
IDS_YSM_BODY_CHANNEL_DOWN_ABB: "Cainéal síos",
IDS_YSM_BODY_CHANNEL_LIST_ABB: "Liosta cainéal",
IDS_YSM_BODY_CHANNEL_UP_ABB: "Cainéal suas",
IDS_YSM_BODY_DISK_MENU_ABB: "Diosc-r.chlár",
IDS_YSM_BODY_DOWN: "Síos",
IDS_YSM_BODY_DVR: "DVR",
IDS_YSM_BODY_EJECT_ABB: "Díchuir",
IDS_YSM_BODY_FAST_FORWARD_ABB: "Mearchas",
IDS_YSM_BODY_FAVOURITE_ABB: "Ceanán",
IDS_YSM_BODY_FORMAT_HASPECT_ABB: "Formáid (Cóimheas)",
IDS_YSM_BODY_GREEN_ABB: "Glas",
IDS_YSM_BODY_HDMI_PD_ABB: "HDMI %d",
IDS_YSM_BODY_INPUT_ABB: "Ionchuir",
IDS_YSM_BODY_LEFT: "Tuathal",
IDS_YSM_BODY_LIST: "Liostaigh",
IDS_YSM_BODY_OTHER_COUNTRIES_ABB: "Tíortha eile",
IDS_YSM_BODY_PAUSE: "Cuir ar sos",
IDS_YSM_BODY_PLAY: "Seinn",
IDS_YSM_BODY_PREVIOUS: "Roimhe",
IDS_YSM_BODY_PRE_CHANNEL_ABB: "Réamhchainéal",
IDS_YSM_BODY_RED: "Dearg",
IDS_YSM_BODY_REWIND_ABB: "Cúlchas",
IDS_YSM_BODY_RIGHT_ABB2: "Deas",
IDS_YSM_BODY_SELECT: "Roghnaigh",
IDS_YSM_BODY_SOUND_MODE_ABB: "Mód fuaime",
IDS_YSM_BODY_START_SETUP_OF_STB_REMOTE_CONTROL: "Tosaigh socrú an chianrialtáin STB.",
IDS_YSM_BODY_STOP: "Stop",
IDS_YSM_BODY_SUBTITLES_ABB2: "Fotheidil",
IDS_YSM_BODY_SUBWOOFER_ABB: "Fo-amhaire",
IDS_YSM_BODY_SURROUND_ABB: "Mórthimpeall",
IDS_YSM_BODY_TITLE_MENU_ABB: "R.chláir teideal",
IDS_YSM_BODY_UP: "Suas",
IDS_YSM_BODY_YELLOW_ABB: "Buí",
IDS_YSM_BUTTON_CLEAR_HISTORY_ABB: "Glan stair",
IDS_YSM_BUTTON_DONE: "Déanta",
IDS_YSM_BUTTON_HISTORY: "Stair",
IDS_YSM_BUTTON_MENU: "Biachlár",
IDS_YSM_BUTTON_NEXT: "Ar aghaidh",
IDS_YSM_BUTTON_RETURN_UC: "FILL",
IDS_YSM_BUTTON_SMART_HUB: "Mol Cliste",
IDS_YSM_BUTTON_TOOLS_UC: "UIRLISÍ",
IDS_YSM_BUTTON_VIDEO: "Físeán",
IDS_YSM_BUTTON_VOD: "VOD",
IDS_YSM_HEADER_HELP: "Cuidiú",
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
IDS_YSM_OPT_ENTER: "Iontráil",
IDS_YSM_OPT_POWER: "Cumhacht",
IDS_YSM_OPT_RECORD: "Taifead",
IDS_YSM_OPT_VOLUME_DOWN: "Airde síos",
IDS_YSM_OPT_VOLUME_UP: "Airde suas",
IDS_YSM_TAB4_GUIDE: "Treoir",
IDS_CHATON_BODY_INDIA_M_COUNTRYNAME: "an India",
IDS_CHATON_BODY_NETHERLANDS_M_COUNTRYNAME: "an Ísiltír",
IDS_WCL_BODY_RUSSIA_M_COUNTRYNAME: "an Rúis",
IDS_CHATON_BODY_AUSTRALIA_M_COUNTRYNAME: "an Astráil",
IDS_CHATON_BODY_SAUDI_ARABIA_M_COUNTRYNAME: "an Araib Shádach",
IDS_CHATON_BODY_CANADA_M_COUNTRYNAME: "Ceanada",
IDS_CHATON_BODY_BRAZIL_M_COUNTRYNAME: "an Bhrasaíl",
IDS_CHATON_BODY_MEXICO_M_COUNTRYNAME: "Meicsiceo",
IDS_CHATON_BODY_ARGENTINA_M_COUNTRYNAME: "an Airgintín",
IDS_CHATON_BODY_CHILE_M_COUNTRYNAME: "an tSile",
IDS_CHATON_BODY_PERU_M_COUNTRYNAME: "Peiriú",
IDS_CHATON_BODY_COLOMBIA_M_COUNTRYNAME: "an Cholóim",
IDS_COM_POP_TRY_AGAIN: "Triail arís",
IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB: "Athr. Gléas",
IDS_YSM_BODY_TEMP_M_TEMPERATURE_ABB: "Teocht.",
IDS_MSGF_BODY_REMOTE: "Cianda",
IDS_YSM_OPT_TEMP_DOWN_ABB: "Teocht síos",
IDS_YSM_OPT_TEMP_UP_ABB: "Teocht suas",
IDS_YSM_OPT_TURBO_ABB: "Turba",
IDS_YSM_OPT_DISPLAY_ABB: "Taispeáint",
IDS_YSM_OPT_DELIMITER_ABB: "Teormharcóir",
IDS_YSM_OPT_INTERNET_ABB: "Idirlíon",
IDS_YSM_OPT_PIP: "PiP",
IDS_YSM_OPT_PIP_SWAP_ABB: "Malartú PiP",
IDS_YSM_OPT_PIP_CHANNEL_MINUS_ABB: "Cainéal PiP -",
IDS_YSM_OPT_PIP_CHANNEL_PLUS_ABB: "Cainéal PiP +",
IDS_YSM_OPT_PIP_MOVE_ABB: "Bog PiP",
IDS_YSM_OPT_DTV: "DTV",
IDS_YSM_OPT_COMPONENT_PD_ABB: "Comhpháirt %d",
IDS_YSM_OPT_USB: "USB",
IDS_YSM_OPT_PICTURE_ABB2: "Pictiúr",
IDS_YSM_OPT_3D: "3D",
IDS_YSM_OPT_REPLAY_ABB: "Athsheinm",
IDS_YSM_OPT_DAY_MINUS: "Lá -",
IDS_YSM_OPT_DAY_PLUS: "Lá +",
IDS_YSM_OPT_RADIO: "Raidió",
IDS_YSM_OPT_TV_RADIO_ABB: "Teilifís/raidió",
IDS_YSM_OPT_SWING_DOWN_ABB: "Luascadh síos",
IDS_YSM_OPT_SWING_LEFT_ABB: "Luascadh ar chlé",
IDS_YSM_OPT_SWING_RIGHT_ABB: "Luasc. ar dheis",
IDS_YSM_OPT_SWING_UP_ABB: "Luascadh suas",
IDS_YSM_OPT_PVR_MENU_ABB: "Roghchlár PVR",
IDS_YSM_OPT_RETURN_TO_LIVE_ABB: "Fill ar Bheo",
IDS_YSM_OPT_POWER_OFF_ABB2: "Cumhacht as",
IDS_YSM_OPT_POWER_ON_ABB: "Cumhacht ar siúl",
IDS_CHATON_BODY_JAPAN_M_COUNTRYNAME: "an tSeapáin",
IDS_YSM_BODY_VOL_M_VOLUME_ABB: "Airde",
IDS_YSM_HEADER_TV_AND_STB_ABB: "TV 's STB",
IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB: "Codladh"};
STMS.setStmsMap( map );
STMS.refreshAllStr();
});