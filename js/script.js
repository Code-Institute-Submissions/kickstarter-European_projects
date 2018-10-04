 $(document).ready(function() {
     $('[data-toggle="tooltip"]').tooltip();
 });
 
 
 $(window).on('load', function() {
     if ($(window).width() < 1024) {
        $('#myModal').modal('show');
     }
 });