var drimifyWidget;


var urlApi = "http://localhost/prueba/Api/index.php/";


window.addEventListener("load", function () {




    drimifyWidget = new Drimify.Widget({
            autofocus: true,
            height: "600px",
            element: "drimify-container",
            engine: "https://go.drimify.com/slotmachine/15/app.html?projectid=1881505005bbf7b03b90ee773577123-5bbf7b03b9148&lang=es",
            style: "border:0px solid #d1d1d1;"
        }
    );
    drimifyWidget.load();

    drimifyWidget.onCompletion = function (data) {

        if(localStorage.juegoFactura){
            let factura = JSON.parse(localStorage.juegoFactura);
            factura.sessionId = data.credientials.sessionID
            factura.data = data;
            localStorage.juegoFactura = JSON.stringify(factura);

            localStorage.validInput = null;

            var url = urlApi+'facturacion/save';
            fetch(url, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(factura), // data can be `string` or {object}!
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    console.log(response)
                    if (response.success) {
                    }else{
                    }
                });



        }
    };

    drimifyWidget.onReady = function (data) {
        window.addEventListener("message", function (ev) {
            if (ev.data == "scrollup") {

                if (localStorage.validInput != "1") {
                    $("#exampleModal").modal({backdrop: 'static', keyboard: true});
                }

                $("#exampleModal").on("hidden.bs.modal", function () {
                    if (localStorage.validInput != "1") {
                        $("#exampleModal").modal({backdrop: 'static', keyboard: true});
                    }
                });


                var forms = document.getElementsByClassName('needs-validation');
                // Loop over them and prevent submission
                var validation = Array.prototype.filter.call(forms, function(form) {
                    form.addEventListener('submit', function(event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                            form.classList.add('was-validated');
                        }else{
                            drimifyWidget.onclickApiFinBy(event);
                        }
                    }, false);
                });



                drimifyWidget.onclickApiFinBy = function (event) {
                    event.preventDefault();
                    let nFactura = $("#numero_factura").val();
                    let nit = $("#nit").val();



                    var url = urlApi+'facturacion';
                    var data = {
                        name: $("#names").val(),
                        razonSocial : $("#razon_social").val(),
                        nit : $("#nit").val(),
                        numeroFactura : $("#numero_factura").val(),

                    };

                    fetch(url, {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(data), // data can be `string` or {object}!
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                        .catch(error => console.error('Error:', error))
                        .then(response => {

                            if (response.success) {
                                localStorage.validInput = 1;
                                localStorage.juegoFactura = JSON.stringify(response[0]);
                                $("#validInput").val(1);
                                $("#alertMessage")
                                    .removeClass("alert-danger")
                                    .addClass("alert-success")
                                    .html(response.message)
                                    .append("<div class=\"lds-dual-ring\"></div>")
                                    .show();

                                setTimeout(function () {
                                    $("#exampleModal").modal("hide");
                                }, 1000);

                            }else{
                                $("#alertMessage").html(response.message).show();

                            }
                        });


                };



            }
        });


    };
});