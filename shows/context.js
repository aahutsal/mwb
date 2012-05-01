function(doc, req) {
    var script = "document.couchapp_context = " + JSON.stringify({dbname: req.path[0], ddoc: req.path[2]})
        
    send(script)
}