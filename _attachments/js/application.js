var hash = window.location.hash;
var website_name = hash.replace(/#/g,'');
var username;

getHash = function(val){
    return String.format("#!{0}", val || window.location.hash.replace(/#!/g,''));
}

websiteId = function(val){
    return String.format("com.scanshowsell.website:{0}", val || window.location.hash.replace(/#!/g,''));
}

var fix_link_hrefs = function(){
    $("a.hash").each(function(idx, a){
        var href = $(a).attr("href")
        if(href) 
            href = href.replace(/#![^$]*/g, ''); // removing #!.... part
        else 
            href = ""

        $(a).attr("href", href + hash);
    });
}

$("a.hash").live("click", function(e){
    if(/#!/.test($(this).attr("href")) == false){
        $("#alert-select-website").fadeIn();
        e.preventDefault();
        return true;
    }
})

new_hash = function(){
    hash = window.location.hash;
    website_name = hash.replace(/#!/g,'');

    fix_link_hrefs();
    // filling up forms
    var model = Websites.where({_id: websiteId(website_name)})[0]
    if(model){
        $("form").deserializeForms(model);
    }

    $("#site-manager-dropdown .divider:first").prevAll().removeClass("active");
    $("#site-manager-dropdown a[href$='" + hash + "']").parent().addClass('active')
    $("#site-toggle").text("Currently editing:" + website_name) // FIXME template should be used
    $("#alert-select-website").fadeOut();

}

$(window).bind("hashchange", new_hash)


$(function(){
    // FIXME dirty hack
    // redirecting back to manage.html if hash is does not start with #!
    // var parts = window.location.href.split(/\//),
    // file = parts[parts.length - 1]
    // if(['index.html', 'register.html', 'create.html', 'manage.html', 'themes.html'].indexOf(file) == -1  
    //    && window.location.hash.indexOf("#!") == -1){
    //     window.location.href = "manage.html"
    // }

    $.ajaxSetup({ async: false })
    $.couch.session({
        success: function(session){
            username = session.userCtx.name;
            $.ajaxSetup({ async: true }) // workaround. _session does not accept async:false option
        }
    })

    // Enables Mustache.js-like templating.
    
    // _.templateSettings = {
    //     interpolate : /\{\{(.+?)\}\}/g
    // };

    var isDirty = false;

    Websites = new WebsiteCollection();

    Websites.on('change', function(model){ 
        console.log("change", model)
    })


    Websites.on('add', function(model){ 
        console.log("Website added:", model.id);
    })

    Websites.on('remove', function(model){ 
        console.log("Website removed:", model.id);
    })



    WebsiteView = Backbone.View.extend({
        el: $("body"), 

        events: {
            "blur #website-name": function(e){
                var a = $(e.target).valid();
                if($("#new-btn").length)
                    $("#new-btn").attr("href", 
                                       $("#new-btn").attr("href").replace(/#.*/g, '') + "#!" + $(e.target).val());
            },
            "click #new-btn": function(e){
                createWebsiteModel($("#website-name").val())
            },

            // TESTME: this block of the code require more testing
            "click .do-save-page": function(e){
                var model = Websites.where({_id: websiteId(website_name)})[0];
                if(model){
                    var form = $(e.target).parents("div.tab-pane,#body.row").find("form").serializeForms();
                    _.each(form, function(val, key){
                        model.set(key, _.extend(model.get(key) || {}, val));
                    })
                    model.save();
                }
            },
            "click button.btn.success:contains('Build')": function(e){
            },
            "click a.delete:contains('Remove photo')": function(e){
                var model = Websites.where({_id: websiteId(website_name)})[0];
                if(model){
                    var form = $(e.target).closest("form")
                    var fileName = form.find("input[type=hidden][name=file-name]").val();
                    form.closest("div.#photo-panel").remove();
                    delete model.get("_attachments")[fileName];
                    model.save();
                }                
            }

        },

        initialize : function(){
            // When the session gets destroyed, the row will be destroyed too
            _.bindAll(this, 'reseted', 'addRow', 'deleteRow', 'render');

            this.model.bind("add", this.addRow);
            this.model.bind("remove", this.deleteRow);
            this.model.bind("reset", this.reseted);
            this.model.bind("change", this.render);
        },

        render: function(){
            console.log("render", this)
        },

        addRow : function(model){
            console.log("addRow", this)
            var hash = getHash()
            var model_id = model.id.split(":");
            var name = model_id[1];
            var li = $("<li/>").append($("<a/>").attr("href", getHash(name)).text(name));
            // making li active
            if(name === getHash()){
                li.addClass("active")
            }
            $("#site-manager-dropdown").prepend(li);
        },

        deleteRow: function(model){
            console.log("deleteRow", this)
            var model_id = model.id.split(":");
            var name = model_id[1];
            $("#site-manager-dropdown li > a[href$='" + getHash(name) + "']").parent().remove();

        },
        reseted: function(model){
            console.log("reseted", this)
            $("#dropdown li.divider:first").prevAll().remove();
            model.each(this.addRow);
        }
    });



    // The App router initializes the app by calling `UserList.fetch()`
    var App = Backbone.Router.extend({
        initialize : function(){
            Requests.fetch();
            Websites.fetch({
                success:function(){
                    if(window.location.hash) new_hash()
                }
            });
        }
    });
    $("#login_form").couchLogin({
        loggedIn: function(session){
            username = session.userCtx.name
            // Destroy the current session on unload
            $(window).unload(function(){
                $.ajaxSetup({
                    async : false
                });
            });

            // Includes the couchlogin
            // check it out here: <a href="https://github.com/couchapp/couchdb-login-jquery">https://github.com/couchapp/couchdb-login-jquery</a>
            // Bootstrapping
            new RequestView({model: Requests })
            new WebsiteView({model: Websites });
            new App();

        },
        loggedOut: function(data){
            username = null
            if(window.location.hash){
                window.location.hash = null
            }
            Websites.remove(Websites.models);
        }
    })
})