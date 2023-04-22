<?php

namespace App\Http\Controllers;

use App\Models\UserCategories;
use App\Models\Category;
use App\Models\Stock;
use App\Models\Product;

use Validator;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class UserCategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $id = auth()->user()->id;
        return DB::table('user_categories')->where('user_id', $id)
            ->leftJoin('categories as c','c.id', '=', 'user_categories.category_id')
            ->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public static function store($category_id)
    {
        $user_id = auth()->user()->id;
        $q = UserCategories::create(['user_id' => $user_id, 'category_id' => $category_id]);
        return response()->json([
            "message"=>"added category",
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request -> all(),[
            "name" => "required|string|max:255"
        ]);
        $user_id = auth()->user()->id;

        if($validator -> fails()){
            return response()->json($validator->errors(), 422);
        } else {
        
            $category = Category::firstOrCreate($validator->validated());

            $userCategory = UserCategories::firstOrCreate(['user_id' => $user_id, 'category_id' => $category->id]);

            $products = DB::table('products')
                ->select('products.id','products.name')
                ->join('stocks as s', function ($join) use($user_id) {
                    $join->on('s.product_id', '=', 'products.id')
                        ->where('s.user_id', '=', $user_id);})
                ->where('products.category_id', $id)
                ->distinct()
                ->get();
            

            $newProducts = [];
            foreach ($products as $p) {
                $np = Product::firstOrCreate(['name' => $p->name, 'category_id' =>$category->id]);
                array_push($newProducts, $np);
                Stock::where('user_id', $user_id)
                    ->where('product_id', $p->id)
                    ->update(['product_id'=>$np->id]);
            }

            UserCategories::where('user_id', $user_id)
                ->where('category_id', $id)
                ->delete();


            return response()->json([
                "message"=>"created new category and moved Products",
                "changed entities"=>[$category, $userCategory, $products, $newProducts]
            ], 201);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($category_id)
    {
        $user_id = auth()->user()->id;

        $products = DB::table('stocks')
        ->where('user_id', $user_id)
        ->distinct()
        ->leftJoin('products as p','p.id', '=', 'stocks.product_id')
        ->select('p.id', 'p.name')
        ->where('category_id', $category_id)
        ->get();

        foreach ($products as $p) {
            $entry = [
                'name' => $p->name,
                'category_id' => null
            ]; 
            $newProduct =  Product::firstOrCreate($entry);
            Stock::where('user_id', $user_id)
                ->where('product_id', $p->id)
                ->update([
                    'product_id' => $newProduct->id
                ]);
        }

        return UserCategories::where('category_id', $category_id)
            ->where('user_id', $user_id)
            ->delete();
    }
}
