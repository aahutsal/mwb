/*
 * jQuery File Upload Plugin JS Example 6.2
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global $, window, document */

$(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        autoUpload:true,
        //previewFileTypes: /\.(gif|jpg|png|svg|bmp)/,
        type: 'POST',
        singleFileUploads: false
    });


    var ddoc = document.couchapp_context.ddoc, dbname = document.couchapp_context.dbname

    $('#fileupload')
        .bind('fileuploadsubmit', function (e, data) {
            var wsId =  websiteId();
            $(data.form).attr("action", "/" + dbname +  "/" + encodeURIComponent(wsId))
            var ws = Websites.where({ _id: wsId })[0]
            data.formData = {_rev: ws.get("_rev")}
        })
        .bind('fileuploaddone', function(e, data) {
            var resp = JSON.parse(data.jqXHR.responseText)
            if(resp.ok){
                data.result = _.clone(data.files);
                $(data.result).each(function(idx, it){
                    it.thumbnail_url = $(data.form).attr("action") + "/" + it.name;
                })
            }
            // FIXME complete validation of Phot caption elements
        })

    // Load existing files:
    Websites.bind("reset", function(){
        var model = Websites.where({_id: websiteId()})
        if(model && model.length){
            model = model[0]
            var files = [];
            _.each(model.get("_attachments"),function(val, key){
                files.push({
                    thumbnail_url: "/" + dbname +  "/" + encodeURIComponent(model.id) + "/" + key,
                    name: key,
                    size: val.length,
                    type: val.content_type
                })
            });
            var fu = $('#fileupload').data('fileupload'),
            template;
            fu._adjustMaxNumberOfFiles(-files.length);
            template = fu._renderDownload(files)
                .appendTo($('#fileupload .files'));
            // Force reflow:
            fu._reflow = fu._transition && template.length &&
                template[0].offsetWidth;
            template.addClass('in');
        };

    })


    // Open download dialogs via iframes,
    // to prevent aborting current uploads:
    $('#fileupload .files').delegate(
        'a:not([rel^=gallery])',
        'click',
        function (e) {
            e.preventDefault();
            $('<iframe style="display:none;"></iframe>')
                .prop('src', this.href)
                .appendTo(document.body);
        }
    );

});
