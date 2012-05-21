Name:       web-ui-fw
Version:    0.1.16
Release:    1
Summary:    Tizen Web UI Framework Library
Group:      Development/Other
License:    MIT
BuildRequires:  make
BuildRequires:  nodejs
BuildRequires:  nodejs-x86-arm

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
%{_prefix}/share/tizen-web-ui-fw/*/js
 
 
%changelog
 
 
###############################
%package -n web-ui-fw-theme-tizen-gray
Summary:    Tizen Web UI Framework Theme : tizen-gray
%Description -n web-ui-fw-theme-tizen-gray
    Tizen Web UI Framework Theme : tizen-gray
%files -n web-ui-fw-theme-tizen-gray
/usr/share/tizen-web-ui-fw/*/themes/tizen-gray

###############################
%package -n web-ui-fw-theme-default
Summary:    Tizen Web UI Framework Theme : default
%Description -n web-ui-fw-theme-default
    Tizen Web UI Framework Theme : default
%files -n web-ui-fw-theme-default
/usr/share/tizen-web-ui-fw/*/themes/default

###############################
%package -n web-ui-fw-devel
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
