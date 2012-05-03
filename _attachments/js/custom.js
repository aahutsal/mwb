$(function () {
    
    $("a.pjax").pjax({fragment:"#body"});
    $("#body").live("pjax:error", function(e, xhr, err) {
        //.text('Something went wrong: ' + err)
    })


    $("#website-name").val(window.location.hash.replace(/#!/g,''))

    // registration stuff
    $("form#registerForm").submit(function(e){
        var userProfile = $(this).serializeForms();
        if(!userProfile){
            e.preventDefault();
            return false;
        }
        userProfile = userProfile['registerForm']
        var userDoc = {
            name: userProfile.emailAddress.replace(/@.*/gi, ''),
            email: userProfile.emailAddress
        }
        $.couch.signup(userDoc, userProfile.password, {
            async: false,
            success: function(){
                // registration successful, moving to next page
                $.couch.login({
                    name: username = userDoc.name,
                    password: userProfile.password,
                    success: function(){
                        createWebsiteModel(userProfile["website-name"], function(){
                            window.location.href = $(e.target).attr("action") + getHash($("#website-name").val());
                        });
                    }
                })
            }
        });

        e.preventDefault();
        return false;
    })

    $(".do-next").live("click", function(){
        // if Next: button clicked, emulating tab click
        $("ul[data-tabs] li > a[href=" + $(this).attr("href") + "]").click();
    })

    $("a:regex(href,#.*)").live("click", function(e){ 
        if(/#!/.test($(this).attr("href")) == false){
            e.preventDefault();
            return true 
        }
    })

    $("section:data(main-nav~=.*)").each(function(){
        $("#main-nav li").removeClass("active");
        $("#main-nav li > a." + $(this).data("main-nav")).parent().addClass("active")
    })

    $(".dropdown-toggle").dropdown();
    $("a[data-controls-modal]").live("click", function(){
        var modalClass = $(this).attr("data-controls-modal");
        $("#" + modalClass).modal();
    })

    $(".topbar-logout").click(function(){
        $.couch.logout();
    });


    $("#dialog").dialog({ 
        autoOpen: true,
        modal: true,
        draggable: false,
        resizable: false,
        width: 500,
        height: 300,
        title: 'Manage your mobile website'
    });

    var slider = $('#templateSlider').bxSlider({
        controls: true,
        auto: false,
        infiniteLoop: false,
        hideControlOnEnd: true,
        pager: true
    });

    $('#go-prev').click(function(){
        slider.goToPreviousSlide();
        return false;
    });

    $('#go-next').click(function(){
        slider.goToNextSlide();
        return false;
    });


    $(window).scroll(function(e) {
        // 40 is the offsetTop of the menu. This should be constant as such
        // it's defined that way. To get your offsetTop you can use
        // document.getElementById('id').offsetTop or $('selector').offset().top
        if ($(window).scrollTop() > 450) {
            $('#instructions').css({
                position: 'fixed',
                top: '0',
                left: '139px'
            });
        }
        else {
            $('#instructions').css({
                position: 'static'
            });
        }
    });
    // add-remove service buttons

    $("a[rel=tooltip]")
        .tooltip({
            delay: 0,
            placement: 'top',
            trigger: 'hover'
        })
        .click(function(e) {
            e.preventDefault()
        })

    $('.do-clone-widget').click(function() {
        $(this).parents("form").find("ul > li:last").clone().appendTo($(this).parents("form").find("ul"));

        return false;
    });

    // using live() will bind the event to all future
    // elements as well as the existing ones
    $('.do-remove-widget').live('click', function() {
	$(this).parent().remove();

        return false;
	var counter = 1;
	var limit = 5;
	function addInput(divName){
	    if (counter == limit)  {
	        alert("You have reached the limit of adding " + counter + " inputs");
	    }
	    else {
	        var newdiv = document.createElement('div');
	        newdiv.innerHTML = "Area " + (counter + 1) + " <br /><br /><input type='text' name='myInputs[]'><br /><br />";
	        document.getElementById(divName).appendChild(newdiv);
	        counter++;
	    }
	}
    })

});
