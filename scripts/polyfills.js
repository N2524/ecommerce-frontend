/**
 * JavaScript Polyfills for older browser compatibility
 * This file provides fallbacks for modern JavaScript features
 */

// Object.entries polyfill for older browsers
if (!Object.entries) {
    Object.entries = function(obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i);
        while (i--) {
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        }
        return resArray;
    };
}

// Array.prototype.find polyfill for older browsers
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var thisArg = arguments[1];
            var k = 0;
            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                k++;
            }
            return undefined;
        }
    });
}

// String.prototype.includes polyfill for older browsers
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

// Element.closest polyfill for older browsers
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Element.matches polyfill for older browsers
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

// Promise polyfill check - if not available, we'll load it from CDN
if (typeof Promise === 'undefined') {
    console.warn('Promise not supported in this browser. Some features may not work correctly.');
}

// localStorage availability check
(function() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    } catch (e) {
        console.warn('localStorage is not available. Cart functionality will be limited to current session.');
        window.localStorage = {
            _data: {},
            setItem: function(id, val) {
                this._data[id] = String(val);
                return this._data[id];
            },
            getItem: function(id) {
                return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
            },
            removeItem: function(id) {
                return delete this._data[id];
            },
            clear: function() {
                this._data = {};
            }
        };
    }
})();

// URLSearchParams polyfill for older browsers
if (!window.URLSearchParams) {
    window.URLSearchParams = function(searchString) {
        var self = this;
        self.params = {};
        
        if (searchString) {
            if (searchString.charAt(0) === '?') {
                searchString = searchString.substr(1);
            }
            
            var pairs = searchString.replace(/\+/g, ' ').split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                self.params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
        }
        
        this.get = function(name) {
            return self.params[name] || null;
        };
    };
}

console.log('Polyfills loaded successfully');
