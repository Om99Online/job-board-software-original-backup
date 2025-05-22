<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use App\Models\Admin;

class ConfigurationController extends Controller
{
    public function changeUsername(Request $request):Response{

        $request->validator([
            'new_username' => 'required|unique:Admin',
            'conf_username' => 'required',
        ]);


        if(trim($request->new_username) != trim($request->conf_username)){
            return Response(['responce'=>'New Username And Confirm Username Should be Match' , 'status'=>500],200);
        }else{

            //Admin::update()

            return Response(['responce'=>'Admin Username Updated Successfully' , 'status'=> 200],200);
        }
    }

    public function GetSecurityQuestion():Response{

        //session id
        $id=1;


        // Admin::whereId($id)->

    }

}
