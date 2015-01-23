//No additional script required
//-----------------------------------------------------------------
if(Euterpe_Map_Obj==undefined){
	var Euterpe_Map_Obj=1;
	var Map_Counter=0;
	/********************************************************
	*	Euterpe_Map_Area
	*	Description: small object to manage <area> tag
	*	@param Map_Owner: map owner of the area (use javascript element)
	*	Note: don't generate by itself but inside a map
	********************************************************/
	function Euterpe_Map_Area(Map_Owner){
		this.AreaElement;
		/********************************************************
		*	Setup
		*	Description: setup routine for this object
		*	@param Map: map owner
		*	Note: DO NOT OUTSIDE this script
		********************************************************/		
		this.Setup=	function(Map){
			this.AreaElement=document.createElement("area");
			if(Map.MapElement)
				Map.MapElement.appendChild(this.AreaElement);
			else
				Map.appendChild(this.AreaElement);
		}
		/********************************************************
		*	SetShape
		*	Description: set shape attribute for area
		*	@param Type: shape value (as string)
		*	Note:
		********************************************************/		
		this.SetShape=function(Type){
			this.AreaElement.setAttribute("shape",Type);
		}
		/********************************************************
		*	SetCoords
		*	Description: set coords attribute
		*	@param Value: coordinates as string
		*	Note:
		********************************************************/		
		this.SetCoords=	function(Value){
			this.AreaElement.setAttribute("coords",Value);
		}
		/********************************************************
		*	SetHRef
		*	Description: set href attribute
		*	@param Ref: href value to set
		*	Note:
		********************************************************/		
		this.SetHRef=function(Ref){
			if(GetBrowser()=="MSIE" && GetBrowserVer()<7)
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
				this.AreaElement.parentNode.replaceChild(Tmp,this.AreaElement);
				this.AreaElement=Tmp;
			}
			else			
				this.AreaElement.setAttribute("href",Ref);
		}
		/********************************************************
		*	SetTarget
		*	Description: set target attribute
		*	@param Target: target value
		*	Note:
		********************************************************/		
		this.SetTarget=	function(Target){
			this.AreaElement.setAttribute("target",Target);
		}		
		/********************************************************
		*	SetAlt
		*	Description: set alt attribute
		*	@param Alt: alt value
		*	Note:
		********************************************************/		
		this.SetAlt=function(Alt){
			this.AreaElement.setAttribute("alt",Alt);
		}
		/********************************************************
		*	GetElement
		*	Description: retrieve this object as javascript element
		*	@returns: a javascript element
		*	Note:
		********************************************************/		
		this.GetElement=function(){
			return this.AreaElement;
		}
		/********************************************************
		*	SetID
		*	Description: set id attribute of the area
		*	@param id: id value
		*	Note:
		********************************************************/		
		this.SetID=function(id){
			this.AreaElement.id=id;
		}
		this.Setup(Map_Owner);
	}
//-----------------------------------------------------------------	
	/********************************************************
	*	Euterpe_Map
	*	Description: a simple object to manage <map> element
	*	@param Map_Name: name to give at the map
	*	Note: name is required!!!
	********************************************************/
	function Euterpe_Map(Map_Name){
		this.MapElement;
		this.AreaList;
		/********************************************************
		*	Setup
		*	Description: setup routine for this object
		*	@param Name: map name
		*	Note: DO NOT OUTSIDE this script
		********************************************************/				
		this.Setup=function(Name){
			var N;
			if(Name==null || Name==undefined){
				N="MAP_"+Map_Counter;
				Map_Counter+=1;
			}
			else
				N=Name;
			if(this.Browser=="MSIE")
				this.MapElement=document.createElement("<map name="+N+"></map>");
			else
			{
				this.MapElement=document.createElement("map");
				this.MapElement.setAttribute("name",N);
			}
			document.body.appendChild(this.MapElement);
			this.AreaList=new Array();
		}
		/********************************************************
		*	AddArea
		*	Description: add an area to the map and return this
		*	@returns {Euterpe_Map_Area}: the area generated
		*	Note:
		********************************************************/		
		this.AddArea=function(){
			var M=new Euterpe_Map_Area(this);
			this.AreaList.push(M);
			return M;
		}
		/********************************************************
		*	GetMapByID
		*	Description: retrieve a map with a selected id
		*	@param id: id to search
		*	@returns: map found or undefined if it doesn't exist
		*	Note:
		********************************************************/		
		this.GetMapByID=function(id){
			for(var a=0;a<this.AreaList.length;a++){
				if(this.AreaList[a].GetElement().id==id)
					return this.AreaList[a];
			}
			return undefined;
		}
		this.Setup(Map_Name);
	}
}
//-----------------------------------------------------------------
