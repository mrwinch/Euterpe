var Euterpe_Undefined_EventMgr=-100;
//-----------------------------------------------------------------
/********************************************************
*	EuterpeResizeEvent
*	Description: executed when an object is resized
*	@param ObjResized: object resized (all value above in pixels)
*	@param OldWidth: old width value 
*	@param OldHeight: old height 
*	@param NewWidth: new width
*	@param NewHeight: new height
*	@returns: value returned from executed function
*	Note:
********************************************************/
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
	if(ObjResized.EventMgr)
		return ObjResized.EventMgr(Msg);
	else
		return Euterpe_Undefined_EventMgr;
}
//-----------------------------------------------------------------
/********************************************************
*	EuterpeCreateEvent
*	Description: function/event executed when an object is created
*	@param ObjCreated: new object created (an Euterpe object)
*	@param Owner: owner of new object (Euterpe object)
*	@returns: value returned from executed function
*	Note:
********************************************************/
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
/********************************************************
*	EuterpeMoveEvent
*	Description: function/event called when an object is moved
*	@param ObjMoved: object moved (Euterpe object)
*	@param OldTop: old top position
*	@param OldLeft: old left position
*	@param NewTop: new top
*	@param NewLeft: new left
*	@returns: value returned from executed function
*	Note:
********************************************************/
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
/********************************************************
*	EuterpeShowEvent
*	Description: function/event called when an object is showed
*	@param ObjShowed: object showed (Euterpe object)
*	@returns: value returned from executed function
*	Note:
********************************************************/
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
/********************************************************
*	EuterpeHideEvent
*	Description: function/event called when an object is hidden
*	@param ObjShowed: object hidden (Euterpe object)
*	@returns: value returned from executed function
*	Note:
********************************************************/
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
/********************************************************
*	EuterpeChangeTextEvent
*	Description: function/event generated when text of an object is changed
*	@param ObjChanged: object change (Euterpe object)
*	@param OldText: old text (as string)
*	@param NewText: new text (as string)
*	@returns: value returned from executed function
*	Note:
********************************************************/
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
/********************************************************
*	EuterpeChangeClass
*	Description: unction/event generated when class attribute of 
*			an element is changed
*	@param ObjChanged: object changed (Euterpe object)
*	@param OldClass: old class (as string)
*	@param NewClass: new class (as string)
*	@returns: value returned from executed function
*	Note:
********************************************************/
function EuterpeChangeClassEvent(ObjChanged,OldClass, NewClass){
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
/********************************************************
*	EuterpeTabSelection
*	Description: function/event called when a tab is changed
*	@param SelectTab: new tab selected
*	@returns: value returned from executed function
*	Note:
********************************************************/
function EuterpeTabSelectionEvent(SelectTab){
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
/********************************************************
*	EuterpeTreeNodeExpanded
*	Description: function/event called when a node is expanded
*	@param TreeNode: node expanded
*	Note:
********************************************************/
function EuterpeTreeNodeExpandedEvent(TreeNode){
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
/********************************************************
*	EuterpeTreeNodeCollapsed
*	Description: function/event called when a node is collapsed
*	@param TreeNode: node collapsed
*	Note:
********************************************************/
function EuterpeTreeNodeCollapsedEvent(TreeNode){
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
/********************************************************
*	EuterpeFormInvalidated
*	Description: function/event executed when user request validation
*			of a form but this is incomplete
*	@param EForm: form request to validate
*	@param EElement: invalid elements
*	Note:
********************************************************/
function EuterpeFormInvalidatedEvent(EForm,EElement){
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
/********************************************************
*	EuterpeFormValidated
*	Description: function/event executed when user request validation
*		of a form and this is complete
*	@param EForm: form request to validate
*	Note:
********************************************************/
function EuterpeFormValidatedEvent(EForm){
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
/********************************************************
*	EuterpeChangeStyleProperty
*	Description: function/event executed when user call SetStyleProperty
*	@param ObjChanged: object that change property
*	@param Property: property changed
*	@param Value: new property value
*	Note: update to issue #3
********************************************************/
function EuterpeChangeStylePropertyEvent(ObjChanged,Property,Value){
	var Msg={
			type: "Euterpe_Change_Style_Property",
			eventPhase: 2,
			target: ObjChanged.Element,
			srcElement: ObjChanged.Element,
			Property_Change: Property,
			Value: Value
	}
	ObjChanged.EventMgr(Msg);
}
//-----------------------------------------------------------------
