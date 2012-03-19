Name:		web-ui-fw
Summary:	Tizen Web UI Framework Library
Version:	0.1.11
Release:	1
Group:		TO_BE/FILLED_IN
License:	MIT
BuildRequires:	node-js, make

%description
Tizen Web UI Framework library package

%prep
make clean

%build
make

%post


%files
/usr/lib/tizen-web-ui-fw/*/js
/usr/lib/tizen-web-ui-fw/*/themes/tizen-gray


%package -n libweb-ui-fw

%package -n libweb-ui-fw-theme-tizen-gray

%package -n libweb-ui-fw-dev

%package -n libweb-ui-fw-demo-tizen-gray


