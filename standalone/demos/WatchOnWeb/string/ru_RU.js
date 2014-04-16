WatchOnSandbox( "STMS", function( m ) {
var STMS = m.STMS,
map = {
IDS_ST_BODY_VOLUME_M_SOUND_ABB: "Громкость",
IDS_SR_BODY_AIR_CONDITIONER: "Кондиционер",
IDS_SR_BODY_AUSTRIA_M_COUNTRYNAME: "Австрия",
IDS_SR_BODY_BELGIUM_M_COUNTRYNAME: "Бельгия",
IDS_SR_BODY_CHINA_M_COUNTRYNAME: "Китай",
IDS_SR_BODY_DENMARK_M_COUNTRYNAME: "Дания",
IDS_SR_BODY_FAN_SPEED_DOWN: "Понизить скорость вентилятора",
IDS_SR_BODY_FAN_SPEED_UP: "Повысить скорость вентилятора",
IDS_SR_BODY_FINLAND_M_COUNTRYNAME: "Финляндия",
IDS_SR_BODY_FRANCE_M_COUNTRYNAME: "Франция",
IDS_SR_BODY_GERMANY_M_COUNTRYNAME: "Германия",
IDS_SR_BODY_IRELAND_M_COUNTRYNAME: "Ирландия",
IDS_SR_BODY_ITALY_M_COUNTRYNAME: "Италия",
IDS_SR_BODY_LUXEMBOURG_M_COUNTRYNAME: "Люксембург",
IDS_SR_BODY_MODE: "Режим",
IDS_SR_BODY_NORWAY_M_COUNTRYNAME: "Норвегия",
IDS_SR_BODY_POLAND_M_COUNTRYNAME: "Польша",
IDS_SR_BODY_PORTUGAL_M_COUNTRYNAME: "Португалия",
IDS_SR_BODY_SET_UP: "Настройка",
IDS_SR_BODY_SOUTH_KOREA_M_COUNTRYNAME: "Южная Корея",
IDS_SR_BODY_SPAIN_M_COUNTRYNAME: "Испания",
IDS_SR_BODY_SWEDEN_M_COUNTRYNAME: "Швеция",
IDS_SR_BODY_SWITZERLAND_M_COUNTRYNAME: "Швейцария",
IDS_SR_BODY_UNITED_KINGDOM_M_COUNTRYNAME: "Великобритания",
IDS_SR_BODY_UNITED_STATES_OF_AMERICA_M_COUNTRYNAME: "США",
IDS_SR_BUTTON_BACK: "Назад",
IDS_SR_BUTTON_CANCEL_ABB: "Отмена",
IDS_SR_BUTTON_DELETE: "Удалить",
IDS_SR_BUTTON_DONE: "Готово",
IDS_SR_BUTTON_EXIT: "Выход",
IDS_SR_BUTTON_INFO: "Сведения",
IDS_SR_BUTTON_MENU: "Меню",
IDS_SR_BUTTON_MUTE: "Выкл.звук",
IDS_SR_BUTTON_OK: "ОК",
IDS_SR_BUTTON_POWER: "Питание",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY: "Выберите страну",
IDS_SR_BUTTON_SELECT_YOUR_COUNTRY_REGION: "Выберите страну или регион",
IDS_SR_BUTTON_SHOW_OTHER_BRANDS: "Показать другие марки",
IDS_SR_BUTTON_SOURCE_T_SMART_REMOTE: "Источник",
IDS_SR_BUTTON_TEMP_DOWN_M_TEMPERATURE: "Ниже темп.",
IDS_SR_BUTTON_TEMP_UP_M_TEMPERATURE: "Выше темп.",
IDS_SR_BUTTON_TV: "ТВ",
IDS_SR_BUTTON_YES: "Да",
IDS_SR_HEADER_ALL_BRANDS: "Все марки",
IDS_SR_HEADER_DELETE_ABB: "Удалить",
IDS_SR_HEADER_RESET: "Сброс",
IDS_SR_HEADER_WATCHON_M_APPLICATION: "WatchON",
IDS_SR_OPT_ADD_DEVICE_ABB: "Добавить устройство",
IDS_SR_OPT_STB_ABB: "STB",
IDS_YSM_POP_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Настроить дистанционное управление на устройстве?",
IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB: "Показать все бренды",
IDS_YSM_BUTTON_VOL_UC: "ГРОМКОСТЬ",
IDS_YSM_BUTTON_CH: "КН",
IDS_YSM_BUTTON_NO: "Нет",
IDS_SAPPS_BODY_NOTICE: "Уведомление",
IDS_MSGF_HEADER_OPTION: "Опции",
IDS_MSGF_HEADER_OPTIONS: "Опции",
IDS_SSCHOL_HEADER_COMPLETED: "Завершенные",
IDS_YSM_HEADER_SET_UP_REMOTE_ABB: "Настроить пульт",
IDS_YSM_BODY_SET_UP_THE_REMOTE_CONTROL_ON_YOUR_DEVICE_Q: "Настроить дистанционное управление на устройстве?",
IDS_YSM_BODY_LATIN_COUNTRIES_ABB: "Латинская Америка",
IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON: "Направьте часы на %s и нажмите кнопку питания.",
IDS_YSM_BODY_TAP_THE_BUTTON_ABB: "Нажмите кнопку.",
IDS_YSM_BODY_DID_IT_WORK_Q_ABB: "Получилось?",
IDS_YSM_HEADER_SETUP_COMPLETE_ABB: "Настр. заверш.",
IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE: "Настройка пульта дистанционного управления %s завершена.",
IDS_YSM_BODY_THIS_MODEL_IS_NOT_SUPPORTED: "Эта модель не поддерживается.",
IDS_YSM_BODY_THE_REMOTE_CONTROL_WILL_BE_REMOVED: "Пульт дистанционного управления будет удален.",
IDS_YSM_BODY_FAN_SPEED_ABB: "Скор. вен.",
IDS_YSM_BODY_MODE_ABB2: "Режим",
IDS_YSM_OPT_AV_RECEIVER_ABB2: "AV-ресивер",
IDS_YSM_BODY_BLUE: "Синий",
IDS_YSM_BODY_CHANNEL_DOWN_ABB: "Предыд. канал",
IDS_YSM_BODY_CHANNEL_LIST_ABB: "Список каналов",
IDS_YSM_BODY_CHANNEL_UP_ABB: "След. канал",
IDS_YSM_BODY_DISK_MENU_ABB: "Меню диска",
IDS_YSM_BODY_DOWN: "Вниз",
IDS_YSM_BODY_DVR: "DVR",
IDS_YSM_BODY_EJECT_ABB: "Извлечь",
IDS_YSM_BODY_FAST_FORWARD_ABB: "Перем. вперед",
IDS_YSM_BODY_FAVOURITE_ABB: "Избранное",
IDS_YSM_BODY_FORMAT_HASPECT_ABB: "Формат (соотн.)",
IDS_YSM_BODY_GREEN_ABB: "Зеленый",
IDS_YSM_BODY_HDMI_PD_ABB: "HDMI %d",
IDS_YSM_BODY_INPUT_ABB: "Ввод",
IDS_YSM_BODY_LEFT: "Левая",
IDS_YSM_BODY_LIST: "Список файлов",
IDS_YSM_BODY_OTHER_COUNTRIES_ABB: "Другие страны",
IDS_YSM_BODY_PAUSE: "Пауза",
IDS_YSM_BODY_PLAY: "Играть",
IDS_YSM_BODY_PREVIOUS: "Назад",
IDS_YSM_BODY_PRE_CHANNEL_ABB: "Предуст. канал",
IDS_YSM_BODY_RED: "Красный",
IDS_YSM_BODY_REWIND_ABB: "Перем. назад",
IDS_YSM_BODY_RIGHT_ABB2: "Правый",
IDS_YSM_BODY_SELECT: "Выбрать",
IDS_YSM_BODY_SOUND_MODE_ABB: "Режим звука",
IDS_YSM_BODY_START_SETUP_OF_STB_REMOTE_CONTROL: "Начать настройку пульта дистанционного управления STB.",
IDS_YSM_BODY_STOP: "Остановить",
IDS_YSM_BODY_SUBTITLES_ABB2: "Субтитры",
IDS_YSM_BODY_SUBWOOFER_ABB: "Сабвуфер",
IDS_YSM_BODY_SURROUND_ABB: "Объемный звук",
IDS_YSM_BODY_TITLE_MENU_ABB: "Меню заголовка",
IDS_YSM_BODY_UP: "Вверх",
IDS_YSM_BODY_YELLOW_ABB: "Желтый",
IDS_YSM_BUTTON_CLEAR_HISTORY_ABB: "Очистить журнал",
IDS_YSM_BUTTON_DONE: "Готово",
IDS_YSM_BUTTON_HISTORY: "Журнал",
IDS_YSM_BUTTON_MENU: "Меню",
IDS_YSM_BUTTON_NEXT: "Далее",
IDS_YSM_BUTTON_RETURN_UC: "НАЗАД",
IDS_YSM_BUTTON_SMART_HUB: "Smart Hub",
IDS_YSM_BUTTON_TOOLS_UC: "СЕРВИС",
IDS_YSM_BUTTON_VIDEO: "Видео",
IDS_YSM_BUTTON_VOD: "VOD",
IDS_YSM_HEADER_HELP: "Справка",
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
IDS_YSM_OPT_ENTER: "Ввод",
IDS_YSM_OPT_POWER: "Питание",
IDS_YSM_OPT_RECORD: "Записать",
IDS_YSM_OPT_VOLUME_DOWN: "Уменьшить громкость",
IDS_YSM_OPT_VOLUME_UP: "Увеличить громкость",
IDS_YSM_TAB4_GUIDE: "Программа",
IDS_CHATON_BODY_INDIA_M_COUNTRYNAME: "Индия",
IDS_CHATON_BODY_NETHERLANDS_M_COUNTRYNAME: "Нидерланды",
IDS_WCL_BODY_RUSSIA_M_COUNTRYNAME: "Россия",
IDS_CHATON_BODY_AUSTRALIA_M_COUNTRYNAME: "Австралия",
IDS_CHATON_BODY_SAUDI_ARABIA_M_COUNTRYNAME: "Саудовская Аравия",
IDS_CHATON_BODY_CANADA_M_COUNTRYNAME: "Канада",
IDS_CHATON_BODY_BRAZIL_M_COUNTRYNAME: "Бразилия",
IDS_CHATON_BODY_MEXICO_M_COUNTRYNAME: "Мексика",
IDS_CHATON_BODY_ARGENTINA_M_COUNTRYNAME: "Аргентина",
IDS_CHATON_BODY_CHILE_M_COUNTRYNAME: "Чили",
IDS_CHATON_BODY_PERU_M_COUNTRYNAME: "Перу",
IDS_CHATON_BODY_COLOMBIA_M_COUNTRYNAME: "Колумбия",
IDS_COM_POP_TRY_AGAIN: "Повторите попытку.",
IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB: "Сменить устр.",
IDS_YSM_BODY_TEMP_M_TEMPERATURE_ABB: "Темп.",
IDS_MSGF_BODY_REMOTE: "Удаленный",
IDS_YSM_OPT_TEMP_DOWN_ABB: "Ниже темп.",
IDS_YSM_OPT_TEMP_UP_ABB: "Выше темп.",
IDS_YSM_OPT_TURBO_ABB: "Турбо",
IDS_YSM_OPT_DISPLAY_ABB: "Экран",
IDS_YSM_OPT_DELIMITER_ABB: "Разделитель",
IDS_YSM_OPT_INTERNET_ABB: "Интернет",
IDS_YSM_OPT_PIP: "Картинка в картинке (PiP)",
IDS_YSM_OPT_PIP_SWAP_ABB: "Замена PiP",
IDS_YSM_OPT_PIP_CHANNEL_MINUS_ABB: "Канал PiP -",
IDS_YSM_OPT_PIP_CHANNEL_PLUS_ABB: "Канал PiP +",
IDS_YSM_OPT_PIP_MOVE_ABB: "Перемещение PiP",
IDS_YSM_OPT_DTV: "Цифровое ТВ",
IDS_YSM_OPT_COMPONENT_PD_ABB: "Компонент %d",
IDS_YSM_OPT_USB: "USB",
IDS_YSM_OPT_PICTURE_ABB2: "Изображение",
IDS_YSM_OPT_3D: "3d",
IDS_YSM_OPT_REPLAY_ABB: "Повторить",
IDS_YSM_OPT_DAY_MINUS: "День -",
IDS_YSM_OPT_DAY_PLUS: "День +",
IDS_YSM_OPT_RADIO: "Радио",
IDS_YSM_OPT_TV_RADIO_ABB: "ТВ/радио",
IDS_YSM_OPT_SWING_DOWN_ABB: "Взмах вниз",
IDS_YSM_OPT_SWING_LEFT_ABB: "Взмах влево",
IDS_YSM_OPT_SWING_RIGHT_ABB: "Взмах вправо",
IDS_YSM_OPT_SWING_UP_ABB: "Взмах вверх",
IDS_YSM_OPT_PVR_MENU_ABB: "Меню PVR",
IDS_YSM_OPT_RETURN_TO_LIVE_ABB: "Возвр. к Live TV",
IDS_YSM_OPT_POWER_OFF_ABB2: "Выключить",
IDS_YSM_OPT_POWER_ON_ABB: "Включить",
IDS_CHATON_BODY_JAPAN_M_COUNTRYNAME: "Япония",
IDS_YSM_BODY_VOL_M_VOLUME_ABB: "Гр.",
IDS_YSM_HEADER_TV_AND_STB_ABB: "ТВ и STB",
IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB: "Сон"};
STMS.setStmsMap( map );
STMS.refreshAllStr();
});