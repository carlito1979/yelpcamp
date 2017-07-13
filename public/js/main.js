(function($){
    $(function(){
    
    $('.button-collapse').sideNav({
        menuWidth: 200, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        
    });
    
    // function to show or hide a div based on switch
    $(".switch.reveal").find("input[type=checkbox]").on("change",function() {
        var status = $(this).prop('checked');
        var revealDiv = $(".reveal-div");
        if (status) {
            revealDiv.show("fast");
        } else {
            revealDiv.hide("fast");
        }
    });
    
    
    
    }); // end of document ready
})(jQuery); // end of jQuery name space

