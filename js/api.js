var drimifyWidget;


var urlApi = "http://localhost/prueba/Api/index.php/";



function disabledPage() {
    eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(3(){(3 a(){8{(3 b(2){7((\'\'+(2/2)).6!==1||2%5===0){(3(){}).9(\'4\')()}c{4}b(++2)})(0)}d(e){g(a,f)}})()})();',17,17,'||i|function|debugger|20|length|if|try|constructor|||else|catch||5000|setTimeout'.split('|'),0,{}))
}




window.addEventListener("load", function () {





    //disabledPage();
    localStorage.validInput = null;




    drimifyWidget = new Drimify.Widget({
            autofocus: true,
            height: "600px",
            element: "drimify-container",
            engine: "https://go.drimify.com/scratch/42842/app.html?projectid=1205077412610ecfeb9bbf2267248130-610ecfeb9bbf6&lang=es",
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
            sendPost(url, factura, function (response){
                console.log(response)
            });
        }
    };

    drimifyWidget.onReady = function (data) {
        window.addEventListener("message", function (ev) {
            drimifyWidget.openModal = function (){
                if (localStorage.validInput != "1") {
                    $("#ModalForm").modal({backdrop: 'static', keyboard: true});
                    $("#quiz-container-iframe").removeClass("quiz-container-iframe");
                }
            };


            drimifyWidget.validForm = function (){
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
            }



            drimifyWidget.processSuccessFind = function (response){
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
                        $("#ModalForm").modal("hide");
                    }, 500);

                }else{

                    $("#quiz-container-iframe").removeClass("quiz-container-iframe");

                    $("#alertMessage")
                        .html(response.message)
                        .removeClass("alert-success")
                        .addClass("alert-danger")
                        .show();

                }
            };

            drimifyWidget.onclickApiFinBy = function (event) {
                event.preventDefault();
                var url = urlApi+'facturacion';
                var data = {
                    name: $("#names").val(),
                    razonSocial : $("#razon_social").val(),
                    nit : $("#nit").val(),
                    numeroFactura : $("#numero_factura").val(),
                };
                sendPost(url, data, drimifyWidget.processSuccessFind);
            };





            if (ev.data.includes("scrollToOffset") || ev.data == "scrollup") {
                drimifyWidget.openModal();
                $("#ModalForm").on("hidden.bs.modal", function () {
                    $("#quiz-container-iframe").addClass("quiz-container-iframe");
                    drimifyWidget.openModal();
                });
                drimifyWidget.validForm();

            }
        });


    };
});


function sendPost(url,data, callback = null, errorBack = null){

    fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .catch(error => {
            if(errorBack){
                errorBack(error);
            }
        })
        .then(response => {
            if(callback){
                callback(response)
            }
        });

}

