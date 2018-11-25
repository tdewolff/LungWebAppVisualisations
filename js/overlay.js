var loadingPage = new (function() {
    // save a reference to the overlay
    this.overlayNode = $("#loadingOverlay");
    this.messageNode = $("#loadingMessage");

    // called to hide the loading overlay
    this.endLoading = function() {
        this.overlayNode.fadeOut();
    };
    this.beginLoading = function() {
        this.overlayNode.css({"opacity":0.9, 'display': 'initial'});
    };
    this.setLoadingText = function(text) {
        this.messageNode.html(text);
    };
})();
