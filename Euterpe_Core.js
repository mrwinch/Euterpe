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
	var EuterpeElementArray=new Array();
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
 * 	Euterpe_Element_Exist(ID) 
 * 	Description: function verify if element with id=ID exists or not
 * 	Parameters:
 * 	+ID: the id you want to search
 * 	Returned value: true if the id exists otherwise false
 * 	Note: this function search between HTML id 
 *****************************************************************/
function Euterpe_Element_Exist(ID){
	var Test=FindEuterpeElementFromID(ID);
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
	return FindEuterpeElement(UID);
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
	var Obj=FindEuterpeElement(UID);
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
	for(var a=0;a<EuterpeElementArray.length;a++)
	{
		if(EuterpeElementArray[a].Element.getAttribute)
		{
			Txt=EuterpeElementArray[a].Element.getAttribute("data-Euterpe_Type");
			if(Txt=="Euterpe_Page")
				return EuterpeElementArray[a];
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
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
function FindEuterpeElement(UID){
	for(var a=0;a<EuterpeElementArray.length;a++)
	{
		if(EuterpeElementArray[a].GetUID()==UID)
			return EuterpeElementArray[a];
	}
	return undefined;
}
//-----------------------------------------------------------------
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
function FindEuterpeElementFromID(ID){
	for(var a=0;a<EuterpeElementArray.length;a++)
	{
		if(EuterpeElementArray[a].GetID()==ID)
			return EuterpeElementArray[a];
	}
	return undefined;
}
//-----------------------------------------------------------------
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
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
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
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
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
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
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
function Find_Euterpe_UID(){
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
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
function Find_Element_By_EuterpeUID(Euterpe_UID){
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
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
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
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
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
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
function GetBrowserLanguage(){	
	if(window.navigator.userLanguage)
		return window.navigator.userLanguage;
	var Txt=window.navigator.language;
	return Txt.substring(0,2);
}
//-----------------------------------------------------------------
/****************************************************************** 
 * 	Description:
 * 	Parameters:
 * 	+Param1:
 * 	Returned value:
 * 	Note:
 *****************************************************************/
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
	this.SetStyleProperty=function(Property_Name, Property_Value){
		if(this.Element)
			EuterpeSetElementStyleProperty(this.Element,Property_Name,Property_Value);
	}
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
	this.SetAttribute=function(Attr,Value){this.Element.setAttribute(Attr,Value);}
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
	this.Create=function(Tag){
		var User=new String(window.navigator.userAgent);
		this.Browser=GetBrowser();
		this.BrowserVer=GetBrowserVer();
		this.EventList=new Array();
		this.Element=document.createElement(Tag);
		this.SetStyleProperty("position","absolute");
		var a=Find_Euterpe_UID();
		this.SetAttribute("data-Euterpe_UID",a);
		this.SetAttribute("data-Euterpe_Type","Euterpe_Obj");
		this.SetID("Euterpe_"+a);
		this.Show();
		EuterpeElementArray.push(this);
		this.SetStyleProperty("z-index",0);
		this.AddCustomEventMgr("Euterpe_Create",this.AutoApplyClass);
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
	this.GetInnerHeight=function(){return this.GetHeight()-this.GetBorderSize("bottom")-this.GetBorderSize("top");}
	this.GetInnerWidth=function(){return this.GetWidth()-this.GetBorderSize("left")-this.GetBorderSize("right");}
	this.ApplyClass=function(Class_Name){
		if(this.Element!=null)
		{
			if(Class_Name!=undefined)
			{
				var Old=this.Element.className;
				this.Element.className=Class_Name;
				NormalClass=Class_Name;
				EuterpeChangeClass(this,Old,Class_Name);
			}
		}
	}	
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
	this.SetWidth=function(Width_Str){
		var W=this.GetWidth();
		var H=this.GetHeight();
		if(this.Browser=="MSIE")this.SetStyleProperty("width","");
		this.SetStyleProperty("width",Width_Str);
		if(this.TextElement)EuterpeSetElementStyleProperty(this.TextElement,"width",Width_Str);
		EuterpeResizeEvent(this,W,H,this.GetWidth(),this.GetHeight());
	}
	this.SetHeight=function(Height_Str){
		var W=this.GetWidth();
		var H=this.GetHeight();	
		if(this.Browser=="MSIE")
			this.SetStyleProperty("height","");
		this.SetStyleProperty("height",Height_Str);
		EuterpeResizeEvent(this,W,H,this.GetWidth(),this.GetHeight());
	}
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
					if(Value==null || Value==undefined)Value=0;
					Tmp-=Value;
				}				
			}
			this.SetStyleProperty("top",Tmp+"px");
		}
		EuterpeMoveEvent(this,T,this.GetLeft(),this.GetTop(),this.GetLeft());
	}
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
	this.GetBottom=function(){
		if(this.Element)return this.GetTop()+this.GetHeight();
		return undefined;
	}
	this.GetRight=function(){
		if(this.Element)return this.GetLeft()+this.GetWidth();
		return undefined;
	}
	this.GetWidth=function(){
		if(this.Element){
			if(this.TextElement)
				return Math.max(this.TextElement.offsetWidth,this.Element.offsetWidth);
			else
				return this.Element.offsetWidth;
		}
		return undefined;		
	}
	this.GetHeight=function(){
		if(this.Element){
			if(this.TextElement)
				return Math.max(this.TextElement.offsetHeight,this.Element.offsetHeight);
			else
				return this.Element.offsetHeight;
		}	
		return undefined;		
	}
	this.GetElement=function(){return this.Element;}
	this.GetUID=function(){
		if(this.Element!=null)return this.GetAttribute("data-Euterpe_UID");
		return undefined;
	}
	this.SetID=function(ID){if(this.Element)this.Element.id=ID;}
	this.GetID=function(){return this.Element.id;}	
	this.Show=function(){
		this.SetStyleProperty("visibility","visible");
		this.ShowChild();
		var D=new Date();
		this.LastShowTime=D.getTime();
		EuterpeShowEvent(this);
	}
	this.Hide=function(){
		this.SetStyleProperty("visibility","hidden");
		this.HideChild();
		EuterpeHideEvent(this);
	}
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
	this.BaseSetText=function(Te){
		if(this.Element!=null && this.Element!=undefined) 
		{
			var OldTxt="";
			if(this.GetText())OldTxt=this.GetText();
			if(this.TextElement==null || this.TextElement==undefined)
			{
				this.TextElement=document.createElement("span");
				this.Element.appendChild(this.TextElement);			
			}
			this.TextElement.innerHTML=Te;		
			this.TextElement.setAttribute("data-Euterpe_UID",Euterpe_Const_TextUID);
			EuterpeChangeTextEvent(this,OldTxt,Te);		
			if(this.Browser=="MSIE")EuterpeSetElementStyleProperty(this.TextElement,"display","block");	
		}	
	}
	this.SetText=function(Text){this.BaseSetText(Text);}
	this.GetText=function(){
		var Out=undefined;
		if(this.Element!=null)
		{
			if(this.TextElement != null)return this.TextElement.innerHTML;
		}
		return undefined;
	}	
	this.ClearEventMgr=function(EventType){
		var EL=this.EventList;
		for(var a=0;a<EL.length;a++){
			if(EL[a].Event==EventType)
				EL.splice(a,1);
		}	
	}
	this.ClearCustomEventMgr=function(EventType){
		this.ClearEventMgr(EventType);
	}
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
	this.RemoveCustomEventMgr=function(EventType, Function){
		this.RemoveEventMgr(EventType,Function);
	}	
	this.AddFunctionListener=function(Element, EventType){
		if(Element.addEventListener)
			Element.addEventListener(EventType,this.EventMgr,true);
		else
			Element.attachEvent("on"+EventType,this.EventMgr);
	}
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
	this.AddCustomEventMgr=function(EventType, Function){
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
	this.SetEventMgr=function(EventType, Function){
		this.ClearEventMgr(EventType);
		this.AddEventMgr(EventType,Function);
	}	
	this.SetCustomEventMgr=function(EventType, Function){
		this.SetEventMgr(EventType,Function);
	}		
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
	this.Place=function(Width,Height,Left,Top){
		if(Width!="")this.SetWidth(Width);
		if(Height!="")this.SetHeight(Height);
		if(Left!=null)this.SetLeft(Left);
		if(Top!=null)this.SetTop(Top);
	}
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
					Obj=FindEuterpeElement(Check);
					if(Obj!=undefined)Obj.Hide();
				}				
			}
		}
	}
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
					Obj=FindEuterpeElement(Check);
					if(Obj!=undefined)
					{
						var Txt=Obj.GetType();
						if(Txt!="Euterpe_Popup_Menu")Obj.Show();
					}
				}
				
			}
		}
	}
	this.AutoApplyClass=function(E){
		var Page=GetEuterpePage();
		if(Page!=undefined)
		{
			if(E.ObjCreated)
			{
				if(E.ObjCreated.Element!=undefined)
				{
					var Type=E.ObjCreated.Element.getAttribute("data-Euterpe_Type");
					var Base=Page.GetTheme();
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
	this.CheckBorder=function(){
		this.SetStyleProperty("top","10px");
		var Test=this.Element.offsetTop;
		if(Test!=0 && Test!=10)this.CheckPageBorder=true;
		this.SetStyleProperty("top","0px");		
	}
	MouseOver=function(E){
		var Obj=GetEuterpeObjFromMsg(E);
		var Page=GetEuterpePage();
		Page.ObjUnderMouse=Obj;
	}
	MouseMove=function(E){
		var Page=GetEuterpePage();
		Page.mouseX=E.clientX;
		Page.mouseY=E.clientY;
	}
	MouseGenericClick=function(E){
		var Src=GetEuterpeObjFromMsg(E);
		if(Src!=undefined)
		{
			switch(Src.GetType()){
				case "Euterpe_Popup_Item":{
					for(var a=0;a<EuterpeElementArray.length;a++)
					{
						if(EuterpeElementArray[a].GetType()=="Euterpe_Popup_Menu")
						{
							if(EuterpeElementArray[a].Showed())
								EuterpeElementArray[a].Hide();
						}
					}					
				}break;
				default:{
					var D=new Date();
					var Value=D.getTime();
					var Diff;
					for(var a=0;a<EuterpeElementArray.length;a++)
					{
						if(EuterpeElementArray[a].GetType()=="Euterpe_Popup_Menu")
						{
							if(EuterpeElementArray[a].Showed())
							{
								Diff=Value - EuterpeElementArray[a].LastShowTime;
								if(Diff > 200)
									EuterpeElementArray[a].Hide();
							}
						}
					}
				};
			}
		}
	}	
	this.GetType=function(){return this.GetAttribute("data-Euterpe_Type");}
	this.Destroy=function(){
		while(this.Element.hasChildNodes())
			this.Element.removeChild(this.Element.firstChild);
		if(this.Dad!=undefined &&this.Dad!=null)
			this.Dad.Element.removeChild(this.Element);
		else
			document.body.removeChild(this.Element);
	}
	this.ParentAlignTop=function(){this.SetTop("0px");}
	this.ParentAlignMiddle=function(){
		if(this.Dad){
			if(this.Dad.GetInnerHeight){
				var a=this.Dad.GetInnerHeight();
				this.SetTop(((a-this.GetInnerHeight())/2)+"px");
			}
		}
	}
	this.ParentAlignBottom=function(){
		if(this.Dad){
			if(this.Dad.GetInnerHeight){
				var a=this.Dad.GetInnerHeight();
				this.SetTop((a-this.GetInnerHeight())+"px");
			}
		}
	}	
	this.ParentAlignLeft=function(){this.SetLeft("0px");}
	this.ParentAlignCenter=function(){
		if(this.Dad){
			if(this.Dad.GetInnerWidth){
				var a=this.Dad.GetInnerWidth();
				this.SetLeft(((a-this.GetInnerWidth())/2)+"px");
			}
		}	
	}
	this.ParentAlignRight=function(){
		if(this.Dad){
			if(this.Dad.GetInnerWidth){
				var a=this.Dad.GetInnerWidth();
				this.SetLeft((a-this.GetInnerWidth())+"px");
			}
		}
	}	
	this.SetHTML=function(HTML){this.SetText(HTML);}
	this.OptimizeMouseOut=function(Msg){
		
	}
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
	this.GetZIndex=function(){
		var a=this.GetStyleProperty("z-index");
		if(a)return parseInt(a);
		return 0;
	}
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
	this.GetEuterpeChild=function(){
		var Out=new Array();
		var b;
		for(var a=0;a<this.Element.childNodes.length;a++){
			if(this.Element.childNodes[a].nodeType==1){
				b=this.Element.childNodes[a].getAttribute("data-Euterpe_Type");
				if(b<0)b=null;
				if(b!=null)Out.push(FindEuterpeElement(this.Element.childNodes[a].getAttribute("data-Euterpe_UID")));
			}
		}
		return Out;
	}
	this.GetMaxChildZ=function(){
		var Z=this.GetZIndex();
		var Tmp=this.GetEuterpeChild();
		for(var a=0;a<Tmp.length;a++){
			if(Z<Tmp[a].GetZIndex())Z=Tmp[a].GetZIndex();
		}
		return Z;
	}	
}
//-----------------------------------------------------------------
/*if(Euterpe_Core_Event_Obj_Var==undefined){
	var Euterpe_Core_Event_Obj_Var=1;
	function Euterpe_Core_Event_Obj(HTML_Tag){
		this.ClearEventMgr=function(EventType){
			var EL=this.EventList;
			for(var a=0;a<EL.length;a++){
				if(EL[a].Event==EventType)
					EL.splice(a,1);
			}	
		}
		this.ClearCustomEventMgr=function(EventType){
			this.ClearEventMgr(EventType);
		}
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
		this.RemoveCustomEventMgr=function(EventType, Function){
			this.RemoveEventMgr(EventType,Function);
		}	
		this.AddFunctionListener=function(Element, EventType){
			if(Element.addEventListener)
				Element.addEventListener(EventType,this.EventMgr,true);
			else
				Element.attachEvent("on"+EventType,this.EventMgr);
		}
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
		this.AddCustomEventMgr=function(EventType, Function){
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
		this.SetEventMgr=function(EventType, Function){
			this.ClearEventMgr(EventType);
			this.AddEventMgr(EventType,Function);
		}	
		this.SetCustomEventMgr=function(EventType, Function){
			this.SetEventMgr(EventType,Function);
		}		
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
	}
	Euterpe_Core_Event_Obj.prototype=new Euterpe_Core_Obj;
	Euterpe_Core_Event_Obj.prototype.constructor=Euterpe_Core_Event_Obj;
}*/
//-----------------------------------------------------------------
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
		this.Setup=function(ID){
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
			Theme="Default";
			CSSActive=false;
			CSSHover=true;
			Self=this;
			this.Dad=undefined;
			EuterpeCreateEvent(this);
			if(ID)
				this.SetID(ID);
		}
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
		this.SetTop=function(Value){
			var T=this.GetTop();
			this.SetStyleProperty("top",Value);
			EuterpeMoveEvent(this,T,this.GetLeft(),this.GetTop(),this.GetLeft());
		}
		this.SetLeft=function(Value){
			var L=this.GetLeft();
			this.SetStyleProperty("left",Value);
			EuterpeMoveEvent(this,this.GetTop(),L,this.GetTop(),this.GetLeft());
		}
		this.SetTheme=function(Value){
			Theme=Value;	
			for(var a=0;a<EuterpeElementArray.length;a++)
			{
				var Info={ObjCreated:EuterpeElementArray[a]};
				EuterpeElementArray[a].AutoApplyClass(Info);
			}
		}
		this.GetTheme=function(){
			return Theme;
		}
		this.Setup(Page_ID);		
	}
	Euterpe_Page.prototype=new Euterpe_Core_Obj;
	Euterpe_Page.prototype.constructor=Euterpe_Page;
}
//-----------------------------------------------------------------