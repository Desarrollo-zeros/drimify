<?php


namespace App\Http\Controllers;


use App\Models\Factura;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FacturacionController
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }


    public function store(Request $request, Factura $factura){
        $data = [
            "primerNombre" => $request->post("primerNombre"),
            "primerApellido" => $request->post("primerApellido"),
            "nit" => $request->post("nit"),
            "razonSocial" => $request->post("razonSocial"),
            "idFactura" => $request->post("idFactura"),
            "sessionId" =>  $request->post("sessionId"),
            "data" => json_encode($request->post("data")),
        ];
        return $factura->saveJuegoFactura($data);
    }

    public function getBy(Request $request, Factura $factura){
        $valid = $factura->findByFactura($request->post("numeroFactura"));
        $data = [];

        $message = "Error, numero de facturacion y/o nit incorrecto";

        if($factura->valid($valid)){
            $message = "Factura Correcta, cargando ....";

            $name = $request->post("name");

            $pName = explode(" ",$name);

            $juego_factura = $factura->findByJuegoFactura($valid->id);
            $isExist = $factura->valid($juego_factura);
            $data = [
                "primerNombre" =>$pName[0],
                "primerApellido" => $pName[1],
                "nit" => $request->post("nit"),
                "razonSocial" => $request->post("razonSocial"),
                "idFactura" => $valid->id,
            ];
            if($isExist){
                $message = "Error, Factura en uso";
                $valid = null;
            }
        }

        return [
            "facturacion" => $valid,
            "success" => isset($valid),
            "message" => $message,
            $data
        ];
    }

}
