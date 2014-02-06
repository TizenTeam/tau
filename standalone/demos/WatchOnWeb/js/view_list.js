var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.func = WR.func || {};

WR.ENUM = WR.ENUM || {};

SELECTED_MODE = {
	TV_ONLY: 0,
	TV_AND_STB: 1
};

var setarr = [];
Object.freeze(WR.ENUM);

var vlist = vlist || null;	// virtuallist object

// 정리 해야하는 전역변수들------------
selectedSettingMode = SELECTED_MODE.TV_ONLY;
deviceType = "TV";
brandListStatus = "top_brand";
tmpRemoconData = {};
var documentsDir;
deleteIdx = -1;
lastUseRemoconId = 0;
//-----------------------------------------

WR.events.brandListDiv = function(m)
{
	var brandListPage$ = $("#brandListPage"),
			brandList$ = brandListPage$.find("#brandList"),
			sm = m.SceneManager;

	brandListPage$[0].beforeChange = function() {
		brandListStatus = "top_brand";
		addBrandItem();
	};

	brandList$[0].addEventListener("click", function(e) {

		console.log("brand item click : " + e.target.id);

		if (e.target.id === "allBrand")
		{
			brandListStatus = "all_brand";
			addBrandItem();
		}
		else if (e.target.id === "id_s_voice")
		{
			// s voice 페이지로 이동
		}
		else
		{
			console.log("insert to tmpRemoconData ");
			tmpRemoconData = {
				type: deviceType,
				brandName: e.target.id,
				model: "[]",
				codeSet: "[]",
			};

			sm.moveTo("#dynamicSettingPage");
		}
	});
}

WR.events.remoconManagePage = function(m)
{
	var sm = m.SceneManager,
			Remocon = m.Remocon;
	var remoconManagePage$ = $("#remoconManagePage");

	remoconManagePage$.find("#remoteList").click(function(e) {

		console.log(e.target.id);
		if (e.target.parentNode.id !== "remoteList")
			return;
		var remocon = Remocon.remoconObjs[ e.target.id ];
		remocon.createRemoteDiv("#remotePage");
		sm.moveTo("#remotePage", true);
	});

	var startDelY = 0;
	var longPressTimer = null;

	remoconManagePage$.find("#remoteList")[0].addEventListener("touchstart", function(e) {

		if (e.target.parentNode.id !== "remoteList")
			return;

		deleteIdx = e.target.id;
		startDelY = e.touches[0].clientY;


		longPressTimer = setTimeout(function() {
			sm.moveTo("#deleteRemoconPage");
		}, 700);
	});
	remoconManagePage$.find("#remoteList")[0].addEventListener("touchmove", function(e) {
		var y = e.touches[0].clientY;
		if (Math.abs(startDelY - y) > 40)
		{
			clearTimeout(longPressTimer);
		}
	});
	remoconManagePage$.find("#remoteList").on("mouseup", function() {

		clearTimeout(longPressTimer);
	});

	remoconManagePage$.find("#addTvBtn").click(function(e) {
		console.log(e.target.id);
		deviceType = "TV";
		sm.moveTo("#brandListPage");
		return false;
	});
	remoconManagePage$.find("#addStbBtn").click(function(e) {
		console.log(e.target.id);
		deviceType = "STB";
		sm.moveTo("#brandListPage");
		return false;
	});

}

WR.events.deletePage = function(m)
{
	var wr = WR,
			func = wr.func,
			sm = m.SceneManager,
			Remocon = m.Remocon;

	var deleteRemoconPage$ = $("#deleteRemoconPage");

	console.log(Remocon.remoconList);
	deleteRemoconPage$.find("footer").click(function(e) {

		if (e.target.id === "yesBtn")
		{
			Remocon.remoconObjs[ deleteIdx ].removeItSelf();
			WatchOnSandbox("Remocon", func.updateRemoconManagePage);

			if (Remocon.remoconList.length < 1)
			{
				sm.clearStack();
				sm.moveTo("#main", true);
				return false;
			}
		}
		window.a = sm;
		sm.back();

		return false;
	});

};

//---------- fileRead Modules 로 만들어야함--------//
function addBrandItem()
{
	var brandListPage$ = $("#brandListPage");
	brandListPage$.find("#titleType").html(deviceType + " brand list");

	brandListPage$.find("#brandList").empty();
	brandListPage$.find("#brandList").hide();
	brandListPage$.find("#loading").show();

	if (brandListStatus === "all_brand")
	{
		var resAddr = "file:///opt/usr/apps/S8UVkC4ryF/res/wgt/resource/";
		tizen.filesystem.resolve(resAddr, //dump_tv_58850.csv',
				function(dir) {
					documentsDir = dir;
					dir.listFiles(onsuccessFile, onerrorFile);
				}, function(e) {
			console.log("Error" + e.message);
		}, "r");
	}
	else
	{
		if (deviceType == "TV")
		{
			$("#brandListPage #brandList").hide();
			$("#brandListPage #loading").show();
			$("#brandListPage #brandList").append('<li id="Samsung">Samsung</li>');
			$("#brandListPage #brandList").append('<li id="Panasonic">Panasonic</li>');
			$("#brandListPage #brandList").append('<li id="Sony">Sony</li>');
			$("#brandListPage #brandList").append('<li id="Toshiba">Toshiba</li>');
			$("#brandListPage #brandList").append('<li id="Toshiba">LG</li>');
			$("#brandListPage #brandList").append('<li id="Sharp">Sharp</li>');
			$("#brandListPage #brandList").append('<li id="allBrand">Show all brands</li>');
			$("#brandListPage #brandList").show();
			$("#brandListPage #loading").hide();
		}
		else
		{
			$("#brandListPage #brandList").hide();
			$("#brandListPage #loading").show();
			$("#brandListPage #brandList").append('<li id="Samsung">Samsung</li>');
			$("#brandListPage #brandList").append('<li id="Comcast">Comcast</li>');
			$("#brandListPage #brandList").append('<li id="Cox">Cox</li>');
			$("#brandListPage #brandList").append('<li id="Dish Network">Dish Network</li>');
			$("#brandListPage #brandList").append('<li id="Time Warner">Time Warner</li>');
			$("#brandListPage #brandList").append('<li id="Verizon">Verizon</li>');
			$("#brandListPage #brandList").append('<li id="allBrand">Show all brands</li>');
			$("#brandListPage #brandList").show();
			$("#brandListPage #loading").hide();
		}

	}

	function onsuccessFile(files)
	{
		for (var i = 0; i < files.length; i++)
		{
			if (files[i].isDirectory == false)
			{
				var filename = "";
				if (deviceType == "TV")
					filename = "dump_tv_brandlist.csv";
				else
					filename = "dump_stb_brandlist.csv";

				if (files[i].name == filename) {
					files[i].readAsText(
							function(str) {
								var arr = str.split("\n"),
										arrLen = arr.length,
										elisb = document.createElement('div'),
										isb,
										sideIndex = {},
										firstChar,
										lastOccuredChar,
										brandList = $("#brandListPage #brandList")[0];
								elisb.className = 'ui-indexscrollbar';
								brandList.parentNode.appendChild(elisb);
								for (i = 0; i < arrLen; i++) {
									firstChar = arr[i].substring(0, 1).toUpperCase();
									if (firstChar !== lastOccuredChar) {
										sideIndex[firstChar] = i;
										lastOccuredChar = firstChar;
									}
								}
								elisb.setAttribute("data-index", Object.keys(sideIndex).join(","));
								isb = gear.ui.IndexScrollbar(elisb);
								// Add a virtuallist
								vlist = gear.ui.VirtualListview(brandList, {
									dataLength: arrLen,
									bufferSize: 40
								});
								vlist.setListItemUpdater(function(li, index) {
									var data = arr[index];
									li.innerText = data;
									li.id = data;
								});
								vlist.draw();

								var selectIndexHandler = function(ev) {
									var idx = ev.detail.index;
									vlist.scrollToIndex(sideIndex[idx]);
								};
								elisb.addEventListener("select", selectIndexHandler, false);
								$("#brandListPage #loading").hide();
								$("#brandListPage #brandList").show();

								var pageHideHandler = (function(vlist, isb) {
									vlist.destroy();
									elisb.removeEventListener("select", selectIndexHandler, false);
									isb.destroy();
									elisb.parentNode.removeChild(elisb);
									brandListPage$[0].removeEventListener('pagehide', pageHideHandler, false);
								}).bind(null, vlist, isb);
								brandListPage$[0].addEventListener('pagehide', pageHideHandler, false);
							}, function(e) {
						console.log("Error " + e.message);
					}, "UTF-8");
					break;
				}
			}
		}
		console.log("success");
	}

	function onerrorFile(error) {
		console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	}

}

