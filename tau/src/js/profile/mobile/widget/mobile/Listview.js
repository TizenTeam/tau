/*global window, define */
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
/*jslint nomen: true, plusplus: true */
/**
 * # Listview Widget
 * The list widget is used to display, for example, navigation data, results,
 * and data entries.
 *
 * !!!When implementing the list widget:!!!
 *
 *	- A button widget (data-role="button") placed in the *a* tag is
 *	 not supported in the list widget. The button must be placed in a *div* tag.
 *	- If you implement the list widget differently than described in
 *	 the examples shown below, application customization (set element
 *	 positioning) is required.
 *
 *
 * ## Default selectors
 * By default UL or OL elements with _data-role=listview_ are changed to
 * Tizen Web UI Listview.
 *
 * Additionaly all UL or OL elements with class _ui-listview_ are changed to
 *  Tizen Web UI Listview.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bill</li>
 *		</ul>
 *
 * #### Create Listview widget using tau method:
 *
 *		@example
 *		<ul id="list">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bill</li>
 *		</ul>
 *		<script>
 *			tau.widget.Listview(document.getElementById("list"));
 *		</script>
 *
 * #### Create FastScroll widget using jQueryMobile notation:
 *
 *		@example
 *		<ul id="list">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bill</li>
 *		</ul>
 *		<script>
 *			$('#list').listview();
 *		</script>
 *
 * ## Options
 *
 * ### Inset
 * _data-inset_ If this option is set to **true** the listview is wrapped by
 * additionally layer
 *
 *		@example
 *		<ul data-role="listview" data-inset="true">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bill</li>
 *		</ul>
 *
 * ### Theme
 * _data-theme_ Sets the theme of listview
 *
 *		@example
 *		<ul data-role="listview" data-theme="s">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bill</li>
 *		</ul>
 *
 * ### Divider theme
 * _data-divider-theme_ Sets the divider theme of listview
 *
 *		@example
 *		<ul data-role="listview" data-divider-theme="s">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li data-role="divider">B</li>
 *			<li>Barry</li>
 *			<li>Bill</li>
 *		</ul>
 *
 *
 * ## HTML example code
 *
 * ### Basic 1-line list item with anchor.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li><a href="#">Anton</a></li>
 *			<li><a href="#">Barry</a></li>
 *			<li><a href="#">Bill</a></li>
 *		</ul>
 *
 * ### Basic 1-line list item without anchor.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>Anton</li>
 *			<li>Barry</li>
 *			<li>Bill</li>
 *		</ul>
 *
 * ### 1-line list item with a subtext.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li><a href="#">
 *				Anton
 *				<span class="ui-li-text-sub">subtext</span>
 *				</a>
 *			</li>
 *			<li><a href="#">
 *				Barry
 *				<span class="ui-li-text-sub">subtext</span>
 *				</a>
 *			</li>
 *			<li><a href="#">
 *				Bill
 *				<span class="ui-li-text-sub">subtext</span>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### List with sub text below the main text.
 *
 * If this attribute is not used, the sub text position is right next to
 * the main text.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-multiline">Anton
 *				<span class="ui-li-text-sub">subtext</span>
 *			</li>
 *			<li class="ui-li-multiline">Barry
 *				<span class="ui-li-text-sub">subtext</span>
 *			</li>
 *			<li class="ui-li-multiline">Bill
 *				<span class="ui-li-text-sub">subtext</span>
 *			</li>
 *		</ul>
 *
 * ### List with thumbnail
 *
 *		@example
 *		<ul data-role="listview">
 *			<li><img src="a.jpg" class="ui-li-bigicon" />Anton</li>
 *			<li><img src="a.jpg" class="ui-li-bigicon" />Barry</li>
 *			<li><img src="a.jpg" class="ui-li-bigicon" />Bill</li>
 *		</ul>
 *
 * ### List with thumbnail to the right.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-thumbnail-right">
 *				<img src="a.jpg" class="ui-li-bigicon" />
 *				Anton
 *			</li>
 *			<li class="ui-li-thumbnail-right">
 *				<img src="a.jpg" class="ui-li-bigicon" />
 *				Barry
 *			</li>
 *			<li class="ui-li-thumbnail-right">
 *				<img src="a.jpg" class="ui-li-bigicon" />
 *				Bill
 *			</li>
 *		</ul>
 *
 * ### 1-line list item with a text button, or with a circle-shaped button.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li><a href="#">
 *					Anton
 *					<div data-role="button" data-inline="true">Button</div>
 *				</a>
 *			</li>
 *			<li><a href="#">
 *					Barry
 *					<div data-role="button" data-inline="true" data-icon="plus"
 *						data-style="circle"></div>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 1-line list item with a toggle switch.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>
 *				Anton
 *				<select name="flip-11" id="flip-11" data-role="slider">
 *					<option value="off"></option>
 *					<option value="on"></option>
 *				</select>
 *			</li>
 *			<li>
 *				Barry
 *				<select name="flip-12" id="flip-12" data-role="slider">
 *					<option value="off"></option>
 *					<option value="on"></option>
 *				</select>
 *			</li>
 *			<li>
 *				Bill
 *				<select name="flip-13" id="flip-13" data-role="slider">
 *					<option value="off"></option>
 *					<option value="on"></option>
 *				</select>
 *			</li>
 *		</ul>
 *
 * ### 1-line list item with thumbnail image
 * #### - and a subtext,
 * #### - and text button,
 * #### - and circle-shaped button
 * #### - and a toggle switch.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li><a href="#">
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *					Anton
 *				</a>
 *			</li>
 *			<li><a href="#">
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *					Barry
 *					<span class="ui-li-text-sub">subtext</span>
 *				</a>
 *			</li>
 *			<li><a href="#">
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *					Barry
 *					<div data-role="button" data-inline="true">Button</div>
 *				</a>
 *			</li>
 *			<li><a href="#">
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *					Barry
 *					<div data-role="button" data-inline="true" data-icon="plus"
 *						data-style="circle"></div>
 *				</a>
 *			</li>
 *			<li>
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				Barry
 *				<select name="flip-13" id="flip-13" data-role="slider">
 *					<option value="off"></option>
 *					<option value="on"></option>
 *				</select>
 *			</li>
 *		</ul>
 *
 * ### 1-line list item with check box,
 * #### - and thumbnail,
 * #### - and thumbnail and circle-shaped button.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>
 *				<form><input type="checkbox" name="c1line-check1" /></form>
 *				Anton
 *			</li>
 *			<li>
 *				<form><input type="checkbox" /></form>
 *				Barry
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *			</li>
 *			<li>
 *				<form><input type="checkbox" name="c1line-check4" /></form>
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				Barry
 *				<div data-role="button" data-inline="true" data-icon="plus"
 *					data-style="circle"></div>
 *			</li>
 *		</ul>
 *
 * ### 1-line list item with radio button,
 * #### - and thumbnail,
 * #### - and thumbnail and circle-shaped button.
 *
 *		@example
 *		<form>
 *		<ul data-role="listview">
 *			<li>
 *				<input type="radio" name="radio"/>
 *				Anton
 *			</li>
 *			<li>
 *				<input type="radio" name="radio"/>
 *				Barry
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *			</li>
 *			<li>
 *				<input type="radio" name="radio"/>
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				Barry
 *				<div data-role="button" data-inline="true" data-icon="plus"
 *					data-style="circle"></div>
 *			</li>
 *		</ul>
 *		<form>
 *
 * ### Basic 2-line list item.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Anton
 *					<span class="ui-li-text-sub">subtext</span>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Barry
 *					<span class="ui-li-text-sub">subtext</span>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Bill
 *					<span class="ui-li-text-sub">subtext</span>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with 2 subtexts.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Anton
 *					<span class="ui-li-text-sub">subtext</span>
 *					<span class="ui-li-text-sub2">subtext 2</span>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Barry
 *					<span class="ui-li-text-sub">subtext</span>
 *					<span class="ui-li-text-sub2">subtext 2</span>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Bill
 *					<span class="ui-li-text-sub">subtext</span>
 *					<span class="ui-li-text-sub2">subtext 2</span>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with a text or circle-shaped button.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Anton
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="button" data-inline="true">button</div>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Barry
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="button" data-inline="true" data-icon="call"
 *						data-style="circle"></div>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with 2 subtexts
 * #### - and a star-shaped icon next to the first subtext
 * #### - and 1 subtext and 2 star-shaped icons
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Anton
 *					<span class="ui-li-text-sub">subtext</span>
 *					<span style="position:absolute; right:16px; top:80px">
 *						<img class= "ui-li-icon-sub-right"
 *							src="00_winset_icon_favorite_on.png" />
 *					</span>
 *					<span class="ui-li-text-sub2">subtext 2</span>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Barry
 *					<span class="ui-li-text-sub">
 *						<img class="ui-li-icon-sub"
 *							src="00_winset_icon_favorite_on.png" />
 *						subtext
 *					</span>
 *					<span>
 *						<img class="ui-li-icon-sub-right"
 *							src="00_winset_icon_favorite_on.png" />
 *					</span>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line setting list item,
 * #### - with optionally also a toggle switch
 * #### - or circle-shaped button.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Anton
 *					<span class="ui-li-text-sub">subtext</span>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				Barry
 *				<span class="ui-li-text-sub">subtext</span>
 *				<select name="flip-13" id="flip-13" data-role="slider">
 *					<option value="off"></option>
 *					<option value="on"></option>
 *				</select>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Bill
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="button" data-inline="true" data-icon="call"
 *						data-style="circle"></div>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with a subtext,
 * #### - and also a star-shaped icon and a circle-shaped button,
 * #### - thumbnail and a second subtext,
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					Anton
 *					<span class="ui-li-text-sub">
 *						subtext
 *						<img class="ui-li-icon-sub"
 *							src="00_winset_icon_favorite_on.png" />
 *					</span>
 *					<div data-role="button" data-inline="true" data-icon="call"
 *						data-style="circle"></div>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *					Barry
 *					<span class="ui-li-text-sub">subtext 1</span>
 *					<span class="ui-li-text-sub2">subtext 2</span>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with a subtext and check box
 * #### - and thumbnail
 * #### - and a circle-shaped button.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<form><input type="checkbox" name="check1" /></form>
 *				Anton
 *				<span class="ui-li-text-sub">subtext</span>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<form><input type="checkbox" name="check2" /></form>
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				Barry
 *				<span class="ui-li-text-sub">subtext</span>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<form><input type="checkbox" name="check3" /></form>
 *				Bill
 *				<span class="ui-li-text-sub">subtext</span>
 *				<div data-role="button" data-inline="true" data-icon="call"
 *					data-style="circle"></div>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with a subtext and radio button,
 * #### - and thumbnail
 * #### - and a circle-shaped button.
 *
 *		@example
 *		<form>
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *					<input type="radio" name="radio1" />
 *					Anton
 *					<span class="ui-li-text-sub">subtext</span>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *					<input type="radio" name="radio1" />
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *					Barry
 *					<span class="ui-li-text-sub">subtext</span>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *					<input type="radio" name="radio1" />
 *					Barry
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="button" data-inline="true" data-icon="call"
 *						data-style="circle"></div>
 *			</li>
 *		</ul>
 *		</form>
 *
 * ### 2-line list item with a color bar,
 * #### - subtext, text button and 3 star-shaped icons,
 * #### - thumbnail, subtext, text button, and 1 star-shaped icon,
 * #### - thumbnail, subtext, and circle-shaped button.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					<span class="ui-li-color-bar"
 *						style="background-color: red;"></span>
 *					Anton
 *					<span class="ui-li-text-sub">subtext
 *						<img src="00_winset_icon_favorite_on.png" />
 *						<img src="00_winset_icon_favorite_on.png" />
 *						<img src="00_winset_icon_favorite_on.png" />
 *					</span>
 *					<div data-role="button" data-inline="true">button</div>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					<span class="ui-li-color-bar"
 *						style="background-color:rgba(72, 136, 42, 1);"></span>
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *					Barry
 *					<span>
 *						<img class="ui-li-icon-sub"
 *							src="00_winset_icon_favorite_on.png" />
 *					</span>
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="button" data-inline="true">button</div>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					<span class="ui-li-color-bar"
 *						style="background-color: blue;"></span>
 *					Bill
 *					<span>
 *						<img class="ui-li-icon-sub"
 *							src="00_winset_icon_favorite_on.png" />
 *					</span>
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="button" data-inline="true" data-icon="call"
 *						data-style="circle"></div>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with a subtext and thumbnail at right
 * #### and 2 star-shaped icons
 * #### and a star-shaped icons, subtext, and thumbnail.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline ui-li-thumbnail-right">
 *				<a href="#">
 *					Anton
 *					<span class="ui-li-text-sub">subtext</span>
 *					<img src="thumbnail.jpg" class="ui-li-bigicon">
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline ui-li-thumbnail-right">
 *				<a href="#">
 *					Barry
 *					<span>
 *						<img class="ui-li-icon-sub"
 *							src="00_winset_icon_favorite_on.png" />
 *					</span>
 *					<span class="ui-li-text-sub">
 *						<img class="ui-li-icon-sub"
 *							src="00_winset_icon_favorite_on.png" />
 *						subtext
 *					</span>
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with a subtext before the main text and a thumbnail.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline ui-li-thumbnail-right">
 *				<a href="#">
 *					<span class="ui-li-text-sub">subtext</span>
 *					Anton
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline ui-li-thumbnail-right">
 *				<a href="#">
 *					<span class="ui-li-text-sub">subtext</span>
 *					Barry
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline ui-li-thumbnail-right">
 *				<a href="#">
 *					<span class="ui-li-text-sub">subtext</span>
 *					Bill
 *					<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with a thumbnail and a progress bar.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					<img scr="thumbnail.jpg" class="ui-li-bigicon">
 *					Anton
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="progressbar" id="progressbar"></div>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					<img scr="thumbnail.jpg" class="ui-li-bigicon">
 *					Barry
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="progressbar" id="progressbar"></div>
 *				</a>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<a href="#">
 *					<img scr="thumbnail.jpg" class="ui-li-bigicon">
 *					Bill
 *					<span class="ui-li-text-sub">subtext</span>
 *					<div data-role="progressbar" id="progressbar"></div>
 *				</a>
 *			</li>
 *		</ul>
 *
 * ### 2-line list item with a check box, thumbnail, subtext
 * ### and circle-shaped button.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li class="ui-li-has-multiline">
 *				<form><input type="checkbox" name="checkbox" /></form>
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				Anton
 *				<span class="ui-li-text-sub">subtext</span>
 *				<div data-role="button" data-inline="true" data-icon="call"
 *					data-style="circle"></div>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<form><input type="checkbox" name="checkbox" /></form>
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				Barry
 *				<span class="ui-li-text-sub">subtext</span>
 *				<div data-role="button" data-inline="true" data-icon="call"
 *					data-style="circle"></div>
 *			</li>
 *			<li class="ui-li-has-multiline">
 *				<form><input type="checkbox" name="checkbox" /></form>
 *				<img src="thumbnail.jpg" class="ui-li-bigicon" />
 *				Bill
 *				<span class="ui-li-text-sub">subtext</span>
 *				<div data-role="button" data-inline="true" data-icon="call"
 *					data-style="circle"></div>
 *			</li>
 *		</ul>
 *
 * @class ns.widget.mobile.Listview
 * @extends ns.widget.mobile.BaseWidgetMobile
 */
/**
 * Triggered when the listview is before refresh items.
 * @event beforerefreshitems
 * @member ns.widget.mobile.Listview
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/css",
			"../../../../core/util/selectors",
			"../../../../core/event",
			"../../../../core/event/vmouse",
			"../../../../core/util/colors",
			"../../../../core/widget/core/Page",
			"../../../../core/widget/core/Button",
			"../mobile",
			"./BaseWidgetMobile",
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Listview = function () {
					var self = this;
					self._ui = {
						page: null
					};
					self._coloredListHandler = null;
					self._scrolledElement = null;
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.Listview
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for class {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.widget.mobile.Listview
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM,
				/**
				 * Alias for class ns.widget.core.Button
				 * @property {Function} Button
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @private
				 */
				Button = ns.widget.core.Button,
				/**
				 * Alias for class ns.widget.core.Page
				 * @property {Function} Page
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @private
				 */
				Page = ns.widget.core.Page,
				/**
				 * Alias for class {@link ns.util.color}
				 * @property {Function} Page
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @private
				 */
				colorUtils = ns.util.colors,
				/**
				 * Alias for object ns.widget.mobile.Listview.classes
				 * @property {Object} classes
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @private
				 * @readonly
				 * @property {string} classes.uiListview Main class of listview
				 * @property {string} classes.uiListviewInset class of listview as inset
				 * @property {string} classes.uiCornerAll class of corners all
				 * @property {string} classes.uiShadow class of shadow
				 * @property {string} classes.uiLi class of li element
				 * @property {string} classes.uiLiLast class of last li element
				 * @property {string} classes.uiCornerTop class of top corners
				 * @property {string} classes.uiCornerTr class of top right corner
				 * @property {string} classes.uiCornerTl class of top left corner
				 * @property {string} classes.uiCornerBottom class of bottom corners
				 * @property {string} classes.uiCornerBr class of bottom right corner
				 * @property {string} classes.uiCornerBl class of bottom left corner
				 * @property {string} classes.uiLink class of link on listview
				 * @property {string} classes.uiLiLinkAlt class of li element as link on listview
				 * @property {string} classes.uiLiHasArrow class of li element which has arrow
				 * @property {string} classes.uiLiHasAlt class of li element which has alt
				 * @property {string} classes.uiLinkInherit class inherit link on listview
				 * @property {string} classes.uiLiThumb class of thumb included in li element
				 * @property {string} classes.uiLiHasThumb class of li element which has thumb
				 * @property {string} classes.uiLiIcon class of icon included in li element
				 * @property {string} classes.uiLiHasIcon class of li element which has icon
				 * @property {string} classes.uiLiHasCheckbox class of li element which has checkbox
				 * @property {string} classes.uiLiHasCheckboxDisabled class of li element which has checkbox disabled
				 * @property {string} classes.uiLiHasRadio class of li element which has radio button
				 * @property {string} classes.uiLiHasRadioDisabled class of li element which has radio button disabled
				 * @property {string} classes.uiLiHasRightCircleBtn class of li element which has circle button
				 * @property {string} classes.uiLiHasRightBtn class of li element which has button allign to right
				 * @property {string} classes.uiLiCount class of count included in li element
				 * @property {string} classes.uiLiHasCount class of li element which has count
				 * @property {string} classes.uiLiStatic class of li static element
				 * @property {string} classes.uiLiHeading class of li heading
				 */
				classes = {
					uiListview : "ui-listview",
					uiListviewInset: "ui-listview-inset",
					uiListviewColored: "ui-listview-colored",
					uiCornerAll: "ui-corner-all",
					uiShadow: "ui-shadow",
					uiLi: "ui-li",
					uiLiLast: "ui-li-last",
					uiCornerTop: "ui-corner-top",
					uiCornerTr: "ui-corner-tr",
					uiCornerTl: "ui-corner-tl",
					uiCornerBottom: "ui-corner-bottom",
					uiCornerBr: "ui-corner-br",
					uiCornerBl: "ui-corner-bl",
					uiLink: "ui-link",
					uiLiLinkAlt: "ui-li-link-alt",
					uiLiHasArrow: "ui-li-has-arrow",
					uiLiHasAlt: "ui-li-has-alt",
					uiLinkInherit: "ui-link-inherit",
					uiLiThumb: "ui-li-thumb",
					uiLiHasThumb: "ui-li-has-thumb",
					uiLiIcon: "ui-li-icon",
					uiLiHasIcon: "ui-li-has-icon",
					uiLiHasCheckbox: "ui-li-has-checkbox",
					uiLiHasCheckboxDisabled: "ui-li-has-checkbox-disabled",
					uiLiHasRadio: "ui-li-has-radio",
					uiLiHasRadioDisabled: "ui-li-has-radio-disabled",
					uiLiHasRightCircleBtn: "ui-li-has-right-circle-btn",
					uiLiHasRightBtn: "ui-li-has-right-btn",
					uiLiCount: "ui-li-count",
					uiLiHasCount: "ui-li-has-count",
					uiLiAnchor: "ui-li-anchor",
					uiLiStatic: "ui-li-static",
					uiLiHeading: "ui-li-heading"
				},
				/**
				 * Alias for object ns.widget.core.Button.classes
				 * @property {Object} buttonClasses
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @private
				 */
				buttonClasses = Button.classes,
				/**
				 * Alias to ns.util.selectors
				 * @property {Object} selectors
				 * @member ns.widget.mobile.Listview
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * Alias to ns.event
				 * @property {Object} eventUtils
				 * @member ns.widget.mobile.Listview
				 * @private
				 * @static
				 */
				eventUtils = ns.event,
				/**
				 * Alias to Array.slice
				 * @method slice
				 * @member ns.widget.mobile.Listview
				 * @private
				 */
				slice = [].slice;

			Listview.prototype = new BaseWidget();

			Listview.classes = classes;

			Listview.prototype._configure = function () {
				var self = this,
					ui = self._ui || {},
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {?string} [options.theme=null] theme of widget
					 * @property {?string} [options.dividerTheme="s"] theme of listview divider
					 * @property {boolean} [options.inset=false] inset option - listview is wrapped by additionally layer
					 * @property {"colored"|null} [options.type=null] set type of list, colored or not
					 * @property {number} [options.coloredListNumber=18] max number of colored items
					 * @property {number} [options.diffLightness=3] difference between colored items
					 * @member ns.widget.mobile.Listview
					 */
					options = self.options || {};

				options.theme = null;
				options.dividerTheme = "s";
				options.inset = false;
				options.type = null;
				options.coloredListNumber = 18;
				options.diffLightness = 3;

				self.options = options;
				ui.page = null;
			};

			/**
			 * Add thumb classes img
			 * @method addThumbClassesToImg
			 * @param {HTMLElement} img
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview
			 */
			function addThumbClassesToImg(img) {
				var parentNode = selectors.getClosestByTag(img.parentNode, "li");
				img.classList.add(classes.uiLiThumb);
				if (parentNode) {
					parentNode.classList.add(
						img.classList.contains(classes.uiLiIcon) ?
							classes.uiLiHasIcon :
							classes.uiLiHasThumb
					);
				}
			}

			/**
			 * Add thumb classes to first img of container
			 * @method addThumbClasses
			 * @param {HTMLElement} container
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview
			 */
			function addThumbClasses(container) {
				var img;
				img = selectors.getChildrenByTag(container, "img");
				if (img.length) {
					addThumbClassesToImg(img[0]);
				}
			}

			/**
			 * Add checkbox classes to first input of container
			 * @method addCheckboxRadioClasses
			 * @param {HTMLElement} container HTML LI element.
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview
			 */
			function addCheckboxRadioClasses(container) {
				var inputAttr = container.querySelector("input"),
					typeOfInput,
					contenerClassList = container.classList,
					disabled = false;

				if (inputAttr) {
					typeOfInput = inputAttr.getAttribute("type");
					disabled = inputAttr.hasAttribute("disabled");
					if (typeOfInput === "checkbox") {
						contenerClassList.add(classes.uiLiHasCheckbox);
						if (disabled) {
							contenerClassList.add(classes.uiLiHasCheckboxDisabled);
						}
					} else if (typeOfInput === "radio") {
						contenerClassList.add(classes.uiLiHasRadio);
						if (disabled) {
							contenerClassList.add(classes.uiLiHasRadioDisabled);
						}
					}
				}
			}

			/**
			 * Function add ui-li-heading class to all headings elemenets in list
			 * @method addHeadingClasses
			 * @param {HTMLElement} container HTML LI element.
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview
			 */
			function addHeadingClasses(container) {
				var headings = [].slice.call(container.querySelectorAll("h1, h2, h3, h4, h5, h6")),
					i = headings.length - 1;
				while (i >= 0) {
					headings[i].classList.add(classes.uiLiHeading);
					i--;
				}
			}

			/**
			 * Add right button classes to first button of container
			 * @method addRightBtnClasses
			 * @param {HTMLElement} container HTML LI element
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview
			 */
			function addRightBtnClasses(container) {
				var btnAttr = container.querySelector("[data-role='button'],input[type='button'],select[data-role='slider'],input[type='submit'],input[type='reset'],button");
				if (btnAttr) {
					if (DOM.getNSData(btnAttr, "style") === "circle") {
						container.classList.add(classes.uiLiHasRightCircleBtn);
					} else {
						container.classList.add(classes.uiLiHasRightBtn);
					}
				}
			}

			/**
			 * Build Listview widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype._build = function (element) {
				var elementClassList = element.classList;
				elementClassList.add(classes.uiListview);
				if (this.options.inset) {
					elementClassList.add(classes.uiListviewInset);
					elementClassList.add(classes.uiCornerAll);
					elementClassList.add(classes.uiShadow);
				}
				//@todo check if this is ol list

				this._refreshItems(element, true);
				return element;
			};

			/**
			 * Initialize Listview widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype._init = function (element) {
				var ui = this._ui,
					page = ui.page,
					popup = selectors.getClosestBySelector(element, "[data-role=popup]"),
					drawer = selectors.getClosestBySelector(element, "[data-role=drawer]"),
					elementType = element.tagName.toLowerCase();

				//for everything what is not a list based on ul set the following width
				if (!popup && elementType !== "ul" && !drawer) {
					element.style.width = window.innerWidth + "px";
				}

				if (!page) {
					page = selectors.getClosestByClass(element, Page.classes.uiPage);
					if (page) {
						this._ui.page = page;
					}
				}

				this._liElementOffsetTop = [];
				this._liElementOffsetHeight = [];
				this._dummyElement = document.createElement("div");
				this._liElements = element.getElementsByTagName("li");
				this._color = {
						hue: 0,
						saturation: 0,
						lightness: 0
				};
				this._scrollTop = 0;
				this._coloredListTop = 0;
				return element;
			};

			/**
			 * Make colored list widget
			 * @method _makecoloredList
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype._makeColoredList = function (element) {
				var self = this,
					page = selectors.getClosestByClass(element, Page.classes.uiPage),
					pageStyle = window.getComputedStyle(page),
					pageColor = pageStyle.getPropertyCSSValue("background-color").getRGBColorValue(),
					color = self._color,
					dummyElement = self._dummyElement,
					len,
					parentElement,
					i;

				// Init color
				pageColor = colorUtils.RGBToHSL([parseInt(pageColor.red.cssText, 10) / 255, parseInt(pageColor.green.cssText, 10) / 255, parseInt(pageColor.blue.cssText, 10) / 255]);
				color.hue = parseInt(pageColor[0], 10);
				color.saturation = parseInt(pageColor[1] * 100, 10);
				color.lightness = parseInt(pageColor[2] * 100, 10);

				len = self._liElements.length;
				for (i = 0; i < len; i++){
					self._liElementOffsetTop[i] = self._liElements[i].offsetTop;
					self._liElementOffsetHeight[i] = self._liElements[i].offsetHeight;
				}

				dummyElement.classList.add("ui-listview-dummy");
				parentElement = selectors.getClosestByClass(element, "ui-scrollview-clip");
				self._scrolledElement = parentElement;
				self._coloredListHandler = self._scrollHandler.bind(self); // This variable will be used when event handler remove.
				if (parentElement){
					// List in scrollview
					element.parentNode.insertBefore(dummyElement, element.parentNode.firstChild);
					parentElement.addEventListener("scroll", self._coloredListHandler);
					if (self._scrollTop) {
						// It was scrolled before that means listview element made before and don't need to init more.
						return;
					}


				} else {
					parentElement = element.parentNode;
					parentElement.appendChild(dummyElement);
					parentElement.addEventListener("scroll", self._coloredListHandler);

				}
				self._changeColoredPosition(0); // Init linear-gradient

				parentElement.style.backgroundColor = "transparent";

				dummyElement.style.width = element.offsetWidth + "px";
				dummyElement.style.height = parentElement.offsetHeight * 2 + "px";

			};

			Listview.prototype._scrollHandler = function (event) {
				var self = this,
					scrollTop = event.target.scrollTop,
					liElementOffsetTop = self._liElementOffsetTop,
					coloredListTop = self._coloredListTop,
					liElementOffsetHeight = self._liElementOffsetHeight;
				self._scrollTop = scrollTop;

				if (scrollTop > liElementOffsetTop[coloredListTop + 1]) {
					if (scrollTop > liElementOffsetTop[coloredListTop + 1] + liElementOffsetHeight[coloredListTop + 1]) {
						// scroll was moved by scrollTo.
						while(scrollTop > liElementOffsetTop[coloredListTop + 1] + liElementOffsetHeight[coloredListTop + 1]) {
							coloredListTop++;
						}
					}
					coloredListTop++;
				} else if (scrollTop < liElementOffsetTop[coloredListTop]) {
					if (scrollTop < liElementOffsetTop[coloredListTop - 1]) {
						// scroll was moved by scrollTo
						while(scrollTop < liElementOffsetTop[coloredListTop - 1]) {
							coloredListTop--;
						}
					}
					coloredListTop--;
				}

				self._coloredListTop = coloredListTop;
				if (scrollTop > liElementOffsetTop[coloredListTop]) {
					// move down
					self._changeColoredPosition(1);
				} else if (scrollTop > liElementOffsetTop[coloredListTop][1] && scrollTop < liElementOffsetTop[self._coloredListTop]) {
					self._changeColoredPosition(0);
				} else if (scrollTop === 0) {
					self._changeColoredPosition(0);
				}
			};

			Listview.prototype._changeColoredPosition = function (direction) {
				var self = this,
					listTopOffsetHeight = self._liElementOffsetHeight[self._coloredListTop],
					colorRatio = 4 / listTopOffsetHeight, // Each list has difference to lightness 4%
					hue = self._color.hue,
					saturation = self._color.saturation,
					lightness = self._color.lightness,
					top = self._coloredListTop,
					liElementOffsetTop = self._liElementOffsetTop,
					scrollTop = self._scrollTop,
					diffLightness = self.options.diffLightness,
					changedRed = 0,
					changedGreen = 0,
					changedBlue = 0,
					changedInterval = liElementOffsetTop[top] - scrollTop,
					adjustedColorValue = 0,
					adjustedTopValue = 0,
					changedColor = 0,
					validTop = top,
					liElementsLength = liElementOffsetTop.length - 1,
					validLength,
					colorHsl,
					nextColorHsl,
					validLightness,
					gradientValue,
					gradient;

				self._dummyElement.style.top = scrollTop + "px";
				if (!direction) {
					// move up
					colorRatio = -colorRatio; // redRatio = -4 / listTopOffsetHeight
				}

				if (self._liElements[top].classList.contains("ui-li-divider")) {
					validTop = top + 1;
				} else {
					changedColor = colorRatio * -changedInterval;
				}

				validLength = validTop + self.options.coloredListNumber;
				for (top = validTop; top < validLength && top < liElementsLength ; top++) {
					adjustedColorValue = top - validTop;
					adjustedTopValue = liElementOffsetTop[top + 1] - scrollTop + 2; // Number 2 makes boundary between each element located more correctly.
					validLightness = lightness - (diffLightness * adjustedColorValue) + changedColor;
					colorHsl = "hsl( " + hue + ", " + saturation + "%, " + validLightness + "%)";
					nextColorHsl = "hsl( " + hue + ", " + saturation + "%, " + (validLightness - diffLightness) + "%)";
					if (adjustedColorValue === 0) {
						// First gradient value
						gradientValue = colorHsl + " " + (liElementOffsetTop[validTop] - scrollTop + 2) + "px";
					}
					gradientValue += ", " + colorHsl + " " + adjustedTopValue + "px";
					gradientValue += ", "  + nextColorHsl + " " + adjustedTopValue + "px";

				}

				gradientValue += ", "  + nextColorHsl + " " + (adjustedTopValue + self._liElementOffsetHeight[top]) + "px";
				gradient = "-webkit-linear-gradient(top," + gradientValue + ")";
				self._dummyElement.style["background"] = gradient;
			};

			Listview.prototype._destroyColoredList = function (element) {
				var self = this;
				if (self._dummyElement.parentNode){
					self._dummyElement.remove();
				}
				if (self._scrolledElement) {
					self._scrolledElement.removeEventListener("scroll",self._coloredListHandler);
				}
			};
			/**
			 * Change Checkbox/Radio state when list clicked
			 * @method _clickCheckboxRadio
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype._clickCheckboxRadio = function (element) {
				var checkboxRadio = slice.call(element.querySelectorAll(".ui-checkbox, .ui-radio, .ui-slider-switch-input")),
					i = checkboxRadio.length,
					input;

				while (--i >= 0) {
					input = checkboxRadio[i];
					input.checked = (input.type === "checkbox") ? !input.checked : true;
				}
			};

			/**
			 * Registers widget's event listeners
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype._bindEvents = function (element) {
				var self = this,
					page = selectors.getClosestByClass(element, Page.classes.uiPage);

				element.addEventListener("vclick", function (event) {
					var target = event.target;

					if (target.classList.contains(classes.uiLiHasCheckbox) ||
						target.classList.contains(classes.uiLiHasRadio) ||
						target.classList.contains(classes.uiLiHasRightBtn)) {
						self._clickCheckboxRadio(target);
					} else if (target.type === "checkbox" || target.type === "radio") {
						event.stopPropagation();
						event.preventDefault();
					}
				}, false);

				if (self.options.type !== "colored") {
					element.classList.add("ui-listview-default");
				} else {
					if (!element.classList.contains(classes.uiListviewColored)) {
						element.classList.add(classes.uiListviewColored);
					}
					eventUtils.on(page, "pageshow updatelayout", self._makeColoredList.bind(this, element));
					page.addEventListener("pagebeforehide", self._destroyColoredList.bind(this, element));
				}

			};

			/**
			 * Removes corners from one LI element
			 * @method removeCorners
			 * @param {HTMLElement} element HTML LI element
			 * @param {string} which which corners will be removed
			 * @static
			 * @private
			 * @member ns.widget.mobile.Listview
			 */
			function removeCorners(element, which) {
				var elementClassList = element.classList;
				switch (which) {
					case "top":
						elementClassList.remove(classes.uiCornerTop);
						elementClassList.remove(classes.uiCornerTr);
						elementClassList.remove(classes.uiCornerTl);
						break;
					case "bottom":
						elementClassList.remove(classes.uiCornerBottom);
						elementClassList.remove(classes.uiCornerBr);
						elementClassList.remove(classes.uiCornerBl);
						break;
				}
			}

			/**
			 * Removes corners
			 * @method _removeCorners
			 * @param {HTMLElement} li HTML LI element
			 * @param {string} which which corners will be removed
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype._removeCorners = function (li, which) {
				var additionlElements = slice.call(li.querySelectorAll(
					"." + buttonClasses.uiBtnInner + ", " +
						"." + classes.uiLiLinkAlt + ", " +
						"." + classes.uiLiThumb
				));

				if (which === "top" || which !== "bottom") {
					removeCorners(li, "top");
					additionlElements.forEach(function (item) {
						removeCorners(item, "top");
					});
				}
				if (which === "bottom" || which !== "top") {
					removeCorners(li, "bottom");
					additionlElements.forEach(function (item) {
						removeCorners(item, "bottom");
					});
				}
			};

			/**
			 * Adding top corners for list item
			 * @param {HTMLElement} item
			 * @member ns.widget.mobile.Listview
			 * @private
			 * @static
			 */
			function addTopCorners(item) {
				item.classList.add(classes.uiCornerTop);
				slice.call(item.querySelectorAll("." + buttonClasses.uiBtnInner + ":not(." + classes.uiLiLinkAlt + ")")).forEach(function (subitem) {
					subitem.classList.add(classes.uiCornerTop);
				});
				slice.call(item.querySelectorAll("." + buttonClasses.uiBtnInner + ":not(:first-child)")).forEach(function (subitem) {
					subitem.classList.add(classes.uiCornerTop);
				});
				slice.call(item.querySelectorAll("." + classes.uiLiLinkAlt + ", ." + classes.uiLiLinkAlt + " span:first-child")).forEach(function (subitem) {
					subitem.classList.add(classes.uiCornerTr);
				});
				slice.call(item.querySelectorAll("." + classes.uiLiThumb + ":not(." + classes.uiLiIcon + ")")).forEach(function (subitem) {
					subitem.classList.add(classes.uiCornerTl);
				});
			}

			/**
			 * Adding bottom corners for list item
			 * @param {HTMLElement} item
			 * @member ns.widget.mobile.Listview
			 * @private
			 * @static
			 */
			function addBottomCorners(item) {
				var itemClassList = item.classList;
				itemClassList.add(classes.uiCornerBottom);
				itemClassList.add(classes.uiLiLast);
				slice.call(item.querySelectorAll("." + classes.uiLiThumb)).forEach(function (subitem) {
					subitem.classList.add(classes.uiCornerBr);
				});
				slice.call(item.querySelectorAll("." + classes.uiLiThumb + ":not(." + classes.uiLiIcon + ")")).forEach(function (subitem) {
					subitem.classList.add(classes.uiCornerBl);
				});
			}

			/**
			 * Refresh corners
			 * @method _refreshCorners
			 * @param {HTMLElement} ul HTML UL element
			 * @param {boolean} create if set "true" then the "updatelayout" event will be triggered
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype._refreshCorners = function (ul, create) {
				var self = this,
					items = selectors.getChildrenByTag(ul, "li"),
					last;

				if (items.length) {
					// clean previous corners
					items.forEach(function (item) {
						// ui-li-last is used for setting border-bottom on the last li
						item.classList.remove(classes.uiLiLast);
						self._removeCorners(item);
					});

					// filter element which occupied place on the view
					items = items.filter(DOM.isOccupiedPlace);

					if (items.length) {
						last = items.length - 1;
						if (self.options.inset) {
							addTopCorners(items[0]);
							addBottomCorners(items[last]);
						} else {
							items[last].classList.add(classes.uiLiLast);
						}
					}
				}
				if (!create) {
					eventUtils.trigger(ul, "updatelayout");
				}
			};

			/**
			 * Adds checkboxradio, thumb and right button classes
			 * if it is essential.
			 * @method addItemClasses
			 * @param {HTMLElement} item Element to add classes to
			 * @static
			 * @private
			 * @member ns.widget.mobile.Listview
			 */
			function addItemClasses(item) {
				addCheckboxRadioClasses(item);
				addThumbClasses(item);
				addRightBtnClasses(item);
			}

			/**
			 * Refreshes item elements with "a" tag
			 * @method refreshLinks
			 * @param {HTMLElement} element HTML LI element
			 * @static
			 * @private
			 * @member ns.widget.mobile.Listview
			 */
			function refreshLinks(item) {
				var links = selectors.getChildrenByTag(item, "a"),
					itemClassList = item.classList;
				if (links.length) {
					addItemClasses(links[0]);
					itemClassList.add(classes.uiLiAnchor);
				} else {
					itemClassList.add(classes.uiLiStatic);
					item.setAttribute("tabindex", "0");
				}
			}

			/**
			 * Refreshes single item of a list
			 * @method refreshItem
			 * @param {HTMLElement} element HTML LI element
			 * @param {boolean} create True if item is forced to be created
			 * @param {string} dividerTheme List divider theme
			 * @static
			 * @private
			 * @member ns.widget.mobile.Listview
			 */
			function refreshItem(item, create, dividerTheme) {
				var itemClassList = item.classList;

				if (create || (!itemClassList.contains(classes.uiLi) && DOM.isOccupiedPlace(item))) {
					itemClassList.add(classes.uiLi);

					if (item.querySelector("." + classes.uiLiCount)) {
						itemClassList.add(classes.uiLiHasCount);
					}

					if (item.hasAttribute("tabindex") === false) {
						item.setAttribute("tabindex", 0);
					}

					if (selectors.matchesSelector(item, engine.getWidgetDefinition("ListDivider").selector)) {
						engine.instanceWidget(item, "ListDivider", {theme: dividerTheme});
					} else {
						refreshLinks(item);
						addHeadingClasses(item);
					}
				}
				addItemClasses(item);
			}

			/**
			 * Refreshes list images
			 * @method refreshImages
			 * @param {HTMLElement} ul HTML UL element
			 * @static
			 * @private
			 * @member ns.widget.mobile.Listview
			 */
			function refreshImages(ul) {
				var imgs = ul.querySelectorAll("." + classes.uiLinkInherit + " > img:first-child"),
					i,
					length = imgs.length;

				for (i = 0; i < length; i++) {
					addThumbClassesToImg(imgs[i]);
				}
			}

			/**
			 * Refreshes items of list
			 * @method _refreshItems
			 * @param {HTMLElement} ul HTML UL element
			 * @param {boolean} create
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype._refreshItems = function (ul, create) {
				var self = this,
					items,
					options = self.options,
					theme,
					dividerTheme;

				eventUtils.trigger(ul, "beforerefreshitems");

				items = selectors.getChildrenByTag(ul, "li");
				theme = DOM.getNSData(ul, "theme") || options.theme || "s";
				dividerTheme = DOM.getNSData(ul, "divider-theme") || options.dividerTheme || theme;

				items.forEach(function (item) {
					refreshItem(item, create, dividerTheme);
				}, self);

				refreshImages(ul);

				self._refreshCorners(ul, create);
			};

			/**
			 * Refresh Listview widget
			 * @method refresh
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype.refresh = function () {
				this._refreshItems(this.element, false);
				eventUtils.trigger(this.element, this.name.toLowerCase() + "afterrefresh");
			};

			/**
			 * Adds item to widget and refreshes layout.
			 * @method addItem
			 * @param {HTMLElement} listItem new LI item
			 * @param {number} position position on list
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype.addItem = function (listItem, position) {
				var element = this.element,
					childNodes = element.getElementsByTagName("li"),
					tempDiv = document.createElement("div"),
					liItem,
					liButtons,
					i;

				tempDiv.innerHTML = listItem;
				liItem = tempDiv.firstChild;
				liButtons = liItem.querySelectorAll("[data-role='button']");

				if (position) {
					element.insertBefore(liItem, childNodes[position]);
				} else {
					element.appendChild(liItem);
				}

				for (i = 0; i < liButtons.length; i++) {
					engine.instanceWidget(liButtons[i], "Button");
				}

				this.refresh();
			};

			/**
			 * Removes item from widget and refreshes layout.
			 * @method removeItem
			 * @param {number} position position on list
			 * @member ns.widget.mobile.Listview
			 */
			Listview.prototype.removeItem = function (position) {
				var element = this.element,
					childNodes = element.getElementsByTagName("li");

				element.removeChild(childNodes[position]);
				this.refresh();
			};

			ns.widget.mobile.Listview = Listview;
			engine.defineWidget(
				"Listview",
				"ul[data-role='listview'], ul.ui-listview, ol[data-role='listview'], ol.ui-listview",
				["addItem", "removeItem"],
				Listview,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
