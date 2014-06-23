Name:       web-ui-fw
Version:    0.9.5
Release:    0
VCS:        magnolia/framework/web/web-ui-fw#web-ui-fw_0.2.59-4-ge6c6c9d348559057a2b3d4ade5c021b0a28cbc7d
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
/usr/share/tizen-web-ui-fw/VERSION
/usr/share/tizen-web-ui-fw/*/js
/usr/share/tizen-web-ui-fw/latest

###############################
%package -n web-ui-fw-theme-tizen-white
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-white
%Description -n web-ui-fw-theme-tizen-white
	Tizen Web UI Framework Theme : tizen-white
%files -n web-ui-fw-theme-tizen-white
%manifest web-ui-fw-theme-tizen-white.manifest
/usr/share/tau/theme/mobile/white
/usr/share/tizen-web-ui-fw/*/themes/tizen-white
/usr/share/tizen-web-ui-fw/latest

###############################
%package -n web-ui-fw-theme-tizen-black
BuildArch:  noarch
Summary:    Tizen Web UI Framework Theme : tizen-black
%Description -n web-ui-fw-theme-tizen-black
	Tizen Web UI Framework Theme : tizen-black
%files -n web-ui-fw-theme-tizen-black
%manifest web-ui-fw-theme-tizen-black.manifest
/usr/share/tau/theme/mobile/black
/usr/share/tizen-web-ui-fw/*/themes/tizen-black
/usr/share/tizen-web-ui-fw/*/themes/tizen-tizen
/usr/share/tizen-web-ui-fw/latest

##############################
%package -n tau-mobile
BuildArch:  noarch
Summary:    TAU : mobile
%Description -n tau-mobile
	TAU : mobile-js
%files -n tau-mobile
%manifest tau-mobile.manifest
/usr/share/tau/*.Flora
/usr/share/tau/VERSION
/usr/share/tau/mobile/js

##############################
%package -n tau-mobile-theme-black
BuildArch:  noarch
Summary:    TAU-mobile-theme : black
%Description -n tau-mobile-theme-black
	TAU mobile theme : black
%files -n tau-mobile-theme-black
%manifest tau-mobile-theme-black.manifest
/usr/share/tau/mobile/theme/black
/usr/share/tau/mobile/theme/default

##############################
%package -n tau-mobile-theme-white
BuildArch:  noarch
Summary:    TAU-mobile-theme : white
%Description -n tau-mobile-theme-white
	TAU mobile theme : white
%files -n tau-mobile-theme-white
%manifest tau-mobile-theme-white.manifest
/usr/share/tau/mobile/theme/white

##############################
%package -n tau-mobile-theme-changeable
BuildArch:  noarch
Summary:    TAU-mobile-theme : changeable
%Description -n tau-mobile-theme-changeable
	TAU mobile theme : changeable
%files -n tau-mobile-theme-changeable
%manifest tau-mobile-theme-changeable.manifest
/usr/share/tau/mobile/theme/changeable
