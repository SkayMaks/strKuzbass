var language=1;

document.onclick = hidePopup


function stopEvent(e) {

    if (!e) var e = window.event;

    //e.cancelBubble is supported by IE - this will kill the bubbling process.
    e.cancelBubble = true;
    e.returnValue = false;

    //e.stopPropagation works only in Firefox.
    if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
    }
    return false;
}


function hidePopup(e)
{
    var popups = new Array()
    popups = document.getElementsByTagName('div')
    for (i = 0; i < popups.length; i++){

        var popId = new String(popups[i].getAttribute("id"))

        var popClass=$(popups[i]).attr("class")

        if (popId.indexOf('qs') == 0 || popId.indexOf('switch') == 0 || 'alphabet_letters'==popId || popClass == "parent_div"){

            if(popClass == "parent_div") {
                var rootName=$(".visibleChildren.level_0").attr("name")

                var all_rubr_button = $(".rubr_button")
                all_rubr_button.each(function() {
                    if (!$(this).hasClass(rootName)) {
                        if (!$(this).hasClass("level_0")) {
                            $(this).css("display", "none");
                        }
                        if (!$(this).hasClass("hiddenChildren")) $(this).addClass("hiddenChildren")
                        if ($(this).hasClass("visibleChildren")) $(this).removeClass("visibleChildren")
                    }
                });

                $(".children_div").css("display", "none");
            }
            else {
                popups[i].style.display = 'none'
            }
        }
    }
}
