/* TBD */
/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
 * Modified: Minkyu Kang <mk7.kang@samsung.com>
 */

/*
    A swipelist is a simple list containing linked list items with a data-role="swipelist" attribute.
    The list can be used to provide quick access to a set of actions associated with a particular context.
    The context should be defined with a data-role "ui-list-cover" and associated actions with a data-role "button". 
    A button is created for each associated action.The context(cover) is shown on top and actions(buttons) 
    are hidden underneath.The associated actions of a particular context can be revealed by swiping it 
    from left to right.
    Here is the HTML markup for a basic swipe-list.
    <ul data-role="swipelist">
        <li>
            <a href="#" data-role="button" data-theme="a">Tweet</a>
            <div data-role ="ui-list-cover">Name</div>
        </li>
    </ul>
*/

(function($) {
	 $.widget( "todons.swipelist", $.mobile.widget, {
		_create: function() {
			var swipeThreshold = 30,
			$currentSwipeItem = null,
			$animatedItem = null,
			$previousAnimatedItem = null,
			maxSwipeItemLeft = 0,
			resetNeeded = false,
			dragging = false,
			swiped = false,
			_self = this,
			startData = {
				point: new $.mobile.todons.Point(0,0)
			};

			_self._mouseDownCB = function(e) {
				$currentSwipeItem = $(this);
				_TouchStart(e,e.pageX, e.pageY);
			};

			_self._mouseMoveCB = function(e) {
				if (!dragging)
					return;

				_TouchMove(e.pageX, e.pageY);
			};

			_self._mouseUpCB = function(e) {
				dragging = false;
			};

			_self._clickCB = function ( e ) {
				return !swiped;
			};

			var _TouchStart =  function(e, X, Y) {
				$animatedItem = $currentSwipeItem.children('.ui-swipelistitemcover');
				maxSwipeItemLeft = $animatedItem.outerWidth();

				startData.point.setX(X);
				startData.point.setY(Y);

				if ($currentSwipeItem.width() / 2 < swipeThreshold)
					swipeThreshold = $currentSwipeItem.outerWidth() / 2;

				swiped = false;
				resetNeeded = true;
				dragging = true;

				return true;
			};

			var _swipeBack = function() {
				if ($previousAnimatedItem === null)
					return 0;

				$previousAnimatedItem.stop().animate({"left": 0}, 500);
				$previousAnimatedItem = null;

				dragging = false;
				swiped = true;

				return 1;
			};

			var _swipeToTarget = function() {
				_swipeBack();
				$animatedItem.stop().animate({"left": maxSwipeItemLeft}, 600);
				$previousAnimatedItem = $animatedItem;

				dragging = false;
				swiped = true;
			};

			var _reset = function() {
				if (!resetNeeded)
					return;

				swipeThreshold = 30;
				startData.point.setX(0);
				startData.point.setY(0);
				$animatedItem = null;
				maxSwipeItemLeft = null;
				resetNeeded = false;
			};

			var _checkSwipe = function(X, Y) {
				if (Math.abs(Y - startData.point.y()) > 20) {
					_reset();
					return;
				}

				var delta = X - startData.point.x();

				if (delta > swipeThreshold)
					return 1;
				else if (delta < -swipeThreshold)
					return -1;

				return 0;
			};

			var _TouchMove = function(X, Y) {
				var swipe = _checkSwipe(X, Y);
				var res = 1;

				if (swipe == 0)
					return;
				else if (swipe > 0)
					_swipeToTarget();
				else if (swipe < 0)
					res = _swipeBack();

				if (res)
					_reset();
			};
		},

		_init: function() {
			var $coverDiv = null,
			$contentDiv = null,
			$containerDiv = null,
			coverContent = null,
			self = this,
			listItems = self.element.children("li"),
			$li = null;
			self.element.addClass("ui-swipelist");
			self.element.addClass("ui-listview");

			listItems.each(function (idx, li) {
				$li = $(li);
				$li.addClass("ui-li");
				$li.addClass("ui-body-s");

				coverContent = $li.find(":jqmData(role='ui-list-cover')");

				if (coverContent.length !== 0) {
					$li.addClass("ui-swipelistitem");

					//create div for top container to hold both content and cover
					$containerDiv= $(document.createElement("div"));
					$containerDiv.addClass("ui-swipelistitemcontainer");

					//Create div and append toplayer content
					$coverDiv = $(document.createElement("div"));
					$coverDiv.addClass("ui-swipelistitemcover");
					$coverDiv.append(coverContent);

					//create div and append button content
					$contentDiv = $(document.createElement("div"));
					$contentDiv.html($li.find(":jqmData(role!='ui-list-cover')").parent().html());
					$li.find(":jqmData(role!='ui-list-cover')").remove();
					$contentDiv.addClass("ui-swipelistitemcontent");

					//Create appropriate layout for buttons.
					var temp = $contentDiv.find(".ui-btn-inner").parent(),
					cLength = temp.length;

					if (cLength > 0) {
						temp.removeClass('ui-shadow');
						temp.addClass('ui-buttonlayout');
						temp.last().addClass('ui-swipebuttonlast');

						switch (cLength) {
						case 3:
							temp.addClass('ui-threebuttonlayout');
							$(temp[1]).addClass('ui-centrebutton');
							break;
						case 4:
							temp.addClass('ui-fourbuttonlayout');
							break;
						default:
							if (cLength > 4)
								temp.addClass('ui-fourbuttonlayout');
						}
					}

					//append content and cover div to top level container
					$containerDiv.append($contentDiv);
					$containerDiv.append($coverDiv);

					//append top level container to listitem
					$li.append($containerDiv);
					$containerDiv.bind("vmousedown", self._mouseDownCB);
					$containerDiv.bind("vmousemove", self._mouseMoveCB);
					$containerDiv.bind("vmouseup", self._mouseUpCB);
					$containerDiv.bind( "vclick", self._clickCB );
				}
			});

			if (listItems.length === 1)
				$(listItems[0]).addClass("ui-onelinelist");

			//no need for any placeholder.
			listItems = null;
		}
	}); /* End of widget */

	//auto self-init widgets
	$(document).bind("pagecreate", function(e) {
		$(e.target).find(":jqmData(role='swipelist')").swipelist();
	});

})(jQuery);
