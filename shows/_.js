function(doc, req) {
    // !json template
    // !code vendor/couchapp/lib/underscore.js

    // if user is not found,
    // redirecting to manage.html
    /*
    if((req.userCtx.name == null) && (req.path[req.path.length - 2] != 'mwb'))
        return {
            code : 302, // temporarily
            headers : {
                "Location" : "/mwb/manage.html"
            }
        };
        */
    _ = this._
    // Enables Mustache.js-like templating.    
     _.templateSettings = {
         interpolate : /\{\{(.+?)\}\}/g
     };

    var path = _.rest(req.path, req.path.indexOf('_') + 1)
    
    // replacing the last element .html suffix
    var requestedFile = path.pop().replace(/\.html/,'')

    var sidebar_mode = (requestedFile == 'wizard'?'wizard-sidebar':'sidebar')


    var lookupContext = function(path){
        var file = template
        _.each(path, function(it) { file = file[it] });
        return file;
    }

    var context = lookupContext(path)

    processTemplate = function(t){
        var callback = _.template(t)
        return callback({file: context[requestedFile], context: context, processTemplate: processTemplate, template: template, sidebar: template.user[sidebar_mode] })
    }

    send(processTemplate(context['_']))
}