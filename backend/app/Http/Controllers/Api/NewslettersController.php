<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Newsletter;
use Illuminate\Support\Str;
use App\Models\Sendmail;
use App\Models\User;

use App\Models\Emailtemplate;
use Mail;
use App\Mail\SendMailable;

class NewslettersController extends Controller
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
        $Blogs = Newsletter::orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('newsletters')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('newsletters')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('newsletters')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['subject'] = $blog->subject;
            $Blogsarray[$key]['message'] = $blog->message;
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
            'subject' => 'required|unique:newsletters,subject',
            'message' => 'required',
        ]);
        $msgString='';

        if ($validator->fails()) {
            $msgString .= implode("<br> - ", $validator->errors()->all());
            return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

        }else {

            Newsletter::create([
                'subject' => $request->subject,
                'message' => $request->message,
                'slug' => $this->createSlug($request->subject,'newsletters'),
                'status' => 1,
            ]);

            $msgString = 'Newsletter Added Successfully';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' => 200],200);
        }
    }

    // public function admin_sendNewsletter(Request $request):Response {
        
    //     $authenticateadmin = $this->adminauthentication();

    //     if(isset($authenticateadmin['id'])){
    //         if($authenticateadmin['id'] != '1'){

    //             $msgString='Sub-Admin do not have access to this path.';
    //             return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    //             exit;
    //         }

    //     }
    //     $msgString = '';
    //     $data=array();
    //     $templates = DB::table('newsletters')
    //         ->select('id','subject')
    //         ->where('status', 1)
    //         ->get();
    //         $data['templates']=$templates;
    
    //     $jobseekerUserList = DB::table('users')
    //         ->select('id','first_name','last_name','email_address')
    //         ->where('status', 1)
    //         ->where('unsubscribe', 0)
    //         ->where('user_type', 'candidate')
    //         ->orderBy('email_address')
    //         ->limit(90)
    //         ->get();
    //     $data['jobseekerUserList']=$jobseekerUserList;

    //     $employerUserList = DB::table('users')
    //         ->select('id','first_name','last_name','email_address')
    //         ->where('status', 1)
    //         ->where('unsubscribe', 0)
    //         ->where('user_type', 'recruiter')
    //         ->orderBy('email_address')
    //         ->limit(90)
    //         ->get();
    //         $data['employerUserList']=$employerUserList;
    
    //     if(!empty($request->all())){
    //         $validator = Validator::make($request->all(), [
    //             'template_id' => 'required',
    //             'usertype' => 'required',
    //         ]);
    //         $msgString='';
    
    //         if ($validator->fails()) {
    //             $msgString .= implode("<br> - ", $validator->errors()->all());
    //             return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    
    //         }else {
    //             $templateId = $request->template_id;
    //             $templateInfo = DB::table('newsletters')
    //                 ->where('id', $templateId)
    //                 ->first();

    //             if ($request->usertype == 'recruiter') {
    //                 $receiptType = trim($request->empstatus);

    //                 switch ($receiptType) {
    //                     case 1:
    //                         $empUserList = DB::table('users')
    //                             ->select('id','email_address')
    //                             ->where('status', 1)
    //                             // ->where('unsubscribe', 0)
    //                             ->where('user_type', 'recruiter')
    //                             ->orderBy('email_address')
    //                             ->get();

    //                         foreach ($empUserList as $user) {

    //                             Sendmail::create([
    //                                 'email' =>$user->email_address,
    //                                 'subject' => $templateInfo->subject,
    //                                 'body' => $templateInfo->message,
    //                             ]);

    //                         }

    //                         break;
    //                     case 2:

    //                         if (!empty($request->employers)) {
    //                             $selectedEmployer1 =  implode(',',$request->employers);
    //                             $selectedEmployer = explode(',',$selectedEmployer1);


    //                         }else{
    //                             $msgString = "-Please select atleast one employer.";
    //                             return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    //                             exit;
                    
    //                         }
    //                         foreach ($selectedEmployer as $user) {
    //                             Sendmail::create([
    //                                 'email' =>$user,
    //                                 'subject' => $templateInfo->subject,
    //                                 'body' => $templateInfo->message,
    //                             ]);
    //                         }

    //                         break;
    //                 }
    //             } elseif ($request->usertype == 'candidate') {
    //                 $receiptType = $request->jobseekstatus;


    //                 switch ($receiptType) {
    //                     case 1:
    //                         $jobseekUserList = DB::table('users')
    //                             ->select('id','email_address')
    //                             ->where('status', 1)
    //                             // ->where('unsubscribe', 0)
    //                             ->where('user_type', 'candidate')
    //                             ->orderBy('email_address')
    //                             ->get();


    //                         foreach ($jobseekUserList as $user) {
    //                             Sendmail::create([
    //                                 'email' =>$user->email_address,
    //                                 'subject' => $templateInfo->subject,
    //                                 'body' => $templateInfo->message,
    //                             ]);
    //                         }

    //                         break;
    //                     case 2:

    //                         if (!empty($request->jobseekers)) {
    //                             $selectedJobseeker1 =  implode(',',$request->jobseekers);
    //                             $selectedJobseeker = explode(',',$selectedJobseeker1);
    //                         }else{
    //                             $msgString = "-Please select atleast one jobseeker.";
    //                             return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    //                             exit;
    //                         }
    //                         foreach ($selectedJobseeker as $user) {
    //                             Sendmail::create([
    //                                 'email' =>$user,
    //                                 'subject' => $templateInfo->subject,
    //                                 'body' => $templateInfo->message,
    //                             ]);
    //                         }

    //                         break;
    //                 }
    //             }

    //         return Response(['response'=>$data , 'message'=>'Newsletter sent to the users successfully.','status'=>200],200);

    //         }
    //     }else{


    //         return Response(['response'=>$data , 'message'=>'sucess','status'=>200],200);

    //     }

    // }
    
    public function admin_sendNewsletter(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $msgString = '';
        $data=array();
        $templates = DB::table('newsletters')
            ->select('id','subject')
            ->where('status', 1)
            ->get();
            $data['templates']=$templates;
    
            $jobseekerUserList = DB::table('users')
            ->select('id','first_name','last_name','email_address')
            ->where('status', 1)
            // ->where('unsubscribe', 0)
            ->where('user_type', 'candidate')
            ->orderBy('email_address')
            ->limit(90)
            ->get();
            

        $data['jobseekerUserList']=$jobseekerUserList;

        $employerUserList = DB::table('users')
            ->select('id','first_name','last_name','email_address')
            ->where('status', 1)
            // ->where('unsubscribe', 0)
            ->where('user_type', 'recruiter')
            ->orderBy('email_address')
            ->limit(90)
            ->get();
            $data['employerUserList']=$employerUserList;
    
        if(!empty($request->all())){
            $validator = Validator::make($request->all(), [
                'template_id' => 'required',
                'usertype' => 'required',
            ]);
            $msgString='';
    
            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    
            }else {
                $templateId = $request->template_id;
                $templateInfo = DB::table('newsletters')
                    ->where('id', $templateId)
                    ->first();

                if ($request->usertype == 'recruiter') {
                    $receiptType = trim($request->empstatus);

                    switch ($receiptType) {
                        case 1:
                            $empUserList = DB::table('users')
                                ->select('id','email_address')
                                ->where('status', 1)
                                // ->where('unsubscribe', 0)
                                ->where('user_type', 'recruiter')
                                ->orderBy('email_address')
                                ->get();

                            foreach ($empUserList as $user) {

                                Sendmail::create([
                                    'email' =>$user->email_address,
                                    'subject' => $templateInfo->subject,
                                    'body' => $templateInfo->message,
                                ]);
                                
                                
                                // Email for newsletter start
                                $emailTemplate = Emailtemplate::where('id',55)->first();
                                
                                $newsletterTemplateId = $request->template_id;
                                $newsletterTemplate = Newsletter::where('id', $newsletterTemplateId)->first();
                                $newsletterTemplateSubject = $newsletterTemplate->subject;
                                $newsletterTemplateMessage = $newsletterTemplate->message;
                                
                                $company_name=$request->company_name;
                                $first_name=$request->first_name;
                                $last_name=$request->last_name;
                                $username=$request->first_name.' '.$request->last_name;
                                $passwordPlain=$request->password;
                                $emailAdmin=$user->email_address;
                                $created=date('Y-m-d H:i:s');
                                $currentYear = date('Y', time());
                                // $link = HTTP_FAV. "users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);;
                                
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
                    
                                $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
                                $toRepArray = array('[!username!]', '[!email!]', '[!password!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]', '[!subject!]', '[!message!]');
                                $fromRepArray = array($username, $emailAdmin, $passwordPlain,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL, $newsletterTemplateSubject, $newsletterTemplateMessage);
                                $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                                $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
                    
                               // print_r($email);exit;
                    
                    
                                try {
                                    Mail::to($emailAdmin)->send(new SendMailable($emailBody, $emailSubject));
                                    Sendmail::where('email', $user->email_address)->update(['is_mail_sent' => '1']);
                    
                                } catch(\Exception $e) {
                                    $msgString=$e->getMessage();
                                }
                                
                                
                                // Email for newsletter end
            

                            }

                            break;
                        case 2:

                            if (!empty($request->employers)) {
                                $selectedEmployer1 =  implode(',',$request->employers);
                                $selectedEmployer = explode(',',$selectedEmployer1);


                            }else{
                                $msgString = "-Please select atleast one employer.";
                                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                                exit;
                    
                            }
                            foreach ($selectedEmployer as $user) {
                                Sendmail::create([
                                    'email' =>$user,
                                    'subject' => $templateInfo->subject,
                                    'body' => $templateInfo->message,
                                ]);
                                
                                // Email for newsletter start
                                $emailTemplate = Emailtemplate::where('id',55)->first();
                                
                                $newsletterTemplateId = $request->template_id;
                                $newsletterTemplate = Newsletter::where('id', $newsletterTemplateId)->first();
                                $newsletterTemplateSubject = $newsletterTemplate->subject;
                                $newsletterTemplateMessage = $newsletterTemplate->message;
                                
                                $company_name=$request->company_name;
                                $first_name=$request->first_name;
                                $last_name=$request->last_name;
                                $username=$request->first_name.' '.$request->last_name;
                                $passwordPlain=$request->password;
                                $emailAdmin=$user;
                                $created=date('Y-m-d H:i:s');
                                $currentYear = date('Y', time());
                                // $link = HTTP_FAV. "users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);;
                                
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
                    
                                $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
                                $toRepArray = array('[!username!]', '[!email!]', '[!password!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]', '[!subject!]', '[!message!]');
                                $fromRepArray = array($username, $emailAdmin, $passwordPlain,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL, $newsletterTemplateSubject, $newsletterTemplateMessage);
                                $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                                $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
                    
                               // print_r($email);exit;
                    
                    
                                try {
                                    Mail::to($emailAdmin)->send(new SendMailable($emailBody, $emailSubject));
                                    Sendmail::where('email', $user)->update(['is_mail_sent' => '1']);
                    
                                } catch(\Exception $e) {
                                    $msgString=$e->getMessage();
                                }
                                
                                
                                // Email for newsletter end
                                
                            }

                            break;
                    }
                } elseif ($request->usertype == 'candidate') {
                    $receiptType = $request->jobseekstatus;


                    switch ($receiptType) {
                        case 1:
                            $jobseekUserList = DB::table('users')
                                ->select('id','email_address')
                                ->where('status', 1)
                                // ->where('unsubscribe', 0)
                                ->where('user_type', 'candidate')
                                ->orderBy('email_address')
                                ->get();


                            foreach ($jobseekUserList as $user) {
                                Sendmail::create([
                                    'email' =>$user->email_address,
                                    'subject' => $templateInfo->subject,
                                    'body' => $templateInfo->message,
                                ]);
                                
                                
                                
                                // Email for newsletter start
                                 $emailTemplate = Emailtemplate::where('id',55)->first();
                                
                                $newsletterTemplateId = $request->template_id;
                                $newsletterTemplate = Newsletter::where('id', $newsletterTemplateId)->first();
                                $newsletterTemplateSubject = $newsletterTemplate->subject;
                                $newsletterTemplateMessage = $newsletterTemplate->message;
                                
                                $company_name=$request->company_name;
                                $first_name=$request->first_name;
                                $last_name=$request->last_name;
                                $username=$request->first_name.' '.$request->last_name;
                                $passwordPlain=$request->password;
                                $emailAdmin=$user->email_address;
                                $created=date('Y-m-d H:i:s');
                                $currentYear = date('Y', time());
                                // $link = HTTP_FAV. "users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);;
                                
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
                    
                                $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
                                $toRepArray = array('[!username!]', '[!email!]', '[!password!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]', '[!subject!]', '[!message!]');
                                $fromRepArray = array($username, $emailAdmin, $passwordPlain,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL, $newsletterTemplateSubject, $newsletterTemplateMessage);
                                $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                                $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
                    
                               // print_r($email);exit;
                    
                    
                                try {
                                    Mail::to($emailAdmin)->send(new SendMailable($emailBody, $emailSubject));
                                    Sendmail::where('email', $user->email_address)->update(['is_mail_sent' => '1']);
                    
                                } catch(\Exception $e) {
                                    $msgString=$e->getMessage();
                                }
                                
                                
                                // Email for newsletter end
                            }

                            break;
                        case 2:

                            if (!empty($request->jobseekers)) {
                                $selectedJobseeker1 =  implode(',',$request->jobseekers);
                                $selectedJobseeker = explode(',',$selectedJobseeker1);
                            }else{
                                $msgString = "-Please select atleast one jobseeker.";
                                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                                exit;
                            }
                            foreach ($selectedJobseeker as $user) {
                                Sendmail::create([
                                    'email' =>$user,
                                    'subject' => $templateInfo->subject,
                                    'body' => $templateInfo->message,
                                ]);
                                
                                
                                // Email for newsletter start
                                 $emailTemplate = Emailtemplate::where('id',55)->first();
                                
                                $newsletterTemplateId = $request->template_id;
                                $newsletterTemplate = Newsletter::where('id', $newsletterTemplateId)->first();
                                $newsletterTemplateSubject = $newsletterTemplate->subject;
                                $newsletterTemplateMessage = $newsletterTemplate->message;
                                $company_name=$request->company_name;
                                $first_name=$request->first_name;
                                $last_name=$request->last_name;
                                $username=$request->first_name.' '.$request->last_name;
                                $passwordPlain=$request->password;
                                $emailAdmin=$user;
                                $created=date('Y-m-d H:i:s');
                                $currentYear = date('Y', time());
                                // $link = HTTP_FAV. "users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);;
                                
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
                    
                                $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
                                $toRepArray = array('[!username!]', '[!email!]', '[!password!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]', '[!subject!]', '[!message!]');
                                $fromRepArray = array($username, $emailAdmin, $passwordPlain,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL, $newsletterTemplateSubject, $newsletterTemplateMessage);
                                $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                                $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
                    
                               // print_r($email);exit;
                    
                    
                                try {
                                    Mail::to($emailAdmin)->send(new SendMailable($emailBody, $emailSubject));
                                    Sendmail::where('email', $user)->update(['is_mail_sent' => '1']);
                    
                                } catch(\Exception $e) {
                                    $msgString=$e->getMessage();
                                }
                                
                                
                                // Email for newsletter end
                            }

                            break;
                    }
                }

            return Response(['response'=>$data , 'message'=>'Newsletter sent to the users successfully.','status'=>200],200);

            }
        }else{


            return Response(['response'=>$data , 'message'=>'sucess','status'=>200],200);

        }

    }
    
    public function admin_emailtest(Request $request ,$slug = null):Response {
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        
        if(!empty($request->all())){
                $validator = Validator::make($request->all(), [
                    'email_formatting' => 'required',
                ]);
                $msgString='';

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    

                    $msgString = 'Newsletter updated successfully';
                    // $AnnouncementData = Newsletter::where('slug',$slug)->first();
                    if($request->email_formatting != "") {
                    // Send newsletter email to check formatting
                    
                    $messsage = $request->message;
                    $subject = $request->subject;
                    $email = $request->email_formatting;
                    $emailTemplate = Emailtemplate::where('id',54)->first();

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


                        $message = nl2br($request->message);
                        $subject = $request->subject;
                        $currentYear = date('Y', time());
                        $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

                        $toSubArray = array('[!MESSAGE!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');

                        $fromSubArray = array($message, HTTP_PATH, SITE_TITLE , $sitelink, SITE_URL , $subject);

                        $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                        $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
                }
                

                    return Response(['response' => "" , 'message'=> $msgString , 'status'=> 200 ],200);
                }
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

        $AnnouncementData = Newsletter::where('slug',$slug)->first();

            if(!empty($request->all())){
                $validator = Validator::make($request->all(), [
                    'subject' => 'required',
                    'message' => 'required',
                ]);
                $msgString='';

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    Newsletter::where('slug',$slug)->update([
                        'subject' => $request->subject,
                        'message' => $request->message,
                    ]);

                    $msgString = 'Newsletter updated successfully';
                    $AnnouncementData = Newsletter::where('slug',$slug)->first();
                    
                

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
       $AnnouncementData = Newsletter::where('slug',$slug)->first();

       if(!empty($AnnouncementData)){
            Newsletter::where('slug',$slug)->delete();

            $msgString = 'Newsletter deleted successfully';
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

            Newsletter::where('slug',$slug)->update([
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

            Newsletter::where('slug',$slug)->update([
                'status' => 0,
            ]);

            return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }


    // public function admin_sentMail(Request $request):Response {

                
    //     $authenticateadmin = $this->adminauthentication();

    //     if(isset($authenticateadmin['id'])){
    //         if($authenticateadmin['id'] != '1'){

    //             $msgString='Sub-Admin do not have access to this path.';
    //             return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    //             exit;
    //         }

    //     }

    //     $Blogs = Sendmail::orderBy('id','desc')->get();

    //     $Blogsarray = array();


    //     if ($request->filled('action')) {
    //         $idList = $request->idList;
    //         if ($idList) {
    //             if ($request->action == 'activate') {
    //                 DB::table('sendmails')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
    //             } elseif ($request->action == 'deactivate') {
    //                 DB::table('sendmails')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
    //             } elseif ($request->action == 'delete') {
    //                 DB::table('sendmails')->whereIn('id', explode(',', $idList))->delete();
                   
    //             }
    //         }
    //     } elseif ($request->filled('name')) {
    //         $name = urldecode(trim($request->name));
    //     }

    //     foreach($Blogs as $key => $blog){

    //         $userData = User::where('email_address',$blog->email)->first();

    //         $Blogsarray[$key]['id'] = $blog->id;
    //         $Blogsarray[$key]['slug'] = $blog->id;
    //         $Blogsarray[$key]['email'] = $blog->email;
    //         $Blogsarray[$key]['subject'] = $blog->subject;
    //         $Blogsarray[$key]['body'] = $blog->body;

    //         if(isset($userData->user_type)){
    //             $usertype=$userData->user_type;
    //         }else{
    //             $usertype='N/A';
    //         }
    //         $Blogsarray[$key]['user_type'] = $usertype;

    //         if($blog->sent_on != '0'){
    //             $sent_on=$blog->sent_on;
    //         }else{
    //             $sent_on='N/A';
    //         }
    //         $Blogsarray[$key]['sent_on'] = $sent_on;

    //         if($blog->is_mail_sent != '0'){
    //             $is_mail_sent='Sent';
    //         }else{
    //             $is_mail_sent='Not Sent';
    //         }

    //         $Blogsarray[$key]['is_mail_sent'] = $is_mail_sent;
    //         $Blogsarray[$key]['status'] = $blog->status;
    //     }

    //     //$data['adminDetails'] = $Blogsarray;

    //     return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    // }
    public function admin_sentMail(Request $request):Response {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $Blogs = Sendmail::orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('sendmails')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('sendmails')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('sendmails')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){

            $userData = User::where('email_address',$blog->email)->first();

            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->id;
            $Blogsarray[$key]['email'] = $blog->email;
            $Blogsarray[$key]['subject'] = $blog->subject;
            $Blogsarray[$key]['body'] = $blog->body;

            if(isset($userData->user_type)){
                $usertype=$userData->user_type;
            }else{
                $usertype='N/A';
            }
            $Blogsarray[$key]['user_type'] = $usertype;

            if($blog->sent_on != '0'){
                $sent_on=$blog->sent_on;
            }else{
                $sent_on='N/A';
            }
            $Blogsarray[$key]['sent_on'] = $sent_on;

            if($blog->is_mail_sent != '0'){
                $is_mail_sent='Sent';
            }else{
                $is_mail_sent='Not Sent';
            }

            $Blogsarray[$key]['is_mail_sent'] = $is_mail_sent;
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    }


    public function admin_deleteSentMail($slug = NULL):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $AnnouncementData = Sendmail::where('id',$slug)->first();
 
        if(!empty($AnnouncementData)){
            Sendmail::where('id',$slug)->delete();
 
             $msgString = 'Deleted successfully';
             return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200  ],200);
        }else{
 
             $msgString = 'No record deleted';
             return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
        }
     }


     public function admin_unsubscriberlist(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $Blogs = User::where('unsubscribe','1')->orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('users')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('users')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('users')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $user_array[$key]['last_name'] = $user->last_name;
            $user_array[$key]['first_name'] = $user->first_name;
            $user_array[$key]['user_type'] = $user->user_type;
            $user_array[$key]['email_address'] = $user->email_address;
            $user_array[$key]['company_name'] = $user->company_name;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }

        //$data['adminDetails'] = $Blogsarray;

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    }
}
