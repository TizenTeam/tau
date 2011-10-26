// indicate the item number of your selection
var gIndex=0;
var gDetailViewData;

var gGoogleCategory = ["All", "Art", "Education", "Restaurants", "Travel", "Bar"];
var gfqCategory = ["", "Art", "Education", "Restaurants", "Travel", "Bar"];
var gGoogleCategoryImage = ["Aroundme_icon_Art.png", "Aroundme_icon_Art.png", "Aroundme_icon_College.png", "Aroundme_icon_Food.png", "Aroundme_icon_Home.png", "Aroundme_icon_Nightlife.png"];
var gGoogleCategoryQuery = ["category:all", "category:art", "category:education", "category:restaurants", "category:travel", "category:bar"];

var gDistance = new Array();

var searchMarker = new Array();
var searchInfoWindow = new Array();
var curmarker = null;
var gCustomInfoWindow;

var ME_LOCATION_LAT = 37.257762;
var ME_LOCATION_LNG = 127.053022;

////////
var gScriptArr = ["js/infowindow.js", "js/marker.js", "js/overlay.js", "js/foursquare.js", "js/favorite.js", "js/wac.js", "js/utils.js"];

var gLocalSearch;
var gMap;
var gInfoWindow;
var gSelectedResults = [];
var gCurrentResults = [];
var gSearchForm;
var gEnterMap = false;
var gQuery = "";
var gSearchKeyword = "";

//var meButton;
var meLocation;
var gMeAddress;
var gMeMarker = null;
var gMeSearch;
var ME_DISPLAY_TIME = 4000;
var gMeIcon;
var gMeInfoWindow;

////////
var contactInfo=new Object();

////////
var gSource = "google";
var gFqSearch = [];

////////
var gFavoriteList = new Array();
var myFavoriteList;
var gIsFavoriteBtnOn_google = new Array();
var gIsFavoriteBtnOn_4s = new Array();

////////
var ginfoIndex = 0;
var gFavoriteIndex = new Array();
var gEnterFavorite = false;

var gFavoriteType = new Array();