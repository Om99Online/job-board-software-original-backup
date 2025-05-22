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
use App\Models\Currency;

class CurrenciesController extends Controller
{

    public function admin_index(Request $request):Response {



        $Blogs = Currency::orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('currencies')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('currencies')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('currencies')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }


        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['name'] = $blog->name;
            $Blogsarray[$key]['code'] = $blog->code;
            $Blogsarray[$key]['symbol'] = $blog->symbol;
            $Blogsarray[$key]['symbol_place'] = $blog->symbol_place;
            $Blogsarray[$key]['is_default'] = $blog->is_default;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    }

    public function admin_add(Request $request):Response {

        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:currencies,name',
            'code' => 'required',
            'symbol' => 'required',
        ]);
        $msgString='';

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {

            Currency::create([
                'name' => $request->name,
                'code' => $request->code,
                'symbol' => $request->symbol,
                'symbol_place' =>'before',
                'is_default' => '0',
                'slug' => $this->createSlug($request->name,'currencies'),
                'status' => 1,
            ]);

            $msgString = 'Currency Added Successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);
        }
    }


    public function admin_defaultcurrency($id = NULL):Response {


 
        if(!empty($id)){
            //print_r($id);exit;

                    Currency::where('id', '!=', 0)->update([
                        'is_default' => 0,
                    ]);
                    Currency::where('id',$id)->update([
                        'is_default' => 1,
                    ]);

              
                $Keyword = Currency::where('id', '!=', 0)->get();
 
             $msgString = 'Currency Status changed successfully';
             return Response(['response' => $Keyword , 'message' => $msgString ,'status' => 200  ],200);
        }else{
 
             $msgString = 'No record selected';
             return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
        }
    }


    public function admin_edit(Request $request ,$slug = null):Response {

        $AnnouncementData = Currency::where('slug',$slug)->first();

            if(!empty($request->all())){
                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'code' => 'required',
                    'symbol' => 'required',
                ]);
                $msgString='';

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    Currency::where('slug',$slug)->update([
                        'name' => $request->name,
                        'code' => $request->code,
                        'symbol' => $request->symbol,
                    ]);

                    $msgString = 'Currency updated successfully';
                    $AnnouncementData = Currency::where('slug',$slug)->first();

                    return Response(['response' => $AnnouncementData , 'message'=> $msgString , 'status'=> 200 ],200);
                }

            }else{


                return Response(['response'=>$AnnouncementData , 'message'=>'sucess','status'=>200],200);

            }


    }


    public function admin_delete($slug = NULL):Response {

       $AnnouncementData = Currency::where('slug',$slug)->first();

       if(!empty($AnnouncementData)){
            Currency::where('slug',$slug)->delete();

            $msgString = 'Currency deleted successfully';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200  ],200);
       }else{

            $msgString = 'No record deleted';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
       }
    }

    public function admin_activate($slug = NULL) {
        if ($slug != '') {

            Currency::where('slug',$slug)->update([
                'status' => 1,
            ]);

            return Response(['response' => 'Activated successfully' , 'message' => 'Activated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);

    }

    public function admin_deactivate($slug = NULL) {
        if ($slug != '') {

            Currency::where('slug',$slug)->update([
                'status' => 0,
            ]);

            return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }


}
