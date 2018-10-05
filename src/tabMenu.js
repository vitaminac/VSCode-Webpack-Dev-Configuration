/* @author sgao 20180918 ITS@3755 collapsar todas las opciones de pestaña en una sola linea */
function initializeWindowsMenuPlugin($) {
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
                        $(nav_tabs).css("transform",
                            "translateX(" + -lastOffset + "px)");
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

    (function ($) {
        'use strict';

        // TOGGLE PUBLIC CLASS DEFINITION
        // ==============================

        var Toggle = function (element, options) {
            this.$element = $(element)
            this.options = $.extend({}, this.defaults(), options)
            this.render()
        }

        Toggle.DEFAULTS = {
            on: 'On',
            off: 'Off',
            onstyle: 'primary',
            offstyle: 'default',
            size: 'normal',
            style: '',
            width: null,
            height: null
        }

        Toggle.prototype.defaults = function () {
            return {
                on: this.$element.attr('data-on') || Toggle.DEFAULTS.on,
                off: this.$element.attr('data-off') || Toggle.DEFAULTS.off,
                onstyle: this.$element.attr('data-onstyle')
                    || Toggle.DEFAULTS.onstyle,
                offstyle: this.$element.attr('data-offstyle')
                    || Toggle.DEFAULTS.offstyle,
                size: this.$element.attr('data-size') || Toggle.DEFAULTS.size,
                style: this.$element.attr('data-style')
                    || Toggle.DEFAULTS.style,
                width: this.$element.attr('data-width')
                    || Toggle.DEFAULTS.width,
                height: this.$element.attr('data-height')
                    || Toggle.DEFAULTS.height
            }
        }

        Toggle.prototype.render = function () {
            this._onstyle = 'btn-' + this.options.onstyle
            this._offstyle = 'btn-' + this.options.offstyle
            var size = this.options.size === 'large' ? 'btn-large'
                : this.options.size === 'small' ? 'btn-small'
                    : this.options.size === 'mini' ? 'btn-mini' : ''
            var $toggleOn = $('<label class="btn">').html(this.options.on)
                .addClass(this._onstyle + ' ' + size)
            var $toggleOff = $('<label class="btn">').html(this.options.off)
                .addClass(this._offstyle + ' ' + size + ' active')
            var $toggleHandle = $(
                '<span class="toggle-handle btn btn-default">').addClass(
                    size)
            var $toggleGroup = $('<div class="toggle-group">').append(
                $toggleOn, $toggleOff, $toggleHandle)
            var $toggle = $('<div class="toggle btn" data-toggle="toggle">')
                .addClass(
                    this.$element.prop('checked') ? this._onstyle
                        : this._offstyle + ' off').addClass(size)
                .addClass(this.options.style)

            this.$element.wrap($toggle)
            $.extend(this, {
                $toggle: this.$element.parent(),
                $toggleOn: $toggleOn,
                $toggleOff: $toggleOff,
                $toggleGroup: $toggleGroup
            })
            this.$toggle.append($toggleGroup)

            var width = this.options.width
                || Math.max($toggleOn.width(), $toggleOff.width())
                + ($toggleHandle.outerWidth() / 2)
            var height = this.options.height
                || Math.max($toggleOn.height(), $toggleOff.height())
            $toggleOn.addClass('toggle-on')
            $toggleOff.addClass('toggle-off')
            this.$toggle.css({
                width: width,
                height: height
            })
            if (this.options.height) {
                $toggleOn.css('line-height', $toggleOn.height() + 'px')
                $toggleOff.css('line-height', $toggleOff.height() + 'px')
            }
            this.update(true)
            this.trigger(true)
        }

        Toggle.prototype.toggle = function () {
            if (this.$element.prop('checked'))
                this.off()
            else
                this.on()
        }

        Toggle.prototype.on = function (silent) {
            if (this.$element.prop('disabled'))
                return false
            this.$toggle.removeClass(this._offstyle + ' off').addClass(
                this._onstyle)
            this.$element.prop('checked', true)
            if (!silent)
                this.trigger()
        }

        Toggle.prototype.off = function (silent) {
            if (this.$element.prop('disabled'))
                return false
            this.$toggle.removeClass(this._onstyle).addClass(
                this._offstyle + ' off')
            this.$element.prop('checked', false)
            if (!silent)
                this.trigger()
        }

        Toggle.prototype.enable = function () {
            this.$toggle.removeAttr('disabled')
            this.$element.prop('disabled', false)
        }

        Toggle.prototype.disable = function () {
            this.$toggle.attr('disabled', 'disabled')
            this.$element.prop('disabled', true)
        }

        Toggle.prototype.update = function (silent) {
            if (this.$element.prop('disabled'))
                this.disable()
            else
                this.enable()
            if (this.$element.prop('checked'))
                this.on(silent)
            else
                this.off(silent)
        }

        Toggle.prototype.trigger = function (silent) {
            this.$element.off('change.bs.toggle')
            if (!silent)
                this.$element.change()
            this.$element.on('change.bs.toggle', $.proxy(function () {
                this.update()
            }, this))
            applyCSS();
        }

        Toggle.prototype.destroy = function () {
            this.$element.off('change.bs.toggle')
            this.$toggleGroup.remove()
            this.$element.removeData('bs.toggle')
            this.$element.unwrap()
        }

        // TOGGLE PLUGIN DEFINITION
        // ========================

        function Plugin(option) {
            return this.each(function () {
                var $this = $(this)
                var data = $this.data('bs.toggle')
                var options = typeof option == 'object' && option

                if (!data)
                    $this.data('bs.toggle', (data = new Toggle(this, options)))
                if (typeof option == 'string' && data[option])
                    data[option]()
                applyCSS();
            })
        }

        var old = $.fn.bootstrapToggle

        $.fn.bootstrapToggle = Plugin
        $.fn.bootstrapToggle.Constructor = Toggle

        // TOGGLE NO CONFLICT
        // ==================

        $.fn.toggle.noConflict = function () {
            $.fn.bootstrapToggle = old
            return this
        }

        function applyCSS() {
            $('.checkbox label .toggle,.checkbox-inline .toggle').css({
                'margin-left': '-20px',
                'margin-right': '5px'
            });

            $('.toggle').css({
                'position': 'relative',
                'overflow': 'hidden'
            });

            $('.toggle input[type="checkbox"]').css({
                'display': 'none'
            });

            $('.toggle-group').css({
                'position': 'absolute',
                'width': '200%',
                'top': '0',
                'bottom': '0',
                'left': '0',
                'transition': 'left 0.35s',
                '-webkit-transition': 'left 0.35s',
                '-moz-user-select': 'none',
                '-webkit-user-select': 'none'
            });

            $('.toggle.off .toggle-group').css({
                'left': '-100%'
            });

            $('.toggle-on').css({
                'position': 'absolute',
                'top': '0',
                'bottom': '0',
                'left': '0',
                'right': '50%',
                'margin': '0',
                'border': '0',
                'border-radius': '0'
            });

            $('.toggle-off').css({
                'position': 'absolute',
                'top': '0',
                'bottom': '0',
                'left': '50%',
                'right': '0',
                'margin': '0',
                'border': '0',
                'border-radius': '0'
            });

            $('.toggle-handle').css({
                'position': 'relative',
                'margin': '0 auto',
                'padding-top': '0px',
                'padding-bottom': '0px',
                'height': '100%',
                'width': '0px',
                'border-width': '0 1px'
            });

            $('.toggle.btn').css({
                'min-width': '59px',
                'min-height': '34px'
            });

            $('.toggle-on.btn').css({
                'padding-right': '24px'
            });

            $('.toggle-off.btn').css({
                'padding-left': '24px'
            });

            $('.toggle.btn-lg').css({
                'min-width': '79px',
                'min-height': '45px'
            });

            $('.toggle-on.btn-lg').css({
                'padding-right': '31px'
            });

            $('.toggle-off.btn-lg').css({
                'padding-left': '31px'
            });

            $('.toggle-handle.btn-lg').css({
                'width': '40px'
            });

            $('.toggle.btn-sm').css({
                'min-width': '50px',
                'min-height': '30px'
            });

            $('.toggle-on.btn-sm').css({
                'padding-right': '20px'
            });

            $('.toggle-off.btn-sm').css({
                'padding-left': '20px'
            });

            $('.toggle.btn-xs').css({
                'min-width': '35px',
                'min-height': '22px'
            });

            $('.toggle-on.btn-xs').css({
                'padding-right': '12px'
            });

            $('.toggle-off.btn-xs').css({
                'padding-left': '12px'
            });
        }

        // TOGGLE DATA-API
        // ===============

        $(function () {
            $('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();
        })

        $(document).on('click.bs.toggle', 'div[data-toggle^=toggle]',
            function (e) {
                var $checkbox = $(this).find('input[type=checkbox]');
                $checkbox.bootstrapToggle('toggle');
                e.preventDefault()
            })

        function createTemplete(content, callback, show, hide, isHidden) {
            var label = $('<label></label>');
            label.text(content);
            var link = $('<a href="#" class="pull-left"/>');
            $(link).click(function (event) {
                callback();
                // para evitar # al final de url
                event.preventDefault();
            });
            var submenu = $('<li class="dropdown-submenu container" style="width:400px; padding-top: 5px;"></li>');
            $(link).append(label);
            $(submenu).append(link);
            var toggle = $('<input type="checkbox">');
            $(toggle).prop('checked', !isHidden).change();
            $(toggle).change(
                function () {
                    if ($(this).is(':checked')) {
                        show();
                    } else {
                        hide();
                    }
                });
            $(submenu).append(toggle);
            $(toggle).bootstrapToggle({
                style: "pull-right"
            });
            return submenu;
        }
        var TAB_MENU_ID = "tabs_menu";



        $.fn.makeMenu = function (backendApi, list) {
            var container = this[0];
            var dropdown = $('<div class="dropdown pull-right" style = "position: absolute; right: 0px; bottom: 5px; display: inline; background: white;"><a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="hiddenTabs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="fa fa-chevron-down"></i></a><div class="dropdown-menu" aria-labelledby="hiddenTabs" id=' + TAB_MENU_ID + '></div></div>');
            $(container).append(dropdown);
            var anchor = undefined;
            function calculateMaxAvailableWidth() {
                var width = container.clientWidth - dropdown.outerWidth();
                return anchor ? width - $(anchor).outerWidth() : width
            }
            var nav_tabs_bar = $(container).children(".nav-tabs");
            var nav_tabs = nav_tabs_bar.children();
            var hiddenTabsSet = new Set(list);

            var toggleOptions = $('<i class="fa fa-cog"></i>');
            toggleOptions.css({
                "margin-left": "5px",
                "padding": "5px"
            });
            $("#" + TAB_MENU_ID).append(toggleOptions);

            function reRenderTabs() {
                var availableWidth = calculateMaxAvailableWidth();
                nav_tabs.each(function (index, element) {
                    var tabId = $(element).find("a").attr("href");
                    $(element).show();
                    if (hiddenTabsSet.has(tabId)) {
                        $(element).hide();
                    } else if (availableWidth < element.clientWidth) {
                        availableWidth = 0;
                        $(element).hide();
                    } else {
                        availableWidth -= element.clientWidth;
                    }
                });
            }

            nav_tabs.each(function (index, element) {
                var tabId = $(element).find("a").attr("href");

                function listner() {
                    if (anchor) {
                        $(anchor).remove();
                    }
                    if ($(element).is(":hidden")) {
                        anchor = $(element).clone();
                        $(anchor).css({
                            "float": "right",
                            "right": $(dropdown).outerWidth() + "px"
                        });
                        nav_tabs_bar.append(anchor);
                        if (anchor) {
                            $(anchor).show();
                            $(anchor).click();
                            $(anchor).children().click();
                            $(anchor).children().tab("show");
                        }
                    } else {
                        // buscar la forma de saber que la pestaña está activa y mostrarlo en su propio sitio
                        $(element).click();
                        $(element).children().click();
                        $(element).children().tab("show");
                    }
                    reRenderTabs();
                }
                var submenuTemplate = $(createTemplete($(element).text(), listner, function () {
                    hiddenTabsSet.delete(tabId);
                    reRenderTabs();
                    backendApi.show(tabId);
                }, function () {
                    hiddenTabsSet.add(tabId);
                    reRenderTabs();
                    backendApi.hide(tabId);
                }, hiddenTabsSet.has(tabId)));
                if (hiddenTabsSet.has(tabId)) {
                    submenuTemplate.click();
                }
                $("#" + TAB_MENU_ID).append(submenuTemplate);
            });

            reRenderTabs();

            // el ultimo elemento tiene css muy raro, solucion agrega primero y luego elimina
            applyCSS();

            $(".toggle").hide();

            $(toggleOptions).click(function () {
                if ($(".toggle").is(":hidden")) {
                    $(".toggle").show();
                    $(this).css("color", "red");
                } else {
                    $(".toggle").hide();
                    $(this).css("color", "");
                }
            });

            $(window).resize(function () {
                reRenderTabs();
            });

            $(document).on('click', '#' + TAB_MENU_ID + '.dropdown-menu', function (e) {
                e.stopPropagation();
                return false;
            });
        }
    })($);
}