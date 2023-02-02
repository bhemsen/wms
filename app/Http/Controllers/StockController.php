<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;



class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        // 
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $arr = array();
        $count = $request->input('count');
        for ($i = 0; $i < $count; $i++) {
            $temp = [
                "product_id" => $request->input('product_id'),
                "mhd"=> '',
                "user_id" => $request->input('user_id')
            ];
            array_push($arr, $temp);
        }
        $q = Stock::insert($arr);
        return response()->json([
            "message"=>"added to stock",
        ], 201);

        // return response()->json($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return response()->json(
            Stock::where('product_id','=',$id)->count());
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
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, $amount, $userId)
    {
        if ( auth()->user()->id != $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return response()->json(
            Stock::where([
                ['product_id',$id],
                ['user_id',$userId],
                ])
                ->limit($amount)
                ->delete()
        );
    }
}
