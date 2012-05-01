function(doc, req) {
    var script = "document.couchdb_context = " + JSON.stringify({dbname: req.path[0], ddoc: req.path[2]})
        
    send(script)
}