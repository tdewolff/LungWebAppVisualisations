var loadingPage = new (function() {
    // save a reference to the overlay
    this.overlayNode = document.getElementById('loading');
    this.messageNode = this.overlayNode.getElementsByTagName('p')[0];

    // called to hide the loading overlay
    this.endLoading = function() {
        this.overlayNode.classList.remove('visible');
    };
    this.beginLoading = function() {
        this.overlayNode.classList.add('visible');
    };
    this.setLoadingText = function(text) {
        this.messageNode.innerHTML = text;
    };
})();
