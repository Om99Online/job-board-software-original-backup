<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Banneradvertisement;
use Illuminate\Support\Str;

class BanneradvertisementController extends Controller
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
        $Blogs = Banneradvertisement::orderBy('id','desc')->get();
        $Blogsarray = array();

        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('banneradvertisements')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('banneradvertisements')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('banneradvertisements')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }
     //   print_r($Blogs);exit;

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['title'] = $blog->title;
            $Blogsarray[$key]['type'] = $blog->type;
            $Blogsarray[$key]['code'] = $blog->code;
            $Blogsarray[$key]['advertisement_place'] = $blog->advertisement_place;
            $Blogsarray[$key]['image'] = DISPLAY_FULL_BANNER_AD_IMAGE_PATH.$blog->image;
            $Blogsarray[$key]['text'] = $blog->text;
            $Blogsarray[$key]['url'] = $blog->url;
            $Blogsarray[$key]['image_order'] = $blog->image_order;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    }

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
            'title' => 'required|unique:banneradvertisements,title',
            'advertisement_place' => 'required',
            'type' => 'required',
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
                file_put_contents(UPLOAD_FULL_BANNER_AD_IMAGE_PATH.$blog_image, $decoded_string);
                $imagePath = $blog_image;

            }


            Banneradvertisement::create([
                'title' => $request->title,
                'advertisement_place' => $request->advertisement_place,
                'type'=>$request->type,
                'text' => $request->text,
                'url' => $request->url,
                'image' => $imagePath,
                'image_order' => 0,
                'slug' => $this->createSlug($request->title,'banneradvertisements'),
                'status' => 1,
            ]);

            $msgString = 'Advertisement details Added Successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);
        }
    }

    public function admin_edit(Request $request ,$slug = null):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $blog = Banneradvertisement::where('slug',$slug)->first();
        $Blogsarray=array();
            $Blogsarray['id'] = $blog->id;
            $Blogsarray['slug'] = $blog->slug;
            $Blogsarray['title'] = $blog->title;
            $Blogsarray['type'] = $blog->type;
            $Blogsarray['code'] = $blog->code;
            $Blogsarray['advertisement_place'] = $blog->advertisement_place;
            $Blogsarray['image'] = DISPLAY_FULL_BANNER_AD_IMAGE_PATH.$blog->image;
            $Blogsarray['text'] = $blog->text;
            $Blogsarray['url'] = $blog->url;
            $Blogsarray['image_order'] = $blog->image_order;
            $Blogsarray['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray['status'] = $blog->status;

            if(!empty($request->all())){
                $validator = Validator::make($request->all(), [
                    'title' => 'required',
                    'advertisement_place' => 'required',
                    'type' => 'required',
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
                        file_put_contents(UPLOAD_FULL_BANNER_AD_IMAGE_PATH.$blog_image, $decoded_string);
                        $imagePath = $blog_image;
        
                    }else{
                        $imagePath = $AnnouncementData->image;
                    }
        
                    Banneradvertisement::where('slug',$slug)->update([
                        'title' => $request->title,
                        'advertisement_place' => $request->advertisement_place,
                        'type'=>$request->type,
                        'text' => $request->text,
                        'url' => $request->url,
                        'image' => $imagePath,
                        'image_order' => 0,
                        'status' => 1,
                    ]);
        
                    $msgString = 'Advertisement updated Added Successfully';
                    $AnnouncementData = Banneradvertisement::where('slug',$slug)->first();
        
                    return Response(['response' => $Blogsarray , 'message' => $msgString , 'status' => 200],200);
                }

            }else{
                return Response(['response'=>$Blogsarray , 'message'=>'sucess','status'=>200],200);
            }

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
       $AnnouncementData = Banneradvertisement::where('slug',$slug)->first();

       if(!empty($AnnouncementData)){
            Banneradvertisement::where('slug',$slug)->delete();

            $msgString = 'Advertisement deleted successfully';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200  ],200);
       }else{

            $msgString = 'No record deleted';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
       }
    }

    public function admin_activate($slug = NULL) {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {

            Banneradvertisement::where('slug',$slug)->update([
                'status' => 1,
            ]);

            return Response(['response' => 'Activated successfully' , 'message' => 'Activated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);

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

            Banneradvertisement::where('slug',$slug)->update([
                'status' => 0,
            ]);

            return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }


}
