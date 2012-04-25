function(doc, req) {
    // !json template
    // !code vendor/couchapp/lib/underscore.js

    var path = require("vendor/couchapp/lib/path").init(req);
    var redirect = require("vendor/couchapp/lib/redirect");

    // if user is not found,
    // redirecting to manage.html
    if((req.userCtx.name == null) && (req.path[req.path.length - 1] != 'manage.html'))
        return {
            code : 302, // temporarily
            headers : {
                "Location" : "manage.html"
            }
        };

        _ = this._
    // Enables Mustache.js-like templating.    
     _.templateSettings = {
         interpolate : /\{\{(.+?)\}\}/g
     };

    var tmpl = template[req.path[5]]
    var sidebar_mode = (req.path[6] == 'wizard.html'?'wizard-sidebar':'sidebar')

    processTemplate = function(fileName){
        var callback = _.template(tmpl[fileName])
        return callback({req: req, template: tmpl, processTemplate: processTemplate, sidebar_mode: sidebar_mode })
    }

  
    var index = _.template(tmpl['_'])

    send(index({ template: tmpl, file: req.path[6].replace(/\.html/,''), processTemplate: processTemplate  }))

}