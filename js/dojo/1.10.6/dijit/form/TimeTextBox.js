//>>built
define("dijit/form/TimeTextBox",["dojo/_base/declare","dojo/keys","dojo/_base/lang","../_TimePicker","./_DateTimeTextBox"],function(_1,_2,_3,_4,_5){
var _6=_1("dijit.form.TimeTextBox",_5,{baseClass:"dijitTextBox dijitComboBox dijitTimeTextBox",popupClass:_4,_selector:"time",value:new Date(""),maxHeight:-1,_onInput:function(){
this.inherited(arguments);
var _7=this.get("displayedValue");
this.filterString=(_7&&!this.parse(_7,this.constraints))?_7.toLowerCase():"";
if(this._opened){
this.closeDropDown();
}
this.openDropDown();
}});
return _6;
});
