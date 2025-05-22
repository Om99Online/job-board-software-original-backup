<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use App\Models\Site_setting;
use App\Models\Admin;
use App\Models\Mail_setting;

use Validator;

class SettingsController extends Controller
{
    public function admin_siteSettings(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        if(!empty($request->all())){
            $rule = array([
                'title',
                'url',
                'tagline',
                'phone',
                'max_size',
                'facebook_link',
                'linkedin_link',
                'instagram_link',
                'pinterest',
                'jobs_count'
            ]);

            $validator = Validator::make($request->all(),$rule);

            if($validator->fails()){
                $error = $this->validatersErrorString($validator->errors());

                return Response(['response'=> '' , 'message' => $error , 'status'=>500],200);
            }else{
                $siteSetting = Site_setting::find(1);
                $siteSetting->title = $request->title;
                $siteSetting->url = $request->url;
                $siteSetting->tagline = $request->tagline;
                $siteSetting->phone = $request->phone;
                $siteSetting->max_size = $request->max_size;
                $siteSetting->facebook_link = $request->facebook_link;
                $siteSetting->linkedin_link = $request->linkedin_link;
                $siteSetting->instagram_link = $request->instagram_link;
                $siteSetting->pinterest = $request->pinterest;
                $siteSetting->jobs_count = $request->jobs_count;
                $siteSetting->app_payment = $request->app_payment != '' ? $request->app_payment : 0 ;
              //  $siteSetting->top_emp_text = $request->top_emp_text;
                                 $siteSetting->slogan_text = $request->slogan_text;
                  $siteSetting->slogan_title = $request->slogan_title;
                $siteSetting->app_payment = $request->app_payment;
                $siteSetting->save();

                return Response(['response'=>'' , 'message'=>'site settings updated successfully.' , 'status'=>200],200);

            }
        }else{
            $data = Site_setting::where('id',1)->first();
            $data['max_size_array'] =  $GLOBALS['max_size'];
        }

        return Response(['response'=>$data , 'message'=>'success' , 'status'=>200],200);

    }
    
    public function admin_manageMails(Request $request):Response{
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $id = 1;
        $data=array();
        $Admindetail = Admin::where('id',$id)->first();

      
        if(!empty($request->all())){
            if($request->keyword != ''){
                $keyword = $request->keyword;
            }
            if($request->action != ''){
                $idList = $request->idList;
                if($idList){
                    if($request->action == 'delete' ){
                        Mail_setting::whereRaw('id IN ('.$idList.')')->delete();
                    }
                }
            }
        }
        // $emails = new Mail_setting;
       
        // if($keyword != ''){
        //     $emails = $emails->whereRaw(" (mail_value LIKE '%" . addslashes($keyword) . "%' OR mail_name LIKE '%" . addslashes($keyword) . "%' )");
        // }

        // $emails->orderBy('id','Desc');

        // $emails = $emails->get();

        $emails = Mail_setting::orderBy('id','Desc')->get();


        $mails_array = array();

        foreach($emails as $key => $email){
            $mails_array[$key]['is'] = $email->id;
            $mails_array[$key]['email_name'] = $email->mail_name;
            $mails_array[$key]['mail_type'] = $email->mail_type;
            $mails_array[$key]['mail_value'] = $email->mail_value;
            $mails_array[$key]['slug'] = $email->slug;
        }

        $data['email'] = $mails_array;
       // print_r($data);exit;
       

        return Response(['response'=>$data , 'message'=>'success' , 'status'=>200],200);

    }

    public function admin_editMails(Request $request, $slug = null):Response{

        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if(!empty($request->all())){

            if($request->mail_value == ''){
                return Response(['response'=>'' , 'message' => 'Please enter valid email' , 'status' => 500],200);
            }else{
                Mail_setting::where('slug',$slug)->update(['mail_value'=> $request->mail_value ]);
                $data = Mail_setting::where('slug',$slug)->get();

                return Response(['response'=>$data, 'message'=>'Email updated successfully.' ,'status'=>200 ]);
            }
        }else{
            $data = Mail_setting::where('slug',$slug)->first();
            return Response(['response'=>$data, 'message'=>'success' ,'status'=>200 ]);
        }
    }
}
