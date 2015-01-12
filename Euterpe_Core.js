//-----------------------------------------------------------------
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
if(Euterpe_Sys==undefined){
	var Euterpe_Sys=1;
	var EventMgrArray=new Array();
	var EuterpeObjectArray=new Array();
	var EuterpeTimeoutArray=new Array();
	var Euterpe_Const_TextUID="-100";
}
//-----------------------------------------------------------------
if(Array.indexOf==undefined)
{
	Array.prototype.indexOf=function(obj,start){
		 for(var i=(start||0),j=this.length;i<j;i++){
			 if(this[i]===obj){return i;}
		 }
		 return -1;
	}
}
if(String.substr==undefined)
{
  /**
   *  Get the substring of a string
   *  @param  {integer}  start   where to start the substring
   *  @param  {integer}  length  how many characters to return
   *  @return {string}
   */
  String.prototype.substr=function(substr){
    return function(start,length){
      if(start<0)start=this.length+start;
      return substr.call(this,start,length);
    }
  }(String.prototype.substr);
}
//-----------------------------------------------------------------
/******************************************************************
 * 	PixelTxtToNumber(Value)
 * 	Description: convert a string containing a value (for example 
 * 		"18px") in an integer value
 * 	Parameters:
 * 	+ Value: a string that contains value to convert
 * 	Return value: an integer that rappresent the value
 * 	Note: function can convert value in pixel (for example "18" or
 * 		"18px" are both converted in 18) but not in percentage ("18%"
 * 		cannot be converted)
 *****************************************************************/
function PixelTxtToNumber(Value){
	return parseInt(Value);
}
//-----------------------------------------------------------------
/****************************************************************** 
 * 	ParsePageParam(Src)
 * 	Description: split a link to page (with some parameters) in its
 * 		components
 * 	Parameters:
 * 	+Src: string that rappresent the link to split
 * 	Returned value: a bidimensional associative array composed by a
 * 		"Param" element and a "Value" element
 * 	Note: suppose you want to split this link
 * 		https://www.google.it/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=autodesk%20sketchbook
 * 	the function will return an array as follow
 * 	Return[0][Param]=sourceid
 * 	Return[0][Value]=chrome-instant
 * 	Return[1][Param]=ion
 * 	Return[1][Value]=1
 * 	Return[2][Param]=espv
 * 	Return[2][Value]=2
 * 	Return[3][Param]=ie
 * 	Return[3][Value]=UTF-8#q=autodesk%20sketchbook
 *****************************************************************/
function ParsePageParam(Src){
	var Out=new Array();
	var Tmp=Src.indexOf("?")+1;
	if(Tmp>0){
		var Wrk=Src.substring(Tmp);
		Tmp=Wrk.split("&");
		var b,c,d,e;
		for(var a=0;a<Tmp.length;a++){
			b=Tmp[a].indexOf("=");
			if(b!=-1){
				c=Tmp[a].substring(0,b);
				d=Tmp[a].substring(b+1);
				e={Param:c,Value:d};
				//Euterpe_Log(e.Param+" -> "+e.Value);
				Out.push(e);
			}
		}
	}
	return Out;
}
//-----------------------------------------------------------------
/****************************************************************** 
 *	Euterpe_GetCookie(CookieName)
 * 	Description: search the value of the cookie called "CookieName"
 * 	Parameters:
 * 	+CookieName: the name of the cookie you want to obtain
 * 	Returned value: the value of the cookie (as string) or undefined 
 * 		if the cookie doesn't exist
 * 	Note:
 *****************************************************************/
function Euterpe_GetCookie(CookieName){
	var Txt=document.cookie;
	if(Txt){
		var Ar=new Array();
		Ar=Txt.split(";");
		for(var a=0;a<Ar.length;a++){
			if(Ar[a].charAt(0)==' ')
				Ar[a]=Ar[a].substring(1,Ar[a].length);
			if(Ar[a].indexOf(CookieName)==0){
				Txt=Ar[a].substring(Ar[a].indexOf("=")+1,Ar[a].length);
				return Txt;
			}
		}
	}
	return undefined;
}
//-----------------------------------------------------------------
/****************************************************************** 
 *	Euterpe_SetCookie(CookieName,CookieValue,Life,LifeType)
 * 	Description: the function set a cookie
 * 	Parameters:
 * 	+CookieName: name of the cookie you want to set
 * 	+CookieValue: value of the cookie
 * 	+Life: how long does the cookie should exist
 * 	+Lifetype: says how parameter Life will work
 * 		Lifetype = "day" -> Life means days of life of the cookie
 * 		Lifetype = "hour" -> Life means hours of life of the cookie
 * 		Lifetype = "minute" -> Life means minutes of life of the cookie
 * 		Lifetype = "second" -> Life means seconds of life ot the cookie
 * 		Lifetype = any other value -> Life means days of life
 * 	Returned value: none
 * 	Note:
 *****************************************************************/
function Euterpe_SetCookie(CookieName,CookieValue,Life,LifeType){
	var Txt=CookieName+"="+CookieValue;
	var L;
	switch(LifeType){
		case "day":{
			L=Life*86400;
		}break;
		case "hour":{
			L=Life*3600;
		}break;
		case "minute":{
			L=Life*60;
		}break;
		case "second":{
			L=Life;
		}break;
		default:{
			L=Life*86400;
		};
	}
	if(Life)
		Txt=Txt+=";max-age="+L;
	document.cookie=Txt;
}
//-----------------------------------------------------------------
/******************************************************************
 * 	Euterpe_Object_Exist(ID) 
 * 	Description: function verify if object with id=ID exists or not
 * 	Parameters:
 * 	+ID: the id you want to search
 * 	Returned value: true if the id exists otherwise false
 * 	Note: this function search between HTML id 
 *****************************************************************/
function Euterpe_Object_Exist(ID){
	var Test=FindEuterpeObjectFromID(ID);
	if(Test==undefined)
		return false;
	return true;
}
//-----------------------------------------------------------------
/****************************************************************** 
 *	GetTxtMainObj(Obj)
 * 	Description: OBSOLETE
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
function GetTxtMainObj(Obj){
	var Ele=Obj;
	var UID=Ele.getAttribute("data-Euterpe_UID");
	while(UID==null){
		Ele=Ele.parentNode;
		if(Ele.getAttribute)
			UID=Ele.getAttribute("data-Euterpe_UID");	
		else
			break;
	}
	if(UID==Euterpe_Const_TextUID)
	{
		Ele=Ele.parentNode;
		if(Ele && Ele.getAttribute)
			UID=Ele.getAttribute("data-Euterpe_UID");	
	}
	return FindEuterpeObject(UID);
}
//-----------------------------------------------------------------
/******************************************************************
 * 	GetEuterpeObjFromMsg(Msg) 
 * 	Description: function process a message and search for the Euterpe 
 * 		the send it
 * 	Parameters:
 * 	+Msg: the message to process 
 * 	Returned value: the Euterpe element that send the message or undefined
 * 	Note: this is a generic function that search in a message created from
 * 		an user event (example of events may be onload, onmove, onmouseover...)
 *****************************************************************/
function GetEuterpeObjFromMsg(Msg){
	var Ele;
	Msg.target?Ele=Msg.target:Ele=Msg.srcElement;
	var UID;
	if(Ele.getAttribute){
		UID=Ele.getAttribute("data-Euterpe_UID");
		while(UID==null){
			Ele=Ele.parentNode;
			if(Ele){
				if(Ele.getAttribute)
					UID=Ele.getAttribute("data-Euterpe_UID");
				else
					break;
			}
			else
				break;
		}
		if(UID==Euterpe_Const_TextUID)
		{
			Ele=Ele.parentNode;
			if(Ele && Ele.getAttribute)
				UID=Ele.getAttribute("data-Euterpe_UID");
			else
				UID=-200;
		}
	}
	var Obj=FindEuterpeObject(UID);
	return Obj;
}
//-----------------------------------------------------------------
/******************************************************************
 *	ObjCoordinatesToScreen(Obj,x,y) 
 * 	Description: converts the relative coordinates of an object to screen
 * 		absolute coordinates
 * 	Parameters:
 * 	+Obj: the object you want to inspect
 * 	+x: the horizontal coordinate
 * 	+y: vertical coordinate
 * 	Returned value: return an object Out -> 
 * 		Out.x: absolute coordinate x
 * 		Out.y: absolute coordinate y
 * 	Note: suppose you want to have the screen absolute coordinates of the
 * 		upper left corner (0,0) placed in screen at (100,10). The function
 * 		will return (100,10)
 *****************************************************************/
function ObjCoordinatesToScreen(Obj,x,y){
	var Out={};
	var obj=Obj;
	Out.x=obj.GetLeft()+x;
	Out.y=obj.GetTop()+y;
	while(obj.Dad!=undefined){
		Out.x+=obj.Dad.GetLeft();
		Out.y+=obj.Dad.GetTop();
		obj=obj.Dad;
	}
	return Out;
}
//-----------------------------------------------------------------
/****************************************************************** 
 *	ScreenCoordinatesToObj(Obj,x,y)
 * 	Description: converts screen absolute coordinates to object relative
 * 	Parameters:
 * 	+Obj: the object you want to inspect
 * 	+x: horizontal coordinate
 * 	+y: vertical coordinate
 * 	Returned value: an object Out composed by Out.x and Out.y
 * 		Out.x	->	x relative coordinate
 * 		Out.y	->	y relative coordinate
 * 	Note: suppose you want to define the screen absolute point (100,100)
 * 		relative to object place absolute at (100, 50). Function will return
 * 		Out.x = 0, Out.y = 50
 *****************************************************************/
function ScreenCoordinatesToObj(Obj,x,y){
	var Tmp=ObjCoordinatesToScreen(Obj,0,0);
	var Out={};
	Out.x=x-Tmp.x;
	Out.y=y-Tmp.y;
	return Out;
}
//-----------------------------------------------------------------
/******************************************************************
 *	GetWindowHeight() 
 * 	Description: return the height of the browser window
 * 	Parameters:
 * 	Returned value: window height in pixel (as integer)
 * 	Note:
 *****************************************************************/
function GetWindowHeight(){
	var Br=GetBrowser();
	switch(Br){
		case "MSIE":{
			if(window.innerHeight==undefined)
				return document.documentElement.clientHeight;
			else	
				return window.innerHeight;
		};
		default:{
			return window.innerHeight;
		};
	}
}
/******************************************************************
 *	GetWindowWidth() 
 * 	Description: return width of browser windows
 * 	Parameters:
 * 	Returned value: width of window in pixel (as integer)
 * 	Note:
 *****************************************************************/
function GetWindowWidth(){
	var Br=GetBrowser();
	switch(Br){
		case "MSIE":{
			if(window.innerWidth==undefined)
				return document.documentElement.clientWidth;
			else
				return window.innerWidth;
		};
		default:{
			return window.innerWidth;
		};
	}	
}
//-----------------------------------------------------------------
/******************************************************************
 *	GetScrollX() 
 * 	Description: return window horizontal scroll 
 * 	Parameters:
 * 	Returned value: horizontal scroll in pixel (as integer)
 * 	Note:
 *****************************************************************/
function GetScrollX(){
	if(window.scrollX!=undefined)
		return window.scrollX;
	else
		return document.documentElement.scrollLeft;
}
/******************************************************************
 *	GetScrollY() 
 * 	Description: return vertical scroll of the browser
 * 	Parameters:
 * 	Returned value: vertical scroll in pixel (as integer)
 * 	Note:
 *****************************************************************/
function GetScrollY(){
	if(window.scrollY!=undefined)
		return window.scrollY;
	else
		return document.documentElement.scrollTop;
}
//-----------------------------------------------------------------
/****************************************************************** 
 *	GetDocumentWidth()
 * 	Description: return width of the document (page)
 * 	Parameters:
 * 	Returned value: width of document (as integer)
 * 	Note:
 *****************************************************************/
function GetDocumentWidth()
{
	if(document.body)
		return Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth,document.documentElement.offsetWidth);
	else
		return 0;
}
/****************************************************************** 
 *	GetDocumentHeight()
 * 	Description: return height of the document (page)
 * 	Parameters:
 * 	Returned value: height of document in pixel as integer
 * 	Note:
 *****************************************************************/
function GetDocumentHeight()
{
	if(document.body)
		return Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight,document.documentElement.offsetHeight);
	return 0;
}
//-----------------------------------------------------------------
/******************************************************************
 *	Event_Mgr(Event_Str,Func,UID_Owner) 
 * 	Description: creates a new Event_Mgr object. This object is used by
 * 		Euterpe elements to process event 
 * 	Parameters:
 * 	+Event_Str: string with element to manage. Both system event ("onload",
 * 			"onmouseover",....) and user event are accepted
 * 	+Func: function called when event Event_Str happens
 * 	+UID_Owner: UID (Euterpe Unique ID) of the Euterpe element that process
 * 			event
 * 	Returned value: the Event_Mgr object created
 * 	Note: Event_Mgr is composed as follow
 * 		Event_Mgr.Event ->	the event
 * 		Event_Mgr.Func	->	function called
 * 		Event_Mgr.UID_Mgr	->	UID of the event processor
 * 		Event_Mgr.LastEvent	->	integer not used	
 *****************************************************************/
function Event_Mgr(Event_Str,Func,UID_Owner){
	if(Event_Str!=undefined)
		this.Event=Event_Str;
	else	
		this.Event="";
	if(Func!=undefined)
		this.Func=Func;
	else	
		this.Func=null;
	if(UID_Owner!=undefined)
		this.UID_Mgr=UID_Owner;
	else
		this.UID_Mgr=0;
	this.LastEvent=0;
}
//-----------------------------------------------------------------
/******************************************************************
 *	Timeout_Mgr(Handle,UID,Sender) 
 * 	Description: OBSOLETE????
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
function Timeout_Mgr(Handle,UID,Sender){
	if(Handle)
		this.Handle=Handle;
	else
		this.Handle=0;
	if(UID)
		this.UID=UID;
	else
		this.UID=-1;
	if(Sender)
		this.Sender=Sender;
	else
		this.Sender=null;
}
//-----------------------------------------------------------------
/****************************************************************** 
 *	Euterpe_Log(StringToLog)
 * 	Description: create a log to browser console (if available)
 * 	Parameters:
 * 	+StringToLog: string to send to console
 * 	Returned value:
 * 	Note:
 *****************************************************************/
function Euterpe_Log(StringToLog){
	if(window.console)
		console.log(StringToLog);
}
//-----------------------------------------------------------------
/****************************************************************** 
 *	GetEuterpePage()
 * 	Description: return the Euterpe_Page element
 * 	Parameters:
 * 	Returned value: the Euterpe_Page element
 * 	Note:
 *****************************************************************/
function GetEuterpePage(){
	var Txt;
	for(var a=0;a<EuterpeObjectArray.length;a++)
	{
		if(EuterpeObjectArray[a].Element.getAttribute)
		{
			Txt=EuterpeObjectArray[a].Element.getAttribute("data-Euterpe_Type");
			if(Txt=="Euterpe_Page")
				return EuterpeObjectArray[a];
		}
	}
	return undefined;
}
//-----------------------------------------------------------------
/****************************************************************** 
 *	GetElementouterHTML(Element)
 * 	Description: return complete HTML element that compose an Euterpe 
 * 		object
 * 	Parameters:
 * 	+Element: the javascript element you want to obtain
 * 	Returned value: the complete HTML as string
 * 	Note:
 *****************************************************************/
function GetElementouterHTML(Element){
	if(Element.outerHTML)
		return Element.outerHTML;
	else
		return new XMLSerializer().serializeToString(Element)
}
//-----------------------------------------------------------------
/********************************************************
*	FindEuterpeObject
*	Description: find an Euterpe object by its UID (Unique ID)
*	@param UID: the UID of the object
*	@returns: the object if exists or undefined
*	Note:
********************************************************/
function FindEuterpeObject(UID){
	for(var a=0;a<EuterpeObjectArray.length;a++)
	{
		if(EuterpeObjectArray[a].GetUID()==UID)
			return EuterpeObjectArray[a];
	}
	return undefined;
}
//-----------------------------------------------------------------
/********************************************************
*	FindEuterpeObjectFromID
*	Description: retrieve an Euterpe object with a specified HTML id
*	@param ID: the HTML/javascript to search
*	@returns: the Euterpe object found or undefined if it doesn't exist
*	Note:
********************************************************/
function FindEuterpeObjectFromID(ID){
	for(var a=0;a<EuterpeObjectArray.length;a++)
	{
		if(EuterpeObjectArray[a].GetID()==ID)
			return EuterpeObjectArray[a];
	}
	return undefined;
}
//-----------------------------------------------------------------
/********************************************************
*	GetElementTextHeight
*	Description: retrieve text height in pixel of the specified
*				javascript element
*	@param Element: javascript element to analize
*	@param Txt: the string text you want to measure
*	@returns: height in pixel of the text
*	Note: this function is usefull if you want to discovered height
*		of a specified text in a particular element
********************************************************/
function GetElementTextHeight(Element,Txt){
	var Tmp=document.createElement("span");
	Tmp.innerHTML=Txt;
	var Out;
	if(Element){
		Element.appendChild(Tmp);
		Out=Tmp.offsetHeight;
		Element.removeChild(Tmp);
	}	
	return Out;
}
//-----------------------------------------------------------------
/********************************************************
*	GetElementTextWidth
*	Description: retrieve text width in pixel of the specified
*				javascript element
*	@param Element: javascript element to analize
*	@param Txt: the string text you want to measure
*	@returns: width in pixel of the text
*	Note:this function is usefull if you want to discovered width
*		of a specified text in a particular element
********************************************************/
function GetElementTextWidth(Element,Txt){
	var Tmp=document.createElement("span");
	Tmp.innerHTML=Txt;
	var Out;
	if(Element){
		Element.appendChild(Tmp);
		Out=Tmp.offsetWidth;
		Element.removeChild(Tmp);
	}
	return Out;
}
//-----------------------------------------------------------------
/********************************************************
*	GetTextWithoutSpace
*	Description: return a string without spaces
*	@param Txt: string you want to modify
*	@returns {String}: original string without spaces
*	Note:
********************************************************/
function GetTextWithoutSpace(Txt){
	var Out="";
	if(Txt!=null && Txt!=undefined)
	{
		for(var a=0;a<Txt.length;a++)
		{
			if(Txt.charAt(a)!=' ')
				Out += Txt.charAt(a);
			else
				Out += '_';
		}		
	}
	return Out;	
}
//-----------------------------------------------------------------
/********************************************************
*	FindEuterpeUID
*	Description: generates an UID for a new Euterpe object
*	@returns {Number}: the new UID
*	Note: do not use!!! This function is used by the system
********************************************************/
function FindEuterpeUID(){
	if(document.body!=null)
	{
		var M=0;
		var L=document.body.getElementsByTagName("*");
		var Ele;
		var UID=0;
		for(var a=0;a<L.length;a++)
		{
			Ele=L.item(a);
			if(Ele.innerHTML!=undefined)
			{
				UID=L[a].getAttribute("data-Euterpe_UID");
				if(UID!=null)
				{
					if(UID >= M)
					{
						UID++;
						M=UID;
					}
				}
			}
		}
		return M;
	}
	return 0;
}
//-----------------------------------------------------------------
/********************************************************
*	FindElementByEuterpeUID
*	Description: retrieve a javascript element from the UID of an Euterpe
*			object
*	@param Euterpe_UID: the UID of the Euterpe object that contains element
*			you want to obtain
*	@returns: desired element (if exist) or undefined
*	Note:
********************************************************/
function FindElementByEuterpeUID(Euterpe_UID){
	var L=document.body.getElementsByTagName("*");
	var Ele;
	var Value;
	for(var a=0;a<L.length;a++)
	{
		Ele=L.item(a);
		if(Ele.innerHTML!=undefined)
		{
			Value=Ele.getAttribute("data-Euterpe_UID");
			if(Value==Euterpe_UID)
			{
				return Ele;
			}
		}
	}
	return undefined;
}
//-----------------------------------------------------------------
/********************************************************
*	GetBrowser
*	Description: retrieve the name of the browser 
*	@returns {String}: one of the following string
*		"MSIE"		->	Internet Explorer
*		"Chrome"	->	Chrome
*		"Firefox"	->	Firefox
*		"Opera"		->	Opera
*		"Safari"	->	Safari
*		"Default"	->	Unkwown browser
*	Note:
********************************************************/
function GetBrowser(){
	var Txt=navigator.userAgent;
	if(Txt.indexOf("MSIE")!=-1)
		return "MSIE";
	else
	{
		if(Txt.indexOf("Chrome")!=-1)
			return "Chrome";
		else
		{
			if(Txt.indexOf("Firefox")!=-1)
				return "Firefox";
			else
			{
				if(Txt.indexOf("Opera")!=-1)
					return "Opera";
				else
				{
					if(Txt.indexOf("Safari")!=-1)
						return "Safari";
					else
						return "Default";
				}
			}
		}
	}
}
//-----------------------------------------------------------------
/********************************************************
*	GetBrowserVer
*	Description: retrive version of the browser
*	@returns: browser version as number
*	Note:
********************************************************/
function GetBrowserVer(){
	var Browser=GetBrowser();
	var Txt=navigator.userAgent;
	var Idx=Txt.indexOf(Browser)+Browser.length;
	switch(Browser){
		case "Chrome":
		case "Firefox":
		case "Opera":{
			var Value=parseFloat(Txt.substring(Idx+1));
			return Value;
		}
		case "Safari":{
			Idx=Txt.indexOf("Version")+7;
			var Value=parseFloat(Txt.substring(Idx+1));
			return Value;			
		}
		case "MSIE":{
			var Value=new Number(Txt.substr(Idx+1,3));
			return Value;
		}break;
	}
}	
//-----------------------------------------------------------------
/********************************************************
*	GetBrowserLanguage
*	Description: retrieve language of the browser
*	@returns: a string with browser language (2 character)
*	Note:
********************************************************/
function GetBrowserLanguage(){	
	if(window.navigator.userLanguage)
		return window.navigator.userLanguage;
	var Txt=window.navigator.language;
	return Txt.substring(0,2);
}
//-----------------------------------------------------------------
/********************************************************
*	EuterpeSetElementStyleProperty
*	Description: the function set a style attribute of the specified 
*			HTML/javascript element
*	@param Element: element you want to change
*	@param Property: property you want to set or change
*	@param Value: new value of the property
*	@returns {String}: return the modified style property
*	Note:
********************************************************/
function EuterpeSetElementStyleProperty(Element,Property,Value){
	var Orig;
	var isIE=false;
    if(GetBrowser()=="MSIE")
    {
		if(Element.style)
			Orig=Element.style.cssText;
		Orig+=";";
        isIE=true;
    }
    else
    {
   		if(Element.getAttribute)
			Orig=Element.getAttribute("style");
    }
	var Out="";
	var Found=false;
	if(Orig){
		var Ar=Orig.split(";");
		var Name,Val;
		var Idx;
		for(var a=0;a<Ar.length;a++){
			Name="";
			Val="";
			if(Ar[a].length>0){
				Idx=Ar[a].indexOf(":");
				if(Idx!=-1){
					Name=Ar[a].substr(0,Idx);
					Val=Ar[a].substr(Idx+1);
					if(Name.toUpperCase()==Property.toUpperCase()){
						if(Value){
							Out+=Name+":"+Value+";";
							Found=true;
						}
					}
					else{
						if(Val!="")
							Out+=Name+":"+Val+";";
					}
				}
			}
		}	
	}
	if(Found==false){
		if(Value){
			if(Value!="")
				Out+=Property+":"+Value+";";
		}	
	}
    if(isIE)
	{
		if(Element.style)
			Element.style.cssText=Out;
	}
    else
    {
    	if(Element.setAttribute)
        	Element.setAttribute("style",String(Out));
    }	
	return Out;
}
//-----------------------------------------------------------------
/********************************************************
*	ThemeTypeApplication
*	Description: executed at object creation
*	@param Msg: Euterpe_Create event message
*	Note: DO NOT USE IN SCRIPT
********************************************************/
function ThemeTypeApplication(Msg){
	if(Msg.ObjCreated.GetAttribute){	
		var Type=Msg.ObjCreated.GetAttribute("data-Euterpe_Type");
		if(Msg.ObjCreated.SetThemeType)
			Msg.ObjCreated.SetThemeType(Type);
	}
}
//-----------------------------------------------------------------
/********************************************************
 *  Euterpe_Core_Obj
 *  Description: this is main and first Euterpe object. All other
 *  	objects inherits from its
 *  Local parameter:
 *  	+this.Element: javascript element that contains/manage Euterpe object
 *  	+this.TextElement: javascript element that contains Euterpe object text (if any)
 *  	+this.Dad: the Euterpe object owner of this object
 *  	+this.Browser: name of the browser (see GetBrowser)
 *  	+this.BrowserVer: version of the browser (see GetBrowserVer)
 *  	+this.EventDistance: OBSOLETE
 *  	+this.CheckPageBorder: if true, the position of this object is correct with Euterpe_Page
 *  				position
 *  	+this.LastShowTime: value in milliseconds used when this object is show/hide
 *  	+this.AdditionalInfo: magic/multifunction properties (can contain every kind of data
 *  	+this.EventList: array that contains event and function managed from this object
 *  Internal parameter:
 *  	-NormalClass: the css class normally applied to this object/element
 *  	-HoverClass: NOT USED
 *  	-ActiveClass: NOT USED
 *  	-SelfObj: a copy of this object (OBSOLETE)
 *  	-HTMLObj: NOT USED
 *  Local function:
 *  	+this.SetStyleProperty
 *  	+this.GetStyleProperty
 *  	+this.SetAttribute
 *  	+this.GetAttribute
 *  	+this.Create
 *  	+this.GetInnerHeight
 *  	+this.GetInnerWidth
 *  	+this.ApplyClass
 *  	+this.GetBorderSize
 *  	+this.GetPadding
 *  	+this.GetMargin
 *  	+this.SetWidth
 *  	+this.SetHeight
 *  	+this.SetLeft
 *  	+this.SetTop
 *  	+this.GetTop
 *  	+this.GetLeft
 *  	+this.GetBottom
 *  	+this.GetRight
 *  	+this.GetWidth
 *  	+this.GetHeight
 *  	+this.GetElement  
 *  	+this.GetUID
 *		+this.SetID
 *		+this.GetID
 *		+this.Show
 *		+this.Hide
 *		+this.Showed
 *		+this.BaseSetText  
 *		+this.SetText
 *  	+this.GetText
 *  	+this.ClearEventMgr
 *  	+this.ClearCustomEventMgr
 *  	+this.RemoveEventMgr
 *  	+this.RemoveCustomEventMgr
 *  	+this.AddFunctionListener
 *  	+this.AddEventMgr
 *  	+this.AddCustomEventMgr
 *  	+this.SetEventMgr
 *  	+this.SetCustomEventMgr
 *  	+this.EventMgr
 *  	+this.Place
 *  	+this.HideChild
 *  	+this.ShowChild
 *  	+this.AutoApplyClass
 *  	+this.CheckBorder
 *  	+this.GetType
 *  	+this.Destroy
 *  	+this.ParentAlignTop
 *  	+this.ParentAlignMiddle
 *  	+this.ParentAlignBottom
 *  	+this.ParentAlignLeft
 *  	+this.ParentAlignCenter
 *  	+this.ParentAlignRight
 *  	+this.SetHTML
 *  	+this.OptimizeMouseOut
 *  	+this.MakeUnselectable
 *  	+this.GetZIndex
 *  	+this.GetChildWidth
 *  	+this.GetChildHeight
 *  	+this.GetEuterpeChild
 *  	+this.GetMaxChildZ
 *  	+this.SetMinWidth
 *  	+this.SetMinHeight
 *  	+this.SetThemeType
 * 	Global:
 * 		-MouseOver
 * 		-MouseMove
 * 		-MouseGenericClick
 ********************************************************/
function Euterpe_Core_Obj(HTML_Tag){
	this.Element=null;
	this.TextElement=null;
	this.Dad=null;
	this.Browser;
	this.BrowserVer;
	this.EventDistance=100;
	this.CheckPageBorder=false;
	this.LastShowTime;
	this.AdditionalInfo;
	this.EventList;
	var NormalClass;
	var HoverClass;
	var ActiveClass;
	var SelfObj;
	var HTMLObj=null;
	/****************************************************************** 
	 *	SetStyleProperty
	 * 	Description: set property of style attribute of objects element
	 * 	Parameters:
	 * 	+Property_Name: property to change
	 * 	+Property_Value: new value of the property
	 * 	Returned value:
	 * 	Note:
	 *****************************************************************/
	this.SetStyleProperty=function(Property_Name, Property_Value){
		if(this.Element){
			EuterpeSetElementStyleProperty(this.Element,Property_Name,Property_Value);
			EuterpeChangeStylePropertyEvent(this,Property_Name,Property_Value);
		}
	}
	/****************************************************************** 
	 * 	GetStyleProperty
	 * 	Description: retrieve the value of a property of the style
	 * 	Parameters:
	 * 	+Property_Name: name of the property
	 * 	Returned value: property value or undefined if not set
	 * 	Note:
	 *****************************************************************/
	this.GetStyleProperty=function(Property_Name){
		if(window.getComputedStyle)
			return this.Element.style.getPropertyValue(Property_Name);
		else
		{
			if(this.Element.currentStyle)
				return this.Element.currentStyle[Property_Name];		
		}
		return undefined;
	}
	/****************************************************************** 
	 *	SetAttribute
	 * 	Description: create or change an attribute of objects element
	 * 	Parameters:
	 * 	+Attr: attribute to set
	 * 	+Value: value of the attribute
	 * 	Returned value:
	 * 	Note:
	 *****************************************************************/
	this.SetAttribute=function(Attr,Value){
		this.Element.setAttribute(Attr,Value);
	}
	/****************************************************************** 
	 * 	GetAttribute
	 * 	Description: retrive an attribute of objects element
	 * 	Parameters:
	 * 	+Attr: attribute to retrive
	 * 	Returned value: attributes value or undefined if attribute not exist
	 * 	Note:
	 *****************************************************************/
	this.GetAttribute=function(Attr){
		var a=this.Element.getAttribute(Attr);
		if(a==null){
			for(var b=0;b<this.Element.attributes.length;b++){
				if(this.Element.attributes[b].name==Attr)
					return this.Element.attributes[b].value;
			}
		}
		return a;
	}
	/****************************************************************** 
	 *	Create
	 * 	Description: base creation routine of object
	 * 	Parameters:
	 * 	+Tag: tag used to create element in HTML DOM
	 * 	Returned value: javascript element attached to object
	 * 	Note:
	 *****************************************************************/	
	this.Create=function(Tag){
		var User=new String(window.navigator.userAgent);
		this.Browser=GetBrowser();
		this.BrowserVer=GetBrowserVer();
		this.EventList=new Array();
		this.Element=document.createElement(Tag);
		this.SetStyleProperty("position","absolute");
		var a=FindEuterpeUID();
		this.SetAttribute("data-Euterpe_UID",a);
		this.SetAttribute("data-Euterpe_Type","Euterpe_Obj");
		this.SetID("Euterpe_"+a);
		this.Show();
		EuterpeObjectArray.push(this);
		this.SetStyleProperty("z-index",0);
		//this.AddCustomEventMgr("Euterpe_Create",this.AutoApplyClass);
		this.AddCustomEventMgr("Euterpe_Create",ThemeTypeApplication);
		if(this.Element.addEventListener)
		{
			this.Element.addEventListener("mouseover",MouseOver,false);
			this.Element.addEventListener("mousemove",MouseMove,false);
			this.Element.addEventListener("click",MouseGenericClick,false);
		}
		else
		{
			this.Element.attachEvent("onmouseover",MouseOver);		
			this.Element.attachEvent("onmousemove",MouseMove);
			this.Element.attachEvent("onclick",MouseGenericClick);
		}
		SelfObj=this;
		return this.Element;
	}
	/****************************************************************** 
	 * 	GetInnerHeight
	 * 	Description: retrieve inner height of the object
	 * 	Parameters:
	 * 	Returned value: the inner height in pixel
	 * 	Note:
	 *****************************************************************/	
	this.GetInnerHeight=function(){
		return this.GetHeight()-this.GetBorderSize("bottom")-this.GetBorderSize("top");
	}
	/****************************************************************** 
	 * 	GetInnerWidth
	 * 	Description: retrieve inner width of the object
	 * 	Parameters:
	 * 	Returned value: the inner width in pixel
	 * 	Note:
	 *****************************************************************/	
	this.GetInnerWidth=function(){
		return this.GetWidth()-this.GetBorderSize("left")-this.GetBorderSize("right");
	}
	/********************************************************
	*	ApplyClass
	*	Description: apply a class to element connected 
	*	@param Class_Name: name of the class to apply
	*	Note:
	********************************************************/
	this.ApplyClass=function(Class_Name){
		if(this.Element!=null)
		{
			if(Class_Name!=undefined)
			{
				var Old=this.Element.className;
				this.Element.className=Class_Name;
				NormalClass=Class_Name;
				EuterpeChangeClassEvent(this,Old,Class_Name);
			}
		}
	}	
	/****************************************************************** 
	 *	GetBorderSize
	 * 	Description: retrieve size in pixel of the border
	 * 	Parameters:
	 * 	+Border: one of the following string
	 * 		"left"	->	return left border size
	 * 		"right"	->	return right border size
	 * 		"top"	->	return top border size
	 * 		"bottom"->	return bottom border size
	 * 	Returned value: see above
	 * 	Note:
	 *****************************************************************/	
	this.GetBorderSize=function(Border){
		var Out=0;
		if(GetBrowser()=="MSIE")
		{
			var Value=0;
			switch(Border){
				case "left":{Value=this.Element.currentStyle.borderLeftWidth;}break;
				case "right":{Value=this.Element.currentStyle.borderRightWidth;}break;
				case "top":{Value=this.Element.currentStyle.borderTopWidth;}break;
				case "bottom":{Value=this.Element.currentStyle.borderBottomWidth;}break;	
			}
			Value=String(Value);
			if(Value=="medium")
				Value="0px";
			if(this.Element.currentStyle.borderStyle=="none")
				Value="0px";
			if(Value.lastIndexOf("px"))
				Value=Value.substr(0,Value.length-2);
			Out=new Number(Value);
		}
		else
		{
			var S;
			if(window.getComputedStyle)
				S=window.getComputedStyle(this.Element,"");
			var Value=S.getPropertyValue("border-"+Border+"-width");
			if(Value!=null && Value!=undefined)
			{
				if(Value.indexOf("px")!=-1)
				{
					Value=Value.substr(0,Value.indexOf("px"));
					Out=new Number(Value);
				}
			}		
		}
		return Out;
	}
	/****************************************************************** 
	 * 	GetPadding
	 * 	Description: retrieve size in pixel of the padding
	 * 	Parameters:
	 * 	+Border: one of the following string
	 * 		"left"	->	return left padding size
	 * 		"right"	->	return right padding size
	 * 		"top"	->	return top padding size
	 * 		"bottom"->	return bottom padding size
	 * 	Returned value: see above
	 * 	Note:
	 *****************************************************************/	
	this.GetPadding=function(Border){
		var Out=0;
		if(this.Browser=="MSIE")
		{
			var Value=0;
			switch(Border){
				case "left":{Value=this.Element.currentStyle.paddingLeft;}break;
				case "right":{Value=this.Element.currentStyle.paddingRight;}break;
				case "top":{Value=this.Element.currentStyle.paddingTop;}break;
				case "bottom":{	Value=this.Element.currentStyle.paddingBottom;}break;	
			}
			Value=String(Value);
			if(Value=="medium")
				Value="3px";
			if(Value.lastIndexOf("px"))
				Value=Value.substr(0,Value.length-2);			
			Out=new Number(Value);
		}
		else
		{
			var S=window.getComputedStyle(this.Element,"");
			var Value=S.getPropertyValue("padding-"+Border);
			if(Value!=null && Value!=undefined)
			{
				if(Value.indexOf("px")!=-1)
				{
					Value=Value.substr(0,Value.indexOf("px"));
					Out=new Number(Value);
				}
			}		
		}
		return Out;
	}	
	/****************************************************************** 
	 * 	GetMargin
	 * 	Description: retrieve size in pixel of the margin
	 * 	Parameters:
	 * 	+Border: one of the following string
	 * 		"left"	->	return left margin size
	 * 		"right"	->	return right margin size
	 * 		"top"	->	return top margin size
	 * 		"bottom"->	return bottom margin size
	 * 	Note:
	 *****************************************************************/	
	this.GetMargin=function(Border){
		var Out=0;
		if(this.Browser=="MSIE")
		{
			var Value=0;
			switch(Border){
				case "left":{Value=this.Element.currentStyle.marginLeft;}break;
				case "right":{Value=this.Element.currentStyle.marginRight;}break;
				case "top":{Value=this.Element.currentStyle.marginTop;}break;
				case "bottom":{Value=this.Element.currentStyle.marginBottom;}break;	
			}
			Value=String(Value);
			if(Value=="medium")Value="3px";
			if(Value=="auto")Value="0px";
			if(Value.lastIndexOf("px"))	Value=Value.substr(0,Value.length-2);			
			Out=new Number(Value);
		}
		else
		{
			var S=window.getComputedStyle(this.Element,"");
			var Value=S.getPropertyValue("margin-"+Border);
			if(Value!=null && Value!=undefined)
			{
				if(Value.indexOf("px")!=-1)
				{
					Value=Value.substr(0,Value.indexOf("px"));
					Out=new Number(Value);
				}
			}		
		}
		return Out;
	}	
	/********************************************************
	*	SetWidth
	*	Description: set width of the object (property width in style attribute)
	*	@param Width_Str: new value of width
	*	Note:
	********************************************************/
	this.SetWidth=function(Width_Str){
		var W=this.GetWidth();
		var H=this.GetHeight();
		if(this.Browser=="MSIE")this.SetStyleProperty("width","");
		var Check = this.GetAttribute("data-ObjMinWidth");
		if(Check!=null){
			if(PixelTxtToNumber(Check)<PixelTxtToNumber(Width_Str))
				Width_Str=Check;
		}		
		this.SetStyleProperty("width",Width_Str);
		if(this.TextElement)
			EuterpeSetElementStyleProperty(this.TextElement,"width",Width_Str);
		EuterpeResizeEvent(this,W,H,this.GetWidth(),this.GetHeight());
	}
	/********************************************************
	*	SetHeight
	*	Description: set height of the object (property height in style attribute)
	*	@param Height_Str: new value of height
	*	Note:
	********************************************************/
	this.SetHeight=function(Height_Str){
		var W=this.GetWidth();
		var H=this.GetHeight();	
		if(this.Browser=="MSIE")
			this.SetStyleProperty("height","");
		var Check = this.GetAttribute("data-ObjMinHeight");
		if(Check!=null){
			if(PixelTxtToNumber(Check)<PixelTxtToNumber(Height_Str))
				Height_Str=Check;
		}
		this.SetStyleProperty("height",Height_Str);
		EuterpeResizeEvent(this,W,H,this.GetWidth(),this.GetHeight());
	}
	/********************************************************
	*	SetLeft
	*	Description: set left position of the object (property left in style attribute)
	*	@param Left_Str: new value of left position
	*	Note:
	********************************************************/	
 	this.SetLeft=function(Left_Str){
		var L=this.GetLeft();
		var System=this.GetStyleProperty("position");
		var Compensate=false;
		if(System=="relative")
			Compensate=true;
		if(!Compensate)		
			this.SetStyleProperty("left",Left_Str);
		else
		{
			this.SetStyleProperty("left","0px");
			var Tmp=this.GetLeft();
			this.SetStyleProperty("left",Left_Str);
			Tmp=this.GetLeft() - (Tmp*2);
			if(this.CheckPageBorder)
			{
				var Page=GetEuterpePage();
				if(Page!=undefined)
				{
					var Value=Page.GetBorderSize("left");
					if(Value==null || Value==undefined)
						Value=0;
					Tmp-=Value;
				}				
			}			
			this.SetStyleProperty("left",Tmp+"px");		
		}
		EuterpeMoveEvent(this,this.GetTop(),L,this.GetTop(),this.GetLeft());
	}
	/********************************************************
	*	SetTop
	*	Description: set top position of the object (property top in style attribute)
	*	@param Top_Str: new value of top position
	*	Note:
	********************************************************/	
	this.SetTop=function(Top_Str){
		var T=this.GetTop();
		var System=this.GetStyleProperty("position");
		var Compensate=false;
		if(System=="relative")
			Compensate=true;
		if(!Compensate)
			this.SetStyleProperty("top",Top_Str);
		else
		{
			this.SetStyleProperty("top","0px");
			var Tmp=this.GetTop();
			this.SetStyleProperty("top",Top_Str);
			Tmp=this.GetTop() - (Tmp*2);
			if(this.CheckPageBorder)
			{
				var Page=GetEuterpePage();
				if(Page!=undefined)
				{
					var Value=Page.GetBorderSize("left");
					if(Value==null || Value==undefined)
						Value=0;
					Tmp-=Value;
				}				
			}
			this.SetStyleProperty("top",Tmp+"px");
		}
		EuterpeMoveEvent(this,T,this.GetLeft(),this.GetTop(),this.GetLeft());
	}
	/********************************************************
	*	GetTop
	*	Description: retrieve top position of the object
	*	@returns: top position or undefined 
	*	Note:
	********************************************************/	
	this.GetTop=function(){
		if(this.Element!=null)
		{
			if(!this.CheckPageBorder)
				return this.Element.offsetTop;
			else
			{	
				var Page=GetEuterpePage();
				if(Page!=undefined)
				{
					var Value=Page.GetBorderSize("top");
					if(Value==null || Value==undefined)
						Value=0;
				}
				else
					var Value=0;
				return this.Element.offsetTop - Value;
			}			
		}
		return undefined;
	}
	/********************************************************
	*	GetLeft
	*	Description: retrieve left position of the object
	*	@returns: left position or undefined
	*	Note:
	********************************************************/	
	this.GetLeft=function(){
		if(this.Element!=null)
		{
			if(!this.CheckPageBorder)
				return this.Element.offsetLeft;
			else
			{	
				var Page=GetEuterpePage();
				if(Page!=undefined)
				{
					var Value=Page.GetBorderSize("left");
					if(Value==null || Value==undefined)
						Value=0;
				}
				else
					var Value=0;
				return this.Element.offsetLeft - Value;;
			}
		}
		return undefined;
	}
	/********************************************************
	*	GetBottom
	*	Description: retrieve bottom of the object (top + height)
	*	@returns: bottom position
	*	Note:
	********************************************************/	
	this.GetBottom=function(){
		if(this.Element)
			return this.GetTop()+this.GetHeight();
		return undefined;
	}
	/********************************************************
	*	GetRight
	*	Description: retrieve right of the object (left + width)
	*	@returns: right position
	*	Note:
	********************************************************/	
	this.GetRight=function(){
		if(this.Element)
			return this.GetLeft()+this.GetWidth();
		return undefined;
	}	
	/********************************************************
	*	GetWidth
	*	Description: retrieve width of the object
	*	@returns: width of the object in pixel
	*	Note:
	********************************************************/	
	this.GetWidth=function(){
		if(this.Element){
			if(this.TextElement)
				return Math.max(this.TextElement.offsetWidth,this.Element.offsetWidth);
			else
				return this.Element.offsetWidth;
		}
		return undefined;		
	}
	/********************************************************
	*	GetHeight
	*	Description: retrieve height of the object
	*	@returns: height of the object in pixel
	*	Note:
	********************************************************/	
	this.GetHeight=function(){
		if(this.Element){
			if(this.TextElement)
				return Math.max(this.TextElement.offsetHeight,this.Element.offsetHeight);
			else
				return this.Element.offsetHeight;
		}	
		return undefined;		
	}
	/********************************************************
	*	GetElement
	*	Description: return HTML element of the object
	*	@returns: HTML element
	*	Note:
	********************************************************/	
	this.GetElement=function(){
		return this.Element;
	}
	/********************************************************
	*	GetUID
	*	Description: retrieve Euterpe unique ID (UID)
	*	@returns: UID of the object or undefined (if invalid)
	*	Note:
	********************************************************/	
	this.GetUID=function(){
		if(this.Element!=null)
				return this.GetAttribute("data-Euterpe_UID");
		return undefined;
	}
	/********************************************************
	*	SetID
	*	Description: set id attribute of HTML element connected
	*			to Euterpe object
	*	@param ID: new id value
	*	Note:
	********************************************************/	
	this.SetID=function(ID){
			if(this.Element)
				this.Element.id=ID;
	}
	/********************************************************
	*	GetID
	*	Description: give id attribute of HTML element
	*	@returns: id attribute
	*	Note:
	********************************************************/	
	this.GetID=function(){
		return this.Element.id;
	}	
	/********************************************************
	*	Show
	*	Description: show the object in page
	*	Note: this function set "visibility" property in "style"
	*		attribute
	********************************************************/	
	this.Show=function(){
		this.SetStyleProperty("visibility","visible");
		this.ShowChild();
		var D=new Date();
		this.LastShowTime=D.getTime();
		EuterpeShowEvent(this);
	}
	/********************************************************
	*	Hide
	*	Description: hide the object in page
	*	Note: this function set "visibility" property in "style"
	*		attribute
	********************************************************/	
	this.Hide=function(){
		this.SetStyleProperty("visibility","hidden");
		this.HideChild();
		EuterpeHideEvent(this);
	}
	/********************************************************
	*	Showed
	*	Description: return true if object is visible otherwise false
	*	@returns {Boolean}: true if object is showed
	*	Note:
	********************************************************/	
	this.Showed=function(){
		var Value=this.GetStyleProperty("visibility");
		if(Value!=undefined)
		{
			if(Value=="hidden")
				return false;
			else	
				return true;	
		}
		return true;
	}	
	/********************************************************
	*	BaseSetText (PREFER SetText or other function)
	*	Description: common function to change text showed in an
	*			object
	*	@param Te: text to show
	*	Note: object may require complex system to show text. This
	*		is a common routine (always necessary) to show text.
	********************************************************/	
	this.BaseSetText=function(Te){
		if(this.Element!=null && this.Element!=undefined) 
		{
			var OldTxt="";
			if(this.GetText())
				OldTxt=this.GetText();
			if(this.TextElement==null || this.TextElement==undefined)
			{
				this.TextElement=document.createElement("span");
				this.Element.appendChild(this.TextElement);			
			}
			this.TextElement.innerHTML=Te;		
			this.TextElement.setAttribute("data-Euterpe_UID",Euterpe_Const_TextUID);
			EuterpeChangeTextEvent(this,OldTxt,Te);		
			if(this.Browser=="MSIE")
				EuterpeSetElementStyleProperty(this.TextElement,"display","block");	
		}	
	}
	/********************************************************
	*	SetText
	*	Description: function to set text showed in object
	*	@param Text: text to show
	*	Note:
	********************************************************/	
	this.SetText=function(Text){
		this.BaseSetText(Text);
	}	
	/********************************************************
	*	GetText
	*	Description: retrieve text showed in object (if any)
	*	@returns: text showed or undefined (if any text)
	*	Note:
	********************************************************/	
	this.GetText=function(){
		//var Out=undefined;
		if(this.Element!=null)
		{
			if(this.TextElement != null)
				return this.TextElement.innerHTML;
		}
		return undefined;
	}
	/********************************************************
	*	ClearEventMgr
	*	Description: clear event manager for selected event
	*	@param EventType: type of event to unmanage (onload, onmouseover...)
	*	Note: this function works with system event and don't delete
	*		function associated to an event but only event manage
	********************************************************/	
	this.ClearEventMgr=	function(EventType){
		var EL=this.EventList;
		for(var a=0;a<EL.length;a++){
			if(EL[a].Event==EventType)
				EL.splice(a,1);
		}	
	}
	/********************************************************
	*	ClearCustomEventMgr
	*	Description:clear event manager for selected event (user defined)
	*	@param EventType: type of event to unmanage 
	*	Note: this function works with user defined event and don't delete
	*		function associated to an event but only event manage
	********************************************************/	
	this.ClearCustomEventMgr=function(EventType){
		this.ClearEventMgr(EventType);
	}
	/********************************************************
	*	RemoveEventMgr
	*	Description: remove a single event manager for a system event
	*	@param EventType: type of event to unmanage (onload, onmouseover...)
	*	@param Function: function manager to remove
	*	Note: this function works like ClearEventMgr but removes only
	*		one event manager (one function)
	********************************************************/	
	this.RemoveEventMgr=function(EventType, Function){
		var EL=this.EventList;
		for(var a=0;a<EL.length;a++){
			if(EL[a].Event==EventType){
				if(EL[a].Func==Function){
					EL.splice(a,1);
					return;
				}
			}
		}	
	}
	/********************************************************
	*	RemoveCustomEventMgr
	*	Description:remove a single event manager for a user defined event
	*	@param EventType:type of event to unmanage
	*	@param Function: function manager to remove
	*	Note:this function works like ClearCustomEventMgr but removes only
	*		one event manager (one function)
	********************************************************/	
	this.RemoveCustomEventMgr=function(EventType, Function){
		this.RemoveEventMgr(EventType,Function);
	}
	/********************************************************
	*	AddFunctionListener
	*	Description: internal function used to add/attach and event
	*			to list of managed event
	*	@param Element: DOM element to manage
	*	@param EventType: type of event to manage (as string)
	*	Note: internal function. DO NOT USE!!!!
	********************************************************/	
	this.AddFunctionListener=function(Element, EventType){
		if(Element.addEventListener)
			Element.addEventListener(EventType,this.EventMgr,true);
		else
			Element.attachEvent("on"+EventType,this.EventMgr);
	}
	/********************************************************
	*	AddEventMgr
	*	Description: this function is used to manage HTML events
	*	@param EventType: type of event you want to manage (as string)
	*	@param Function: function executed with the event
	*	Note: events should be loaded without the "on" prefix
	*		(ie "onload" -> "load", "onmouseover" -> "mouseover"...
	********************************************************/	
	this.AddEventMgr=function(EventType, Function){
		var U=this.GetAttribute("data-Euterpe_UID");
		var Data=new Event_Mgr(EventType,Function,U);
		var EL=this.EventList;
		EL.push(Data);
		this.AddFunctionListener(this.Element,EventType);
		if(this.TextElement!=null && this.TextElement!=undefined)
		{
			if(this.Browser!="MSIE")
				this.AddFunctionListener(this.TextElement,EventType);
		}	
	}
	/********************************************************
	*	AddCustomEventMgr
	*	Description: this function is used to manage user defined events
	*	@param EventType: event type you want manage (as string)
	*	@param Function: function executed with the event
	*	Note:
	********************************************************/	
	this.AddCustomEventMgr=	function(EventType, Function){
		var EL=this.EventList;
		var U=this.GetAttribute("data-Euterpe_UID");
		var Data=new Event_Mgr(EventType,Function,U);
		EL.push(Data);
		if(this.TextElement!=null && this.TextElement!=undefined)
		{
			if(this.TextElement.nodeType==1)
			{
				U=this.TextElement.getAttribute("data-Euterpe_UID");
				var Data2=new Event_Mgr(EventType,Function,U);
				EL.push(Data2);
			}
		}	
	}	
	/********************************************************
	*	SetEventMgr
	*	Description: used to set only one system events handler
	*	@param EventType: event type you want manage (as string)
	*	@param Function: function executed with the event
	*	Note: events should be loaded without the "on" prefix
	*		(ie "onload" -> "load", "onmouseover" -> "mouseover"...
	********************************************************/	
	this.SetEventMgr=function(EventType, Function){
		this.ClearEventMgr(EventType);
		this.AddEventMgr(EventType,Function);
	}	
	/********************************************************
	*	SetCustomEventMgr
	*	Description: used to set only one user define events handler
	*	@param EventTypeevent type you want manage (as string)
	*	@param Function: function executed with the event
	*	Note:
	********************************************************/	
	this.SetCustomEventMgr=function(EventType, Function){
		this.SetEventMgr(EventType,Function);
	}
	/********************************************************
	*	EventMgr
	*	Description: local function used manage events message system
	*	@param E: message connected with events
	*	@returns: return value of the function executed (if returned)
	*	Note: usually you don't need this function...
	********************************************************/	
	this.EventMgr=function(E){
		var Obj=GetEuterpeObjFromMsg(E);
		if(Obj){
			var A=Obj.Element.getAttribute("data-Euterpe_Type");
			//Euterpe_Log("Evento: "+E.type+" - "+E.eventPhase+" - "+A);		
			var EL=Obj.EventList;
			for(var a=0;a<EL.length;a++){
				if(E.type){
					if(E.type.indexOf("Euterpe")!=-1){
						if(E.type==EL[a].Event){
							var O=EL[a].Func(E);
							if(O)
								return O;
						}
					}
					else
					{
						if(E.type==EL[a].Event)
							EL[a].Func(E);
					}
				}
			}
		}	
	}
	/********************************************************
	*	Place
	*	Description: one time function to set width, height, left and/or top
	*		of the object
	*	@param Width: width to change (if set)
	*	@param Height: heigth to change (if set)
	*	@param Left: left position (if set)
	*	@param Top: top position (if set)
	*	Note:
	********************************************************/	
	this.Place=function(Width,Height,Left,Top){
		if(Width!="")this.SetWidth(Width);
		if(Height!="")this.SetHeight(Height);
		if(Left!=null)this.SetLeft(Left);
		if(Top!=null)this.SetTop(Top);
	}
	/********************************************************
	*	HideChild
	*	Description: this function will hide all child objects of 
	*			an object
	*	Note:
	********************************************************/	
	this.HideChild=function(){
		var Check;
		var Type;
		var Obj;
		for(var a=0;a<this.Element.childNodes.length;a++)
		{
			Type=this.Element.childNodes[a].nodeType;
			if(Type==1)
			{
				Check=this.Element.childNodes[a].getAttribute("data-Euterpe_UID");
				if(Check!=null && Check!=undefined && Check!=Euterpe_Const_TextUID)
				{
					Obj=FindEuterpeObject(Check);
					if(Obj!=undefined)Obj.Hide();
				}				
			}
		}
	}
	/********************************************************
	*	ShowChild
	*	Description: this will show all child objects of an object
	*	Note:
	********************************************************/	
	this.ShowChild=function(){
		var Check;
		var Obj;
		for(var a=0;a<this.Element.childNodes.length;a++)
		{
			if(this.Element.childNodes[a].nodeType==1)
			{
				Check=this.Element.childNodes[a].getAttribute("data-Euterpe_UID");
				if(Check!=null && Check!=undefined && Check!=Euterpe_Const_TextUID)
				{
					Obj=FindEuterpeObject(Check);
					if(Obj!=undefined)
					{
						var Txt=Obj.GetType();
						if(Txt!="Euterpe_Popup_Menu")Obj.Show();
					}
				}
				
			}
		}
	}
	/********************************************************
	*	AutoApplyClass
	*	Description: this function will apply class connected with theme
	*			load in Euterpe_Page
	*	@param E: message handle with creation or theme change event
	*	Note: do not use in script!!!
	********************************************************/	
	this.AutoApplyClass=function(E){
		var Page=GetEuterpePage();
		if(Page!=undefined)
		{
			if(E.ObjCreated)
			{
				if(E.ObjCreated.Element!=undefined)
				{
					//var Type=E.ObjCreated.Element.getAttribute("data-Euterpe_Type");
					var Type=E.ObjCreated.Element.getAttribute("data-ThemeType");
					if(Type == null)
						Type=E.ObjCreated.Element.getAttribute("data-Euterpe_Type");
					var Base=Page.GetTheme();
					if(Base!=undefined && Type!=null){
						switch(Type){
							case "Euterpe_Tab_Body":
							case "Euterpe_Tab_Tab":{
							
							}break;
							case "Euterpe_Dialog":{
								E.ObjCreated.ApplyClass(Base+"_"+Type);
								E.ObjCreated.Title.ApplyClass(Base+"_"+Type+"_Title");
							}break;
							case "Euterpe_Tab":{
								if(!E.ObjCreated.isHorizontal())
								{
									E.ObjCreated.ApplySelectedClass(Base+"_"+"Euterpe_Tab_Tab_Active",Base+"_"+"Euterpe_Tab_Body_Active");
									E.ObjCreated.ApplyDeselectedClass(Base+"_"+"Euterpe_Tab_Tab_Inactive",Base+"_"+"Euterpe_Tab_Body_Inactive");
								}
								else
								{
									E.ObjCreated.ApplySelectedClass(Base+"_"+"Euterpe_Tab_HorzTab_Active",Base+"_"+"Euterpe_Tab_Body_Active");
									E.ObjCreated.ApplyDeselectedClass(Base+"_"+"Euterpe_Tab_HorzTab_Inactive",Base+"_"+"Euterpe_Tab_Body_Inactive");
								}
								E.ObjCreated.ApplyClass(Base+"_"+Type);
							}break;
							case "Euterpe_TreeNode":{
								E.ObjCreated.ApplyBtnClass(Base+"_"+"Euterpe_TreeNode_Btn");
								E.ObjCreated.ApplyTextClass(Base+"_"+"Euterpe_TreeNode");
							}break;
							default:{
								E.ObjCreated.ApplyClass(Base+"_"+Type);
							};
						}
					}
				}
			}
		}
	}
	/********************************************************
	*	CheckBorder
	*	Description: function used to auto adjust position of object
	*	Note:
	********************************************************/	
	this.CheckBorder=function(){
		this.SetStyleProperty("top","10px");
		var Test=this.Element.offsetTop;
		if(Test!=0 && Test!=10)
			this.CheckPageBorder=true;
		this.SetStyleProperty("top","0px");		
	}
	/********************************************************
	*	MouseOver
	*	Description: function used by Euterpe_Page to manage
	*			object under mouse
	*	@param E: message sent from mouseover event
	*	Note: used only in object creation
	********************************************************/	
	MouseOver=function(E){
		var Obj=GetEuterpeObjFromMsg(E);
		var Page=GetEuterpePage();
		Page.ObjUnderMouse=Obj;
	}
	/********************************************************
	*	MouseMove
	*	Description: function used by Euterpe_Page to manage
	*			mouse position
	*	@param E: message sent from mousemove event
	*	Note: used only in object creation
	********************************************************/	
	MouseMove=function(E){
		var Page=GetEuterpePage();
		Page.mouseX=E.clientX;
		Page.mouseY=E.clientY;
	}
	/********************************************************
	*	MouseGenericClick
	*	Description: function used by Euterpe_Page to manage
	*			mouse button press
	*	@param E: message sent from mouseclick event
	*	Note: used only in object creation
	********************************************************/	
	MouseGenericClick=function(E){
		var Src=GetEuterpeObjFromMsg(E);
		if(Src!=undefined)
		{
			switch(Src.GetType()){
				case "Euterpe_Popup_Item":{
					for(var a=0;a<EuterpeObjectArray.length;a++)
					{
						if(EuterpeObjectArray[a].GetType()=="Euterpe_Popup_Menu")
						{
							if(EuterpeObjectArray[a].Showed())
								EuterpeObjectArray[a].Hide();
						}
					}					
				}break;
				default:{
					var D=new Date();
					var Value=D.getTime();
					var Diff;
					for(var a=0;a<EuterpeObjectArray.length;a++)
					{
						if(EuterpeObjectArray[a].GetType()=="Euterpe_Popup_Menu")
						{
							if(EuterpeObjectArray[a].Showed())
							{
								Diff=Value - EuterpeObjectArray[a].LastShowTime;
								if(Diff > 200)
									EuterpeObjectArray[a].Hide();
							}
						}
					}
				};
			}
		}
	}	
	/********************************************************
	*	GetType
	*	Description: return type of Euterpe object
	*	@returns: type as string
	*	Note:
	********************************************************/
	this.GetType=function(){
		return this.GetAttribute("data-Euterpe_Type");
	}
	/********************************************************
	*	Destroy
	*	Description: destroy an object and delete DOM element
	*			connected
	*	Note:
	********************************************************/
	this.Destroy=function(){
		while(this.Element.hasChildNodes())
			this.Element.removeChild(this.Element.firstChild);
		if(this.Dad!=undefined &&this.Dad!=null)
			this.Dad.Element.removeChild(this.Element);
		else
			document.body.removeChild(this.Element);
	}
	/********************************************************
	*	ParentAlignTop
	*	Description: align an object to parent top (set top to 0px)
	*	Note:
	********************************************************/	
	this.ParentAlignTop=function(){
		this.SetTop("0px");
	}
	/********************************************************
	*	ParentAlignMiddle
	*	Description: center an object vertically
	*	Note:
	********************************************************/
	this.ParentAlignMiddle=function(){
		if(this.Dad){
			if(this.Dad.GetInnerHeight){
				var a=this.Dad.GetInnerHeight();
				this.SetTop(((a-this.GetInnerHeight())/2)+"px");
			}
		}
	}
	/********************************************************
	*	ParentAlignBottom
	*	Description: align an element to the bottom of parent
	*	Note:
	********************************************************/
	this.ParentAlignBottom=function(){
		if(this.Dad){
			if(this.Dad.GetInnerHeight){
				var a=this.Dad.GetInnerHeight();
				this.SetTop((a-this.GetInnerHeight())+"px");
			}
		}
	}	
	/********************************************************
	*	ParentAlignLeft
	*	Description: align an object to parent left (set left to 0px)
	*	Note:
	********************************************************/
	this.ParentAlignLeft=function(){
		this.SetLeft("0px");
	}
	/********************************************************
	*	ParentAlignCenter
	*	Description: center an object horizontally to the parent
	*	Note:
	********************************************************/
	this.ParentAlignCenter=function(){
		if(this.Dad){
			if(this.Dad.GetInnerWidth){
				var a=this.Dad.GetInnerWidth();
				this.SetLeft(((a-this.GetInnerWidth())/2)+"px");
			}
		}	
	}
	/********************************************************
	*	ParentAlignRight
	*	Description: align an object to right parent
	*	Note:
	********************************************************/
	this.ParentAlignRight=function(){
		if(this.Dad){
			if(this.Dad.GetInnerWidth){
				var a=this.Dad.GetInnerWidth();
				this.SetLeft((a-this.GetInnerWidth())+"px");
			}
		}
	}	
	/********************************************************
	*	SetHTML
	*	Description: OBSOLETE
	*	@param HTML:
	*	Note:
	********************************************************/
	this.SetHTML=function(HTML){
		this.SetText(HTML);
	}
	/********************************************************
	*	OptimizeMouseOut
	*	Description: OBSOLETE
	*	@param Msg:
	*	Note:
	********************************************************/
	this.OptimizeMouseOut=function(Msg){
		
	}
	/********************************************************
	*	MakeUnselectable
	*	Description: make an object unselectable with mouse
	*	Note:
	********************************************************/
	this.MakeUnselectable=function(){
		this.TextElement.setAttribute("unselectable","on");
		if(this.Browser=="Chrome" || this.Browser=="Safari")
			EuterpeSetElementStyleProperty(this.TextElement,"-webkit-user-select","none");
		else
		{
			if(this.Browser=="Firefox")
				EuterpeSetElementStyleProperty(this.TextElement,"-moz-user-select","none");
			else
			{
				EuterpeSetElementStyleProperty(this.TextElement,"-webkit-user-select","none");
				EuterpeSetElementStyleProperty(this.TextElement,"-moz-user-select","none");
				EuterpeSetElementStyleProperty(this.TextElement,"-ms-user-select","none");
				EuterpeSetElementStyleProperty(this.TextElement,"-o-user-select","none");
				EuterpeSetElementStyleProperty(this.TextElement,"user-select","none");
			}
		}
	}
	/********************************************************
	*	GetZIndex
	*	Description: return Z coordinate of an object
	*	@returns: the Z coordinate (as integer)
	*	Note:
	********************************************************/
	this.GetZIndex=function(){
		var a=this.GetStyleProperty("z-index");
		if(a)
			return parseInt(a);
		return 0;
	}
	/********************************************************
	*	GetChildWidth
	*	Description: evaluate width of all the childs of an object
	*	@returns: width of childs in pixels
	*	Note:
	********************************************************/
	this.GetChildWidth=function(){
		var min;
		var max;
		var Tmp=this.GetEuterpeChild();
		for(var a=0;a<Tmp.length;a++){
			if(min==undefined)
				min=Tmp[a].GetLeft();
			else
			{
				if(min>Tmp[a].GetLeft())
					min=Tmp[a].GetLeft();
			}
			if(max==undefined)
				max=Tmp[a].GetRight();
			else
			{
				if(max<Tmp[a].GetRight())
					max=Tmp[a].GetRight();
			}
		}
		var Out={
			Min: min,
			Max: max
		};
		return Out;	
	}
	/********************************************************
	*	GetChildHeight
	*	Description: evaluate childs height
	*	@returns: the height of childs in pixels
	*	Note:
	********************************************************/
	this.GetChildHeight=function(){
		var min;
		var max;
		var Tmp=this.GetEuterpeChild();
		for(var a=0;a<Tmp.length;a++){
			if(min==undefined)
				min=Tmp[a].GetTop();
			else
			{
				if(min>Tmp[a].GetTop())
					min=Tmp[a].GetTop();
			}
			if(max==undefined)
				max=Tmp[a].GetBottom();
			else
			{
				if(max<Tmp[a].GetBottom())
					max=Tmp[a].GetBottom();
			}
		}
		var Out={
			Min: min,
			Max: max
		};
		return Out;
	}
	/********************************************************
	*	GetEuterpeChild
	*	Description: return an array with all childs as element 
	*	@returns {Array}: an array with all object childs
	*	Note:
	********************************************************/
	this.GetEuterpeChild=function(){
		var Out=new Array();
		var b;
		for(var a=0;a<this.Element.childNodes.length;a++){
			if(this.Element.childNodes[a].nodeType==1){
				b=this.Element.childNodes[a].getAttribute("data-Euterpe_Type");
				if(b<0)
					b=null;
				if(b!=null)
						Out.push(FindEuterpeObject(this.Element.childNodes[a].getAttribute("data-Euterpe_UID")));
			}
		}
		return Out;
	}
	/********************************************************
	*	GetMaxChildZ
	*	Description: return maximum Z coordinate of the child
	*	@returns: the maximum Z
	*	Note:
	********************************************************/
	this.GetMaxChildZ=function(){
		var Z=this.GetZIndex();
		var Tmp=this.GetEuterpeChild();
		for(var a=0;a<Tmp.length;a++){
			if(Z<Tmp[a].GetZIndex())
				Z=Tmp[a].GetZIndex();
		}
		return Z;
	}	
	/********************************************************
	*	SetMinWidth
	*	Description: set minimum width of the object
	*	@param Value: value of minimum width
	*	Note:
	********************************************************/	
	this.SetMinWidth=function(Value){
		this.SetAttribute("data-ObjMinWidth",PixelTxtToNumber(Value));
	}
	/********************************************************
	*	SetMinHeight
	*	Description: set minimum height of the object
	*	@param Value: value of minimum height
	*	Note:
	********************************************************/	
	this.SetMinHeight=function(Value){
		this.SetAttribute("data-ObjMinHeight",PixelTxtToNumber(Value));
	}
	/********************************************************
	*	SetThemeType
	*	Description: set a theme type for the object
	*	@param Value: theme type to apply
	*	Note:
	********************************************************/	
	this.SetThemeType=function(Value){
		this.SetAttribute("data-ThemeType",Value);
		var Info={ObjCreated:this};
		this.AutoApplyClass(Info);		
	}
}
//-----------------------------------------------------------------
/********************************************************
*	Euterpe_Page
*	Description: first and main Euterpe object
*	@param Page_ID: an identification for the page (attribute id)
*	
*	Local parameter:
*		+this.mouseX: x coordinate of the mouse
*		+this.mouseY: y coordinate of the mouse
*		+this.ObjUnderMouse: Euterpe object under mouse (see function MouseMove)
*	Internal parameter
*		- Element: OBSOLETE
*		- LastDocumentWidth: last width of the page
*		- LastDocumentHeight: last height of the page
*		- LastDocumentScrollX: last value of horizontal scroll
*		- LastDocumentScrollY: last value of vertical scroll
*		- Theme: actual theme
*		- CSSHover: OBSOLETE
*		- CSSActive: OBSOLETE
*		- Self: OBSOLETE
*		- FixPosForBorder: OBSOLETE
*	Local function:
*		+ this.Setup
*		+ this.WindowListener
*		+ this.SetTop
*		+ this.SetLeft
*		+ this.SetTheme
*		+ this.GetTheme
*	Internal function:
*		- WinMsg
********************************************************/
if(Euterpe_Page_Obj==undefined){
	var Euterpe_Page_Obj=1;
	function Euterpe_Page(Page_ID){
		var Element=null;
		var LastDocumentWidth;
		var LastDocumentHeight;
		var LastDocumentScrollX;
		var LastDocumentScrollY;
		var Theme;
		var CSSHover;
		var CSSActive;
		var Self;
		var FixPosForBorder=false;
		this.ObjUnderMouse;
		this.mouseX;
		this.mouseY;
		/********************************************************
		*	WinMsg
		*	Description: internal function for manage windows events
		*	@param E: events from the browser window
		*	Note:
		********************************************************/		
		WinMsg=function(E){
			var Execute=false;
			var Obj=GetEuterpePage();
			switch(E.type){
				case "resize":{
					if(GetDocumentHeight()!=LastDocumentHeight)
					{
						Execute=true;
						LastDocumentHeight=GetDocumentHeight();
					}
					if(GetDocumentWidth()!=LastDocumentWidth)
					{
						Execute=true;
						LastDocumentWidth=GetDocumentWidth();
					}
				}break;
				case "scroll":{
					if(window.scrollX!=LastDocumentScrollX)
					{
						Execute=true;
						LastDocumentScrollX=window.scrollX;
					}
					if(window.scrollY!=LastDocumentScrollY)
					{
						Execute=true;
						LastDocumentScrollY=window.scrollY;
					}			
				}break;
			}
			if(Execute==false)
				return;
			if(Obj){
				for(var a=0;a<Obj.EventList.length;a++){
					if(Obj.EventList[a].Event==E.type)
						Obj.EventList[a].Func(E);
				}
			}
		}
		/********************************************************
		*	Setup
		*	Description: initial function that setup page data
		*	@param ID: an id used as id attribute
		*	Note: use internal. Don't execute
		********************************************************/		
		this.Setup=	function(ID){
			var Obj=this.Create("div");
			switch(this.Browser){
				case "Firefox":
				case "Safari":{
					this.SetTop("0px");
					this.SetLeft("0px");				
				}break;
				default:{
					this.SetTop(window.screenY+"px");
					this.SetLeft(window.screenX+"px");
				}break;
			}
			document.body.appendChild(Obj);
			this.Element=Obj;
			this.SetAttribute("data-Euterpe_Type","Euterpe_Page");
			LastDocumentWidth=GetDocumentWidth();
			LastDocumentHeight=GetDocumentHeight();
			this.SetAttribute("data-OriginalW",LastDocumentWidth);
			this.SetAttribute("data-OriginalH",LastDocumentHeight);
			LastDocumentScrollX=window.scrollX;
			LastDocumentScrollY=window.scrollY;
			this.WindowListener("resize");
			if(this.Browser=="MSIE" && this.BrowserVer<8)
			{
				this.SetStyleProperty("position","relative");
				//this.SetStyleProperty("position","absolute");
				var Value=this.Element.offsetLeft;
				this.SetLeft((-1*Value)+"px");
				Value=this.Element.offsetTop;
				this.SetTop((-1*Value)+"px");
				//if(this.BrowserVer==6)
					this.SetStyleProperty("overflow","hidden");
			}		
			//Theme="Default";
			CSSActive=false;
			CSSHover=true;
			Self=this;
			this.Dad=undefined;
			EuterpeCreateEvent(this);
			if(ID)
				this.SetID(ID);
		}
		/********************************************************
		*	WindowListener
		*	Description: function that load window browser events function
		*	@param EventType: event to manage
		*	Note:
		********************************************************/		
		this.WindowListener=function(EventType){
			if(this.Browser!="MSIE")
				window.addEventListener(EventType,WinMsg,true);
			else
			{
				if(window.attachEvent)
					window.attachEvent("on"+EventType,WinMsg);
				else
					window.addEventListener(EventType,WinMsg,true);
			}	
		}
		/********************************************************
		*	SetTop
		*	Description: set top position of the object (property top in style attribute)
		*	@param Value: new value of top position
		*	Note:
		********************************************************/		
		this.SetTop=function(Value){
			var T=this.GetTop();
			this.SetStyleProperty("top",Value);
			EuterpeMoveEvent(this,T,this.GetLeft(),this.GetTop(),this.GetLeft());
		}
		/********************************************************
		*	SetLeft
		*	Description: set left position of the object (property left in style attribute)
		*	@param Value: new value of left position
		*	Note:
		********************************************************/		
		this.SetLeft=function(Value){
			var L=this.GetLeft();
			this.SetStyleProperty("left",Value);
			EuterpeMoveEvent(this,this.GetTop(),L,this.GetTop(),this.GetLeft());
		}
		/********************************************************
		*	SetTheme
		*	Description: apply a new theme to the page
		*	@param Value: new theme value (as string)
		*	Note: new theme will be apply to all objects
		********************************************************/		
		this.SetTheme=function(Value){
			Theme=Value;	
			for(var a=0;a<EuterpeObjectArray.length;a++)
			{
				var Info={ObjCreated:EuterpeObjectArray[a]};
				EuterpeObjectArray[a].AutoApplyClass(Info);
			}
		}
		/********************************************************
		*	GetTheme
		*	Description: retrieve actual page theme
		*	@returns {String}: the theme name
		*	Note:
		********************************************************/		
		this.GetTheme=function(){
			return Theme;
		}
		this.Setup(Page_ID);		
	}
	Euterpe_Page.prototype=new Euterpe_Core_Obj;
	Euterpe_Page.prototype.constructor=Euterpe_Page;
}
//-----------------------------------------------------------------
if(Euterpe_Panel_Obj==undefined){
	var Euterpe_Panel_Obj=1;
	/********************************************************
	*	Euterpe_Panel
	*	Description: first usable object, a panel
	*	@param Euterpe_Owner: object owner 
	*	@param ID: id of the element connected to panel
	*	@param Class_Name: name of the class applied (visual purpouse)
	*	Note: this is the easiest object. You can use to draw rectangle
	*		area or to show easy field of text (label)
	*
	*	Local function:
	*		+this.Setup
	*		+this.BaseCreation
	********************************************************/
	function Euterpe_Panel(Euterpe_Owner,ID,Class_Name){	
		 /********************************* 
		 * If you introduce a position relative, remember to add a "display:block"
		 * otherwise size cannot be done
		 *********************************/
		/********************************************************
		*	Setup
		*	Description: setup function for panel
		*	@param Owner: objects owner of the panel
		*	@param UID: id to apply to element connected
		*	@param Class: class to apply (if any)
		*	Note: internal usage. DO NOT EXECUTE!!!
		********************************************************/
		this.Setup=function(Owner,UID,Class){
			this.BaseCreation("span",Owner,"Euterpe_Panel");
			if(UID)
				this.SetID(ID);
			if(Class)
				this.ApplyClass(Class);
		}
		/********************************************************
		*	BaseCreation
		*	Description: base creation for panel
		*	@param TagToCreate: tag used in connected element
		*	@param Own: Euterpe object owner
		*	@param Euterpe_Type: type of object (Euterpe)
		*	Note: this function is called inside Setup function
		*		of descendant objects. Do not use in other place
		********************************************************/		
		this.BaseCreation=function(TagToCreate,Own,Euterpe_Type){
			this.Create(TagToCreate);
			this.SetAttribute("data-Euterpe_Type",Euterpe_Type);
			if(this.Browser=="MSIE" && this.BrowserVer==6)
			{
				this.SetStyleProperty("position","relative");
				this.SetStyleProperty("display","block");
			}
			if(Own){
				if(Own.Element)
				{
					if(Own.TextElement)
						Own.Element.insertBefore(this.Element,Own.TextElement);
					else
						Own.Element.appendChild(this.Element);
				}
				this.Dad=Own;		
			}
			this.CheckBorder();	
			EuterpeCreateEvent(this,Own);
		}
		this.Setup(Euterpe_Owner,ID,Class_Name);
	}
	Euterpe_Panel.prototype=new Euterpe_Core_Obj;
	Euterpe_Panel.prototype.constructor=Euterpe_Panel;
}
//-----------------------------------------------------------------
if(Euterpe_Align_Panel_Obj==undefined){
	var Euterpe_Align_Panel_Obj=1;
	/********************************************************
	*	Euterpe_Align_Panel
	*	Description: a more complex panel used to show and align
	*		text vertically and horizontally
	*	@param Euterpe_Owner: object owner
	*	@param ID: id to apply to element connected
	*	@param Class_Name: class to apply
	*	Note:
	*
	*	Local parameter:
	*		+this.LastAlign: OBSOLETE
	*	Local function:
	*		+this.Setup
	*		+this.Redraw
	*		+this.SetText
	*		+this.SetCursor
	*		+this.SetVAlign
	*		+this.SetHAlign
	********************************************************/
	function Euterpe_Align_Panel(Euterpe_Owner,ID,Class_Name){
		this.LastAlign="top";
		/********************************************************
		*	Setup
		*	Description: setup function for panel
		*	@param Owner: objects owner of the panel
		*	@param UID: id to apply to element connected
		*	@param Class: class to apply (if any)
		*	Note: internal usage. DO NOT EXECUTE!!!
		********************************************************/		
		this.Setup=function(Owner,UID,Class){
			this.BaseCreation("span",Owner,"Euterpe_Align_Panel");
			this.SetAttribute("data-Euterpe_VAlign","top");
			this.SetAttribute("data-Euterpe_HAlign","left");
			if(UID)
				this.SetID(UID);
			if(Class)
				this.ApplyClass(Class);		
		}
		/********************************************************
		*	Redraw
		*	Description: function to redraw panel 
		*	Note: this function redraw the panel following parameter
		*		so may be necessary after resizing or changing class
		********************************************************/		
		this.Redraw=function(){
			var Align=this.GetAttribute("data-Euterpe_VAlign");
			var Min;
			if(Align==null)
			{
				Align="top";
				this.SetAttribute("data-Euterpe_VAlign",Align);
			}
			if(this.TextElement!=null){
				var Out="0px";
				EuterpeSetElementStyleProperty(this.TextElement,"position","absolute");
				var S=this.GetInnerHeight();
				switch(Align){
					case "top":{
						Out="0px";
					}break;
					case "middle":{
						var T=this.TextElement.offsetHeight;
						Out=((S-T)/2)+"px";
					}break;
					case "bottom":{
						var T=this.TextElement.offsetHeight;
						Out=(S-T)+"px";				
					}break;
					default:{
						Out=Align;
					};
				}
				EuterpeSetElementStyleProperty(this.TextElement,"top",Out);
			}
			Align=this.GetAttribute("data-Euterpe_HAlign");
			if(Align==null)
			{
				Align="left";
				this.SetAttribute("data-Euterpe_HAlign",Align);
			}
			if(this.TextElement!=null){
				if(this.GetInnerWidth())
					EuterpeSetElementStyleProperty(this.TextElement,"width",(this.GetInnerWidth()-this.GetPadding("left")-
															this.GetPadding("right"))+"px");
				switch(Align){
					case "left":{
						EuterpeSetElementStyleProperty(this.TextElement,"text-align","left");
					}break;
					case "center":{
						EuterpeSetElementStyleProperty(this.TextElement,"text-align","center");
					}break;
					case "right":{
						EuterpeSetElementStyleProperty(this.TextElement,"text-align","right");			
					}break;
					default:{
						EuterpeSetElementStyleProperty(this.TextElement,"left",Align);
					};
				}
			}	
		}
		/********************************************************
		*	SetText
		*	Description: function to set text showed in object
		*	@param Text: text to show
		*	Note:
		********************************************************/		
		this.SetText=function(Text){
			if(this.GetWidth()==0)
				this.SetWidth((GetElementTextWidth(this.Element,Text)+8)+"px");
			this.BaseSetText(Text);
			this.Redraw();
			this.MakeUnselectable();
		}
		/********************************************************
		*	SetCursor
		*	Description: change cursor showed over the panel 
		*			(change property "cursor" in attribute "style")
		*	@param Type: new cursor type (as string)
		*	Note: for a list of cursor see "cursor" property
		********************************************************/		
		this.SetCursor=	function(Type){
			if(this.TextElement!=undefined && this.TextElement!=null)
				EuterpeSetElementStyleProperty(this.TextElement,"cursor",Type);
			this.SetStyleProperty("cursor",Type);
		}
		/********************************************************
		*	SetVAlign
		*	Description: set vertical alignment of text in panel
		*	@param Align: vertical align type ("top", "middle" or "bottom")
		*	Note: use "top" to align text at top of the panel, "middle"
		*		to align middle of panel with text middle and "bottom" to
		*		align text at panel bottom
		********************************************************/		
		this.SetVAlign=	function(Align){
			this.SetAttribute("data-Euterpe_VAlign",Align);
			this.Redraw();
		}
		/********************************************************
		*	SetHAlign
		*	Description: set horizontal alignment of text in panel
		*	@param Align: horizontal align type ("left", "center" or "right")
		*	Note: use "left" to align text at left of the panel, "center"
		*		to align center of panel with center middle and "right" to
		*		align text at panel right
		********************************************************/			
		this.SetHAlign=function(Align){
			this.SetAttribute("data-Euterpe_HAlign",Align);
			this.Redraw();	
		}
		/********************************************************
		*	Show
		*	Description: same as Euterpe_Core_Obj
		*	Note: OBSOLETE 
		********************************************************/			
		this.Show=function(){
			//this.SetVAlign(this.LastAlign);	
			this.SetStyleProperty("visibility","visible");		
			this.ShowChild();
			var D=new Date();
			this.LastShowTime=D.getTime();		
			EuterpeShowEvent(this);				
		}
		/********************************************************
		*	ApplyClass
		*	Description: apply a class to element connected 
		*	@param Class_Name: name of the class to apply
		*	Note: this function override Euterpe_Core_Obj function
		*		because add Redraw()
		********************************************************/		
		this.ApplyClass=function(Class_Name){
			if(this.Element!=null)
			{
				if(Class_Name!=undefined)
				{
					var Old=this.Element.className;
					this.Element.className=Class_Name;
					//NormalClass=Class_Name;
					EuterpeChangeClassEvent(this,Old,Class_Name);
					this.Redraw();
				}
			}
		}
		/********************************************************
		*	SetHeight
		*	Description: set height of the object (property height in style attribute)
		*	@param Height_Str: new value of height
		*	Note:
		********************************************************/		
		this.SetHeight=function(Height_Str){
			var W=this.GetWidth();
			var H=this.GetHeight();	
			if(this.Browser=="MSIE")
				this.SetStyleProperty("height","");
			this.SetStyleProperty("height",Height_Str);
			EuterpeResizeEvent(this,W,H,this.GetWidth(),this.GetHeight());
			this.Redraw();
		}
		/********************************************************
		*	SetWidth
		*	Description: set width of the object (property width in style attribute)
		*	@param Width_Str: new value of width
		*	Note:
		********************************************************/		
		this.SetWidth=function(Width_Str){
			var W=this.GetWidth();
			var H=this.GetHeight();
			if(this.Browser=="MSIE")
				this.SetStyleProperty("width","");
			this.SetStyleProperty("width",Width_Str);
			if(this.TextElement)
				EuterpeSetElementStyleProperty(this.TextElement,"width",Width_Str);		
			EuterpeResizeEvent(this,W,H,this.GetWidth(),this.GetHeight());
			this.Redraw();
		}	
		this.Setup(Euterpe_Owner,ID,Class_Name);
	}
	Euterpe_Align_Panel.prototype=new Euterpe_Panel();
	Euterpe_Align_Panel.prototype.constructor=Euterpe_Align_Panel;	
}
//-----------------------------------------------------------------
