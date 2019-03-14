$(document).ready(function () {
    hljs.initHighlightingOnLoad();
    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

});