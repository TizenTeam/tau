Name:       web-ui-fw
Version:    0.2.1
Release:    1
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

%post

%files
%manifest web-ui-fw.manifest
/usr/share/tizen-web-ui-fw/*/js
/usr/share/tizen-web-ui-fw/latest

###############################
%package -n web-ui-fw-theme-tizen-gray
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-gray
%Description -n web-ui-fw-theme-tizen-gray
    Tizen Web UI Framework Theme : tizen-gray

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
