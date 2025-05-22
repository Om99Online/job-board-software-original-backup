<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Blog;
use Illuminate\Support\Str;

use DateTime;

class BlogsController extends Controller
{
    public function index():Response {

        $Blogs = Blog::where('status',1)
        ->orderBy('id','desc')
        ->get();

        // $data['DISPLAY_FULL_BLOG_PATH'] = DISPLAY_FULL_BLOG_PATH;
        // $data['DISPLAY_THUMB_BLOG_PATH'] = DISPLAY_THUMB_BLOG_PATH;
        // $data['DISPLAY_SMALL_BLOG_PATH'] = DISPLAY_SMALL_BLOG_PATH;
        // $data['Blog'] = $Blogs;
        

        

        $blog_array = array();
        foreach($Blogs as $key => $blog){
        
            $blog_array[$key]['title'] = $blog->title;
            
            if($blog->image == "")
                $blog_array[$key]['image'] = "";
            else
                $blog_array[$key]['image'] = DISPLAY_FULL_BLOG_PATH.$blog->image;
                
            $blog_array[$key]['description'] = $blog->description;
            $blog_array[$key]['slug'] = $blog->slug;
            $blog_array[$key]['created'] = date('F d, Y',strtotime($blog->created));

        }

        $data['Blog'] = $blog_array;


        return Response(['response' => $data , 'message' => 'success' ,'status' => 200],200);
    }

    public function detail($slug = null):Response{

        if ($slug) {
            $blogSlug = explode('.', $slug);
        }

        $blog = Blog::where('slug' , $blogSlug )->first();

        // $data['DISPLAY_FULL_BLOG_PATH'] = DISPLAY_FULL_BLOG_PATH;
        // $data['DISPLAY_THUMB_BLOG_PATH'] = DISPLAY_THUMB_BLOG_PATH;
        // $data['DISPLAY_SMALL_BLOG_PATH'] = DISPLAY_SMALL_BLOG_PATH;
        // $data['Blog'] = $blogData;

        $blog_array = array();
        // foreach($blogData as  $blog){
            $blog_array['title'] = $blog->title;
            
            if($blog->image == "")
                $blog_array['image'] = "";
            else
                $blog_array['image'] = DISPLAY_FULL_BLOG_PATH.$blog->image;
                
            $blog_array['description'] = $blog->description;
            $blog_array['slug'] = $blog->slug;
            $blog_array['created'] = date('F d, Y',strtotime($blog->created));

        // }

        $data['Blog'] = $blog_array;

        return Response(['response' => $data , 'message' => 'success' , 'status' => 200],200);
    }

    public function admin_activateblog($slug = NULL):Response {
        
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

            Blog::where('slug',$slug)->update([
                'status' => 1,
            ]);

            $msgString = 'Blog activated successfully';

            return Response(['response' => $msgString  , 'message' => $msgString  , 'status' => 200 ],200);
        }

        return Response(['response' => 'no slug' ,'message' => 'no slug' , 'status'=> 500 ],200);

    }

    public function admin_deactivateblog($slug = NULL):Response {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {


            Blog::where('slug',$slug)->update([
                'status' => 0,
            ]);


            $msgString = 'Blog deactivated successfully';

            return Response(['response' => $msgString  , 'message' => $msgString  , 'status' => 200 ],200);

        }

        return Response(['response' => 'no slug' ,'message' => 'no slug' , 'status'=> 500 ],200);
    }

    public function admin_deleteblogs($slug = NULL):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {
            $blogData = Blog::where('slug',$slug)
            ->select('image')->first();

            $image = $blogData->image;

            Blog::where('slug',$slug)->delete();
            @unlink(UPLOAD_FULL_BLOG_PATH . $image);
            @unlink(UPLOAD_THUMB_BLOG_PATH . $image);
            @unlink(UPLOAD_SMALL_BLOG_PATH . $image);

            $msgString = 'Blog details deleted successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' =>200],200);
        }


        $msgString = 'No slug';

        return Response(['response' => $msgString , 'message' => $msgString , 'status' =>500],200);

    }

    public function admin_deleteBlogImage($slug = null):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if (!empty($slug)) {

            $blogData = Blog::where('slug',$slug)
            ->first();

            $image = $blogData->image;


            Blog::where('slug',$slug)->update([
                'image' => '',
            ]);

            @unlink(UPLOAD_FULL_BLOG_PATH . $image);
            @unlink(UPLOAD_THUMB_BLOG_PATH . $image);
            @unlink(UPLOAD_SMALL_BLOG_PATH . $image);

            $msgString = 'Image deleted successfully';

            return Response(['response'=> $msgString , 'message' => $msgString ,'status'=>200],200);
        }

        $msgString = 'No Slug';

        return Response(['response' => $msgString , 'message'=> $msgString , 'status' => 500],200);
    }


    public function admin_index(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $Blogs = Blog::select('id','slug','title','tag','status','created','image')->orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('blogs')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('blogs')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('blogs')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['title'] = $blog->title;
            $Blogsarray[$key]['tag'] = $blog->tag;
            $Blogsarray[$key]['image'] = DISPLAY_FULL_BLOG_PATH.$blog->image;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);

    }

    // pending

    public function admin_addblogs(Request $request):Response {
        
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
            'description' => 'required',
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
                file_put_contents(UPLOAD_FULL_BLOG_PATH.$blog_image, $decoded_string);
                $imagePath = $blog_image;

            }

           

            // $uploadedFileName = $this->uploadImage($image, UPLOAD_FULL_BLOG_PATH);
            // $this->resizeImage($uploadedFileName, UPLOAD_FULL_BLOG_PATH, UPLOAD_THUMB_BLOG_PATH, UPLOAD_THUMB_BLOG_WIDTH, UPLOAD_THUMB_BLOG_HEIGHT);

            // $this->resizeImage($uploadedFileName, UPLOAD_FULL_BLOG_PATH, UPLOAD_SMALL_BLOG_PATH, UPLOAD_SMALL_BLOG_WIDTH, UPLOAD_SMALL_BLOG_HEIGHT);



            $blog = new Blog();
            $blog->title = $request->input('title');
            $blog->description = trim($request->input('description'));
            $blog->image = $imagePath;
            $blog->meta_keyword = trim($request->input('meta_keyword'));
            $blog->meta_title = trim($request->input('meta_title'));
            $blog->meta_description = trim($request->input('meta_description'));
            $blog->slug = $this->createSlug($request->input('title'),'blogs');
            $blog->status = '1';

            if ($blog->save()){

                $msgString = 'Blog Added Successfully';

                return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);
            }else{
                $msgString = 'Failed to add Blog';

                return Response(['response' => $msgString , 'message' => $msgString , 'status' => 500],200);

            }
        }
        
    }
    public function admin_editblogs(Request $request,$slug = null):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $blogData = Blog::where('slug',$slug)->first();

        if($blogData->image != ''){
            $img=DISPLAY_FULL_BLOG_PATH.$blogData->image;

        }else{
            $img='';

        }

        $data['id']=$blogData->id;
        $data['slug']=$blogData->slug;
        $data['title']=$blogData->title;
        $data['description']=$blogData->description;
        $data['meta_keyword']=$blogData->meta_keyword;
        $data['meta_title']=$blogData->meta_title;
        $data['meta_description']=$blogData->meta_description;
        $data['image']=$img;

        if ($blogData){


            if(!empty($request->all())){
            $validator = Validator::make($request->all(), [
                'title' => 'required',
                'description' => 'required',
                'image' => 'required',
            ]);
            $msgString='';
            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

            }else {



           
           // $blog = new Blog();
           // $blog = $blog->where('slug',$slug);
            $blog = Blog::find($blogData->id);

            

            if($request->image != '' && !empty($request->image)  && ($request->image != $img)){
                $image = $request->image;
                $file = explode( ";base64,", $image);
                $image_type_pieces = explode( "image/", $file[0] );
                $image_type = $image_type_pieces[1];
                $blog_image = Str::random(10).'.'.$image_type;
                $decoded_string = base64_decode($file[1]);
                file_put_contents(UPLOAD_FULL_BLOG_PATH.$blog_image, $decoded_string);
                $imagePath = $blog_image;
            //  echo 'gjhghgjh';
            }else{
                $imagePath = $blogData->image;
               // echo '3q423423';
            }

           // print_r($imagePath);

          
            // $uploadedFileName = $this->uploadImage($image, UPLOAD_FULL_BLOG_PATH);
            // $this->resizeImage($uploadedFileName, UPLOAD_FULL_BLOG_PATH, UPLOAD_THUMB_BLOG_PATH, UPLOAD_THUMB_BLOG_WIDTH, UPLOAD_THUMB_BLOG_HEIGHT);

            // $this->resizeImage($uploadedFileName, UPLOAD_FULL_BLOG_PATH, UPLOAD_SMALL_BLOG_PATH, UPLOAD_SMALL_BLOG_WIDTH, UPLOAD_SMALL_BLOG_HEIGHT);




            $blog->title = $request->input('title');
            $blog->description = trim($request->input('description'));
            $blog->image = $imagePath;
            $blog->meta_keyword = trim($request->input('meta_keyword'));
            $blog->meta_title = trim($request->input('meta_title'));
            $blog->meta_description = trim($request->input('meta_description'));
           // $blog->slug = $this->createSlug($request->input('name'),'blogs');
            $blog->status = '1';
           // print_r($data);exit;

            if ($blog->save()){

                $msgString = 'Blog Updated Successfully';

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
    // public function admin_editblogs($slug = null) {

    //     $this->set('blog_list', 'active');
    //     $msgString = "";

    //     $site_title = $this->getSiteConstant('title');
    //     $tagline = $this->getSiteConstant('tagline');
    //     $title_for_pages = $site_title . " :: " . $tagline . " - ";
    //     $this->set('title_for_layout', $title_for_pages . "Edit Blog");

    //     global $extentions;
    //     $this->set('blogslug', $slug);
    //     $this->set('blogtitle', $this->Blog->field('title', array('slug' => $slug)));


    //     if ($this->data) {
    //         //  pr($this->data);exit;
    //         if (empty($this->data["Blog"]["title"])) {
    //             $msgString .="- Title is required field.<br>";
    //         } else {

    //             if (strtolower($this->data["Blog"]["title"]) != strtolower($this->data["Blog"]["old_title"])) {
    //                 if ($this->Blog->isRecordUniquetitle($this->data["Blog"]["title"]) == false) {
    //                     $msgString .="- Blog Title already exists.<br>";
    //                 }
    //             } else {
    //                 $msgString .= $this->Swear->checkSwearWord($this->data["Blog"]["title"]);
    //             }
    //         }


    //         if (empty($this->data["Blog"]["description"])) {
    //             $msgString .="- Description is required field.<br>";
    //         } else {
    //             $msgString .= $this->Swear->checkSwearWord($this->data["Blog"]["description"]);
    //         }

    //         if (!empty($this->data["Blog"]["meta_title"])) {
    //             $msgString .= $this->Swear->checkSwearWord($this->data["Blog"]["meta_title"]);
    //         }
    //         if (!empty($this->data["Blog"]["meta_keyword"])) {
    //             $msgString .= $this->Swear->checkSwearWord($this->data["Blog"]["meta_keyword"]);
    //         }
    //         if (!empty($this->data["Blog"]["meta_description"])) {
    //             $msgString .= $this->Swear->checkSwearWord($this->data["Blog"]["meta_description"]);
    //         }

    //         if (!empty($this->data["Blog"]["image"]['name'])) {
    //             list($width, $height, $type, $attr) = getimagesize($this->data["Blog"]["image"]['tmp_name']);
    //             $getextention = $this->PImage->getExtension($this->data["Blog"]["image"]['name']);
    //             $extention = strtolower($getextention);
    //             if (!in_array($extention, $extentions)) {
    //                 $msgString .="- Not Valid Extention.<br>";
    //             } elseif ($this->data["Blog"]["image"]['size'] > '2097152') {
    //                 $msgString .="- Max file size upload is 2MB.<br>";
    //             } elseif ($width < 250 || $height < 250) {
    //                 $msgString .= "- Width and Height of Blog image must be more than 250 X 250 pixels respectively.<br>";
    //             }
    //         }

    //         if (isset($msgString) && $msgString != '') {
    //             $this->Session->setFlash($msgString, 'error_msg');
    //         } else {


    //             if (!empty($this->data["Blog"]["image"]['name'])) {
    //                 $imageArray = $this->data["Blog"]["image"];
    //                 $imageArray['name'] = str_replace("\_", '_', str_replace(array('%', '$', '#', '%20', "/", "'", ' ', "\'"), '_', $imageArray['name']));

    //                 $returnedUploadImageArray = $this->PImage->upload($imageArray, UPLOAD_FULL_BLOG_PATH, "jpg,jpeg,png,gif,bmp");

    //                 if (isset($returnedUploadImageArray[1]) && !empty($returnedUploadImageArray[1])) {
    //                     $msgString .= "- Blog image file not valid.<br>";
    //                     $this->request->data["Blog"]["image"] = $this->data['Blog']['old_image'];
    //                 } else {
    //                     copy(UPLOAD_FULL_BLOG_PATH . $returnedUploadImageArray[0], UPLOAD_THUMB_BLOG_PATH . $returnedUploadImageArray[0]);
    //                     $this->PImageTest->resize(UPLOAD_THUMB_BLOG_PATH . $returnedUploadImageArray[0], UPLOAD_THUMB_BLOG_PATH . $returnedUploadImageArray[0], UPLOAD_THUMB_BLOG_WIDTH, UPLOAD_THUMB_BLOG_HEIGHT, 100);
    //                     copy(UPLOAD_FULL_BLOG_PATH . $returnedUploadImageArray[0], UPLOAD_SMALL_BLOG_PATH . $returnedUploadImageArray[0]);
    //                     $this->PImageTest->resize(UPLOAD_SMALL_BLOG_PATH . $returnedUploadImageArray[0], UPLOAD_SMALL_BLOG_PATH . $returnedUploadImageArray[0], UPLOAD_SMALL_BLOG_WIDTH, UPLOAD_SMALL_BLOG_HEIGHT, 100);
    //                     $blogPic = $returnedUploadImageArray[0];
    //                       chmod(UPLOAD_FULL_BLOG_PATH .$returnedUploadImageArray[0], 0755);
    //                     chmod(UPLOAD_THUMB_BLOG_PATH . $returnedUploadImageArray[0], 0755);
    //                     chmod(UPLOAD_SMALL_BLOG_PATH . $returnedUploadImageArray[0], 0755);
    //                     $this->request->data["Blog"]["image"] = $blogPic;
    //                     if ($this->data['Blog']['old_image']) {
    //                         @unlink(UPLOAD_FULL_BLOG_PATH . $this->data['Blog']['old_image']);
    //                         @unlink(UPLOAD_THUMB_BLOG_PATH . $this->data['Blog']['old_image']);
    //                         @unlink(UPLOAD_SMALL_BLOG_PATH . $this->data['Blog']['old_image']);
    //                     }
    //                 }
    //             } else {
    //                 $this->request->data["Blog"]["image"] = $this->data['Blog']['old_image'];
    //             }

    //             if (isset($msgString) && $msgString != '') {
    //                 $this->Session->write('error_msg', $msgString);
    //             } else {
    //                 if ($this->data['Blog']['delete'] == 1) {
    //                     $image = $this->data['Blog']['old_image'];
    //                     $filePath = UPLOAD_FULL_BLOG_PATH . $image;
    //                     if (file_exists($filePath) && $image) {
    //                         @unlink(UPLOAD_FULL_BLOG_PATH . $image);
    //                         @unlink(UPLOAD_THUMB_BLOG_PATH . $image);
    //                         @unlink(UPLOAD_SMALL_BLOG_PATH . $image);
    //                     }
    //                     if ($this->data["Blog"]["image"] == $image) {
    //                         $this->request->data["Blog"]["image"] = '';
    //                     }
    //                 }

    //                 if ($this->Blog->save($this->data)) {

    //                     $this->Session->setFlash('Blog details updated successfully', 'success_msg');
    //                     $this->redirect('/admin/blogs/index');
    //                 }
    //             }
    //         }
    //     } elseif ($slug != '') {
    //         $id = $this->Blog->field('id', array('Blog.slug' => $slug));
    //         $this->Blog->id = $id;
    //         $this->data = $this->Blog->read();
    //         $this->request->data['Blog']['old_image'] = $this->data['Blog']['image'];
    //         $this->request->data['Blog']['old_title'] = $this->data['Blog']['title'];
    //     }
    // }
}
