/* collapsar todas las opciones de pestaña en una sola linea */
(function ($) {
    $.fn.scrollTab = function () {
        var container = this[0];
        $(container).css("overflow-x", "hidden");
        var nav_tabs = $(container).children(".nav-tabs")[0];
        $(nav_tabs).css({
            "display": "inline-flex",
            "flex-wrap": "nowrap"
        });
        function buildScroller() {
            var totalWidth = nav_tabs.scrollWidth;
            var containerWidth = container.clientWidth;
            var halfWidth = containerWidth / 2;
            var lastOffset = nav_tabs.offsetLeft;
            return function () {
                if (totalWidth > containerWidth) {
                    var newOffset = this.offsetLeft - nav_tabs.offsetLeft;
                    if (newOffset < halfWidth) {
                        lastOffset = nav_tabs.offsetLeft;
                    } else if (newOffset < lastOffset) {
                        lastOffset = newOffset - halfWidth;
                    } else if ((newOffset + halfWidth) > totalWidth) {
                        lastOffset = totalWidth - containerWidth;
                    } else {
                        lastOffset = newOffset - halfWidth;
                    }
                    // sgao 20180918 tambien se puede usar JQuery.scrollLeft
                    $(nav_tabs).css("transform", "translateX(" + -lastOffset + "px)");
                }
            }
        }

        var initScroll = (function () {
            var scroll;
            return function () {
                $(nav_tabs).children().each(function (index, element) {
                    $(element).off("click", scroll);
                });
                scroll = buildScroller();
                $(nav_tabs).children().each(function (index, element) {
                    $(element).click(scroll);
                });
            }
        })();

        $(window).resize(initScroll);
        initScroll();
    }
}($));