define(function () {
    return {
        host: function (component, element) {
            $(element).html(component.html());
        }
    }
});