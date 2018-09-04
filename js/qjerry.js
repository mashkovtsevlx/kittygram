var qJerry = function (selector) {


    this.selector = selector || null;


    this.element = null;


};


qJerry.prototype.init = function () {


    switch (this.selector[0]) {


        case '<':


            var matches = this.selector.match(/<([\w-]*)>/);


            if (matches === null || matches === undefined) {


                throw 'Invalid Selector / Node';


                return false;


            }


            var nodeName = matches[0].replace('<', '').replace('>', '');


            this.element = document.createElement(nodeName);


            break;


        default:


            this.element = document.querySelector(this.selector);


    }


};


qJerry.prototype.toggleClass = function (name, selector) {

    this.element.classList.toggle(name);


}


qJerry.prototype.outerHeight = function (cond) {
    if (cond) {
        var height = this.element.offsetHeight;
        var style = getComputedStyle(this.element);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
    } else {
        return this.element.offsetHeight;
    }
}

qJerry.prototype.outerWidth = function (cond) {
    if (cond) {
        var width = this.element.offsetWidth;
        var style = getComputedStyle(this.element);
        width += parseInt(style.marginLeft) + parseInt(style.marginRight);
        return width;
    } else {
        return this.element.offsetWidth;
    }
}

qJerry.prototype.text = function (value) {

    if (!value) {

        return this.element.textContent;

    } else {

        this.element.textContent = value;

    }


}

qJerry.prototype.attr = function (prop, value) {

    if (!value) {

        return this.element.getAttribute(prop);

    } else {

        this.element.setAttribute(prop, value);

    }


}

qJerry.prototype.ready = function (fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

qJerry.prototype.css = function (prop, value) {

    if (!value) {

        return getComputedStyle(this.element)[prop];

    } else {

        this.element.style[prop] = value;

    }


}


qJerry.prototype.removeClass = function (className) {


    if (this.element.classList)


        this.element.classList.remove(className);


    else


        this.element.className = this.element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');


}


qJerry.prototype.val = function (value) {

    if (value) {

        this.element.value = value;

    } else {

        return (this.element.value)

    }


}


qJerry.prototype.prepend = function (value) {

    this.element.innerHTML = value + this.element.innerHTML;

}


qJerry.prototype.append = function (value) {

    this.element.innerHTML = this.element.innerHTML + value;

}


qJerry.prototype.toggleModal = function (modalName) {


    if (modalName) {


        this.toggleClass('hidden');


        $(modalName).toggleClass('hidden');


    } else {


        $('.modal-background').toggleClass('hidden');


        $('#modal').toggleClass('hidden');


        this.toggleClass('hidden');


        if ($('.menu__icon').css('display') == 'block' && $('.menu__links').css('display') == 'block')


            $('.menu').toggleClass('menu_state_open');


    }


}


qJerry.prototype.ajax = function (msgtype, location, params, sfun, efun, ffun, loading) {


    var query = '';


    for (var k in params) {


        if (typeof params[k] !== 'function') {


            query += k + '=' + params[k] + '&';


        }


    }


    query = query.substring(0, query.length - 1);


    var request = new XMLHttpRequest();


    request.open(msgtype, location, true);


    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    request.onload = function () {


        if (request.status >= 200 && request.status < 400) {


            if (sfun != 1)


                sfun(request);


        } else {


            if (efun == 1) {


                $('.modal-signup .modal-footer').element.innerHTML = '<span class="badge badge-danger">Error</span>';


                document.body.style.cursor = 'default';


            } else


                efun();


        }


    };


    request.onerror = function () {


        if (ffun == 1) {


            $('.modal-signup .modal-footer').element.innerHTML = '<span class="badge badge-danger">Error</span>';


            document.body.style.cursor = 'default';


        } else


            ffun();


    };


    if (loading == true)


        document.body.style.cursor = 'wait';


    request.send(query);


}


var $ = function (selector) {


    var el = new qJerry(selector);


    el.init();


    return el;


}