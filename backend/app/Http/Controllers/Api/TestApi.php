<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TestApi extends Controller
{
    public function storeUsersData(Request $request):Response
    {
        DB::table('user')->insert([
            'name'=>$request->name,
            'email'=>$request->email,
            'address'=>$request->address
        ]);

        return Response(['Message'=>'Data Inserted'],200);
    }

    public function getUsersData(){
        $data=DB::table('user')->get();

        return Response(['data'=>$data],200);
    }
}
