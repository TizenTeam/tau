Name:       web-ui-fw
Version:    0.2.73
Release:    0
Summary:    Tizen Web UI Framework Library
Group:      Development/Other
License:    MIT
BuildArch:  noarch
BuildRequires:  make
BuildRequires:  nodejs
%ifarch %{arm}
BuildRequires:  nodejs-x86-arm
%endif

Source0:    %{name}-%{version}.tar.gz

%description
Tizen Web UI Framework library and theme packages

%prep
%setup -q

%build
make all

%install
make DESTDIR=%{buildroot} install
mkdir -p %{buildroot}/usr/share/license
cp COPYING %{buildroot}/usr/share/license/%{name}

%post

%files
%manifest web-ui-fw.manifest
/usr/share/tizen-web-ui-fw/*/js/*.js
/usr/share/tizen-web-ui-fw/*/js/cultures
/usr/share/tizen-web-ui-fw/latest
/usr/share/tizen-web-ui-fw/VERSION
/usr/share/license/%{name}

###############################
%package -n web-ui-fw-theme-tizen-gray
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-gray
%Description -n web-ui-fw-theme-tizen-gray
    Tizen Web UI Framework Theme : tizen-gray
    Deprecated package, but some binaries still refer this.

###############################
%package -n web-ui-fw-theme-tizen-white
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-white
%Description -n web-ui-fw-theme-tizen-white
    Tizen Web UI Framework Theme : tizen-white
%files -n web-ui-fw-theme-tizen-white
%manifest web-ui-fw-theme-tizen-white.manifest
/usr/share/tizen-web-ui-fw/*/themes/tizen-white
/usr/share/tizen-web-ui-fw/*/themes/tizen-tizen

###############################
%package -n web-ui-fw-theme-tizen-black
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-black
%Description -n web-ui-fw-theme-tizen-black
    Tizen Web UI Framework Theme : tizen-black
%files -n web-ui-fw-theme-tizen-black
%manifest web-ui-fw-theme-tizen-black.manifest
/usr/share/tizen-web-ui-fw/*/themes/tizen-black

###############################
%package -n web-ui-fw-theme-default
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : default
%Description -n web-ui-fw-theme-default
    Tizen Web UI Framework Theme : default
%files -n web-ui-fw-theme-default
%manifest web-ui-fw-theme-default.manifest
/usr/share/tizen-web-ui-fw/*/themes/default

###############################
%package -n web-ui-fw-devel
BuildArch:  noarch
Summary:    Tizen Web UI Framework Developer's files
%Description -n web-ui-fw-devel
    Tizen Web UI Framework Developer's files
%files -n web-ui-fw-devel
/usr/share/tizen-web-ui-fw/bin
/usr/share/tizen-web-ui-fw/template

###############################
%package -n web-ui-fw-demo-tizen-winsets
BuildArch:  noarch
Summary:    Tizen Web UI Framework Demo Application: tizen winset demo
%Description -n web-ui-fw-demo-tizen-winsets
    Tizen Web UI Framework Demo Application: tizen winset demo
%files  -n web-ui-fw-demo-tizen-winsets
/usr/share/tizen-web-ui-fw/demos/tizen-winsets


###############################
%changelog
* Fri Nov 22 2013 Hyeoncheol Choi <hc7.choi@samsung.com> 0.2.73
	- Scrollview : modify to calculated rules in ensureElementIsVisible (P131030-03129)
	- cleanup: delete stupid widget
	- multimediaview: Fix the wrong layout with controlbar disappearing (P131120-02333)

* Fri Nov 15 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.72
	- popupwindow: add exception handling when removed placeholder tag.(P131020-00096)
	- Checkboxradio: event sync ( vmouseevent, ui-btn-down class)
	- Popup: popup ststus value has been fixed
	- Revert "Popup: popup ststus value has been fixed."

* Mon Nov 11 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.71
	- Scrollview : add header height calculation in ensureElementIsVisible(P131107-00742)
	- Popup: popup ststus value has been fixed.
	- Popup: popup bg close event handler is works when popup is opened ( DCMADD-113 )
	- scrollview: hide indicator when bind touchend event
	- datetimepicker: add return false when am/pm button clicked.(N_SE-55784)
	- JQM patch - fix assignment fault

* Fri Nov 08 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.70
	- Revert "datetimepicker: modify vlick event to click (N_SE-56430)"
	- Fix vclick distance patch
	- JQM path: modify vclick move distance threshold and calulation way.(P131106-04132,N_SE-56430)
	- popupwindow : disabled changing popup on screen rotation (N_SE-55951)
	- JIRA fix - N_SE-51838 Cursor focus does not go TO field while inserting text after scroll the window in TizenWinset
	- JIRA fix N_SE-41915 - fix will prevent cursor from hiding when more lines is given
	- slider: modify popup position method for slider-popup

* Wed Oct 30 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.69
	- datetimepicker: modify vlick event to click (N_SE-56430)
	- slider : slider popup do not disappeared issue when called orientationchange fixed(N_SE-56561)

* Tue Oct 29 2013 Hyeoncheol Choi <hc7.choi@samsung.com> 0.2.68
	- Revert "JQM-patch : modify to popup element click event bind, Popup : delete "ui-btn-ctxpopup-close" class click event bind (DCM-2433)"
	- popup : modify css of popup button
	- TokenTextArea : enlarge inner text font size (PLM P131028-03014)
	- DialogueList : add ellipsis to placeholder text(PLM P131028-02021)
	- Scrollview : Scrollview bugs fixed (P131023-00924)

* Fri Oct 25 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.67
	- searchbar: changed small letter to capital one (N_SE-55803)
	- Checkbox: proper checkbox alignment in popup [N_SE-55967]
	- Pinch : skip ratio setting when touch value is not valid (PLM P131021-02072)
	- Segment : fixed segment css issue (N_SE-54943)
	- Popup : add min-width value of ui-btn (P131022-02077)
	- Revert "Loader : change rule that language is set by region setting(N_SE-53277)"

* Tue Oct 22 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.66
	- controlgroup: remove css line cause side-effect (P131021-02618)
	- collapsible: fix collapsible UI (with UX guide)
	- Revert "JQM: orientation change event does not depend on JQM"
	- Listview : add border bottom color on press event (PLM P131010-02793)
	- winset: change background rgb color in black theme (UX guide)

* Fri Oct 18 2013 Hyeoncheol Choi <hc7.choi@samsung.com> 0.2.65
	- listview: remove radius at inset mode (P131016-02897)
	- Checkbox : modify to checkbox and text position css property (P131017-02872)

* Wed Oct 16 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.64
	- TizenWinset : add condition popup appear of textbox popup (N_SE-51783)
	- Globalize: Add AM/PM switcher in hindi language (N_SE-52707)
	- Tabbar : modify font-size css at tabbar segment text(N_SE-52510)
	- winset: fix scrollview-horizontal display issue (N_SE-39497)
	- controlgroup: fixed margins (N_SE-54943)
	- JIRA fix - N_SE-51795 CheckBox works otsude its area since it overlaps with thumbnail
	- slider: change event when slider(handle) released (P131008-04153)
	- checkbox: add ellipsis if label of checkbox is longer than field (N_SE-38978,N_SE-43122)
	- TizenWinset : popup style change that appeared when icon popup click in searchbar(N_SE-55090)

* Fri Oct 11 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.63
	- winset/naviframe: changed small letter to capital (N_SE-53904)
	- searchbar: change small letter to capital (N_SE-53083)
	- splitview: modify the calculation of panes' sizes
	- datetimepicker: trigger default click event after click on AM/PM button (N_SE-53036)
	- Picker : add picker page that has web and native picker widget
	- gallery3d: add inline comments
	- JIRA fix - TDIS-6950 The App "TizenWinset" will be pop-up the error
	- JQM patch : change offset to css in popup when call reposition
	- Tokentextarea: Clear the input field when reenter Tokentextarea demo
	- gallery3d: modify comments
	- scrollview: changing top and bottom position (N_SE_46439)
	- multimediaview: Fix progress bar issue.(P131008-01234)
	- JQM: Popup resize event handler is called until resize is ended
	- Popup : change center_title_1btn's button style(PLM P130918-02212)

* Fri Oct 04 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.62
	- Popup : bug fix (VPSS-1212)
	- JQM: popup resize event handler is called
	- JQM: orientation change event does not depend on JQM
	- Collapsible: add touch event to block multitouch (N_SE-42871)
	- winset: set border of scrollview widget area (N_SE-53042)
	- datetimepicker: Modify demo codes
	- winset: delete 'depth' transition for winset (not in JQM demo, P130930-01704)
	- winset: add page refresh in collapsible (P130809-03286)
	- scrollview: filtering only inputs that have focus in key callbacks
	- popupwindow : add setResizePosition function in popupwindow
	- Loader : change rule that language is set by region setting(N_SE-53277)
	- scrollview : add condition statement to resize event handler(P130914-01206)
	- winsets/list: fix vclick trigger after click on subtext in multiline (N_SE-51825)
	- winset: make  'Get input text popup' scrollable (N_SE-53221)
	- list bubble: changing small letter to capital letter (N_SE-53212)
	- web-ui-fw spec file: update missing version (0.2.61)
	- winset: modify entry field width (N_SE-53312)
	- gallery3d: Fix an issue of canvas height during initialization.
	- multimediaview: Remove volume handle's afterimage when volume button is pressed repeatedly.

* Thu Sep 26 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.61
	- Add license information in spec and modify COPYING
	- JQM-patch : modify to popup element click event bind, Popup : delete "ui-btn-ctxpopup-close" class click event bind (DCM-2433)
	- Cleanup JQM patches

* Thu Sep 26 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.60
	- scrollview: N_SE-51475; typo fix
	- Popup: remove whitespace in popup patch
	- winset: modify change text in ctxpopup widget (N_SE-51878)
	- winset: delete no-name checkboxes (N_SE-49159)

* Fri Sep 13 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.59
	- JIRA fix - N_SE-47442 Item getting disappear when popup appear and keyboard disappear in TizenWinset
	- Popup : remove whitespace in JQM patch
	- Layout : remove padding top/bottom on non-scrollview mode
	- Popup: popup reposition is called immediately

* Thu Sep 12 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.58
	- notification: fix styles of valign text (N_SE-49495)
	- Scrollview : bug fix
	- Popup : modify to set position values of popup when resize window(N_SE-48208)
	- listview: refresh listview after remove item (N_SE-46260,N_SE-49476)
	- Hardwarekey: enableHWKeyHandler property has been added
	- winset: modify list title (P130910-02834)
	- Module Build : modify license and License folder and file.

* Fri Sep 06 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.57
	- pagelayout : fixed triggering blur event after pressing H/W menu key (connected with N_SE-47012)
	- gallery3d: Fix unit-test error
	- tokentextarea: fixed focusIn function (N_SE-48198)
	- DateTimePicker : bug fix(PLM P130902-01540)
	- Pagelayout : bug fix
	- TizenWinset: Extend the input box size ( N_SE-46409 )
	- Tabbar : bug fix(N_SE-42974)
	- Popup: modify popup-button css values
	- SegmentControl : bug fix (PLM P130809-03230)
	- JQM patch : add touchcancel event handler
	- Popupwindow: popupwindow is closed when hardware key button has been clicked
	- winset: modify page title and contents name (N_SE-48217)
	- Pagelayout: block the hwkeyevent when changing page (DCM-2374)
	- winset : modify mp4 file (N_SE-46472)
	- winset: spelling fixes (N_SE-34225)
	- slider: fixed paddings and margins (N_SE-45407)
	- tabbar: hide tabbar dividers after mouseup (N_SE-34126,N_SE-43442,N_SE-42932)

* Thu Aug 29 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.56
	- modify set position of popup-container (P130821-05228)

* Thu Aug 29 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.55
	- popup: modify popup scrollview bg CSS value
	- scrollview: fixed error when element was not specified in positioning API functions
	- scrollview: fixed N_SE-46434, wrong clip top/bottom boundaries
	- gallery3d: Apply non-blocking image loading
	- JIRA fix - N_SE-47115 Abnormal serial wise image showing behavior observe in "Gallery 3D"
	- JIRA fix - N_SE-48393 popup has textbox
	- splitiew: modify text() to outerHTML in GetContents function.
	- JIRA fix - N_SE-48863 Footer more is not displaying for tabbar in TizenWinset
	- tabbar : adding class for popup (N_SE-49194)
	- tabbar: inline documentation
	- gallery3d: Add an error message popup on demo app
	- winset: fix spelling errors (N_SE-49426)

* Fri Aug 23 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.54
	- Scrollview : fix scroll position when windows rotated and get resize event

* Thu Aug 22 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.53
	- button : support Enter button when hostkeyboard on (N_SE-48615)
	- splitview: Fix panes' wrong ratio issue.
	- module: copy CSS themes into the project directory
	- popup : handle tabindex on popup to block unwanted focus by tabkey(N_SE-47126)
	- Scrollview : bug fix
	- JIRA fix - N_SE-47690 control.show was called before video was rendered
	- r.js: fix for windows paths
	- module: fix JQM dependency for full meta module
	- DateTimePicker : exception handle for HW key(N_SE-48311)
	- Pagelayout : bug fix

* Mon Jul 29 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.52
	- toggleswitch : invalidate max-width property in toggle handler (N_SE-42954)
	- Revert "Slider: Prevent calling buttonMarkup for toggle switch"

* Fri Jul 26 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.51
	- Swipelist : bug fix( change css selector. check only swipelist)
	- Scrollview : add custom Overflowscrollbar option
	- Scrollview : calculate excluding padding in innerScrollview(DCM-2223)
	- JIRA fix - n_se-47012 Menu button does not respond after tap on BUTTON
	- Menu popup poisiton problem has been fixed ( when use the timer )
	- swipe: change height of swipe if in swipe is more than one line (N_SE-36032)
	- Scrollview : add scrollbar showed routine when resize (N_SE-46664, N_SE-47206)
	- Revert "Scrollview : add to show scroll bar routine when called resize (N_SE-46664)"
	- button: fix padding left on button with icon on left side (N_SE-39106)
	- button: set max-width on button in list (N_SE-41954)
	- winset: spelling fix in list filter search bar (N_SE-34407)
	- checkbox: Fix wrong code
	- Add meta modules and fix dependencies
	- JQM patch : add touchend event in slider (N_SE-46593)
	- Collapsible: remove activeBtnClass from collapsible heading
	- Scrollview: cancel hiding scrollbar when drag start again
	- tools: automated tests system
	- LoadPrototype: Fix jslint errors
	- Configure: Fix jslint errors
	- Pinch: Fix jslint errors
	- listview : adding text-overflow property (N_SE-44917)
	- Winsets: avoid resizing page
	- Slider: Prevent calling buttonMarkup for toggle switch
	- Winset: modify title and spell issue (N_SE-46197,N_SE-46399,N_SE-46411)
	- tizen-winsets: backbutton-control removed in relation to mandatory hw button
	- JIRA - fix N_SE-46403 removing code from popup message
	- JIRA - fix N_SE-46874 switch buttons according to new documentation
	- Globalize : modify culture value exception condition (N_SE-46759)
	- winset: change wrong number on list (N_SE-35751)
	- Scrollview : add to show scroll bar routine when called resize (N_SE-46664)
	- build: change configuration od custom build system
	- fix included files in devel package

* Mon Jul 15 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.50
	- Revert "list divider: Update the background color of checkboxes on list dividers when pressed"
	- controlgroup: Remove invalid css code
	- fastscroll: Remove features for fade-out
	- Fastscroll: Remove popup text shadow
	- list divider: Update the background color of checkboxes on list dividers when pressed
	- winset: change html of collapsable list to valid HTML5 (N_SE-39338)
	- datetiempicker: trigger default event after click in datetimepicker (N_SE-39513,N_SE-43673)
	- scrollview,virtuallist: fix evaluate of scrollbar's thumb position (N_SE-42045)
	- License: modify license from Dual(MIT,GPL) to MIT
	- theme: Remove invalid css code
	- Tabbar : add border-bottom color to scrolling_tabbar (N_SE-34126,N_SE-43442,N_SE-42932)
	- build system: version 2
	- build: build system for SDK to create minimal version of framework
	- build system: fix dependencies for requirejs
	- Node modules
	- Grunt build

* Fri Jul 12 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.48
	- Checkbox: Fix background for active checkbox in divider
	- Swipe: Make sure current animation is stopped
	- checkbox (with favourite icon): fixed style (bug)
	- Pagelayout : down button position bug fix(N_SE-45112)
	- Tokentextarea: Delete footer and add H/W key event
	- Modify Tabbar-segment footer, popup button css style (N_SE-43789)
	- Winset: modify back button issue and miss spell issue (N_SE-43352)
	- JQM closed popup does not add visible class ( orientation change )

* Wed Jul 10 2013 Heeju Joo <heeju.joo@samsung.com> 0.2.47
	- Scrollview : showOverflowScrollbar when ctxpopup opens
	- Popup : delete popup_bg resource and modify dim_background color&opacity
	- Popup: scrollview line separator has been added
	- checkbox: fix problem with check after click on list with link (N_SE-44086)
	- Winset : modify generate element dynamically sample code
	- loader: Ignore routine setting default theme
	- scrollview: fix focusen on element on window resize (N_SE-41303, N_SE-41364)

* Thu Jul 04 2013 Hyeoncheol Choi <hc7.choi@samsung.com> 0.2.46
	- Naviframe : fix text overflow option of '.ui-title-text-sub'
	- Popup : modify popup-text padding(left,right) and modify radius style
	- searchbar: fix error with wrong value on change event after click clear btn (N_SE-44365,N_SE-44265)
	- Tabbar : modify padding and margin value of footer tabbar buttons
	- Tokentextarea: Fix the anchor button position
	- multidmediaview: Fix a press event issue on a button
	- Toolbar: Change the divider style of footer buttons
	- Winsets: Remove footer (N_SE-43651)
	- Winsets: Restore footer in footer more example
	- Winsets: Popup opened with menu button should have proper class
	- fastscroll: Fix the left border width to 1 pixel
	- Remove unbind code in popup widget (DCM-1984)
	- JQM patch : Improve toggleswitch ux.
	- checkboxRadio : change resource sync to GUI Guide v4.8
	- Naviframe: modify radius and padding value of header button
	- Delete unnecessary image files
	- Pagelayout: use jQuery to get window height

* Mon Jul 01 2013 Hyeoncheol Choi <hc7.choi@samsung.com> 0.2.45
	- JQM patch : add loadPage no options exception hadling.
	- Scrollview : change scrollbar calculation routine
	- Pagelayout : recalculate page's min-height on resize event

* Sat Jun 29 2013 Hyeoncheol Choi <hc7.choi@samsung.com> 0.2.44
	- Slider: modify slider-container padding(top, bottom)
	- Button : modify button size and added margin.
	- datetimepicker: Fix layout issue.
	- fastscroll: Apply divider styles to items
	- winset: clear text field in popup before close (N_SE-43451)
	- gallery3d: Fix wrong operations of API
	- datetimepicker: Apply light theme & dark theme
	- scrollview: Add pressed icon images of the jump-to-scroll button
	- winset: checkbox page, changing field with value after click on checkbox (N_SE-43429)
	- winset: correct name of page (N_SE-43471)
	- Scrollview : Remove click event in touch state(DCM-1690,DCM-2067).
	- Pagelayout : Invalidate to add ui-ctxpopup-optionalmenu(DCM-2073).
	- pagelayout: fix width of h1 in header (N_SE-43307,N_SE-42973,N_SE-43556)
	- splitview: Fix the handler dragging bug caused by multitouches
	- Tokentextarea: Fix the anchor button position
	- progress: Fix the end position of the stripe animation
	- Scrollview : hide overflowIndicator if not jQM content
	- JQM : remove scrollTo in jquery.mobile.init.js
	- multimediaview: Improve usability of volume bar
	- datetimepicker: Fix resize event issue
	- Searchbar: modify clearbtn appear concept
	- JQM patch : invalidate 0021,0045 patch and change toggleswitch ux
	- fastscroll: Modify the popup position to the center
	- H/W key : add H/W key event and bug fix.
	- Winsets: Replace double Cancel buttons
	- Winsets: Fix id of page for h/w event binding

* Tue Jun 25 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.43
	- Pagelayout : Add condition check backBtnQueue length (N_SE-42987).
	- tizen-winsets: fix HW key event binding
	- pagelayout: Apply HW key policy
	- Naviframe : change footer theme generate routine
	- TizenWinset: List vi button position has been changed
	- Tabbar-Persist : modify <a href> url
	- Fast scroll: modify 'Fast scroll' title (N_SE-42900)
	- gallery : modify image size set roution in gallery.(N_SE-36862)

* Mon Jun 24 2013 Hyeoncheol Choi <hc7.choi@samsung.com> 0.2.42
	- H/W key : delete footer and add H/W key event
	- HWkey : remove framework's device check routine
	- ctxpopup : popup scrollbar tuning(DCM-1971)
	- Scrollview : modify condition that disappear scrollview

* Sun Jun 23 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.41
	- pagelayout: not showing back button on keyboard hide (N_SE-41675)
	- scrollview: N_SE-35649 multitouch scroll bug
	- progress: update margin values
	- toolbar: Apply light theme

* Sun Jun 23 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.40
	- Progress : change white progress resource
	- Popup : change liststyle height to max-height
	- Scrollview : change indicatorbar value from opacity to display
	- DateTimepicker : change theme color
	- GUI : change resource/permission change
	- Extendable list : modify 'Load 50 more items' button position
	- Fastscroll: modify rollover-border color (black, white)
	- checkbox: modify favorite icon image (white theme)
	- ContextPopup: modify rgb color of ctxpopup background (black theme)
	- Checkbox : modify checkbox press image in black theme

* Fri Jun 21 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.39
	- List : DarkTheme background color change

* Fri Jun 21 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.38
	- slider: Apply light theme
	- WhiteGUI : add resource
	- toolbar: Apply dark theme
	- progress: Rollback the background gradient of progress pending bar
	- slider: Apply light theme
	- extendablelist: trigger updatelayout after create/refresh (N_SE-41287)
	- Naviframe : apply white theme
	- List : Apply white Theme (light theme in UX guide)
	- Loader : rollback theme selection code(apply white theme)
	- tabbar, controlgroup: Check the existence of buttons in footer
	- search : Apply light theme
	- radio btn: Apply light theme
	- splitview: Apply dark theme
	- bubble: Apply light theme
	- Entry : Apply white theme (editfield color)
	- button: Apply light theme for on/off button
	- multimediaview: Apply light theme
	- scrollview: Modify the scrollbar color and change the jump icon image
	- handler: Apply light theme
	- list divider: Apply light theme
	- progressbar: Apply light theme
	- Fastscroll: Border color has been changed
	- Ticker-noti : modify rgb color for thicker notification (light theme)
	- List : modify css for extandable and vi list (light theme)
	- Popup: Apply White Theme (UX Guide)
	- tokentextarea: Apply light theme
	- Title Uppercase : Title uppercase change to lowercase
	- winset: spelling fixes (N_SE-34225)
	- Slider : modify popup of slider z-index (fixed DCM-1735)
	- WhiteGUI : add no masking resources to white theme
	- Button: Apply white theme ( light theme )
	- Resource : delete unnecessary png files
	- Resource : delete white resource, change black resource permission

* Sun Jun 16 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.37
	- ThemeBugFix : add splitview resource, change datetimepicker top position
	- List : modify dialogue(and collapsible)list background
	- Popup : modify center-checkbox background css style
	- searchbar: Apply dark theme
	- BubbleList : add theme
	- Fastscroll: Applied new ux (ver 0.5) color code
	- Notification : change theme
	- Editfield : Apply dark theme
	- radio btn: Apply dark theme
	- tokentextarea: Apply dark theme
	- progressbar: Apply dark theme
	- multimediaview: Apply dark theme
	- handler: Apply dark theme
	- button: Apply dark theme for on/off button
	- list divider: Apply dark theme
	- ctxpopup: Apply dark theme
	- slider: Apply dark theme
	- virtualgrid: Apply dark theme
	- scrollview: Apply dark theme
	- Naviframe/Tabbar : add divider to navifame, Tabbar gets press color
	- Naviframe : add divider to btn
	- Popup: modify radius of popup title and button background
	- TizenWinset : add footer check routine(hide in case footer does not have another button)
	- Popup: change css styles for dark theme (UX guide)
	- BlackTheme : LandscapeSupport(Naviframe, Tabbar)
	- Button: distinguish button and other widgets
	- List: add variables in style.less for both Dark and White theme
	- Loader : default theme changed(white GUI is not released yet)
	- Button: supports button inner shadow in white theme
	- Pagelayout: other popups will be closed when clicked the more button
	- Button: Change css style for dark theme
	- Darktheme : naviframe, tabbar theme change
	- List: Change css style for Dark Theme (UX guide)
	- Button : change image resource
	- DarkTheme: 2nd draft
	- DarkTheme : 1st draft

* Fri Jun 14 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.36
	- slider: turn off listener on mouse event when popup is hiden (N_SE-41320)
	- datetimepicker, ctxpopup: FIX errors with position of ctxpopup in datetimepicker
	- textarea: change white-space css property (N_SE-40269) (N_SE-40347)
	- JIRA - FIX N_SE-34055 Resolving problem with the pinch event trigered on the image after orientation change
	- Gallery: Unbind widget's events properly
	- slider: fix problem with values sterted from 0 (N_SE-34929)
	- Collapsible: remove ui-btn-active class when collapse or expand event is cancelled
	- tabbar: add ellipsis in tabbar items (N_SE-38572)
	- theme: fix error with display multiline header (N_SE-33971)
	- JIRA fix - Temporary rotaton is blocked as TIZEN API is missing a flag, which can help to check if the orientation is locked or unlocked
	- RadioDemo : change to select only controlgroup area(N_SE-38023)
	- PageLayout : set headerArea in pagebefore(N_SE-36612)
	- changelog: Fix date format
	- tabbar: adjust margin-top of title icon img

* Sat Jun 08 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.35
	- contextpopup: Change option menu class name
	- pagelayout: more popup style is applied even deviceAPI is not supported

* Sat Jun 08 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.34
	- HWKey support on pagelayout, ctxpopup and loader
	- multimediaview: Replace contents of demo
	- demo: add min and max attributes on the number input entry
	- Scrollview: Improve scroll performance
	- scrollview: wrong scroll position after textarea autogrow (N_SE-35696,N_SE-35800)
	- fastscroll: Fix a position issue by auto scrolling.
	- fastscroll: fix an issue of a popup position.

* Sun Jun 01 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.33
	- Loader: fix version and path
	- Checkbox : Fix incorrect image when favorite checkbox button down
	- Controlgroup : Fix incorrect background color in horizontal controlgroup

* Thu May 31 2013 Hyeoncheol Choi <hc7.choi@samsung.com> 0.2.32
	- fastscroll: add a routine for finding a substitution divider
	- virtualgrid: fix layout issue
	- slider: add conditional statement for dynamic value change of popup-slider
	- splitview: fix an issue occured when a resize event is triggered.
	- Scrollview : Fix horizontal scrollview incorrectly occur when rotate landscape
	- Template : change WRT install spec(remove useless spec)
	- Scrollview : change gradiation indicatorbar to png image
	- splitview: fix layout issue when pane maximized
	- Check divider : modify checkbox style that used list with check divider.

* Thu May 23 2013 Hyunjung kim <hyunjung.kim@samsung.com> 0.2.31
	- Scrollview : fix misspell api name(startMscroll)

* Thu May 23 2013 heeju.joo <heeju.joo@samsung.com> 0.2.30
	- scrollview: inline documentation
	- Rulechecker: wrap with comment excludeStart ... excludeEnd automatically
	- JQM: Remove global variables
	- Popup : remove duplicated popup style
	- Scrollview: Fix comparison syntax correctly
	- Naviframe : N_SE-38077 issue fix.
	- Controlgroup : add controlgroup widget.
	- Bubble List: less file for bubble date has been modified
	- Popup: Close JQM popup when page navigation event fired
	- Tabbar-Persist: a href url has been modified.
	- Splitview: Fix lint error
	- ScrollView : Fixed indicator display error occured (N_SE-36738)
	- Gallery: set 'DELETE' button enable exception when any images do not exist
	- Slider: add orientationchange handler
	- Tabbar footer : Long 1 line text modify 2 line text. (N_SE-36476)
	- splitview: fix unit test error

* Fri May 10 2013 Hyunjung Kim <hjnim.kim@samsung.com> 0.2.29
	- loader: change a warn msg to debug msg
	- Radio: Radio issue has been fixed ( N_SE-38015 )
	- Add gallery3D source to the flora license list
	- Slider: JQM patch fixed ( event.target match )
	- Tizen-winset: remove unnecessary file

* Tue May 07 2013 Hyunjung kim <hjnim.kim@samsung.com> 0.2.28
	- Orientation : add landscape UX
	- ToggleSwitch : divide jQM and Tizen slider on dragging outside of toggle area ( N_SE-37574 )
	- Slider: Popup slider issue has been fixed ( N_SE-36430 )

* Fri May 03 2013 Hyunjung kim <hjnim.kim@samsung.com> 0.2.27
	- Splitview: Fix popup error
	- Tests: Add slider tests checking if jqm slider is used for select elements
	- Adjust the latest GUI
	- Handler: Adjust the latest GUI
	- Swipe: Adjust the latest GUI
	- Fastscroll: Adjust the latest GUI
	- ToggleSwitch : bug fix
	- TizenWinset : bug fix(N_SE-36666)
	- Gallery3d: Fix Gallery3d TC failure
	- UnitTC: fix virtualgrid test error
	- Popup: popup background image have been added
	- Tokentextarea: Use jQM popup instead of window.alert().
	- Splitview: Use jQM popup instead of window.alert().
	- Splitview: Change an option name to start with a capital letter
	- License: Change flora license version
	- Tabbar: Adjust the latest GUI
	- Tokentextarea: Change from 'px' to 'em.'
	- Fastscroll: Add 'orientationchange' event handler.
	- Gallery3d: Fix null reference error

* Fri Apr 26 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.26
	- PageLayout : bug fix
	- Gallery3d: Change timing of 'gl-matrix' library's execution
	- Replace in LoadTheme function strings build with array join with the string concat
	- Contextpopup: context popup reposition module has been added
	- Pagelayout : skip to calculate min-height using data-scroll="none"(Issue: DCM-1453)
	- Splitview: Fix the touchend event error.
	- Gallery3d: Change event registration method from $.bind() to $.on()
	- Scrollview : remove useless setTimeout in case scrolls go outside
	- Naviframe : adjust new SIP down button
	- Timepicker: Added return false; after vclick
	- Popupwindow: reserved words has been removed
	- minor changes: replace one occurrence of array.join with string concat and simplify jQuery arguments
	- TizenWinset : set default margin for checkbox demo
	- Tizenwinset: Context popup demo has been changed
	- TizenDemo : add initial orientation mode to popup demo
	- Widgets: removed parsing error for legacy javascript engine
	- Delegate init of popup widget with delegateSelfInitWithSingleSelector

* Tue Apr 18 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.25
	- Pinch: pinch event re-implementation to use size
	- Pagelayout : prevent code inserting window.innerHeight when content calculate
	- BlachTheme : add missing icon (SIP down)
	- Scrollview : support absolute position
	- tizen-winsets: change the font-family in virtualgrid demo to default
	- TizenWinset : Change default font
	- tizen-winsets: Change image link
	- tizenwinset: change images for virtual grid pages

* Tue Apr 16 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.24
	- SegmentControl: 2-buttons display issue (N_SE-34200)
	- Naviframe : remove unnecessary img positioning(N_SE-33969)
	- Gallery: jslint error fix
	- TizenWinset : remove landscape SIP on mode
	- Tizen Black Theme png file changed
	- Gallery: Images showing bug has been fixed
	- Scrollview : change horizontal scrollview demo(N_SE-33997)
	- Tizenwinset: added return false in popup sample
	- Naviframe : support data-role="button" in header
	- Additional UnitTC: tizen winset unit tc bugs have been fixed
	- Checkbox : remove favorite button's display:block(N_SE-33896)
	- UnitTC: QUnit path has been changed. Priority, function type check function has been added
	- Tizen-winset : Footer changed from lower case to upper case.
	- Slider: enhance performance fix
	- UnitTC: Addtional unit tc ref path has been fixed
	- virtualgrid: apply overscrolling images to the style of widget
	- Tabbar : Change overscroll image(left/right)
	- ensurens: optimizations
	- ensurens: qunit tests
	- Tokentextarea: Fix block size error
	- Fastscroll: Add a feature to fade out Fastscroll widget.
	- Fastscroll: Add a user interaction at the omitted items.
	- ImageLoader: Performance fix: apply lazy loading for canvas element
	- Tests: Add tests for $.imageloader
	- SegmentControl: 2-buttons display issue (N_SE-34200)
	- virtuallist: fix width resizing trigger
	- Timepicker: timepicker is closed when orientationchange event fired
	- TizenWinset : Tabbar-persist issue.(N_SE-33996)
	- Add Flora license
	- collapsible: Fix collapsible list animation bug

* Wed Apr 10 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.23
	- Naviframe : modify SIP down button's position
	- Core: Performance fix for disableSelection and enableSelection
	- Tests: Core tests for disableSelection
	- patch: fix small mistakes on the patches
	- virtuallist: Change demo button style
	- Button: btn-icon only css has been changed
	- loader: Fix screen-width option processing
	- pagelayout: Remember back key when it is hidden
	- Tizen Black Theme : Tizen black theme png file changed.
	- UnitTC: tizen winset unit tc bugs have been fixed
	- TizenWinset: Swipe list sample has been fixed
	- Radio : remove default radio's width(N_SE-33579)
	- Scrollview : divide x/y overflow attribute
	- Gallery: orientation image showing issue has been fixed
	- Gallery: remove method bug has been fixed
	- virtualgrid : fix unit-test error and increase test items
	- Gallery3d: Modify demo & source codes for visibility enhancement.
	- Gallery3d: Reduce loading time of widget
	- Gallery3d: Change files' format to unix
	- Contextpopup: context popup close when window resize event fire
	- Popup: reverse orientation bug has been fixed
	- Tokentextarea: modify description
	- Multimediaview: modify description
	- JQM: Do not add ui-btn-icon-only class at the select button
	- build: tizen-black theme package
	- Tizenwinset: popup script has been removed
	- Tizenwinset: substring split view text message
	- Timepicker: data-changed event will be deprecated

* Fri Apr 5 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.22
	- tizen-winsets: Fix demo menu
	- Tizenwinset: Reorder tizenwinset menu
	- SearchBar: Header button size issue has been fixed
	- Swipe: list item overflow: hidden has been added
	- Tizenwinset: href has been added in grouped list
	- Tizenwinset: Page transition page has been added
	- Tizenwinset: Radio description has been fixed
	- This patch fixes problem when base url is changed when site is prefetched.
	- Entry : limit textarea's width (N_SE-28653)
	- Naviframe : hide backbutton in case SIP up(remove backbutton makes problem in binding event)
	- Gallery : next, prev images position bug has been fixed
	- Multimediaview: Fix display error while handling orientationchange event.
	- Pagelayout : modify innerHeight dpr calculation in non scrollview mode
	- Datetimepicker: picker position has been fixed when browser resize event fired
	- Tips: generate elements sample page javascript has been fixed
	- Tokentextarea: Fix Tizen-winsets demo.

* Wed Apr 3 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.21
	- VirtualGrid: Fix errors on centerTo and resize methods
	- loader: Fix default font size at device-width viewport
	- scrollview : remove overflow-x property
	- Naviframe : fix backbutton position/ change down button icon
	- Naviframe : bug fix
	- Tizenwinset : Tizen-winset demo page titles changed Tizen-winset demo page titles changed from lower case to upper case.

* Fri Mar 29 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.20
	- JQM Navigation : remove page min-height
	- Pagelayout : add refresh to pagelayout
	- Tokentextarea: Changes 'remove' tests to asyncTest
	- Popup: input tag alignment has been fixed
	- Tokentextarea: add/remove events are deprecated.
	- Contextpopup: Support horizontal list
	- Select: icon z-index has been deleted
	- Tizenwinset: ui widget order has been changed
	- Tool: make web app template disable context menu by default
	- Tizen-winset: change tips for using listview
	- Loader: calculate font size with mobile width
	- Naviframe : fix header's back button position
	- TizenWinset : move locale info to another file

* Fri Mar 22 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.19
	- Tizen-winset: Support accessibility for tizen-winset
	- Orientation : add orientataionchange to tizen-winset
	- Tokentextarea: Adjusts VI effect for add/remove block
	- splitview: Support accessibility for splitview
	- Tizen-winset: Date/time picker guide text has been fixed
	- Popup: context popup arrow position, setTimeout open method bug have been fixed
	- fastscroll: Add new indexString API to Fastscroll widget.
	- splitview: Add new widget
	- gallery3d: Add new widget
	- Scrollview : disable VI effect for gesture event
	- Scrollview : disable SIP outerscroll
	- Tizen-winset: resize VirtualGrid widget in demo
	- Tizen-winsets: Refactor searchbar subpages
	- Tizen-winsets: Remove depracated usage of virtuallist
	- Tizen-winsets: Move js code from main.js to subpages
	- Tizen-winsets: Refactor virtual grid demo subpages
	- Tizen-winsets: Move css files from index to proper subpages
	- Tizen-winsets: Refactor list dialogue edit subpage
	- Tizen-winsets: Refactor pagelayout subpages
	- Tizen-winsets: Refactor tips subpages
	- Tizen-winsets: Move subpages popup files from index.html
	- Tizen-winsets: Move subpages javascript files from index.html
	- virtualgrid: fix improperly merged codes
	- ColorTheme : remove unused color value(1st)
	- Scrollview : change scrollbar draw
	- Popup: Apply popup background dim
	- Tizen-winsets: Move tokentextarea demo to external page.
	- Tizen-winsets: Move tabbar persist demo to external page.
	- Tizen-winsets: Remove notImplemented page
	- Tizen-winsets: Move slider demo page to external subpage
	- Tizen-winsets: Fix ids, remove duplicated names for sliders
	- Tizen-winsets: Remove event for changing theme
	- tool: Fix wgt sample app generator tool to make apps be installed
	- demos : change live to on
	- build: Trim compiled CSS files
	- Gallery: CSS left -> translate or translate3D
	- Tokentextarea: Disfunctional APIs fixed.

* Thu Mar 7 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.18
	- build: Fix Makefile to add globalize to the minified lib
	- build-tools : upgrade less to v1.3.3
	- demos : change normal js path to minified js
	- Theme : remove reduantant less - dayselector, optionheader, nocontents
	- multimediaview : fix full-screen mode.
	- multimediaview : fix 'width', 'height' and 'fullScreen' methods
	- Extendablelist: Added min-height "load more button" in listitem
	- virtualgrid: adjusts VI effect for an overflow action
	- ControlGroup : change ellipsis font color (press/normal)
	- multimediaview: Add an error message to Multimediaview
	- virtualgrid: adjusts triple flick gesture
	- scrollview: add function for getting width of view
	- scrollview: adds support x axis gesture scroll
	- multimediaview : fix audio control
	- tabbar : tabbar slide animation change
	- TizenWinsetDemo : 2line-text demo bug fix
	- collapsible: Fix demo to show radio button correctly in the collapsible list
	- collapsible: Set listitem position to relative
	- UnitTC: added list divider unit test
	- Style: unnecessary color codes have been deleted and modified
	- build: Module build implementation
	- UnitTC: Additional unit testcases have been added
	- listview : bug fix
	- Naviframe : remove back button's hover effect
	- TizenDemo : remove back button
	- Transition: added more-button vi
	- pinch: added new event called pinch
	- Popup: css word-wrap:break-word has been added
	- virtualgrid: memory leak fix
	- progress: set to init state at pending bar
	- progress: add margin of top/bottom
	- unit-test: split progress test and progressbar test
	- Tizen-winset: Context popup sample page guide text has been changed
	- multimediaview: fix the height of widget when full-screen mode
	- JQM: performance tuning

* Tue Feb 19 2013 Minkyu Kang <mk7.kang@samsung.com> 0.2.17
	- DialogueList : delete border top value / add sample's text ellipsis
	- Tokentextarea: Add scroll-to-top for Grouping On/Off regarding #N_SE-24877
	- Multimediaview: Fix mute function
	- Tizen-winset: list vi index guide textbox has been removed
	- Tizen-winset: custom button texts have been changed
	- slider: move popup div to out of content
	- TizenWinset: disable context popup in multimediaview
	- Swipe: wrong style name has been fixed
	- demo: add the sample at dialogue list
	- listview: Add ui-li-has-right-btn class with toggleswitch
	- WinsetDemo : change wrong title name

* Mon Jan 28 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.16
	- demo: checkbox: reduce button's width
	- tabbar : delete right/left tab animation color
	- scrollview: fix the scroll position at keydown event
	- groupControl : change footer groupControl from min-width to percentage
	- scrollview: get height of softkeyboard correctly
	- tizen-winset: Add name attr to all radio inputs
	- virtualgrid: changes event binding target
	- scrollview: skip the drag if target is textarea
	- scrollview: skip the dragging of parent scrollview
	- scrollview: apply the scaling ratio to the soft keyboard
	- demos: apply disabled option in textarea
	- demo: remove unused codes
	- demo: datetimepicker: show selected date correctly
	- listview: Adjust bubble listitem width and margin
	- pagelayout : change external refresh call and ime status follow only current page
	- toggleSwitch : bug fix
	- unit-test: slider: fix the move test
	- handler: fix jslint error
	- ToggleSwitch : set image toggleswitch background attribute

* Mon Jan 28 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.15
	- slider: increase the text width(N_SE-23397)
	- virtualgrid: DOM element leak fix
	- header: Move button top higher in header with tabbar(N_SE-22253)
	- datatimepicker: don't open the popup before popupafterclose event is fired(N_SE-23027)
	- handler: bug fix (regarding enableHandler function )
	- demo:fix syntax error

* Sat Jan 26 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.14
	- demo: fix demo using tizen device API
	- multimediaview: reset the height of container
	- input: modify css correctly
	- multimediaview: fix the height of widget
	- gallery: bind create event
	- progress: bind create event
	- slider: bind create event
	- progressbar: bind create event
	- progressbar: event trigger correctly
	- popup: fix height of popup scroller
	- build: add continue option to jslint
	- ctxpopup demo : bug fix
	- demo: fix searchbar demo to use different IDs
	- demo: extract routine executing Tizen device API
	- toggleswitch : set default margin, delete box padding

* Thu Jan 24 2013 Youmin Ha <youmin.ha@samsung.com> 0.2.13
	- virtuallist: Prevent replacing contents on nonexist element
	- JQM: Trim text in listitem to get index in autodivider
	- JQM: Remove trailing whitespace in jqm patch
	- scrollview: get the height including margin
	- multimediaview: bug fix ( scrolling in full-screen mode )
	- virtuallist: set listitem width to exclude listitem left/right margin
	- demo: fix virtuallist sample layout
	- progress: set the position explicitly
	- progress: rename from progressing to progress
	- build: remove unused files
	- searchbar: fix jslint errors
	- src: fix file permissions
	- button : change jump left icon

* Wed Jan 23 2013 Minkyu Kang <mk7.kang@samsung.com> 0.2.12
	- theme : button icon - scrolltop, scrolleft icon changed.
	- build: cleanaup Makefile
	- pagelayout: fix jslint error
	- virtualgrid: Fix jslint errors
	- tabbar : jslint bug error fix
	- build: add regexp option to jslint
	- virtuallist: fix jslint errors
	- handler: Apply the exceptional principle for scrollbar on Handler.
	- build: remove unused copyright
	- loader: extract log class for tizen web, and fix jslint errors
	- loader: Viewport width is set to document width
	- popupwindow: fix jslint error
	- build: fix Makefile for tizen-white theme
	- build: remove unused libraries
	- datetimepicker: fix jslint error
	- slider: fix jslint error
	- demo: remove deprecated demos
	- pagelayout : change to call relayout with this page
	- Tokentextarea: Block size error fixed.
	- handler: bug fix (handler activation)

* Tue Jan 22 2013 Minkyu Kang <mk7.kang@samsung.com> 0.2.11
	- demo: clear input text value with cancel button click
	- demo: Adjust textarea height automatically
	- naviframe : bug fix
	- tabbar : bug fix
	- Fastscroll: popup position has been changed
	- Button: custom button icon path, margin have been changed
	- toggleswitch : bug fix
	- slider: increase the margin
	- datetimepicker: close the popup after select the value
	- unit-test : add page backbutton control test
	- Demo: added guide text and change input type in list vi
	- remove legacy codes : jquery-geo
	- Datetimepicker: text-main max-width has been removed
	- Radio: control group border has been removed
	- Demo: remove 'tab' space
	- UnitTC: swipe unit tc has been fixed
	- UnitTC: jQuery path has been fixed
	- Button: bug fix when button has not a text
	- tizen-winset: timepicker: demo title is changed

* Fri Jan 18 2013 Minkyu Kang <mk7.kang@samsung.com> 0.2.10
	- tizen-winsets: codes cleanup
	- datetimepicker: date calibration when year is changed
	- Demo: textarea size has been changed
	- Demo: Naviframe morebutton demo has been changed
	- remove unused unit test cases : gallery3d
	- tizen-winset: remove links

* Thu Jan 17 2013 Minkyu Kang <mk7.kang@samsung.com> 0.2.9
	- gallery: use timeout function instead of interval
	- Tokentextarea: Display error fixed.
	- scrollview: Fix not selector to respond with jQuery1.8.2
	- tabbar: remove the width of last element
	- Demo: apply css 'user-select:none'
	- Button: guide text has been shorten
	- build: Update jQuery to 1.8.2 (JQM1.2 compliant)
	- virtuallist: Fix mistyping
	- demo: Fix tizen function namespace in demo
	- virtuallist: Rewrite listitem replacing algorithm
	- fastscroll: modify from not selector to function
	- extendablelist: Fix unit-test
	- tabbar : prefix to tabbar scroll event
	- Popupwindow: removed unvalid selector in jquery 1.8.2
	- slider: adjust handle text as length of value
	- Demo: 3 buttons in popup text has been changed
	- src: codes cleanup
	- demo : remove trailing empty strings
	- demo : rename TizenWinset list items
	- button : change from long text list to multiline list
	- build: Remove JQM1.1.0 patches
	- Popup: Apply tizen style popup and attribute support
	- JQM: Fix buttonmarkup bug keeping ui-btn-down class
	- UnitTest: folder and file renamed, QUnit path was modified
	- tizen-winsets: button: fix textarea width
	- Swipe: event name error has been fixed

* Tue Jan 15 2013 Minkyu Kang <mk7.kang@samsung.com> 0.2.8
	- Button: button padding has been updated
	- virtuallist: fix unique listitem ID bug
	- checkbox, radio : change display attr
	- Button: bug fix ( when data style circle button on text )
	- handler: bug fix (when scrolling with multi selection)
	- JQM: adjust patch number
	- gallery: show the widget after pageshow
	- TokenTextArea : resource add ( press image )
	- gallery: adds function that set the index to value API
	- configure: set TIZEN default configures
	- footer: h tag display attribute value has been changed
	- buttons : demo bug fix
	- searchbar : demo page bug fix
	- tizen demo : bug fix
	- build: remove JQM1.1.0
	- Tokentextarea: Fix issues
	- scrollview: block the multi touch
	- list : dialogue list demo change
	- pagelayout : update dynamic control
	- Demo: Context popup close method has been changed

* Fri Jan 11 2013 Minkyu Kang <mk7.kang@samsung.com> 0.2.7
	- slider: set text container's width as text length
	- Timepicker: li max-width has been changed
	- remove experimental feature - mapview.
	- scrollview: added conditions for finding slider
	- UnitTC: Pass,error count save method has been changed
	- confix.xml: default config added for tizen basic applications
	- Swipe: p tag margin value is set '0'
	- packaging: remove unused file
	- tabbar : bug fix
	- list demo : bug fix
	- tizen-winsets: gallery: move to new section
	- tizen-winsets: autodivider: removes link of list
	- demos: entry of number-pattern name is changed from 'number' to 'number-pattern'
	- pagelayout : padding calculate change, ime footer check changed
	- tizen-winsets: searchbar: scroll to the top when type the character
	- searchbar : bug fix
	- demo: Fix virtuallist demo following new list style
	- demo: Add word-wrap:break-word and remove parag. width
	- Demo: button max-width has been set( 3 buttons in popup )
	- back button control demo : bug fix
	- toggleswitch : demo page modify
	- slider: add margin-top and margin-bottom
	- tabbar demo : bug fix
	- Popup: IME hide when popup is closed
	- token textarea : bug fix
	- Timepicker: change get attribute method
	- footer demo : bug fix
	- unit-test: gallery: add new APIs
	- gallery: adds support new APIs

* Fri Jan 04 2013 Minkyu Kang <mk7.kang@samsung.com> 0.2.6
	- JQM: patches cleanup
	- Button: data-corners attribute has been added
	- unit-test: slider: fix class name of background
	- progressbar, slider: fix less variable typo
	- Tabbar : VI update
	- notification: add top position at fix class
	- demo: entry demo page change
	- css: .ui-disabled added
	- tizen-winset: token textarea: remove back button at demo page
	- theme: Remove unused less file
	- pagelayout : content min height bug fix
	- scrollview: skip the dragging when target is slider's handle
	- scrollview: update and refactoring the scroll effect
	- UnitTest:JQM Unit TC helper has been added,TCs have been modified
	- Swipe: demo page html error has been fixed
	- listview: Add add/delete animation (VI)
	- Popup: demo page has been modified
	- tizen demo : bug fix
	- searchbar : demo page change(change front button and add behaviour)
	- pagelayout : add min height to content
	- gallery: rename 'Image Slider' to 'Gallery' in tizen-winsets demo and tests
	- back button control demo : change url link to data-rel="back"
	- loader: Skip loading theme CSS with a custom css code
	- Button: support no-text in button
	- collapsible: Fix syntax error
	- slider: use data-highlight attribute
	- collapsible: Rotate animation to collapsible heading icon
	- toggleswitch : text switch bug fix
	- remove candidates-calendarpicker
	- Patch: Fix misc mistakes in JQM patches
	- searchbar : animation change
	- gallery: get the width correctly
	- demo: data-framework-viewport-scale attribute is changed to data-framework-viewport-width
	- collapsible: Add collapse/expand animation (VI)
	- datetimepicker: VI update
	- JQM: set transition to pop as default
	- tabbar : bug fix in case none li element case
	- scrollview: fix the drag bug
	- Button: Button icon scrolltop, left has beed added
	- Swipe: VI update and swipe speed has been changed
	- jqm: fix errors in patch files
	- unit-test: swipe: fixed the destroy test

* Wed Dec 26 2012 Youmin Ha <youmin.ha@samsung.com> 0.2.5
	- Revert "[checkboxradio] exception handling for input"
		This reverts commit 72478c32704fa96362db577e6cf9511777919ea8.
		Tizen style supports no-label radio and checkbox when making lists.
		So it ignores html input operation. Instead, it supports tizen style radio and checkbox theme.

* Thu Dec 20 2012 Youmin Ha <youmin.ha@samsung.com> 0.2.4
- Fix:
	- modify segment background
	- rearrange check, radio input
	- CtxPopup: Scale up/ down popup vi(poptop, popbottom)
	- button: style has beed added(box,circle,nobg,round)
	- favorite resource added
	- demo/tizen-winsets: add footer and back button
	- remove autodividers unit test
	- add divider for tabbar
	- checkboxradio: exception handling for input
	- segment control backward compatiblity
	- Fix collapsible unit-test
	- remove toggleswitch
	- add patch for remove segment text
- Spec changes:
	- replace controlbar to tabbar

* Fri Dec 14 2012 Minkyu Kang <mk7.kang@samsung.com> 0.2.3
- FIX:
	- slider: add image
	- button: data-icon support, styles fix
	- progressbar: modify the background
	- scrollview: auto scrolling bug fix
	- pagelayout: IME concept is changed
- Spec changes:
	- dialogue: add edit mode
	- nocontents: removed
	- pagecontrol: removed
	- dayselector: removed
	- expandablelist: removed

* Thu Dec 10 2012 Youmin Ha <youmin.ha@samsung.com> 0.2.2
- FIX:
	- chang searchbar/slider images
	- delete redundant button images
- Spec changes:
	- Change widget name: shortcutscroll -> fastscroll

* Thu Dec 07 2012 Youmin Ha <youmin.ha@samsung.com> 0.2.1
- FIX:
	- jqm1.2: Change collapsible style to meet expandable list
	- remove jquery-geo-1.0.a4
	- unit-test: rename from imageslider to gallery
	- nocontent: add warning message
	- Handler: Fix issues in jqm1.2
	- Multimediaview: modify APIs & comments
	- Mapview: Fix issues in jqm1.2
	- JQM: clean up patches
	- Swipelist: refactoring swipelist
	- Popup,Ctxpopup: Apply tizen style popup in JQM1.2
	- rearrange button's data-icon resources
- Spec changes:
	- Virtualgrid: remove option ('data-itemcount')
	- gallery: rename the widget from imageslider to gallery
	- add new style for searchbar
	[tokentextarea] multi-button entry renamed as token text area. API & comments modified.

* Thu Dec 06 2012 Minkyu Kang <mk7.kang@samsung.com> 0.2.0
- FIX:
	- fix jslint error
	- remove unused files
	- change naviframe style
- Spec changes:
	- applied jQuery Mobile 1.2.0
	- remove optionheader

* Fri Nov 30 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.64
- FIX:
	- fix unit tests
	- remove unused theme files
	- timepicker: text position fix
	- scrollview: set dragstop when mouse is out of window
	- listview: fix margin
- Spec changes:
	- support data-framework-viewport-width

* Fri Nov 23 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.63
- FIX:
	- dayselector: fix size
	- remove unised styles
	- divider: set non-press effect to default option
	- popupwindow: fix window closing failure
	- handler: GUI implementation
	- TC: fix unit TCs
	- scrollview: fix padding size
- Spec changes:
	- Remove color widgets
	- add $.tizen.pkgVersion for SDK
- Etc.
	- JSDuck documents

* Fri Nov 16 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.62
- FIX:
	- Many winsets: Fix layout
	- Footer: fix position to bottom
- Spec changes:
	- Remove color widgets

* Fri Nov 09 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.61
- FIX:
	- Many widgets: New UX 0.6 theme implementation
	- widgetex: init speed up
	- scrollview: fix scrollbar and scale animation
	- scrollview: fix scroll position when updatelayout is triggered
	- header/footer: make textselection disable, except input type="text"

* Wed Nov 07 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.60
- FIX:
	- Remove tizen-black theme package description

* Tue Nov 06 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.59
- FIX:
	- Fix theme name to meet the change of system theme name: white->tizen
	- Popupwindow: fix left position
	- Remove black theme
	- footer: remove label, legend drawing
- Spec changes:
	- UX guide v0.4 : button, layout

* Fri Oct 26 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.58
- FIX:
	- scrollview: Fix outer scroll amount
	- tabbar: fix tapping twice
	- popupwindow: fix left position

* Wed Oct 24 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.57
- FIX:
	- expandablelist: icon color fix
	- scrollview: Fix xy scroll
	- footer: Remove dummy div
	- Make string concatnation effective in inline-protos.sh
- Spec changes:
	- refresh header/footer when drag&drop event is fired in GUI builder
	- searchbar: delete cancel button
	- don't trigger updatelayout event when keyup event comes

* Mon Oct 15 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.56
- FIX:
	- Toggleswitch: Change event name from 'changed' to 'change'
	- Notification: Revert interval feature

* Tue Oct 09 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.55
- FIX:
	- Fix SMACK manifest bug (S1-9098)

* Fri Oct 05 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.54
- FIX:
	- handler: don't append a handler if handler is not enabled
	- scrollview: use static value
	- datetimepicker: fix date-format HH display error
- ETC:
	- provide jquery.min.js
	- barlayout: codes clean
	- remove unused file

* Wed Sep 26 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.53
- FIX:
	- listview: change focused color
	- multibuttonentry: code refactoring
	- datetimepicker: modify date format when triggered date-changed event
	- slider: fix the top of slider bar
	- add event blocker when load a first page

* Fri Sep 21 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.52
- ETC.
	- Move SMACK manifest files to the top SRCDIR

* Fri Sep 21 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.51
- FIX:
	- Popup: Do not focus container
	- Header: show backbutton when both tabbar and header are present together
	- Multi button entry: text ellipsis, code refactoring

* Fri Sep 21 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.50
- ETC.
	- Apply SMACK manifest

* Thu Sep 20 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.49
- FIX:
	- JSLINT code clean-up
	- scrollview: firefox support
	- scrollview: fix finding slider handle
	- list: tweak text ellipsis
	- checkbox: fix selecting wrong label tag (N_SE-8370)
	- imageslider: check parameter
	- smallpopup: fix position
	- searchbar: fix 'clear' button size
- Spec changes:
	- scrollview: support outer scroll
	- JQM: block click event only with the element that does preventdefault on vclick(N_SE-6090)
	- remove S/W IME control

* Thu Sep 13 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.48
- FIX:
	- Add missing icon: controlbar
	- scrollview: tune scrolling animatio ninterval
	- datetimepicker: digit/triangle position
	- datetimepicker: fix day overflow issue
- Spec changes:
	- scrollview: show scrollbar when page is showed
	- scrollview: disable outer scroll
	- extendablelist: change api with legacy support
	- add ui-text-ellipsis class

* Mon Sep 10 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.47
- FIX:
	- scrollveiw: fix height of view
	- searchbar: support placeholder
- Spec changes:
	- add ui-text-ellipsis class

* Fri Sep 07 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.46
- FIX:
	- scrollview: scrolling bug fix
	- controlbar: fix width of controlbar item
- Spec changes:
	- searchbar: don't hide icon
	- popup: update JQM poup widget

* Fri Sep 05 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.45
- FIX:
	- controlbar: set correct controlbar width of last element
	- slider: get popup enable value correctly
	- use Date.now() instead of (new Data()).getTime()
	- popupwindow: fix the background color of popup scroller
	- listview: add padding-left to expandable list
	- add ellipsis for title area support

* Fri Aug 31 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.44
- FIX:
	- swipelist: show list items correctly
	- datetimepicker: set last day, if day is overflowed
- Spec changes:
	- controlbar: update icons

* Tue Aug 29 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.43
- FIX:
	- notification: fix typo
- Spec changes:
	- controlbar: update icons

* Tue Aug 28 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.42
- FIX:
	- multimediaview: video progress bar display normally for too samll
	- segmentcontrol: remove media query
	- scrollview: add outer scroll condition
	- datetimepicker: modify triangle size
	- popupwindow: set the screen height explicitly
	- notification: add multiline text
- Spec changes:
	- mutibuttonentry: support new GUI
	- virtualgrid: support new GUI

* Mon Aug 27 2012 Jinhyuk Jun <jinhyuk.jun@samsung.com> 0.1.41
- FIX:
	- radio/check button : button size bug fix

* Fri Aug 24 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.40
- FIX:
	- build error fixed

* Fri Aug 24 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.39
- FIX:
	- listview: style fix, remove filter placeholder
	- controlbar: divide styles
	- scrollview: don't skip dragging when click button or inputbox
	- slider: trim the text on text slider
- Spec changes:
	- remove gray and blue theme
	- add white and black theme
	- support new GUI guide

* Mon Aug 20 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.38
- FIX:
	- fix coment of version tag

* Fri Aug 17 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.37
- FIX :
	- button: fix alignment
	- listview: adjust the main text width
	- virtualgrid: refactoring
- Spec changes:
	- transition: support JQM 1.1.0 transitions
	- scrollview: support the outer scroll
	- notification: remove interval feature

* Tue Aug 14 2012 Youmin Ha <youmin.ha@samasung.com> 0.1.36
- FIX :
	- checkboxRadio: Add left/right padding
	- button: custom button & icon position
	- virtuallist: remove 'recreate' test
- Spec changes:
	- header/footer: enable/disable support

* Fri Aug 10 2012 Minkyu Kang <mk7.kang@samsung.com> 0.1.35
- FIX :
	- expandablelist: modify show animation
	- virtualgrid: Redesign programming interface
	- popupwindow: code clean and fixed issues
	- pagelayout: fix content height
	- license file update
	- virtuallist: Change programming interface
	- datetimepicker: getting days correctly
	- searchbar: set to hidden when cancel button is hide
	- White theme title font tuning
- Spec changes:
	- default theme tizen-gray to tizen-white
	- set default page transition to none

* Mon Aug 02 2012 Jinhyuk Jun <jinhyuk.jun@samsung.com> 0.1.34
- FIX :
	- Back Button : enlarge backbutton click size for white theme
- Feature :
	- Expandable List : Add refresh api
* Mon Aug 02 2012 Jinhyuk Jun <jinhyuk.jun@samsung.com> 0.1.33
- FIX :
	- click event touch threshold tuning

* Mon Aug 02 2012 Jinhyuk Jun <jinhyuk.jun@samsung.com> 0.1.32
- FIX : 
	- Add back button highlight effect for white theme

* Mon Aug 01 2012 Jinhyuk Jun <jinhyuk.jun@samsnug.com> 0.1.31
- FIX : 
	- IME checkroutine update, improve relayout on resize event
	- Add highlight effect for radio button list 
	- Scrollview : fix condition of updatelayout event
- Feature : progressing : add show/hide api

* Mon Jul 27 2012 Koeun Choi <koeun.choi@samsung.com> 0.1.30
- FIX : virtuallist, virtualgrid: Clean up temporary jquery.template object to clear cache
	add default theme option on buttonMarkup for tizen theme
	[searchbar] first fix : focus/blur fixed
	back button does not work when long press
	scrollview: don't auto scrolling if resizing area is too large
- Feature : notification : add api to set the icon at tickernoti
	demo : update the list sample demo
	Support tizen default theme

* Mon Jul 23 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.29
- Improvements & Bugfixes
   - HOTFIX: Revert template function with jquery.template

* Thu Jul 19 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.28
- Improvements & Bugfixes
   - Fix #WEB-1028: memory leak on virtuallist/virtualgrid
- Spec changes
   - $.tizen.loadTheme() function accepts theme name as arguement
   - Scrollview supports 'updatelayout' callback

* Tue Jul 17 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.27
- Improvements & Bugfixes
   - Revert 'preventing long-press popup' patch, to fix backbutton to work in SocialMagazine

* Tue Jul 17 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.26
- Improvements & Bugfixes
   - Add tizen-white theme package, to make rpm build to be finished

* Tue Jul 17 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.25
- Improvements & Bugfixes
   - Set 'slide' as default page transition effect, by JQM patch

* Fri Jul 13 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.24
- Improvements & Bugfixes
   - Fix IME show/hide algorithm
   - Fix error on virtualgrid: link _set_scrollbar_size() function to the one in virtuallist

* Wed Jul 11 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.23
- Improvements & Bugfixes
   - Fix notification position
   - Fix unit tests

 Fri Jul 6 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.22
- Spec changes
	- JQM 1.1 upgrade
- Improvements & Bugfixes
	- Transform3D support on scrollview
	- Page layout supports IME control
	- Mapview supports pinch zoom on JQM 1.1
	- Fix wrong character on button in minified version
	- Virtualgrid supports scrollbar
	- Lots of bugfixes

* Fri Jun 22 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.20
- Spec changes
	- Support 'latest' version (by symlink) for tizen-web-ui-fw.js path.
	- imageslider : supports 'resize' event.
	- listview : listview has 1px padding-bottom.
	- loader : Change global namespace, from S to $.tizen.
	- loader : Move loadCustomGlobalizeCulture() into $.tizen.util namespace.
- Improvements & Bugfixes
	- Scrollview : supports 'translate3d', instead of 'translate'.
	- notification : reset timer when 'show' or 'refresh' event.
	- JQM patch : Fix vclick event triggered twice.
- Etc.
	- Add & fix unit tests.

* Thu Jun 14 2012 Youmin Ha <youmin.ha@samsung.com> 0.1.19
- Spec changes
	- mapview : new widget.
	- notification : add .refresh() API.
	- pagecontrol : add .value([val]) API, and change an attribute name 'data-initVal' to 'data-value'.
- Improvements & Bugfixes
	- Support minified CSS.
	- loader : Fix & refactor 'loading globalize culture file' routine.
	- JQM Patch : Calculate min-height of window in javascript code, and remove predefined min-height value from CSS.
	- Many more bugfixes.
- Etc.
	- Add many unit tests.
	- Fix test coverage instrumentation tool to work with current source code.
