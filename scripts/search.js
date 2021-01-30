/*todo нужно все это переписать в приличном виде*/
var functionOnTimeout = null;
var functionImgOnTimeout = null;
var commonId;
var startTime = 0;
var imgStartTime = 0;
var timeoutFunction = null;
var idTimeout = null;
var pageSize = 15;
var page = 1;
var setFocusOnFirstLink = false;
var setFocusOnLastPlusOdinLink = false;


/*todo: нужно проверять когда приходит ответ от аякса на совпадение по тексту, по кот искали! на пнд.*/
function actionOnKeyUp(event) {

    window.clearTimeout(functionOnTimeout);
    page = 1;
    var pageNumberInput = $("#pageNumber" + commonId);
    pageNumberInput.attr("value", 1);
    getData(commonId, event);
    //$("#qs"+commonId).css("display", "none");
    //$("#qsSpan"+commonId).css("display", "block");

}

function showLoadImg() {
    var il = $("#il" + commonId);
    il.css("display", "block");
    $("#ilSpan" + commonId).css("display", "none");
    imgStartTime = new Date().getTime();
    if (functionImgOnTimeout != null) window.clearTimeout(functionImgOnTimeout);
    functionImgOnTimeout = window.setTimeout(checkImgWasHidden, 1000 * 20);

}

function hideLoadImg() {
    $("#il" + commonId).css("display", "none");
    $("#ilSpan" + commonId).css("display", "block");
    if (functionImgOnTimeout != null) window.clearTimeout(functionImgOnTimeout);
}

function checkImgWasHidden() {
    hideLoadImg();
}

function linkClick(id, currentId) {
    var input = $("#input" + id);
    if (input.hasClass("idleField")) {
        input.removeClass("idleField");
    }
    input.addClass("focusField");

    var link = $("#" + currentId + id);

    link.addClass("focusedLink");

    input.val(link.text());

    var dictionaryValue = $("#dictionaryValue" + id);
    input.val(link.text());
    dictionaryValue.val(link.attr("name"));

    input.focus();
    input.select();
    hidePopup();
}

function scrollAction(elemId, event) {

    var container = document.getElementById(elemId);

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
        var id = elemId.replace('qs', '');
        var pageNumberInput = $("#pageNumber" + id);
        page = parseInt(pageNumberInput.attr("value")) + 1;
        pageNumberInput.attr("value", page);
        getData(id);

    }

}

function getData(id, event) {
    var searchValue = $.trim(document.getElementById('input' + id).value);

    var pos = searchValue.lastIndexOf("/");
    if (pos != -1) {
        searchValue = searchValue.substr(pos + 1);
    }

    if (searchValue.length > 0 && searchValue.charAt(searchValue.length - 1) == '.') {
        searchValue = searchValue.substr(0, searchValue.length - 1);
    }

    //var typeId = document.getElementById('idConnectedType' + id).value

    var linkArr = $("#qs" + id + " > a");

    if (linkArr.length == 1)linkArr.remove();
    var il = $("#il" + commonId);

    if (il.hasClass("dictionaryAttribute")) {
        showLoadImg();
        $("#dictionaryValue" + commonId).val("");
        //$("#dictionaryText"+commonId).val(searchValue);
        //var searchType="attributeList"id,eve;
        //$.ajax('qsearch?textValue='+ encodeURIComponent(searchValue)+'&attribute='+id+'&page='+page+'&pageSize='+pageSize,"json", onAjaxSuccess);

        jQuery.getJSON($(".contextPathInput").val() + "/qsearch?lc=" + $(".languageInput").val(), {textValue: searchValue, attribute: id.substr(1), page: page, pageSize: pageSize}, function(data) {
            var value = $.trim(document.getElementById('input' + id).value);
            if(value==searchValue) {
               onAjaxSuccess(data, event, id.substr(1), searchValue);
            }

        });
    }
}


function getDataAfterSubmit(id, event) {
    var searchValue = $.trim(document.getElementById('input' + id).value);

    var pos = searchValue.lastIndexOf("/");
    if (pos != -1) {
        searchValue = searchValue.substr(pos + 1);
    }

    if (searchValue.length > 0 && searchValue.charAt(searchValue.length - 1) == '.') {
        searchValue = searchValue.substr(0, searchValue.length - 1);
    }
    jQuery.getJSON($(".contextPathInput").val() + "/qsearch?lc=" + $(".languageInput").val(), {textValue: searchValue, attribute: id.substr(1), page: page, pageSize: pageSize}, function(data) {
        onAjaxAfterSubmitSuccess(data, event, id.substr(1), searchValue);
    });

}

function openComboList(elementId, event) {
    var divId = elementId.replace('button', 'qs');
    var divSpanId = elementId.replace('button', 'qsSpan');
    var inputId = elementId.replace('button', 'input');

    commonId = elementId.replace('button', '');

    var div = $("#" + divId);

    //alert(div.css("height") + "   " + div.offset().top);

    if (div.css("display") == "block") {
        div.css("display", "none");
        $("#" + divSpanId).css("display", "block");
    }
    else {
        var linkArr = $("#" + divId + " > a");
        if (linkArr.length != 0) {
            $('div.ui-dialog').css("overflow", "visible");
            div.css("display", "block");
            $("#" + divSpanId).css("display", "none");


            $("#" + divSpanId).css("display", "none");

            var inputVal = $.trim($("#" + inputId).val());
            if (inputVal != "") {
                linkArr.each(function() {
                    if ($(this).hasClass("focusedLink")) {

                        $(this).removeClass("focusedLink");
                    }
                    if ($(this).text() == inputVal) {

                        $(this).addClass("focusedLink");
                        $(this).focus();
                        $(this).select();
                    }
                });
            }
            stopEvent(event);
        }
        else {

            window.clearTimeout(functionOnTimeout);
            page = 1;
            var pageNumberInput = $("#pageNumber" + commonId);
            pageNumberInput.attr("value", 1);
            getData(commonId);
        }
    }
}

function fetchAddData(id, currentId, event) {
    commonId = id
    var currentLink = $("#" + currentId + id);

    if (event.keyCode == 40) {

        var lastLink = $("#qs" + commonId + " :last").attr("id");
        if (lastLink == currentId + id) {

            stopEvent(event);
            setFocusOnLastPlusOdinLink = true;
            var pageNumberInput = $("#pageNumber" + id);
            page = parseInt(pageNumberInput.attr("value")) + 1;
            pageNumberInput.attr("value", page);
            actionOnKeyUp(event);
            return;
        }

        var nextLink = currentLink.next();

        if (null != nextLink) {
            if (currentLink.hasClass("focusedLink")) currentLink.removeClass("focusedLink");
            $(nextLink).addClass("focusedLink");

            $(nextLink).focus();
            $(nextLink).select();
        }
        else {
            currentLink.focus();
            currentLink.select();

        }

    }
    else if (event.keyCode == 38) {

        var firstLink = $("#qs" + commonId + " :nth-child(2)").attr("id");
        if (firstLink == currentId + id) {

            stopEvent(event);
            return;
        }

        var prevLink = currentLink.prev();

        if (null != prevLink) {
            if (currentLink.hasClass("focusedLink")) currentLink.removeClass("focusedLink");
            $(prevLink).addClass("focusedLink");
            $(prevLink).select();
            $(prevLink).focus();
        }
    }
    else if (event.keyCode == 13) {

        linkClick(id, currentId);
    }

    stopEvent(event);
}


function focusLink(id, currentId) {
    if (currentId == "0link" + id)$("#" + currentId).focus();
}


// selects a portion of the input string
function createSelection(start, end) {
    // get a reference to the input element
    var input = $("#input" + commonId);
    var field = input.get(0);
    if (field.createTextRange) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart("character", start);
        selRange.moveEnd("character", end);
        selRange.select();
    } else if (field.setSelectionRange) {
        field.setSelectionRange(start, end);
    } else {
        if (field.selectionStart) {
            field.selectionStart = start;
            field.selectionEnd = end;
        }
    }
    field.focus();
}
;

// fills in the input box w/the first match (assumed to be the best match)
function autoFill(sValue) {
    // if the last user key pressed was backspace, don't autofill
    //if( lastKeyPressCode != 8 ){
    // fill in the value (keep the case the user has typed)
    var input = $("#input" + commonId);
    var prevValue = input.val();
    if (prevValue != "" && sValue != "" && sValue.substr(0, prevValue.length).toLowerCase() == prevValue.toLowerCase()) {
        input.val(input.val() + sValue.substring(prevValue.length));
        // select the portion of the value not typed by the user (so the next character will erase)
        createSelection(prevValue.length, sValue.length);
    }
    //}
}
;


function onAjaxSuccess(data, event, attribute, textValue) {
    var id = "_" + attribute;

    var menucontainer = $('#qs' + id);
    var firstValue = "";
    var lastLinkBefore = null;

    var linkArrBefore = $("#qs" + id + " > a");
    if (linkArrBefore.length != 0) {
        lastLinkBefore = $("#qs" + id + " :last");
    }

    $.each(data, function(i, item) {

        if (i == 0)firstValue = item.value;
        var text = item.value;
        if (text.length > 40) text = text.substr(0, 37) + "...";
        $(document.createElement("a"))
                .attr({ id: item.id + id, href: "#", name: item.id, title: item.value })
                .appendTo(menucontainer)
                .click(function(event) {

            linkClick(id, item.id);
        })
            /*.focus(function(event){
             focusLink(id,item.id, event)

             })*/
                .keydown(function(event) {
            fetchAddData(id, item.id, event)
        })
                .text(text)
    });


    var linkArr = $("#qs" + id + " > a");
    var stPos = linkArr.length

    var i = 0


    if (data.length != 0) {
        menucontainer.css("height", ((25 * (i + 1 + stPos) > 100) ? 100 : (25 * (i + 1 + stPos))).toString() + "px");
    }


    if ((linkArr.length != 0 || i > 0) && $("#qs" + id).css("display") == "none") {
        $('div.ui-dialog').css("overflow", "visible");
        $("#qs" + id).css("display", "block");
        $("#qsSpan" + commonId).css("display", "none");
        if (setFocusOnFirstLink) {
            document.getElementById("qs" + id).scrollTop = 0
            var link = $("#qs" + id + " :nth-child(2)");
            link.addClass("focusedLink");
            link.focus();
            link.select();
            setFocusOnFirstLink = false;
            stopEvent(event);
        }
        /*todo Оттестировать когда lastLinkBefore не найден*/
        else if (setFocusOnLastPlusOdinLink) {
            if (lastLinkBefore != null) {
                if (lastLinkBefore.hasClass("focusedLink")) lastLinkBefore.removeClass("focusedLink");
                var link = lastLinkBefore.next();
                link.addClass("focusedLink");
                link.focus();
                link.select();
            }

            setFocusOnLastPlusOdinLink = false;
            stopEvent(event);
        }

    }

    hideLoadImg();
    //autoFill(firstValue);
}

function onAjaxAfterSubmitSuccess(data, event, id, searchValue) {
    id = "_" + id;
    $("#dictionaryValue" + id).val("");

    if (data.length == 1) {

        $.each(data, function(i, item) {

            $("#dictionaryValue" + id).val(item.id);

        });

        document.baseForm.submit();
    }

    else {

        $("#alertText").text("Уточните поисковое условие атрибута «" + $.trim($("#label" + id).text()) + "»");
        $("#alertBox").css("display", "block");
        $("#alertBox").dialog("open");

    }

}

function ClearForm(formName) {
    $("input.clear").val("");
    $("input.pageNumber").val("1");
    $("div.searchpopup > a").remove();

}
/*
 function enterKey(event,formName);
 {
 if((event.keyCode == 0xA)||(event.keyCode == 0xD));
 {
 if($("#qs"+commonId).length!=0 && $("#qs"+commonId).css("display")=="block");
 {
 var linkArray=$("#qs"+commonId+" a.focusedLink");
 linkArray.removeClass("focusedLink").addClass("idledLink");
 var input=$("#input"+commonId);
 input.val(linkArray.text());
 input.focus();
 hidePopup();
 }
 else
 {
 submitAction(formName);
 }
 }
 }
 */
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

function submitAction(e) {

    var fields = $(".field");
    var count=0;

    fields.each(function() {

        var inputVal = $.trim($(this).val());

        if ($.trim(inputVal) == '') {
            count++;
        }
    });

    if(count==fields.length) {

        $("#alertText").text("Поисковые условия не заданы");
        $("#alertBox").css("display", "block");
        $("#alertBox").dialog("open");
        stopEvent(e);
        return false;
    }

    var dictionaryInputArr = $(".dictionaryInput");
    if (dictionaryInputArr.length != 0) {
        var isDictionaryEmpty = false;

        dictionaryInputArr.each(function() {

            var inputVal = $.trim($(this).val());
            var inputId = $(this).attr("id");
            var id = inputId.replace("input", "");
            var dictionaryValue = $("#dictionaryValue" + id);

            if ($.trim(inputVal) != '' && ($.trim(dictionaryValue.val()) == '0' || $.trim(dictionaryValue.val()) == '')) {

                commonId = id;
                stopEvent(e);
                getDataAfterSubmit(id, e);

                isDictionaryEmpty = true;
                return false;

            }

        });
    }

    fields.each(function() {

        var inputVal = $.trim($(this).val());

        if ($.trim(inputVal) == '') {

            $(this).removeAttr("name");

            if ($(this).hasClass("dictionaryInput")) {

                var inputId = $(this).attr("id");
                var id = inputId.replace("input", "");
                var dictionaryValue = $("#dictionaryValue" + id);
                dictionaryValue.removeAttr("name");

            }
        }

    });

    return !isDictionaryEmpty;


}

//-----------------------------------Init functions------------------------------------------//
function initForm() {
    var options = {
        beforeSubmit: showRequest,
        timeout: 3000
    };

    $('#oneFieldForm').submit(function() {
        $(this).ajaxSubmit(options);
        return false;
    });
}

function initDialog() {
    $(function() {
        $("#alertBox").dialog({
            autoOpen: false,
            minWidth: "350px",
            width: "350px",
            bgiframe: true,
            modal: true,
            resizable:false,
            dialogClass:"alertClass",
            title: "Внимание",

            buttons: {
                "OK": function() {
                    $("#alertBox").dialog("close");

                }
            }
        });

        $("#alertButton").click(function() {
            $("#alertBox").dialog("close");
        });

    });


    var IE = document.all ? true : false

    if (IE) {

        var dhx_combo_box = $("div.dhx_combo_box");
        if (dhx_combo_box.length != 0) {

            dhx_combo_box.css("height", "22px");
            $("div.searchpopup").css("width", "300px");
        }
    }

    $('input.dhx_combo_input').focus(function() {
        this.select();
    });

    $("input.simpleInput").css("width", "296px");

    $("input.dhx_combo_input").bind('keyup', function(event) {

        onComboKeyUp($(this).attr("id"), event);
    })


    $("img.dhx_combo_img").bind('click', function(event) {

        openComboList($(this).attr("id"), event);
    });

    $("div.searchpopup").bind('scroll', function(event) {

        scrollAction($(this).attr("id"), event);
    });
    /*
     $("select.selectAttribute").bind('change', function(event) {

     selectAttributeOnChange($(this).attr("id"),event);
     });

     $("select.selectCondition").bind('change', function(event) {

     selectConditionOnChange($(this).attr("id"),event);
     })*/

}


function onComboKeyUp(elemId, event) {
    var input = $("#" + elemId);
    var id = input.attr("id").replace("input", "");

    if (event.keyCode == 40) {
        var linkArr = $("#qs" + id + " > a");

        if (linkArr.length != 0) {
            $("#qs" + id).css("display", "block");
            var linkArray = $("#qs" + id + " a.focusedLink");

            if (linkArray.length != 0 && $.trim(input.val()) != "") {
                var inputVal = $.trim(input.val());
                linkArr.each(function() {
                    if ($(this).text() != inputVal) {
                        $(this).removeClass("focusedLink");
                    }
                    else {
                        $(this).focus();
                        $(this).select();
                        $(this).addClass("focusedLink");
                    }
                })
            }
            else {
                var link = $("#qs" + id + " :nth-child(2)");
                link.addClass("focusedLink");
                link.focus();
                link.select();
                document.getElementById("qs" + id).scrollTop = 0
            }

        }
        else {
            commonId = id
            setFocusOnFirstLink = true;
            actionOnKeyUp(event);
        }
    }
    else if (!((event.keyCode == 0xA) || (event.keyCode == 0xD))) {
        var linkArr = $("#qs" + id + " > a");
        if (linkArr.length != 0) {
            linkArr.remove();
            document.getElementById("qs" + id).scrollTop = 0
        }
        commonId = id
        if (functionOnTimeout != null) window.clearTimeout(functionOnTimeout);
        functionOnTimeout = window.setTimeout(actionOnKeyUp, 250);
    }
}

function enterKey(event, formName) {

    if ((event.keyCode == 0xA) || (event.keyCode == 0xD)) {
        document.forms[formName].onsubmit(event);
        document.forms[formName].submit();
        return false;
    }
}

function clearForm(formName) {
    $("input.clear").val("");
    $("input.pageNumber").val("1");
    $("div.searchpopup > a").remove();

}

/*
 $(function(){
 $("#dialogForm").dialog({
 autoOpen: false,
 position: ["center",200],
 minWidth: "550px",
 width: "600px",
 bgiframe: true,
 modal: true,
 resizable:false,
 dialogClass:"dialogClass",
 title: "Р Р°СЃС€РёСЂРµРЅРЅС‹Р№ РїРѕРёСЃРє"

 });
 $("#openD").click(function(){
 $("#dialogForm").css("display", "block");
 $('.ui-widget-header').each(
 function();
 {
 //$(this).css("background","#3D3DCF");
 //$(this).css("border","#3D3DCF");

 });

 $('.ui-dialog').each(
 function();
 {
 $(this).css("background","#eeefea");
 $(this).css("padding","0");
 });

 $(".ui-dialog-titlebar").each(function(){

 $(this).css("background","#665e56");
 $(this).css("border","none");
 $(this).css("height","21px");
 });

 $(".ui-dialog .ui-dialog-title").each(function(){

 $(this).css("float","none");
 });

 $('.ui-dialog-content').each(function(){
 $(this).css("padding","0");
 });

 $("#dialogForm").dialog("open");

 });

 $("#closeFormDialog").click(function(){
 $("#dialogForm").dialog("close");
 });

 $("#clearFormDialog").click(function(){
 ClearForm('baseForm');
 });

 $("#submitSearchFormDialog").each(function(){
 $(this).css("border", "none");
 });

 //$("#addSearchCondition").click(function(){
 // addSearchCondition();
 //});


 });

 */


/*
 function selectAttributeOnChange(elemId,event){

 var conditionNumber=elemId.substr(elemId.indexOf("_")+1);
 var attribute=$("#"+elemId);
 var attributeID=$("#"+elemId+" :selected").val();
 $("#attribute_"+conditionNumber).val(attributeID);

 var linkArr=$("#qs_"+conditionNumber+" > a");

 if(linkArr.length!=0);
 {
 linkArr.remove();
 document.getElementById("qs_"+conditionNumber).scrollTop=0
 $("#pageNumber_"+conditionNumber).val("1");
 }

 $("#input_"+conditionNumber).val("");
 getConditionData(attributeID, conditionNumber);
 }

 function selectConditionOnChange(elemId,event) {

 var conditionNumber=elemId.substr(elemId.indexOf("_")+1);
 var attribute=$("#"+elemId);
 var value=$("#"+elemId+" :selected").val();
 $("#condition_"+conditionNumber).val(value);
 }


 function getConditionData(attributeID,conditionNumber);
 {
 var searchType="conditionList";
 $.post('qsearch.do?searchType=' +searchType+'&attributeID='+ attributeID + '&conditionNumber='+conditionNumber , onAjaxConditionsSuccess,"xml");
 }

 function onAjaxConditionsSuccess(xml);
 {
 var strUrl=this.url

 var conditionNumber=jQuery.grep(strUrl.split("&"),function(a){
 if(a.indexOf("conditionNumber=")==0);
 {
 return a;
 }
 });
 conditionNumber=conditionNumber.join(", ").replace("conditionNumber=","");
 var selects = $('select',xml);
 var selectedOptionValue=selects.attr("selected");
 var isDictionaryAttribute=selects.attr("isDictionaryAttribute");

 var options = $('option',xml);
 var select=$("#selectCondition_"+conditionNumber);
 var button=$("#button_"+conditionNumber);
 var il=$("#il_"+conditionNumber);

 if(isDictionaryAttribute=="true");
 {
 if(!button.hasClass("dictionaryAttribute"))button.addClass("dictionaryAttribute");
 if(button.hasClass("notDictionaryAttribute"))button.removeClass("notDictionaryAttribute");

 if(!il.hasClass("dictionaryAttribute"));
 {
 il.addClass("dictionaryAttribute");
 il.css("display", "none");
 }
 if(il.hasClass("notDictionaryAttribute"))il.removeClass("notDictionaryAttribute");
 }
 else
 {
 if(button.hasClass("dictionaryAttribute"))button.removeClass("dictionaryAttribute");
 if(!button.hasClass("notDictionaryAttribute"))button.addClass("notDictionaryAttribute");

 if(!il.hasClass("notDictionaryAttribute"))il.addClass("notDictionaryAttribute");
 if(il.hasClass("dictionaryAttribute"))il.removeClass("dictionaryAttribute");
 }


 select.empty();
 options.each(function(){
 var option=$(document.createElement("option"));
 .attr({value: $(this).attr("value")});
 .text($(this).attr("label"));
 .appendTo(select);
 if($(this).attr("value")==selectedOptionValue);
 {
 option.attr("selected", "true");
 $("#condition_"+conditionNumber).val($(this).attr("value"));
 }

 });
 }


 function addSearchCondition();
 {
 var addSearchCondition=$('.addSearchCondition').clone();
 var trID=addSearchCondition.attr("id");
 addSearchCondition.removeClass("addSearchCondition");

 addSearchCondition.appendTo('.searchTable');

 var tr=$('.addSearchCondition');
 var searchConditionNumber=parseInt(trID)+1;

 tr.attr("id",searchConditionNumber);

 $('.addSearchCondition .attribute').attr("id", "attribute_" + searchConditionNumber);
 $('.addSearchCondition .condition').attr("id", "condition_" + searchConditionNumber);
 $('.addSearchCondition .pageNumber').attr("id", "pageNumber_" + searchConditionNumber);
 $('.addSearchCondition .dictionaryValue').attr("id", "dictionaryValue_" + searchConditionNumber);
 $('.addSearchCondition .textValue').attr("id", "textValue_" + searchConditionNumber);

 $('.addSearchCondition .selectAttribute').attr("id", "selectAttribute_" + searchConditionNumber);
 $('.addSearchCondition .selectCondition').attr("id", "selectCondition_" + searchConditionNumber);

 $('.addSearchCondition .dhx_combo_input').attr("id", "input_" + searchConditionNumber);
 $('.addSearchCondition .dhx_combo_img').attr("id", "button_" + searchConditionNumber);
 $('.addSearchCondition .imgLoadDiv').attr("id", "il_" + searchConditionNumber);
 $('.addSearchCondition .searchpopup').attr("id", "qs_" + searchConditionNumber);
 $('.addSearchCondition .qsSpan').attr("id", "qsSpan_" + searchConditionNumber);


 addSearchCondition=$('.addSearchCondition').clone();
 $('.addSearchCondition').remove();
 addSearchCondition.appendTo('.searchTable');


 var selectAttribute=$("#"+trID+" select.selectAttribute");

 $("#"+trID+" select.selectAttribute").change(function(event) {
 selectAttributeOnChange($(this).attr("id"),event);
 });

 $("#"+trID+" select.selectCondition").change(function(event) {
 selectConditionOnChange($(this).attr("id"),event);
 });


 $("#"+trID+" input.dhx_combo_input").keyup(function(event) {
 onComboKeyUp($(this).attr("id"),event);
 });

 $("#"+trID+" img.dhx_combo_img").click(function(event) {
 openComboList($(this).attr("id"),event);
 });

 $("#"+trID+" div.searchpopup").scroll(function(event) {
 scrollAction($(this).attr("id"),event);
 });


 var paramnum=$("#baseForm #paramnum");

 var paramnumValue=$("#baseForm #paramnum").val();

 paramnum.val(parseInt(paramnumValue)+1);
 }

 */