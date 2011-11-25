/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
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
            var yThreshold = 2,
                swipeThreshold = 30,
                $currentSwipeItem = null,
                $swipeContainer = null,
                $animatedItem = null,
                $previousAnimatedItem = null,
                maxSwipeItemLeft = 0,
                resetNeeded = false,
                _self = this,
                startData = {
                    time: null,
                    point: new $.mobile.todons.Point(0,0)
                };

            _self._mouseDownCB = function(e) {
                $currentSwipeItem = $(this);
                e.preventDefault();
                _self.dragging = _TouchStart(e,e.pageX,e.pageY);
            };

            _self._mouseMoveCB = function(e) {
                if (!_self.dragging)
			return;

                e.preventDefault();
                return _TouchMove(e.pageX,e.pageY);
            };

            _self._mouseUpCB = function(e) {
                if (!_self.dragging)
			return;

	        _self.dragging = false;

                return _TouchEnd(e.pageX,e.pageY);
            };

            var _TouchStart =  function(e,X,Y) {
                if ($previousAnimatedItem) {
                        _swipeBack();
			return false;
		}

                $animatedItem = $currentSwipeItem.children('.ui-swipelistitemcover');
                maxSwipeItemLeft = $animatedItem.outerWidth();

                var date = new Date();
                startData.time = date.getTime();
                startData.point.setX(X);
                startData.point.setY(Y);
                if ($currentSwipeItem.width()/2 < swipeThreshold)
                    swipeThreshold = $currentSwipeItem.outerWidth()/2;
                resetNeeded = true;
                delete date;

                return true;
            };

            var _swipeBack = function() {
                if (null !== $previousAnimatedItem) {
                    $previousAnimatedItem.stop().animate({"left" :0}, 'fast','linear');
                    $previousAnimatedItem = null;
                }
            };

            var _swipeToTarget = function() {
                _swipeBack();
                $animatedItem.stop().animate({"left" :maxSwipeItemLeft}, 'fast','linear');
                $previousAnimatedItem = $animatedItem;
            };

            var _reset = function() {
                if (!resetNeeded)
                    return;
                swipeThreshold = 30;
                startData.time = null;
                startData.point.setX(0);
                startData.point.setY(0);
                $animatedItem = null;
                maxSwipeItemLeft = null;
                resetNeeded = false;
            };
            
            var _validSweep = function(X,Y) {
                return X>startData.point.x() && Math.abs(Y-startData.point.y()) <= 20 && X-startData.point.x() > 20;
            };

            var _validReverseSweep = function(X,Y) {
                return X<startData.point.x() && Math.abs(Y-startData.point.y()) <= 20 && startData.point.x() - X >= swipeThreshold;
            };

            var _TouchMove = function(X,Y) {
                 if (_validSweep(X,Y)) {
                     _swipeToTarget();
                     _reset();          
                }               
            };

            var _TouchEnd = function(X,Y) {
                if ($animatedItem !== null && $animatedItem.position().left !== 0 && _validReverseSweep(X,Y)) {
                    var date = new Date(),
                        time = date.getTime()-startData.time,
                        velocity = (startData.point.x()-X)/time;
                    if (velocity >=0.2) {
                        _swipeBack();
                    }
                    delete date;
                }
                _reset();
            }
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
//                $li.addClass("ui-li-static");
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
//                    $contentDiv.attr('data-role','controlgroup');
//                    $contentDiv.attr('data-type','horizontal');
//                    $contentDiv.controlgroup( {direction: "horizontal"});

                    //Create appropriate layout for buttons.
                    var temp = $contentDiv.find(".ui-btn-inner").parent(),
                    cLength = temp.length;
                    if (cLength>0) {
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
                            if (cLength>4)
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
                }
            });
            if (listItems.length === 1)
                $(listItems[0]).addClass("ui-onelinelist");
            //no need for any placeholder.
            listItems = null;
        }
    }); /* End of widget */
    
    //auto self-init widgets
    $( document ).bind( "pagecreate", function( e ){
        $( e.target ).find( ":jqmData(role='swipelist')" ).swipelist();
    });

})(jQuery);

