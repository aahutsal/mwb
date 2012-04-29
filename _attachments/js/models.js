// trying to dynamically determine dbname and ddoc
var path = unescape(document.location.pathname).split('/');
//var ddoc = path[3], dbname = path[1]
var ddoc = 'mwb', dbname = 'mwb'

$(function(){

    // `ddoc_name` is the name of your couchapp project.
    Backbone.couch_connector.config.db_name = dbname;
    Backbone.couch_connector.config.ddoc_name = ddoc;

    // If set to true, the connector will listen to the changes feed
    // and will provide your models with real time remote updates.
    // But in this case we enable the changes feed for each Collection on our own.
    Backbone.couch_connector.config.global_changes = false;

    
    // websites
    WebsiteModel = Backbone.Model.extend({});
    // request models
    RequestModel =  Backbone.Model.extend({});
    ServiceRequestModel = RequestModel.extend({});
    TestimonialRequestModel = RequestModel.extend({});

    WebsiteCollection = Backbone.Collection.extend({
        db : {
            changes : true
        },
        url : function(){
            return String.format("/com.scanshowsell.website:{0}", username)
        },
        model : WebsiteModel
    });

    RequestModelCollection = Backbone.Collection.extend({
        db : {
            changes : true
        },
        url: function(){
            return String.format("/com.scanshowsell.request:{0}", username)
        }
    });

    //ServiceRequestCollection = new RequestModelCollection({model: ServiceRequestModel})
    //TestimonialRequestCollection = new RequestModelCollection({model: TestimonialRequestModel})

})