<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Product;
use App\Models\Category;
use App\Models\Stock;

use Validator;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(
            DB::table('products')
                ->leftJoin('categories as c','c.id', '=', 'products.category_id')
                ->rightJoin('stocks as s','s.product_id', '=', 'products.id')
                ->selectRaw('products.id as id, products.name as name, c.name as category_name, count(s.product_id) as count')
                ->groupBy('products.id')
                ->orderBy('products.name', 'asc')
                ->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request -> all(),[
            "name" => "required|string|max:255",
            "category_id" => "integer|min:1|nullable",
        ]);
        if($validator -> fails()){
            return response()->json($validator->errors(), 422);
        } else {
            $q = Product::firstOrCreate($validator->validated());
            return response()->json([
                "message"=>"product created",
                "product" => $q
            ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Product::find($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $new_category_id)
    {
        $user_id = auth()->user()->id;

        $product = $request->product;

        $newProduct = Product::firstOrCreate(['name' => $product['name'], 'category_id' =>$new_category_id]);

        Stock::where('user_id', $user_id)
            ->where('product_id', $product['id'])
            ->update(['product_id'=>$newProduct->id]);

        return response()->json($newProduct);
    }

    /**
     * search for name
     *
     *
     * @param  str  $name
     * @return \Illuminate\Http\Response
     */
    public function search($name)
    {
        $user_id = auth()->user()->id;

        $res = DB::select(DB::raw(
            "
            select p.id as id, p.name as name,  uc.category_id as category_id, c.name as category_name from products as p
	            left join user_categories as uc 
		            on p.category_id = uc.category_id
	            left join categories as c 
		            on c.id = uc.category_id
	            where (p.category_id in (
		            select uc.category_id 
		            from user_categories as uc 
			            where uc.user_id = ".$user_id.") 
                        	or p.category_id is null) 
                            and p.name like '%".$name."%'"
                ));

        return $res;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Product::destroy($id);
    }

    public function indexByUser($user_id)
    {
        return response()->json(
            DB::table('products')
                ->leftJoin('categories as c','c.id', '=', 'products.category_id')
                ->join('stocks as s', function ($join) use($user_id) {
                    $join->on('s.product_id', '=', 'products.id')
                         ->where('s.user_id', '=', $user_id);
                })
                ->selectRaw('products.id as id, products.name as name, c.name as category_name, c.id as category_id, count(s.product_id) as count')
                ->groupBy('products.id')
                ->orderBy('products.name', 'asc')
                ->get());
    }

    public function shoppingListByUser($user_id)
    {
        return response()->json(
            DB::table('products')
                ->leftJoin('categories as c','c.id', '=', 'products.category_id')
                ->join('shopping_lists as s', function ($join) use($user_id) {
                    $join->on('s.product_id', '=', 'products.id')
                         ->where('s.user_id', '=', $user_id);
                })
                ->selectRaw('products.id as id, products.name as name, c.name as category_name, c.id as category_id, count(s.product_id) as count')
                ->groupBy('products.id')
                ->orderBy('products.name', 'asc')
                ->get());
    }
}
