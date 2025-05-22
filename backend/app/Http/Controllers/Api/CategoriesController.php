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
use App\Models\Category;
use App\Models\Job;


class CategoriesController extends Controller
{

    public function admin_index(Request $request) : Response
    {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $categories = Category::where('parent_id',0)->orderBy('id', 'DESC')->get();
        $categoryarray = array();

        if ($request->filled('name')) {
            $name = trim($request->name);
        }

        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('categories')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('categories')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    $idArray = explode(',', $idList);

                    foreach ($idArray as $id) {
                        // echo $id;
                        // exit();
                        $categoryUsed = Job::where('category_id', $id)->first();
                        if ($categoryUsed) {
                            $msgString = "These categories are already in use and cannot be deleted.";
                            return response(['response' => "", 'message' => $msgString, 'status' => 500], 200);
                        }
                    }
                    DB::table('categories')->whereIn('id', explode(',', $idList))->delete();
                    DB::table('categories')->whereIn('parent_id', explode(',', $idList))->delete();
                }
            }
        } 
        foreach($categories as $key => $category){

            $categoryarray[$key]['id'] = $category->id;
            $categoryarray[$key]['name'] = $category->name;
            $categoryarray[$key]['parent_id'] = $category->parent_id;
            $categoryarray[$key]['slug'] = $category->slug;
            $categoryarray[$key]['status'] = $category->status;
            $categoryarray[$key]['image'] = $category->image;
            $categoryarray[$key]['meta_title'] = $category->meta_title;
            $categoryarray[$key]['meta_description'] = $category->meta_description;
            $categoryarray[$key]['meta_keywords'] = $category->meta_keywords;
            $categoryarray[$key]['meta_keyphrase'] = $category->meta_keyphrase;
            $categoryarray[$key]['keywords'] = $category->keywords;

            $categoryarray[$key]['created'] = date('M d, Y',strtotime($category->created));

        }
        return Response(['response' => $categoryarray , 'message'=>'success' , 'status' => 200 ],200);

    }

    public function admin_add(Request $request) :Response
    {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:categories,name',
           'image' => 'required',
        ]);
        $msgString='';
        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {

            if($request->image != ''){
                $file = explode( ";base64,", $request->image);
                $image_type_pieces = explode( "image/", $file[0] );
                $image_type = $image_type_pieces[1];
                // $file = base64_decode($request->logo);
                $originalName = Str::random(10).'.'.$image_type;

                $decoded_string = base64_decode($file[1]);
                file_put_contents(UPLOAD_FULL_CATEGORY_IMAGE_PATH.$originalName, $decoded_string);

            }else{
                $originalName = '';
            }


            Category::create([
                'name' => $request->name,
                'image' => $originalName,
                'parent_id' => 0,
                'cat_id' => 0,
                'meta_keywords' => $request->meta_keywords,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'keywords' => $request->keywords,

                'slug' => $this->createSlug($request->name,'categories'),
                'status' => 1,
            ]);

            $msgString = 'Category Added Successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);


        }

    }


    public function admin_subindex(Request $request,$cslug = null) : Response
    {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $CategoryData = Category::where('slug',$cslug)->first();
        $catid=$CategoryData->id;
        if($catid != ''){
            $subcategoryarray = array();

        $categories = Category::where('parent_id',$catid)->orderBy('id', 'DESC')->get();
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
                    DB::table('categories')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('categories')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('categories')->whereIn('id', explode(',', $idList))->delete();
                    DB::table('categories')->whereIn('parent_id', explode(',', $idList))->delete();
                }
            }
        } 
        foreach($categories as $key => $category){

            $subcategoryarray[$key]['id'] = $category->id;
            $subcategoryarray[$key]['name'] = $category->name;
            $subcategoryarray[$key]['parent_id'] = $category->parent_id;
            $subcategoryarray[$key]['slug'] = $category->slug;
            $subcategoryarray[$key]['status'] = $category->status;
            $subcategoryarray[$key]['image'] = $category->image;
            $subcategoryarray[$key]['meta_title'] = $category->meta_title;
            $subcategoryarray[$key]['meta_description'] = $category->meta_description;
            $subcategoryarray[$key]['meta_keywords'] = $category->meta_keywords;
            $subcategoryarray[$key]['meta_keyphrase'] = $category->meta_keyphrase;
            $subcategoryarray[$key]['keywords'] = $category->keywords;
            
            $subcategoryarray[$key]['created'] = date('M d, Y',strtotime($category->created));

        }
        $categoryarray['subcategories']= $subcategoryarray;
        return Response(['response' => $categoryarray , 'message'=>'success' , 'status' => 200 ],200);
        }

    }

    public function admin_subadd(Request $request,$cslug = null) :Response
    {

        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $CategoryData = Category::where('slug',$cslug)->first();
        $catid=$CategoryData->id;

        if($catid != ''){


            $msgString='';
            $categoryarray = array();
            $categoryarray['cateogory_name'] = $CategoryData->name;
            $categoryarray['cateogory_slug'] = $CategoryData->slug;

            if(!empty($request->all())){

                $validator = Validator::make($request->all(), [
                    'name' => 'required|unique:categories,name',
                ]);

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {

            if($request->image != ''){
                $file = explode( ";base64,", $request->image);
                $image_type_pieces = explode( "image/", $file[0] );
                $image_type = $image_type_pieces[1];
                // $file = base64_decode($request->logo);
                $originalName = Str::random(10).'.'.$image_type;

                $decoded_string = base64_decode($file[1]);
                file_put_contents(UPLOAD_FULL_CATEGORY_IMAGE_PATH.$originalName, $decoded_string);

            }else{
                $originalName = '';
            }


            Category::create([
                'name' => $request->name,
                'image' => $originalName,
                'parent_id' => $catid,
                'cat_id' => 0,
                'meta_keywords' => $request->meta_keywords,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'keywords' => $request->keywords,

                'slug' => $this->createSlug($request->name,'categories'),
                'status' => 1,
            ]);

            $msgString = 'Category Added Successfully';

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
        $CategoryData = Category::where('slug',$slug)->first();
        $categoryarray=array();

        $maincat = Category::where('id',$CategoryData->parent_id)->first();
        if($maincat){
            if($maincat->name != ''){
                $categoryarray['cateogory_name'] = $maincat->name;
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

            if($CategoryData->image != ''){
                $img=DISPLAY_FULL_CATEGORY_IMAGE_PATH.$CategoryData->image;
            }else{
                $img='';
            }

            if(($request->image != '') && ($request->image != $img)){
                $file = explode( ";base64,", $request->image);
                $image_type_pieces = explode( "image/", $file[0] );
                $image_type = $image_type_pieces[1];
                // $file = base64_decode($request->logo);
                $originalName = Str::random(10).'.'.$image_type;

                $decoded_string = base64_decode($file[1]);
                file_put_contents(UPLOAD_FULL_CATEGORY_IMAGE_PATH.$originalName, $decoded_string);

            }else{
                $originalName = $CategoryData->image;
            }
            
            $categoryUsed = Job::where('category_id', $request->id)->first();
            if($categoryUsed){
                $msgString = "This category is already in use and cannot be edited.";
                return Response(['response' => "" , 'message' => $msgString , 'status' => 500],200);
            }


            Category::where('slug',$slug)->update([
                'name' => $request->name,
                'image' => $originalName,
                'meta_keywords' => $request->meta_keywords,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'keywords' => $request->keywords,

            ]);

            $msgString = 'Category Updated Successfully';
            $category = Category::where('slug',$slug)->first();

            if($category->image != ''){
                $catimg=DISPLAY_FULL_CATEGORY_IMAGE_PATH.$category->image;

            }else{
                $catimg='';

            }


            $categoryarray['id'] = $category->id;
            $categoryarray['name'] = $category->name;
            $categoryarray['parent_id'] = $category->parent_id;
            $categoryarray['slug'] = $category->slug;
            $categoryarray['status'] = $category->status;
            $categoryarray['image'] = $catimg;
            $categoryarray['meta_title'] = $category->meta_title;
            $categoryarray['meta_description'] = $category->meta_description;
            $categoryarray['meta_keywords'] = $category->meta_keywords;
            $categoryarray['meta_keyphrase'] = $category->meta_keyphrase;
            $categoryarray['keywords'] = $category->keywords;

            return Response(['response' => $categoryarray , 'message' => $msgString , 'status' => 200],200);

        }
        }else{

            
            $msgString = 'Category Updated Successfully';
            $category = Category::where('slug',$slug)->first();

            if($category->image != ''){
                $catimg=DISPLAY_FULL_CATEGORY_IMAGE_PATH.$category->image;

            }else{
                $catimg='';

            }

            $categoryarray['id'] = $category->id;
            $categoryarray['name'] = $category->name;
            $categoryarray['parent_id'] = $category->parent_id;
            $categoryarray['slug'] = $category->slug;
            $categoryarray['status'] = $category->status;
            $categoryarray['image'] = $catimg;
            $categoryarray['meta_title'] = $category->meta_title;
            $categoryarray['meta_description'] = $category->meta_description;
            $categoryarray['meta_keywords'] = $category->meta_keywords;
            $categoryarray['meta_keyphrase'] = $category->meta_keyphrase;
            $categoryarray['keywords'] = $category->keywords;
            return Response(['response'=>$categoryarray , 'message'=>'sucess','status'=>200],200);

        }
    }

    public function admin_deleteCategoryImage($catSlug = null):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if (!empty($catSlug)) {
            Category::where('slug',$catSlug)->update(['image' => '']);
            @unlink(UPLOAD_FULL_CATEGORY_IMAGE_PATH . $image);
            @unlink(UPLOAD_THUMB_CATEGORY_IMAGE_PATH . $image);
            @unlink(UPLOAD_SMALL_CATEGORY_IMAGE_PATH . $image);

            $msgString = 'Category Image deleted successfully';
            return Response(['response' => $msgString, 'message' => $msgString ,'status'=> 500 ],200);
        }

        $msgString = 'Slug not present';
        return Response(['response' => $msgString , 'message' => $msgString , 'status' => 500],200);
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
            Category::where('slug',$slug)->update([
                'status' => 1
            ]);

            $msgString = 'Category activated successfully';
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
            Category::where('slug',$slug)->update([
                'status' => 0
            ]);

            $msgString = 'Category deactivated successfully';
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

        // $id = Category::where('slug',$slug)->select('id')->first();
        $categoryRecord = Category::where('slug',$slug)->select('id')->first();
        $categoryId = $categoryRecord->id;
        
        $categoryUsed = Job::where('category_id', $categoryId)->first();
        // print_r($categoryId);
        // exit();
        if($categoryUsed){
            $msgString = "This category is already in use and cannot be deleted.";
            return Response(['response' => "" , 'message' => $msgString , 'status' => 500],200);
        }
        if ($categoryId) {
            Category::whereId($categoryId)->delete();
            $msgString = 'Category deleted successfully';
            return Response(['response' => $msgString , 'message'=> $msgString , 'status' => 200],200);

        } else {
            $msgString = 'No record deleted';
            return Response(['response' => $msgString ,'message' =>$msgString , 'status' => 500 ],200);

        }
    }
    
    public function getSubCategory($categoryId = null):Response{
                

        // $tokenData = $this->requestAuthentication('POST', 1);
        // $userId = $tokenData['user_id'];


        //  // $this->userLoginCheck();
        // if(!$this->recruiterAccess($userId)){
        //     return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        // }

        if (!empty($categoryId)) {

            $subcategories = (new Category)->getSubCategoryList($categoryId);

            return Response(['response' => $subcategories,'message'=>'success', 'status'=>200],200);
        }

        return Response(['response'=>'Category id null' , 'message' => 'Category id null' , 'status' => 500 ],200);
    }
    
    public function allcategories():Response {


        $categories  = (new Category)->getCategoryList();
        $data['categories'] = $categories;

        return Response(['response'=>$data , 'message' => 'success' , 'status' => 200 ],200);

    }



}
