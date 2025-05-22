<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use App\Models\Page;
use App\Models\Admin;
use App\Models\Setting;
use App\Models\Emailtemplate;
use Validator;

use Mail;
use App\Mail\SendMailable;


class PagesController extends Controller
{
    public function faq():Response {

        $pageContent  = Page::where('static_page_heading','faq')->first();

        return Response(['response' => $pageContent , 'message' => 'success','status'=>'200' ],200);
    }

    // public function staticpage(Request $request,$slugPage = null): Response {

    //     $pageUrlData = explode('.', $slugPage);
    //     $page = $pageUrlData[0];
    //     $msgString='success';

    //     $pagedetails = Page::where('static_page_heading', $page)->first();
    //     if(empty($pagedetails)){
    //         return Response(['response' => 'No Data found' ,'message' => 'No Data found' , 'status' => 500 ],200);
    //         exit;
    //     }


    //     $data['pagedetails'] =$pagedetails;

    //     // if(empty($request->all())){
    //     //     return Response(['response' => $pagedetails , 'message'=>'success' , 'status'=>200],200);
    //     // }

    //     if(!empty($request->all())){

    //     $rules = array(
    //         'name' => 'required',
    //         'email' => 'required|email',
    //         'subject' => 'required',
    //         'message' => 'required',
    //     );

    //     $validator = Validator::make($request->all(),$rules);

    //     if($validator->fails()){
    //         $msgString = $this->validatersErrorString($validator->errors());
    //         return Response(['response'=> $msgString ,'message' => $msgString , 'status'=>500 ],200);
    //     }else{
            
    //         $username = $request->name;
    //         $email = $request->email;
    //         $message = $request->message;
    //         $subjectbyuser = $request->subject;
    //         $currentYear = date('Y', time());
    //         $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
    //         $contact_details  = Setting::first();
    //         $admin_email = $contact_details->email;

    //         $emailTemplate = Emailtemplate::where('id',6)->first();

    //         $get_lang=DEFAULT_LANGUAGE;
    //         if( $get_lang =='fra'){
    //             $template_subject= $emailTemplate->subject_fra;
    //             $template_body= $emailTemplate->template_fra;
    //         }else if( $get_lang =='de'){
    //             $template_subject= $emailTemplate->subject_de;
    //             $template_body= $emailTemplate->template_de;
    //         }else{
    //             $template_subject= $emailTemplate->subject;
    //             $template_body= $emailTemplate->template;
    //         }

    //         $toSubArray = array('[!username!]', '[!email!]', '[!subjectuser!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');
    //         $fromSubArray = array($username, $email, $subjectbyuser, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $request->subject);

    //         $subjectToSend = str_replace($toSubArray, $fromSubArray, $template_subject);

    //         $toRepArray = array('[!username!]', '[!email!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');
    //         $fromRepArray = array($username, $email, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $request->subject);
    //         $messageToSend = str_replace($toRepArray, $fromRepArray, $template_body);


    //             try {

    //                 Mail::to($admin_email)->send(new SendMailable($messageToSend, $subjectToSend));
                
    //             } catch(\Exception $e) {
    //                 $msgString=$e->getMessage();
    //             }
            


    //         $emailTemplate = Emailtemplate::where('id',17)->first();

    //         $get_lang=DEFAULT_LANGUAGE;
    //         if( $get_lang =='fra'){
    //             $template_subject= $emailTemplate->subject_fra;
    //             $template_body= $emailTemplate->template_fra;
    //         }else if( $get_lang =='de'){
    //             $template_subject= $emailTemplate->subject_de;
    //             $template_body= $emailTemplate->template_de;
    //         }else{
    //             $template_subject= $emailTemplate->subject;
    //             $template_body= $emailTemplate->template;
    //         }

    //         $toSubArray = array('[!username!]', '[!email!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');

    //         $fromSubArray = array($username, $email, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $request->subject);

    //         $subjectToSend = str_replace($toSubArray, $fromSubArray, $template_subject);
    //         $messageToSend = str_replace($toSubArray, $fromSubArray, $template_body);

    //       // Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
           
    //           try {

    //                 Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
                
    //             } catch(\Exception $e) {
    //                 $msgString=$e->getMessage();
    //             }

    //         $msgString = 'email sent successfully';


    //     }

    // }
    // return Response(['response'=> $pagedetails , 'message'=>$msgString ,'status'=> 200],200);

    // }
        public function staticpage(Request $request,$slugPage = null): Response {

        $pageUrlData = explode('.', $slugPage);
        $page = $pageUrlData[0];

        $pageContent = Page::where('static_page_heading', $page)->first();
        
        
        if(empty($pageContent)){
            return Response(['response' => 'No Data found' ,'message' => 'No Data found' , 'status' => 500 ],200);
        }
             $data['pagedetails'] =$pageContent;
             $pageContentarray=array();
              $lang=$request->language;
        
        if($lang == 'en'){
            
            $pageContentarray['page_title'] =$pageContent->static_page_title;
            $pageContentarray['page_description'] =$pageContent->static_page_description;
        }else if($lang == 'ukr'){
            
            $pageContentarray['page_title'] =$pageContent->static_page_title_ukr;
            $pageContentarray['page_description'] =$pageContent->static_page_description_ukr;
        }else if($lang == 'el'){
            
            $pageContentarray['page_title'] =$pageContent->static_page_title_el;
            $pageContentarray['page_description'] =$pageContent->static_page_description_el;
        }else{
            
            $pageContentarray['page_title'] =$pageContent->static_page_title;
            $pageContentarray['page_description'] =$pageContent->static_page_description;
        }
        
       $pageContentarray['static_page_heading'] =$pageContent->static_page_heading;
        $pageContentarray['status'] =$pageContent->status;
         $pageContentarray['slug'] =$pageContent->slug;


        return Response(['response' => $pageContentarray , 'message'=>'success' , 'status'=>200],200);
 
    }


    public function contactUs(Request $request):Response{
        
        
        $msgString = '';
        $contact_details  = Setting::first();

        $data['contact_details'] = $contact_details;


        if(!empty($request->all())){

            $input = $request->all();

            $rules = array(
                'name' => 'required',
                'email' => 'required|email',
                'subject' => 'required',
                'message' => 'required',
            );

            $validator = Validator::make($input,$rules);

            if($validator->fails()){
                $msgString = $this->validatersErrorString($validator->errors());

                return Response(['response' => $msgString ,'message'=> $msgString , 'status'=>500 ],200);
            }else{
                
                 $username = $request->name;
                $email = $request->email;
                $message = $request->message;
                $subjectbyuser = $request->subject;
                $currentYear = date('Y', time());
                $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
                $contact_details  = Setting::first();
                // $admin_email = $contact_details->email;
                $admin_email = Admin::value('email');
                
                //$admin_email = 'rohan.shekhar@logicspice.com';
                
                //echo "<pre>"; print_r($contact_details);exit;

                $emailTemplate = Emailtemplate::where('id',6)->first();

                $get_lang=DEFAULT_LANGUAGE;
                if( $get_lang =='fra'){
                    $template_subject= $emailTemplate->subject_fra;
                    $template_body= $emailTemplate->template_fra;
                }else if( $get_lang =='de'){
                    $template_subject= $emailTemplate->subject_de;
                    $template_body= $emailTemplate->template_de;
                }else{
                    $template_subject= $emailTemplate->subject;
                    $template_body= $emailTemplate->template;
                }

                $toSubArray = array('[!username!]', '[!email!]', '[!subjectuser!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');
                $fromSubArray = array($username, $email, $subjectbyuser, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $request->subject);

                $subjectToSend = str_replace($toSubArray, $fromSubArray, $template_subject);

                $toRepArray = array('[!username!]', '[!email!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');
                $fromRepArray = array($username, $email, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $request->subject);
                $messageToSend = str_replace($toRepArray, $fromRepArray, $template_body);
             
                //  try {
                    Mail::to($admin_email)->send(new SendMailable($messageToSend, $subjectToSend));
                // } catch(\Exception $e) { 
                //     $msgString=$e->getMessage();
                // }


                $emailTemplate = Emailtemplate::where('id',17)->first();

                $get_lang=DEFAULT_LANGUAGE;
                if( $get_lang =='fra'){
                    $template_subject= $emailTemplate->subject_fra;
                    $template_body= $emailTemplate->template_fra;
                }else if( $get_lang =='ukr'){
                    $template_subject= $emailTemplate->subject_ukr;
                    $template_body= $emailTemplate->template_ukr;
                }else if( $get_lang =='de'){
                    $template_subject= $emailTemplate->subject_de;
                    $template_body= $emailTemplate->template_de;
                }else{
                    $template_subject= $emailTemplate->subject;
                    $template_body= $emailTemplate->template;
                }

                $toSubArray = array('[!username!]', '[!email!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');

                $fromSubArray = array($username, $email, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $request->subject);

                $subjectToSend = str_replace($toSubArray, $fromSubArray, $template_subject);
                $messageToSend = str_replace($toSubArray, $fromSubArray, $template_body);
                
                try {

                    Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
                
                } catch(\Exception $e) {
                    //logger('Notification Exception: ', $e->getMessage(), "\n");
                    
                    $msgString=$e->getMessage();
                }

                $msgString ='Your enquiry has been successfully sent to us!';
                return Response(['response' => $msgString ,'message' => $msgString , 'status'=>200 ],200);
            }
        }else{

            return Response(['response'=>$data, 'message'=>'success','status'=>200],200);

        }

    }

    // public function about_us():Response {
    //     $pageContent = Page::where('static_page_heading','about-us')->first();

    //     return Response(['response' => $pageContent , 'message'=>'success', 'status'=>200 ],200);

    // }
    public function about_us(Request $request):Response {
        $pageContent = Page::where('static_page_heading','about-us')->first();
        $pageContentarray=array();
        
        $lang=$request->language;
        
        if($lang == 'en'){
            
            $pageContentarray['page_title'] =$pageContent->static_page_title;
            $pageContentarray['page_description'] =$pageContent->static_page_description;
        }else if($lang == 'ukr'){
            
            $pageContentarray['page_title'] =$pageContent->static_page_title_ukr;
            $pageContentarray['page_description'] =$pageContent->static_page_description_ukr;
        }else if($lang == 'el'){
            
            $pageContentarray['page_title'] =$pageContent->static_page_title_el;
            $pageContentarray['page_description'] =$pageContent->static_page_description_el;
        }else{
            
            $pageContentarray['page_title'] =$pageContent->static_page_title;
            $pageContentarray['page_description'] =$pageContent->static_page_description;
        }

        
        return Response(['response' => $pageContentarray , 'message'=>'success', 'status'=>200 ],200);

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
        $Blogs = Page::orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('pages')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('pages')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('pages')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->static_page_heading;
            $Blogsarray[$key]['static_page_heading'] = $blog->static_page_heading;
            $Blogsarray[$key]['static_page_title'] = $blog->static_page_title;
            $Blogsarray[$key]['static_page_description'] = $blog->static_page_description;
            $Blogsarray[$key]['static_page_title_ukr'] = $blog->static_page_title_ukr;
            $Blogsarray[$key]['static_page_description_ukr'] = $blog->static_page_description_ukr;
            $Blogsarray[$key]['static_page_title_el'] = $blog->static_page_title_el;
            $Blogsarray[$key]['static_page_description_el'] = $blog->static_page_description_el;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
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

        $AnnouncementData = Page::where('static_page_heading','=',$slug)->first();

      // echo'here'; print_r($AnnouncementData);exit;

            if(!empty($request->all())){
                           
            $rules = array(
                    'static_page_title' => 'required',
                    'static_page_description' => 'required',
                    'static_page_title_ukr' => 'required',
                    'static_page_description_ukr' => 'required',
                    'static_page_title_el' => 'required',
                    'static_page_description_el' => 'required',
                );
                $msgString='';

                $validator = Validator::make($request->all(),$rules);

                $validator->setAttributeNames([
                    'static_page_title' => 'Page Title',
                    'static_page_description' => 'Description',
                    'static_page_title_ukr' => 'Page Title (Ukrainain)',
                    'static_page_description_ukr' => 'Description (Ukrainain)',
                    'static_page_title_el' => 'Page Title (Greek)',
                    'static_page_description_el' => 'Description (Greek)',
                ]);

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    Page::where('static_page_heading',$slug)->update([
                        'static_page_title' => $request->static_page_title,
                        'static_page_description' => $request->static_page_description,
                        'static_page_title_ukr' => $request->static_page_title_ukr,
                        'static_page_description_ukr' => $request->static_page_description_ukr,
                        'static_page_title_el' => $request->static_page_title_el,
                        'static_page_description_el' => $request->static_page_description_el,

                    ]);

                    $msgString = 'Page updated successfully';
                    $AnnouncementData = Page::where('static_page_heading',$slug)->first();
                
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
       $AnnouncementData = Page::where('static_page_heading',$slug)->first();

       if(!empty($AnnouncementData)){
            Page::where('static_page_heading',$slug)->delete();

            $msgString = 'Page deleted successfully';
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

            Page::where('static_page_heading',$slug)->update([
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

            Page::where('static_page_heading',$slug)->update([
                'status' => 0,
            ]);

            return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }

    
}
