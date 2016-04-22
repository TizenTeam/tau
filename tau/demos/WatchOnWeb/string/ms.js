WatchOnSandbox( "STMS", function( m ) {
var STMS = m.STMS,
map = {
IDS_ST_BODY_VOLUME_M_SOUND_ABB: "Klantangan",
IDS_SR_BODY_AIR_CONDITIONER: "Penyaman udara",
IDS_SR_BODY_AUSTRIA_M_COUNTRYNAME: "Austria",
IDS_SR_BODY_BELGIUM_M_COUNTRYNAME: "Belgium",
IDS_SR_BODY_CHINA_M_COUNTRYNAME: "China",
IDS_SR_BODY_DENMARK_M_COUNTRYNAME: "Denmark",
IDS_SR_BODY_FAN_SPEED_DOWN: "Perlahankan kipas",
IDS_SR_BODY_FAN_SPEED_UP: "Lajukan kipas",
IDS_SR_BODY_FINLAND_M_COUNTRYNAME: "Finland",
IDS_SR_BODY_FRANCE_M_COUNTRYNAME: "Perancis",
IDS_SR_BODY_GERMANY_M_COUNTRYNAME: "Jerman",
IDS_SR_BODY_IRELAND_M_COUNTRYNAME: "Ireland",
IDS_SR_BODY_ITALY_M_COUNTRYNAME: "Itali",
IDS_SR_BODY_LUXEMBOURG_M_COUNTRYNAME: "Luxembourg",
IDS_SR_BODY_MODE: "Mod",
IDS_SR_BODY_NORWAY_M_COUNTRYNAME: "Norway",
IDS_SR_BODY_POLAND_M_COUNTRYNAME: "Poland",
IDS_SR_BODY_PORTUGAL_M_COUNTRYNAME: "Portugal",
IDS_SR_BODY_SET_UP: "Persediaan",
IDS_SR_BODY_SOUTH_KOREA_M_COUNTRYNAME: "Korea Selatan",
IDS_SR_BODY_SPAIN_M_COUNTRYNAME: "Sepanyol",
IDS_SR_BODY_SWEDEN_M_COUNTRYNAME: "Sweden",
IDS_SR_BODY_SWITZERLAND_M_COUNTRYNAME: "Switzerland",
IDS_SR_BODY_UNITED_KINGDOM_M_COUNTRYNAME: "United Kingdom",
IDS_SR_BODY_UNITED_STATES_OF_AMERICA_M_COUNTRYNAME: "Amerika Syarikat",
IDS_SR_BUTTON_BACK: "Kembali",
IDS_SR_BUTTON_CANCEL_ABB: "Batal",
IDS_SR_BUTTON_DELETE: "Padam",
IDS_SR_BUTTON_DONE: "Selesai",
IDS_SR_BUTTON_EXIT: "Keluar",
IDS_SR_BUTTON_INFO: "Maklumat",
IDS_SR_BUTTON_MENU: "Menu",
IDS_SR_BUTTON_MUTE: "Bisu",
IDS_SR_BUTTON_OK: "OK",
IDS_SR_BUTTON_POWER: "Kuasa",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY: "Pilih negara anda",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY_REGION: "Pilih negara/kawasan anda",
IDS_SR_BUTTON_SHOW_OTHER_BRANDS: "Tunjukkan jenama lain",
IDS_SR_BUTTON_SOURCE_T_SMART_REMOTE: "Sumber",
IDS_SR_BUTTON_TEMP_DOWN_M_TEMPERATURE: "Suhu turun",
IDS_SR_BUTTON_TEMP_UP_M_TEMPERATURE: "Suhu naik",
IDS_SR_BUTTON_TV: "TV",
IDS_SR_BUTTON_YES: "Ya",
IDS_SR_HEADER_ALL_BRANDS: "Semua jenama",
IDS_SR_HEADER_DELETE_ABB: "Padam",
IDS_SR_HEADER_RESET: "Tetap semula",
IDS_SR_HEADER_WATCHON_M_APPLICATION: "WatchON",
IDS_SR_OPT_ADD_DEVICE_ABB: "Tambah peranti",
IDS_SR_OPT_STB_ABB: "STB",
IDS_YSM_POP_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Sediakan kawalan jauh pada peranti anda?",
IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB: "Tunjukkan semua jenama",
IDS_YSM_BUTTON_VOL_UC: "KELANTANGAN",
IDS_YSM_BUTTON_CH: "SAL",
IDS_YSM_BUTTON_NO: "Tidak",
IDS_SAPPS_BODY_NOTICE: "Notis",
IDS_MSGF_HEADER_OPTION: "Option",
IDS_MSGF_HEADER_OPTIONS: "Pilihan",
IDS_SSCHOL_HEADER_COMPLETED: "Selesai",
IDS_YSM_HEADER_SET_UP_REMOTE_ABB: "Sdiaan kwln jauh",
IDS_YSM_BODY_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Sediakan kawalan jauh pada peranti anda?",
IDS_YSM_BODY_LATIN_COUNTRIES_ABB: "Negara Latin",
IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON: "Halakan jam anda ke arah %s dan ketik butang kuasa.",
IDS_YSM_BODY_TAP_THE_BUTTON_ABB: "Ketik butang.",
IDS_YSM_BODY_DID_IT_WORK_Q_ABB: "Ia berfungsi?",
IDS_YSM_HEADER_SETUP_COMPLETE_ABB: "P'sediaan slesai",
IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE: "Persediaan kawalan jauh %s selesai.",
IDS_YSM_BODY_THIS_MODEL_IS_NOT_SUPPORTED: "Model ini tidak disokong.",
IDS_YSM_BODY_THE_REMOTE_CONTROL_WILL_BE_REMOVED: "Kawalan jauh akan dialih keluar.",
IDS_YSM_BODY_FAN_SPEED_ABB: "Kelajuan kipas",
IDS_YSM_BODY_MODE_ABB2: "Mod",
IDS_YSM_OPT_AV_RECEIVER_ABB2: "Penerima AV",
IDS_YSM_BODY_BLUE: "Biru",
IDS_YSM_BODY_CHANNEL_DOWN_ABB: "Turunkan salrn",
IDS_YSM_BODY_CHANNEL_LIST_ABB: "Snarai saluran",
IDS_YSM_BODY_CHANNEL_UP_ABB: "Naikkn saluran",
IDS_YSM_BODY_DISK_MENU_ABB: "Menu cakera",
IDS_YSM_BODY_DOWN: "Ke bawah",
IDS_YSM_BODY_DVR: "DVR",
IDS_YSM_BODY_EJECT_ABB: "Keluarkan",
IDS_YSM_BODY_FAST_FORWARD_ABB: "Mara laju",
IDS_YSM_BODY_FAVOURITE_ABB: "Kegemaran",
IDS_YSM_BODY_FORMAT_HASPECT_ABB: "Format (Aspek)",
IDS_YSM_BODY_GREEN_ABB: "Hijau",
IDS_YSM_BODY_HDMI_PD_ABB: "HDMI %d",
IDS_YSM_BODY_INPUT_ABB: "Input",
IDS_YSM_BODY_LEFT: "Kiri",
IDS_YSM_BODY_LIST: "Senarai",
IDS_YSM_BODY_OTHER_COUNTRIES_ABB: "Negara lain",
IDS_YSM_BODY_PAUSE: "Jeda",
IDS_YSM_BODY_PLAY: "Main",
IDS_YSM_BODY_PREVIOUS: "Sebelumnya",
IDS_YSM_BODY_PRE_CHANNEL_ABB: "Pra saluran",
IDS_YSM_BODY_RED: "Merah",
IDS_YSM_BODY_REWIND_ABB: "Gulung semula",
IDS_YSM_BODY_RIGHT_ABB2: "Betul",
IDS_YSM_BODY_SELECT: "Pilih",
IDS_YSM_BODY_SOUND_MODE_ABB: "Mod bunyi",
IDS_YSM_BODY_START_SETUP_OF_STB_REMOTE_CONTROL: "Mula sediakan kawalan jauh STB.",
IDS_YSM_BODY_STOP: "Henti",
IDS_YSM_BODY_SUBTITLES_ABB2: "Sari kata",
IDS_YSM_BODY_SUBWOOFER_ABB: "Subwufer",
IDS_YSM_BODY_SURROUND_ABB: "Keliling",
IDS_YSM_BODY_TITLE_MENU_ABB: "Menu tajuk",
IDS_YSM_BODY_UP: "Naik",
IDS_YSM_BODY_YELLOW_ABB: "Kuning",
IDS_YSM_BUTTON_CLEAR_HISTORY_ABB: "Padam sejarah",
IDS_YSM_BUTTON_DONE: "Selesai",
IDS_YSM_BUTTON_HISTORY: "Sejarah",
IDS_YSM_BUTTON_MENU: "Menu",
IDS_YSM_BUTTON_NEXT: "Berikut",
IDS_YSM_BUTTON_RETURN_UC: "KEMBALI",
IDS_YSM_BUTTON_SMART_HUB: "Smart Hub",
IDS_YSM_BUTTON_TOOLS_UC: "ALAT",
IDS_YSM_BUTTON_VIDEO: "Video",
IDS_YSM_BUTTON_VOD: "VOD",
IDS_YSM_HEADER_HELP: "Bantuan",
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
IDS_YSM_OPT_ENTER: "Masuk",
IDS_YSM_OPT_POWER: "Kuasa",
IDS_YSM_OPT_RECORD: "Rakam",
IDS_YSM_OPT_VOLUME_DOWN: "Turunkan kelantangan",
IDS_YSM_OPT_VOLUME_UP: "Naikkan kelantangan",
IDS_YSM_TAB4_GUIDE: "Panduan",
IDS_CHATON_BODY_INDIA_M_COUNTRYNAME: "India",
IDS_CHATON_BODY_NETHERLANDS_M_COUNTRYNAME: "Belanda",
IDS_WCL_BODY_RUSSIA_M_COUNTRYNAME: "Rusia",
IDS_CHATON_BODY_AUSTRALIA_M_COUNTRYNAME: "Australia",
IDS_CHATON_BODY_SAUDI_ARABIA_M_COUNTRYNAME: "Arab Saudi",
IDS_CHATON_BODY_CANADA_M_COUNTRYNAME: "Kanada",
IDS_CHATON_BODY_BRAZIL_M_COUNTRYNAME: "Brazil",
IDS_CHATON_BODY_MEXICO_M_COUNTRYNAME: "Mexico",
IDS_CHATON_BODY_ARGENTINA_M_COUNTRYNAME: "Argentina",
IDS_CHATON_BODY_CHILE_M_COUNTRYNAME: "Chile",
IDS_CHATON_BODY_PERU_M_COUNTRYNAME: "Peru",
IDS_CHATON_BODY_COLOMBIA_M_COUNTRYNAME: "Colombia",
IDS_COM_POP_TRY_AGAIN: "Cuba lagi.",
IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB: "Ubah peranti",
IDS_YSM_BODY_TEMP_M_TEMPERATURE_ABB: "Suhu",
IDS_MSGF_BODY_REMOTE: "Jauh",
IDS_YSM_OPT_TEMP_DOWN_ABB: "Suhu turun",
IDS_YSM_OPT_TEMP_UP_ABB: "Suhu naik",
IDS_YSM_OPT_TURBO_ABB: "Turbo",
IDS_YSM_OPT_DISPLAY_ABB: "Paparan",
IDS_YSM_OPT_DELIMITER_ABB: "Pembatas",
IDS_YSM_OPT_INTERNET_ABB: "Internet",
IDS_YSM_OPT_PIP: "PiP",
IDS_YSM_OPT_PIP_SWAP_ABB: "Tukar PiP",
IDS_YSM_OPT_PIP_CHANNEL_MINUS_ABB: "Saluran PiP -",
IDS_YSM_OPT_PIP_CHANNEL_PLUS_ABB: "Saluran PiP +",
IDS_YSM_OPT_PIP_MOVE_ABB: "Alih PiP",
IDS_YSM_OPT_DTV: "DTV",
IDS_YSM_OPT_COMPONENT_PD_ABB: "Komponen %d",
IDS_YSM_OPT_USB: "USB",
IDS_YSM_OPT_PICTURE_ABB2: "Gambar",
IDS_YSM_OPT_3D: "3D",
IDS_YSM_OPT_REPLAY_ABB: "Ulang main",
IDS_YSM_OPT_DAY_MINUS: "Hari -",
IDS_YSM_OPT_DAY_PLUS: "Hari +",
IDS_YSM_OPT_RADIO: "Radio",
IDS_YSM_OPT_TV_RADIO_ABB: "TV/radio",
IDS_YSM_OPT_SWING_DOWN_ABB: "Ayunan ke bawah",
IDS_YSM_OPT_SWING_LEFT_ABB: "Ayunan ke kiri",
IDS_YSM_OPT_SWING_RIGHT_ABB: "Ayunan ke kanan",
IDS_YSM_OPT_SWING_UP_ABB: "Ayunan ke atas",
IDS_YSM_OPT_PVR_MENU_ABB: "Menu PVR",
IDS_YSM_OPT_RETURN_TO_LIVE_ABB: "Kembali ke Lgsng",
IDS_YSM_OPT_POWER_OFF_ABB2: "Matikan kuasa",
IDS_YSM_OPT_POWER_ON_ABB: "Hidupkan kuasa",
IDS_CHATON_BODY_JAPAN_M_COUNTRYNAME: "Jepun",
IDS_YSM_BODY_VOL_M_VOLUME_ABB: "Ktg",
IDS_YSM_HEADER_TV_AND_STB_ABB: "TV dan STB",
IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB: "Tidur"};
STMS.setStmsMap( map );
STMS.refreshAllStr();
});