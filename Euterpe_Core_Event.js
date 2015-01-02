var Euterpe_Undefined_EventMgr=-100;
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
	if(ObjResize.EventMgr)
		return ObjResized.EventMgr(Msg);
	else
		return Euterpe_Undefined_EventMgr;
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
		if(Owner.EventMgr)
			return Owner.EventMgr(Msg);
		else
			return Euterpe_Undefined_EventMgr;		
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
	if(ObjMoved.EventMgr)
		return ObjMoved.EventMgr(Msg);
	else
		return Euterpe_Undefined_EventMgr;	
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
	if(ObjShowed.EventMgr)
		return ObjShowed.EventMgr(Msg);
	else
		return Euterpe_Undefined_EventMgr;
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
	if(ObjShowedEventMgr)
		return ObjShowed.EventMgr(Msg);
	else
		return Euterpe_Undefined_EventMgr;	
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
	if(ObjChanged.EventMgr)
		return ObjChanged.EventMgr(Msg);
	else
		return Euterpe_Undefined_EventMgr;	
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
	if(ObjChanged.EventMgr)
		return ObjChanged.EventMgr(Msg);
	else
		return Euterpe_Undefined_EventMgr;	
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
		if(SelecteTab.Dad.EventMgr)
			return SelectTab.Dad.EventMgr(Msg);
		else
			return Euterpe_Undefined_EventMgr;		
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