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


## Stay with jQuery Mobile syntax

Using TAU doesn't mean that you need to resign from jQuery Mobile syntax. TAU supports
jQuery syntax and lets you to define widgets in the same way.

### Supported components and features

DOM structure for widgets is same as widgets defined by jQuery.
TAU widgets can be used like in jQuery Mobile. Currently in TAU there is 70% widgets,
with same API and behavior like in jQuery Mobile


List of the common widgets for both frameworks:

1. Button Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <div id="button">button</div>
        </div>
    </div>
<script>
    $('#button').button({mini: true});
</script>
```

2. Checkboxradio Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <input type="checkbox" name="checkbox-yes" id="checkbox-yes" />
            <label for="checkbox-yes">Yes</label>
        </div>
    </div>
<script>
    $('#checkbox-yes').checkbox('enable');
</script>
```

3. Collapsible Widget
```mobile
    <div class="ui-page">
        <div data-role="header">
            <div id="collapsible" data-role="collapsible" data-inset="false">
                <h1>Collapsible head</h1>
                <div>Content</div>
            </div>
        </div>
    </div>
<script>
    var collapsible = $("#collapsible").collapsible({mini: true});
</script>
```

4. Collapsibleset Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <div id="collapsibleset" data-theme="c" data-content-theme="d">
                <div data-role="collapsible" data-inset="false">
                    <h6>Collapsible head 1</h6>
                    <div>Content</div>
                </div>
                <div data-role="collapsible" data-inset="false">
                    <h6>Collapsible head 2</h6>
                    <div>Content</div>
                </div>
            </div>
        </div>
    </div>
<script>
    var collapsibleset = $("#collapsibleset").collapsibleset();
</script>
```

5. Controlgroup Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <div data-role="controlgroup" id="mycontrolgroup">
                <a href="#" data-role="button">Yes</a>
                <a href="#" data-role="button">No</a>
                <a href="#" data-role="button">Cancel</a>
            </div>
        </div>
    </div>
<script>
    $('#mycontrolgroup').controlgroup();
</script>
```

6. Flipswitch Widget (in TAU framework its implemented as a part of Slider widget)
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <label for="flip-3">2. Text toggle switch:</label>
            <select name="flip-3" id="flip-3" data-role="slider">
                <option value="nope">Nope</option>
                <option value="yep">Yep</option>
            </select>
        </div>
    </div>
<script>
    $('#lip-3').slider();
</script>
```

7. Footer Widget (it's a part of page widget)
```mobile
    <div class="ui-page">
        <div data-role="footer">
            footer
        </div>
    </div>
```

8. Header Widget (it's a part of page widget)
```mobile
    <div class="ui-page">
        <div data-role="header">
            header
        </div>
    </div>
```

9. Listview Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <ul id="list">
                <li>Anton</li>
                <li>Arabella</li>
                <li>Barry</li>
                <li>Bill</li>
            </ul>
        </div>
    </div>
<script>
    $('#list').listview();
</script>
```

10. Navbar Widget
```mobile
    <div class="ui-page">
        <div class="ui-header" data-role="header">
            <div id="ns-navbar">
                <ul>
                     <li><a href="a.html">One</a></li>
                     <li><a href="b.html">Two</a></li>
                </ul>
            </div>
        </div>
    </div>
<script>
    $("#ns-navbar").navbar();
</script>
```

11. Page Widget
```mobile
    <div id="myPage">Content</div>
<script>
    var page = $("#myPage").page();
</script>
```

12. Popup Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <div id="popup">
	        <p>This is a completely basic popup, no options set.</p>
            </div>
        </div>
    </div>
<script>
	var popup = $("#popup").popup();
	popup.popup("open");
</script>
```

13. SelectMenu Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <select id="selectmenu" data-native-menu="false">
                <option value="1">The 1st Option</option>
                <option value="2">The 2nd Option</option>
            </select>
        </div>
    </div>
<script>
    $("#selectmenu").selectmenu();
</script>
```

14. Slider Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <select id="slider" name="flip-11" data-role="slider">
                 <option value="off"></option>
                 <option value="on"></option>
            </select>
        </div>
    </div>
<script>
    $( "#slider" ).slider();
</script>
```

15. Textinput Widget
```mobile
    <div class="ui-page" id="popupwindow-demo">
        <div class="ui-content" data-role="content">
            <form>
                <label for="text-1">Text input:</label>
                <input type="text" name="text-1" id="text-1" value="">
            </form>
        </div>
     </div>
<script>
    $("#text-1").textinput();
</script>
```

16. Tabbar Widget
```mobile
    <div class="ui-page">
        <div class="ui-header">
            <div class="ui-tabbar">
                <ul>
                    <li><a href="#" class="ui-btn-active">First</a></li>
                    <li><a href="#">Second</a></li>
                    <li><a href="#">Third</a></li>
                </ul>
            </div>
        </div>
        <div class="ui-content">
            This page has three tabs in the header.
        </div>
    </div>
<script>
    $("#ready-for-tab-bar").tabbar();
</script>
```

When jQuery is loaded then it's possible to control widgets behavior by calling public methods.
Public methods can be called like in jQuery mobile.

For example let assume that we have popup widget and we want to close with jQuery syntax.
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <a href="#mypopup" data-role="button" id="myButton" data-inline="true" data-rel="popup" data-position-to="window">Popup with text</a>
            <div id="mypopup" data-role="popup">
                <div class="ui-popup-text">
                    <p>
                        Pop-up dialog box, a child window that blocks user inter-act to the parent windows
                    </p>
                </div>
            </div>
        </div>
     </div>

<script>
   $('#myButton').bind('vclick', function() {
	$('#mypopup').popup("open");
        window.setTimeout(function() {
            $('#mypopup').popup("close")
        }, 1600);
   }) ;
   window.setTimeout(function() {
       $('#myButton').trigger("vclick");
   }, 100);
</script>
```

### Framework's jQM layer explained

TAU framework contain jqm module which works as a proxy between TAU framework and jQuery Mobile.
It contains eight sub-modules:

1. `defaults` - add TAU framework properties to the jQuery object
2. `widget` - register tau widgets in jQUery
3. `engine` - maps engine object from TAU namespace to jQuery Mobile namespace
4. `event` - proxy events between frameworks
5. `loader` - loader widget API
6. `router` - this object maps router from TAU namespace to jQuery Mobile namespace
7. `support` - maps support object from TAU namespace to jQuery Mobile namespace
8. `colors` - maps color support object from TAU namespace to jQuery Mobile namespace


## Moving from jQuery Mobile to pure TAU

### Why?
### Handling syntax differences
### TAU Widget instance explained
### TAU Utils / helpers

## Keeping old Web UI Framework
