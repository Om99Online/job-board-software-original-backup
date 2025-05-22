<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use Session;
use Validator;

use App\Models\User;
use App\Models\Alert;
use App\Models\Location;
use App\Models\Skill;


class AlertsController extends Controller
{
    public function index():Response {

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        // $isLogin = $this->userLoginCheck();
        // if(!empty($isLogin)){
        //     return Response(['response' => $isLogin ,'message' => 'User is not logged in' , 'status' => 500],200 );
        // }

        if(!$this->candidateAccess($userId)){
            return Response(['response' => 'Use is not type of canditate' ,'message'=>'Use is not type of canditate' , 'status' => 500 ],200);
        }

        // $user_id = Session::get('user_id');
        // $userdetail = User::whereId($userId)->get();
        // $data['userdetail'] = $userdetail;

        $alerts = Alert::where('user_id',$userId)
        ->orderBy('id','desc')
        ->get();


        $alert_array = array();
        foreach($alerts as $key => $alert){

            $alert_array[$key]['location'] = $alert->location;
            
            $designation = Skill::where('id',$alert->designation)
            ->where('type','Designation')
            ->pluck('name')
            ->implode(', ');

            $alert_array[$key]['designation'] = $designation;
            $alert_array[$key]['slug'] = $alert->slug;

        }

        $data['alerts'] = $alert_array;

        return Response(['response' => $data , 'message' => 'success' , 'status' => 200 ],200);
    } 
    
    public function add(Request $request):Response {

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->candidateAccess($userId)){
            return Response(['response' => 'Use is not type of canditate' ,'message'=>'Use is not type of canditate' , 'status' => 500 ],200);
        }

        $msgString = '';

        $userdetail = User::whereId($userId)->get();
        $data['userdetail'] = $userdetail;

        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['locationlList'] = $locationlList;

        $designationlList = Skill::where('status',1)
        ->where('type','Designation')
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['designationlList'] = $designationlList;

        if(!empty($request->all())){
            $rules = array(
                'location' => 'required',
                'designation' => 'required',
            );
    
            $validator = Validator::make($request->all() , $rules);
    
            $validator->setAttributeNames([
                'location' => 'Location',
                'designation' => 'Designation'
            ]);
    
            if($validator->fails()){
                $errors = $validator->errors();
    
                $msgString = $this->validatersErrorString($errors);
    
                return Response(['response' => '' ,'message'=>$msgString , 'status' => 500 ],200);
            }else{
                Alert::create([
                    'designation' => $request->designation,
                    'location' => $request->location,
                    'user_id' => $userId,
                    'status' => 1,
                    'slug' => 'ALERT' . time() . rand(10000, 999999),
                    'created' => now(),
                    'modified' => now(),
                ]);
    
                $msgString = 'You will receive an alert when jobs are created and match your criteria.';
    
                return Response(['response' => $data , 'message' => $msgString , 'status'=> 200 ],200);
    
            }
        }else{
            return Response(['response' => $data , 'message' => 'success' , 'status'=> 200 ],200);
    
        }



    }  
    
    public function edit(Request $request, $slug = null):Response {


        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->candidateAccess($userId)){
            return Response(['response' => 'Use is not type of canditate' ,'message'=>'Use is not type of canditate' , 'status' => 500 ],200);
        }

        $userdetail = User::whereId($userId)->first();

        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['locationlList'] = $locationlList;

        $designationlList = Skill::where('status',1)
        ->where('type','Designation')
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['designationlList'] = $designationlList;


        $alert_detail  = Alert::where('slug', $slug)
        ->first();

        $alert_id  = $alert_detail->id;

        $data['alert_detail'] = $alert_detail;

        if(!$alert_detail){

            return Response(['response'=>'alert not found' , 'message'=>'alert not found' , 'status'=>500],200);
        }

        if(!empty($request->all())){
            $rules = array(
                'location' => 'required',
                'designation' => 'required'
            );

            $validator = Validator::make($request->all(), $rules);

            $validator->setAttributeNames([
                'location' => 'Location',
                'designation'=> 'Designation',
            ]);

            if($validator->fails()){
                $errors = $validator->errors();
                $msgString = $this->validatersErrorString();
    
                return Response(['response' => $msgString , 'message'=>$msgString ,'status'=>500],200);
            }else{
    
                Alert::where('slug',$slug)
                ->update([
                    'designation' => $request->designation,
                    'location' => $request->location,
                ]);
    
                $msgString = 'You will receive an alert when jobs are created and match your criteria.';
    
                return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200 ],200);
    
            }
    
        }else{
            return Response(['response' => $data , 'message' => 'success' , 'status' => 200 ],200);
        }
    }

    public function delete($slug = NULL):Response {
        if ($slug != '') {

            $tokenData = $this->requestAuthentication('POST', 1);

            if(isset($tokenData['user_id']))
                $userId = $tokenData['user_id'];
            else
                $userId = '';


            if(!$this->candidateAccess($userId)){
                return Response(['response' => 'Use is not type of canditate' ,'message'=>'Use is not type of canditate' , 'status' => 500 ],200);
            }

            $AlertDetail = Alert::where('slug',$slug)->first();

            if($AlertDetail->user_id == $userId){
                Alert::where('slug',$slug)->delete();

                $msgString = 'Alert details deleted successfully.';
                return Response(['response'=>$msgString ,'message' => $msgString , 'status' => 200 ],200);
            } else {
                $msgString = 'You can\'t delete this Alert';
                return Response(['response' => $msgString , 'message' => $msgString , 'status' => 500 ],200);
            }
        }
        $msgString = 'Slug is empty';

        return Response(['response' => $msgString ,'message'=> $msgString ,'status'=>500 ],200);
    }

}
