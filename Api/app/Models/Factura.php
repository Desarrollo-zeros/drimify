<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Factura extends Model
{
  public $table = "factura";

  public function saveJuegoFactura(array $data){
      $id = DB::table("juego_factura")->insertGetId($data);
      if(isset($id)){
          return $data;
      }
      return false;
  }


  public function findByFactura($factura){
      $data = Factura::where(["factura"=> $factura])->first();;
      return $data;
  }

  public function valid($data){
      return isset($data);
  }


    public function findByJuegoFactura($id){
        $data = DB::table("juego_factura")->where(["idFactura"=> $id])->first();
        return $data;
    }





}
