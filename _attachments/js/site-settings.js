$(function(){

    SingleWebsiteView = Backbone.View.extend({
        el: $("#site-settings"), 

        events: {
            // FIXME try to rework it through form.submit event
            "click #site-info-submit": function(e){
                var form = $(e.target).parents("form").serializeForms()
                var model = Websites.where({_id: websiteId(getHash().replace(/#!/gi,''))})[0]
                model.save(form)
            }
        },

        initialize: function(){
            // When the session gets destroyed, the row will be destroyed too
            _.bindAll(this, 'reseted', 'addRow', 'deleteRow', 'render');

            this.model.bind("add", this.addRow);
            this.model.bind("remove", this.deleteRow);
            this.model.bind("reset", this.reseted);
            this.model.bind("change", this.render);
        },

        render: function(){
            console.log("render", this)
            // FIXME complete render
        },

        addRow: function(model){
            var hash = getHash().replace(/#!/g,'')
            var model_id = model.id.split(":");
            var name = model_id[1];

            // making li active
            if(name === hash){
                // setting values if current row is selected website
                $(this.el).find("[name=name]").val(hash)
                $(this.el).find("[name=description]").val(model.get("description"))
                $(this.el).find("[name=time-zone]").val(model.get("time-zone"))
            }
        },

        deleteRow: function(model){
            var model_id = model.id.split(":");
            var name = model_id[1];
            $("#site-manager-dropdown li > a[href$='" + getHash(name) + "']").parent().remove();

        },
        reseted: function(model){
            $("#dropdown li.divider:first").prevAll().remove();
            model.each(this.addRow);
        }
    });

  
})