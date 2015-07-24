/*global window, define*/
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
 * #Multi-page Layout
 *
 * You can implement a template containing multiple page containers in the application index.html file.
 *
 * In the multi-page layout, we can define multi pages with data-role="page" attribute.
 *
 * You can link to internal pages by referring to the ID of the page. For example, to link to the page with an ID of two, the link element needs the href="#two" attribute in the code, as in the following example.
 *
 * 		@example
 * 		<div data-role="page" id="main">
 *			<div data-role="header" data-position="fixed">
 *				<!--Header-->
 *			</div>
 *			<div data-role="content">
 *				<a href="#two"data-role="button">TWO</a>
 *			</div>
 *		</div>
 *		<div data-role="page" id="two">
 *			<div data-role="header" data-position="fixed">
 *				<!--Header-->
 *			</div>
 *			<div data-role="content">
 *				<!--Content-->
 *			</div>
 *		</div>
 *
 * To find the currently active page, use the ui-page-active class.
 *
 * @page ns.page.multipage
 * @seeMore layout.htm Application Page Layout
 */
