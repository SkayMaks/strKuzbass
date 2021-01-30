/**
 * Created by nikita on 1/24/14.
 */
/**
 * Выполнять блок при загрузке страницы
 */

/**
 * Хранит в себе состояние страницы с деревом объектов. Переменная
 * инициализируется при загрузке странице
 * 
 * @type {{}}
 */
var loadProps = {};

$(function() {


	$(document).on('click', ".alphabet_link", function(event) {
		var me = $(this);
		onClickAlphabetAction(event, me);
	});

	var popupAndOverlay = $('.popup, .overlay');
	$('.popup .close_window, .overlay').click(function() {
		popupAndOverlay.css('opacity', '0');
		popupAndOverlay.css('visibility', 'hidden');
	});
	$('.map_button').click(function(e) {
		popupAndOverlay.css('opacity', '1');
		popupAndOverlay.css('visibility', 'visible');
		e.preventDefault();
	});

	initDialog();

	$("#baseForm")
			.dialog(
					{
						autoOpen : false,
						minWidth : "550px",
						width : "600px",
						bgiframe : true,
						modal : true,
						resizable : false,
						dialogClass : "dialogClass",
						title : "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u0438\u0441\u043A"

					});
	$("#openD").click(function() {
		$("#baseForm").css("display", "block");
		$('.ui-widget-header').each(function() {
			$(this).css("background", "#3D3DCF");
			$(this).css("border", "#3D3DCF");

		});

		$('.ui-dialog').each(function() {
			$(this).css("background", "#FFFFFF");
			$(this).css("padding", "0");
		});

		$(".ui-dialog-titlebar").each(function() {

			$(this).css("background", "#b6d8f3");
			$(this).css("color", "#000000");
			$(this).css("border", "none");
			$(this).css("height", "21px");
		});

		$(".ui-dialog .ui-dialog-title").each(function() {

			$(this).css("float", "none");
		});
		
		$(".ui-dialog-title").each(function() {

			$(this).css("color", "black");
		});

		$('.ui-dialog-content').each(function() {
			$(this).css("padding", "0");
		});

		$("#baseForm").dialog("open");

	});

	var isDragging = false;
	$("#col_resize")
		.mousedown(function (event) {
			var min = $('#mainDataCenter').width() * 0.2;
			var startX = event.clientX;
			var mdr = $('#mainDataRight');
			var mdrWidth = mdr.width();
			var mdl = $('#mainDataLeft');
			var mdlWidth = mdl.width();
			$(window).mousemove(function (event) {
				isDragging = true;
//                $(window).unbind("mousemove");
				var deltaX = startX - event.clientX;
				mdl.width(mdlWidth - deltaX);
				mdr.width(mdrWidth + deltaX);
			}).disableSelection();
		});
	$(window).mouseup(function () {
		if(isDragging) {
			isDragging = false;
			$(window)
				.unbind("mousemove")
				.enableSelection();
		}
	});

	var hand = $('.hand');

	if (hand) {
		var headerHeight = $('.header_container').height();
		$(document).on('scroll', function () {
			var scrollTop = $(document).scrollTop();
			if (scrollTop > headerHeight) {
				hand.css('position', 'fixed');
			} else {
				hand.css('position', 'relative');
			}
		});
	}

	if (objectId != null && ot != 3) {
		showViewMode(null, objectId);
	}

	if (baseSearch) {
		var mainDataLeft = $('.mainDataLeft');
		var mainDataRight = $('.mainDataRight');
		mainDataLeft.find('.view_mode').show();
		mainDataLeft.find('.objectTypeList').first().click();
		mainDataRight.find('.view_mode').show();
		mainDataRight.find('.objectTypeList').first().click();

	}

	if (danger) {
		showDangerList(1);
	}
});

function onClickAlphabetAction(event, me) {

	var letters = me.parent().find(".letters");

	if(0!=letters.length && letters.css("display")=="none")
	{
		letters.css("display", "block");
		stopEvent(event);
	}

}

function searchWait() {
	document.getElementById("wait_box").style.display = "block";
	with (document.getElementById("content_box")) {
		style.overflow = "hidden";
		style.height = "100%";
		style.width = "100%";
	}
	return true;
}

function showViewMode(elem, id) {
	if (elem != null) {
		var me = $(elem);
		var objects = me.parents('.objects').first();

		var text = me.html();

		objects.find('.view_mode').empty();

		objects.find('.view_mode').hide();

		objects.find('.view_mode_content').empty();

		objects.find('.view_mode_content').hide();

		objects.find('.list_table').removeClass('list_table_active');

		me.addClass('list_table_active');

		$.ajax({
			url : contextPath + '/ajax/viewmode/' + id,
			mimeType : "text/html; charset=UTF-8",
			success : function(data) {
				var json = JSON.parse(data);
				var viewMode = me.parent().find('.view_mode');
				viewMode.empty();
				var listData = json['listData'];
				if (listData.indexOf("li") > -1) {
					viewMode.html(json['listData']);
				}
				//else {
				//	viewMode.html('<div class="no_search_content">Присоединенных объектов не найдено!</div>');
				//}
				viewMode.show();

				viewMode.find('li').first().click();

				var mainDataRight = $('.mainDataRight');

				var viewObjectMode = mainDataRight.find('.view_mode').first();
				mainDataRight.find('.view_mode_content').first().empty();
				viewObjectMode.empty();
				var objectData = json['objectData'];
				if (objectData.indexOf("li") > -1) {
					viewObjectMode.html(json['objectData']);
				}
				//else {
				//	viewObjectMode.html('<div class="no_search_content">Присоединенных объектов не найдено!</div>');
				//}
				viewObjectMode.show();

				viewObjectMode.find('li').first().click();

				mainDataRight.find('.content_title').html(text);
			}
		});
	} else {
		var text = $('.searchState').first().html();

		$.ajax({
			url : contextPath + '/ajax/viewmode/' + id,
			mimeType : "text/html; charset=UTF-8",
			success : function(data) {
				var json = JSON.parse(data);

				var mainDataRight = $('.mainDataRight');

				var viewObjectMode = mainDataRight.find('.view_mode').first();
				mainDataRight.find('.view_mode_content').first().empty();
				viewObjectMode.empty();
				var objectData = json['objectData'];
				if (objectData.indexOf("li") > -1) {
					viewObjectMode.html(json['objectData']);
				}

				viewObjectMode.show();

				mainDataRight.find('.content_title').html(text);

				if (connectedObj) {
					showList(viewObjectMode.find('li').first(), objectId, 'D_100807667', connectedPage);

				} else {
					viewObjectMode.find('li').first().click();
				}


			}
		});
	}
}

function showSearchMode(elem, url) {
	var me = $(elem);

	$.ajax({
		url : url,
		mimeType : "text/html; charset=UTF-8",
		data : {
			page : page
		},
		success : function(data) {
			var viewMode = me.parents('.list_container').first().find(
				'.view_mode_content');
			viewMode.empty();
			viewMode.html(data);
			viewMode.show();
		}
	});
}

function showList(elem, id, viewmode, page) {
	var me = $(elem);

	$.ajax({
		url : contextPath + '/ajax/list/' + id + '/' + viewmode,
		mimeType : "text/html; charset=UTF-8",
		data : {
			page : page
		},
		success : function(data) {
			var viewMode = me.parents('.list_container').first().find(
					'.view_mode_content');
			viewMode.empty();
			viewMode.html(data);
			viewMode.show();
			var mainDataRight = $('.mainDataRight');
			if (connectedObj) {
				mainDataRight.find('#okn_'+connectedObj).click();
				$('html, body').animate({
					scrollTop: $('#okn_'+connectedObj).offset().top
				}, 2000);
				connectedObj = null;
			}
		}
	});
}

function showChrono(elem, start, end, page) {
	var me = $(elem);

	var objects = me.parents('.mainDataLeft');

	if (objects.length > 0) {
		objects.find('.list_table').removeClass('list_table_active');

		me.addClass('list_table_active');
	}

	var text = start + ' - ' + end;

	$.ajax({
		url : contextPath + '/ajax/chrono',
		mimeType : "text/html; charset=UTF-8",
		data : {
			page : page,
			start: start,
			end: end
		},
		success : function(data) {
			var mainDataRight = $('.mainDataRight');

			var viewObjectMode = mainDataRight.find('.view_mode').first();
			mainDataRight.find('.view_mode_content').first().empty();
			viewObjectMode.empty();
			viewObjectMode.html(data);

			viewObjectMode.show();

			mainDataRight.find('.content_title').html(text);
		}
	});
}

function showDangerList(page) {
	var container = $('.mainDataRight').find('.view_mode');

	$.ajax({
		url : contextPath + '/ajax/danger',
		mimeType : "text/html; charset=UTF-8",
		data : {
			page : page
		},
		success : function(data) {
			container.hide();
			container.empty();
			container.html(data);
			container.show();
		}
	});
}

function showMainList(id, page) {
	var container = $('.news_container_data');

	$.ajax({
		url : contextPath + '/ajax/mainlist/' + id,
		mimeType : "text/html; charset=UTF-8",
		data : {
			page : page
		},
		success : function(data) {
			container.fadeOut(500, function() {
				container.empty();
				container.html(data);
				container.fadeIn(500);
			});
		}
	});
}

function showObject(elem, id) {
	var me = $(elem);

	$.ajax({
		url : contextPath + '/ajax/object/' + id,
		mimeType : "text/html; charset=UTF-8",
		success : function(data) {
			var viewMode = me.parents('.list_container').first().find(
					'.object_content');
			me.hide();
			viewMode.empty();
			viewMode.html(data);
			viewMode.show();
		}
	});
}

function showMainObject(id) {

	var container = $('.data_container_inner');

	$.ajax({
		url : contextPath + '/ajax/object/' + id,
		mimeType : "text/html; charset=UTF-8",
		success : function(data) {
			container.fadeOut(500, function() {
				container.empty();
				container.html(data);
				container.fadeIn(500);
			});
		}
	});
}

function randomStyle(id) {
	var container = $('.style_data');

	$.ajax({
		url : contextPath + '/ajax/style/' + id,
		mimeType : "text/html; charset=UTF-8",
		success : function(data) {
			container.fadeOut(500, function(){
				container.empty();
				container.html(data);
				container.fadeIn(500);
			});

		}
	});
}

function showComplex(elem, id) {
	var me = $(elem);

	var complex = me.parents('.object_content').find('#complex_' + id).first();

	$('html, body').animate({
		scrollTop: complex.offset().top
	}, 300);

	showObject(complex, id);
}

function displayImageObject(elem, id) {
	var me = $(elem);

	$.ajax({
		url : contextPath + '/ajax/object/' + id,
		mimeType : "text/html; charset=UTF-8",
		success : function(data) {
			var viewMode = me.parents('.random_image').first().find(
					'.random_image_content');
			viewMode.empty();
			viewMode.html(data);
			viewMode.show();
		}
	});
}

function closeObject(elem) {
	var me = $(elem);

	var parent = me.parents('.list_container').first();

	content = parent.find('.object_content');

	content.empty();

	content.hide();

	parent.find('.object_table').show();

	parent = me.parents('.random_image').first();

	content = parent.find('.random_image_content');

	content.empty();

	content.hide();

}

function activeMenu(elem) {
	var me = $(elem);
	var menu = $('.menu');

	menu.find('.menu_active').removeClass('menu_active');

	me.addClass('menu_active');
}

function isSearch() {
	var st = $("#searchType").val();
	if (st == "SIMPLE" || st == "BASE") {
		return true;
	} else {
		return false;
	}
}