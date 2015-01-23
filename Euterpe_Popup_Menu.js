//Require:
//+	Euterpe_Core_Event.js
//+	Euterpe_Core.js
/*-----------------------------------------------------------------
	This script is a simple implementation of a popup menu with Euterpe:
	a popup menu is composed by items and each item can contains sub menu.
	The use popup menu, first of all you have to create a popup menu and 
	the add items to menu: if you want to add a sub popup to an item, you have
	to use AddPopup function
-----------------------------------------------------------------*/
/********************************************************
*	KeyUp
*	Description: manage keyboard key press event
*	@param Msg: event message
*	Note: hide all popups if press button ESC (keycode=27)
********************************************************/
function KeyUp(Msg){
	if(Msg.keyCode==27){	//Esc...
		HidePop();
	}
}
/********************************************************
*	ClickHide
*	Description: function that hide popup if user click mouse button
*	Note: a time of 500ms is used to understand if popup has been
*		showed for at least 500ms 
********************************************************/
function ClickHide(){
	var D=new Date();
	for(var a=0;a<EuterpeObjectArray.length;a++){
		if(EuterpeObjectArray[a].GetType){
			if(EuterpeObjectArray[a].GetType()=="Euterpe_Popup_Menu"){
				if(D.getTime()-EuterpeObjectArray[a].LastShowTime > 500)	//Popup showed for more than 500ms...
					EuterpeObjectArray[a].HidePopup();
			}
		}
	}	
}
/********************************************************
*	HidePop
*	Description: this function hides all popup
*	Note:
********************************************************/
function HidePop(){
	for(var a=0;a<EuterpeObjectArray.length;a++){
		if(EuterpeObjectArray[a].GetType){
			if(EuterpeObjectArray[a].GetType()=="Euterpe_Popup_Menu")
				EuterpeObjectArray[a].HidePopup();
		}
	}		
}
/********************************************************
*	NotifyChangeElement
*	Description: additional function to manage mouse movement
*				events
*	@param Msg: mouse move events message
*	Note: this function is used to handle 
*		- hide/show of popup
********************************************************/
function NotifyChangeElement(Msg){
	var P=GetEuterpePage();
	if(LastElementUnderMouse!=P.ObjUnderMouse){
		LastElementUnderMouse=P.ObjUnderMouse;
		if(LastElementUnderMouse){
			if(LastElementUnderMouse.GetUID){
				if(LastElementUnderMouse.GetType()=="Euterpe_Popup_Item"){
					if(ShowPopupHandle)
						window.clearTimeout(ShowPopupHandle);
					HideSubPopup(LastElementUnderMouse);
					if(LastElementUnderMouse.HasPopup()){
						ShowPopupHandle=window.setTimeout(SubPopupShow,500,LastElementUnderMouse.GetUID());
					}
				}
				return;
			}
		}
	}
}
/********************************************************
*	SubPopupShow
*	Description: function executed if mouse stay over a popup item
*			for more than 500ms
*	@param UID: unique ID of the item
*	Note:
********************************************************/
function SubPopupShow(UID){
	var I=FindEuterpeObject(UID);
	I.ShowPopup();
}
/********************************************************
*	HideSubPopup
*	Description: this function hide all popup not descendant of
*			item sender
*	@param Sender: the popup that manage sub popup
*	Note:
********************************************************/
function HideSubPopup(Sender){
	for(var a=0;a<EuterpeObjectArray.length;a++){
		if(EuterpeObjectArray[a].GetType){
			if(EuterpeObjectArray[a].GetType()=="Euterpe_Popup_Menu"){
				if(EuterpeObjectArray[a].isDescendant(Sender)==false){
					EuterpeObjectArray[a].HidePopup();
				}
			}
		}
	}
}
//-----------------------------------------------------------------
if(Euterpe_Popup_Menu_Obj==undefined){
	var Euterpe_Popup_Menu_Obj=1;
	var ArrowMinSpace=10;
	var EventMgrDefined=0;
	var LastElementUnderMouse;
	var ShowPopupHandle;
	/********************************************************
	*	Euterpe_Popup_Item
	*	Description: object created to manage popup items
	*	@param Euterpe_Owner: owner of the item (usually a PopupMenu)
	*	@param ID: HTML id of tag connected (optional)
	*	@param Class_Name: class to apply (optional)
	*	Note:
	********************************************************/
	function Euterpe_Popup_Item(Euterpe_Owner,ID,Class_Name){
		this.PopupOwner;
		this.DrawingAllowed=true;
		this.Arrow;
		/********************************************************
		*	Setup
		*	Description: setup function for item
		*	@param Owner: objects owner of the item
		*	@param UID: id to apply to element connected
		*	@param Class: class to apply (if any)
		*	Note: internal usage. DO NOT EXECUTE!!!
		********************************************************/		
		this.Setup=function(Owner,UID,Class){
			this.BaseCreation("div",Owner,"Euterpe_Popup_Item");
			this.SetText("Popup item");
			if(this.Dad){
				var Type=this.Dad.Element.getAttribute("data-Euterpe_Type");
				if(Type=="Euterpe_Popup_Menu")
					this.PopupOwner=this.Dad;
			}
			this.SecondStageCreation(UID,Class);
			this.Arrow=new Euterpe_Align_Panel(this,"","");
			this.Arrow.SetVAlign("middle");
			this.Arrow.SetText("\u25b6");
		}
		/********************************************************
		*	DrawItem
		*	Description: function to redraw item 
		*	Note: 
		********************************************************/			
		this.DrawItem=function(){
			this.SetStyleProperty("cursor","default");
			if(this.TextElement && this.DrawingAllowed){
				this.DrawingAllowed=false;
				EuterpeSetElementStyleProperty(this.TextElement,"cursor","default");
				EuterpeSetElementStyleProperty(this.TextElement,"white-space","nowrap");
				var Area=EvaluateTextSize(this.Element,this.GetText());
				//Euterpe_Log("Item: "+this.GetText()+" - "+Area.w+":"+this.GetItemWidth());
				this.SetHeight(Area.h+"px");				
				EuterpeSetElementStyleProperty(this.TextElement,"width",Area.w+"px");
				EuterpeSetElementStyleProperty(this.TextElement,"height",Area.h+"px");
				if(this.HasPopup()){
					Area.w+=ArrowMinSpace+this.Arrow.GetWidth();
					this.Arrow.SetTop(((this.GetHeight()-this.Arrow.GetHeight())/2)+"px");
					this.Arrow.Show();
				}
				else
					this.Arrow.Hide();
				this.DrawingAllowed=true;
			}			
		}
		/********************************************************
		*	GetItemWidth
		*	Description: return width of the item
		*	@returns: width in pixels
		*	Note: used by popup menu to evaluate width of menu
		********************************************************/		
		this.GetItemWidth=function(){
			var Area=EvaluateTextSize(this.Element,this.GetText());
			if(this.Arrow.Showed())
				Area.w+=ArrowMinSpace+this.Arrow.GetWidth();
			return Area.w;
		}
		/********************************************************
		*	AddPopup
		*	Description: used to generate a sub popup menu 
		*	@param Popup_ID: id of the new popup
		*	@param Popup_Class: class of the new popup
		*	@returns {Euterpe_Popup_Menu}: return the popup menu
		*	Note:
		********************************************************/		
		this.AddPopup=function(Popup_ID,Popup_Class){
			var Out=new Euterpe_Popup_Menu(this,Popup_ID,Popup_Class);
			this.SetAttribute("data-Popup_ID",Out.GetUID());
			return Out;
		}
		/********************************************************
		*	HasPopup
		*	Description: check if item has a popup connected
		*	@returns {Boolean}: true if the item has a popup
		*	Note:
		********************************************************/		
		this.HasPopup=function(){
			var a=this.GetAttribute("data-Popup_ID");
			if(a)
				return true;
			return false;
		}
		/********************************************************
		*	ShowPopup
		*	Description: if the item manage a popup, this is showed
		*	Note:
		********************************************************/		
		this.ShowPopup=	function(){
			if(this.HasPopup()){
				var a=this.GetAttribute("data-Popup_ID");
				var b=FindEuterpeObject(a);
				if(b){
					b.Place("","",this.GetRight()+"px","5px");
					b.ShowPopup();
				}
			}
		}
		/********************************************************
		*	GetPopupOwner
		*	Description: retrieve the popup menu that holds the item
		*	@returns: menu owner of the item
		*	Note:
		********************************************************/		
		this.GetPopupOwner=	function(){
			if(this.Dad){
				if(this.Dad.GetType){
					if(this.Dad.GetType()=="Euterpe_Popup_Menu")
						return this.Dad;
				}
			}
			return undefined;
		}
		this.Setup(Euterpe_Owner,ID,Class_Name);
	}
	Euterpe_Popup_Item.prototype=new Euterpe_Panel;
	Euterpe_Popup_Item.prototype.constructor=Euterpe_Popup_Item;
//-----------------------------------------------------------------	
	/********************************************************
	*	Euterpe_Popup_Menu
	*	Description: a popup menu implementation
	*	@param Euterpe_Owner: Euterpe object owner of the menu
	*	@param ID: HTML id of tag connected (optional)
	*	@param Class_Name: class to apply (optional)
	*	Note:
	********************************************************/
	function Euterpe_Popup_Menu(Euterpe_Owner,ID,Class_Name){
		this.ItemArray=new Array();
		/********************************************************
		*	Setup
		*	Description: setup function for the menu
		*	@param Owner: objects owner of the menu
		*	@param UID: id to apply to element connected
		*	@param Class: class to apply (if any)
		*	Note: internal usage. DO NOT EXECUTE!!!
		********************************************************/		
		this.Setup=function(Owner,UID,Class){
			this.BaseCreation("div",Owner,"Euterpe_Popup_Menu");
			this.SecondStageCreation(UID,Class);
			this.Hide();
			if(EventMgrDefined==0){
				EventMgrDefined=1;
				if(document.addEventListener){
					document.addEventListener("keyup",KeyUp);
					document.addEventListener("mousemove",NotifyChangeElement);
					document.addEventListener("mouseup",ClickHide);
				}
				else{
					if(document.attachEvent){
						document.attachEvent("onkeyup",KeyUp);
						document.attachEvent("onmousemove",NotifyChangeElement);
						document.attachEvent("onmouseup",ClickHide);
					}
				}
			}
		}
		/********************************************************
		*	AddItem
		*	Description: add an item to menu
		*	@param Txt: text showed in the item
		*	@param ID: HTML id of tag connected (optional)
		*	@param Class: class to apply (optional)
		*	@returns {Euterpe_Popup_Item}: item created
		*	Note:
		********************************************************/		
		this.AddItem=function(Txt,ID,Class){
			var Item=new Euterpe_Popup_Item(this,ID,Class);
			if(Txt)
				Item.SetText(Txt);
			else
				Item.SetText("Menu "+this.ItemArray.length);
			this.ItemArray.push(Item);
			Item.Hide();
			return Item;			
		}
		/********************************************************
		*	DrawPopup
		*	Description: function to redraw menu 
		*	Note: this function redraw menu following parameter
		*		so may be necessary after resizing or changing class
		********************************************************/		
		this.DrawPopup=function(){
			//Euterpe_Log("DrawPopup");
			if(this.Showed()){
				var MaxW=0;
				var H=0;
				var b;
				for(var a=0;a<this.ItemArray.length;a++){
					this.ItemArray[a].Show();
					this.ItemArray[a].DrawItem();
					this.ItemArray[a].SetTop(H+"px");
					this.ItemArray[a].SetLeft("0px");
					H+=this.ItemArray[a].GetHeight();
					b=this.ItemArray[a].GetItemWidth();
					if(MaxW<b)
						MaxW=b;
				}
				for(var a=0;a<this.ItemArray.length;a++){
					this.ItemArray[a].SetWidth(MaxW+"px");
					if(this.ItemArray[a].HasPopup()){
						this.ItemArray[a].Arrow.SetLeft((MaxW-this.ItemArray[a].Arrow.GetWidth())+"px");
						this.ItemArray[a].Arrow.Redraw();
					}
				}
				this.SetWidth(MaxW+"px");
				this.SetHeight(H+"px");
			}
		}
		/********************************************************
		*	ShowPopup
		*	Description: show popup
		*	Note:
		********************************************************/		
		this.ShowPopup=function(){
			this.Show();
			this.DrawPopup();
		}
		/********************************************************
		*	HidePopup
		*	Description: hide popup
		*	Note:
		********************************************************/		
		this.HidePopup=function(){
			this.Hide();
			for(var a=0;a<this.ItemArray.length;a++){
				this.ItemArray[a].Hide();
			}
		}
		/********************************************************
		*	isDescendant
		*	Description: check if popup is descendant (sub popup) of
		*			another popup menu item
		*	@param Item: item to check if is anchestor
		*	@returns {Boolean}: true if popup is descendant of the item
		*			otherwise false
		*	Note:
		********************************************************/		
		this.isDescendant=function(Item){
			if(Item){
				var O=Item.Dad;
				var UID=this.GetUID();
				var I_UID=Item.GetUID();
				while(O){
					if(O.GetUID){
						if(O.GetUID()==UID)
							return true;
						else
							O=O.Dad;
					}
					else
						O=undefined;
				}
			}
			return false;
		}
		this.Setup(Euterpe_Owner,ID,Class_Name);
	}
	Euterpe_Popup_Menu.prototype=new Euterpe_Panel;
	Euterpe_Popup_Menu.prototype.constructor=Euterpe_Popup_Menu;	
}
//-----------------------------------------------------------------
