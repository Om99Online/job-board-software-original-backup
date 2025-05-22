<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Slider;
use Illuminate\Support\Str;

use DateTime;

class SlidersController extends Controller
{


    
    public function admin_index(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $Blogs = Slider::select('id','slug','title','status','created','image')->orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('sliders')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('sliders')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('sliders')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['title'] = $blog->title;
            $Blogsarray[$key]['image'] = DISPLAY_FULL_SLIDER_IMAGE_PATH.$blog->image;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);

    }

    public function admin_activate($slug = NULL):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {

           // print_r($slug);exit;

            Slider::where('slug',$slug)->update([
                'status' => 1,
            ]);

            $msgString = 'Slider activated successfully';

            return Response(['response' => $msgString  , 'message' => $msgString  , 'status' => 200 ],200);
        }

        return Response(['response' => 'no slug' ,'message' => 'no slug' , 'status'=> 500 ],200);

    }

    public function admin_deactivate($slug = NULL):Response {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        if ($slug != '') {


            Slider::where('slug',$slug)->update([
                'status' => 0,
            ]);


            $msgString = 'Slider deactivated successfully';

            return Response(['response' => $msgString  , 'message' => $msgString  , 'status' => 200 ],200);

        }

        return Response(['response' => 'no slug' ,'message' => 'no slug' , 'status'=> 500 ],200);
    }

    public function admin_delete($slug = NULL):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {
            $sliderData = Slider::where('slug',$slug)->select('image')->first();

            $image = $sliderData->image;

            Slider::where('slug',$slug)->delete();
            @unlink(UPLOAD_FULL_SLIDER_IMAGE_PATH . $image);
            @unlink(UPLOAD_THUMB_SLIDER_IMAGE_PATH . $image);

            $msgString = 'Slider details deleted successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' =>200],200);
        }


        $msgString = 'No slug';

        return Response(['response' => $msgString , 'message' => $msgString , 'status' =>500],200);

    }

    public function admin_deleteImage($slug = null):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if (!empty($slug)) {

            $sliderData = Slider::where('slug',$slug)->first();

            $image = $sliderData->image;

         
            Slider::where('slug',$slug)->update([
                'image' => '',
            ]);

            @unlink(UPLOAD_FULL_SLIDER_IMAGE_PATH . $image);
            @unlink(UPLOAD_THUMB_SLIDER_IMAGE_PATH . $image);

            $msgString = 'Image deleted successfully';

            return Response(['response'=> $msgString , 'message' => $msgString ,'status'=>200],200);
        }

        $msgString = 'No Slug';

        return Response(['response' => $msgString , 'message'=> $msgString , 'status' => 500],200);
    }



    // pending

    public function admin_add(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $validator = Validator::make($request->all(), [
            'title' => 'required|unique:blogs,title',
            'image' => 'required',
        ]);
        $msgString='';
        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {

            $image = $request->image;
            $imagePath = '';

                if($request->image != '' && !empty($request->image)){

                $file = explode( ";base64,", $image);
                $image_type_pieces = explode( "image/", $file[0] );
              
                $image_type = $image_type_pieces[1];
                $blog_image = Str::random(10).'.'.$image_type;
                $decoded_string = base64_decode($file[1]);
                file_put_contents(UPLOAD_FULL_SLIDER_IMAGE_PATH.$blog_image, $decoded_string);
                $imagePath = $blog_image;

            }

            $blog = new Slider();
            $blog->title = $request->input('title');
            $blog->image = $imagePath;
            $blog->slug = $this->createSlug($request->input('title'),'sliders');
            $blog->status = '1';

            if ($blog->save()){

                $msgString = 'Slider Added Successfully';

                return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);
            }else{
                $msgString = 'Failed to add Blog';

                return Response(['response' => $msgString , 'message' => $msgString , 'status' => 500],200);

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

        $sliderData = Slider::where('slug',$slug)->first();

        if($sliderData->image != ''){
            $img=DISPLAY_FULL_SLIDER_IMAGE_PATH.$sliderData->image;

        }else{
            $img='';

        }

        $data['id']=$sliderData->id;
        $data['slug']=$sliderData->slug;
        $data['title']=$sliderData->title;
        $data['image']=$img;

        if ($sliderData){


            if(!empty($request->all())){
            $validator = Validator::make($request->all(), [
                'title' => 'required',
                'image' => 'required',
            ]);
            $msgString='';
            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

            }else {


            $blog = Slider::find($sliderData->id);

            if($request->image != '' && !empty($request->image)  && ($request->image != $img)){
                $image = $request->image;
                $file = explode( ";base64,", $image);
                $image_type_pieces = explode( "image/", $file[0] );
                $image_type = $image_type_pieces[1];
                $blog_image = Str::random(10).'.'.$image_type;
                $decoded_string = base64_decode($file[1]);
                file_put_contents(UPLOAD_FULL_SLIDER_IMAGE_PATH.$blog_image, $decoded_string);
                $imagePath = $blog_image;
            //  echo 'gjhghgjh';
            }else{
                $imagePath = $sliderData->image;
               // echo '3q423423';
            }

           // print_r($imagePath);

            $blog->title = $request->input('title');
            $blog->image = $imagePath;
           // $blog->slug = $this->createSlug($request->input('name'),'sliders');
            $blog->status = '1';
           // print_r($data);exit;

            if ($blog->save()){

                $msgString = 'Slider Updated Successfully';

                return Response(['response' => $data , 'message' => $msgString , 'status' => 200],200);
            }else{
                $msgString = 'Failed to Update Blog';

                return Response(['response' => $data , 'message' => $msgString , 'status' => 500],200);

            }

        }

            }else{


                return Response(['response'=>$data , 'message'=>'sucess','status'=>200],200);

            }

        }
    

    }

}
