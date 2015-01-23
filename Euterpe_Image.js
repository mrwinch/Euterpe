//Require:
//+	Euterpe_Core_Event.js
//+	Euterpe_Core.js
//+ Euterpe_Map.js
//-----------------------------------------------------------------
/********************************************************
*	ImageLoadEvent
*	Description: function executed when an image is loaded
*	@param E: message created from "load" event
*	Note:
********************************************************/
ImageLoadEvent=function(E){
	var Img=GetEuterpeObjFromMsg(E);
	var Tmp=Img.GetAttribute("data-Loaded");
	if(Tmp=="false")
	{
		Img.SetAttribute("data-Loaded","true");
		var z;
		Img.Element.naturalHeight?z=Img.Element.naturalHeight:z=Img.GetInnerHeight();
		Img.SetAttribute("data-OriginalH",z+"px");
		Img.Element.naturalWidth?z=Img.Element.naturalWidth:z=Img.GetInnerWidth();
		Img.SetAttribute("data-OriginalW",z+"px");	
		Img.UsemapResize();
		Img.Redraw();		
	}		
}	
/********************************************************
*	ImageResizeEvent
*	Description: function executed at "Euterpe_Resize_Event"
*	@param Msg: message passed to function
*	Note:
********************************************************/
ImageResizeEvent=function(Msg){
	var Img=GetEuterpeObjFromMsg(Msg);
	if(Img){
		if(Img.DrawingAllowed==true){
			Img.SetAttribute("data-PropSize","none");
			Img.Redraw();
		}
	}
}
/********************************************************
*	IconListLoadEvent
*	Description: executed when the image of an icon list is loaded
*	@param Msg: message created from "load" event
*	Note:
********************************************************/
IconListLoadEvent=function(Msg){
	var Img=GetEuterpeObjFromMsg(Msg);
	if(Img){
		Img.Dad.Redraw();
	}
}
//-----------------------------------------------------------------
if(Euterpe_Image_Obj==undefined){
	var Euterpe_Image_Obj=1;
	function Euterpe_Image(Euterpe_Owner,ID,Class_Name,ImgSrc){
		this.DrawingAllowed;
		this.MapObject;
		/********************************************************
		*	Setup
		*	Description: setup function for image object
		*	@param Owner: objects owner of the image
		*	@param UID: id to apply to element connected
		*	@param Class: class to apply (if any)
		*	@param Img: URL of the image to load
		*	Note: internal usage. DO NOT EXECUTE!!!
		********************************************************/		
		this.Setup=function(Owner,I,Class,Img){
			this.BaseCreation("img",Owner,"Euterpe_Image");
			this.AddEventMgr("load",ImageLoadEvent);
			this.AddCustomEventMgr("Euterpe_Resize",ImageResizeEvent);
			this.DrawingAllowed=true;
			this.SecondStageCreation(I,Class);
			if(Img)
				this.LoadImg(Img);
		}
		/********************************************************
		*	LoadImg
		*	Description: used to load an image
		*	@param Value: URL of the image
		*	Note:
		********************************************************/		
		this.LoadImg=function(Value){
			this.SetAttribute("data-Loaded","false");			
			this.Element.src=Value;
		}		
		/********************************************************
		*	SetWidthProportionaly
		*	Description: this function modify width of the image 
		*			proportionally to the height set by user
		*	@param FixHeight: the height value to maintain fix
		*	Note: suppose to have an image with size 100x50 px and
		*		you want resize the image setting height to 30px.
		*		Calling this function the image will have height of 30px
		*		and the width will be calculated runtime (100/50*30 = 60px)
		********************************************************/		
		this.SetWidthProportionaly=	function(FixHeight){
			this.SetAttribute("data-PropValue",FixHeight);
			this.SetAttribute("data-PropSize","width");
			this.Redraw();
		}
		/********************************************************
		*	SetHeightProportionaly
		*	Description: this function modify height of the image 
		*			proportionally to the width set by user
		*	@param FixWidth: the width value to maintain fix
		*	Note: suppose to have an image with size 100x50 px and
		*		you want resize the image setting width to 40px.
		*		Calling this function the image will have width of 40px
		*		and the height will be calculated runtime (50/100*40 = 20px)
		********************************************************/		
		this.SetHeightProportionaly=function(FixWidth){
			this.SetAttribute("data-PropValue",FixWidth);
			this.SetAttribute("data-PropSize","height");
			this.Redraw();
		}	
		/********************************************************
		*	Redraw
		*	Description: function to redraw image 
		*	Note: this function redraw the image following parameter
		*		so may be necessary after resizing or changing class
		********************************************************/		
		this.Redraw=function(){
			if(this.DrawingAllowed){
				this.DrawingAllowed=false;
				var a=this.GetAttribute("data-PropSize");
				var OldW=parseInt(this.GetAttribute("data-OriginalW"));
				var OldH=parseInt(this.GetAttribute("data-OriginalH"));				
				if(a){
					var b=this.GetAttribute("data-PropValue");
					var c;
					if(a=="height"){
						this.SetWidth(b);
						c=Math.round(OldH*(this.GetInnerWidth()/OldW));
						if(!isNaN(c))
							this.SetHeight(c+"px");
					}
					else{
						if(a=="width"){
							this.SetHeight(b);
							c=Math.round(OldW*(this.GetInnerHeight()/OldH));
							if(!isNaN(c))
								this.SetWidth(c+"px");							
						}
					}
				}
				this.DrawingAllowed=true;
			}
		}
		/********************************************************
		*	UsemapResize
		*	Description: function used to resize map if image has
		*				an href (link)
		*	Note:
		********************************************************/		
		this.UsemapResize=function(){
			if(this.MapObject){
				var a=this.MapObject.GetMapByID("Area_0");
				a.SetCoords("0,0,"+this.GetInnerWidth()+","+this.GetInnerHeight());
			}	
		}
		/********************************************************
		*	SetOriginalSize
		*	Description: resize the image to original value
		*	Note:
		********************************************************/		
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
		/********************************************************
		*	SetHRef
		*	Description: use to set a link to image
		*	@param Value: the URL used
		*	Note: using this function, when user click the image,
		*		the page will change to Value URL
		********************************************************/		
		this.SetHRef=function(Value){
			var a;
			if(this.MapObject==undefined){
				this.MapObject=new Euterpe_Map("Map_UID_"+this.GetUID());
				a=this.MapObject.AddArea();
				a.SetID("Area_0");
				a.SetShape("rect");
				this.SetAttribute("usemap","#Map_UID_"+this.GetUID());
			}
			var Txt=Value;
			if(Txt.indexOf("www")==0)
				Txt="http://"+Txt;					
			a=this.MapObject.GetMapByID("Area_0");
			a.SetHRef(Txt);
			this.UsemapResize();	
		}		
		this.Setup(Euterpe_Owner,ID,Class_Name,ImgSrc);
	}
	Euterpe_Image.prototype=new Euterpe_Panel;
	Euterpe_Image.prototype.constructor=Euterpe_Image;	
}
//-----------------------------------------------------------------
if(Euterpe_Icon_List_Obj==undefined){
	var Euterpe_Icon_List_Obj=1;
	/********************************************************
	*	Euterpe_Icon_List
	*	Description: a simple object to manage an icon list (a rectangle
	*		image full of icon of defined size)
	*	@param Euterpe_Owner: objects owner of the icon list
	*	@param ID: id to apply to list
	*	@param Class_Name: class to apply
	*	@param IconSrc: URL of the list
	*	Note: if you want to show an icon, an icon list can be helpfull
	*			To use it, create the object, load a list (maybe during creation),
	*			set size of icons and index of icon to show...
	********************************************************/
	function Euterpe_Icon_List(Euterpe_Owner,ID,Class_Name,IconSrc){
		this.SystemImage;
		/********************************************************
		*	Setup
		*	Description: setup function for icon list
		*	@param Owner: objects owner of the icon list (icon showed)
		*	@param UID: id to apply to element connected
		*	@param Class: class to apply (if any)
		*	Note: internal usage. DO NOT EXECUTE!!!
		********************************************************/
		this.Setup=function(Owner,UID,Class,Src){
			this.BaseCreation("div",Owner,"Euterpe_Icon_List");
			this.SecondStageCreation(UID,Class);
			if(Src)
				this.SetIconList(Src);
		}
		/********************************************************
		*	SetIconList
		*	Description: define URL of the icon list to load
		*	@param Value: URL to load
		*	Note:
		********************************************************/		
		this.SetIconList=function(Value){
			this.SetStyleProperty("background-image","url('"+Value+"')");
			this.SetStyleProperty("background-position","-32px 0px");
			this.SystemImage=new Euterpe_Image(this,"","");
			this.SystemImage.Hide();
			this.SystemImage.AddEventMgr("load",IconListLoadEvent);
			this.SystemImage.LoadImg(Value);
		}		
		/********************************************************
		*	Redraw
		*	Description: function to redraw icon 
		*	Note: this function redraw the icon following parameter
		*		so may be necessary after resizing or changing class
		********************************************************/				
		this.Redraw=function(){
			var Index=this.GetAttribute("data-IconIdx");
			var IW=PixelTxtToNumber(this.GetAttribute("data-IconW"));
			var IH=PixelTxtToNumber(this.GetAttribute("data-IconH"));
			var OrW=this.SystemImage.GetAttribute("data-OriginalW");
			var OrH=this.SystemImage.GetAttribute("data-OriginalH");
			var IconPerRow=PixelTxtToNumber(OrW)/PixelTxtToNumber(IW);
			var X=Math.floor(Index%IconPerRow);
			var Y=Math.floor(Index/IconPerRow);
			this.SetStyleProperty("background-position",(-X*IW)+"px "+(-Y*IH)+"px");			
		}
		/********************************************************
		*	SetIconIndex
		*	Description: change index of icon showed
		*	@param Idx: index of icon showed (first icon is Idx=0)
		*	Note:
		********************************************************/		
		this.SetIconIndex=function(Idx){
			Index=Idx;
			this.SetAttribute("data-IconIdx",Idx);
			this.Redraw();
		}		
		/********************************************************
		*	SetIconSize
		*	Description: set size of icon in list
		*	@param Wi: width of icons
		*	@param He: height of icons
		*	Note:
		********************************************************/		
		this.SetIconSize=function(Wi,He){
			this.SetAttribute("data-IconW",Wi);
			this.SetAttribute("data-IconH",He);
			this.SetWidth(Wi);
			this.SetHeight(He);
			this.Redraw();
		}		
		this.Setup(Euterpe_Owner,ID,Class_Name,IconSrc);
	} 
	Euterpe_Icon_List.prototype=new Euterpe_Panel;
	Euterpe_Icon_List.prototype.constructor=Euterpe_Icon_List;	
}
//-----------------------------------------------------------------
