String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}

$.collect = function(c, f) {
    var a = [];
    $.each(c, function(k, v) {
        a.push(f(k, v));
    });
    return a;
};

// friendly helper http://tinyurl.com/6aow6yn
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
    validLabels = /^(data|css):/,
    attr = {
        method: matchParams[0].match(validLabels) ? 
            matchParams[0].split(':')[0] : 'attr',
        property: matchParams.shift().replace(validLabels,'')
    },
    regexFlags = 'ig',
    regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}
var matcher = /\s*(?:((?:(?:\\\.|[^.,])+\.?)+)\s*([!~><=]=|[><])\s*("|')?((?:\\\3|.)*?)\3|(.+?))\s*(?:,|$)/g;

function resolve(element, data) {

    data = data.match(/(?:\\\.|[^.])+(?=\.|$)/g);

    var cur = jQuery.data(element)[data.shift()];

    while (cur && data[0]) {
        cur = cur[data.shift()];
    }

    return cur || undefined;

}

$.expr[':'].data = function(el, i, match) {

    matcher.lastIndex = 0;

    var expr = match[3],
    m,
    check, val,
    allMatch = null,
    foundMatch = false;

    while (m = matcher.exec(expr)) {

        check = m[4];
        val = resolve(el, m[1] || m[5]);

        switch (m[2]) {
        case '==': foundMatch = val == check; break;
        case '!=': foundMatch = val != check; break;
        case '<=': foundMatch = val <= check; break;
        case '>=': foundMatch = val >= check; break;
        case '~=': foundMatch = RegExp(check).test(val); break;
        case '>': foundMatch = val > check; break;
        case '<': foundMatch = val < check; break;
        default: if (m[5]) foundMatch = !!val;
        }

        allMatch = allMatch === null ? foundMatch : allMatch && foundMatch;

    }

    return allMatch;

};

