# Switching your Apps to TAU

## Basics

### How does the structure of folders changed
In Previous version of library, default folder structure are:
Structure of library tizen-web-ui-fw is like below:

```
tizen-web-ui-fw/
└── latest/
    ├── js/
    │   ├── cultures/
    │   ├── jquery.min.js
    │   ├── tizen-web-ui-fw-libs.min.js
    │   └── tizen-web-ui-fw.min.js
    └── themes/
        ├── tizen-black/
        │   ├── images/
        │   ├── theme.js
        │   └── tizen-web-ui-fw-theme.min.css
        └── tizen-white/
            ├── images/
            ├── theme.js
            └── tizen-web-ui-fw-theme.min.css

```
now structure of TAU library are:

```
tau/mobile/
├── js/
│   ├── cultures/
│   ├── jquery.js
│   ├── jquery.min.js
│   ├── tau.js
│   └── tau.min.js
└── theme/
    └── default/
        ├── images/
        ├── tau.css
        ├── tau.min.css
        ├── theme.js
        └── theme.min.js

```

TAU library with minified version is located in folder `mobile/js`. Default theme TAU is located in folder `mobile/theme`.
TAU are loaded the same way like previous version from device location `/usr/share/`.

###Default structure of application

When you build some application in Tizen IDE, application have folder structure like below, all files are grouped in seperated folders.
Folder _js_ is destination for application main files. Other files like images, templates or styles are collected in separated folders:

```

Application/
├── css
├── images
├── js
├── tizen-web-ui-fw
│   └── latest
│        ├── js
│        └── themes
├── config.xml
└── index.html

```

In new version structure of application as similar to previous. The only thing is changed is location to tizen library.
Library TAU is located in the folder lib with all needed files.
Files `config.xml` and `index.html` are in the main folder of application. Recommended structure for application is below:

```

Application/
├── css
├── images
├── js
├── lib
│   └── tau
│        └── mobile
├── config.xml
└── index.html


```
### Build app with library TAU


### Change to application with TAU for example Single Page Application, from Tizen SDK

If you want use the TAU library in existing app, you should add folder with these library and
 you should change source path to library from `tizen-web-ui-fw.js` to `tau.js` and also path to `jquery.js` like below:

Before:
``` mobile-wearable-tv

<script src="tizen-web-ui-fw/latest/js/jquery.min.js"></script>
<script src="tizen-web-ui-fw/latest/js/tizen-web-ui-fw-libs.min.js"></script>
```
After:
``` mobile-wearable-tv
<script src="lib/tau/mobile/js/jquery.min.js"></script>
<script src="lib/tau/mobile/js/tau.min.js"></script>
```

Important note: Before Tizen Web UI Framework supported templates by default.
Currently if you want to use jQuery templates in application then you need to add
[jQuery Templates](http://github.com/jquery/jquery-tmpl) manually like below.
Download file from website to your project.

When migrating application a specially pay attention when the widgets:
ExtendableList, VirtualList, VirtualGrid use templates.

``` mobile-wearable-tv
<script src="lib/tau/mobile/js/jquery.min.js"></script>
<script src="js/jquery.tmpl.min.js"></script>
<script src="lib/tau/mobile/js/tau.min.js"></script>
```

Next step you can add path to source to default css style `tau.css`.

Before:
``` mobile-wearable-tv

<script src="tizen-web-ui-fw/latest/js/tizen-web-ui-fw.min.js" data-framework-theme="tizen-white"></script>
```
After:
``` mobile-wearable-tv
<link rel="stylesheet" type="text/css" href="lib/tau/mobile/theme/default/tau.css" />

```

Adding this style css is not required, because if you do not add css library, the TAU loads the `tau.css` automatically.


## Stay with jQuery Mobile

### Supported components and features
### Framework's jQM layer explained

## Moving from jQuery Mobile to pure TAU

### Why?
### Handling syntax differences
### TAU Widget instance explained
### TAU Utils / helpers

## Keeping old Web UI Framework
