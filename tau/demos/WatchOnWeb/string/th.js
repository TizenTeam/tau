WatchOnSandbox( "STMS", function( m ) {
var STMS = m.STMS,
map = {
IDS_ST_BODY_VOLUME_M_SOUND_ABB: "ระดับ​เสียง",
IDS_SR_BODY_AIR_CONDITIONER: "ระบบทำความเย็น",
IDS_SR_BODY_AUSTRIA_M_COUNTRYNAME: "ออสเตรีย",
IDS_SR_BODY_BELGIUM_M_COUNTRYNAME: "เบลเยี่ยม",
IDS_SR_BODY_CHINA_M_COUNTRYNAME: "จีน",
IDS_SR_BODY_DENMARK_M_COUNTRYNAME: "เดนมาร์ก",
IDS_SR_BODY_FAN_SPEED_DOWN: "ลดความเร็วพัดลม",
IDS_SR_BODY_FAN_SPEED_UP: "เพิ่มความเร็วพัดลม",
IDS_SR_BODY_FINLAND_M_COUNTRYNAME: "ฟินแลนด์",
IDS_SR_BODY_FRANCE_M_COUNTRYNAME: "ฝรั่งเศส",
IDS_SR_BODY_GERMANY_M_COUNTRYNAME: "เยอรมัน",
IDS_SR_BODY_IRELAND_M_COUNTRYNAME: "ไอร์แลนด์",
IDS_SR_BODY_ITALY_M_COUNTRYNAME: "อิตาลี",
IDS_SR_BODY_LUXEMBOURG_M_COUNTRYNAME: "ลักเซมเบิร์ก",
IDS_SR_BODY_MODE: "โหมด",
IDS_SR_BODY_NORWAY_M_COUNTRYNAME: "นอร์​เวย์",
IDS_SR_BODY_POLAND_M_COUNTRYNAME: "โปแลนด์",
IDS_SR_BODY_PORTUGAL_M_COUNTRYNAME: "โปรตุเกส",
IDS_SR_BODY_SET_UP: "ตั้งค่า",
IDS_SR_BODY_SOUTH_KOREA_M_COUNTRYNAME: "เกาหลี​ใต้",
IDS_SR_BODY_SPAIN_M_COUNTRYNAME: "สเปน",
IDS_SR_BODY_SWEDEN_M_COUNTRYNAME: "สวีเดน",
IDS_SR_BODY_SWITZERLAND_M_COUNTRYNAME: "สวิตเซอร์แลนด์",
IDS_SR_BODY_UNITED_KINGDOM_M_COUNTRYNAME: "สห​ราช​อาณาจักร",
IDS_SR_BODY_UNITED_STATES_OF_AMERICA_M_COUNTRYNAME: "สหรัฐอเมริกา",
IDS_SR_BUTTON_BACK: "กลับ",
IDS_SR_BUTTON_CANCEL_ABB: "ยกเลิก",
IDS_SR_BUTTON_DELETE: "ลบ",
IDS_SR_BUTTON_DONE: "เรียบร้อย",
IDS_SR_BUTTON_EXIT: "ปิด",
IDS_SR_BUTTON_INFO: "ข้อมูล",
IDS_SR_BUTTON_MENU: "เมนู",
IDS_SR_BUTTON_MUTE: "ปิด​เสียง",
IDS_SR_BUTTON_OK: "ตกลง",
IDS_SR_BUTTON_POWER: "พลังงาน",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY: "เลือกประเทศของคุณ",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY_REGION: "เลือกประเทศ/ภูมิภาคของคุณ",
IDS_SR_BUTTON_SHOW_OTHER_BRANDS: "แสดงแบรนด์อื่นๆ",
IDS_SR_BUTTON_SOURCE_T_SMART_REMOTE: "แหล่งที่มา",
IDS_SR_BUTTON_TEMP_DOWN_M_TEMPERATURE: "ลดอุณหภูมิ",
IDS_SR_BUTTON_TEMP_UP_M_TEMPERATURE: "เพิ่มอุณหภูมิ",
IDS_SR_BUTTON_TV: "ทีวี",
IDS_SR_BUTTON_YES: "ใช่",
IDS_SR_HEADER_ALL_BRANDS: "แบรนด์ทั้งหมด",
IDS_SR_HEADER_DELETE_ABB: "ลบ",
IDS_SR_HEADER_RESET: "รีเซ็ท",
IDS_SR_HEADER_WATCHON_M_APPLICATION: "WatchON",
IDS_SR_OPT_ADD_DEVICE_ABB: "เพิ่มอุปกรณ์",
IDS_SR_OPT_STB_ABB: "STB",
IDS_YSM_POP_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "ตั้งค่ารีโมทคอนโทรลบนอุปกรณ์ของคุณ?",
IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB: "แสดงแบรนด์ทั้งหมด",
IDS_YSM_BUTTON_VOL_UC: "เสียง",
IDS_YSM_BUTTON_CH: "สถานี",
IDS_YSM_BUTTON_NO: "ไม่",
IDS_SAPPS_BODY_NOTICE: "ประกาศ",
IDS_MSGF_HEADER_OPTION: "Option",
IDS_MSGF_HEADER_OPTIONS: "ทางเลือก",
IDS_SSCHOL_HEADER_COMPLETED: "เสร็จแล้ว",
IDS_YSM_HEADER_SET_UP_REMOTE_ABB: "ตั้งค่ารีโมท",
IDS_YSM_BODY_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "ตั้งค่ารีโมทคอนโทรลบนอุปกรณ์ของคุณ?",
IDS_YSM_BODY_LATIN_COUNTRIES_ABB: "ประเทศละติน",
IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON: "หันนาฬิกาของคุณเข้าหา %s และสัมผัสปุ่มเปิดปิด",
IDS_YSM_BODY_TAP_THE_BUTTON_ABB: "สัมผัสปุ่ม",
IDS_YSM_BODY_DID_IT_WORK_Q_ABB: "ทำงานหรือไม่?",
IDS_YSM_HEADER_SETUP_COMPLETE_ABB: "ตั้งค่าเสร็จแล้ว",
IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE: "การตั้งค่ารีโมทคอนโทรล %s เสร็จแล้ว",
IDS_YSM_BODY_THIS_MODEL_IS_NOT_SUPPORTED: "ไม่รองรับรุ่นนี้",
IDS_YSM_BODY_THE_REMOTE_CONTROL_WILL_BE_REMOVED: "รีโมทคอนโทรลจะถูกลบออก",
IDS_YSM_BODY_FAN_SPEED_ABB: "ความเร็วพัด",
IDS_YSM_BODY_MODE_ABB2: "โหมด",
IDS_YSM_OPT_AV_RECEIVER_ABB2: "ตัวรับ AV",
IDS_YSM_BODY_BLUE: "สี​น้ำเงิน",
IDS_YSM_BODY_CHANNEL_DOWN_ABB: "เปลี่ยนช่องลง",
IDS_YSM_BODY_CHANNEL_LIST_ABB: "รายการสถานี",
IDS_YSM_BODY_CHANNEL_UP_ABB: "เปลี่ยนช่องขึ้น",
IDS_YSM_BODY_DISK_MENU_ABB: "เมนูดิสก์",
IDS_YSM_BODY_DOWN: "ลง",
IDS_YSM_BODY_DVR: "DVR",
IDS_YSM_BODY_EJECT_ABB: "ดีดออก",
IDS_YSM_BODY_FAST_FORWARD_ABB: "ไปข้างหน้า",
IDS_YSM_BODY_FAVOURITE_ABB: "รายการที่ชอบ",
IDS_YSM_BODY_FORMAT_HASPECT_ABB: "รูปแบบ (ลักษณะ)",
IDS_YSM_BODY_GREEN_ABB: "สีเขียว",
IDS_YSM_BODY_HDMI_PD_ABB: "HDMI %d",
IDS_YSM_BODY_INPUT_ABB: "การใส่ข้อมูล",
IDS_YSM_BODY_LEFT: "ซ้าย",
IDS_YSM_BODY_LIST: "รายการ",
IDS_YSM_BODY_OTHER_COUNTRIES_ABB: "ประเทศ​อื่น",
IDS_YSM_BODY_PAUSE: "พัก",
IDS_YSM_BODY_PLAY: "แสดง",
IDS_YSM_BODY_PREVIOUS: "ก่อน​หน้า​นี้",
IDS_YSM_BODY_PRE_CHANNEL_ABB: "สถานีล่วงหน้า",
IDS_YSM_BODY_RED: "สี​แดง",
IDS_YSM_BODY_REWIND_ABB: "ย้อนกลับ",
IDS_YSM_BODY_RIGHT_ABB2: "ถูกต้อง",
IDS_YSM_BODY_SELECT: "เลือก",
IDS_YSM_BODY_SOUND_MODE_ABB: "โหมดเสียง",
IDS_YSM_BODY_START_SETUP_OF_STB_REMOTE_CONTROL: "เริ่มตั้งค่ารีโมทคอนโทรลของ STB",
IDS_YSM_BODY_STOP: "หยุด",
IDS_YSM_BODY_SUBTITLES_ABB2: "คำบรรยาย",
IDS_YSM_BODY_SUBWOOFER_ABB: "ซับวูฟเฟอร์",
IDS_YSM_BODY_SURROUND_ABB: "เซอร์ราวด์",
IDS_YSM_BODY_TITLE_MENU_ABB: "เมนูชื่อ",
IDS_YSM_BODY_UP: "บน",
IDS_YSM_BODY_YELLOW_ABB: "เหลือง",
IDS_YSM_BUTTON_CLEAR_HISTORY_ABB: "ลบประวัติ",
IDS_YSM_BUTTON_DONE: "เรียบร้อย",
IDS_YSM_BUTTON_HISTORY: "ประวัติ",
IDS_YSM_BUTTON_MENU: "เมนู",
IDS_YSM_BUTTON_NEXT: "ถัด​ไป",
IDS_YSM_BUTTON_RETURN_UC: "กลับ",
IDS_YSM_BUTTON_SMART_HUB: "Smart Hub",
IDS_YSM_BUTTON_TOOLS_UC: "เครื่องมือ",
IDS_YSM_BUTTON_VIDEO: "วีดีโอ",
IDS_YSM_BUTTON_VOD: "VOD",
IDS_YSM_HEADER_HELP: "วิธี​ใช้",
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
IDS_YSM_OPT_ENTER: "ใส่",
IDS_YSM_OPT_POWER: "พลังงาน",
IDS_YSM_OPT_RECORD: "บันทึก",
IDS_YSM_OPT_VOLUME_DOWN: "ลดระดับเสียง",
IDS_YSM_OPT_VOLUME_UP: "เพิ่มระดับเสียง",
IDS_YSM_TAB4_GUIDE: "คำแนะนำ",
IDS_CHATON_BODY_INDIA_M_COUNTRYNAME: "อินเดีย",
IDS_CHATON_BODY_NETHERLANDS_M_COUNTRYNAME: "เนเธอร์แลนด์",
IDS_WCL_BODY_RUSSIA_M_COUNTRYNAME: "รัสเชีย",
IDS_CHATON_BODY_AUSTRALIA_M_COUNTRYNAME: "ออสเตรเลีย",
IDS_CHATON_BODY_SAUDI_ARABIA_M_COUNTRYNAME: "ซาอุดิอาระเบีย",
IDS_CHATON_BODY_CANADA_M_COUNTRYNAME: "แคนาดา",
IDS_CHATON_BODY_BRAZIL_M_COUNTRYNAME: "บราซิล",
IDS_CHATON_BODY_MEXICO_M_COUNTRYNAME: "เม็กซิโก",
IDS_CHATON_BODY_ARGENTINA_M_COUNTRYNAME: "อาร์เจนตินา",
IDS_CHATON_BODY_CHILE_M_COUNTRYNAME: "ซิลี",
IDS_CHATON_BODY_PERU_M_COUNTRYNAME: "เปรู",
IDS_CHATON_BODY_COLOMBIA_M_COUNTRYNAME: "โคลัมเบีย",
IDS_COM_POP_TRY_AGAIN: "อีก​ครั้ง",
IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB: "เปลี่ยนอุปกรณ์",
IDS_YSM_BODY_TEMP_M_TEMPERATURE_ABB: "อุณหภูมิ",
IDS_MSGF_BODY_REMOTE: "รีโมท",
IDS_YSM_OPT_TEMP_DOWN_ABB: "ลดอุณหภูมิ",
IDS_YSM_OPT_TEMP_UP_ABB: "เพิ่มอุณหภูมิ",
IDS_YSM_OPT_TURBO_ABB: "Turbo",
IDS_YSM_OPT_DISPLAY_ABB: "จอภาพ",
IDS_YSM_OPT_DELIMITER_ABB: "ตัวคั่น",
IDS_YSM_OPT_INTERNET_ABB: "อินเตอร์​เน็ต",
IDS_YSM_OPT_PIP: "PiP",
IDS_YSM_OPT_PIP_SWAP_ABB: "สลับ PiP",
IDS_YSM_OPT_PIP_CHANNEL_MINUS_ABB: "สถานี PiP -",
IDS_YSM_OPT_PIP_CHANNEL_PLUS_ABB: "สถานี PiP +",
IDS_YSM_OPT_PIP_MOVE_ABB: "ย้าย PiP",
IDS_YSM_OPT_DTV: "DTV",
IDS_YSM_OPT_COMPONENT_PD_ABB: "ส่วนประกอบ %d",
IDS_YSM_OPT_USB: "USB",
IDS_YSM_OPT_PICTURE_ABB2: "รูปภาพ",
IDS_YSM_OPT_3D: "3D",
IDS_YSM_OPT_REPLAY_ABB: "เล่นใหม่",
IDS_YSM_OPT_DAY_MINUS: "วัน -",
IDS_YSM_OPT_DAY_PLUS: "วัน +",
IDS_YSM_OPT_RADIO: "วิทยุ",
IDS_YSM_OPT_TV_RADIO_ABB: "ทีวี/วิทยุ",
IDS_YSM_OPT_SWING_DOWN_ABB: "แกว่งลง",
IDS_YSM_OPT_SWING_LEFT_ABB: "แกว่งซ้าย",
IDS_YSM_OPT_SWING_RIGHT_ABB: "แกว่งขวา",
IDS_YSM_OPT_SWING_UP_ABB: "แกว่งขึ้น",
IDS_YSM_OPT_PVR_MENU_ABB: "เมนู PVR",
IDS_YSM_OPT_RETURN_TO_LIVE_ABB: "กลับไปที่ Live",
IDS_YSM_OPT_POWER_OFF_ABB2: "ปิดเครื่อง",
IDS_YSM_OPT_POWER_ON_ABB: "เปิด",
IDS_CHATON_BODY_JAPAN_M_COUNTRYNAME: "ญี่ปุ่น",
IDS_YSM_BODY_VOL_M_VOLUME_ABB: "ส.",
IDS_YSM_HEADER_TV_AND_STB_ABB: "ทีวีและ STB",
IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB: "พัก"};
STMS.setStmsMap( map );
STMS.refreshAllStr();
});