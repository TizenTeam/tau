/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * # Pages
 *
 * Page is a one screen view of application and is the base part of application
 * layout. There is background and on top of it - page in which one puts
 * content.
 *
 * ## Different sizes
 *
 * There are various types of pages available:
 *
 * <table>
 * 	<caption>Table: Page Types</caption>
 * 	<tbody>
 * 		<tr>
 * 			<th style="width:10%;">Type</th>
 * 			<th>Descriptor class</th>
 * 			<th>Description</th>
 * 		</tr>
 * 		<tr>
 * 			<td>Normal</td>
 * 			<td>No additional class needed</td>
 * 			<td><p>Standard page covering about 90% of the screen width.</p></td>
 * 		</tr>
 * 		<tr>
 * 			<td>Mini</td>
 * 			<td><span style="font-family: Courier New,Courier,monospace">ui-page-mini</span></td>
 * 			<td><p>Centered page covering about 50% of the screen width.</p></td>
 * 		</tr>
 * 		<tr>
 * 			<td>Micro</td>
 * 			<td><span style="font-family: Courier New,Courier,monospace">ui-page-micro</span></td>
 * 			<td><p>Centered page covering about 25% of the screen width.</p></td>
 * 		</tr>
 * 			<td>Micro - left</td>
 * 			<td><span style="font-family: Courier New,Courier,monospace">ui-page-micro-left</span></td>
 * 			<td><p>Left aligned page covering about 25% of the screen width.</p></td>
 * 		</tr>
 * 			<td>Micro - right</td>
 * 			<td><span style="font-family: Courier New,Courier,monospace">ui-page-micro-right</span></td>
 * 			<td><p>Right aligned page covering about 25% of the screen width.</p></td>
 * 		</tr>
 * 		<tr>
 * 			<td>Full Screen</td>
 * 			<td><span style="font-family: Courier New,Courier,monospace">ui-page-fullscreen</span></td>
 * 			<td><p>Page will be shown covering full screen. No scrren background will be visible.</p></td>
 * 		</tr>
 * 	</tbody>
 * </table>
 *
 * ## Backgrounds
 *
 * The application background will be used "behind" the page. On the other hand
 * if some special background is needed for the page one should consider
 * overriding stylesheet for 'ui-page' class by adding custom style class.
 *
 * ## Headers and footers
 *
 * Every page can contain header and footer space. Usually some text and/or
 * buttons are placed there.
 *
 * ### Header
 *
 * You add "header" tag with text and/or multiple buttons. By default text is
 * adjusted to the left and button to the right.
 *
 * 	@example
 * 	<div class="ui-page">
 * 		<header>
 * 			<a href="#" class="ui-btn">btn 1</a>
 * 			<a href="#" class="ui-btn">btn 2</a>
 * 			<h2 class="ui-title">Pages types</h2>
 * 		</header>
 * 	</div>
 *
 * ### Footer
 *
 * To add footer just inser "footer" tag with content. The following example
 * provides additional div to wrap the buttons.
 *
 * 	@example
 * 	<div class="ui-page">
 * 		<footer>
 * 			<div class="ui-controlgroup" data-type="horizontal">
 * 				<a href="#" class="ui-btn">Yes</a>
 * 				<a href="#" class="ui-btn">No</a>
 * 				<a href="#" class="ui-btn">Maybe</a>
 * 			</div>
 * 		</footer>
 * 	</div>
 *
 * ## Two columns layout
 *
 * One can use two columns in one page simply - by placing in page content
 * divs with classes: "ui-column-left" - for left column and "ui-column-right" -
 * for right column.
 *
 * 	@example
 * 	<div id="TwoColumnPage" class="ui-page">
 * 		<header></header>
 * 		<div class="ui-content">
 * 			<div class="ui-column-left">Left column content</div>
 * 			<div class="ui-column-right">Right column content</div>
 * 		</div>
 * 		<footer></footer>
 * 	</div>
 *
 * ## Multipage layout
 *
 * You can implement multiple pages in the page container.
 *
 * Main page should be defined with 'ui-page-active' class, If no such page is
 * provided, framework will automatically assign it to the first page defined
 * in source code. This operation is resource-consuming thus produces delay
 * in page rendering.
 *
 * 	@example
 * 	<!--Main page-->
 * 	<div id="one" class="ui-page ui-page-active">
 * 		<header></header>
 * 		<div class="ui-content"></div>
 * 		<footer></footer>
 * 	</div>
 *
 * 	<!--Secondary page-->
 * 	<div id="two" class="ui-page">
 * 		<header></header>
 * 		<div class="ui-content"></div>
 * 		<footer></footer>
 * 	</div>
 *
 * To find currently active page, look for ui-page-active class.
 *
 * ## Navigation between pages
 *
 * To show one of the other pages - use 'a'a tag in the same manner as using
 * anchors.
 *
 * 	@example
 * 	<!--Main page-->
 * 	<div id="one" class="ui-page ui-page-active">
 * 		<header></header>
 * 		<div class="ui-content">
 * 			<a href="#two" class="ui-btn">Second Page</a>
 * 		</div>
 * 		<footer></footer>
 * 	</div>
 *
 * 	<!--Secondary page-->
 * 	<div id="two" class="ui-page">
 * 		<header></header>
 * 		<div class="ui-content">
 * 			<a href="#one" class="ui-btn">First Page</a>
 * 		</div>
 * 		<footer></footer>
 * 	</div>
 *
 * @page ns.page.designPage
 * @seeMore introduction.htm Design guide
 */
