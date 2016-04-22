WatchOnSandbox( "STMS", function( m ) {
var STMS = m.STMS,
map = {
IDS_ST_BODY_VOLUME_M_SOUND_ABB: "Гучність",
IDS_SR_BODY_AIR_CONDITIONER: "Кондиціонер",
IDS_SR_BODY_AUSTRIA_M_COUNTRYNAME: "Австрія",
IDS_SR_BODY_BELGIUM_M_COUNTRYNAME: "Бельгія",
IDS_SR_BODY_CHINA_M_COUNTRYNAME: "Китай",
IDS_SR_BODY_DENMARK_M_COUNTRYNAME: "Данія",
IDS_SR_BODY_FAN_SPEED_DOWN: "Зменшити швидкість вентилятора",
IDS_SR_BODY_FAN_SPEED_UP: "Збільшити швидкість вентилятора",
IDS_SR_BODY_FINLAND_M_COUNTRYNAME: "Фінляндія",
IDS_SR_BODY_FRANCE_M_COUNTRYNAME: "Франція",
IDS_SR_BODY_GERMANY_M_COUNTRYNAME: "Німеччина",
IDS_SR_BODY_IRELAND_M_COUNTRYNAME: "Ірландія",
IDS_SR_BODY_ITALY_M_COUNTRYNAME: "Італія",
IDS_SR_BODY_LUXEMBOURG_M_COUNTRYNAME: "Люксембург",
IDS_SR_BODY_MODE: "Режим",
IDS_SR_BODY_NORWAY_M_COUNTRYNAME: "Норвегія",
IDS_SR_BODY_POLAND_M_COUNTRYNAME: "Польща",
IDS_SR_BODY_PORTUGAL_M_COUNTRYNAME: "Португалія",
IDS_SR_BODY_SET_UP: "Настроїти",
IDS_SR_BODY_SOUTH_KOREA_M_COUNTRYNAME: "Південна Корея",
IDS_SR_BODY_SPAIN_M_COUNTRYNAME: "Іспанія",
IDS_SR_BODY_SWEDEN_M_COUNTRYNAME: "Швеція",
IDS_SR_BODY_SWITZERLAND_M_COUNTRYNAME: "Швейцарія",
IDS_SR_BODY_UNITED_KINGDOM_M_COUNTRYNAME: "Великобританія",
IDS_SR_BODY_UNITED_STATES_OF_AMERICA_M_COUNTRYNAME: "Сполучені Штати Америки",
IDS_SR_BUTTON_BACK: "Назад",
IDS_SR_BUTTON_CANCEL_ABB: "Скасувати",
IDS_SR_BUTTON_DELETE: "Видал.",
IDS_SR_BUTTON_DONE: "Готово",
IDS_SR_BUTTON_EXIT: "Вихід",
IDS_SR_BUTTON_INFO: "Відомос.",
IDS_SR_BUTTON_MENU: "Меню",
IDS_SR_BUTTON_MUTE: "Вимк. звук",
IDS_SR_BUTTON_OK: "OK",
IDS_SR_BUTTON_POWER: "Живлення",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY: "Виберіть країну",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY_REGION: "Виберіть країну або регіон",
IDS_SR_BUTTON_SHOW_OTHER_BRANDS: "Показати інші марки",
IDS_SR_BUTTON_SOURCE_T_SMART_REMOTE: "Джерело",
IDS_SR_BUTTON_TEMP_DOWN_M_TEMPERATURE: "Прохолодн.",
IDS_SR_BUTTON_TEMP_UP_M_TEMPERATURE: "Тепліше",
IDS_SR_BUTTON_TV: "ТБ",
IDS_SR_BUTTON_YES: "Так",
IDS_SR_HEADER_ALL_BRANDS: "Усі марки",
IDS_SR_HEADER_DELETE_ABB: "Видал.",
IDS_SR_HEADER_RESET: "Скинути",
IDS_SR_HEADER_WATCHON_M_APPLICATION: "WatchON",
IDS_SR_OPT_ADD_DEVICE_ABB: "Додати пристрій",
IDS_SR_OPT_STB_ABB: "ТВ-прист.",
IDS_YSM_POP_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Настроїти дистанційне керування на пристрої?",
IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB: "Відобраз. всі торг. марки",
IDS_YSM_BUTTON_VOL_UC: "ГУЧНІСТЬ",
IDS_YSM_BUTTON_CH: "КН.",
IDS_YSM_BUTTON_NO: "Ні",
IDS_SAPPS_BODY_NOTICE: "Сповіщення",
IDS_MSGF_HEADER_OPTION: "Опція",
IDS_MSGF_HEADER_OPTIONS: "Опції",
IDS_SSCHOL_HEADER_COMPLETED: "Завершено",
IDS_YSM_HEADER_SET_UP_REMOTE_ABB: "Настр.дист.кер.",
IDS_YSM_BODY_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Настроїти дистанційне керування на пристрої?",
IDS_YSM_BODY_LATIN_COUNTRIES_ABB: "Країни Латинської Америки",
IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON: "Спрямуйте годинник на %s і натисніть клавішу ввімкнення/вимкнення живлення.",
IDS_YSM_BODY_TAP_THE_BUTTON_ABB: "Натисн. кнопку.",
IDS_YSM_BODY_DID_IT_WORK_Q_ABB: "Це працює?",
IDS_YSM_HEADER_SETUP_COMPLETE_ABB: "Настр. завершено",
IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE: "Настроювання дистанційного керування для %s завершено.",
IDS_YSM_BODY_THIS_MODEL_IS_NOT_SUPPORTED: "Непідтримувана модель.",
IDS_YSM_BODY_THE_REMOTE_CONTROL_WILL_BE_REMOVED: "Дистанційне керування буде видалено.",
IDS_YSM_BODY_FAN_SPEED_ABB: "Шв.вентил.",
IDS_YSM_BODY_MODE_ABB2: "Режим",
IDS_YSM_OPT_AV_RECEIVER_ABB2: "AV-ресівер",
IDS_YSM_BODY_BLUE: "Синій",
IDS_YSM_BODY_CHANNEL_DOWN_ABB: "Поперед. канал",
IDS_YSM_BODY_CHANNEL_LIST_ABB: "Список каналів",
IDS_YSM_BODY_CHANNEL_UP_ABB: "Наступ. канал",
IDS_YSM_BODY_DISK_MENU_ABB: "Меню диска",
IDS_YSM_BODY_DOWN: "Вниз",
IDS_YSM_BODY_DVR: "DVR",
IDS_YSM_BODY_EJECT_ABB: "Вийняти",
IDS_YSM_BODY_FAST_FORWARD_ABB: "Шв.перем.впер.",
IDS_YSM_BODY_FAVOURITE_ABB: "Обране",
IDS_YSM_BODY_FORMAT_HASPECT_ABB: "Формат (стор.)",
IDS_YSM_BODY_GREEN_ABB: "Зелений",
IDS_YSM_BODY_HDMI_PD_ABB: "HDMI %d",
IDS_YSM_BODY_INPUT_ABB: "Вхід",
IDS_YSM_BODY_LEFT: "Ліве",
IDS_YSM_BODY_LIST: "Список",
IDS_YSM_BODY_OTHER_COUNTRIES_ABB: "Інші країни",
IDS_YSM_BODY_PAUSE: "Пауза",
IDS_YSM_BODY_PLAY: "Відтворити",
IDS_YSM_BODY_PREVIOUS: "Назад",
IDS_YSM_BODY_PRE_CHANNEL_ABB: "Поперед. канал",
IDS_YSM_BODY_RED: "Червоний",
IDS_YSM_BODY_REWIND_ABB: "Перемотка",
IDS_YSM_BODY_RIGHT_ABB2: "Вправо",
IDS_YSM_BODY_SELECT: "Вибрати",
IDS_YSM_BODY_SOUND_MODE_ABB: "Режим звуку",
IDS_YSM_BODY_START_SETUP_OF_STB_REMOTE_CONTROL: "Розпочати настроювання дистанційного керування для ТВ-приставки.",
IDS_YSM_BODY_STOP: "Стоп",
IDS_YSM_BODY_SUBTITLES_ABB2: "Субтитри",
IDS_YSM_BODY_SUBWOOFER_ABB: "Низькочас.дин.",
IDS_YSM_BODY_SURROUND_ABB: "Дин.об’ємн.зв.",
IDS_YSM_BODY_TITLE_MENU_ABB: "Меню назв",
IDS_YSM_BODY_UP: "Вгору",
IDS_YSM_BODY_YELLOW_ABB: "Жовтий",
IDS_YSM_BUTTON_CLEAR_HISTORY_ABB: "Очищення історії",
IDS_YSM_BUTTON_DONE: "Готово",
IDS_YSM_BUTTON_HISTORY: "Історія",
IDS_YSM_BUTTON_MENU: "Меню",
IDS_YSM_BUTTON_NEXT: "Далі",
IDS_YSM_BUTTON_RETURN_UC: "ПОВЕРНЕННЯ",
IDS_YSM_BUTTON_SMART_HUB: "Smart Hub",
IDS_YSM_BUTTON_TOOLS_UC: "ІНСТРУМЕНТИ",
IDS_YSM_BUTTON_VIDEO: "Відео",
IDS_YSM_BUTTON_VOD: "VOD",
IDS_YSM_HEADER_HELP: "Довідка",
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
IDS_YSM_OPT_ENTER: "Ввід",
IDS_YSM_OPT_POWER: "Увімкнути",
IDS_YSM_OPT_RECORD: "Записати",
IDS_YSM_OPT_VOLUME_DOWN: "Зменшити гучність",
IDS_YSM_OPT_VOLUME_UP: "Збільшити гучність",
IDS_YSM_TAB4_GUIDE: "Довідка",
IDS_CHATON_BODY_INDIA_M_COUNTRYNAME: "Індія",
IDS_CHATON_BODY_NETHERLANDS_M_COUNTRYNAME: "Нідерланди",
IDS_WCL_BODY_RUSSIA_M_COUNTRYNAME: "Росія",
IDS_CHATON_BODY_AUSTRALIA_M_COUNTRYNAME: "Австралія",
IDS_CHATON_BODY_SAUDI_ARABIA_M_COUNTRYNAME: "Саудівська Аравія",
IDS_CHATON_BODY_CANADA_M_COUNTRYNAME: "Канада",
IDS_CHATON_BODY_BRAZIL_M_COUNTRYNAME: "Бразилія",
IDS_CHATON_BODY_MEXICO_M_COUNTRYNAME: "Мехіко",
IDS_CHATON_BODY_ARGENTINA_M_COUNTRYNAME: "Аргентина",
IDS_CHATON_BODY_CHILE_M_COUNTRYNAME: "Чилі",
IDS_CHATON_BODY_PERU_M_COUNTRYNAME: "Коричневий",
IDS_CHATON_BODY_COLOMBIA_M_COUNTRYNAME: "Колумбія",
IDS_COM_POP_TRY_AGAIN: "Спробуйте ще.",
IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB: "Змін.пристрій",
IDS_YSM_BODY_TEMP_M_TEMPERATURE_ABB: "Темпер.",
IDS_MSGF_BODY_REMOTE: "Віддалений",
IDS_YSM_OPT_TEMP_DOWN_ABB: "Зменш. темпер.",
IDS_YSM_OPT_TEMP_UP_ABB: "Збільш. темпер.",
IDS_YSM_OPT_TURBO_ABB: "Турбо",
IDS_YSM_OPT_DISPLAY_ABB: "Дисплей",
IDS_YSM_OPT_DELIMITER_ABB: "Розділювач",
IDS_YSM_OPT_INTERNET_ABB: "Інтернет",
IDS_YSM_OPT_PIP: "PiP",
IDS_YSM_OPT_PIP_SWAP_ABB: "Переключення PiP",
IDS_YSM_OPT_PIP_CHANNEL_MINUS_ABB: "Канал PiP -",
IDS_YSM_OPT_PIP_CHANNEL_PLUS_ABB: "Канал PiP +",
IDS_YSM_OPT_PIP_MOVE_ABB: "Переміщення PiP",
IDS_YSM_OPT_DTV: "ЦТБ",
IDS_YSM_OPT_COMPONENT_PD_ABB: "Компонент %d",
IDS_YSM_OPT_USB: "USB",
IDS_YSM_OPT_PICTURE_ABB2: "Зображення",
IDS_YSM_OPT_3D: "3D",
IDS_YSM_OPT_REPLAY_ABB: "Повторити",
IDS_YSM_OPT_DAY_MINUS: "День -",
IDS_YSM_OPT_DAY_PLUS: "День +",
IDS_YSM_OPT_RADIO: "Радіо",
IDS_YSM_OPT_TV_RADIO_ABB: "ТБ/радіо",
IDS_YSM_OPT_SWING_DOWN_ABB: "Нахил вниз",
IDS_YSM_OPT_SWING_LEFT_ABB: "Нахил вліво",
IDS_YSM_OPT_SWING_RIGHT_ABB: "Нахил вправо",
IDS_YSM_OPT_SWING_UP_ABB: "Нахил вгору",
IDS_YSM_OPT_PVR_MENU_ABB: "Меню відеомагн.",
IDS_YSM_OPT_RETURN_TO_LIVE_ABB: "Повер.до«Наживо»",
IDS_YSM_OPT_POWER_OFF_ABB2: "Вимкнути",
IDS_YSM_OPT_POWER_ON_ABB: "Увімкнути",
IDS_CHATON_BODY_JAPAN_M_COUNTRYNAME: "Японія",
IDS_YSM_BODY_VOL_M_VOLUME_ABB: "Гуч",
IDS_YSM_HEADER_TV_AND_STB_ABB: "ТВ/ТВ-пр.",
IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB: "Режим сну"};
STMS.setStmsMap( map );
STMS.refreshAllStr();
});