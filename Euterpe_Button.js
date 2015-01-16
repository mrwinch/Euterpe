//Require:
//+	Euterpe_Core_Event.js
//+	Euterpe_Core.js
//-----------------------------------------------------------------
if(Euterpe_Button_Obj==undefined){
	var Euterpe_Button_Obj=1;
	/********************************************************
	*	Euterpe_Button
	*	Description: a simple button implementation 
	*	@param Euterpe_Owner: Euterpe object owner of the button
	*	@param ID: HTML id of tag connected (optional)
	*	@param Class_Name: class to apply (optional)
	*	Note: this is a simple implementation of a button. Text is
	*		renderer centered at middle of the button: if text size 
	*		exceed button size, text will be ellipsed. Maybe a padding
	*		could be nice...
	********************************************************/
	function Euterpe_Button(Euterpe_Owner,ID,Class_Name){
		/********************************************************
		*	Setup
		*	Description: setup function for button
		*	@param Owner: objects owner of the button
		*	@param UID: id to apply to element connected
		*	@param Class: class to apply (if any)
		*	Note: internal usage. DO NOT EXECUTE!!!
		********************************************************/
		this.Setup=function(Owner,UID,Class){
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
			this.AddCustomEventMgr("Euterpe_Chg_Class",Euterpe_Align_Panel_Manager);
			this.AddCustomEventMgr("Euterpe_Resize",Euterpe_Align_Panel_Manager);
		}
		/********************************************************
		*	Redraw
		*	Description: function to redraw button 
		*	Note: this function redraw the button following parameter
		*		so may be necessary after resizing or changing class
		********************************************************/		
		this.Redraw=function(){
			if(this.TextElement){
				var Area=EvaluateTextSize(this.Element,this.GetText());
				var W=this.Element.offsetWidth;
				var H=this.Element.offsetHeight;
				if(W>Area.w && H>Area.h){
					EuterpeSetElementStyleProperty(this.TextElement,"text-align","center");
					EuterpeSetElementStyleProperty(this.TextElement,"width",Area.w+"px");
					EuterpeSetElementStyleProperty(this.TextElement,"height",Area.h+"px");					
					EuterpeSetElementStyleProperty(this.TextElement,"left",((W-Area.w)/2)+"px");
				}
				else{
					EuterpeSetElementStyleProperty(this.TextElement,"width",W+"px");
					EuterpeSetElementStyleProperty(this.TextElement,"height",H+"px");
					EuterpeSetElementStyleProperty(this.TextElement,"overflow","hidden");
					EuterpeSetElementStyleProperty(this.TextElement,"text-overflow","ellipsis");
					EuterpeSetElementStyleProperty(this.TextElement,"white-space","nowrap");						
					EuterpeSetElementStyleProperty(this.TextElement,"left","0px");				
				}
				EuterpeSetElementStyleProperty(this.TextElement,"top",((H-Area.h)/2)+"px");				
			}
		}
		/********************************************************
		*	SetText
		*	Description: function to set text showed in object
		*	@param Text: text to show
		*	Note:
		********************************************************/		
		this.SetText=function(Text){
			if(this.GetWidth()==0){
				var TextArea=EvaluateTextSize(this.Element,this.GetText());
				this.SetWidth(TextArea.w+"px");				
			}
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
		this.SetCursor=function(Type){
			if(this.TextElement!=undefined && this.TextElement!=null)
				EuterpeSetElementStyleProperty(this.TextElement,"cursor",Type);
			this.SetStyleProperty("cursor",Type);
		}	
		/********************************************************
		*	SetClickFunction
		*	Description: fast function to add an event manager for click events
		*	@param Function: function to execute when mouse is pressed over button
		*	Note:
		********************************************************/		
		this.SetClickFunction=function(Function){
			this.AddEventMgr("click",Function);	
		}	
		this.Setup(Euterpe_Owner,ID,Class_Name);
	}
	Euterpe_Button.prototype=new Euterpe_Panel;
	Euterpe_Button.prototype.constructor=Euterpe_Button;
}
//-----------------------------------------------------------------
