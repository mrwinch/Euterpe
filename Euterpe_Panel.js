//Required Euterpe_Core.js
//Required Euterpe_Core_Event.js
//-----------------------------------------------------------------
if(Euterpe_Panel_Obj==undefined){
	var Euterpe_Panel_Obj=1;
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
	Euterpe_Panel.prototype=new Euterpe_Core_Obj;
	Euterpe_Panel.prototype.constructor=Euterpe_Panel;
}
//-----------------------------------------------------------------
if(Euterpe_Align_Panel_Obj==undefined){
	var Euterpe_Align_Panel_Obj=1;
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
}
//-----------------------------------------------------------------
