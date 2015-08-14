/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Elements
 *
 * + Button
 * + Drawer
 * + Listdivider
 * + Listview
 * + Page
 * + PageContainer
 * + Popup
 * + Progress
 * + Slider
 * + TextInput
 *
 * ##Containers of blocks
 *
 * TV profile contains List and VirtualGrid as block containers.
 *
 * ###Lists
 *
 * Default selector for listview widget is *ui-listview* class or *data-role=listview*.
 * To add a list widget to the application, use the following code.
 *
 * #### List with basic items
 *
 * You can add a basic list widget as follows:
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li>1line</li>
 *             <li>2line</li>
 *             <li>3line</li>
 *             <li>4line</li>
 *             <li>5line</li>
 *         </ul>
 *
 * #### List with link items
 *
 * You can add a list widget with a link and press effect. It allows the user to click each list item.
 * See following code:
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li>
 *                 <a href="#">1line</a>
 *             </li>
 *             <li>
 *                 <a href="#">2line</a>
 *             </li>
 *             <li>
 *                 <a href="#">3line</a>
 *             </li>
 *             <li>
 *                 <a href="#">4line</a>
 *             </li>
 *             <li>
 *                 <a href="#">5line</a>
 *             </li>
 *         </ul>
 *
 * #### List with checkboxes
 *
 * To create list with checkboxes use class *li-has-checkbox* for 'li' tag.
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li class="li-has-checkbox">
 *                 <a href="">
 *                      <input type="checkbox" id="checkbox-1"/>
 *                      <label for="checkbox-1">List 01</label>
 *                 </a>
 *             </li>
 *             <li class="li-has-checkbox">
 *                 <a href="">
 *                      <input type="checkbox" id="checkbox-2"/>
 *                      <label for="checkbox-2">List 02</label>
 *                 </a>
 *             </li>
 *         </ul>
 *
 * #### List with radio buttons
 *
 * To create list with radio buttons use class *li-has-radio* for 'li' tag.
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li class="li-has-radio">
 *                 <a href="">
 *                      <input type="radio" name="radio-sample" checked="checked" id="rd-1"/>
 *                      <label for="rd-1">Radio 01</label>
 *                 </a>
 *             </li>
 *             <li class="li-has-radio">
 *                 <a href="">
 *                      <input type="radio" name="radio-sample" id="rd-2"/>
 *                      <label for="rd-2">Radio 02</label>
 *                 </a>
 *             </li>
 *         </ul>
 *
 * #### Multiline list
 *
 * To apply multiline style use *li-has-multiline* and *li-text-sub* classes. See example code.
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li class="li-has-multiline">
 *                 <a href="#">
 *                     Wallpaper
 *                     <span class="li-text-sub">Overall size of fonts</span>
 *                 </a>
 *             </li>
 *             <li class="li-has-multiline">
 *                 <a href="#">
 *                     Wallpaper
 *                     <span class="li-text-sub">Overall size of fonts</span>
 *                 </a>
 *             </li>
 *         </ul>
 *
 * ###Grids
 *
 * Widget creates special grid which can contain big number of items.
 * Default selector for VirtualGrid widget is *ui-virtualgrid* class.
 * To add an items to the VirtualGrid, use the following code.
 *
 *      @example
 *      <div class="ui-content">
 *          <ul id="vlist1" class="ui-virtualgrid"></ul>
 *      </div>
 *      <script>
 *          var JSON_DATA = [
 *                   {NAME:"Abdelnaby", TEAM_LOGO:"1_raw.jpg"},
 *                   {NAME:"Abdul-Aziz", TEAM_LOGO:".2_raw.jpg"}
 *               ],
 *               vgrid;
 *
 *           document.addEventListener("pageshow", function() {
 *               var elList = document.getElementById("vlist1");
 *
 *               if (elList) {
 *                   vgrid = tau.widget.VirtualGrid(elList);
 *                   vgrid.option({
 *                       dataLength: JSON_DATA.length,
 *                       bufferSize: 40
 *                   });
 *
 *                   // Update listitem
 *                   vgrid.setListItemUpdater(function (elListItem, newIndex) {
 *                       var data = JSON_DATA[newIndex];
 *
 *                       elListItem.innerHTML = '<a class="grid-thumbnail ' + (newIndex === 2 ? "ui-selected" : "") + '"> <div class="grid-thumbnail-pic-full"><img class="grid-thumbnail-pic-img" src="' + data.TEAM_LOGO + '"  /></div><div class="grid-thumbnail-contents"><span class="grid-thumbnail-content">' + data.NAME + '</span></div></a>'
 *                       tau.widget.Button(elListItem.firstElementChild);
 *                   });
 *                   // Draw child elements
 *                   vgrid.draw();
 *               }
 *           });
 *
 *           document.addEventListener("pagehide", function() {
 *               // Remove all children in the vgrid
 *               if (vgrid) {
 *                   vgrid.destroy();
 *               }
 *           });
 *      </script>
 *
 * ##Buttons and icons
 *
 * Button widget changes default browser buttons to special buttons with additional options like icon, corners, shadow.
 *
 * ###HTML button examples
 *
 * You can add button widget as following examples.
 *
 * ####Create simple button from link using data-role
 *
 *      @example
 *      <a href="#page2" data-role="button">Link button</a>
 *
 * ####Create simple button from link using class selector
 *
 *      @example
 *      <a href="#page2" class="ui-btn">Link button</a>
 *
 * ####Create simple button using button's tag
 *
 *      @example
 *      <button>Button element</button>
 *
 * ####Create simple button from input using type
 *
 *      @example
 *      <input type="button" value="Button" />
 *      <input type="submit" value="Submit Button" />
 *      <input type="reset" value="Reset Button" />
 *
 * ###Button as icon
 *
 * By default, all icons in buttons are placed to the left of the button text. This default may be overridden using the data-iconpos attribute.
 *
 *      @example
 *      <a href="index.html" data-role="button" data-icon="delete" data-iconpos="right">Delete</a>
 *
 * Possible values of data-iconpos:<br>
 *
 *  - "left"  - creates the button with left-aligned icon<br>
 *  - "right"  - creates the button with right-aligned icon<br>
 *  - "top"  - creates the button with icon positioned above the text<br>
 *  - "bottom"  - creates the button with icon positioned below the text<br>
 *
 * You can also create an icon-only button, by setting the data-iconpos attribute to *notext*. The button plugin will hide the text on-screen, but add it as a title attribute on the link to provide context for screen readers and devices that support tooltips.
 *
 *      @example
 *      <a href="index.html" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>
 *
 * ##Drawer
 *
 * Container with ability to open and close with an animation.
 * You can make the drawer widget as data-role="drawer" with DIV tag.
 *
 * ###Default selectors
 *
 * By default all elements with data-role="drawer" or class "ui-drawer" are
 * changed to Drawer widget.
 *
 * ###Placing rule
 *
 * Drawer HTML element should be placed inside a page (div with data-role="page"),
 * but not inside a content (div with data-role="content").
 *
 * ###HTML Examples
 *
 * This paragraph describes how to create and use Drawer widget.
 *
 * ####Manual constructor
 * For manual creation of Drawer widget you can use constructor of widget:
 *
 *      @example
 *      <!-- Widget structure -->
 *      <div class="ui-page">
 *          <div data-role="drawer" data-position="left" id="drawer">
 *              <ul data-role="listview">
 *                  <li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *                  <li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *                  <li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *              </ul>
 *          </div>
 *      </div>
 *      <script>
 *          var drawer = document.getElementById("drawer"),
 *              widget = tau.widget.Drawer(drawer);
 *      </script>
 *
 * ####Opening / Closing Drawer. Checking if Drawer is open.
 *
 * To open / close Drawer one can use open() and close() methods.
 * To check if Drawer is open use isOpen method.
 *
 *	@example
 *      <!-- Widget structure -->
 *      <div class="ui-page">
 *          <div data-role="drawer" data-position="left" id="drawer">
 *              <ul data-role="listview">
 *                  <li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *                  <li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *                  <li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *              </ul>
 *          </div>
 *      </div>
 *      <script>
 *          var drawer = document.getElementById("drawer"),
 *              widget = tau.widget.Drawer(drawer);
 *          // open
 *          widget.open();
 *          alert(widget.isOpen());
 *          // close
 *          widget.close();
 *          alert(widget.isOpen());
 *      </script>
 *
 * ####Positioning Drawer left
 *
 * To position Drawer left set data-position to "left" or do not use this
 * attribute (left is default).
 *
 *      @example
 *      <!-- Widget structure -->
 *      <div class="ui-page">
 *         <div data-role="drawer" data-position="left" id="drawer">
 *             <ul data-role="listview">
 *                 <li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *                 <li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *                 <li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *             </ul>
 *         </div>
 *      </div>
 *
 *      @example
 *      <!-- Widget structure -->
 *      <div class="ui-page">
 *          <div data-role="drawer" id="drawer">
 *              <ul data-role="listview">
 *                  <li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *                  <li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *                  <li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *              </ul>
 *          </div>
 *      </div>
 *
 * ####Positioning Drawer right
 *
 * To position Drawer right set data-position attribute to "right".
 *
 *      @example
 *      <!-- Widget structure -->
 *      <div class="ui-page">
 *          <div data-role="drawer" data-position="right" id="drawer">
 *              <ul data-role="listview">
 *                  <li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *                  <li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *                  <li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *              </ul>
 *          </div>
 *      </div>
 *
 * ## Screen resolution
 *
 * Default TV resolution is 1920x1080. TV profile uses *vw* and *vh* as way of measuring widgets in CSS.
 * They represent percentages of the browser viewport’s width and height.
 * 1vw = 1/100 of the current viewport width, i.e. 1% of the width. For example *width: 100vw* is full screen width. For default TV resolution is 1920px.
 * 15vh = 15/100 of the viewport’s current height or 15% of the height.
 *
 *      @example
 *      textarea {
 *          height: 6.09374999961vw;
 *          font-size: 1.66666666656vw;
 *          width: 3.02083333314vw;
 *      }
 *
 * ##Colors
 *
 * Every widget defines its own set of colors.
 *
 * ###Button colors
 *
 * Normal button color: rgb(211, 211, 211)
 * Focused button color: rgb(69, 143, 255)
 * Button text color: rgb(89, 89, 89)
 * Focused button text color: gb(255, 255, 255)
 * Icon button color: rgb(255, 255, 255)
 *
 * ###Checkboxradio colors
 *
 * Default color: rgb(255, 255, 255)
 *
 * ###Drawer
 *
 * Close button background color: rgb(69, 143, 255);
 * Drawer buttons color rgb(255, 255, 255)
 * Divider color: rgb(42, 50, 64)
 * Divider border color: rgb(6, 8, 11)
 * Divider buttons color: rgb(211, 211, 211)
 * Footer background color: rgb(45, 45, 45)
 *
 * ###VirtualGrid colors
 *
 * Button text color: rgb(211, 211, 211)
 * Thumbnail background color: rgb(33, 36, 13)
 * Thumbnail color: rgb(211, 211, 211)
 *
 * ###Inputs
 *
 * Input background color: rgb(255, 255, 255)
 * Input text color: rgba(61, 61, 61, 0.5)
 * Focused input text color: rgb(61, 61, 61)
 * Number input text color: rgb(69, 143, 255)
 * Focused number input text color: rgb(255, 255, 255)
 * Focused number input background color: rgb(69, 143, 255)
 *
 * ###Listview
 *
 * Focused button text color rgb(255, 255, 255)
 * Disabled list item text color: rgb(51, 51, 51)
 * List background color: rgb(255, 255, 255)
 * List subcategory text color: rgb(189, 167, 146)
 * List radio/checkbox label color: rgb(89, 89, 89)
 *
 * ###Popup
 *
 * Popup title text color: rgb(255, 255, 255)
 * Popup background color: rgb(255, 255, 255)
 * Popup border color rgb(128, 72, 0)
 * Popup header background color: rgb(42,76,130)
 * Popup header border color: rgb(67, 67, 67)
 * Popup button background color: rgb(72, 65, 60)
 * Popup focused button background color: rgb(99, 93, 89)
 * Popup text color: rgb(61, 61, 61)
 *
 * ###Progress
 *
 * Progress color: rgb(51, 67, 83)
 * Progress value color: rgb(65, 91, 254)
 * Progress shadow color: rgb(116, 113, 127)
 *
 * ###Listdivider
 *
 * Listdivider text color: rgb(66, 87, 144)
 * Listdivider line background color: rgb(66, 87, 144)
 *
 * ##Typography
 *
 * This paragraph describes fonts used in TV profile.
 *
 * ###Font size
 *
 * TV profile set @font_size_default as 17px. Html font-size is set by WRT base font-size
 * Default font size (base font from WRT)
 *  + small: 13px
 *  + normal: 17px
 *  + large: 20px
 *
 * ####Font family
 *
 * Tizen, Samsung Sans, Helvetica;
 *
 * @page ns.page.designElements
 * @seeMore introduction.htm Design guide
 */
