<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('example', function () use ($router) {
    return \Illuminate\Support\Facades\DB::table("factura")->get();
});

$router->get('facturacion', 'FacturacionController@index');
$router->post('facturacion', 'FacturacionController@getBy');
$router->post('facturacion/save', 'FacturacionController@store');
