Name:       web-ui-fw
Version:    0.2.83
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
echo %{buildroot}
make all

%install
make DESTDIR=%{buildroot} install
#mkdir -p %{buildroot}/usr/share/license
#cp COPYING %{buildroot}/usr/share/license/%{name}

%post

%files
%manifest web-ui-fw.manifest
/usr/share/tizen-web-ui-fw/dist
#/usr/share/tizen-web-ui-fw/*/js/cultures
#/usr/share/tizen-web-ui-fw/latest
#/usr/share/tizen-web-ui-fw/VERSION
#/usr/share/license/%{name}

