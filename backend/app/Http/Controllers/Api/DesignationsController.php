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
use App\Models\Skill;

class DesignationsController extends Controller
{

    public function admin_index(Request $request):Response {



        $Blogs = Skill::where('type','Designation')->orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('skills')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('skills')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('skills')->whereIn('id', explode(',', $idList))->delete();
                   
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
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    }

    public function admin_add(Request $request):Response {

        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:skills,name',
           

        ]);
        $msgString='';

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {


            $getwords=explode(",",$request->name);
            //  print_r($getwords);exit;
            foreach($getwords as $word){

                  Skill::create([
                    'name' => $word,
                    'type'=>'Designation',
                    'slug' => $this->createSlug($word,'skills'),
                    'status' => 1,
                ]);

            }

            $msgString = 'Designation Added Successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);
        }
    }

    public function admin_edit(Request $request ,$slug = null):Response {

        $AnnouncementData = Skill::where('slug',$slug)->first();

            if(!empty($request->all())){
                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                ]);
                $msgString='';

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    Skill::where('slug',$slug)->update([
                        'name' => $request->name,
                    ]);

                    $msgString = 'Designation updated successfully';
                    $AnnouncementData = Skill::where('slug',$slug)->first();

                    return Response(['response' => $AnnouncementData , 'message'=> $msgString , 'status'=> 200 ],200);
                }

            }else{


                return Response(['response'=>$AnnouncementData , 'message'=>'sucess','status'=>200],200);

            }


    }


    public function admin_delete($slug = NULL):Response {

       $AnnouncementData = Skill::where('slug',$slug)->first();

       if(!empty($AnnouncementData)){
            Skill::where('slug',$slug)->delete();

            $msgString = 'Designation deleted successfully';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200  ],200);
       }else{

            $msgString = 'No record deleted';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
       }
    }

    public function admin_activate($slug = NULL) {
        if ($slug != '') {

            Skill::where('slug',$slug)->update([
                'status' => 1,
            ]);

            return Response(['response' => 'Activated successfully' , 'message' => 'Activated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);

    }

    public function admin_deactivate($slug = NULL) {
        if ($slug != '') {

            Skill::where('slug',$slug)->update([
                'status' => 0,
            ]);

            return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }


}
