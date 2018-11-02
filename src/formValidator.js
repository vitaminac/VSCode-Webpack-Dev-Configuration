// un validor de formulario escrito para compatibilizar con jsf
// se puede usar con bootstrap 3 en el futuro
$(document).ready(function () {
    $(".validate").each(function (index, form) {
        function validate() {
            return form.checkValidity() === true;
        }

        var submit = $(form).find(":submit")[0];
        var action = submit.onclick;
        submit.onclick = function (event) {
            if (validate()) {
                action(event);
            } else {
                event.preventDefault();
                event.stopPropagation();
                alert("no valido");
                return false;
            }
        }

        // habilitar el atributo de required
        $(form).find(".required").each(function (index, input) {
            $(input).attr("required", true);
        });
    });
});
