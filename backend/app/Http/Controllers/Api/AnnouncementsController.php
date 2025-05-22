<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Announcement;
use Illuminate\Support\Str;

class AnnouncementsController extends Controller
{

    public function admin_index(Request $request):Response {
        $authenticateadmin = $this->adminauthentication();

        $Blogs = Announcement::select('id','slug','name','status','created','url')->orderBy('id','desc')->get();
        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('announcements')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('announcements')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('announcements')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['url'] = $blog->url;
            $Blogsarray[$key]['name'] = $blog->name;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    }

    public function admin_add(Request $request):Response {
        $authenticateadmin = $this->adminauthentication();

        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:announcements,name',
            'url' => 'required',
        ]);
        $msgString='';

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {

            Announcement::create([
                'name' => $request->name,
                'url' => $request->url,
                'slug' => $this->createSlug($request->name,'announcements'),
                'status' => 1,
            ]);

            $msgString = 'Announcement Added Successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);
        }
    }

    public function admin_edit(Request $request ,$slug = null):Response {
        
        $authenticateadmin = $this->adminauthentication();
  

        $AnnouncementData = Announcement::where('slug',$slug)->first();

            if(!empty($request->all())){
                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'url' => 'required',
                ]);
                $msgString='';

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    Announcement::where('slug',$slug)->update([
                        'name' => $request->name,
                        'url' => $request->url,
                    ]);

                    $msgString = 'Announcement updated successfully';
                    $AnnouncementData = Announcement::where('slug',$slug)->first();
                    
                

                    return Response(['response' => $AnnouncementData , 'message'=> $msgString , 'status'=> 200 ],200);
                }

            }else{


                return Response(['response'=>$AnnouncementData , 'message'=>'sucess','status'=>200],200);

            }


    }

    public function admin_delete($slug = NULL):Response {
        $authenticateadmin = $this->adminauthentication();

       $AnnouncementData = Announcement::where('slug',$slug)->first();

       if(!empty($AnnouncementData)){
            Announcement::where('slug',$slug)->delete();

            $msgString = 'Announcement deleted successfully';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200  ],200);
       }else{

            $msgString = 'No record deleted';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
       }
    }

    public function admin_activate($slug = NULL) {
        $authenticateadmin = $this->adminauthentication();

        if ($slug != '') {

            Announcement::where('slug',$slug)->update([
                'status' => 1,
            ]);

            return Response(['response' => 'Activated successfully' , 'message' => 'Activated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);

    }

    public function admin_deactivate($slug = NULL) {
        $authenticateadmin = $this->adminauthentication();

        if ($slug != '') {

            Announcement::where('slug',$slug)->update([
                'status' => 0,
            ]);

            return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }


}
