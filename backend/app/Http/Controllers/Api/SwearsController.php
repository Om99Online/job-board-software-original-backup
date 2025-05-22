<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Swear;
use Illuminate\Support\Str;

class SwearsController extends Controller
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
        $Blogs = Swear::orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('swears')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('swears')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('swears')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['s_word'] = $blog->s_word;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
        }

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
            's_word' => 'required',
        ]);
        $msgString='';

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {
            $getwords=explode(",",$request->s_word);

          //  print_r($getwords);exit;
            foreach($getwords as $word){
                Swear::create([
                    's_word' => $word,
                    'slug' => $this->createSlug($word,'swears'),
                ]);
            }


            $msgString = 'Swears word Added Successfully';
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
        $AnnouncementData = Swear::where('slug',$slug)->first();

            if(!empty($request->all())){
                $validator = Validator::make($request->all(), [
                    's_word' => 'required',
                ]);
                $msgString='';

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    Swear::where('slug',$slug)->update([
                        's_word' => $request->s_word,
                    ]);

                    $msgString = 'Swears word updated successfully';
                    $AnnouncementData = Swear::where('slug',$slug)->first();

                    return Response(['response' => $AnnouncementData , 'message'=> $msgString , 'status'=> 200 ],200);
                }

            }else{
                return Response(['response'=>$AnnouncementData , 'message'=>'sucess','status'=>200],200);
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
       $AnnouncementData = Swear::where('slug',$slug)->first();

       if(!empty($AnnouncementData)){
            Swear::where('slug',$slug)->delete();

            $msgString = 'Swears word deleted successfully';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200  ],200);
       }else{

            $msgString = 'No record deleted';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
       }
    }


}
