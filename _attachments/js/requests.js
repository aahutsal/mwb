$(function(){
    Requests = new RequestModelCollection()

    Requests.on('change', function(model){ 
        console.log("change", model)
    })

    Requests.on('add', function(model){ 
        console.log("Website added:", model.id);
        var indicator = $("#navbar-requests-toggle .requests-indicator")
        indicator.text(this.length);
        indicator.addClass("active")
    })

    Requests.on('remove', function(model){ 
        console.log("Website removed:", model.id);
    })

    RequestView = Backbone.View.extend({
        el: $("#navbar-requests-toggle"), 

        events: {
            "click": function(){
                this.$el.find(".requests-indicator.active").removeClass("active")
            },
            "click li a": function(e){
                var id = $(e.target).data("id")
                console.log(id);
                $(e.target).removeClass("unread");
                var model = Requests.where({_id: id})
                model = model[0]
                console.log(model);
                var header = $("#request-screen").find("div.modal-header")
                var body = $("#request-screen").find("div.modal-body")

                header.find("h3").text(String.format("Request: {0}"), id)
                body.find("code").text(JSON.stringify(model.toJSON()));
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
            console.log("render(requests)", this)
        },

        addRow : function(model){
            console.log("addRow(requests)", this)
            var docTypes = model.get("_id").split(":")
            var li = $("<li/>")
            var a = $("<a href=#/>").addClass("navbar-" + docTypes[1]).append($("<strong/>").text(docTypes[1])).append(" by " + model.get('by'))
            a.attr("data-controls-modal", "request-screen");
            a.attr("data-id", model.get("_id"))
            $(a).addClass("unread");
            li.append(a);
            this.$el.find("#requests-menu").prepend(li);
        },

        deleteRow: function(model){
            console.log("deleteRow(requests)", this)
        },
        reseted: function(model){
            this.$el.find("#requests-menu li.divider:first").prevAll().remove();
            var indicator = $("#navbar-requests-toggle .requests-indicator")
            indicator.text(model.length);
            model.each(this.addRow);
        }
    });
})