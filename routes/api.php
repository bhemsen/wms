<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\ShoppingListController;
use App\Http\Controllers\UserCategoriesController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
});

Route::resource('products', ProductController::class);
Route::get('products/search/{name}', [ProductController::class, 'search']);
Route::get('user/products/{user_id}/', [ProductController::class, 'indexByUser']);
Route::get('user/shoppinglist/products/{user_id}/', [ProductController::class, 'shoppingListByUser']);


Route::resource('categories', CategoryController::class);
Route::resource('stock', StockController::class);
Route::delete('/stock/{product_id}/{amount}/{userId}', [StockController::class, 'destroy']);

Route::resource('shoppinglist', ShoppingListController::class);
Route::delete('shoppinglist/{product_id}/{amount}/{userId}', [ShoppingListController::class, 'destroy']);


Route::get('session', [ShoppingListController::class, 'index']);

Route::resource('user/categories', UserCategoriesController::class);
Route::delete('user/categories/{category_id}', [UserCategoriesController::class, 'destroy']);

