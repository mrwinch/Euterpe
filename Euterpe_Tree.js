//Require:
//+	Euterpe_Core_Event.js
//+	Euterpe_Core.js
//-----------------------------------------------------------------
/********************************************************
*	TreeNodeAdded
*	Description: executed when a new node is added
*	@param Msg: node owner of the node added
*	@param Node: node added
*	Note: internal use
********************************************************/
function TreeNodeAdded(Msg,Node){
	if(Msg){
		if(Msg.GetType){
			var T=Msg.GetType();		
			if(T=="Euterpe_TreeNode"){
				var a=Msg.GetLevel();
				Node.SetAttribute("data-NodeLevel",Number(a+1));
				Node.SetAttribute("data-DadNode",Msg.GetUID());
				Node.SetAttribute("data-TreeOwner",Msg.GetTreeOwner().GetUID());
				var List=Msg.GetAttribute("data-ChildNode");
				var Ar;
				if(List)
					Ar=List.split(",");
				else
					Ar=new Array();
				Ar.push(Node.GetUID());
				Msg.SetAttribute("data-ChildNode",Ar.toString());
			}
			if(T=="Euterpe_Tree"){
				Node.SetAttribute("data-NodeLevel",0);
				Node.SetAttribute("data-DadNode",-1);
				Node.SetAttribute("data-TreeOwner",Msg.GetUID());
			}
		}
	}
}
/********************************************************
*	TreeNodeClicked
*	Description: executed when user click on a node. If the node
*				has sub node, node is expanded (if collapsed) or
*				collapsed (if expanded)
*	@param Msg: node clicked
*	Note:
********************************************************/
function TreeNodeClicked(Msg){
	if(Msg){
		var Node=GetEuterpeObjFromMsg(Msg);
		if(Node.GetType){
			var T=Node.GetType();
			if(T=="Euterpe_Align_Panel")
				Node=Node.Dad;
			Euterpe_Log("Tip:"+Node.GetText());
			if(Node.isCollapsed())
				Node.Expand();
			else
				Node.Collapse();
		}
	}
}
//-----------------------------------------------------------------
if(Euterpe_TreeNode_Obj==undefined){
	var Euterpe_TreeNode_Obj=1;
	/********************************************************
	*	Euterpe_TreeNode
	*	Description: a single node inside the tree. Every node can have one or more 
	*				subnode
	*	@param Node_Owner: owner of the node created
	*	@param ID: id for the node
	*	@param Class_Name: class for the new node
	*	Note:
	********************************************************/
	function Euterpe_TreeNode(Node_Owner,ID,Class_Name){
		this.Tree_Owner;
		this.Expander;
		/********************************************************
		*	Setup
		*	Description: setup function
		*	@param Owner: owner of the node created
		*	@param I: id for the node
		*	@param Class: class for the new node		
		*	@returns: no value
		*	Note: internal usage
		********************************************************/			
		this.Setup=function(Owner,I,Class){
			var a;
			this.BaseCreation("a",Node_Owner,"Euterpe_TreeNode");
			this.SetText("TreeNode");
			EuterpeSetElementStyleProperty(this.TextElement,"cursor","pointer");
			this.SetStyleProperty("cursor","pointer");
			TreeNodeAdded(Owner,this);
			this.Expander=new Euterpe_Align_Panel(this);
			this.Expander.Hide();
			this.Collapse();
			this.Expander.SetText("\u25b6");
			this.Tree_Owner=this.GetTreeOwner();
			this.AddEventMgr("click",TreeNodeClicked);
			this.Expander.AddEventMgr("click",TreeNodeClicked);
			this.SecondStageCreation(I,Class);
		}
		/********************************************************
		*	GetLevel
		*	Description: every node has his own level. A sub node has level of the
		*					owner plus 1 (top level is 0)
		*	@returns: level's node
		*	Note:
		********************************************************/		
		this.GetLevel=function(){
			var a=this.GetAttribute("data-NodeLevel");
			return Number(a);
		}
		/********************************************************
		*	Redraw
		*	Description: called every time the node must be redraw
		*	Note:
		********************************************************/		
		this.Redraw=function(){
			var L=this.Tree_Owner.LevelIndent*this.GetAttribute("data-NodeLevel");
			var Exp=this.HasSubNode();
			var Bro=this.Tree_Owner.GetNodeInLevel(this.GetLevel());
			if(!Exp){
				for(var a=0;a<Bro.length;a++){
					if(Bro[a].HasSubNode()){
						L+=this.Expander.GetWidth();
						a=Bro.length;
					}
				}
			}
			if(this.HasSubNode()==true){
				if(this.isCollapsed()==true){
					this.Expander.SetText("\u25b6");
					var Chi=this.GetChildNode();
					for(var a=0;a<Chi.length;a++){
						if(Chi[a])
							Chi[a].Hide();
					}
					var Area=EvaluateTextSize(this.Expander.Element,this.Expander.GetText());
					this.Expander.SetTop("-"+(Area.h-Area.w)/2+"px");
				}
				else{
					this.Expander.SetText("\u25bc");
					var Chi=this.GetChildNode();
					var T=Math.max(this.TextElement.offsetHeight,this.Element.offsetHeight);
					for(var a=0;a<Chi.length;a++){
						if(Chi[a]){
							Chi[a].SetTop(T+"px");
							Chi[a].SetLeft(this.Tree_Owner.LevelIndent*Chi[a].GetAttribute("data-NodeLevel")+"px");
							Chi[a].Show();
							Chi[a].Redraw();
							T=T+Chi[a].GetHeight();
						}
					}
					this.Expander.SetTop("0px");
				}
				this.Expander.Show();
				EuterpeSetElementStyleProperty(this.TextElement,"left",(L+this.Expander.GetWidth())+"px");
				this.Expander.SetLeft(L+"px");
			}
			else{
				this.Expander.Hide();
				EuterpeSetElementStyleProperty(this.TextElement,"left",L+"px");
			}
			EuterpeSetElementStyleProperty(this.TextElement,"white-space","nowrap");
		}
		/********************************************************
		*	Collapse
		*	Description: collapse the node (if it has sub nodes)
		*	Note:
		********************************************************/		
		this.Collapse=function(){
			this.SetAttribute("data-NodeCollapse","true");
			if(this.HasSubNode()){
				if(this.Tree_Owner)
					this.Tree_Owner.Redraw();
				EuterpeTreeNodeCollapsedEvent(this);
			}
		}
		/********************************************************
		*	Expand
		*	Description: expand the node (if it has sub nodes)
		*	Note:
		********************************************************/		
		this.Expand=function(){
			this.SetAttribute("data-NodeCollapse","false");
			if(this.HasSubNode()){
				if(this.Tree_Owner)
					this.Tree_Owner.Redraw();
				EuterpeTreeNodeExpandedEvent(this);
			}
		}
		/********************************************************
		*	HasSubNode
		*	Description: return true if node has sub nodes otherwise false
		*	@returns {Boolean}: node has subnodes?
		*	Note:
		********************************************************/		
		this.HasSubNode=function(){
			var T=this.GetAttribute("data-ChildNode");
			if(T)
				return true;
			return false;
		}
		/********************************************************
		*	isCollapsed
		*	Description: return true if node is collapsed otherwise false
		*	@returns: node is collapsed?
		*	Note:
		********************************************************/		
		this.isCollapsed=function(){
			var Txt=this.GetAttribute("data-NodeCollapse");
			return Txt=="true"?true:false;
		}
		/********************************************************
		*	GetChildNode
		*	Description: return an array with children of the main node
		*	@returns {Array}: an array composed by Euterpe_TreeNode objects
		*	Note: if one child has some sub nodes, this function return only the
		*		main direct descendant child and not sub nodes
		********************************************************/		
		this.GetChildNode=function(){
			var Str=this.GetAttribute("data-ChildNode");
			var List;
			if(Str)
				List=Str.split(",");
			else
				List=new Array();
			for(var a=0;a<List.length;a++){
				List[a]=FindEuterpeObject(List[a]);
			}
			return List;
		}
		/********************************************************
		*	GetDadNode
		*	Description: return node owner of this node
		*	@returns: an Euterpe_TreeNode object
		*	Note:
		********************************************************/		
		this.GetDadNode=function(){
			var UID=this.GetAttribute("data-DadNode");
			var Dad=FindEuterpeObject(UID);
			if(Dad!=null){
				if(Dad.GetType){
					if(Dad.GetType()=="Euterpe_TreeNode")
						return Dad;
				}
			}
			return null;
		}
		/********************************************************
		*	GetTreeOwner
		*	Description: return the tree owner of the node
		*	@returns: an Euterpe_Tree object
		*	Note:
		********************************************************/		
		this.GetTreeOwner=function(){
			var UID=this.GetAttribute("data-TreeOwner");
			var Tree=FindEuterpeObject(UID);
			return Tree;
		}	
		/********************************************************
		*	GetHeight
		*	Description: evaluate the height of the node and of all children
		*	@returns: the height in pixel
		*	Note: used to evaluate height necessary to draw the tree
		********************************************************/				
		this.GetHeight=function(){
			var H;
			if(this.Element){
				if(this.TextElement)
					H=Math.max(this.TextElement.offsetHeight,this.Element.offsetHeight);
				else
					H=this.Element.offsetHeight;
			}	
			else
				H=0;
			if(this.isCollapsed()==false){
				var Child=this.GetChildNode();
				for(var a=0;a<Child.length;a++)
					if(Child[a])
						H=H+Child[a].GetHeight();
			}
			return H;
		}
		this.Setup(Node_Owner,ID,Class_Name);
	}
	Euterpe_TreeNode.prototype=new Euterpe_Panel;
	Euterpe_TreeNode.prototype.constructor=Euterpe_TreeNode;	
}
//-----------------------------------------------------------------
if(Euterpe_Tree_Obj==undefined){
	var Euterpe_Tree_Obj=1;
	/********************************************************
	*	Euterpe_Tree
	*	Description: a tree object implementation
	*	@param Euterpe_Owner: owner of the tree
	*	@param ID: tree's ID
	*	@param Class_Name: tree's class
	*	Note:
	********************************************************/
	function Euterpe_Tree(Euterpe_Owner,ID,Class_Name){
		this.NodeList;
		this.LevelIndent;
		/********************************************************
		*	Setup
		*	Description: setup function
		*	@param Owner: owner of the tree
		*	@param I: id for the tre
		*	@param Class: class for the new tree		
		*	@returns: no value
		*	Note: internal usage
		********************************************************/					
		this.Setup=function(Owner,I,Class){
			this.BaseCreation("div",Euterpe_Owner,"Euterpe_Tree");
			this.NodeList=new Array();
			this.SecondStageCreation(I,Class);	
			this.LevelIndent=15;
		}
		/********************************************************
		*	AddNode
		*	Description: add a node to the tree
		*	@param Parent_Node: the node where new node is added as sub node.
		*				If Parent_Node==null, the node is added to tree's top level
		*	@param Text: text for new node
		*	@returns: return node created
		*	Note:
		********************************************************/		
		this.AddNode=function(Parent_Node,Text){
			var Node;
			if(Parent_Node)
				Node=new Euterpe_TreeNode(Parent_Node,"","");
			else			
				Node=new Euterpe_TreeNode(this,"","");			
			Node.Tree_Owner=this;
			if(Text)
				Node.SetText(Text);
			this.NodeList.push(Node);
			if(Node.GetLevel()>0)
				Node.Hide();
			this.Redraw();
			return Node;
		}
		/********************************************************
		*	Redraw
		*	Description: called every time the tree must be redraw
		*	Note:
		********************************************************/			
		this.Redraw=function(){
			var L,T;
			var HasNode=false;
			T=0;
			for(var a=0;a<this.NodeList.length;a++){
				if(this.NodeList[a].HasSubNode()==true){
					a=this.NodeList.length;
					HasNode=true;
				}
			}
			for(var a=0;a<this.NodeList.length;a++){
				if(this.NodeList[a].GetLevel()==0){
					this.NodeList[a].SetTop(T+"px");
					this.NodeList[a].Redraw();
					T+=this.NodeList[a].GetHeight();
				}
			}
		}
		/********************************************************
		*	GetNodeInLevel
		*	Description: return an array with node present in that level
		*	@param Level: level to scan for nodes
		*	@returns {Array}: return an array composed by Euterpe_TreeNode object
		*				and every element in array has GetLevel()=Level
		*	Note:
		********************************************************/		
		this.GetNodeInLevel=function(Level){
			var Out =new Array();
			for(var a=0;a<this.NodeList.length;a++){
				if(this.NodeList[a].GetLevel()==Level)
					Out.push(this.NodeList[a]);
			}
			return Out;
		}
		this.Setup(Euterpe_Owner,ID,Class_Name);
	}
	Euterpe_Tree.prototype=new Euterpe_Panel;
	Euterpe_Tree.prototype.constructor=Euterpe_Tree;
}
//-----------------------------------------------------------------
