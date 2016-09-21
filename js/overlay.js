var loadingPage;
require(["dojo/_base/declare","dojo/dom","dojo/dom-style", "dojo/_base/fx"],
	function(declare, dom, domStyle, fx){
	    var _loadingPage = declare(null, {
	        overlayNode:null,
	        constructor:function(){
	            // save a reference to the overlay
	            this.overlayNode = dom.byId("loadingOverlay");
	        },
	        // called to hide the loading overlay
	        endLoading:function(){
			    fx.fadeOut({
			        node: this.overlayNode,
			        onEnd: function(node){
			            domStyle.set(node, 'display', 'none');
			        }
			    }).play();
	        },
	        beginLoading:function(){
	        	fx.fadeIn({
			        node: this.overlayNode,
			        onEnd: function(node){
			            domStyle.set(node, {"opacity":0.9, 'display': 'initial'});
			        }
			    }).play();
			  }
	    });
	    loadingPage = new _loadingPage();
});

