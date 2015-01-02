//-----------------------------------------------------------------
var EventMgrArray=new Array();
var EuterpeElementArray=new Array();
var EuterpeTimeoutArray=new Array();
var Euterpe_Const_TextUID="-100";
//-----------------------------------------------------------------
if(Array.indexOf==undefined)
{
	Array.prototype.indexOf=function(obj, start) {
		 for (var i=(start || 0), j=this.length; i < j; i++) {
			 if (this[i] === obj) { return i; }
		 }
		 return -1;
	}
}
if (String.substr==undefined)
{
  /**
   *  Get the substring of a string
   *  @param  {integer}  start   where to start the substring
   *  @param  {integer}  length  how many characters to return
   *  @return {string}
   */
  String.prototype.substr=function(substr) {
    return function(start, length) {
      // did we get a negative start, calculate how much it is from the beginning of the string
      if (start < 0) start=this.length + start;
      
      // call the original function
      return substr.call(this, start, length);
    }
  }(String.prototype.substr);
}
//-----------------------------------------------------------------
function PixelTxtToNumber(Value){
	return parseInt(Value);
}
//-----------------------------------------------------------------
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
function Euterpe_Element_Exist(ID){
	var Test=FindEuterpeElementFromID(ID);
	if(Test==undefined)
		return false;
	return true;
}
//-----------------------------------------------------------------
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
function ScreenCoordinatesToObj(Obj,x,y){
	var Tmp=ObjCoordinatesToScreen(Obj,0,0);
	var Out={};
	Out.x=x-Tmp.x;
	Out.y=y-Tmp.y;
	return Out;
}
//-----------------------------------------------------------------
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
function GetScrollX(){
	if(window.scrollX!=undefined)
		return window.scrollX;
	else
		return document.documentElement.scrollLeft;
}
function GetScrollY(){
	if(window.scrollY!=undefined)
		return window.scrollY;
	else
		return document.documentElement.scrollTop;
}
//-----------------------------------------------------------------
function GetDocumentWidth()
{
	if(document.body)
		return Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth,document.documentElement.offsetWidth);
	else
		return 0;
}
function GetDocumentHeight()
{
	if(document.body)
		return Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight,document.documentElement.offsetHeight);
	return 0;
}
//-----------------------------------------------------------------
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
function Euterpe_Log(StringToLog){
	if(window.console)
		console.log(StringToLog);
}
//-----------------------------------------------------------------
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
function GetElementouterHTML(Element){
	if(Element.outerHTML)
		return Element.outerHTML;
	else
		return new XMLSerializer().serializeToString(Element)
}
//-----------------------------------------------------------------
function FindEuterpeElement(UID){
	for(var a=0;a<EuterpeElementArray.length;a++)
	{
		if(EuterpeElementArray[a].GetUID()==UID)
			return EuterpeElementArray[a];
	}
	return undefined;
}
//-----------------------------------------------------------------
function FindEuterpeElementFromID(ID){
	for(var a=0;a<EuterpeElementArray.length;a++)
	{
		if(EuterpeElementArray[a].GetID()==ID)
			return EuterpeElementArray[a];
	}
	return undefined;
}
//-----------------------------------------------------------------
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
function GetBrowserLanguage(){	
	if(window.navigator.userLanguage)
		return window.navigator.userLanguage;
	var Txt=window.navigator.language;
	return Txt.substring(0,2);
}
//-----------------------------------------------------------------
function EuterpeResizeEvent(ObjResized, OldWidth, OldHeight, NewWidth, NewHeight){
	var Msg={
		type: "Euterpe_Resize",
		eventPhase: 2,
		target: ObjResized.Element,
		srcElement: ObjResized.Element,
		OldWidth: OldWidth,
		OldHeight: OldHeight,
		NewWidth: NewWidth,
		NewHeight: NewHeight,		
		ObjResized: ObjResized		
	};
	return ObjResized.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeCreateEvent(ObjCreated,Owner){
	var Msg={
		type: "Euterpe_Create",
		eventPhase: 2,
		target: ObjCreated.Element,
		srcElement: ObjCreated.Element,
		Owner: Owner,
		ObjCreated: ObjCreated		
	};
	ObjCreated.EventMgr(Msg);
	if(Owner!=undefined && Owner!=null)
	{
		Msg.target=Owner.Element;
		Msg.srcElement=Owner.Element;	
		return Owner.EventMgr(Msg);
	}
}
//-----------------------------------------------------------------
function EuterpeMoveEvent(ObjMoved, OldTop, OldLeft, NewTop, NewLeft){
	var Msg={
		type: "Euterpe_Move",
		eventPhase: 2,
		target: ObjMoved.Element,
		srcElement: ObjMoved.Element,
		OldTop: OldTop,
		OldLeft: OldLeft,
		NewTop: NewTop,
		NewLeft: NewLeft,		
		ObjMoved: ObjMoved		
	};
	return ObjMoved.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeShowEvent(ObjShowed){
	var Msg={
		type: "Euterpe_Show",
		eventPhase: 2,
		target: ObjShowed.Element,
		srcElement: ObjShowed.Element,	
		ObjShowed: ObjShowed		
	};
	return ObjShowed.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeHideEvent(ObjShowed){
	var Msg={
		type: "Euterpe_Hide",
		eventPhase: 2,
		target: ObjShowed.Element,
		srcElement: ObjShowed.Element,	
		ObjShowed: ObjShowed		
	};
	return ObjShowed.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeChangeTextEvent(ObjChanged,OldText,NewText){
	var Msg={
		type: "Euterpe_Chg_Text",
		eventPhase: 2,
		target: ObjChanged.Element,
		srcElement: ObjChanged.Element,
		OldText: OldText,
		NewText: NewText,
		ObjChanged: ObjChanged		
	};
	return ObjChanged.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeChangeClass(ObjChanged,OldClass, NewClass){
	var Msg={
		type: "Euterpe_Chg_Class",
		eventPhase: 2,
		target: ObjChanged.Element,
		srcElement: ObjChanged.Element,
		OldClass: OldClass,
		NewClass: NewClass,
		ObjChanged: ObjChanged		
	};
	return ObjChanged.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeTabSelection(SelectTab){
	var Msg={
		type: "Euterpe_Sel_Tab",
		eventPhase: 2,
		target: SelectTab.Element,
		srcElement: SelectTab.Element,
		SelectTab: SelectTab,
		UID: SelectTab.GetUID(),
		TabSelected: SelectTab		
	};
	if(SelectTab.Dad!=null && SelectTab.Dad!=undefined)
	{
		Msg.target=SelectTab.Dad.Element;
		Msg.srcElement=SelectTab.Dad.Element;
		return SelectTab.Dad.EventMgr(Msg);
	}
}
//-----------------------------------------------------------------
function EuterpeTreeNodeExpanded(TreeNode){
	var Msg={
		type: "Euterpe_TreeNode_Exp",
		eventPhase: 2,
		target: TreeNode.Element,
		srcElement: TreeNode.Element,
		TreeNode: TreeNode,
		UID: TreeNode.GetUID()
	};
	TreeNode.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeTreeNodeCollapsed(TreeNode){
	var Msg={
		type: "Euterpe_TreeNode_Col",
		eventPhase: 2,
		target: TreeNode.Element,
		srcElement: TreeNode.Element,
		TreeNode: TreeNode,
		UID: TreeNode.GetUID()
	};
	TreeNode.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeFormInvalidated(EForm,EElement){
	var Msg={
		type: "Euterpe_Form_Incomplete",
		eventPhase: 2,
		target: EForm.Element,
		srcElement: EForm.Element,
		Form: EForm,
		InvalidElement:EElement,
		UID: EForm.GetUID()
	};
	EForm.EventMgr(Msg);
}
//-----------------------------------------------------------------
function EuterpeFormValidated(EForm){
	var Msg={
		type: "Euterpe_Form_Complete",
		eventPhase: 2,
		target: EForm.Element,
		srcElement: EForm.Element,
		Form: EForm,
		UID: EForm.GetUID()
	};
	EForm.EventMgr(Msg);
}
//-----------------------------------------------------------------
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
function Euterpe_Obj(HTML_Tag){
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
	this.SetAttribute=function(Attr,Value){
		this.Element.setAttribute(Attr,Value);
	}
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
	this.GetInnerHeight=function(){
		return this.GetHeight()-this.GetBorderSize("bottom")-this.GetBorderSize("top");
	}
	this.GetInnerWidth=function(){
		return this.GetWidth()-this.GetBorderSize("left")-this.GetBorderSize("right");
	}	
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
				case "left":{
					Value=this.Element.currentStyle.borderLeftWidth;
				}break;
				case "right":{
					Value=this.Element.currentStyle.borderRightWidth;
				}break;
				case "top":{
					Value=this.Element.currentStyle.borderTopWidth;
				}break;
				case "bottom":{
					Value=this.Element.currentStyle.borderBottomWidth;
				}break;	
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
				case "left":{
					Value=this.Element.currentStyle.paddingLeft;
				}break;
				case "right":{
					Value=this.Element.currentStyle.paddingRight;
				}break;
				case "top":{
					Value=this.Element.currentStyle.paddingTop;
				}break;
				case "bottom":{
					Value=this.Element.currentStyle.paddingBottom;
				}break;	
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
				case "left":{
					Value=this.Element.currentStyle.marginLeft;
				}break;
				case "right":{
					Value=this.Element.currentStyle.marginRight;
				}break;
				case "top":{
					Value=this.Element.currentStyle.marginTop;
				}break;
				case "bottom":{
					Value=this.Element.currentStyle.marginBottom;
				}break;	
			}
			Value=String(Value);
			if(Value=="medium")
				Value="3px";
			if(Value=="auto")
				Value="0px";
			if(Value.lastIndexOf("px"))
				Value=Value.substr(0,Value.length-2);			
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
		if(this.Browser=="MSIE")
			this.SetStyleProperty("width","");
		this.SetStyleProperty("width",Width_Str);
		if(this.TextElement)
			EuterpeSetElementStyleProperty(this.TextElement,"width",Width_Str);
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
					if(Value==null || Value==undefined)
						Value=0;
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
		if(this.Element)
			return this.GetTop()+this.GetHeight();
		return undefined;
	}
	this.GetRight=function(){
		if(this.Element)
			return this.GetLeft()+this.GetWidth();
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
	this.GetElement=function(){
		return this.Element;
	}
	this.GetUID=function(){
		if(this.Element!=null)
			return this.GetAttribute("data-Euterpe_UID");
		return undefined;
	}
	this.SetID=function(ID){
		if(this.Element)
			this.Element.id=ID;
	}
	this.GetID=function(){
		return this.Element.id;
	}	
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
	this.SetText=function(Text){
		this.BaseSetText(Text);
	}
	this.GetText=function(){
		var Out=undefined;
		if(this.Element!=null)
		{
			if(this.TextElement != null)
				return this.TextElement.innerHTML;
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
		if(Width!="")
			this.SetWidth(Width);
		if(Height!="")
			this.SetHeight(Height);
		if(Left!=null)
			this.SetLeft(Left);
		if(Top!=null)
			this.SetTop(Top);
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
					if(Obj!=undefined)
						Obj.Hide();
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
						if(Txt!="Euterpe_Popup_Menu")
							Obj.Show();
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
		if(Test!=0 && Test!=10)
			this.CheckPageBorder=true;
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
	this.GetType=function(){
		return this.GetAttribute("data-Euterpe_Type");
	}
	this.Destroy=function(){
		while(this.Element.hasChildNodes())
			this.Element.removeChild(this.Element.firstChild);
		if(this.Dad!=undefined &&this.Dad!=null)
			this.Dad.Element.removeChild(this.Element);
		else
			document.body.removeChild(this.Element);
	}
	this.ParentAlignTop=function(){
		this.SetTop("0px");
	}
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
	this.ParentAlignLeft=function(){
		this.SetLeft("0px");
	}
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
	this.SetHTML=function(HTML){
		this.SetText(HTML);
	}
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
		if(a)
			return parseInt(a);
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
				if(b<0)
					b=null;
				if(b!=null)
					Out.push(FindEuterpeElement(this.Element.childNodes[a].getAttribute("data-Euterpe_UID")));
			}
		}
		return Out;
	}
	this.GetMaxChildZ=function(){
		var Z=this.GetZIndex();
		var Tmp=this.GetEuterpeChild();
		for(var a=0;a<Tmp.length;a++){
			if(Z<Tmp[a].GetZIndex())
				Z=Tmp[a].GetZIndex();
		}
		return Z;
	}
}
//-----------------------------------------------------------------
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
Euterpe_Page.prototype=new Euterpe_Obj;
Euterpe_Page.prototype.constructor=Euterpe_Page;
//-----------------------------------------------------------------
function Euterpe_Panel(Euterpe_Owner,ID,Class_Name){
/*
	Se introduci una position relative, devi ricordarti di aggiungere
	un "display:block" altrimenti non vengono effettuate le dimensioni...
*/
	this.Setup=function(Owner,UID,Class){
		this.BaseCreation("span",Owner,"Euterpe_Panel");
		if(UID)
			this.SetID(ID);
		if(Class)
			this.ApplyClass(Class);
	}
	this.BaseCreation=function(Creation_Type,Own,Euterpe_Type){
		this.Create(Creation_Type);
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
Euterpe_Panel.prototype=new Euterpe_Obj;
Euterpe_Panel.prototype.constructor=Euterpe_Panel;
//-----------------------------------------------------------------
function Euterpe_Align_Panel(Euterpe_Owner,ID,Class_Name){
	this.LastAlign="top";
	this.Setup=function(Owner,UID,Class){
		this.BaseCreation("span",Owner,"Euterpe_Align_Panel");
		this.SetAttribute("data-Euterpe_VAlign","top");
		this.SetAttribute("data-Euterpe_HAlign","left");
		if(UID)
			this.SetID(UID);
		if(Class)
			this.ApplyClass(Class);		
	}
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
	this.SetText=function(Text){
		if(this.GetWidth()==0)
			this.SetWidth((GetElementTextWidth(this.Element,Text)+8)+"px");
		this.BaseSetText(Text);
		this.Redraw();
		this.MakeUnselectable();
	}
	this.SetCursor=function(Type){
		if(this.TextElement!=undefined && this.TextElement!=null)
			EuterpeSetElementStyleProperty(this.TextElement,"cursor",Type);
		this.SetStyleProperty("cursor",Type);
	}
	this.SetVAlign=function(Align){
		this.SetAttribute("data-Euterpe_VAlign",Align);
		this.Redraw();
	}
	this.SetHAlign=function(Align){
		this.SetAttribute("data-Euterpe_HAlign",Align);
		this.Redraw();	
	}
	this.Show=function(){
		//this.SetVAlign(this.LastAlign);	
		this.SetStyleProperty("visibility","visible");		
		this.ShowChild();
		var D=new Date();
		this.LastShowTime=D.getTime();		
		EuterpeShowEvent(this);		
	}
	this.ApplyClass=function(Class_Name){
		if(this.Element!=null)
		{
			if(Class_Name!=undefined)
			{
				var Old=this.Element.className;
				this.Element.className=Class_Name;
				NormalClass=Class_Name;
				EuterpeChangeClass(this,Old,Class_Name);
				this.Redraw();
			}
		}
	}	
	this.SetHeight=function(Height_Str){
		var W=this.GetWidth();
		var H=this.GetHeight();	
		if(this.Browser=="MSIE")
			this.SetStyleProperty("height","");
		this.SetStyleProperty("height",Height_Str);
		EuterpeResizeEvent(this,W,H,this.GetWidth(),this.GetHeight());
		this.Redraw();
	}	
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
//-----------------------------------------------------------------
function Euterpe_Button(Euterpe_Owner,ID,Class_Name){
	this.Setup=function(Owner,UID,Class){
		//this.BaseCreation("button",Owner,"Euterpe_Align_Panel");
		this.BaseCreation("a",Owner,"Euterpe_Align_Panel");
		this.SetAttribute("href","#");
		this.SetStyleProperty("text-decoration","none");
		this.SetAttribute("data-Euterpe_Type","Euterpe_Button");
		this.SetCursor("pointer");
		this.SetText("Button");
		EuterpeCreateEvent(this,Owner);
		if(UID)
			this.SetID(UID);
		if(Class)
			this.ApplyClass(Class);		
	}
	this.Redraw=function(){
		if(this.TextElement){
			EuterpeSetElementStyleProperty(this.TextElement,"position","absolute");
			var W=GetElementTextWidth(this.Element,GetTextWithoutSpace(this.GetText()));
			var H=GetElementTextHeight(this.Element,this.GetText());
			var p=(this.GetInnerWidth()-W)/2;
			EuterpeSetElementStyleProperty(this.TextElement,"left",p+"px");
			EuterpeSetElementStyleProperty(this.TextElement,"width",W+"px");
			p=(this.GetInnerHeight()-H)/2;
			EuterpeSetElementStyleProperty(this.TextElement,"top",p+"px");
			EuterpeSetElementStyleProperty(this.TextElement,"height",H+"px");
		}
	}
	this.SetText=function(Text){
		if(this.GetWidth()==0)
			this.SetWidth((GetElementTextWidth(this.Element,Text)+8)+"px");
		this.BaseSetText(Text);
		this.Redraw();
		this.MakeUnselectable();	
	}
	this.SetCursor=function(Type){
		if(this.TextElement!=undefined && this.TextElement!=null)
			EuterpeSetElementStyleProperty(this.TextElement,"cursor",Type);
		this.SetStyleProperty("cursor",Type);
	}	
	this.SetClickFunction=function(Function){
		this.AddEventMgr("click",Function);	
	}	
	//Prova da qui...
	this.ApplyClass=function(Class_Name){
		if(this.Element!=null)
		{
			if(Class_Name!=undefined)
			{
				var Old=this.Element.className;
				this.Element.className=Class_Name;
				NormalClass=Class_Name;
				EuterpeChangeClass(this,Old,Class_Name);
				this.Redraw();
			}
		}
	}	
	this.SetHeight=function(Height_Str){
		var W=this.GetWidth();
		var H=this.GetHeight();	
		if(this.Browser=="MSIE")
			this.SetStyleProperty("height","");
		this.SetStyleProperty("height",Height_Str);
		EuterpeResizeEvent(this,W,H,this.GetWidth(),this.GetHeight());
		this.Redraw();
	}	
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
	//In prova...
	this.Setup(Euterpe_Owner,ID,Class_Name);
}
Euterpe_Button.prototype=new Euterpe_Panel;
Euterpe_Button.prototype.constructor=Euterpe_Button;
//-----------------------------------------------------------------
function Euterpe_Popup_Item(Euterpe_Owner,ID,Class_Name){
	var Arrow;
	this.PopupOwner;
	this.PopupTimeout;
	this.Load=function(Owner,UID,Class){
		this.Setup(Owner,UID,Class);
		this.SetHAlign("left");
		this.SetVAlign("middle");
		this.SetAttribute("data-Euterpe_Type","Euterpe_Popup_Item");
		this.SetCursor("pointer");
		if(this.Dad!=undefined)
		{
			var Type=this.Dad.Element.getAttribute("data-Euterpe_Type");
			if(Type=="Euterpe_Popup_Menu")
				this.PopupOwner=this.Dad;
		}
		Arrow=document.createElement("span");
		this.Element.insertBefore(Arrow,this.TextElement);
		this.Hide();
		this.AddEventMgr("mouseover",this.MouseStayOver);
		this.AddEventMgr("mouseout",this.MouseLeaveOver);
		EuterpeCreateEvent(this,Owner);
		if(Class)
			this.ApplyClass(Class);
	}
	this.SetClickFunction=function(Value){
		this.AddEventMgr("click",Value);
	}
	this.DrawItem=function(){
		var Txt=this.GetText();
		var W=GetElementTextWidth(this.Element,GetTextWithoutSpace(Txt));	
		var H=GetElementTextHeight(this.Element,GetTextWithoutSpace(Txt));	
		this.Show();
		var w=0;
		var h=0;
		if(this.HasPopup()){
			Arrow.innerHTML="\u25b6";
			h=Arrow.offsetHeight;	
			w=GetElementTextWidth(Arrow,"\u25b6");	
			if(h<H)
			{
				EuterpeSetElementStyleProperty(Arrow,"top",((this.GetInnerHeight()-h)/2)+"px")
				h=H;
			}
			EuterpeSetElementStyleProperty(Arrow,"left",W+"px");
			EuterpeSetElementStyleProperty(Arrow,"position","absolute");
		}
		else
		{
			h=H;
			Arrow.innerHTML=""
		}
		this.SetHeight((h)+"px");
		this.SetWidth((W+w)+"px");
	}
	this.AddPopup=function(Menu){
		var Txt=Menu.GetUID();
		Menu.PopupHolder=this;
		this.SetAttribute("data-Euterpe_PopupOwner",Txt,"");	
	}	
	this.HasPopup=function(){
		var P=this.GetAttribute("data-Euterpe_PopupOwner");
		if(P!=null && P!=undefined)
			return true;
		else
			return false;
	}	
	this.ShowPopup=function(){
		if(this.HasPopup)
		{
			var P=this.GetAttribute("data-Euterpe_PopupOwner");
			var Pop=FindEuterpeElement(P);
			var X,Y;
			X=this.PopupOwner.GetLeft()+this.GetRight();
			Y= this.PopupOwner.GetTop()+this.GetTop();
			Pop.Place("","",X+"px",Y+"px");
			Pop.Show();
		}
	}
	this.HidePopup=function(){
		if(this.HasPopup)
		{
			var P=this.GetAttribute("data-Euterpe_PopupOwner");
			var Pop=FindEuterpeElement(P);
			if(Pop!=undefined)
				Pop.Hide();
		}	
	}
	this.Hide=function(){
		this.SetStyleProperty("visibility","hidden");
		this.HideChild();
		if(this.HasPopup())
			this.HidePopup();
		EuterpeHideEvent(this);	
	}
	this.MouseStayOver=function(E){
		var Obj=GetEuterpeObjFromMsg(E);
		if(Obj.HasPopup()){
			if(GetBrowser() != "MSIE")
				var Temp=window.setTimeout(Obj.CheckForMouse,400,Obj.GetUID());
			else
				var Temp=window.setTimeout(function(){Obj.CheckForMouse(Obj.GetUID());},400);
			Obj.SetAttribute("data-PopupTimeout",Temp);
			Euterpe_Log("MouseStayOver: "+Temp);
		}
	}
	this.MouseLeaveOver=function(E){
		var Obj;
		if(E.fromElement)
			Obj=E.fromElement;
		else
			Obj=E.target;
		var UID=Obj.getAttribute("data-Euterpe_UID");
		while(UID == null){
			Obj=Obj.parentNode;
			UID=Obj.getAttribute("data-Euterpe_UID");
		}
		if(UID==Euterpe_Const_TextUID)
		{
			Obj=Obj.parentNode;
			if(Obj && Obj.getAttribute)
				UID=Obj.getAttribute("data-Euterpe_UID");
			else
				UID=-200;
		}		
		Obj=FindEuterpeElement(UID);		
		var Tmp=Obj.GetAttribute("data-PopupTimeout");
		if(Tmp)
		{
			//window.clearTimeout(Tmp);
		}
	}
	this.CheckForMouse=function(UID){
		var Obj=FindEuterpeElement(UID);
		if(Obj.HasPopup())
			Obj.ShowPopup();
	}
	this.Load(Euterpe_Owner,ID,Class_Name);
}
Euterpe_Popup_Item.prototype=new Euterpe_Align_Panel;
Euterpe_Popup_Item.prototype.constructor=Euterpe_Popup_Item;
//-----------------------------------------------------------------
function Euterpe_Popup_Menu(Euterpe_Owner,ID,Class_Name){
	this.ItemArray=new Array();
	this.PopupHolder;
	this.isShowed;
	this.Setup=function(Owner,UID,Class){
		this.Create("span");
		this.SetAttribute("data-Euterpe_Type","Euterpe_Popup_Menu");
		if(Owner!=undefined)
		{
			if(Owner!=null)
				Owner.Element.appendChild(this.Element);
		}
		this.Hide();
		this.PopupHolder=undefined;
		this.isShowed=false;
		EuterpeCreateEvent(this,Owner);
		if(UID)
			this.SetID(UID);
		if(Class)
			this.ApplyClass(Class);
	}
	this.DrawPopup=function(){
		if(this.Showed())
		{
			var W=0;
			var T=0;
			for(var a=0;a<this.ItemArray.length;a++)
			{
				this.ItemArray[a].SetTop(T+"px");
				this.ItemArray[a].DrawItem();
				if(W < this.ItemArray[a].GetWidth())
					W=this.ItemArray[a].GetWidth();
				T += this.ItemArray[a].GetHeight();
			}
			for(var a=0;a<this.ItemArray.length;a++)
				this.ItemArray[a].SetWidth(W+"px");
		}
	}
	this.CleanPopup=function(){
		var Page=GetEuterpePage();
		var Obj=Page.ObjUnderMouse;
		for(var a=0;a<this.ItemArray.length;a++)
		{
			if(this.ItemArray[a].HasPopup())
			{
				if(Obj.PopupOwner!=undefined)
				{
					
				}
				else
					this.ItemArray[a].HidePopup();
			}
		}
	}
	this.Show=function(){
		this.SetStyleProperty("visibility","visible");
		this.DrawPopup();
		var D=new Date();
		this.LastShowTime=D.getTime();		
		EuterpeShowEvent(this);	
	}
	this.AddItem=function(Txt,ID,Class){
		var Item=new Euterpe_Popup_Item(this,ID,Class);
		if(Txt)
			Item.SetText(Txt);
		else
			Item.SetText("Menu "+this.ItemArray.length);
		Item.PopupOwner=this;
		this.ItemArray.push(Item);
		this.DrawPopup();
		return Item;
	}
	if(Euterpe_Owner!=undefined)
		this.Setup(Euterpe_Owner,ID,Class_Name);	
}
Euterpe_Popup_Menu.prototype=new Euterpe_Panel;
Euterpe_Popup_Menu.prototype.constructor=Euterpe_Popup_Menu;
//-----------------------------------------------------------------
function Euterpe_Tab(Euterpe_Owner, Hori,UID){
	this.Tab;
	this.Body;
	var Horizontal;
	var Self=this;
	var TabSelectedClass,BodySelectedClass;	
	var TabDeselectedClass,BodyDeselectedClass;	
	var TabPlace=0;
	this.TabWidth=undefined;
	this.TabHeight=undefined;	
	this.TabSetup=function(Owner,Hor,ID){
		this.Setup(Owner,ID);	
		this.Body=new Euterpe_Panel(this);	
		this.Tab=new Euterpe_Align_Panel(this);	
		if(Hor){
			Horizontal=true;
			this.SetAttribute("data-Tab_Direction","horz");
			this.Tab.SetStyleProperty("border-right","0px");
		}
		else{
			Horizontal=false;
			this.SetAttribute("data-Tab_Direction","vert");
			this.Tab.SetStyleProperty("border-bottom","0px");
		}
		this.SetAttribute("data-Tab_Position","0px");
		this.SetAttribute("data-Tab_Height","0px");
		this.SetAttribute("data-Tab_Width","0px");
		this.Tab.SetVAlign("middle");
		this.Tab.SetHAlign("center");
		this.Body.SetStyleProperty("overflow","auto");
		this.Dad=Owner;
		this.SetText("Tab");
		this.Tab.SetCursor("pointer");
		if(this.Browser=="MSIE")
		{
			if(this.BrowserVer==6)
			{
				this.SetStyleProperty("overflow","hidden");
				this.Body.SetStyleProperty("overflow","hidden");
			}
		}
		this.Place("50px","200px","0px","0px");
		this.DrawTab();
		Self=this;
		this.Tab.AddCustomEventMgr("Euterpe_Chg_Class",TabChangeClass,false);
		this.Body.AddCustomEventMgr("Euterpe_Chg_Class",TabChangeClass,false);
		this.Tab.AddEventMgr("click",this.TabClick);		
		this.AddCustomEventMgr("Euterpe_Resize",TabResize,false);
		this.AddEventMgr("DOMNodeInserted",MoveToBody,false);	
		this.SetAttribute("data-Euterpe_Type","Euterpe_Tab");		
		this.Tab.SetAttribute("data-Euterpe_Type","Euterpe_Tab_Tab");		
		this.Body.SetAttribute("data-Euterpe_Type","Euterpe_Tab_Body");	
		EuterpeCreateEvent(this,Owner);
	}
	MoveToBody=function(E){
		if(E.target.getAttribute)
		{
			var Element;
			if(E.target)
				Element=E.target;
			else
				Element=E.srcElement;
			var UID_Add=Element.getAttribute("data-Euterpe_UID");
			if(UID_Add!=null)
			{
				var Parent=Element.parentNode;
				if(Self.GetUID()==Parent.getAttribute("data-Euterpe_UID"))
				{
					Euterpe_Log("Add element to this.Body not to this...(DOMNodeInserted not available ie IE6-8)");
					Self.Body.Element.appendChild(Element);
				}
			}
		}
	}
	TabChangeClass=function(Msg){
		Msg.ObjChanged.Dad.DrawTab();
	}
	TabResize=function(Msg){
		Msg.ObjResized.DrawTab();	
	}
	this.DrawTab=function(){
		var TabH,TabW;
		var BodyH,BodyW;
		if(this.Tab && this.Body){
			//this.Tab.SetWidth("");
			TabW=this.GetAttribute("data-Tab_Width");
			TabH=this.GetAttribute("data-Tab_Height");
			TabPlace=this.GetAttribute("data-Tab_Position");
			if(TabW==null || TabW=="0px"){
				if(this.Tab.GetText())
					TabW=(GetElementTextWidth(this.Tab.TextElement,this.Tab.GetText())+1)+"px";
				else
					TabW="40px";			
			}
			if(TabH==null || TabH=="0px"){
				if(this.Tab.GetText())
					TabH=(GetElementTextHeight(this.Tab.TextElement,this.Tab.GetText())+1)+"px";
				else
					TabH="25px";			
			}			
			Horizontal=this.GetAttribute("data-Tab_Direction");
			if(Horizontal=="horz"){
				this.Tab.Place(TabW,TabH,"0px",TabPlace);
				BodyH=this.GetInnerHeight()-this.Body.GetBorderSize("bottom")-this.Body.GetBorderSize("top")
							-this.Body.GetPadding("bottom")-this.Body.GetPadding("top");
				BodyW=this.GetInnerWidth()-this.Tab.GetRight()-this.Body.GetBorderSize("right")
							-this.Body.GetPadding("left")-this.Body.GetPadding("right");
				this.Body.Place(BodyW+"px",BodyH+"px",(this.Tab.GetRight()-this.Body.GetBorderSize("left"))+"px","0px");
			}
			else
			{	
				this.Tab.Place(TabW,TabH,TabPlace,"0px");
				BodyH=this.GetInnerHeight()-this.Tab.GetBottom()-this.Body.GetBorderSize("bottom")
							-this.Body.GetPadding("bottom")-this.Body.GetPadding("top");
				BodyW=this.GetInnerWidth()-this.Body.GetBorderSize("left")-this.Body.GetBorderSize("right")
							-this.Body.GetPadding("left")-this.Body.GetPadding("right");
				this.Body.Place(BodyW+"px",BodyH+"px","0px",(this.Tab.GetBottom()-this.Body.GetBorderSize("top"))+"px");
			}
			this.Tab.Redraw();
		}
	}
	this.SetText=function(T){
		var OldTxt=this.Tab.GetText();
		this.Tab.SetText(T);		
		this.DrawTab();
		EuterpeChangeTextEvent(this,OldTxt,T);
	}		
	this.ApplySelectedClass=function(TabClass, BodyClass){
		var OldTab=TabSelectedClass;
		var OldBody=BodySelectedClass;
		TabSelectedClass =TabClass;
		BodySelectedClass=BodyClass;
		if(this.Body.Showed())
		{
			this.Tab.ApplyClass(TabSelectedClass);
			this.Body.ApplyClass(BodySelectedClass);
			this.DrawTab();
			EuterpeChangeClass(this.Tab,OldTab,TabSelectedClass);
			EuterpeChangeClass(this.Tab,OldBody,BodySelectedClass);			
		}
	}	
	this.ApplyDeselectedClass=function(TabClass, BodyClass){
		var OldTab=TabDeselectedClass;
		var OldBody=BodyDeselectedClass;	
		TabDeselectedClass =TabClass;
		BodyDeselectedClass=BodyClass;
		if(!this.Body.Showed())
		{
			this.Tab.ApplyClass(TabDeselectedClass);
			this.Body.ApplyClass(BodyDeselectedClass);
			this.DrawTab();	
			EuterpeChangeClass(this.Tab,OldTab,TabDeselectedClass);
			EuterpeChangeClass(this.Tab,OldBody,BodyDeselectedClass);						
		}	
	}	
	this.SelectTab=function(){
		this.Tab.SetStyleProperty("z-index",3);
		this.Body.SetStyleProperty("z-index",3);	
		//this.SetStyleProperty("z-index",1);
		this.Body.Show();
		//this.Body.ShowChild();
		this.Tab.ApplyClass(TabSelectedClass);
		this.Body.ApplyClass(BodySelectedClass);	
		Horizontal=this.GetAttribute("data-Tab_Direction");
		if(Horizontal=="horz")
			this.Tab.SetStyleProperty("border-bottom","");	
		else
			this.Tab.SetStyleProperty("border-right","");		
		this.DrawTab();
	}
	this.DeselectTab=function(){
		this.Tab.SetStyleProperty("z-index",2);
		this.Body.SetStyleProperty("z-index",2);			
		this.Body.Hide();
		this.Body.HideChild();
		this.Tab.ApplyClass(TabDeselectedClass);
		this.Body.ApplyClass(BodyDeselectedClass);		
		Horizontal=this.GetAttribute("data-Tab_Direction");
		this.DrawTab();		
		if(Horizontal=="horz"){
			this.Tab.SetStyleProperty("border-bottom","");	
			//this.Tab.SetStyleProperty("width",(this.Tab.GetWidth()-1)+"px");
		}
		else{
			this.Tab.SetStyleProperty("border-right","");
			this.Tab.SetStyleProperty("height",(this.Tab.GetInnerHeight()-1)+"px");
		}
	}		
	this.MoveTab=function(Place){
		this.SetAttribute("data-Tab_Position",Place);
		this.DrawTab();
	}	
	this.TabClick=function(E){
		EuterpeTabSelection(Self);
	}	
	this.GetText=function(){
		return this.Tab.GetText();
	}
	this.FixTabHeight=function(Value){
		this.SetAttribute("data-Tab_Height",Value);
		this.DrawTab();
	}
	this.FixTabWidth=function(Value){
		this.SetAttribute("data-Tab_Width",Value);
		this.DrawTab();
	}
	this.isSelected=function(){
		return this.Body.Showed();
	}
	this.isHorizontal=function(){
		return Horizontal;
	}
	this.TabSetup(Euterpe_Owner, Hori,UID);
}
Euterpe_Tab.prototype=new Euterpe_Panel;
Euterpe_Tab.prototype.constructor=Euterpe_Tab;
//-----------------------------------------------------------------
function Euterpe_Tab_Mgr(Euterpe_Owner,Hor,UID,Class_Name){
	this.TabList=new Array();
	var Self=this;
	var Horizontal;
	this.TabWidth;
	this.TabHeight;
	this.TabStartDistance=5;
	this.TabDistance=10;
	this.TabTopBorderDistance;
	this.TabLeftBorderDistance;
	this.TabRightBorderDistance;
	this.TabBottomBorderDistance;
	var MaxTabWidth=0;
	this.Load=function(Owner,Hor,ID,Class){
		this.Setup(Owner,ID,Class);
		this.AddCustomEventMgr("Euterpe_Resize",EvtResize,false);
		this.AddCustomEventMgr("Euterpe_Chg_Text",ChangeTabTxt,false);
		this.AddCustomEventMgr("Euterpe_Sel_Tab",SelectaTab,false);
		this.SetStyleProperty("z-index","0");
		if(Hor){
			this.SetAttribute("data-Tab_Direction","horz");
			Horizontal=true;
		}
		else{
			this.SetAttribute("data-Tab_Direction","vert");
			Horizontal=false;
		}
		this.TabTopBorderDistance=-1;
		this.TabLeftBorderDistance=-1;
		this.TabRightBorderDistance=-1;
		this.TabBottomBorderDistance=-1;
		this.AddCustomEventMgr("Euterpe_Chg_Class",TabChangeClass,false);	
		this.SetAttribute("data-Euterpe_Type","Euterpe_Tab_Mgr");
		if(this.Browser=="MSIE")
		{
			if(this.BrowserVer==6)
				this.SetStyleProperty("overflow","hidden");
		}		
		EuterpeCreateEvent(this,Owner);
		if(Class)
			this.ApplyClass(Class);		
	}
	EvtResize=function(E){
		if(Self.GetUID()==E.ObjResized.GetUID())
		{
			for(var a=0;a<E.ObjResized.TabList.length;a++)
			{
				E.ObjResized.TabList[a].SetHeight((E.ObjResized.GetInnerHeight()-E.ObjResized.TabTopBorderDistance-E.ObjResized.TabBottomBorderDistance)+"px");
				E.ObjResized.TabList[a].SetWidth((E.ObjResized.GetInnerWidth()-E.ObjResized.TabRightBorderDistance-E.ObjResized.TabLeftBorderDistance)+"px");
				if(E.ObjResized.TabList[a].isSelected())
					E.ObjResized.TabList[a].SelectTab();		
				else
					E.ObjResized.TabList[a].DeselectTab();
			
			}
		}
	}
	ChangeTabTxt=function(E){
		Self.AdjustTab();
	}		
	TabChangeClass=function(E){
		for(var a=0;a<Self.TabList.length;a++)
		{
			Self.TabList[a].SetHeight((Self.GetInnerHeight()-Self.TabTopBorderDistance-Self.TabBottomBorderDistance)+"px");
			Self.TabList[a].SetWidth((Self.GetInnerWidth()-Self.TabRightBorderDistance-Self.TabLeftBorderDistance)+"px");
			if(Self.TabList[a].isSelected())
				Self.TabList[a].SelectTab();		
			else
				Self.TabList[a].DeselectTab();
		}	
	}	
	this.AddTab=function(TabTxt){
		Horizontal=this.GetAttribute("data-Tab_Direction");
		var Out;
		var Place=this.TabStartDistance;
		if(Horizontal=="horz"){
			for(var a=0;a<this.TabList.length;a++){
				Place+=this.TabList[a].Tab.GetHeight()+this.TabDistance;
				this.TabList[a].DeselectTab();
			}
			Out=new Euterpe_Tab(this,true);
		}
		else
		{
			for(var a=0;a<this.TabList.length;a++)
			{
				Place += this.TabList[a].Tab.GetWidth()+this.TabDistance;			
				this.TabList[a].DeselectTab();
			}		
			Out=new Euterpe_Tab(this);
		}
		this.TabList.push(Out);
		Out.Place((this.GetInnerWidth()-this.TabRightBorderDistance-this.TabLeftBorderDistance)+"px",
					(this.GetInnerHeight()-this.TabTopBorderDistance-this.TabBottomBorderDistance)+"px",
					(this.TabTopBorderDistance)+"px",(this.TabLeftBorderDistance)+"px");
		if(TabTxt)
			Out.SetText(TabTxt);
		Out.MoveTab(Place+"px");
		Out.SelectTab();
		this.AdjustTab();
		return Out;
	}
	SelectaTab=function(E){
		var Test;
		for(var a=0;a<E.SelectTab.Dad.TabList.length;a++)
		{
			if(E.SelectTab.Dad.TabList[a].GetUID()==E.UID)
				Test=E.SelectTab.Dad.TabList[a];
			else
				E.SelectTab.Dad.TabList[a].DeselectTab();
		}
		Test.SelectTab();
	}		
	this.FixTabHeight=function(Value){
		this.TabHeight=Value;
		var H=this.TabStartDistance;
		for(var a=0;a<this.TabList.length;a++)
		{
			this.TabList[a].FixTabHeight(Value);
			if(Horizontal)
			{
				this.TabList[a].MoveTab(H);
				H+= this.TabList[a].Tab.GetHeight()+this.TabDistance;
			}
		}			
		if(Value=="")
			this.TabHeight=undefined;
	}
	this.FixTabWidth=function(Value){
		this.TabWidth=Value;
		var Src;
		var W=this.TabStartDistance;
		for(var a=0;a<this.TabList.length;a++)
		{
			this.TabList[a].FixTabWidth(Value);
			if(!Horizontal)
			{
				this.TabList[a].MoveTab(W);
				W+= this.TabList[a].Tab.GetWidth()+this.TabDistance;
			}
		}
		if(Value=="")
			this.TabWidth=undefined;
	}	
	this.AdjustTab=function(){
		var Value;
		Horizontal=this.GetAttribute("data-Tab_Direction");
		if(Horizontal=="horz")
		{
			var W=0;
			for(var a=0;a<this.TabList.length;a++)
			{
				if(this.TabList[a].Tab.TextElement){
					Value=GetElementTextWidth(this.TabList[a].Tab.Element,
											this.TabList[a].Tab.GetText());
				}
				if(Value>W)
					W=Value;
			}
			for(var a=0;a<this.TabList.length;a++){
				this.TabList[a].FixTabWidth(W+"px");		
			}
		}
		else
		{
			var H=0;
			for(var a=0;a<this.TabList.length;a++)
			{
				if(this.TabList[a].Tab.TextElement){
					this.TabList[a].Tab.SetHeight("");
					//Value=this.TabList[a].Tab.TextElement.offsetHeight;
					Value=GetElementTextHeight(this.TabList[a].Tab.Element,
											this.TabList[a].Tab.GetText());
				}
				if(Value > H)
					H=Value;
			}
			for(var a=0;a<this.TabList.length;a++){
				this.TabList[a].FixTabHeight(H+"px");
			}
		}
	}
	this.Load(Euterpe_Owner,Hor,UID,Class_Name);
}
Euterpe_Tab_Mgr.prototype=new Euterpe_Panel;
Euterpe_Tab_Mgr.prototype.constructor=Euterpe_Tab_Mgr;
//-----------------------------------------------------------------
function Euterpe_IFrame(Euterpe_Owner,Class_Name){
	this.Setup=function(Owner,Class){
		this.Create("iframe");
		this.SetAttribute("data-Euterpe_Type","Euterpe_IFrame");
		if(Owner!=undefined)
		{
			if(Owner!=null)
			{
				Owner.Element.appendChild(this.Element);
				this.Dad=Owner;
			}
		}	
		this.CheckBorder();
		EuterpeCreateEvent(this,Owner);		
		if(Class)
			this.ApplyClass(Class);
	}
	this.SetSrc=function(Value){
		var Txt=Value;
		if(Txt.indexOf("www")==0)
			Txt="http://"+Txt;	
		this.Element.src=Txt;
	}
	this.GetSrc=function(Value){
		return this.Element.src;
	}
	this.SetName=function(Value){
		this.Element.name=Value;
	}
	this.Setup(Euterpe_Owner,Class_Name);
}
Euterpe_IFrame.prototype=new Euterpe_Obj;
Euterpe_IFrame.prototype.constructor=Euterpe_IFrame;
//-----------------------------------------------------------------
function Euterpe_Anchor(Euterpe_Owner,UID,Class_Name){
	this.Setup=function(Owner,ID,Class){
		this.Create("a");
		this.SetAttribute("data-Euterpe_Type","Euterpe_Anchor");
		this.SetText("Anchor");
		if(Owner!=undefined)
		{
			if(Owner!=null)
			{
				Owner.Element.appendChild(this.Element);
				this.Dad=Owner;
			}
		}	
		this.CheckBorder();
		EuterpeCreateEvent(this,Owner);		
		if(UID)
			this.SetID(ID);
		if(Class)
			this.ApplyClass(Class);
		
	}
	this.SetHRef=function(href){
		var Txt=href;
		if(Txt.indexOf("www")==0)
			Txt="http://"+Txt;
		this.Element.href=Txt;
	}
	this.Gethref=function(){
		return this.Element.href;
	}
	this.Setrel=function(rel){
		this.Element.rel=rel;
	}
	this.Getrel=function(){
		return this.Element.rel;
	}	
	this.SetTarget=function(rel){
		this.Element.target=rel;
	}
	this.GetTarget=function(){
		return this.Element.target;
	}		
	this.Setup(Euterpe_Owner,UID,Class_Name);
}
Euterpe_Anchor.prototype=new Euterpe_Obj;
Euterpe_Anchor.prototype.constructor=Euterpe_Anchor;
//-----------------------------------------------------------------
function Euterpe_Dialog(Euterpe_Owner,AsDialog,UID,Dialog_Class,Title_Class){
	var Back1;
	var Self;
	this.Title;
	var HighValue=1000;
	var ShowAsDialog;
	this.Setup=function(Owner,Dial,ID,CDialog,CTitle){
		ShowAsDialog=Dial;
		if(ShowAsDialog==undefined || ShowAsDialog==null)
			ShowAsDialog=true;
		Back1=new Euterpe_Panel(Owner);
		Back1.SetStyleProperty("background-color","black");
		Back1.SetStyleProperty("z-index",GetEuterpePage().GetMaxChildZ()+1);
		this.Create("span");
		this.SetAttribute("data-Euterpe_Type","Euterpe_Dialog");
		this.SetAttribute("data-ShowTitle",true);
		this.SetAttribute("data-ShowDialog",ShowAsDialog);
		if(Owner!=undefined)
		{
			if(Owner!=null)
			{
				Owner.Element.appendChild(this.Element);
				this.Dad=Owner;
			}
		}
		Self=this;
		this.SetWidth("500px");
		this.SetHeight("300px");
		this.Title=new Euterpe_Align_Panel(this);
		this.Title.SetHeight("40px");
		this.Title.SetVAlign("middle");
		SetOpacity(50);
		this.Hide();
		Back1.Hide();
		this.CheckBorder();
		this.AddCustomEventMgr("Euterpe_Create",ElementAdded);
		EuterpeCreateEvent(this,Owner);
		if(CDialog)
			this.ApplyClass(CDialog);
		if(CTitle){
			if(this.Title)
				this.Title.ApplyClass(CTitle);
		}
		if(ID)
			this.SetID(ID);		
		else	
			this.SetID(this.Element.id);
	}
	DrawPanel=function(Obj){
		var Page=GetEuterpePage();
		var W=GetEuterpePage().GetInnerWidth();
		var H=GetEuterpePage().GetInnerHeight();
		var X;
		var Y;
		var BackPanel=Obj.GetBackPanel();
		var T=Obj.GetAttribute("data-ShowDialog");
		if(BackPanel)
		{
			if(T=="true")
				BackPanel.Place(W+"px",H+"px",(0-Page.GetBorderSize("top"))+"px",(0-Page.GetBorderSize("left"))+"px");
			else
				BackPanel.Place("10px","10px","0px","0px");
			EuterpeSetElementStyleProperty(BackPanel.Element,"z-index",Page.GetMaxChildZ()+1);
		}
		if(Obj)
		{
			if(Obj.Element)
			{
				if(T=="true"){
					X=GetScrollX()+((GetWindowWidth()-Obj.GetWidth())/2);
					Y=GetScrollY()+((GetWindowHeight()-Obj.GetHeight())/2);
					Obj.Place(Obj.GetInnerWidth()+"px",Obj.GetInnerHeight()+"px",X+"px",Y+"px");
				}
				Obj.SetStyleProperty("z-index",Page.GetMaxChildZ()+2);
				if(Obj.Title){	
					//if(T=="true")
					{
						Obj.Title.Place((Obj.GetInnerWidth()-Obj.Title.GetBorderSize("left")-Obj.Title.GetBorderSize("right")-
											Obj.Title.GetPadding("left")-Obj.Title.GetPadding("right"))+"px",
											Obj.Title.GetInnerHeight()+"px","0px","0px");
						Obj.Title.SetStyleProperty("border-bottom-left-radius","0px");
						Obj.Title.SetStyleProperty("border-bottom-right-radius","0px");
						Obj.Title.SetAttribute("data-Euterpe_VAlign",Obj.Title.GetAttribute("data-Euterpe_VAlign"));
						Obj.Title.Redraw();
					}
				}
			}
		}
	}
	SetOpacity=function(Value){
		if(Back1!=undefined)
		{
			Back1.SetStyleProperty("opacity",Value/100);
			if(Self.Browser=="MSIE")
				Back1.SetStyleProperty("filter","alpha(opacity="+Value+")");
		}
	}
	this.Show=function(){
		DrawPanel(this);
		Back1.SetStyleProperty("z-index",GetEuterpePage().GetMaxChildZ()+1);
		this.SetStyleProperty("z-index",GetEuterpePage().GetMaxChildZ()+2);
		EuterpeSetElementStyleProperty(this.Element,"visibility","visible");
		if(Back1!=undefined)
		{
			if(ShowAsDialog==true)
				Back1.Show();
			else
				Back1.Hide();
		}
		this.ShowChild();
		var D=new Date();
		this.LastShowTime=D.getTime();		
		EuterpeShowEvent(this);		
	}
	this.Hide=function(){
		Back1.SetStyleProperty("z-index",GetEuterpePage().GetMaxChildZ()-1);
		this.SetStyleProperty("z-index",GetEuterpePage().GetMaxChildZ()-2);	
		this.SetStyleProperty("visibility","hidden");
		this.HideChild();
		if(Back1!=undefined)
			Back1.Hide();
		EuterpeHideEvent(this);
	}	
	this.SetBackgroundColor=function(Value){
		EuterpeSetElementStyleProperty(Back1.Element,"background-color",Value);
	}
	this.SetBackgroundOpacity=function(Value){
		SetOpacity(Value);
	}	
	this.SetTitle=function(Value){
		if(this.Title){
			this.Title.SetText(Value);
			this.Title.Redraw();
		}
	}
	ElementAdded=function(E){
		if(E.ObjCreated)
		{
			if(E.ObjCreated.Showed())
				E.ObjCreated.Hide();
		}
	}
	this.GetBackPanel=function(){
		return Back1;
	}
	this.SetID=function(ID){
		if(this.Element!=null){
			this.Element.id=ID;
			Back1.SetID(ID+"_BackPanel");
			if(this.Title)
				this.Title.SetID(ID+"_Title");
		}
	}
	this.HideTitle=function(){
		this.SetAttribute("data-ShowTitle",false);
		DrawPanel(this);
	}
	this.ShowTitle=function(){
		this.SetAttribute("data-ShowTitle",true);
		DrawPanel(this);
	}	
	this.Setup(Euterpe_Owner,AsDialog,UID,Dialog_Class,Title_Class);
}
Euterpe_Dialog.prototype=new Euterpe_Obj;
Euterpe_Dialog.prototype.constructor=Euterpe_Dialog;
//-----------------------------------------------------------------
function Euterpe_GroupBox(Euterpe_Owner,UID,Class_Name,Class_Top_Text){
	var Txt;
	this.Setup=function(Owner,ID,Class,Text_Class){
		this.Create("span");
		this.Dad=Owner;
		this.SetAttribute("data-Euterpe_Type","Euterpe_GroupBox");		
		if(Owner!=undefined)
		{
			if(Owner!=null)
			{
				Owner.Element.appendChild(this.Element);
				this.Dad=Owner;
			}
		}		
		this.CheckBorder();
		Txt=new Euterpe_Panel(this,"",Text_Class);
		this.SetText("GroupBox");
		EuterpeCreateEvent(this,Owner);
		if(ID)
			this.SetID(ID);
		if(Class)
			this.ApplyClass(Class);
		if(Text_Class)
			this.ApplyTextClass(Text_Class);
		AdjustTopText();		
		Txt.SetLeft("10px");
	}
	this.ApplyClass=function(Value){
		var Old=this.Element.className;
		this.Element.className=Value;
		AdjustTopText();
		EuterpeChangeClass(this,Old,Value);		
	}
	this.ApplyTextClass=function(Value){
		Txt.ApplyClass(Value);
		AdjustTopText();
	}
	this.SetText=function(Value){
		Txt.SetText(Value);
		AdjustTopText();
	}
	this.SetTextColor=function(Value){
		Txt.SetStyleProperty("background-color",Value);
	}
	this.SetBorder=function(Value){
		this.SetStyleProperty("border",Value);
	}
	AdjustTopText=function(){
		if(Txt){
			Txt.SetWidth((GetElementTextWidth(Txt.TextElement,Txt.GetText())+20)+"px");
			Txt.SetTop((Txt.GetHeight()/-2)+"px");
			Txt.SetStyleProperty("border","0px");
			Txt.SetStyleProperty("box-shadow","0px 0px 0px");
		}
	}
	this.Setup(Euterpe_Owner,UID,Class_Name,Class_Top_Text);
}
Euterpe_GroupBox.prototype=new Euterpe_Panel;
Euterpe_GroupBox.prototype.constructor=Euterpe_GroupBox;
//-----------------------------------------------------------------
function Euterpe_Form(Euterpe_Owner,UID,Class_Name,Class_Top_Text,TargetURL,Method){
	this.Form;
	this.Load=function(Owner,ID,Class,Top_Class,URL,Meth){
		this.Setup(Owner,ID,Class,Top_Class);
		this.SetAttribute("data-Euterpe_Type","Euterpe_Form");
		this.SetText("Form");
		this.Form=document.createElement("form");
		this.Element.appendChild(this.Form);
		if(URL)
			this.SetAction(URL);
		if(Meth)
			this.SetMethod(Meth);
		this.AdditionalInfo=this.Form;
	}
	this.SetAction=function(Value){
		this.Form.action=Value;
	}
	this.GetAction=function(){
		return this.Form.action;
	}	
	this.SetMethod=function(Value){
		this.Form.method=Value;
	}
	this.GetMethod=function(){
		return this.Form.method;
	}		
	this.SetWindowTarget=function(Value){
		this.Form.target=Value;
	}
	this.GetWindowTarget=function(){
		return this.Form.target;
	}		
	this.FormReset=function(){
		this.Form.reset();
	}
	this.FormSubmit=function(){
		this.Form.submit();
	}
	this.Validate=function(){
		var Out=new Array();
		var I,Obj;
		for(var a=0;a<this.Form.elements.length;a++){
			I=this.Form.elements[a].getAttribute("data-Euterpe_UID");	
			if(I){
				Obj=FindEuterpeElement(I);
				if(Obj){
					I=Obj.GetAttribute("data-Euterpe_Validation");
					if(I=="true"){
						I=Obj.GetAttribute("data-Euterpe_Type");
						switch(I){
							case "Euterpe_InputCheckBox":{
								if(Obj.isChecked()==false)
									Out.push(Obj);
							}break;
							case "Euterpe_InputText":
							case "Euterpe_InputPassword":{
								if(Obj.GetValue()=="")
									Out.push(Obj);
							}break;
						}
					}
				}
			}
		}
		if(Out.length>0)
			EuterpeFormInvalidated(this,Out);
		else
			EuterpeFormValidated(this);
		return Out;
	}
	this.Load(Euterpe_Owner,UID,Class_Name,Class_Top_Text,TargetURL,Method);
}
Euterpe_Form.prototype=new Euterpe_GroupBox;
Euterpe_Form.prototype.constructor=Euterpe_Form;
//-----------------------------------------------------------------
function Euterpe_GenericInput(Euterpe_Owner,UID,Class_Name,ObjName){
	this.Load=function(Owner,ID,Class,Name){
		this.Create("input");
		if(Owner!=undefined)
		{
			if(Owner!=null)
			{
				if(Owner instanceof Euterpe_Form)
					Owner.Form.appendChild(this.Element);
				else
					Owner.Element.appendChild(this.Element);
				this.Dad=Owner;
			}
		}		
		this.CheckBorder();
		if(ID)
			this.SetID(ID);
		if(Class)
			this.ApplyClass(Class);
		if(Name)
			this.SetName(Name);
		this.RequireValidation(false);
	}
	this.GetValue=function(){
		return this.Element.value;
	}
	this.SetValue=function(Value){
		this.Element.value=Value;
	}
	this.SetDefault=function(Value){
		this.Element.defaultValue=Value;
	}
	this.SetAutocomplete=function(Value){
		if(Value==true)
			this.SetAttribute("autocomplete","on");
		else
			this.SetAttribute("autocomplete","off");
	}
	this.SetSelectionList=function(Value){
		this.SetAttribute("list",Value);
	}
	this.SetMax=function(Value){
		this.SetAttribute("max",Value);
	}
	this.SetMin=function(Value){
		this.SetAttribute("min",Value);
	}
	this.SetPlaceHolder=function(Value){
		this.SetAttribute("placeholder",Value);
	}
	this.SetAutofocus=function(){
		this.SetAttribute("autofocus"," ");
	}
	this.SetChecked=function(){
		this.SetAttribute("checked"," ");
	}	
	this.SetDisabled=function(){
		this.SetAttribute("disabled"," ");
	}		
	this.SetRequired=function(){
		this.SetAttribute("required"," ");
	}
	this.SetReadOnly=function(){
		this.SetAttribute("readonly"," ");
	}	
	this.SetSize=function(Value){
		this.SetAttribute("size",Value);
	}
	this.SetName=function(Value){
		if(this.Browser=="MSIE")
		{
			var Txt=GetElementouterHTML(this.Element);
			var Out;
			var Idx=Txt.indexOf("name=");
			if(Idx==-1)
				Out=Txt.substring(0,Txt.indexOf(">"))+" name='"+Value+"'>";
			else
			{
				var T=Txt.substring(Idx,Txt.length);
				var Idx2=T.indexOf(" ");
				if(Idx2==-1)
					Idx2=T.indexOf(">");
				Out=Txt.substring(0,Idx)+" name='"+Value+"'"+Txt.substring(Idx2,Txt.length);
			}
			var Tmp=document.createElement(Out);
			this.Element.parentNode.replaceChild(Tmp,this.Element);
			this.Element=Tmp;
		}
		else
			this.SetAttribute("name",Value);
	}
	this.GetName=function(){
		return this.GetAttribute("name");
	}
	this.SetLabel=function(Value){
		//this.Element.labels.push("Ok");
	}
	this.RcvFocus=function(E){
		var Ele;
		if(E.target)
			Ele=E.target;
		else
			Ele=E.srcElement;	
		PlaceHolder=Ele.getAttribute("placeholder");
		Ele.setAttribute("placeholder","");
	}
	this.LostFocus=function(E){
		if(PlaceHolder!=undefined)
		{
			var Ele;
			if(E.target)
				Ele=E.target;
			else
				Ele=E.srcElement;		
			Ele.setAttribute("placeholder",PlaceHolder);
		}
	}	
	this.ChangeType=function(NewType){
		var Tmp=this.Element.cloneNode(true);
		Tmp.type=NewType;
		this.Element.parentNode.replaceChild(Tmp,this.Element);
		this.Element=Tmp;	
	}
	this.SetRequired=function(){
		this.SetAttribute("required","");
	}
	this.RequireValidation=function(Value){
		this.SetAttribute("data-Euterpe_Validation",Value);
	}
	this.Load(Euterpe_Owner,UID,Class_Name,ObjName);
}
Euterpe_GenericInput.prototype=new Euterpe_Obj;
Euterpe_GenericInput.prototype.constructor=Euterpe_GenericInput;
//-----------------------------------------------------------------
function Euterpe_InputText(Euterpe_Owner,UID,Class_Name,ObjName){
	var PlaceHolder;
	var Self;
	this.Build=function(Owner,ID,Class,Name){
		this.Load(Owner,ID,Class,Name);
		this.SetAttribute("data-Euterpe_Type","Euterpe_InputText");
		this.ChangeType("text");
		this.AddEventMgr("focus",this.RcvFocus,false);
		this.AddEventMgr("blur",this.LostFocus,false);
		Self=this;
		this.Element.autofocus=true;
		EuterpeCreateEvent(this,Owner);		
		if(Class)
			this.ApplyClass(Class);	
		if(ID)
			this.SetID(ID);
	}
	this.Disable=function(){
		this.Element.disabled=true;
	}	
	this.Enable=function(){
		this.Element.disabled=false;
	}	
	this.SetForm=function(Value){
		this.Element.form=Value;
	}
	this.SetMaxLength=function(Value){
		this.Element.maxLength=Value;
	}
	this.GetSize=function(){
		return this.Element.size;
	}
	this.SelectText=function(){
		this.Element.select();
	}
	this.isDisabled=function(){
		return this.Element.disabled;
	}
	this.Build(Euterpe_Owner,UID,Class_Name,ObjName);
}
Euterpe_InputText.prototype=new Euterpe_GenericInput;
Euterpe_InputText.prototype.constructor=Euterpe_InputText;
//-----------------------------------------------------------------
function Euterpe_InputSubmit(Euterpe_Owner,UID,Class_Name,ObjName){
	var PlaceHolder;
	var Self;
	this.Build=function(Owner,ID,Class,Name){
		this.Load(Owner,ID,Class,Name);
		this.SetAttribute("data-Euterpe_Type","Euterpe_InputText");
		this.ChangeType("submit");
		this.AddEventMgr("focus",this.RcvFocus,false);
		this.AddEventMgr("blur",this.LostFocus,false);
		Self=this;
		this.Element.autofocus=true;
		EuterpeCreateEvent(this,Owner);
		if(Class)
			this.ApplyClass(Class);				
	}
	this.Disable=function(){
		this.Element.disabled=true;
	}	
	this.Enable=function(){
		this.Element.disabled=false;
	}	
	this.SetForm=function(Value){
		this.Element.form=Value;
	}
	this.SetMaxLength=function(Value){
		this.Element.maxLength=Value;
	}
	this.GetSize=function(){
		return this.Element.size;
	}
	this.SelectText=function(){
		this.Element.select();
	}
	this.isDisabled=function(){
		return this.Element.disabled;
	}
	this.Build(Euterpe_Owner,UID,Class_Name,ObjName);
}
Euterpe_InputSubmit.prototype=new Euterpe_GenericInput;
Euterpe_InputSubmit.prototype.constructor=Euterpe_InputSubmit;
//-----------------------------------------------------------------
function Euterpe_InputPassword(Euterpe_Owner,UID,Class_Name,ObjName){
	var PlaceHolder;
	var Self;
	this.Build=function(Owner,ID,Class,Name){
		this.Load(Owner,ID,Class,Name);
		this.ChangeType("password");
		this.SetAttribute("data-Euterpe_Type","Euterpe_InputPassword");
		this.AddEventMgr("focus",this.RcvFocus,false);
		this.AddEventMgr("blur",this.LostFocus,false);
		Self=this;
		EuterpeCreateEvent(this,Owner);
		if(Class)
			this.ApplyClass(Class);				
	}
	this.Disable=function(){
		this.Element.disabled=true;
	}	
	this.Enable=function(){
		this.Element.disabled=false;
	}	
	this.SetForm=function(Value){
		this.Element.form=Value;
	}
	this.SetMaxLength=function(Value){
		this.Element.maxLength=Value;
	}
	this.GetSize=function(){
		return this.Element.size;
	}
	this.SelectText=function(){
		this.Element.select();
	}
	this.isDisabled=function(){
		return this.Element.disabled;
	}
	this.Build(Euterpe_Owner,UID,Class_Name,ObjName);
}
Euterpe_InputPassword.prototype=new Euterpe_GenericInput;
Euterpe_InputPassword.prototype.constructor=Euterpe_InputPassword;
//-----------------------------------------------------------------
function Euterpe_InputCheckBox(Euterpe_Owner,UID,Class_Name,ObjName){
	this.Build=function(Owner,ID,Class,Name){
		this.Load(Owner,ID,Class,Name);
		this.ChangeType("checkbox");
		this.SetAttribute("data-Euterpe_Type","Euterpe_InputCheckBox");
		Self=this;
		EuterpeCreateEvent(this,Owner);
	}
	this.Disable=function(){
		this.Element.disabled=true;
	}	
	this.Enable=function(){
		this.Element.disabled=false;
	}	
	this.SetForm=function(Value){
		this.Element.form=Value;
	}
	this.isDisabled=function(){
		return this.Element.disabled;
	}
	this.Checked=function(Value){
		this.Element.checked=Value;
	}
	this.isChecked=function(){
		return this.Element.checked;
	}
	this.Build(Euterpe_Owner,UID,Class_Name,ObjName);
}
Euterpe_InputCheckBox.prototype=new Euterpe_GenericInput;
Euterpe_InputCheckBox.prototype.constructor=Euterpe_InputCheckBox;
//-----------------------------------------------------------------
function Euterpe_InputRadio(Euterpe_Owner,UID,Class_Name,ObjName){
	this.Build=function(Owner,ID,Class,Name){
		this.Load(Owner,ID,Class,Name);
		this.ChangeType("radio");
		this.SetAttribute("data-Euterpe_Type","Euterpe_InputRadio");
		Self=this;
		EuterpeCreateEvent(this,Owner);
	}
	this.Disable=function(){
		this.Element.disabled=true;
	}	
	this.Enable=function(){
		this.Element.disabled=false;
	}	
	this.SetForm=function(Value){
		this.Element.form=Value;
	}
	this.isDisabled=function(){
		return this.Element.disabled;
	}
	this.Checked=function(Value){
		this.Element.checked=Value;
	}
	this.isChecked=function(){
		return this.Element.checked;
	}
	this.Build(Euterpe_Owner,UID,Class_Name,ObjName);
}
Euterpe_InputRadio.prototype=new Euterpe_GenericInput;
Euterpe_InputRadio.prototype.constructor=Euterpe_InputRadio;
//-----------------------------------------------------------------
function Euterpe_InputHidden(Euterpe_Owner,UID,ObjName){
	this.Build=function(Owner,ID,Name){
		this.Load(Owner,ID,"",Name);
		this.ChangeType("hidden");
		this.SetAttribute("data-Euterpe_Type","Euterpe_InputHidden");
		Self=this;
	}
	this.SetForm=function(Value){
		this.Element.form=Value;
	}
	this.Build(Euterpe_Owner,UID,ObjName);
}
Euterpe_InputHidden.prototype=new Euterpe_GenericInput;
Euterpe_InputHidden.prototype.constructor=Euterpe_InputHidden;
//-----------------------------------------------------------------
function Euterpe_DropDownList(Euterpe_Owner,ID,Class_Name){
	this.Setup=function(Owner,I,Class){
		this.Create("select");
		this.SetAttribute("data-Euterpe_Type","Euterpe_DropDownList");
		if(Owner!=undefined)
		{
			if(Owner!=null)
			{
				Owner.Element.appendChild(this.Element);
				this.Dad=Owner;
			}
		}		
		this.CheckBorder();
		EuterpeCreateEvent(this,Owner);		
		if(I)
			this.SetID(I);
		if(Class)
			this.ApplyClass(Class);
	}
	this.AddItem = function(Txt,ServerValue){
		var Option = document.createElement("option");
		Option.text=Txt;
		Option.value=ServerValue;
		if(this.Browser!="MSIE")		
			this.Element.add(Option,null);			
		else
			this.Element.options.add(Option);
	}
	this.GetItemIndex=function(){
		return this.Element.selectedIndex;
	}
	this.SetItemIndex=function(Idx){
		this.Element.selectedIndex=Idx;
	}
	this.RemoveItem=function(Index){
		this.Element.remove(Index);
	}
	this.GetNumElement=function(){
		return this.Element.length;
	}
	this.GetItem=function(Index){
		return this.Element.item(Index);
	}
	this.Setup(Euterpe_Owner,ID,Class_Name);
}
Euterpe_DropDownList.prototype=new Euterpe_Obj;
Euterpe_DropDownList.prototype.constructor=Euterpe_DropDownList;
//-----------------------------------------------------------------
function Euterpe_TextArea(Euterpe_Owner,ID,Class_Name){
	var Txt;
	this.Setup=function(Owner,I,Class){
		this.Create("textarea");
		this.SetAttribute("data-Euterpe_Type","Euterpe_TextArea");
		if(Owner!=undefined)
		{
			if(Owner!=null)
			{
				Owner.Element.appendChild(this.Element);
				this.Dad=Owner;
			}
		}		
		this.CheckBorder();
		EuterpeSetElementStyleProperty(this.Element,"resize","none");
		EuterpeCreateEvent(this,Owner);		
		if(I)
			this.SetID(I);
		if(Class)
			this.ApplyClass(Class);
		this.SetStyleProperty("overflow","auto");
	}
	this.SetAutofocus=function(){
		this.SetAttribute("autofocus","");
	}
	this.SetCols=function(Value){
		this.Element.cols=Value;
	}
	this.GetCols=function(){
		return this.Element.cols;
	}
	this.SetDefault=function(Value){
		this.Element.defaultValue=Value;
	}
	this.Disable=function(){
		this.Element.disabled=true;
	}	
	this.Enable=function(){
		this.Element.disabled=false;
	}	
	this.SetForm=function(Value){
		this.Element.form=Value;
	}
	this.isDisabled=function(){
		return this.Element.disabled;
	}
	this.SetPlaceHolder=function(Value){
		this.SetAttribute("placeholder",Value);
	}	
	this.SetMaxLength=function(Value){
		this.Element.maxLength=Value;
	}	
	this.SetName=function(Value){
		this.SetAttribute("name",Value);
	}
	this.SetRows=function(Value){
		this.Element.rows=Value;
	}
	this.GetRows=function(Value){
		return this.Element.rows;
	}
	this.SetWrap=function(Value){
		this.Element.wrap=Value;
	}
	this.SetReadOnly=function(Value){
		this.Element.readonly=Value;
	}
	this.GetReadOnly=function(){
		return this.Element.readonly;
	}
	this.SetText=function(Text){
		this.Element.value=Text;
	}
	this.GetText=function(){
		return this.Element.value;
	}
	this.Clear=function(){
		this.Element.value="";
	}
	this.AddLine=function(Line){
		var Txt=Line;
		if(Line.charAt(Line.length-1)!="\n")
			Txt+="\n";
		this.Element.value +=Txt;
	}
	this.Setup(Euterpe_Owner,ID,Class_Name);
}
Euterpe_TextArea.prototype=new Euterpe_Obj;
Euterpe_TextArea.prototype.constructor=Euterpe_TextArea;
//-----------------------------------------------------------------
function Euterpe_Image(Euterpe_Owner,ID,Class_Name,ImgSrc){
	var Txt;
	this.HasLoaded;
	this.Setup=function(Owner,I,Class,Img){
		this.HasLoaded=false;
		this.Create("img");
		this.SetAttribute("data-Euterpe_Type","Euterpe_Image");
		if(Owner!=undefined)
		{
			if(Owner!=null)
			{
				Owner.Element.appendChild(this.Element);
				this.Dad=Owner;
			}
		}		
		EuterpeCreateEvent(this,Owner);		
		this.AddEventMgr("load",ImageLoad);
		if(I)
			this.SetID(I);
		if(Class)
			this.ApplyClass(Class);
		if(Img)
			this.LoadImg(Img);
	}
	this.LoadImg=function(Value){
		this.Element.src=Value;
		this.SetAttribute("data-Loaded","false");
		this.HasLoaded=false;
	}
	this.SetWidthProportionaly=function(Value){
		this.SetAttribute("data-PropWidth",Value);
		this.Repaint();
	}
	this.SetHeightProportionaly=function(Value){
		this.SetAttribute("data-PropHeight",Value);
		this.Repaint();
	}
	this.Repaint=function(){
		var Value=this.GetAttribute("data-PropHeight");
		if(Value!=null){
			this.SetWidth("");
			this.SetHeight("");				
			var OldW=parseInt(this.GetAttribute("data-OriginalW"));
			var OldH=parseInt(this.GetAttribute("data-OriginalH"));
			this.SetHeight(Value);
			var Val=Math.round(OldW*(this.GetInnerHeight()-this.GetPadding("top")-this.GetPadding("bottom"))/OldH);
			if(!isNaN(Val))
				this.SetWidth(Val+"px");		
			//Euterpe_Log(this.GetUID()+" - AA: "+OldH+"x"+OldW+" -> "+Val+"px");
		}
		Value=this.GetAttribute("data-PropWidth");
		if(Value!=null){
			this.SetWidth("");
			this.SetHeight("");		
			var OldW=parseInt(this.GetAttribute("data-OriginalW"));
			var OldH=parseInt(this.GetAttribute("data-OriginalH"));
			this.SetWidth(Value);
			var Val=Math.round(OldH*(this.GetInnerWidth()-this.GetPadding("left")-this.GetPadding("right"))/OldW);
			if(!isNaN(Val))			
				this.SetHeight(Val+"px");		
		}
	}
	this.SetHRef=function(Value){		
		var Name="UID_"+this.GetUID();
		if(this.Browser=="MSIE")
			var Map=document.createElement("<map name="+Name+"></map>");
		else
		{
			var Map=document.createElement("map");
			Map.setAttribute("name",Name);
		}
		this.SetAttribute("usemap","#"+Name);
		var Area=document.createElement("area");
		Area.setAttribute("shape","rect");
		Area.setAttribute("coords","0,0,"+this.GetWidth()+","+this.GetHeight());
		var Txt=Value;
		if(Txt.indexOf("www")==0)
			Txt="http://"+Txt;		
		Area.setAttribute("href",Txt);
		Map.appendChild(Area);
		document.body.appendChild(Map);	
		if(this.Browser=="MSIE" && this.BrowserVer<7)
		{
			var Txt2=GetElementouterHTML(this.Element);
			var Out;
			var Idx=Txt2.indexOf("href=");
			if(Idx==-1)
				Out=Txt2.substring(0,Txt2.indexOf(">"))+" href='"+Txt+"'>";
			else
			{
				var T=Txt2.substring(Idx,Txt2.length);
				var Idx2=T.indexOf(" ");
				if(Idx2==-1)
					Idx2=T.indexOf(">");
				Out=Txt2.substring(0,Idx)+" href='"+Txt+"'"+Txt2.substring(Idx2,Txt2.length);
			}
			var Tmp=document.createElement(Out);
			this.Element.parentNode.replaceChild(Tmp,this.Element);
			this.Element=Tmp;
		}
		else
			this.SetAttribute("href",Txt);		
	}
	ImageLoad=function(E){
		var Img=GetEuterpeObjFromMsg(E);
		var Tmp=Img.GetAttribute("data-Loaded");
		//if(Tmp!="true")
		if(Img.HasLoaded==false)
		{
			Img.SetAttribute("data-Loaded","true");
			Img.HasLoaded=true;
			var z;
			Img.Element.naturalHeight?z=Img.Element.naturalHeight:z=Img.GetInnerHeight();
			Img.SetAttribute("data-OriginalH",z+"px");
			Img.Element.naturalWidth?z=Img.Element.naturalWidth:z=Img.GetInnerWidth();
			Img.SetAttribute("data-OriginalW",z+"px");
			Img.UsemapResize();
			Img.Repaint();
		}		
	}
	this.UsemapResize=function(){
		var N=this.GetAttribute("usemap");
		if(N){
			N=N.substring(1,N.length);
			var Map=document.getElementsByName(N);
			if(Map)
				Map[0].childNodes.item(0).setAttribute("coords","0,0,"+this.GetInnerWidth()+","+this.GetInnerHeight());
		}
	}
	this.SetOriginalSize=function(){
		var Value=this.GetAttribute("data-OriginalH");
		if(Value)
			this.SetHeight(Value);
		else	
			this.SetHeight("");
		Value=this.GetAttribute("data-OriginalW");
		if(Value)
			this.SetWidth(Value);
		else
			this.SetWidth("");
	}
	this.isLoaded=function(){
		return this.HasLoaded;
	}
	this.Setup(Euterpe_Owner,ID,Class_Name,ImgSrc);
}
Euterpe_Image.prototype=new Euterpe_Obj;
Euterpe_Image.prototype.constructor=Euterpe_Image;
//-----------------------------------------------------------------
function Euterpe_Icon(Euterpe_Owner,ID,Class_Name,IconSrc){
	var Txt;
	var Index;
	var IconW,IconH;
	var ImageW,ImageH;
	this.Load=function(Owner,I,Class,Icon){
		this.Setup(Owner);
		this.SetAttribute("data-Euterpe_Type","Euterpe_Icon");	
		EuterpeCreateEvent(this,Owner);		
		if(I)
			this.SetID(I);
		if(Class)
			this.ApplyClass(Class);
		if(Icon)
			this.SetIconList(Icon);
	}
	this.SetIconList=function(Value){
		this.SetStyleProperty("background-image","url('"+Value+"')");
		this.SetStyleProperty("background-position","-32px 0px");
		var Image=new Euterpe_Image(this,"","");
		Image.Hide();
		Image.AddEventMgr("load",ImgLoad);
		Image.LoadImg(Value);
	}
	ImgLoad=function(E){
		var Img=GetEuterpeObjFromMsg(E);
		Img.Dad.SetAttribute("data-OriginalH",Img.GetInnerHeight()+"px");
		Img.Dad.SetAttribute("data-OriginalW",Img.GetInnerWidth()+"px");
		Img.Dad.Repaint();
		Img.Destroy();
	}
	this.SetIconIndex=function(Idx){
		Index=Idx;
		this.SetAttribute("data-IconIdx",Idx);
		this.Repaint();
	}
	this.SetIconSize=function(Wi,He){
		IconW=PixelTxtToNumber(Wi);
		IconH=PixelTxtToNumber(He);
		this.SetAttribute("data-IconW",IconW+"px");
		this.SetAttribute("data-IconH",IconH+"px");
		this.SetWidth(IconW+"px");
		this.SetHeight(IconH+"px");
		this.Repaint();
	}
	this.Repaint=function(){
		Index=this.GetAttribute("data-IconIdx");
		var Tmp=this.GetAttribute("data-IconW");
		IconW=PixelTxtToNumber(Tmp);
		Tmp=this.GetAttribute("data-IconH");
		IconH=PixelTxtToNumber(Tmp);		
		Tmp=this.GetAttribute("data-OriginalW");
		ImageW=PixelTxtToNumber(Tmp);	
		Tmp=this.GetAttribute("data-OriginalW");
		ImageH=PixelTxtToNumber(Tmp);	
		var IconPerRow=ImageW /IconW;
		var X,Y;
		X=Math.floor(Index%IconPerRow);
		Y=Math.floor(Index/IconPerRow);
		this.SetStyleProperty("background-position",(-X*IconW)+"px "+(-Y*IconH)+"px");		
	}
	this.Load(Euterpe_Owner,ID,Class_Name,IconSrc);
}
Euterpe_Icon.prototype=new Euterpe_Panel;
Euterpe_Icon.prototype.constructor=Euterpe_Icon;
//-----------------------------------------------------------------
function Euterpe_RequestManager(){
	var Manager;
	var DestPage;
	var FuncToExecute=null;
	var ElementToSend;
	var Self;
	this.Setup=function(){
		if(window.XMLHttpRequest)
			Manager=new XMLHttpRequest();
		else
			Manager=new ActiveXObject("Microsoft.XMLHTTP");
		ElementToSend=new Array();
		Self=this;
		Manager.onreadystatechange=function()
		{
			if(FuncToExecute!=null)
			{
				if(Manager!=undefined)
				{
					FuncToExecute(Manager);
				}
			}				
		}		
	}
	this.SetReadyStateFunction=function(Value){
		FuncToExecute=Value;
	}
	this.SetDestinationPage=function(Page){
		DestPage=Page;
	}
	this.AddElementToSend=function(Element_To_Send,Value){
		for(var a=0;a<ElementToSend.length;a+=2)
		{
			if(ElementToSend[a]==Element_To_Send)
			{
				ElementToSend[a + 1]=Value;
				return;
			}
		}
		ElementToSend[ElementToSend.length]=Element_To_Send;
		ElementToSend[ElementToSend.length]=Value;
	}
	this.SetTimeout=function(Value){
		Manager.timeout=Value;
	}
	this.Send=function(Method){
		var Out;
		Out=DestPage+"?";
		for(var a=0;a<ElementToSend.length;a+=2)
		{
			Out+=ElementToSend[a]+"="+ElementToSend[a+1];
			if(a+2 < ElementToSend.length)
				Out+="&";
		}
		Manager.open(Method,Out);
		Manager.send();
	}
	this.Setup();
}
//-----------------------------------------------------------------
function Euterpe_TreeNode(Euterpe_Owner,ID,Class_Name){
	var Btn;
	var Text;
	var NodeLevel;
	this.NodeList;
	this.ParentNode;
	this.TreeOwner;
	this.Load=function(Owner,I,Class){
		this.Setup(Owner,I);
		this.NodeList=new Array();
		if(this.Browser=="MSIE" && this.BrowserVer==6)
		{
			//this.SetStyleProperty("position","relative");
			this.SetStyleProperty("display","inline");
		}		
		this.SetAttribute("data-Euterpe_Type","Euterpe_TreeNode");		
		this.SetAttribute("data-Node_Expanded","false");
		NodeLevel=0;
		Btn=new Euterpe_Align_Panel(this);
		Btn.SetText("+");
		Text=new Euterpe_Align_Panel(this);
		if(Class)
			Text.ApplyClass(Class);
		Btn.SetVAlign("middle");
		Text.SetVAlign("middle");
		//if(Owner.Element.getAttribute("data-Euterpe_Type")=="Euterpe_TreeNode")
		//	Level=Owner.GetNodeLevel()+1;		
		if(Owner.GetNodeLevel){
			NodeLevel=Owner.GetNodeLevel()+1;
			this.TreeOwner=Owner.TreeOwner;
		}
		else
			this.TreeOwner=Owner;
		Text.SetCursor("pointer");
		Btn.SetCursor("pointer");	
		Btn.AddEventMgr("click",BtnClick);
	}
	this.DrawNode=function(){
		var H=GetElementTextHeight(Text.TextElement,Text.GetText());
		var W=GetElementTextWidth(Text.TextElement,Text.GetText());
		var WBtn=GetElementTextWidth(Btn.TextElement,Btn.GetText());
		var HBtn=GetElementTextHeight(Btn.TextElement,Btn.GetText());
		Btn.Place(WBtn+"px",HBtn+"px",(this.GetNodeLevel()*WBtn)+"px","0px");
		Text.Place(W+"px",H+"px",Btn.GetRight()+"px","0px");
		if(this.HasSubNode()){
			if(this.isExpanded()){
				//Btn.SetText("-");
				var H=Math.max(GetElementTextHeight(Text.TextElement,Text.GetText()),
								GetElementTextHeight(Btn.TextElement,Btn.GetText()));
				for(var a=0;a<this.NodeList.length;a++){
					this.NodeList[a].Show();
					this.NodeList[a].DrawNode();
					this.NodeList[a].SetTop(H+"px");
					H+=this.NodeList[a].GetHeight();
				}
			}
			else{
				//Btn.SetText("+");
				for(var a=0;a<this.NodeList.length;a++)
					this.NodeList[a].Hide();
			}
			Btn.Show();
		}
		else
			Btn.Hide();
	}
	BtnClick=function(Msg){
		E=GetEuterpeObjFromMsg(Msg);
		//Euterpe_Log("Sender: "+E.Dad.NodeList.length);
		if(E.Dad.isExpanded){
			if(E.Dad.isExpanded())
				E.Dad.Collapse();
			else
				E.Dad.Expand();
		}
	}
	this.GetHeight=function(){
		if(this.HasSubNode()){
			var H=Math.max(GetElementTextHeight(Text.TextElement,Text.GetText()),
								GetElementTextHeight(Btn.TextElement,Btn.GetText()));
			if(this.isExpanded()){
				for(var a=0;a<this.NodeList.length;a++)
					H+=this.NodeList[a].GetHeight();
			}
			return H;
		}
		else
			return Math.max(GetElementTextHeight(Text.TextElement,Text.GetText()),
								GetElementTextHeight(Btn.TextElement,Btn.GetText()));
	}
	this.HasSubNode=function(){
		if(this.NodeList.length>0)
			return true;
		return false;
	}
	this.GetButton=function(){
		return Btn;
	}
	this.GetNodeLevel=function(){
		return NodeLevel;
	}
	this.SetText=function(Txt){
		Text.SetText(Txt);
		Text.MakeUnselectable();
		Btn.MakeUnselectable();		
	}
	this.Expand=function(){
		this.SetAttribute("data-Node_Expanded","true");
		Btn.SetText("-");
		this.TreeOwner.ArrangeNode();
	}
	this.Collapse=function(){
		this.SetAttribute("data-Node_Expanded","false");
		Btn.SetText("+");
		this.TreeOwner.ArrangeNode();
	}
	this.isExpanded=function(){
		var a=this.GetAttribute("data-Node_Expanded");
		if(a=="true")
			return true;
		return false;
	}
	this.AddChild=function(N){
		this.NodeList.push(N);
	}
	this.GetText=function(){
		return Text.GetText();
	}
	this.Load(Euterpe_Owner,ID,Class_Name);
}
Euterpe_TreeNode.prototype=new Euterpe_Panel;
Euterpe_TreeNode.prototype.constructor=Euterpe_TreeNode;
//-----------------------------------------------------------------
function Euterpe_Tree(Euterpe_Owner,ID,Class_Name){
	var BtnSize;
	var NodeList;	
	var Self;
	this.Load=function(Owner,I,Class){
		this.Setup(Owner);
		NodeList=new Array();
		this.SetAttribute("data-Euterpe_Type","Euterpe_Tree");
		this.SetStyleProperty("overflow","auto");
		Self=this;
		EuterpeCreateEvent(this,Owner);
		this.AddCustomEventMgr("Euterpe_Show",ShowMe);
		if(I)
			this.SetID(I);
		if(Class)
			this.ApplyClass(Class);
	}
	this.AddNode=function(ParentNode,Txt){
		var Node;
		if(ParentNode==null || ParentNode==undefined)
			Node=new Euterpe_TreeNode(this);
		else
		{
			Node=new Euterpe_TreeNode(ParentNode);
			Node.ParentNode=ParentNode;
			ParentNode.AddChild(Node);
		}
		if(Txt!=null && Txt!=undefined)
			Node.SetText(Txt);
		else
			Node.SetText("Node_"+NodeList.length);
		NodeList.push(Node);
		if(Node.GetNodeLevel()!=0)
			Node.Hide();		
		this.ArrangeNode();
		Node.AddCustomEventMgr("Euterpe_TreeNode_Exp",Node_Expand);
		Node.AddCustomEventMgr("Euterpe_TreeNode_Col",Node_Collapse);
		return Node;
	}
	Node_Expand=function(Msg){
		var Node=GetEuterpeObjFromMsg(Msg);
		//Self.ArrangeNode();
		Node.Dad.ArrangeNode();
	}
	Node_Collapse=function(Msg){
		var Node=GetEuterpeObjFromMsg(Msg);
		//Self.ArrangeNode();	
		Node.Dad.ArrangeNode();
	}
	this.ArrangeNode=function(){
		var W,H;
		W=0;
		H=0;
		for(var a=0;a<NodeList.length;a++)
		{
			if(NodeList[a].GetNodeLevel()==0)
			{
				//NodeList[a].Hide();
				NodeList[a].SetTop((W)+"px");
				NodeList[a].DrawNode();
				W += NodeList[a].GetHeight();
				//Euterpe_Log("W: "+W+" - "+NodeList[a].GetText());
				if(NodeList[a].GetWidth() > H)
					H=NodeList[a].GetWidth();
			}
		}
	}
	ShowMe=function(E){
		E.ObjShowed.ArrangeNode();
	}
	this.Load(Euterpe_Owner,ID,Class_Name)
}
Euterpe_Tree.prototype=new Euterpe_Panel;
Euterpe_Tree.prototype.constructor=Euterpe_Tree;
//-----------------------------------------------------------------
/*function Euterpe_Spinner(Euterpe_Owner){
	var Input;
	var Btn1,Btn2;
	var ButtonWidth="20px";
	var Max=10;
	var Min=0;
	this.Load=function(Owner){
		this.Setup(Owner);
		this.SetAttribute("data-Euterpe_Type","Euterpe_Spinner");
		Input=new Euterpe_InputText(this);
		Btn1=new Euterpe_Button(this);
		Btn1.SetText("\u25b2");
		Btn1.SetClickFunction(UpClickValue);
		Btn2=new Euterpe_Button(this);
		Btn2.SetText("\u25bC");
		Btn2.SetClickFunction(DownClickValue);
		EuterpeCreateEvent(this,Owner);
		Input.SetValue(0);
		this.AddCustomEventMgr("Euterpe_Resize",RedrawEvent);
		this.DrawSpinner();
	}
	RedrawEvent=function(E){
		var Obj=GetEuterpeObjFromMsg(E);
		Obj.DrawSpinner();
		//Euterpe_Log(E.GetType());
	}
	this.DrawSpinner=function(){
		Input.Place((this.GetInnerWidth()-Btn1.GetWidth())+"px",(this.GetInnerHeight())+"px","0px","0px");
		Btn1.Place(ButtonWidth,(this.GetInnerHeight()/2)+"px",(Input.GetWidth())+"px","0px");
		Btn2.Place(ButtonWidth,(this.GetInnerHeight()/2)+"px",(Input.GetWidth())+"px",Btn1.GetBottom()+"px");
	}
	this.GetValue=function(){
		return Input.GetValue();
	}
	this.SetValue=function(Value){
		Input.SetValue(Value);
	}
	this.SetMaxValue=function(Value){
		if(!isNaN(Value))
			Max=Value;
		if(Value==null||Value==undefined)
			Max=undefined;
	}
	this.GetMaxValue=function(){
		return Max;
	}
	this.SetMinValue=function(Value){
		if(!isNaN(Value))
			Min=Value;
		if(Value==null||Value==undefined)
			Min=undefined;
	}
	this.GetMinValue=function(){
		return Min;
	}	
	UpClickValue=function(E){
		var Obj=GetEuterpeObjFromMsg(E);
		var Dad=Obj.Dad;
		var Value=Dad.GetValue();
		var M,m;
		M=Dad.GetMaxValue();
		m=Dad.GetMinValue();
		if(isNaN(Value))
			Dad.SetValue(0);
		else
		{
			var N=Number(Value)+1;
			if(M!=undefined)
			{
				if(N>M)
					N=Min;
			}
			Dad.SetValue(N);
		}
	}
	DownClickValue=function(E){
		var Obj=GetEuterpeObjFromMsg(E);
		var Dad=Obj.Dad;
		var Value=Dad.GetValue();
		var M,m;
		M=Dad.GetMaxValue();
		m=Dad.GetMinValue();
		if(isNaN(Value))
			Dad.SetValue(0);
		else
		{
			var N=Number(Value)-1;
			if(m!=undefined)
			{
				if(N<m)
					N=M;
			}
			Dad.SetValue(N);
		}
	}	
	this.Load(Euterpe_Owner)
}
Euterpe_Spinner.prototype=new Euterpe_Panel;
Euterpe_Spinner.prototype.constructor=Euterpe_Spinner;*/
//-----------------------------------------------------------------

//-----------------------------------------------------------------

//-----------------------------------------------------------------