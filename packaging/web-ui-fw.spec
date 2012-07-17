Name:       web-ui-fw
Version:    0.1.26
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

%post

%files
/usr/share/tizen-web-ui-fw/*/js
/usr/share/tizen-web-ui-fw/latest

###############################
%package -n web-ui-fw-theme-tizen-gray
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-gray
%Description -n web-ui-fw-theme-tizen-gray
    Tizen Web UI Framework Theme : tizen-gray
%files -n web-ui-fw-theme-tizen-gray
/usr/share/tizen-web-ui-fw/*/themes/tizen-gray

###############################
%package -n web-ui-fw-theme-tizen-blue
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-blue
%Description -n web-ui-fw-theme-tizen-blue
    Tizen Web UI Framework Theme : tizen-blue
%files -n web-ui-fw-theme-tizen-blue
/usr/share/tizen-web-ui-fw/*/themes/tizen-blue

###############################
%package -n web-ui-fw-theme-tizen-white
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-white
%Description -n web-ui-fw-theme-tizen-white
    Tizen Web UI Framework Theme : tizen-white
%files -n web-ui-fw-theme-tizen-white
/usr/share/tizen-web-ui-fw/*/themes/tizen-white

###############################
%package -n web-ui-fw-theme-default
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : default
%Description -n web-ui-fw-theme-default
    Tizen Web UI Framework Theme : default
%files -n web-ui-fw-theme-default
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
%package -n web-ui-fw-demo-tizen-gray
BuildArch:  noarch
Summary:    Tizen Web UI Framework Demo Application: tizen-gray demo
%Description -n web-ui-fw-demo-tizen-gray
    Tizen Web UI Framework Demo Application: tizen-gray demo
%files  -n web-ui-fw-demo-tizen-gray
/usr/share/tizen-web-ui-fw/demos/tizen-gray


###############################
%changelog

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
	- themes : Provide tizen-blue theme RPM package for OBS.
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
