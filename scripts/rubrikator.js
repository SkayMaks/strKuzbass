/*todo: rewrite all, it's not the best solution!!*/
$(function () {

    buildRubrState();

});

function tree_toggle(event) {
    event = event || window.event
    var clickedElem = event.target || event.srcElement

    if (!hasClass(clickedElem, 'Expand')) {
        return
    }

    var param = $(clickedElem);

    if ($(clickedElem).hasClass("main_button")) {

        var opened = $(".ExpandOpen .main_button").parents("li");

        var clClass = $(clickedElem).parent().attr("class");

        $.each(opened, function () {
        	
            if ($(this).attr("class") != clClass) {
                opened.removeClass("ExpandOpen").addClass("ExpandClosed");
            }
        });
    }

    var node = clickedElem.parentNode
    if (hasClass(node, 'ExpandLeaf')) {
        return
    }

    if (!$(node).hasClass("disableRubrButton")) {

        if ($(clickedElem).hasClass("link")) {

            if ($(node).hasClass("ExpandClosed")) {
                $(node).removeClass("ExpandClosed").addClass("ExpandOpen");
                window.location = $(clickedElem).children("a").attr('href');
            }
        }
        else {
            var newClass = hasClass(node, 'ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen'

            var re = /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/
            node.className = node.className.replace(re, '$1' + newClass + '$3')
        }
    }
}


function hasClass(elem, className) {
    return new RegExp("(^|\\s)" + className + "(\\s|$)").test(elem.className)
}


function buildRubrState() {

    var active = $("li.active");

    if (active.length == 1) {

        active.children("a").addClass("active");
        var parents = active.parents("li.ExpandClosed");

        parents.removeClass("ExpandClosed").addClass("ExpandOpen");
        parents.children("a").addClass("active");
        if (active.hasClass("ExpandClosed")) active.removeClass("ExpandClosed").addClass("ExpandOpen");

    }

    //else  $(".main.rubr").parent().removeClass("ExpandClosed").addClass("ExpandOpen");
}

$.fn.fireEvent = function (eventType) {
    return this.each(function () {
        if (document.createEvent) {
            var event = document.createEvent("HTMLEvents");
            event.initEvent(eventType, true, true);
            return !this.dispatchEvent(event);
        } else {
            var event = document.createEventObject();
            return this.fireEvent("on" + eventType, event)
        }
    });
};
