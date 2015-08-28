'use strict';

/*
 * A Design by GraphBerry
 * Author: GraphBerry
 * Author URL: http://graphberry.com
 * License: http://graphberry.com/pages/license
 */

 function isLeapYear(year){
    if(year%4 == 0)
    {
        if( year%100 == 0) /* Checking for a century year */
        {
            if ( year%400 == 0)
                return true;
            else
                return false;
        }
        else
            return true;
    }
    else
        return false;
}

jQuery(document).ready(function ($) {

    var lastId,
        topMenu = $("#top-navigation"),
        topMenuHeight = topMenu.outerHeight(),
        // All list items
        menuItems = topMenu.find("a"),
        // Anchors corresponding to menu items
        scrollItems = menuItems.map(function () {
            var item = $($(this).attr("href"));
            if (item.length) {
                return item;
            }
        });



    //Get width of container
    var containerWidth = $('.section .container').width();
    //Resize animated triangle
    $(".triangle").css({
        "border-left": containerWidth / 2 + 'px outset transparent',
        "border-right": containerWidth / 2 + 'px outset transparent'
    });
    $(window).resize(function () {
        containerWidth = $('.container').width();
        $(".triangle").css({
            "border-left": containerWidth / 2 + 'px outset transparent',
            "border-right": containerWidth / 2 + 'px outset transparent'
        });
    });

                $(function() {
                $( "#cstart" ).datepicker({
                changeMonth: true,
                changeYear: true
                });
            });
            $(function() {
                $( "#cend" ).datepicker({
                changeMonth: true,
                changeYear: true
                });
            });


    //Initialize header slider.
    $('#da-slider').cslider();

    //Initial mixitup, used for animated filtering portgolio.
    $('#portfolio-grid').mixitup({
        'onMixStart': function (config) {
            $('div.toggleDiv').hide();
        }
    });

    //Initial Out clients slider in client section
    $('#clint-slider').bxSlider({
        pager: false,
        minSlides: 1,
        maxSlides: 5,
        moveSlides: 2,
        slideWidth: 210,
        slideMargin: 25,
        prevSelector: $('#client-prev'),
        nextSelector: $('#client-next'),
        prevText: '<i class="icon-left-open"></i>',
        nextText: '<i class="icon-right-open"></i>'
    });


    $('input, textarea').placeholder();

    // Bind to scroll
    $(window).scroll(function () {

        //Display or hide scroll to top button 
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }

        if ($(this).scrollTop() > 130) {
            $('.navbar').addClass('navbar-fixed-top animated fadeInDown');
        } else {
            $('.navbar').removeClass('navbar-fixed-top animated fadeInDown');
        }

        // Get container scroll position
        var fromTop = $(this).scrollTop() + topMenuHeight + 10;

        // Get id of current scroll item
        var cur = scrollItems.map(function () {
            if ($(this).offset().top < fromTop)
                return this;
        });

        // Get the id of the current element
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            menuItems
                .parent().removeClass("active")
                .end().filter("[href=#" + id + "]").parent().addClass("active");
        }
    });

    /*
    Function for scroliing to top
    ************************************/
    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });


    $(window).load(function () {
        function filterPath(string) {
            return string.replace(/^\//, '').replace(/(index|default).[a-zA-Z]{3,4}$/, '').replace(/\/$/, '');
        }
        $('a[href*=#]').each(function () {
            if (filterPath(location.pathname) == filterPath(this.pathname) && location.hostname == this.hostname && this.hash.replace(/#/, '')) {
                var $targetId = $(this.hash),
                    $targetAnchor = $('[name=' + this.hash.slice(1) + ']');
                var $target = $targetId.length ? $targetId : $targetAnchor.length ? $targetAnchor : false;

                if ($target) {

                    $(this).click(function () {

                        //Hack collapse top navigation after clicking
                        topMenu.parent().attr('style', 'height:0px').removeClass('in'); //Close navigation
                        $('.navbar .btn-navbar').addClass('collapsed');

                        var targetOffset = $target.offset().top - 63;
                        $('html, body').animate({
                            scrollTop: targetOffset
                        }, 800);
                        return false;
                    });
                }
            }
        });
    });

    /*
    Sand newsletter
    **********************************************************************/
    $('#subscribe').click(function () {
        var error = false;
        var emailCompare = /^([a-z0-9_.-]+)@([0-9a-z.-]+).([a-z.]{2,6})$/; // Syntax to compare against input
        var email = $('input#nlmail').val().toLowerCase(); // get the value of the input field
        if (email == "" || email == " " || !emailCompare.test(email)) {
            $('#err-subscribe').show(500);
            $('#err-subscribe').delay(4000);
            $('#err-subscribe').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true; // change the error state to true
        }

        if (error === false) {
            $.ajax({
                type: 'POST',
                url: 'php/newsletter.php',

                data: {
                    email: $('#nlmail').val()
                },
                error: function (request, error) {
                    alert("An error occurred");
                },
                success: function (response) {
                    if (response == 'OK') {
                        $('#success-subscribe').show();
                        $('#nlmail').val('')
                    } else {
                        alert("An error occurred");
                    }
                }
            });
        }

        return false;
    });

    $('input[name="mode"]:radio').change(function(event){
        if($('input[value="compound"]').attr('checked')) {
            $("#period").removeAttr('disabled');
        }
        else
        {
            $("#period").attr('disabled','disabled');
        }
    });

    /* Add thousand separators to loan amount */
    // $("input#loan").on('change',function (event) {
    //     var p = event.target.value;
    //     var pt = p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //     $('input#loan').text(pt);
    // });

    /* Calculate EMI  */
    $("#calculate-emi").click(function (event){
        var pt = $('input#loan').val();
        var p = numval(pt,2,0);
        var error = false;
        if(p==""|| !(p>0)){
            $('#err-loan').show(500);
            $('#err-loan').delay(4000);
            $('#err-loan').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true;
        }

        var r = $('input#interest').val();
        if(r==""|| !(r>0 && r<100)){
            $('#err-interest').show(500);
            $('#err-interest').delay(4000);
            $('#err-interest').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true;
        }

        var n = $('input#duration').val();
        if(n=="" || !(n>0)){
            $('#err-duration').show(500);
            $('#err-duration').delay(4000);
            $('#err-duration').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true;
        }

        if(error == false)
        {
            r = r/(12*100);
            n = n * 12;

            var emi =Math.round( p * r * Math.pow(1+r,n)/(Math.pow(1+r,n)-1));

            $('div#result-emi').text("EMI amount: ₹ " + emi);
        }
        event.preventDefault();
    });



    /* Calculate Interest  */
    $("#calculate-interest").click(function (event){

        var m = $('input[name="mode"]:checked').val();
        if(m=="0"){
            $('#err-mode').show(500);
            $('#err-mode').delay(4000);
            $('#err-mode').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true;            
        }

        var pt = $('input#principal').val();
        var p = numval(pt,2,0);
        var error = false;
        if(p==""|| !(p>0)){
            $('#err-principal').show(500);
            $('#err-principal').delay(4000);
            $('#err-principal').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true;
        }

        var r = $('input#cinterest').val();
        if(r==""|| !(r>0 && r<100)){
            $('#err-cinterest').show(500);
            $('#err-cinterest').delay(4000);
            $('#err-cinterest').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true;
        }

        var start = $('input#cstart').val(); // Start Date text
        var start_dt = new Date(start); // Start Date object
        if(start==""){
            $('#err-start').show(500);
            $('#err-start').delay(4000);
            $('#err-start').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true;
        }

        var end = $('input#cend').val(); // End Date text
        var end_dt = new Date(end); // End Date Object
        if(end==""){
            $('#err-end').show(500);
            $('#err-end').delay(4000);
            $('#err-end').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true;
        }

        var diff = end_dt.getTime() - start_dt.getTime();
        if(diff<0)
        {
            error = true;
            alert("Start Date cannot be greater than End Date");
        }

        var period = $("#period").val();
        if(m=="compound"){
            if(period == "0")
            {
                $('#err-period').show(500);
                $('#err-period').delay(4000);
                $('#err-period').animate({
                    height: 'toggle'
                }, 500, function () {
                    // Animation complete.
                });
                error = true;
            }
        }

        if(error == false)
        {
            var ci = 0;

            var normal_month_days = [31,28,31,30,31,30,31,31,30,31,30,31];
            var leap_month_days = [31,29,31,30,31,30,31,31,30,31,30,31];

            var start_yr = start_dt.getFullYear();
            var start_month = start_dt.getMonth();
            var start_day = start_dt.getDay();

            var days_elapsed = 0;
            var months_elapsed = 0;

            diff = diff/(1000*3600*24);

            var year = start_yr;
            var month = start_month;

            if( m == "simple"){
                ci = p * r * diff / 100;
            }
            else {

                while(days_elapsed!=diff){
                    month = month % 12;
                    if(isLeapYear(year))
                    {
                        while(month<12 && days_elapsed!=diff){
                            if(days_elapsed+leap_month_days[month]<=diff)
                            {
                                days_elapsed += leap_month_days[month];
                                months_elapsed++;
                                month++;
                            }
                            else
                            {
                                days_elapsed = diff;
                            }
                        }
                        if(month>=12){
                            year++;
                        }
                    }
                    else {
                        while(month<12 && days_elapsed!=diff){
                            if(days_elapsed+leap_month_days[month]<=diff)
                            {
                                days_elapsed += normal_month_days[month];
                                months_elapsed +=1;
                                month++;
                            }
                            else
                            {
                                days_elapsed = diff;
                            }
                        }
                        if(month>=12){
                            year++;
                        }
                    }
                }

                var years_elapsed = months_elapsed / 12;
                var quarters_elapsed = months_elapsed / 3;
                var half_years_elapsed = months_elapsed / 6;

                switch(period)
                {
                    case "daily":
                        r=r/(365*100);
                        break;
                    case "monthly":
                        r=r/(12*100);
                        diff = months_elapsed;
                        break;
                    case "quarterly":
                        r = r/(4*100);
                        diff = quarters_elapsed;
                        break;
                    case "half":
                        r = r/(2*100);
                        diff = half_years_elapsed;
                        break;
                    case "yearly":
                        r = r/(1*100);
                        diff = years_elapsed;
                        break;
                }

                var a =Math.round( p * Math.pow(1+r,diff));

                var ci = a - p;
            }

            $('div#result-interest').text("Interest amount: ₹ " + ci);
        }
        event.preventDefault();
    });

    /*
Sand mail
**********************************************************************/
    $("#send-mail").click(function () {

        var name = $('input#name').val(); // get the value of the input field
        var error = false;
        if (name == "" || name == " ") {
            $('#err-name').show(500);
            $('#err-name').delay(4000);
            $('#err-name').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true; // change the error state to true
        }

        var emailCompare = /^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$/; // Syntax to compare against input
        var email = $('input#email').val().toLowerCase(); // get the value of the input field
        if (email == "" || email == " " || !emailCompare.test(email)) {
            $('#err-email').show(500);
            $('#err-email').delay(4000);
            $('#err-email').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true; // change the error state to true
        }


        var comment = $('textarea#comment').val(); // get the value of the input field
        if (comment == "" || comment == " ") {
            $('#err-comment').show(500);
            $('#err-comment').delay(4000);
            $('#err-comment').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true; // change the error state to true
        }

        if (error == false) {
            var dataString = $('#contact-form').serialize(); // Collect data from form
            $.ajax({
                type: "POST",
                url: $('#contact-form').attr('action'),
                data: dataString,
                timeout: 6000,
                error: function (request, error) {

                },
                success: function (response) {
                    response = $.parseJSON(response);
                    if (response.success) {
                        $('#successSend').show();
                        $("#name").val('');
                        $("#email").val('');
                        $("#comment").val('');
                    } else {
                        $('#errorSend').show();
                    }
                }
            });
            return false;
        }

        return false; // stops user browser being directed to the php file
    });



    //Function for show or hide portfolio desctiption.
    $.fn.showHide = function (options) {
        var defaults = {
            speed: 1000,
            easing: '',
            changeText: 0,
            showText: 'Show',
            hideText: 'Hide'
        };
        var options = $.extend(defaults, options);
        $(this).click(function () {
            $('.toggleDiv').slideUp(options.speed, options.easing);
            var toggleClick = $(this);
            var toggleDiv = $(this).attr('rel');
            $(toggleDiv).slideToggle(options.speed, options.easing, function () {
                if (options.changeText == 1) {
                    $(toggleDiv).is(":visible") ? toggleClick.text(options.hideText) : toggleClick.text(options.showText);
                }
            });
            return false;
        });
    };

    //Initial Show/Hide portfolio element.
    $('div.toggleDiv').hide();
    $('.show_hide').showHide({
        speed: 500,
        changeText: 0,
        showText: 'View',
        hideText: 'Close'
    });

    /************************
    Animate elements
    *************************/
    
    //Animate thumbnails 
    jQuery('.thumbnail').one('inview', function (event, visible) {
        if (visible == true) {
            jQuery(this).addClass("animated fadeInDown");
        } else {
            jQuery(this).removeClass("animated fadeInDown");
        }
    });

    //Animate triangles
    jQuery('.triangle').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery(this).addClass("animated fadeInDown");
        } else {
            jQuery(this).removeClass("animated fadeInDown");
        }
    });
    
    //animate first team member
    jQuery('#first-person').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery('#first-person').addClass("animated pulse");
        } else {
            jQuery('#first-person').removeClass("animated pulse");
        }
    });
    
    //animate sectond team member
    jQuery('#second-person').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery('#second-person').addClass("animated pulse");
        } else {
            jQuery('#second-person').removeClass("animated pulse");
        }
    });

    //animate thrid team member
    jQuery('#third-person').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery('#third-person').addClass("animated pulse");
        } else {
            jQuery('#third-person').removeClass("animated pulse");
        }
    });
    
    //Animate price columns
    jQuery('.price-column, .testimonial').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery(this).addClass("animated fadeInDown");
        } else {
            jQuery(this).removeClass("animated fadeInDown");
        }
    });
    
    //Animate contact form
    jQuery('.contact-form').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery('.contact-form').addClass("animated bounceIn");
        } else {
            jQuery('.contact-form').removeClass("animated bounceIn");
        }
    });

    //Animate skill bars
    jQuery('.skills > li > span').one('inview', function (event, visible) {
        if (visible == true) {
            jQuery(this).each(function () {
                jQuery(this).animate({
                    width: jQuery(this).attr('data-width')
                }, 3000);
            });
        }
    });
});

//Initialize google map for contact setion with your location.

function initializeMap() {

    var lat = '21.2034528'; //Set your latitude.
    var lon = '72.8325185'; //Set your longitude.

    var centerLon = lon - 0.0105;

    var myOptions = {
        scrollwheel: false,
        draggable: true,
        disableDefaultUI: false,
        center: new google.maps.LatLng(lat, centerLon),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //Bind map to elemet with id map-canvas
    var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lon),
    });

    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });

    infowindow.open(map, marker);
}