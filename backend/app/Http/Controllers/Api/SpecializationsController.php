<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Specialization;
use App\Models\Course;

class SpecializationsController extends Controller
{




    public function admin_index(Request $request,$cslug = null) : Response
    {
        $CategoryData = Course::where('slug',$cslug)->first();
        $catid=$CategoryData->id;
        if($catid != ''){
            $subcategoryarray = array();

        $specializations = Specialization::where('course_id',$catid)->orderBy('id', 'DESC')->get();
        $categoryarray = array();
        $categoryarray['cateogory_name'] = $CategoryData->name;
        $categoryarray['cateogory_slug'] = $CategoryData->slug;


        if ($request->filled('name')) {
            $name = trim($request->name);
        }

        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('specializations')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('specializations')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('specializations')->whereIn('id', explode(',', $idList))->delete();
                    DB::table('specializations')->whereIn('course_id', explode(',', $idList))->delete();
                }
            }
        } 
        foreach($specializations as $key => $category){

            $subcategoryarray[$key]['id'] = $category->id;
            $subcategoryarray[$key]['name'] = $category->name;
            $subcategoryarray[$key]['course_id'] = $category->course_id;
            $subcategoryarray[$key]['slug'] = $category->slug;
            $subcategoryarray[$key]['status'] = $category->status;
            $subcategoryarray[$key]['created'] = date('M d, Y',strtotime($category->created));

        }
        $categoryarray['subspecializations']= $subcategoryarray;
        return Response(['response' => $categoryarray , 'message'=>'success' , 'status' => 200 ],200);
        }

    }

    public function admin_add(Request $request,$cslug = null) :Response
    {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $CategoryData = Course::where('slug',$cslug)->first();
        $catid=$CategoryData->id;

        if($catid != ''){


            $msgString='';
            $categoryarray = array();
            $categoryarray['course_name'] = $CategoryData->name;
            $categoryarray['course_slug'] = $CategoryData->slug;

            if(!empty($request->all())){

                $validator = Validator::make($request->all(), [
                    'name' => 'required|unique:specializations,name',
                ]);

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {




            Specialization::create([
                'name' => $request->name,
                'course_id' => $catid,
                'type' => 'Basic',
                'slug' => $this->createSlug($request->name,'specializations'),
                'status' => 1,
            ]);

            $msgString = 'Specialization Added Successfully';

            return Response(['response' => $categoryarray , 'message' => $msgString , 'status' => 200],200);


        }
        }else {
            return Response(['response' => $categoryarray , 'message' => $msgString , 'status' => 200],200);
            
        }
    }

    }

    public function admin_edit(Request $request,$slug = null):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $CategoryData = Specialization::where('slug',$slug)->first();
        $categoryarray=array();

        $maincat = Course::where('id',$CategoryData->course_id)->first();
        if($maincat){
            if($maincat->name != ''){
                $categoryarray['course_name'] = $maincat->name;
                $categoryarray['course_slug'] = $maincat->slug;
            }
        }


        if(!empty($request->all())){
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        $msgString='';

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {

            Specialization::where('slug',$slug)->update([
                'name' => $request->name,
            ]);

            $msgString = 'Specialization Updated Successfully';
            $category = Specialization::where('slug',$slug)->first();


            $categoryarray['id'] = $category->id;
            $categoryarray['name'] = $category->name;
            $categoryarray['course_id'] = $category->course_id;
            $categoryarray['slug'] = $category->slug;
            $categoryarray['status'] = $category->status;
            return Response(['response' => $categoryarray , 'message' => $msgString , 'status' => 200],200);

        }
        }else{

            
            $msgString = 'Specialization Updated Successfully';
            $category = Specialization::where('slug',$slug)->first();


            $categoryarray['id'] = $category->id;
            $categoryarray['name'] = $category->name;
            $categoryarray['course_id'] = $category->course_id;
            $categoryarray['slug'] = $category->slug;
            $categoryarray['status'] = $category->status;
            return Response(['response'=>$categoryarray , 'message'=>'sucess','status'=>200],200);

        }
    }



    public function admin_activate($slug = NULL): Response {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {
            Specialization::where('slug',$slug)->update([
                'status' => 1
            ]);

            $msgString = 'Specialization activated successfully';
            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200 ],200);
        }

        $msgString = 'Slug not present';
        return Response(['response' => $msgString , 'message' => $msgString , 'status' => 500],200);
    }

    public function admin_deactivate($slug = NULL) {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {
            Specialization::where('slug',$slug)->update([
                'status' => 0
            ]);

            $msgString = 'Specialization deactivated successfully';
            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200 ],200);
        }
        $msgString = 'Slug not present';
        return Response(['response' => $msgString , 'message' => $msgString , 'status' => 500],200);
    }

    public function admin_delete($slug = null):Response{
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $id = Specialization::where('slug',$slug)->select('id')->first();
        if ($id->id) {
            Specialization::whereId($id->id)->delete();
            $msgString = 'Specialization deleted successfully';
            return Response(['response' => $msgString , 'message'=> $msgString , 'status' => 200],200);

        } else {
            $msgString = 'No record deleted';
            return Response(['response' => $msgString ,'message' =>$msgString , 'status' => 500 ],200);

        }
    }
    



}
