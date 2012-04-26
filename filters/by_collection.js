function(doc, req){
    // we don't do any checks here, as document ID is apparently in form <TYPE>:<USER_NAME>:<WEBSITE_NAME>
    var docId = doc._id.split(':');
    var type = docId[0];
    if(req.query && req.query.collection && req.query.collection == [type, req.userCtx.name].join(":")){
        return true;
    } else {
        // do nothing
        return false;
    }
}