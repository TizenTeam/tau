/*global window, define */
/*jslint nomen: true, plusplus: true */

/* Added to classes:
 *   + ui-tokentextarea display flex
 *   + ui-tokentextarea-input added flex
 *   + ui-tokentextarea-span-block added flex
 *   + ui-tokentextarea-desclabel added padding
 *
 * Delete from class:
 *   + ui-tokentextarea-link-base deleted position
 *
 * Changed classes:
 *   + ui-tokentextarea div to ui-tokentextarea-span-block
 * Added class for hiddeing element:
 *   + span.ui-tokentextarea-invisible
 *
 * All was made for better responsivity and locations tokens.
 *
 */

/**
 * #Tokentextarea widget
 *
 *
 *  ##Manual constuctor
 * ###For manual creation of progressbar widget you can use constructor of widget:
 *
 *	@example
 *	var tokentextarea = ns.engine.instanceWidget(document.getElementById('foo'), 'Tokentextarea');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	var tokentextarea = $('#foo').tokentextarea();
 *
 * ##HTML Examples
 * ###Create simple Tokentextarea from div using data-role:
 *
 *	@example
 *	<div data-role="tokentextarea"></div>
 *
 * ###HTML attributes
 * ####data-link
 * Represents the id of the page or the URL of other HTML file.
 * The page contains data for the user, for example, an address book.
 * If the value is null, anchor button doesn't work. (Default : null)
 *
 *	@example
 *	<div data-role="tokentextarea" data-link="bar.html"></div>
 *
 * ####data-label
 * Provide a label for a user-guide. (Default : 'To : ')
 *
 *	@example
 *	<div data-role="tokentextarea" data-label="Send to: "></div>
 *
 * ####data-description
 * This attribute is managing message format.
 * This message is displayed when widget status was changed to 'focusout'. (Default : '+ {0}')
 *
 *	@example
 *	<div data-role="tokentextarea" data-description="bar + {0}"></div>
 *
 *
 *
 * ###Javascript API
 * ####inputText ( [string ] )
 * If artument is not exist, will get a string from inputbox.
 * If argument is exist, will set a string in inputbox.
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).inputText("bar");
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").inputText("bar");
 *
 * ####select ( [number] )
 * If argument is not exist, will get a string from the selected block, if any block isn't selected, will get 'null' value.
 * If argument is exist, will select the block which is matched with the argument.
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).select(1);
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").select(1);
 *
 * ####add ( text, [number] )
 * If secound argument is not exsit, will insert to a new block at last position.
 * If secound arbument is exist, will insert to a new block at indexed position.
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).add("bar", 2);
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").add("bar", 2);
 *
 * ####remove ( [number] )
 * If argument is not exist, will delete all blocks.
 * If argument is exist, will delete block at indexed position.
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).remove(1);
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").remove(1);
 *
 * ####length ( void )
 * Get a number of widget.
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).length;
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").length();
 *
 * ####focusIn ( void )
 * This method change status to 'focus in'.
 * This status is able to manege a widget.
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).focusIn();
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").focusIn();
 *
 * ####focusOut ( void )
 * This method change status to 'focus out'.
 * This status is unable to menage a widget.
 * All block that contained id the widget are hidden and summarized message is displayed
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).focusOut();
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").focusOut();
 *
 * ####destroy ( void )
 * Remove all of the DOM elements for the widget.
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).destroy();
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").destroy();
 *
 *
 * @author Kamil Stepczuk <k.stepczuk@samsung.com>
 * @class ns.widget.Tokentextarea
 * @extends ns.widget.BaseWidget
 */

(function (window, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../mobile",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			* @property {Object} BaseWidget alias variable
			* @private
			* @static
			*/
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,

				/**
				* @property {ns.engine} engine alias variable
				* @private
				* @static
				*/
				engine = ns.engine,

				/**
				* Local constructor function
				* @method Tokentextarea
				* @private
				* @member ns.widget.Tokentextarea
				*/
				Tokentextarea = function () {
					/**
					*
					* @property {boolean} [_focusStatus=true]
					* @private
					* @member ns.widget.Tokentextarea
					*/
					this._focusStatus = true;
					/**
					*
					* @property {Object} options Tokentextarea widget options
					* @property {string} [options.label='To : ']
					* @property {string} [link='']
					* @property {string} [description='+ {0}']
					* @member ns.widget.Tokentextarea
					*/
					this.options = {
						label: "To : ",
						link: "",
						description: "+ {0}"
					};
					/**
					*
					* @property {Function|null} [inputKeyUp=null]
					* @private
					* @member ns.widget.Tokentextarea
					*/
					this.inputKeyUp = null;
				};

			Tokentextarea.prototype = new BaseWidget();

			/**
			* @property {Object} classes object containing commonly used wiget classes
			* @static
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.classes = {
				uiTokentextarea: "ui-tokentextarea",
				uiTokentextareaLabel: "ui-tokentextarea-label",
				uiTokentextareaInput: "ui-tokentextarea-input",
				uiTokentextareaInputVisible: "ui-tokentextarea-input-visible",
				uiTokentextareaInputInvisible: "ui-tokentextarea-input-invisible",
				uiinputText: "ui-input-text",
				uiBodyS: "ui-body-s",
				uiTokentextareaLinkBase: "ui-tokentextarea-link-base",
				uiBtnBoxS: "ui-btn-box-s",
				uiTokentextareaSblock: "ui-tokentextarea-sblock",
				uiTokentextareaBlock: "ui-tokentextarea-block",
				uiTokentextareaFocusout: "ui-tokentextarea-focusout",
				uiTokentextareaFocusin: "ui-tokentextarea-focusin",
				uiTokentextareaSpanBlock: "ui-tokentextarea-span-block",
				uiTokentextareaInputArea: "ui-tokentextarea-input-area",
				uiTokentextareaDesclabel: "ui-tokentextarea-desclabel",
				uiTokentextareaInvisible: "ui-tokentextarea-invisible"
			};

			/**
			* @property {Object} strings object containing commonly used wiget strings
			* @static
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.strings = {
				doubleTapToEdit: "double tap to edit",
				moreDoubleTapToEdit: "more, double tap to edit",
				addRecipient: "Add recipient"
			};

			/**
			* Function for select block
			* @param {HTMLElement} block
			* @private
			*/
			function _selectBlock(block) {
				var classes = Tokentextarea.classes,
					blockClasses = block.classList;
				blockClasses.add(classes.uiTokentextareaSblock);
				blockClasses.remove(classes.uiTokentextareaBlock);
			}

			/**
			* Function for unselect block
			* @param {HTMLElement} block
			* @private
			*/
			function _unselectBlock(block) {
				var classes = Tokentextarea.classes,
					blockClasses = block.classList;
				blockClasses.remove(classes.uiTokentextareaSblock);
				blockClasses.add(classes.uiTokentextareaBlock);
			}

			/**
			* Function set max width for block element
			* Function will be deleted when 'overflow: hidden' and 'text-overflow: ellipsis' will work with percent value max width.
			* @param {HTMLElement} element
			* @private
			*/
			function _setMaxSizeBlock(element) {
				var parent = element.parentNode,
					maxWidth;
				maxWidth = parent.offsetWidth / 2;
				element.style.maxWidth = maxWidth + "px";
			}

			/**
			* Function remove text block form widget
			* @param {HTMLElement} element
			* @param {number} blockIndex
			* @private
			*/
			function _removeTextBlock(element, blockIndex) {
				var classes = Tokentextarea.classes,
					blockParent,
					block,
					blockLength,
					i;
				if (arguments.length === 1) {
					element.parentNode.removeChild(element);
				} else {
					block = element.getElementsByClassName(classes.uiTokentextareaSpanBlock);
					blockLength = block.length;
					if (blockLength === 0) {
						return;
					}
					blockParent = block[0].parentNode;
					if (blockIndex !== null && blockIndex < blockLength) {
						blockParent.removeChild(block[blockIndex]);
					} else {
						for (i = blockLength - 1; i >= 0; i--) {
							blockParent.removeChild(block[i]);
						}
					}
				}
			}

			/**
			* Handler function for click to block
			* @private
			*/
			function blockClick(event) {
				var element = event.target,
					classes = Tokentextarea.classes,
					parent = element.parentNode,
					widget = ns.engine.instanceWidget(parent),
					lockBlock;

				if (widget._focusStatus) {
					if (element.classList.contains(classes.uiTokentextareaSblock)) {
						_removeTextBlock(element);
					} else {
						lockBlock = parent.getElementsByClassName(classes.uiTokentextareaSblock)[0];
						if (lockBlock !== undefined) {
							_unselectBlock(lockBlock);
						}
						_selectBlock(element);
					}
				} else {
					widget.focusIn();
				}
			}

			/**
			* Function bind event vclick for block
			* @param {HTMLElement} block
			* @private
			*/
			function _bindBlockEvents(block) {
				block.addEventListener("vclick", blockClick, false);
			}

			/**
			* Function add block into widget
			* @param {HTMLElement} element
			* @param {string} messages
			* @param {number} blockIndex
			* @private
			*/
			function _addTextBlock(element, messages, blockIndex) {
				var classes = Tokentextarea.classes,
					strings = Tokentextarea.strings,
					textBlock,
					textBlockClasses,
					input,
					blocks;

				blocks = element.getElementsByClassName(classes.uiTokentextareaSpanBlock);
				textBlock = document.createElement("div");
				textBlock.textContent = messages;
				textBlockClasses = textBlock.classList;
				textBlockClasses.add(classes.uiTokentextareaBlock);
				textBlockClasses.add(classes.uiTokentextareaSpanBlock);
				textBlock.setAttribute("aria-label", strings.doubleTapToEdit);
				textBlock.tabIndex = 0;
				if (blockIndex !== null && blockIndex < blocks.length) {
					element.insertBefore(textBlock, blocks[blockIndex]);
				} else {
					input = element.childNodes[element.childNodes.length - 1];
					element.insertBefore(textBlock, input);
				}
				window.addEventListener("pageshow", _setMaxSizeBlock.bind(null, textBlock), false);
				_setMaxSizeBlock(textBlock);
				_bindBlockEvents(textBlock);
			}

			/**
			* Function validate last block
			* @param {HTMLElement} container
			* @private
			*/
			function _validateTargetBlock(container) {
				var classes = Tokentextarea.classes,
					block,
					lastBlock,
					lastBlockClasses;


				block = container.getElementsByClassName(classes.uiTokentextareaSpanBlock);
				lastBlock = block[block.length - 1];
				lastBlockClasses  = lastBlock.classList;

				if (lastBlockClasses.contains(classes.uiTokentextareaSblock)) {
					_removeTextBlock(lastBlock);
				} else {
					_selectBlock(lastBlock);
				}
			}

			/**
			* Function unselect block in widget
			* @param {HTMLElement} element
			* @private
			*/
			function _unlockTextBlock(element) {
				var classes = Tokentextarea.classes,
					selectedBlock = element.getElementsByClassName(classes.uiTokentextareaSblock)[0];
				if (selectedBlock !== undefined) {
					_unselectBlock(selectedBlock);
				}
			}

			/**
			 * Handler function for event kayUp
			 * @param {HTMLElement} element
			 * @param {Event} event
			 * @private
			 */
			function inputKeyUp (element, event) {
				var keyValue = event.keyCode,
					input = element.getElementsByTagName("input")[0],
					inputValue = input.value,
					messages = [],
					messagesLength,
					i;

				/*
				* 8 = backspace
				* 13 = enter
				* 186 = semi-colon
				* 188 = comma
				*/

				if (keyValue === 8) {
					if (inputValue.length === 0) {
						_validateTargetBlock(element);
					}
				} else if (keyValue === 13 || keyValue === 186 || keyValue === 188) {
					if (inputValue.length !== 0) {
						messages = inputValue.split(/[,;]/);
						messagesLength = messages.length;
						for (i = 0; i < messagesLength; i++) {
							messages[i] = messages[i].trim();
							if (messages[i].length !== 0) {
								_addTextBlock(element, messages[i]);
							}
						}
					}
					input.value = "";
				} else {
					_unlockTextBlock(element);
				}
			}

			/**
			* Build widget structure
			* @method _build
			* @protected
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype._build = function (element) {
				var classes = Tokentextarea.classes,
					strings = Tokentextarea.strings,
					option = this.options,
					moreBlockClasses,
					inputBox,
					inputBoxClasses,
					inputArea,
					labelTag,
					moreBlock;

				inputBox = document.createElement("input");
				labelTag = document.createElement("span");
				moreBlock = document.createElement("a");
				inputArea = document.createElement("div");

				inputBoxClasses = inputBox.classList;

				inputArea.classList.add(classes.uiTokentextareaInputArea);
				element.classList.add(classes.uiTokentextarea);

				inputBox.style.minWidth = 3 + "rem";
				inputBox.style.width    = 100 +"%";

				labelTag.textContent = option.label;
				labelTag.classList.add(classes.uiTokentextareaLabel);
				labelTag.tabIndex = 0;
				element.appendChild(labelTag);


				inputBoxClasses.add(classes.uiTokentextareaInput);
				inputBoxClasses.add(classes.uiTokentextareaInputVisible);
				inputBoxClasses.add(classes.uiinputText);
				inputBoxClasses.add(classes.uiBodyS);

				inputBox.setAttribute("role", "textbox");
				inputArea.appendChild(inputBox);
				engine.instanceWidget(moreBlock, "Button", {
					inline: true,
					icon: "plus",
					style: "circle"
				});

				moreBlockClasses = moreBlock.classList;

				moreBlock.href = option.link;
				moreBlock.tabIndex = 0;
				moreBlockClasses.add(classes.uiTokentextareaLinkBase);
				moreBlockClasses.add(classes.uiBtnBoxS);
				moreBlock.firstChild.firstChild.textContent = strings.addRecipient;
				inputArea.appendChild(moreBlock);
				element.appendChild(inputArea);
				return element;
			};

			/**
			* Function add block
			* @method add
			* @param {string} messages
			* @param {number} blockIndex
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype.add = function (messages, blockIndex) {
				var focusStatus = this._focusStatus,
					element = this.element;
				if (focusStatus) {
					_addTextBlock(element, messages, blockIndex);
				}
			};

			/**
			* Function delete element; delete all elements with out parameter
			* @method remove
			* @param {number} blockIndex
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype.remove = function (blockIndex) {
				var focusStatus = this._focusStatus,
					element = this.element;
				if (focusStatus) {
					_removeTextBlock(element, blockIndex);
				}
			};

			/**
			* Function return blocks count
			* @method length
			* @return {number}
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype.length = function () {
				var element = this.element,
					classes = Tokentextarea.classes;
				return element.getElementsByClassName(classes.uiTokentextareaSpanBlock).length;
			};

			/**
			* Function return input text with out parameter.
			* Function with parameter set input text value.
			* @param {string} text
			* @return {string}
			*/
			Tokentextarea.prototype.inputText = function (text) {
				var element = this.element,
					input = element.getElementsByTagName("input")[0];

				if (text !== undefined) {
					input.value = text;
				}
				return input.value;
			};

			/**
			* Function select element; return selected element with out parameter
			* @method select
			* @param {number} blockIndex
			* @return {?string}
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype.select = function (blockIndex) {
				var focusStatus = this._focusStatus,
					element = this.element,
					classes = Tokentextarea.classes,
					block,
					sBlock;

				if (focusStatus) {
					block = element.getElementsByClassName(classes.uiTokentextareaSpanBlock);
					sBlock = element.getElementsByClassName(classes.uiTokentextareaSblock);

					if (blockIndex !== undefined && blockIndex < block.length) {
						if (sBlock.length === 1) {
							_unselectBlock(sBlock[0]);
						}
						_selectBlock(block[blockIndex]);
					} else if (block.length !== 0) {
						if (sBlock[0]) {
							return sBlock[0].textContent;
						}
					}
				}
				return null;
			};

			/**
			* Function ungroup elements and set focus to input
			* @method focusIn
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype.focusIn = function () {
				var element = this.element,
					classes = Tokentextarea.classes,
					elementClasses,
					label,
					sBlock,
					sBlockClasses,
					input,
					inputClasses,
					button,
					hiddenBlocksCount,
					hiddenBlocks,
					hiddenBlocksLength,
					i;

				if (this._focusStatus) {
					return;
				}

				label = element.getElementsByClassName(classes.uiTokentextareaLabel)[0];
				hiddenBlocksCount = element.getElementsByClassName(classes.uiTokentextareaDesclabel)[0];
				if (hiddenBlocksCount) {
					element.removeChild(hiddenBlocksCount);
					hiddenBlocks = element.getElementsByClassName(classes.uiTokentextareaInvisible);
					hiddenBlocksLength = hiddenBlocks.length;
					for (i = hiddenBlocksLength - 1; i >= 0; i--) {
						hiddenBlocks[i].classList.remove(classes.uiTokentextareaInvisible);
					}
				}

				input = element.getElementsByTagName("input")[0];
				inputClasses = input.classList;
				button = element.getElementsByTagName("a")[0];
				elementClasses = element.classList;

				label.tabIndex = 0;
				label.style.display = "";


				sBlock = element.getElementsByClassName(classes.uiTokentextareaSblock)[0];
				if (sBlock !== undefined) {
					sBlockClasses = sBlock.classList;
					sBlockClasses.remove(classes.uiTokentextareaSblock);
					sBlockClasses.add(classes.uiTokentextareaBlock);
				}
				inputClasses.remove(classes.uiTokentextareaInputInvisible);
				inputClasses.add(classes.uiTokentextareaInputVisible);
				input.tabIndex = 0;
				button.tabIndex = 0;
				button.style.display = "";

				// change focus state.
				this._focusStatus = true;
				elementClasses.remove(classes.uiTokentextareaFocusout);
				elementClasses.add(classes.uiTokentextareaFocusin);
				element.removeAttribute("tabindex");
				input.focus();
			};

			/**
			* function get width of element with margins
			* @param {HTMLElement} element
			* @return {number}
			* @private
			*/
			function _getElementWidth(element) {
				var elementView;
				elementView =  document.defaultView.getComputedStyle(element);
				return parseInt(elementView.getPropertyValue("margin-left"), 10) +
					parseInt(elementView.getPropertyValue("margin-right"), 10) +
					element.offsetWidth;
			}

			/**
			* Function group elements and hide input
			* @method focusOut
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype.focusOut = function () {
				var element = this.element,
					classes = Tokentextarea.classes,
					strings = Tokentextarea.strings,
					description = this.options.description,
					elementClasses,
					elementWidth,
					blockWidthSum = 0,
					label,
					input,
					inputClasses,
					button,
					blocks,
					blocksLenght,
					hiddenBlocksCount = 0,
					descLabel,
					descLabel1stChild,
					descLabel2ndChild,
					i;

				if (!this._focusStatus) {
					return;
				}

				blocks = element.getElementsByClassName(classes.uiTokentextareaSpanBlock);
				blocksLenght =  blocks.length;
				label = element.getElementsByClassName(classes.uiTokentextareaLabel)[0];
				input = element.getElementsByTagName("input")[0];
				inputClasses = input.classList;
				button = element.getElementsByTagName("a")[0];

				label.removeAttribute("tabindex");
				inputClasses.remove(classes.uiTokentextareaInputVisible);
				inputClasses.add(classes.uiTokentextareaInputInvisible);
				input.removeAttribute("tabindex");
				button.removeAttribute("tabindex");
				button.style.display = "none";

				elementWidth = element.offsetWidth;
				blockWidthSum += _getElementWidth(label);
				for (i = 0; i <=  blocksLenght - 1; i++) {
					blockWidthSum += _getElementWidth(blocks[i]);
					if (blockWidthSum >= elementWidth) {
						hiddenBlocksCount++;
						blocks[i].classList.add(classes.uiTokentextareaInvisible);
					}
				}

				this._focusStatus = false;
				elementClasses = element.classList;
				elementClasses.remove(classes.uiTokentextareaFocusin);
				elementClasses.add(classes.uiTokentextareaFocusout);
				element.tabIndex = 0;

				if (hiddenBlocksCount !== 0) {
					descLabel = document.createElement("div");
					descLabel1stChild = document.createElement("div");
					descLabel2ndChild = document.createElement("div");

					descLabel.classList.add(classes.uiTokentextareaDesclabel);
					descLabel.setAttribute("aria-label", strings.moreDoubleTapToEdit);
					descLabel.tabIndex = -1;

					descLabel1stChild.setAttribute("aria-hidden", "true");
					descLabel1stChild.textContent = description.replace("{0}", hiddenBlocksCount);

					descLabel2ndChild.setAttribute("aria-label", "and");
					descLabel2ndChild.style.visibility = "hidden";
					descLabel2ndChild.textContent = hiddenBlocksCount;

					descLabel.appendChild(descLabel1stChild);
					descLabel.appendChild(descLabel2ndChild);
					element.insertBefore(descLabel, input.parentNode);
				}
			};

			/**
			* Bind widget events
			* @method _bindEvents
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype._bindEvents = function (element) {
				this.inputKeyUp = inputKeyUp.bind(null, element);
				element.getElementsByTagName("input")[0].addEventListener("keyup", this.inputKeyUp, false);
			};

			/**
			* Destroy widget
			* @method _destroy
			* @protected
			* @member ns.widget.Tokentextarea
			*/
			Tokentextarea.prototype._destroy = function () {
				var element = this.element,
					classes = Tokentextarea.classes,
					elementCilds,
					elementCildsLength,
					input,
					block,
					blockLength,
					i;

				input = element.getElementsByTagName("input")[0];
				block = element.getElementsByClassName(classes.uiTokentextareaSpanBlock);
				blockLength = block.length;
				for (i = blockLength - 1; i >= 0; i--) {
					block[i].removeEventListener("vclick", blockClick, false);
				}
				input.removeEventListener("keyup", this.inputKeyUp, false);
				elementCilds = element.childNodes;
				elementCildsLength = elementCilds.length;
				for (i =  elementCildsLength - 1; i >= 0; i--) {
					element.removeChild(elementCilds[i]);
				}
				element.classList.remove(classes.uiTokentextarea);
				element.removeAttribute("data-ns-built");
				element.removeAttribute("data-ns-binding");
				element.removeAttribute("data-ns-name");
				element.removeAttribute("data-ns-selector");
				element.removeAttribute("aria-disabled");
				element.removeAttribute("data-ns-bound");
				return;
			};

			// definition
			ns.widget.mobile.Tokentextarea = Tokentextarea;
			engine.defineWidget(
				"Tokentextarea",
				"[data-role='tokentextarea'], .ui-tokentextarea",
				[
					"add",
					"remove",
					"length",
					"inputText",
					"select",
					"focusIn",
					"focusOut"
				],
				Tokentextarea,
				'tizen'
			);

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Tokentextarea;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
