var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.view = WR.view || {};
WR.func = WR.func || {};

//var remoteSV = null;

WR.init.remotePage = function( m ) {

	var wr = WR,
		func = wr.func,
		events = wr.events,
		Remocon = m.Remocon,
		RemoconSet = m.RemoconSet,
		sm = m.SceneManager,
		UEI = m.UEI;

	WR.airKeyMap = {
		10: { dId: "IDS_SR_BUTTON_POWER", keyStr: "Power", img:"watch_remote_setup_ic_on.png" },
		11: { dId: "IDS_YSM_OPT_POWER_OFF_ABB2", keyStr: "Power off", img:"watch_remote_setup_ic_on.png" },
		12: { dId: "IDS_YSM_OPT_POWER_ON_ABB", keyStr: "Power on", img:"watch_remote_setup_ic_on.png" },		
		13: { dId: "IDS_YSM_OPT_TEMP_UP", keyStr: "Temp. up", img:"watch_remote_setup_ic_temp_up.png" },
		14: { dId: "IDS_YSM_OPT_TEMP_DOWN", keyStr: "Temp. down", img:"watch_remote_setup_ic_temp_down.png" },
		15: { dId: "IDS_YSM_BODY_FAN_SPEED_ABB", keyStr: "Fan Speed", img:"watch_remote_setup_ic_fan.png" },
		16: { dId: "IDS_YSM_BODY_FAN_SPEED_ABB", keyStr: "Fan Speed", img:"watch_remote_setup_ic_fan.png" },
		29: { dId: "IDS_YSM_OPT_SWING_UP_ABB", keyStr: "Swing UD", img:"watch_remote_setup_ic_swing_ud.png" },
		31: { dId: "IDS_YSM_OPT_SWING_LEFT_ABB", keyStr: "Swing LR", img:"watch_remote_setup_ic_swing_lr.png" },
		33: { dId: "IDS_SR_BODY_MODE", keyStr: "Mode", img:"watch_remote_setup_ic_info.png" },
		34: { dId: "IDS_YSM_OPT_TURBO_ABB", keyStr: "Turbo", img:"watch_remote_setup_ic_turbo.png" },
		55: { dId: "IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB", keyStr: "Sleep", img:"watch_remote_setup_ic_sleep.png" },
	};

	WR.tvKeyMap = {
		0: { dId: "IDS_YSM_OPT_0", keyStr: "0", img:"watch_remote_setup_ic_info.png" },
		1: { dId: "IDS_YSM_OPT_1", keyStr: "1", img:"watch_remote_setup_ic_info.png" },
		2: { dId: "IDS_YSM_OPT_2", keyStr: "2", img:"watch_remote_setup_ic_info.png" },
		3: { dId: "IDS_YSM_OPT_3", keyStr: "3", img:"watch_remote_setup_ic_info.png" },
		4: { dId: "IDS_YSM_OPT_4", keyStr: "4", img:"watch_remote_setup_ic_info.png" },
		5: { dId: "IDS_YSM_OPT_5", keyStr: "5", img:"watch_remote_setup_ic_info.png" },
		6: { dId: "IDS_YSM_OPT_6", keyStr: "6", img:"watch_remote_setup_ic_info.png" },
		7: { dId: "IDS_YSM_OPT_7", keyStr: "7", img:"watch_remote_setup_ic_info.png" },
		8: { dId: "IDS_YSM_OPT_8", keyStr: "8", img:"watch_remote_setup_ic_info.png" },
		9: { dId: "IDS_YSM_OPT_9", keyStr: "9", img:"watch_remote_setup_ic_info.png" },
		10: { dId: "IDS_YSM_OPT_POWER", keyStr: "Power", img:"watch_remote_setup_ic_on.png" },
		11: { dId: "IDS_YSM_OPT_POWER_OFF_ABB2", keyStr: "Power off", img:"watch_remote_setup_ic_on.png" },
		12: { dId: "IDS_YSM_OPT_POWER_ON_ABB", keyStr: "Power on", img:"watch_remote_setup_ic_on.png" },		
		13: { dId: "IDS_YSM_BODY_CHANNEL_UP_ABB", keyStr: "Channel Up", img:"watch_remote_setup_ic_up.png" },
		14: { dId: "IDS_YSM_BODY_CHANNEL_DOWN_ABB", keyStr: "Channel Down", img:"watch_remote_setup_ic_down.png" },
		15: { dId: "IDS_YSM_OPT_VOLUME_UP", keyStr: "Volume Up", img:"watch_remote_setup_ic_plus.png" },
		16: { dId: "IDS_YSM_OPT_VOLUME_DOWN:", keyStr: "Volume Down", img:"watch_remote_setup_ic_minus.png" },
		17: { dId: "IDS_SR_BUTTON_MUTE", keyStr: "Mute", img:"watch_remote_setup_ic_mute.png" },
		18: { dId: "IDS_YSM_BODY_STOP", keyStr: "Stop", img:"watch_remote_setup_ic_stop.png" },
		19: { dId: "IDS_YSM_BODY_PLAY", keyStr: "Play", img:"watch_remote_setup_ic_play.png" },
		20: { dId: "IDS_YSM_BODY_PAUSE", keyStr: "PAUSE", img:"watch_remote_setup_ic_pause.png" },
		21: { dId: "IDS_YSM_OPT_RECORD", keyStr: "Record", img:"watch_remote_setup_ic_rec.png" },
		22: { dId: "IDS_YSM_BODY_FAST_FORWARD_ABB", keyStr: "Fast Forward", img:"watch_remote_setup_ic_ff.png" },
		23: { dId: "IDS_YSM_BODY_REWIND_ABB", keyStr: "Rewind", img:"watch_remote_setup_ic_rewind.png" },
		24: { dId: "IDS_YSM_BODY_SELECT", keyStr: "MENU_SELECT", img:"watch_remote_setup_ic_info.png" },
		25: { dId: "IDS_YSM_BODY_PRE_CHANNEL_ABB", keyStr: "LAST_CHANNEL", img:"watch_remote_setup_ic_info.png" },
		26: { dId: "IDS_YSM_OPT_DISPLAY_ABB", keyStr: "Display", img:"watch_remote_setup_ic_info.png" },
		27: { dId: "IDS_YSM_BUTTON_MENU", keyStr: "Menu", img:"watch_remote_setup_ic_menu.png" },
		28: { dId: "IDS_YSM_BUTTON_CLEAR_HISTORY_ABB", keyStr: "Clear history", img:"watch_remote_setup_ic_info.png" },		
		29: { dId: "IDS_YSM_BODY_UP", keyStr: "CURSOR_UP", img:"watch_remote_setup_ic_top.png" },
		30: { dId: "IDS_YSM_BODY_DOWN", keyStr: "CURSOR_DOWN", img:"watch_remote_setup_ic_bottom.png" },
		31: { dId: "IDS_YSM_BODY_RIGHT_ABB2", keyStr: "CURSOR_RIGHT", img:"watch_remote_setup_ic_right.png" },
		32: { dId: "IDS_YSM_BODY_LEFT", keyStr: "CURSOR_LEFT", img:"watch_remote_setup_ic_left.png" },
		33: { dId: "IDS_YSM_BODY_INPUT_ABB", keyStr: "Input", img:"watch_remote_setup_ic_source.png" },	
		34: { dId: "IDS_YSM_TAB4_GUIDE", keyStr: "GUIDE", img:"watch_remote_setup_ic_info.png" },
		
		36: { dId: "IDS_YSM_BODY_PREVIOUS", keyStr: "Previous", img:"watch_remote_setup_ic_prev.png" },
		37: { dId: "IDS_YSM_BUTTON_NEXT", keyStr: "Next", img:"watch_remote_setup_ic_next.png" },
		38: { dId: "IDS_YSM_BODY_SUBTITLES_ABB2", keyStr: "SUBTITLE", img:"watch_remote_setup_ic_info.png" },		
		39: { dId: "IDS_YSM_BODY_RED", keyStr: "RED", img:"watch_remote_setup_ic_box_a.png" },
		40: { dId: "IDS_YSM_BODY_GREEN_ABB", keyStr: "GREEN", img:"watch_remote_setup_ic_box_b.png" },
		41: { dId: "IDS_YSM_BODY_YELLOW_ABB", keyStr: "YELLOW", img:"watch_remote_setup_ic_box_c.png" },
		42: { dId: "IDS_YSM_BODY_BLUE", keyStr: "BLUE", img:"watch_remote_setup_ic_box_d.png" },
		43: { dId: "IDS_YSM_OPT_DELIMITER_ABB", keyStr: "Delimiter", img:"watch_remote_setup_ic_info.png" },
		44: { dId: "IDS_SR_KEY_TEXT_HOLD", keyStr: "TEXT_HOLD", img:"watch_remote_setup_ic_info.png" },// For TV
		45: { dId: "IDS_YSM_BUTTON_RETURN_UC", keyStr: "Return", img:"watch_remote_setup_ic_back.png" },
		46: { dId: "IDS_YSM_OPT_DTV", keyStr: "DTV", img:"watch_remote_setup_ic_info.png" },//For TV (DTV/ATV)
		47: { dId: "IDS_SR_KEY_TXTMIX", keyStr: "TXT_MIX", img:"watch_remote_setup_ic_info.png" },
		48: { dId: "IDS_YSM_BUTTON_TOOLS_UC", keyStr: "Tools", img:"watch_remote_setup_ic_info.png" },
		49: { dId: "IDS_SR_BUTTON_INFO", keyStr: "Info", img:"watch_remote_setup_ic_info.png" },
		50: { dId: "IDS_SR_BUTTON_EXIT", keyStr: "Exit", img:"watch_remote_setup_ic_exit.png" },
		51: { dId: "IDS_YSM_BODY_FAVOURITE_ABB", keyStr: "Favorie", img:"watch_remote_setup_ic_info.png" },
		52: { dId: "IDS_YSM_BODY_FORMAT_HASPECT_ABB", keyStr: "Aspect(Format)", img:"watch_remote_setup_ic_info.png" },
		53: { dId: "IDS_YSM_OPT_INTERNET_ABB", keyStr: "Internet", img:"watch_remote_setup_ic_info.png" },
		54: { dId: "IDS_YSM_OPT_ENTER", keyStr: "Enter", img:"watch_remote_setup_ic_info.png" },
		
		55: { dId: "IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB", keyStr: "Sleep", img:"watch_remote_setup_ic_sleep.png" },
		56: { dId: "IDS_SR_KEY_TEXT_ON", keyStr: "TEXT_ON", img:"watch_remote_setup_ic_info.png" },//For TV
		57: { dId: "IDS_SR_KEY_TEXT_OFF", keyStr: "TEXT_OFF", img:"watch_remote_setup_ic_info.png" },//For TV
		
		58: { dId: "IDS_YSM_BODY_LIST", keyStr: "List", img:"watch_remote_setup_ic_info.png" },
		
		59: { dId: "IDS_YSM_OPT_PIP", keyStr: "Pip", img:"watch_remote_setup_ic_info.png" },
		60: { dId: "IDS_YSM_OPT_PIP_SWAP_ABB", keyStr: "Pip swap", img:"watch_remote_setup_ic_info.png" },
		61: { dId: "IDS_YSM_OPT_PIP_MOVE_ABB", keyStr: "Pip move", img:"watch_remote_setup_ic_info.png" },
		62: { dId: "IDS_YSM_OPT_PIP_CHANNEL_PLUS_ABB", keyStr: "PIP_CHANNEL_UP", img:"watch_remote_setup_ic_info.png" },
		63: { dId: "IDS_YSM_OPT_PIP_CHANNEL_MINUS_ABB", keyStr: "PIP_CHANNEL_DOWN", img:"watch_remote_setup_ic_info.png" },
		64: { dId: "IDS_YSM_OPT_DTV", keyStr: "TV_DTV", img:"watch_remote_setup_ic_info.png" },//For TV (DTV/ATV)
		65: { dId: "IDS_SR_KEY_SAP", keyStr: "SAP", img:"watch_remote_setup_ic_info.png" },//For TV
		66: { dId: "IDS_YSM_BODY_HDMI_PD_ABB", keyStr: "HDMI1", img:"watch_remote_setup_ic_info.png" },
		67: { dId: "IDS_YSM_BODY_HDMI_PD_ABB", keyStr: "HDMI2", img:"watch_remote_setup_ic_info.png" },
		68: { dId: "IDS_YSM_BODY_HDMI_PD_ABB", keyStr: "HDMI3", img:"watch_remote_setup_ic_info.png" },
		69: { dId: "IDS_YSM_BODY_HDMI_PD_ABB", keyStr: "HDMI4", img:"watch_remote_setup_ic_info.png" },
		70: { dId: "IDS_YSM_BUTTON_VIDEO", keyStr: "Video 1", img:"watch_remote_setup_ic_info.png" },//For TV (Input 1 or Video 1)
		71: { dId: "IDS_YSM_BUTTON_VIDEO", keyStr: "Video 2", img:"watch_remote_setup_ic_info.png" },//For TV (Input 2 or Video 2)
		72: { dId: "IDS_YSM_OPT_COMPONENT_PD_ABB", keyStr: "Component 1", img:"watch_remote_setup_ic_info.png" },
		73: { dId: "IDS_YSM_OPT_COMPONENT_PD_ABB", keyStr: "Component 2", img:"watch_remote_setup_ic_info.png" },
		74: { dId: "IDS_YSM_OPT_USB", keyStr: "USB", img:"watch_remote_setup_ic_info.png" },
		75: { dId: "IDS_YSM_OPT_PICTURE_ABB2", keyStr: "Picture", img:"watch_remote_setup_ic_info.png" },
		76: { dId: "IDS_YSM_OPT_3D", keyStr: "3D", img:"watch_remote_setup_ic_info.png" },		
		77: { dId: "IDS_YSM_BUTTON_SMART_HUB", keyStr: "Smart Hub", img:"watch_remote_setup_ic_info.png" },
		78: { dId: "IDS_YSM_BUTTON_HISTORY", keyStr: "History", img:"watch_remote_setup_ic_info.png" },		
		
		79: { dId: "IDS_YSM_KEY_FUTURE_PICK", keyStr: "Future pick", img:"watch_remote_setup_ic_info.png" }
	};
	
	
	WR.stbKeyMap = {
			0: { dId: "IDS_YSM_OPT_0", keyStr: "0", img:"watch_remote_setup_ic_info.png" },
			1: { dId: "IDS_YSM_OPT_1", keyStr: "1", img:"watch_remote_setup_ic_info.png" },
			2: { dId: "IDS_YSM_OPT_2", keyStr: "2", img:"watch_remote_setup_ic_info.png" },
			3: { dId: "IDS_YSM_OPT_3", keyStr: "3", img:"watch_remote_setup_ic_info.png" },
			4: { dId: "IDS_YSM_OPT_4", keyStr: "4", img:"watch_remote_setup_ic_info.png" },
			5: { dId: "IDS_YSM_OPT_5", keyStr: "5", img:"watch_remote_setup_ic_info.png" },
			6: { dId: "IDS_YSM_OPT_6", keyStr: "6", img:"watch_remote_setup_ic_info.png" },
			7: { dId: "IDS_YSM_OPT_7", keyStr: "7", img:"watch_remote_setup_ic_info.png" },
			8: { dId: "IDS_YSM_OPT_8", keyStr: "8", img:"watch_remote_setup_ic_info.png" },
			9: { dId: "IDS_YSM_OPT_9", keyStr: "9", img:"watch_remote_setup_ic_info.png" },
			10: { dId: "IDS_YSM_OPT_POWER", keyStr: "Power", img:"watch_remote_setup_ic_on.png" },
			11: { dId: "IDS_YSM_OPT_POWER_OFF_ABB2", keyStr: "Power off", img:"watch_remote_setup_ic_on.png" },
			12: { dId: "IDS_YSM_OPT_POWER_ON_ABB", keyStr: "Power on", img:"watch_remote_setup_ic_on.png" },		
			13: { dId: "IDS_YSM_BODY_CHANNEL_UP_ABB", keyStr: "Channel Up", img:"watch_remote_setup_ic_up.png" },
			14: { dId: "IDS_YSM_BODY_CHANNEL_DOWN_ABB", keyStr: "Channel Down", img:"watch_remote_setup_ic_down.png" },
			15: { dId: "IDS_YSM_OPT_VOLUME_UP", keyStr: "Volume Up", img:"watch_remote_setup_ic_plus.png" },
			16: { dId: "IDS_YSM_OPT_VOLUME_DOWN:", keyStr: "Volume Down", img:"watch_remote_setup_ic_minus.png" },
			17: { dId: "IDS_SR_BUTTON_MUTE", keyStr: "Mute", img:"watch_remote_setup_ic_mute.png" },
			18: { dId: "IDS_YSM_BODY_STOP", keyStr: "Stop", img:"watch_remote_setup_ic_stop.png" },
			19: { dId: "IDS_YSM_BODY_PLAY", keyStr: "Play", img:"watch_remote_setup_ic_play.png" },
			20: { dId: "IDS_YSM_BODY_PAUSE", keyStr: "PAUSE", img:"watch_remote_setup_ic_pause.png" },
			21: { dId: "IDS_YSM_OPT_RECORD", keyStr: "Record", img:"watch_remote_setup_ic_rec.png" },
			22: { dId: "IDS_YSM_BODY_FAST_FORWARD_ABB", keyStr: "Fast Forward", img:"watch_remote_setup_ic_ff.png" },
			23: { dId: "IDS_YSM_BODY_REWIND_ABB", keyStr: "Rewind", img:"watch_remote_setup_ic_rewind.png" },
			24: { dId: "IDS_YSM_BODY_SELECT", keyStr: "MENU_SELECT", img:"watch_remote_setup_ic_info.png" },
			25: { dId: "IDS_YSM_BODY_PRE_CHANNEL_ABB", keyStr: "LAST_CHANNEL", img:"watch_remote_setup_ic_info.png" },
			26: { dId: "IDS_YSM_OPT_DISPLAY_ABB", keyStr: "Display", img:"watch_remote_setup_ic_info.png" },
			27: { dId: "IDS_YSM_BUTTON_MENU", keyStr: "Menu", img:"watch_remote_setup_ic_menu.png" },
			28: { dId: "IDS_YSM_BUTTON_CLEAR_HISTORY_ABB", keyStr: "Clear history", img:"watch_remote_setup_ic_info.png" },		
			29: { dId: "IDS_YSM_BODY_UP", keyStr: "CURSOR_UP", img:"watch_remote_setup_ic_top.png" },
			30: { dId: "IDS_YSM_BODY_DOWN", keyStr: "CURSOR_DOWN", img:"watch_remote_setup_ic_bottom.png" },
			31: { dId: "IDS_YSM_BODY_RIGHT_ABB2", keyStr: "CURSOR_RIGHT", img:"watch_remote_setup_ic_right.png" },
			32: { dId: "IDS_YSM_BODY_LEFT", keyStr: "CURSOR_LEFT", img:"watch_remote_setup_ic_left.png" },
			33: { dId: "IDS_YSM_BODY_INPUT_ABB", keyStr: "Input", img:"watch_remote_setup_ic_source.png" },	
			34: { dId: "IDS_YSM_TAB4_GUIDE", keyStr: "GUIDE", img:"watch_remote_setup_ic_info.png" },
			35: { dId: "IDS_YSM_OPT_REPLAY_ABB", keyStr: "Replay", img:"watch_remote_setup_ic_info.png" },
			36: { dId: "IDS_YSM_BODY_PREVIOUS", keyStr: "Previous", img:"watch_remote_setup_ic_prev.png" },
			37: { dId: "IDS_YSM_BUTTON_NEXT", keyStr: "Next", img:"watch_remote_setup_ic_next.png" },
			38: { dId: "IDS_YSM_BODY_SUBTITLES_ABB2", keyStr: "SUBTITLE", img:"watch_remote_setup_ic_info.png" },		
			39: { dId: "IDS_YSM_BODY_RED", keyStr: "RED", img:"watch_remote_setup_ic_box_a.png" },
			40: { dId: "IDS_YSM_BODY_GREEN_ABB", keyStr: "GREEN", img:"watch_remote_setup_ic_box_b.png" },
			41: { dId: "IDS_YSM_BODY_YELLOW_ABB", keyStr: "YELLOW", img:"watch_remote_setup_ic_box_c.png" },
			42: { dId: "IDS_YSM_BODY_BLUE", keyStr: "BLUE", img:"watch_remote_setup_ic_box_d.png" },
			43: { dId: "IDS_YSM_OPT_DELIMITER_ABB", keyStr: "Delimiter", img:"watch_remote_setup_ic_info.png" },

			44: { dId: "IDS_SR_KEY_FUTURE_PICK", keyStr: "Future pick", img:"watch_remote_setup_ic_info.png" },
			45: { dId: "IDS_YSM_BUTTON_RETURN_UC", keyStr: "Return", img:"watch_remote_setup_ic_back.png" },
			46: { dId: "IDS_SR_KEY_FUTURE_PICK", keyStr: "Future pick", img:"watch_remote_setup_ic_info.png" },
			
			47: { dId: "IDS_SR_KEY_TEXT_OFF", keyStr: "TEXT_OFF", img:"watch_remote_setup_ic_info.png" },
			48: { dId: "IDS_YSM_BUTTON_TOOLS_UC", keyStr: "Tools", img:"watch_remote_setup_ic_info.png" },
			49: { dId: "IDS_SR_BUTTON_INFO", keyStr: "Info", img:"watch_remote_setup_ic_info.png" },
			50: { dId: "IDS_SR_BUTTON_EXIT", keyStr: "Exit", img:"watch_remote_setup_ic_exit.png" },
			51: { dId: "IDS_YSM_BODY_FAVOURITE_ABB", keyStr: "Favorie", img:"watch_remote_setup_ic_info.png" },
			52: { dId: "IDS_YSM_BODY_FORMAT_HASPECT_ABB", keyStr: "Aspect(Format)", img:"watch_remote_setup_ic_info.png" },
			53: { dId: "IDS_YSM_OPT_INTERNET_ABB", keyStr: "Internet", img:"watch_remote_setup_ic_info.png" },
			54: { dId: "IDS_YSM_OPT_ENTER", keyStr: "Enter", img:"watch_remote_setup_ic_info.png" },
			
			55: { dId: "IDS_YSM_OPT_SLEEP_M_RESERVATION_ABB", keyStr: "Sleep", img:"watch_remote_setup_ic_sleep.png" },
			56: { dId: "IDS_SR_KEY_TEXT_ON", keyStr: "TEXT_ON", img:"watch_remote_setup_ic_info.png" },
			57: { dId: "IDS_YSM_OPT_RETURN_TO_LIVE_ABB", keyStr: "Return to live", img:"watch_remote_setup_ic_info.png" },
			58: { dId: "IDS_YSM_BODY_LIST", keyStr: "List", img:"watch_remote_setup_ic_info.png" },
			59: { dId: "IDS_YSM_OPT_PVR_MENU_ABB", keyStr: "PVR Menu", img:"watch_remote_setup_ic_info.png" },			
			60: { dId: "IDS_YSM_HEADER_HELP", keyStr: "Help", img:"watch_remote_setup_ic_info.png" },
			61: { dId: "IDS_YSM_OPT_DAY_PLUS", keyStr: "Day +", img:"watch_remote_setup_ic_info.png" },
			62: { dId: "IDS_YSM_OPT_DAY_MINUS", keyStr: "Day -", img:"watch_remote_setup_ic_info.png" },
			63: { dId: "IDS_SR_KEY_TV_VOD", keyStr: "PIP_CHANNEL_DOWN", img:"watch_remote_setup_ic_info.png" },

			64: { dId: "IDS_SR_KEY_FUTURE_PICK", keyStr: "Future pick", img:"watch_remote_setup_ic_info.png" },
			
			65: { dId: "IDS_YSM_OPT_AUDIO", keyStr: "Audio", img:"watch_remote_setup_ic_info.png" },//For TV
			66: { dId: "IDS_YSM_OPT_ON_DEMAND_ABB", keyStr: "On Demand", img:"watch_remote_setup_ic_info.png" },
			67: { dId: "IDS_YSM_BODY_DVR", keyStr: "DVR", img:"watch_remote_setup_ic_info.png" },
			68: { dId: "IDS_YSM_OPT_PIP", keyStr: "PIP", img:"watch_remote_setup_ic_info.png" },
			69: { dId: "IDS_YSM_OPT_PIP_MOVE_ABB", keyStr: "PIP move", img:"watch_remote_setup_ic_info.png" },
			70: { dId: "IDS_YSM_OPT_RADIO:", keyStr: "Radio", img:"watch_remote_setup_ic_info.png" },//For TV (Input 1 or Video 1)
			71: { dId: "IDS_SR_BUTTON_TV:", keyStr: "TV", img:"watch_remote_setup_ic_info.png" },//For TV (Input 2 or Video 2)
			72: { dId: "IDS_YSM_OPT_TV_RADIO_ABB:", keyStr: "TV/Radio", img:"watch_remote_setup_ic_info.png" },
			
			73: { dId: "IDS_SR_KEY_BYPASS", keyStr: "ByPass", img:"watch_remote_setup_ic_info.png" },
			
			74: { dId: "IDS_YSM_OPT_USB", keyStr: "USB", img:"watch_remote_setup_ic_info.png" },
			75: { dId: "IDS_YSM_OPT_PIP_SWAP_ABB", keyStr: "PIP SWAP", img:"watch_remote_setup_ic_info.png" },

			76: { dId: "IDS_SR_KEY_FUTURE_PICK", keyStr: "FUTURE Pick", img:"watch_remote_setup_ic_info.png" },		
			77: { dId: "IDS_SR_KEY_FUTURE_PICK", keyStr: "FUTURE Pick", img:"watch_remote_setup_ic_info.png" },
			78: { dId: "IDS_SR_KEY_FUTURE_PICK", keyStr: "FUTURE Pick", img:"watch_remote_setup_ic_info.png" }		
		};
};

WR.events.remotePage = function( m )
{
	var wr = WR,
		func = wr.func,
		remotePage$ = $( "#remotePage" ),
		sm = m.SceneManager,
		RemoconSet = m.RemoconSet,
		UEI = m.UEI;

	remotePage$[0].beforeComeBack = function()
	{
		remotePage$.removeClass( "openPowerSelector" );
	};
	remotePage$[0].beforeChange = function()
	{
		remotePage$.removeClass( "openPowerSelector" );
	};
	remotePage$[0].afterChange = function()
	{
		setTimeout( function() {
			if( $("#watchon_lib").length < 1 )
			{
				console.log("dynamically load watchon_lib");
				var str = "<object id='watchon_lib' type='application/com-samsung-watchon' style='width: 0; height: 0;'></object>";

				$("body").append( str );
				watchon_lib = $("#watchon_lib")[0];
			}
		}, 30);

		remotePage$[0].afterChange = null;
	};
	remotePage$[0].addEventListener( "pageshow", function() {
		if( WR.sectionChanger ) {

		}
	});

	new MyTap( $("#titleMenuBox")[0], {
			enableHover: true,
			idList: [ "titleMenuBox" ]
		});

	$("#titleMenuBox")[0].addEventListener( "mytap", function( e ) {
		console.log(" weoifjwe ");
		if( e.target.id === "titleMenuBox" )
		{
//			sm.moveTo( "#optionPage", { transition: "slideup" });
			sm.moveTo( "#optionPage" );
		}

	});

	new MyTap( remotePage$[0], {
			idList: [ "tvPowerBtn", "stbPowerBtn", "powerSelBtn", "modeBtn" ],
			parentIdList: [ "left", "center", "right", "chKeypadLeft", "chKeypadRight", "chKeypadCenter" ],
			ignoreHoverList: [ "left", "right", "center" ],
			repeatIdList: [ "volUpBtn","volDownBtn","chUpBtn","chDownBtn" ],
			idToNodeLinkMap: {},
			enableHover: true,
			minPressTime: 300,
			thresholdX: 20,
			thresholdY: 20,
			enableRepeat: true,
			enableHoverDelay: true,
			hoverDelayTime: 50
		});

	var codeSet = "",
		key = "";

	remotePage$[0].addEventListener( "mytap", function( e ) {

		console.log( e.target.id );

		var ele$ = $( e.target ),
			rm = WR.curRemocon,
			id = e.target.id;
		
		if( e.repeat )
		{
			if( !e.repeatStart )
			{
				console.log( "repeat" );
				UEI.sendByCodesetAndKey( codeSet, key );
				return;
			}
			else
			{
				console.log( "repeatStart" );
			}
		}

		if( e.target.id === "powerSelBtn" && rm.getType() ===  "STB" )
		{
			remotePage$.toggleClass( "openPowerSelector" );
		}
		else if( $( e.target ).hasClass( "rBtn" ) || $( e.target ).hasClass( "chBtn" ) )
		{
			// send signal!
			key = ele$.attr( "data-key" );

			if( rm.getType() === "STB" && ( key === "33" || key === "15" || key === "16" || key === "17" ))
			{
				// STB 일때 외부입력, 볼륨, Mute(15,16,17) TV가 먹어.
				codeSet = rm.getSet().getRemoconByType( "TV" ).getCodeSet();
			}
			else if( rm.getType() === "STB" && id === "tvPowerBtn") 
			{
				codeSet = rm.getSet().getRemoconByType( "TV" ).getCodeSet();
			}
			else
			{
				codeSet = rm.getCodeSet();
			}
			UEI.sendByCodesetAndKey( codeSet, key );
		}
	});

};
