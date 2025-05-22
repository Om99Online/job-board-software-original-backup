<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Keyword;
use Illuminate\Support\Str;

class KeywordsController extends Controller
{

    public function admin_index(Request $request):Response {
        $authenticateadmin = $this->adminauthentication();

        if($request->type != ''){
            $Blogs = Keyword::select('id','slug','name','status','type','created','approval_status')->where('type',$request->type)->orderBy('id','desc')->limit(90)->get();

        }else{
            $Blogs = Keyword::select('id','slug','name','status','type','created','approval_status')->orderBy('id','desc')->limit(90)->get();

        }


        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('keywords')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('keywords')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('keywords')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['name'] = $blog->name;
            $Blogsarray[$key]['type'] = $blog->type;
            $Blogsarray[$key]['approval_status'] = $blog->approval_status;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    }

    public function admin_add(Request $request):Response {
        $authenticateadmin = $this->adminauthentication();

        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:keywords,name',
            'type' => 'required',

        ]);
        $msgString='';

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {

            Keyword::create([
                'name' => $request->name,
                'course_id' => 0,
                'approval_status' => 0,
                'type'=>$request->type,
                'slug' => $this->createSlug($request->name,'keywords'),
                'status' => 1,
            ]);

            $msgString = 'Keywords Added Successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);
        }
    }

    public function admin_edit(Request $request ,$slug = null):Response {
        $authenticateadmin = $this->adminauthentication();

        $AnnouncementData = Keyword::where('slug',$slug)->first();

            if(!empty($request->all())){
                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                ]);
                $msgString='';

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    Keyword::where('slug',$slug)->update([
                        'name' => $request->name,
                    ]);

                    $msgString = 'Keywords updated successfully';
                    $AnnouncementData = Keyword::where('slug',$slug)->first();

                    return Response(['response' => $AnnouncementData , 'message'=> $msgString , 'status'=> 200 ],200);
                }

            }else{


                return Response(['response'=>$AnnouncementData , 'message'=>'sucess','status'=>200],200);

            }


    }

    public function admin_approveStatus($slug = NULL):Response {
        $authenticateadmin = $this->adminauthentication();

        $Keyword = Keyword::where('slug',$slug)->first();
 
        if(!empty($Keyword)){
                if($Keyword->approval_status == '1'){

                    Keyword::where('slug',$slug)->update([
                        'approval_status' => 0,
                    ]);
                }else{
                    Keyword::where('slug',$slug)->update([
                        'approval_status' => 1,
                    ]);
                }
                $Keyword = Keyword::where('slug',$slug)->first();
 
             $msgString = 'Keywords Status changed successfully';
             return Response(['response' => $Keyword , 'message' => $msgString ,'status' => 200  ],200);
        }else{
 
             $msgString = 'No record deleted';
             return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
        }
     }

    public function admin_delete($slug = NULL):Response {
        $authenticateadmin = $this->adminauthentication();

       $AnnouncementData = Keyword::where('slug',$slug)->first();

       if(!empty($AnnouncementData)){
            Keyword::where('slug',$slug)->delete();

            $msgString = 'Keywords deleted successfully';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200  ],200);
       }else{

            $msgString = 'No record deleted';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
       }
    }

    public function admin_activate($slug = NULL) {
        $authenticateadmin = $this->adminauthentication();

        if ($slug != '') {

            Keyword::where('slug',$slug)->update([
                'status' => 1,
            ]);

            return Response(['response' => 'Activated successfully' , 'message' => 'Activated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);

    }

    public function admin_deactivate($slug = NULL) {
        $authenticateadmin = $this->adminauthentication();

        if ($slug != '') {

            Keyword::where('slug',$slug)->update([
                'status' => 0,
            ]);

            return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }


}
