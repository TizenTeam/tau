
var myctxpopup;
/*
function makeCall()
{
	Widget.Device.launchApplication(Widget.Device.ApplicationTypes.PHONECALL, contactInfo.phonenumber);
}

function openMoreUrl()
{
	//TODO
	Widget.Device.launchApplication(Widget.Device.ApplicationTypes.BROWSER, "www.google.com");
}
*/
function onmousedownTextAllContact()
{
}

function onmouseupTextAllContact()
{
}

function onclickTextBackToDetail()
{
}

function onclickTextBack()
{
    showView("aroundmeMapView");
}

function onclickAddContact()
{
	function getAddressBooksCB(addressbooks) 
    {
		if(addressbooks.length > 0) 
		{ 
			var addressbook = addressbooks[0]; 
			try{
			 var contact = addressbook.createContact( 
														{
														firstName:contactInfo.name,
														lastName:"",
														addresses:[	{types:['PREF'],country:contactInfo.address}],
																	
														phoneNumbers:[{number:contactInfo.phonenumber,types:['WORK']}]
														}); 
				addressbook.addContact(contactAddedCB, addContactErrorCallback, contact); 						
			}
			catch(error)
			{
			}
		} 
	}	

	deviceapis.pim.contact.getAddressBooks(getAddressBooksCB,  getAddressBooksErrorCallback); 
}

function contactAddedCB(response) 
{
	//alert("contact is created.");
} 

function getAddressBooksErrorCallback(response) 
{ 
} 

function addContactErrorCallback(response) 
{
	//alert("contact is not created.");
} 

function onclickSend()
{
	//TODO fix ctxpop_liststyle_textonly issue
	//var popupDialog = new ctxpopup("popupOverlayName", "ctxpop_liststyle_textonly", ["via message","via email"]);
	var ctxpopContent =  new Array("via message","via email");

    if(myctxpopup)
    {
        $(myctxpopup).remove();
    }

	myctxpopup = new ctxpopup("test_myctxpopup", "ctxpop_liststyle_textonly", ctxpopContent, null, null, null, null);

    $(myctxpopup).find('li').each(function()
	        {
	        	if($(this).attr("poplistindex") == 0)
        		{
        			$(this).find("a").attr("href", "sendmessage.html");
        		}
				else if($(this).attr("poplistindex") == 1)
        		{
        			$(this).find("a").attr("href", "sendemail.html");
        		}

				$(this).find("a").click(function(){
					$(myctxpopup).remove();
					});				
	        });
}

function getDetailConentData()
{
    var bodyContent = "";
	if (gDetailViewData.length == 0) 
    {
        return bodyContent;
    }

	if (gSource == "google")
	{
//		gDetailViewData = gDetailViewData[ginfoIndex];//gIndex
		bodyContent = "Title:" + gDetailViewData.title;
        bodyContent = bodyContent + "  Distance:" + gDistance[gIndex];

        var address = ((gDetailViewData.streetAddress.length > 0) ? (gDetailViewData.streetAddress + ", ") : "")
                + ((gDetailViewData.city.length > 0) ? (gDetailViewData.city + ", ") : "")
                + ((gDetailViewData.region.length > 0) ? (gDetailViewData.region + ", ") : "")
                + ((gDetailViewData.country.length > 0) ? (gDetailViewData.country) : "");

        if(address.lastIndexOf(",") == address.length - 2)
        {
            address = address.substr(0, address.length - 2);
        }
        
        bodyContent = bodyContent + "  Address:" + address;
    	bodyContent = bodyContent + "  Tel:" + ((gDetailViewData.phoneNumbers.length > 0)? gDetailViewData.phoneNumbers[0].number:"");
    	bodyContent = bodyContent +  " Category:" + "";
        bodyContent = bodyContent +  " Details:" + "";
	}
	else if (gSource == "foursquare")
	{
//		gDetailViewData = gFqSearch[ginfoIndex];//gIndex
		bodyContent = "Title:" + gDetailViewData.name;
        bodyContent = bodyContent + "  Distance:" + gDistance[gIndex];
        
        var address = ((gDetailViewData.address.length > 0) ? (gDetailViewData.address + ", ") : "")
                + ((gDetailViewData.city.length > 0) ? (gDetailViewData.city + ", ") : "")
                + ((gDetailViewData.state.length > 0) ? (gDetailViewData.state + ", ") : "");

        if(address.lastIndexOf(",") == address.length - 2)
        {
            address = address.substr(0, address.length - 2);
        }
        
        bodyContent = bodyContent + "  Address:" + address;
        
    	bodyContent = bodyContent + "  Tel:" + ((gDetailViewData.phone != undefined)?gDetailViewData.phone:"");
    	bodyContent = bodyContent +  " Category:" + contactInfo.category;
        bodyContent = bodyContent +  " Details:" + "";
	}

    return bodyContent;

}

function fillMsgContent()
{
    var bodyContent = getDetailConentData();
	document.getElementById('Msgbodycontent').value = bodyContent;
    document.getElementById('MsgToAddress').value = "";
    document.getElementById('MsgSubject').value = "";
}

function fillEmailContent()
{
    var bodyContent = getDetailConentData();
	document.getElementById('bodycontent').value = bodyContent;
    document.getElementById('ToAddress').value = "";
    document.getElementById('CCAddress').value = "";
    document.getElementById('Subject').value = "";
}

function sendMessage()
{
    var toAddress =document.getElementById('MsgToAddress').value;
    var subject = document.getElementById('MsgSubject').value;
    var body = document.getElementById('Msgbodycontent').value;
    var str = "mmsto:to=" + toAddress + "&amp;subject=" + subject + "&amp;body=" + body;
    //console.log(str);
    $("#msgsendbutton").attr('href', str);
/*
	var toAddress = document.getElementById('MsgToAddress').value;
	var toArray = [];
            
	if (toAddress == "")
	{
		alert("Enter receiver");
		return;
	}
	else
	{
		if(toAddress.search(";") != -1)
		{
			toArray = toAddress.split(";");
		}
		else
		{
			toArray[0] = toAddress;
		}
	}

	var msg = deviceapis.messaging.createMessage(deviceapis.messaging.TYPE_MMS); 
	msg.to = toArray; 
	msg.subject = document.getElementById('MsgSubject').value;
	msg.body = document.getElementById('Msgbodycontent').value;

	deviceapis.messaging.sendMessage( 
	function () { 
		alert("Sending success"); 
	}, 
	function () { 
		alert("Sending failed"); 
	}, 
	msg 
	); 
*/
}

function sendEmail()
{
    var toAddress =document.getElementById('ToAddress').value;
    var ccAddress = document.getElementById('CCAddress').value;
    var subject = document.getElementById('Subject').value;
    var body = document.getElementById('bodycontent').value;
    var str = "mailto:?to=" + toAddress +  "&amp;cc=" + ccAddress + 
                "&amp;subject=" + subject + "&amp;body=" + body;
    //console.log(str);
    $("#sendbutton").attr('href', str);
/*
	var toAddress =document.getElementById('ToAddress').value;
	var toArray = [];
	var ccArray = [];
	if (toAddress == "")
	{
		alert("Enter receiver");
		return;
	}
	else
	{
		if(toAddress.search(";") != -1)
		{
			toArray = toAddress.split(";");
		}
		else
		{
			toArray[0] = toAddress;
		}
	}

	var ccAddress = document.getElementById('CCAddress').value;
	if (ccAddress != "")
	{
		if(ccAddress.search(";") != -1)
		{
			ccArray = ccAddress.split(';');
		}
		else
		{
			ccArray[0] = ccAddress;
		}
	}
	
	var msg = deviceapis.messaging.createMessage(deviceapis.messaging.TYPE_EMAIL); 
	msg.to = toArray; 
	msg.cc = ccArray;
	
	msg.subject = document.getElementById('Subject').value;
	msg.body = document.getElementById('bodycontent').value;
	deviceapis.messaging.sendMessage( 
	function () { 
		alert("Sending success"); 
	}, 
	function () { 
		alert("Sending failed"); 
	}, 
	msg 
	); 
	*/
}

