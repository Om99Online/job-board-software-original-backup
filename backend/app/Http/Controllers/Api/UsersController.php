<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Exports\ExportUsers;
use App\Exports\ExportEmployers;
use App\Imports\ImportUsers;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Category;
use App\Models\Location;
use App\Models\Skill;
use App\Models\Certificate;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Specialization;
use App\Models\Course;
use App\Models\User;
use App\Models\Emailtemplate;
use App\Models\Admin;
use App\Models\MailHistory;
use Mail;
use PDF;
use App\Mail\SendMailable;
use App\Models\User_plan;
use App\Models\Job;
use App\Models\Favorite;
use App\Models\Site_setting;
use App\Models\Download;
use App\Models\Plan;
use App\Models\Keyword;
use App\Models\Alert;
use App\Models\Alert_location;
use App\Models\Alert_job;
use App\Models\Job_apply;
use App\Models\Payment;
use Session;
use Validators;
use Dompdf\Dompdf;
// use Excel;

class UsersController extends Controller
{

    public function login(Request $request):Response{

        $status=500;
        $data=array();
        $input = $request->all();
        $rules = array(
            'email' => 'required|email',
            'password' => 'required'
        );
        
        $validator = Validator::make($request->all(),$rules);

        $validator->setAttributeNames([
            'email' => 'Email Address',
            'password' => 'password'
        ]);

        if ($validator->fails()) {
            $msg = $this->validatersErrorString($validator->errors());

        }else{

            $email=$request->email;
            $pass=$request->password;
            
           // print_r($request->email);exit;

            $getuser = User::where('email_address',$request->email)->first();
           // echo '<pre>';print_r($getuser);exit;
            
            if($getuser != ''){

                if($getuser->status == 1){
               
                    if (password_verify($request->password, $getuser->password)) {

                        // $token =  Str::random(30);
                        // User::whereId($getuser->id)->update([
                        //      'web_token' => $token
                        // ]);

                        $payLoad = array(
                            "user_id" => $getuser->id,
                            "time" => time()
                        );
                        $token = $this->setToken($getuser);

                        $user=$this->getUserDetialsById($getuser->id);
                        $user['token']=$token;
                        // print_r($user);exit;
                        
                    
                        $data=['user'=> $user];
                        $msg = 'login successfully!';
                        $status=200;
                        
                        return Response(['response'=>$data , 'message'=>'login successfully!', 'status'=>200],200);
                        exit();
                        

                    }else{
                        if($request->language == "ukr"){
                            $msg = 'Невірний пароль!';
                        } else if($request->language == "el") {
                            $msg = 'Λανθασμένος κωδικός';
                        } else {
                            $msg = 'Invalid password!';
                        }
                    }
                }else{
                    if($request->language == "ukr"){
                        $msg = 'Ваш обліковий запис деактивовано, будь ласка, зв яжіться з адміністратором!';
                    } else if($request->language == "el") {
                        $msg = 'Ο λογαριασμός σας είναι απενεργοποιημένος, Επικοινωνήστε με τον διαχειριστή';
                    } else {
                        $msg = 'Your account is deactivated, please contact to administrator!';
                    }
                }

            }else{
                if($request->language == "ukr"){
                        $msg = 'Недійсна електронна адреса або ви не зареєструвалися в системі!';
                } else if($request->language == "el") {
                        $msg = 'Μη έγκυρη διεύθυνση email ή δεν έχετε εγγραφεί στο σύστημα!';
                } else {
                    $msg = 'Invalid email address or you have not register in system!';
                }
            }
        }
        
        return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);
    }


    public function registration(Request $request):Response{
        $status=500;
        $data=array();
        $input = $request->all();

        $categories  = (new Category)->getCategoryList();
        $data['categories'] = $categories;
        
        $rules = array(
            'email' => 'required|email|unique:users,email_address',
            'user_type' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'password' => 'required|min:8',
            'confirm_password' => 'required|min:8|same:password',
        );
        
        // $validator = Validator::make($request->all(),$rules);

       // $validator = $this->validatersErrorString($validator->errors()); //pehle se commented, not of any use.
       
       if ($request->language == "ukr") {
            $customMessages = [
                'email.required' => 'Обов\'язкове поле Email.',
                'email.email' => 'Недійсна електронна адреса.',
                'email.unique' => 'Цей електронний лист уже використано',
                'user_type.required' => 'Обов\'язкове поле Тип користувача.',
                'first_name.required' => 'Обов\'язкове поле Ім\'я.',
                'last_name.required' => 'Обов\'язкове поле Прізвище.',
                'password.required' => 'Обов\'язкове поле Пароль.',
                'password.min' => 'Мінімальна довжина пароля - 8 символів.',
                'confirm_password.required' => 'Обов\'язкове поле Підтвердження пароля.',
                'confirm_password.min' => 'Мінімальна довжина підтвердження пароля - 8 символів.',
                'confirm_password.same' => 'Поля Пароль та Підтвердження пароля повинні збігатися.',
            ];
        } else if($request->language == "el") {
            $customMessages = [
                'email.required' => 'Το πεδίο Διεύθυνση Email είναι υποχρεωτικό.',
                'email.email' => 'Μη έγκυρη διεύθυνση e-mail.',
                'email.unique' => 'Η διεύθυνση email έχει ήδη ληφθεί.',
                'user_type.required' => 'Απαιτείται το πεδίο Τύπος χρήστη.',
                'first_name.required' => 'Το πεδίο Όνομα είναι υποχρεωτικό.',
                'last_name.required' => 'Το πεδίο Επώνυμο είναι υποχρεωτικό.',
                'password.required' => 'Απαιτείται το πεδίο Κωδικός πρόσβασης.',
                'password.min' => 'Ο κωδικός πρόσβασης πρέπει να αποτελείται από τουλάχιστον 8 χαρακτήρες.',
                'confirm_password.required' => 'Απαιτείται το πεδίο Επιβεβαίωση κωδικού πρόσβασης.',
                'confirm_password.min' => 'Ο κωδικός επιβεβαίωσης πρέπει να αποτελείται από τουλάχιστον 8 χαρακτήρες.',
                'confirm_password.same' => 'Ο κωδικός πρόσβασης και ο κωδικός επιβεβαίωσης πρέπει να ταιριάζουν.',
            ];
        }else {
            $customMessages = [
                'email.required' => 'The Email Address field is required.',
                'email.email' => 'Invalid email address.',
                'email.unique' => 'The Email Address has already been taken.',
                'user_type.required' => 'The User type field is required.',
                'first_name.required' => 'The First name field is required.',
                'last_name.required' => 'The Last name field is required.',
                'password.required' => 'The Password field is required.',
                'password.min' => 'The password must be at least 8 characters.',
                'confirm_password.required' => 'The Confirm password field is required.',
                'confirm_password.min' => 'The confirm password must be at least 8 characters.',
                'confirm_password.same' => 'The password and confirm password must match.',
            ];
        }
        
        $validator = Validator::make($request->all(), $rules, $customMessages);

        $validator->setAttributeNames([
            'email' => 'Email Address',
            'first_name' => 'First name',
            'last_name' => 'Last name',
            'user_type' => 'User type',
            'password' => 'Password',
            'confirm_password' => 'Confirm password',

        ]);

        if ($validator->fails()) {
            $msg = $this->validatersErrorString($validator->errors());
          
        }else{
            $slug=$this->createSlug($request->first_name.' '.$request->last_name,'users');
            //print_r($slug);exit;
            $interest_categories='';
            if($request->interest_categories != ''){
                $interest_categories=implode(',', $request->interest_categories);
            }

            User::insert([
                'user_type'=>$request->user_type,
                'company_name'=>$request->company_name,
                'first_name'=>$request->first_name,
                'last_name'=>$request->last_name,
                'email_address'=>$request->email,
                'password'=> Hash::make($request->password),
                'slug'=>$slug,
                'interest_categories'=>$interest_categories,
                'status'=>'0',
                'activation_status'=>'0',
                'modified'=>date('Y-m-d H:i:s'),
                'created'=>date('Y-m-d H:i:s'),
            ]);

            $User = User::orderBy('id', 'desc')->take(1)->first();
            $userId = $User->id;

            if($request->user_type == "recruiter") {
                $emailTemplate = Emailtemplate::where('id',19)->first();
            } else {
                $emailTemplate = Emailtemplate::where('id',13)->first();
            }
            $company_name=$request->company_name;
            $first_name=$request->first_name;
            $last_name=$request->last_name;
            $username=$request->first_name.' '.$request->last_name;
            $passwordPlain=$request->password;
            $email=$request->email;
            $created=date('Y-m-d H:i:s');
            $currentYear = date('Y', time());
            $link = HTTP_FAV. "users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);;
            
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
            $toRepArray = array('[!username!]', '[!email!]', '[!password!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]');
            $fromRepArray = array($username, $email, $passwordPlain,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL,$link);
            $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
            $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);

           // print_r($email);exit;


            try {
                Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

            } catch(\Exception $e) {
                $msgString=$e->getMessage();
            }
            
            // Email for Admin start
            
            $company_name=$request->company_name;
            $first_name=$request->first_name;
            $last_name=$request->last_name;
            $username=$request->first_name.' '.$request->last_name;
            $passwordPlain=$request->password;
            $emailAdmin=Admin::value('email');
            $created=date('Y-m-d H:i:s');
            $currentYear = date('Y', time());
            $link = HTTP_FAV. "users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);
            
            if($request->user_type == "recruiter") {
                $emailTemplate = Emailtemplate::where('id',37)->first();
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
                $toRepArray = array('[!username!]', '[!email!]', '[!password!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]');
                $fromRepArray = array($username, $email, $passwordPlain,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL,$link);
                $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
    
               // print_r($email);exit;
            }
            if($request->user_type == "candidate") {
                $emailTemplate = Emailtemplate::where('id',36)->first();
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
                $toRepArray = array('[!username!]', '[!email!]', '[!password!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]');
                $fromRepArray = array($username, $email, $passwordPlain,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL,$link);
                $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
    
               // print_r($email);exit;
            }
            
            
            


            // try {
                Mail::to($emailAdmin)->send(new SendMailable($emailBody, $emailSubject));

            // } catch(\Exception $e) {
            //     $msgString=$e->getMessage();
            // }
            
            
            // Email for admin end

            $status=200;
            $msg = 'Register successfully!';

        }

        return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);
    }

    public function myaccount(Request $request):Response{
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
       // $user = $tokenData;
        $status=500;
        $data=array();

        if(!$this->recruiterAccess($user_id)){
            $msg ='incorrect login type';
           // return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }else{
            $status=200;
            $msg = 'Success';
        }


        $myPlan =  (new Plan)->getcurrentplan($user_id);

       // print_r($user_id);exit;
        if(!empty($myPlan)){

            $Plan = Plan::where('id',$myPlan->plan_id)->first();
            $user['plan_name'] = $Plan->plan_name;
            $user['is_plan_active']=1;
        

                $getRemainingFeatures = (new Plan)->getPlanFeature($user_id);
                // $user['AvailbleplanFeature']='';
                if(isset($getRemainingFeatures['availableJobpost'])){
                    $user['AvailbleplanFeature']['availableJobpost'] =$getRemainingFeatures['availableJobpost'];
                }
                if(isset($getRemainingFeatures['availableDownloadCount'])){
                    $user['AvailbleplanFeature']['availableDownloadCount'] =$getRemainingFeatures['availableDownloadCount'];
                }

                if(isset($getRemainingFeatures['availableProfileView'])){
                    $user['AvailbleplanFeature']['availableProfileView'] =$getRemainingFeatures['availableProfileView'];
                }

                if(isset($getRemainingFeatures['searchCandidate'])){
                    $user['AvailbleplanFeature']['searchCandidate'] ='Yes';
                }

        }else{
            $user['plan_name']='';
            $user['is_plan_active']=0;

        }

        $getuser = User::where('id',$user_id)->first();
        
        if( $getuser->company_logo!='' && file_exists(UPLOAD_EMPLOYER_IMAGES_PATH.$getuser->company_logo)){
            $logo = DISPLAY_EMPLOYER_IMAGES_PATH.$getuser->company_logo;
        }else{
            $logo ='';
        }
        
        if($getuser->profile_image != '' ){
           $profile_image = DISPLAY_FULL_PROFILE_IMAGE_PATH.$getuser->profile_image;
        }else{
            $profile_image = '';
        }
            
        $user['email_address']=$getuser->email_address;
        $user['company_name']=$getuser->company_name;
        $user['company_about']=$getuser->company_about;
        $user['position']=$getuser->position;
        $user['first_name']=$getuser->first_name;
        $user['last_name']=$getuser->last_name;
        $user['address']=$getuser->address;
        $user['location']=$getuser->location;
        $user['contact']=$getuser->contact;
        $user['company_contact']=$getuser->company_contact;
        $user['url']=$getuser->url;
        $user['profile_image'] = $profile_image;
        $user['company_logo']=$logo;
 $user['created'] = date('F j, Y', strtotime($getuser->created));
        //echo '<pre>';print_r($user);exit;

         return Response(['response' => $user , 'message' => $msg ,'status'=> $status],200);
    }    
    
    public function editProfile(Request $request):Response{
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $status=200;
        $data=array();
        $msg='';

        $getuser = User::where('id',$user_id)->first();

        if(!$this->recruiterAccess($user_id)){
            $msg ='incorrect login type';
           // return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }else{
            if(!empty($request->all())){
         $input = $request->all();
         $rules = array(
             'company_name' => 'required',
             'company_about' => 'required',
             'position' => 'required',
             'first_name' => 'required',
             'last_name' => 'required',
             'address' => 'required',
             'location' => 'required',
             'contact' => 'required',
             'company_contact' => 'required',
            // 'url' => 'required',
             'position' => 'required',

         );
  
         $validator = Validator::make($input, $rules);
  
         $validator->setAttributeNames([
             'company_name' => 'Company Name',
             'company_about' => 'Company About',
             'first_name' => 'First Name',
             'last_name' => 'Last Name',
             'address' => 'Address',
             'location' => 'Location',
             'contact' => 'Contact',
             'company_contact' => 'Company Contact',
           //  'url' => 'Url',
           //  'company_logo' => 'Company Logo',
             'position' => 'Position',

         ]);
  
         if ($validator->fails()) {
             $msg = $this->validatersErrorString($validator->errors());
           $status=500;
         }else{


                    $old_profile_image=DISPLAY_FULL_PROFILE_IMAGE_PATH.$getuser->profile_image;
                    $logo_company_logo =DISPLAY_EMPLOYER_IMAGES_PATH.$getuser->company_logo;

                    if($request->company_logo != '' && !empty($request->company_logo) && ($logo_company_logo != $request->company_logo)){
                        // if($request->company_logo != ''){
    
                        $file = explode( ";base64,", $request->company_logo);
                        $image_type_pieces = explode( "image/", $file[0] );
                        $image_type = $image_type_pieces[1];
                        $company_logo = Str::random(10).'.'.$image_type;
                        $decoded_string = base64_decode($file[1]);
                        file_put_contents(UPLOAD_EMPLOYER_IMAGES_PATH.$company_logo, $decoded_string);
                    }else{
                        $company_logo =$getuser->company_logo;
                    }
    
    //print_r($request->logo);exit;
    
    
    
    
                    if($request->profile_image != '' && !empty($request->profile_image) && ($old_profile_image != $request->profile_image)){
                        //if($request->profile_image != ''){
                        $file = explode( ";base64,", $request->profile_image);
                        $image_type_pieces = explode( "image/", $file[0] );
                        $image_type = $image_type_pieces[1];
                        $profile_image = Str::random(10).'.'.$image_type;
                        $decoded_string = base64_decode($file[1]);
                        file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$profile_image, $decoded_string);
                    }else{
                        $profile_image = $getuser->profile_image;
                    }
    
       
  
              User::whereId($user_id)->update([
                  'company_name' => $request->company_name,
                  'company_about' => $request->company_about,
                  'first_name' => $request->first_name,
                  'last_name' => $request->last_name,
                  'address' => $request->address,
                  'location' => $request->location,
                  'contact' => $request->contact,
                  'company_contact' => $request->company_contact,
                  'url' => $request->url,
                  'company_logo' => $company_logo,
                  'profile_image' => $profile_image,
                  'position' => $request->position,

              ]);
              $status=200;
              $msg ='Profile details updated successfully.';
            }
         }
         
        }
        

         $getuser = User::where('id',$user_id)->first();
        
        // if( $getuser->company_logo!='' && file_exists(UPLOAD_EMPLOYER_IMAGES_PATH.$getuser->company_logo)){
        //     $logo = DISPLAY_EMPLOYER_IMAGES_PATH.$getuser->company_logo;
        // }else{
        //     $logo ='';
        // }
        
        
                    $data['profile_image'] = '';
                    $data['company_logo'] = '';
            

        
        
        $data['email_address']=$getuser->email_address;
        $data['company_name']=$getuser->company_name;
        $data['company_about']=$getuser->company_about;
        $data['position']=$getuser->position;
        $data['first_name']=$getuser->first_name;
        $data['last_name']=$getuser->last_name;
        $data['address']=$getuser->address;
        $data['location']=$getuser->location;
        $data['contact']=$getuser->contact;
        $data['company_contact']=$getuser->company_contact;
        $data['url']=$getuser->url;
      
        
            if($getuser->profile_image != '' )
                $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$getuser->profile_image;
            else
                $data['profile_image'] = '';
                
            
                
            if($getuser->company_logo != ''){
                $data['company_logo'] = DISPLAY_EMPLOYER_IMAGES_PATH.$getuser->company_logo;
            }
            else{
                $data['company_logo'] = '';
            }
            

          return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);

    }


    public function changePassword(Request $request):Response{

        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $status=500;
        $data=array();

        if(!$this->recruiterAccess($user_id)){
            if($request->language == 'ukr'){
                $msg ='Неправильний тип входу';
            } else if($request->language == 'el') {
                $msg ='Λανθασμένος τύπος σύνδεσης';
            } else {
                $msg ='Incorrect login type';
            }
           // return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }else{
        $input = $request->all();
        $rules = array(
            'old_password' => 'required',
            'new_password' => 'required|min:8',
            'conf_password' => 'required|min:8|same:new_password',
        );

      //  $validator = $this->validatersErrorString($validator->errors());
        $validator = Validator::make($input, $rules);
        $validator->setAttributeNames([
            'old_password' => 'Old Password',
            'new_password' => 'New Password',
            'conf_password' => 'Confirm password',
        ]);

        // if ($validator->fails()) {
        //     $msg = $validator->errors();
        // }else{
        //      $getuser = User::where('id',$user_id)->first();
        //     if (password_verify($request->old_password, $getuser->password)) {
        //         if ((password_verify($request->new_password, $getuser->password))) {

        //             User::whereId($user_id)->update([
        //                 'password'=> Hash::make($request->new_password),
        //             ]);
        //             $msg='Your Password has been changed successfully.';
        //             $status=200;

        //         }else{
        //             if($request->language == 'ukr'){
        //                 $msg='Ви не можете замінити свій старий пароль на новий пароль.';
        //                 $status = 500;
        //             } else if($request->language == 'el') {
        //                 $msg='Δεν μπορείτε να βάλετε τον παλιό σας κωδικό πρόσβασης για τον νέο κωδικό πρόσβασης.';
        //                 $status = 500;
        //             } else {
        //                 $msg='You cannot put your old password for the new password.';
        //                 $status = 500;

        //             }
        //         }

        //     }else{
        //         if($request->language == 'ukr') {
        //             $msg='Поточний пароль неправильний';
        //             $status = 500;
        //         } else if($request->language == 'el') {
        //             $msg='Ο τρέχων κωδικός πρόσβασης δεν είναι σωστός.';
        //             $status = 500;
        //         } else {
        //             $msg='Current Password is not correct.';
        //             $status = 500;
        //         }

        //     }
        // }
        if ($validator->fails()) {
            $msg = $validator->errors();
            // $status = 400; // Bad Request
        } else {
            $getuser = User::find($user_id);
            if (!password_verify($request->old_password, $getuser->password)) {
                if($request->language == 'ukr') {
                    $msg='Поточний пароль неправильний';
                    $status = 500;
                } else if($request->language == 'el') {
                    $msg='Ο τρέχων κωδικός πρόσβασης δεν είναι σωστός.';
                    $status = 500;
                } else {
                    $msg='Current Password is not correct.';
                    $status = 500;
                }
            } elseif (password_verify($request->new_password, $getuser->password)) {
                if($request->language == 'ukr'){
                    $msg='Ви не можете замінити свій старий пароль на новий пароль.';
                    $status = 500;
                } else if($request->language == 'el') {
                    $msg='Δεν μπορείτε να βάλετε τον παλιό σας κωδικό πρόσβασης για τον νέο κωδικό πρόσβασης.';
                    $status = 500;
                } else {
                    $msg='You cannot put your old password for the new password.';
                    $status = 500;

                }
            } else {
                // Update password
                $getuser->password = Hash::make($request->new_password);
                $getuser->save();
                $msg = __('Your Password has been changed successfully.');
                $status = 200; // OK
            }
        }

    }
       // return Response(['response' => $data , 'message' => $msg],200);
        return Response(['response' => $data , 'message' => $msg  ,'status' => $status ],200);

    }

    public function uploadPhoto(Request $request):Response{
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $status=200;
        $data=array();
        $msg = '';

        if(!$this->recruiterAccess($user_id)){
            if($request->language == 'ukr'){
                $msg ='Неправильний тип входу';
            } else if($request->language == 'el') {
                $msg ='Λανθασμένος τύπος σύνδεσης';
            } else {
                $msg ='Incorrect login type';
            }
           // return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }else{
            
            if(!empty($request->all())){
                $input = $request->all();
                $rules = array(
                    // 'profile_image' => 'required',
                );
                
                $validator = Validator::make($request->all(),$rules);
    
                // $validator = $this->validatersErrorString($validator->errors());
    
                $validator->setAttributeNames([
                    'profile_image' => 'Profile Image',
                ]);
    
                if ($validator->fails()) {
                    $msg = $validator->errors();
                    $status=500;
                }else{
                    $getuser = User::where('id',$user_id)->first();
  
                
                    $old_profile_image=DISPLAY_FULL_PROFILE_IMAGE_PATH.$getuser->profile_image;
                    $logo_company_logo =DISPLAY_EMPLOYER_IMAGES_PATH.$getuser->company_logo;

                    if($request->company_logo != '' && !empty($request->company_logo) && ($logo_company_logo != $request->company_logo)){
                        // if($request->company_logo != ''){
    
                        $file = explode( ";base64,", $request->company_logo);
                        $image_type_pieces = explode( "image/", $file[0] );
                        $image_type = $image_type_pieces[1];
                        $company_logo = Str::random(10).'.'.$image_type;
                        $decoded_string = base64_decode($file[1]);
                        file_put_contents(UPLOAD_EMPLOYER_IMAGES_PATH.$company_logo, $decoded_string);
                    }else{
                        $company_logo =$getuser->company_logo;
                    }
    
                    if($request->profile_image != '' && !empty($request->profile_image) && ($old_profile_image != $request->profile_image)){
                        //if($request->profile_image != ''){
                        $file = explode( ";base64,", $request->profile_image);
                        $image_type_pieces = explode( "image/", $file[0] );
                        $image_type = $image_type_pieces[1];
                        $profile_image = Str::random(10).'.'.$image_type;
                        $decoded_string = base64_decode($file[1]);
                        file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$profile_image, $decoded_string);
                    }else{
                        $profile_image = $getuser->profile_image;
                    }
    
                    User::whereId($user_id)->update([
                        'company_logo' => $company_logo,
                        'profile_image' => $profile_image,
                    ]);
                    
                      $msg='Your Image has been Uploaded successfully.';
                        $status=200;
        
                }
            
            }
            
            $getuser = User::where('id',$user_id)->first();
            
            $data['profile_image'] = '';
            
            if($getuser->profile_image != '' )
                $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$getuser->profile_image;
            else
                $data['profile_image'] = '';
                
            $data['company_logo'] = '';
                
            if($getuser->company_logo != ''){
                $data['company_logo'] = DISPLAY_EMPLOYER_IMAGES_PATH.$getuser->company_logo;
            }
            else{
                $data['company_logo'] = '';
            }
          
        }
        return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);


    }
    
    // public function deleteAccount(Request $request):Response{
    //     $tokenData = $this->requestAuthentication('POST', 1);
    //     $user_id = $tokenData['user_id'];
    //     $status=500;
    //     $data=array();

    //     // if(!$this->recruiterAccess($user_id)){
    //     //     $msg ='incorrect login type';
    //     //    // return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
    //     // }else{


    //         $input = $request->all();
    //         $rules = array(
    //             'reason' => 'required',
    //         );
    
    //         $validator = $this->validatersErrorString($validator->errors());
    
    //         $validator->setAttributeNames([
    //             'reason' => 'Reason',
    //         ]);
    
    //         if ($validator->fails()) {
    //             $msg = $validator->errors();
    //         }else{
    //             $getuser = User::where('id',$user_id)->first();

    //             if($getuser->user_type == 'recruiter'){
    //                 $emailTemplate = Emailtemplate::where('id',49)->first();

    //             }else{
    //                 $emailTemplate = Emailtemplate::where('id',50)->first();

    //             }
    //             $adminDetail = Admin::where('id',1)->first();

    //             $company_name=$getuser->company_name;
    //             $first_name=$getuser->first_name;
    //             $last_name=$getuser->last_name;
    //             $username=$getuser->first_name.' '.$getuser->last_name;
    //             $email=$adminDetail->email;
    //             $reason=$request->reason;
    //             $created=date('Y-m-d H:i:s');
    //             $currentYear = date('Y', time());
    //             $link='';
                
    //             $get_lang=DEFAULT_LANGUAGE;
    //             if( $get_lang =='fra'){
    //                 $template_subject= $emailTemplate->subject_fra;
    //                 $template_body= $emailTemplate->template_fra;
    //             }else if( $get_lang =='de'){
    //                 $template_subject= $emailTemplate->subject_de;
    //                 $template_body= $emailTemplate->template_de;
    //             }else{
    //                 $template_subject= $emailTemplate->subject;
    //                 $template_body= $emailTemplate->template;
    //             }
    
    //             $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
    //             $toRepArray = array('[!username!]', '[!email!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!reason!]');
    //             $fromRepArray = array($username, $email,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL, $reason);
                
    //             $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
    //             $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
    
    

    //             try {
    //                 Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

    //             } catch(\Exception $e) {
    //                 $msgString=$e->getMessage();
    //             }

    //             $status=200;
    //             $msg = 'Your account has been deleted successfully.';

    //           User::where('id',$user_id)->delete();
    //         }

    //     //}
    //     return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);

    // }
    
    public function deleteAccount(Request $request):Response{
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $status=200;
        $data=array();
        $msg='';
            
            if(!empty($request->all())){
                $input = $request->all();

               // echo '<pre>: ';print_r($input);exit;

                $rules = array(
                    'reason' => 'required',
                );
                
                $validator = Validator::make($request->all(),$rules);
                $validator->setAttributeNames([
                    'reason' => 'Reason',
                ]);
    
                if ($validator->fails()) {
                    $msg = $validator->errors();
                    $status=500;
                }else{
                    $getuser = User::where('id',$user_id)->first();
                    $userEmail = User::where('id',$user_id)->first()->email_address;
                    
                    $paymentHistoryDeleted = Payment::where('user_id',$user_id)->delete();
                    $userPlanHistory = User_plan::where('user_id',$user_id)->delete();
                    $userAlertHistory = Alert::where('user_id', $user_id)->delete();
                    $userJob = Job::where('user_id', $user_id)->delete();
                    User::where('id',$user_id)->delete();

                    if($getuser->user_type == 'recruiter'){
                        $emailTemplate = Emailtemplate::where('id',49)->first();
    
                    }else{
                        $emailTemplate = Emailtemplate::where('id',50)->first();
    
                    }
                    $adminDetail = Admin::where('id',1)->first();
    
                    $company_name=$getuser->company_name;
                    $first_name=$getuser->first_name;
                    $last_name=$getuser->last_name;
                    $username=$getuser->first_name.' '.$getuser->last_name;
                    $email=$adminDetail->email;
                    $reason=$request->reason;
                    $created=date('Y-m-d H:i:s');
                    $currentYear = date('Y', time());
                    $link='';
                    
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
                    $toRepArray = array('[!username!]', '[!email!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!reason!]');
                    $fromRepArray = array($username, $userEmail,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL, $reason);
                    
                    $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                    $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
        
                    try {
                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
    
                    } catch(\Exception $e) {
                        $msgString=$e->getMessage();
                    }
    
                    $status=200;
                    $msg = 'Your account has been deleted successfully.';
    

                }
            }

       

        return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);

    }

    public function logout(Request $request):Response{
        $status=200;
        $data=array();
        $msg='Logout Successfully.';
        $user = $this->deleteToken();
        return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);
    }

    public function export() 
    {
        return Excel::download(new ExportUsers, 'users.xlsx');
    }

    // public function import(Request $request):Response{

    //     $status=500;
    //     $data=array();
    //     $msg = "";
    //     // $tokenData = $this->requestAuthentication('POST', 1);
    //     // $user_id = $tokenData['user_id'];


    //     // if(!$this->recruiterAccess($user_id)){
    //     //     $msg ='incorrect login type';
    //     // }else{
        
        
    //     if(!empty($request->all())){
            
    //         if($request->file != ''){
    //             $file = explode(';base64',$request->selectedFile);
    //             $fileName = $request->file;
    //             $originalName = '';
    //             if(strstr($file[0],'application/vnd.ms-excel')){
    //                 //.xls
    //                 $originalName = Str::random(4).'-'.$fileName;
    //                 $decoded_string = base64_decode($file[1]);
    //                 file_put_contents(UPLOAD_FILE.$originalName, $decoded_string);
                    
    //             }else
    //             if(strstr($file[0],'application/vnd.openxml')){
    //                 //.xlsx
    //                 $originalName = Str::random(4).'-'.$fileName;
    //                 $decoded_string = base64_decode($file[1]);
    //                 file_put_contents(UPLOAD_FILE.$originalName, $decoded_string);
    //             }
                
    //             Excel::import(new ImportUsers, UPLOAD_FILE.$originalName);
                
    //             $status=200;
    //             $msg='Import Successfully.';
                
    //         }
    //     }

    //             // $input = $request->all();
    //             // $rules = array(
    //             //     'file' => 'required|mimes:xlsx'
    //             // );

    //             // $validator = $this->validatersErrorString($validator->errors());

    //             // $validator->setAttributeNames([
    //             //     'file' => 'XSL File',
    //             // ]);

    //             // if ($validator->fails()) {
    //             //     $msg = $validator->errors();
    //             // }else{
    //             //         $xsl_file=$request->file;

    //             //         //Excel::import(new ImportUsers, request()->file('file'));
    //             //         //return back();
    //             //         Excel::import(new ImportUsers, $xsl_file);
    //             //         // echo 'hello';print_r($dd);exit;

    //             //         $status=200;
    //             //         $msg='Import Successfully.';
    //             // }

    //       // }


    //     return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);
        
    // }
    
    public function import(Request $request): Response
    {
        $status = 500;
        $data = array();
        $msg = "";
        
        print_r($request->file('file'));
    
        if (!empty($request->file('file'))) {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            
            try {
                $file->move(UPLOAD_FILE, $originalName);
                Excel::import(new ImportUsers, UPLOAD_FILE . $originalName);
                $status = 200;
                $msg = 'Import Successfully.';
            } catch (\Exception $e) {
                $msg = $e->getMessage();
            }
        } else {
            $msg = 'No file uploaded.';
        }
    
        return response(['response' => $data, 'message' => $msg, 'status' => $status], 200);
    }


    public function usercheck(Request $request):Response{
        
         $user = $this->verifyToken($request->token);
         
        print_r($user);exit;
        
    }


    public function mailhistory(Request $request):Response{
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
      //  $user = $tokenData;
        $status=500;
        $data=array();



        if(!$this->recruiterAccess($user_id)){
            if($request->language == 'ukr'){
                $msg ='Неправильний тип входу';
            } else if($request->language == 'el') {
                $msg ='Λανθασμένος τύπος σύνδεσης';
            } else {
                $msg ='Incorrect login type';
            }
           // return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }else{

            $mails = MailHistory::with('Sender')->where('to_id',$user_id)
            ->orWhere('from_id',$user_id)
            ->orderBy('id','desc')
            ->get();
            
           // print_r($mails);exit;
            
            
            // foreach($mails as $key => $mail){
            //     $data[$key]['id'] = $mail->id;
            //     $data[$key]['subject'] = $mail->subject;
            //     $data[$key]['message'] = $mail->message;
            //     $data[$key]['created'] = $mail->created;
            //     $data[$key]['user_name'] = $mail->Reciever->company_name ? ucwords($mail->Sender->first_name . ' ' . $mail->Sender->last_name) : ucwords($mail->Reciever->first_name . ' ' . $mail->Reciever->last_name);
            //     $data[$key]['company_name'] = $mail->Sender->company_name ? $mail->Sender->company_name : $mail->Reciever->company_name;
            //     $data[$key]['slug'] = $mail->slug;

            // }
            
            foreach ($mails as $key => $mail) {
                $data[$key]['id'] = $mail->id;
                $data[$key]['subject'] = $mail->subject;
                $data[$key]['message'] = $mail->message;
                $data[$key]['created'] = $mail->created;
            
                // Check if Sender exists
                if ($mail->Sender || $mail->Sender->company_name) {
                    $data[$key]['user_name'] = ucwords($mail->Sender->first_name ? $mail->Sender->first_name . ' ' . $mail->Sender->last_name : "Unknown");
                    $data[$key]['company_name'] = $mail->Sender->company_name ? $mail->Sender->company_name : "Unknown";
                } elseif ($mail->Receiver || $mail->Receiver->company_name) {
                    $data[$key]['user_name'] = ucwords($mail->Receiver->first_name ? $mail->Receiver->first_name . ' ' . $mail->Receiver->last_name : "Unknown");
                    $data[$key]['company_name'] = $mail->Receiver->company_name ? $mail->Receiver->company_name : "Unknown";
                } else {
                    // Handle case where neither Sender nor Receiver exists
                    $data[$key]['user_name'] = "Unknown";
                    $data[$key]['company_name'] = "Unknown";
                }
            
                $data[$key]['slug'] = $mail->slug;
            }
            
            
            $status=200;
            $msg = 'Success';
        }
         return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);
    } 
    
    // public function maildetail($slug = null):Response{

    //     $tokenData = $this->requestAuthentication('POST', 1);

    //     if(isset($tokenData['user_id']))
    //         $userId = $tokenData['user_id'];
    //     else
    //         $userId = '';

    //     if(!$this->recruiterAccess($userId)){
    //         return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
    //     }

    //     $logoImage = Admin::where('id',1)->pluck('logo')->implode(',');

    //     if($logoImage){
    //         $logoImage = DISPLAY_THUMB_WEBSITE_LOGO_PATH.$logoImage;
    //     }

    //     $data['logoImage'] = $logoImage;
    //     $data['display_path'] = DISPLAY_MAIL_PATH;

    //     $mails = MailHistory::with('Sender','Reciever')
    //     ->where('slug',$slug)
    //     ->first();

    //     $jobInfo = Job::where('slug',$mails->slug)->first();

    //     $data['jobInfo'] = $jobInfo;

    //     $data['mails'] = $mails;

    //     return Response(['response' => $data , 'message' => 'success'  ,'status' => 200 ],200);
    // }
    public function maildetail($slug = null):Response{

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $logoImage = Admin::where('id',1)->pluck('logo')->implode(',');

        if($logoImage){
            $logoImage = DISPLAY_THUMB_WEBSITE_LOGO_PATH.$logoImage;
        }

        $data['logoImage'] = $logoImage;

        $mails = MailHistory::with('Sender','Reciever')
        ->where('slug',$slug)
        ->first();
        
                $mailFiles = explode(',', $mails->files);

    $mailImagePaths = [];

    foreach ($mailFiles as $fileName) {
        $mailImagePaths[] = DISPLAY_MAIL_PATH . $fileName;
    }
        
        

        $jobInfo = Job::where('slug',$mails->slug)->first();

        $data['jobInfo'] = $jobInfo;

        $data['mails'] = $mails;
        
        $data['mailImagePaths'] = $mailImagePaths;

        return Response(['response' => $data , 'message' => 'success'  ,'status' => 200 ],200);
    }
    
    public function generateinvoice($slug = null) {

		$tokenData = $this->requestAuthentication('POST', 1);
		$user_id = $tokenData['user_id'];
		// $user_id = 962;

		$user = User::where('id',$user_id)->first();

		$planArray['first_name'] = $user->first_name;
		$planArray['last_name'] = $user->last_name;
		$planArray['contact'] = $user->contact;
		$planArray['address'] = $user->address ? $user->address : "N/A";
		$planArray['email_address'] = $user->email_address ? $user->email_address : "N/A";
		$planArray['company_name'] = $user->company_name ? $user->company_name : "N/A";

		$user_plan = User_plan::where('id',$slug)->first();

		$planArray['start_date'] = $user_plan->start_date;
		$planArray['end_date'] = $user_plan->end_date;
		$planArray['invoice_no'] = $user_plan->invoice_no;
		$planArray['fvalues'] = json_decode($user_plan->fvalues, true);
		$planArray['features'] = explode(',',$user_plan->features_ids);
		$planArray['amount'] = $user_plan->amount;
		
		//print_r($planArray['features']);

		$plan = Plan::where('id',$user_plan->plan_id)->first();
		$planArray['plan_name'] = $plan->plan_name;
		$planArray['type'] = $plan->type;
		$planArray['type_value'] = $plan->type_value;

		$planArray['plan_id'] = $user_plan->plan_id;

		$logoImage = Admin::where('id',1)->pluck('logo')->implode(',');

		if($logoImage != '')
			$planArray['logoImage'] = DISPLAY_JOB_LOGO_PATH.$logoImage;
		else
			$planArray['logoImage'] = '';

		$html = '
		<style>
			body {
				font-family: "Open Sans", sans-serif;
				font-size: 14px;
			}
			.invoice-container {
				width: 700px;
				margin: 0 auto;
				padding: 20px;
				border: 1px solid #ccc;
				border-radius: 10px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			.invoice-header {
				text-align: center;
				font-weight: bold;
				font-size: 18px;
				margin-bottom: 20px;
			}
			.invoice-logo {
				text-align: left;
				margin-bottom: 20px;
			}
			.invoice-logo img {
				max-width: 100px;
			}
			.invoice-details {
				margin-bottom: 20px;
			}
			.invoice-details b {
				display: inline-block;
				width: 150px;
			}
			.invoice-plan {
				text-align: center;
				font-weight: bold;
				font-size: 16px;
				margin-bottom: 20px;
			}
			.invoice-features {
				margin-bottom: 20px;
			}
			.invoice-features img {
				vertical-align: middle;
				margin-right: 5px;
			}
			.invoice-total {
				text-align: right;
				font-weight: bold;
				font-size: 16px;
			}
			.invoice-footer {
				text-align: center;
				font-size: 12px;
				color: #888;
				margin-top: 20px;
			}
		</style>

		<div class="invoice-container">
			<div class="invoice-header">Invoice</div>

			<div class="invoice-logo">
				<img src="'. $planArray['logoImage'] .'" alt="'. SITE_TITLE .'">
			</div>

			<div class="invoice-details">
				<p><b>First Name :</b> '.$planArray['first_name'] .'</p>
				<p><b>Last Name :</b> '. $planArray['last_name'] .'</p>
				<p><b>Contact Number :</b> '. $planArray['contact'] .'</p>
				<p><b>Email Address :</b> '.  $planArray['email_address'] .'</p>
				<p><b>Company Name :</b> '. $planArray['company_name'] .'</p>
				<p><b>Address :</b> '. $planArray['address'] .'</p>
			</div>

			<div class="invoice-details">
				<p><b>Invoice No :</b> '. str_pad($planArray['invoice_no'], 4, '0', STR_PAD_LEFT).strtoupper(' of '). date('d/m/Y', strtotime($planArray['start_date'])) .'</p>
			</div>

			<div class="invoice-plan">Plan: '. $planArray['plan_name'] .'</div>
			<div class=""><b>Plan Details:</b></div>
			<p><b>Plan Start Date :</b> '. $planArray['start_date'] .'</p>
			<p><b>Plan End Date :</b> '. $planArray['end_date'] .'</p>
			<p><b>Plan Validity :</b> '. $planArray['type_value'] .' '. $planArray['type'] .'</p>
			
			
			<div class=""><b>Plan Features:</b></div>
			
			<div class="invoice-features">';

		/*$featureIds = $planArray['features'];
		$fvalues = $planArray['fvalues'];
		$planFeatuersMax = $GLOBALS['planFeatuersMax'];*/
		$planFeatuersDis = $GLOBALS['planFeatuersDis'];
		$planFeatuersHelpText = $GLOBALS['planFeatuersHelpText']; 
		$ddd = '';
		$featureIds = $planArray['features'];
		$fvalues = $planArray['fvalues'];
		$planType = $GLOBALS['planType'];
        $planFeatuersMax = $GLOBALS['planFeatuersMax'];
        $planFeatuers = $GLOBALS['planFeatuers'];
		//$planFeatuersDe = $GLOBALS['planFeatuersDe'];
		//$planFeatuersHelpTextDe = $GLOBALS['planFeatuersHelpTextDe'];
		
		

		$ddd = ''; // Initialize $ddd

		if ($featureIds) {
			foreach ($featureIds as $fid) {
				// Initialize the feature description for each feature
				$featureDescription = $planFeatuers[$fid]; // Add <br> after the feature title

				if (array_key_exists($fid, $fvalues)) {
					if ($fvalues[$fid] == $planFeatuersMax[$fid]) {
						$unlimitedText = ' Unlimited'; // Default to English
						/* Uncomment and adjust the language part if needed
						if($lang == "de"){
							$unlimitedText = ' Unbegrenzt';
						}
						*/
						$featureDescription .= '<b>' . $unlimitedText . '</b><br>'; // Add <br> after the unlimited text
					} else {
						$featureDescription .= ' - ' . $fvalues[$fid] . '<br>'; // Add <br> after the feature value
					}
				}

				// Concatenate each feature's description into $ddd
				$ddd .= $featureDescription;
			}
		}

		$html .= $ddd;


		$html .= '
			</div>

			<div class="invoice-total">
				<p>Total: '.$planArray['amount'] .' '.CURRENCY .'</p>
			</div>

			<div class="invoice-footer">
				<p>Thank you for your business!</p>
			</div>
		</div>';

		// Generate PDF from HTML content
		$pdf = PDF::loadHtml($html);

		// Set paper size (optional)
		$pdf->setPaper('A4', 'landscape');

		$fileName = ucfirst($user->first_name) . '_' . $user->last_name . '_INVOICE_' . date('Y_m_d').'_'.time().'.pdf';

		$pdfPath = UPLOAD_PAYMENT_PDF;

		if (!file_exists($pdfPath)) {
			mkdir($pdfPath, 0777, true);
		}

		$pdf->save($pdfPath . '/' . $fileName);

		$data['invoice'] = DISPLAY_PAYMENT_PDF.$fileName;

		return Response(['response'=>$data , 'message'=>'Your invoice has been generated successfully' ,'status' => 200 ]);
	}
    
    // public function generateinvoice($slug = null) {

    //     $tokenData = $this->requestAuthentication('POST', 1);
    //   $user_id = $tokenData['user_id'];
    //     // $user_id = 962;

    //     $user = User::where('id',$user_id)->first();

    //     $planArray['first_name'] = $user->first_name;
    //     $planArray['last_name'] = $user->last_name;
    //     $planArray['contact'] = $user->contact;
    //     $planArray['address'] = $user->address;
    //     $planArray['email_address'] = $user->email_address;
    //     $planArray['company_name'] = $user->company_name;
    //     // $planArray['address'] = $user->address;

    //     $user_plan = User_plan::where('id',$slug)->first();

    //     $planArray['start_date'] = $user_plan->start_date;
    //     $planArray['invoice_no'] = $user_plan->invoice_no;
    //     $planArray['fvalues'] = json_decode($user_plan->fvalues, true);
    //     $planArray['fetures'] = explode(',',$user_plan->features_ids);
    //     $planArray['amount'] = $user_plan->amount;

    //     $plan = Plan::where('id',$user_plan->plan_id)->first();
    //     $planArray['plan_name'] = $plan->plan_name;
    //     $planArray['type'] = $plan->type;
    //     $planArray['type_value'] = $plan->type_value;

    //     $planArray['plan_id'] = $user_plan->plan_id;

    //     $logoImage = Admin::where('id',1)->pluck('logo')->implode(',');

    //     if($logoImage != '')
    //         $planArray['logoImage'] = DISPLAY_FULL_WEBSITE_LOGO_PATH.$logoImage;
    //     else
    //     $planArray['logoImage'] = '';
        
    //             $html = '<table style="width:700px; font-size:14px; font-family:Open Sans">
    //         <tr>
    //             <td style="line-height: 45px;text-align: center; font-weight: bold;font-size: 18px; width: 550px" colspan="2"> Invoice </td>
    //         </tr>

    //         <tr>
    //             <td style="height: auto;width: 100px">
    //                 <img src="'. $planArray['logoImage'] .'" alt="'. SITE_TITLE .'" >
    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left; height: 20px;" >

    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left" >
    //                 <b>First Name :</b> '.$planArray['first_name'] .'
    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left">
    //                 <b>Last Name :</b> '. $planArray['last_name'] .'
    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left">
    //                 <b>Contact Number :</b> '. $planArray['contact'] .'
    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left">
    //                 <b>Email Address :</b> '.  $planArray['email_address'] .'
    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left">
    //                 <b>Company Name :</b> '. $planArray['company_name'] .'
    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left">
    //                 <b>Address :</b> '. $planArray['address'] .'
    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left; height: 20px;" >

    //             </td>
    //         </tr>
    //         <tr>
    //             <td style="width: 520px;">
    //                 <table  style="width: 100%;text-align: right">
    //                     <tr> <td style="width: 30%">
    //                         </td>
    //                         <td style="width: 70%;text-align: left;font-weight: bold;height: 30px; line-height: 30px;">
    //                             <span style="width: 70%;background-color: #2e79f2">&nbsp;&nbsp;Invoice No : '. str_pad($planArray['invoice_no'], 4, '0', STR_PAD_LEFT).strtoupper('of'). date('d/m/Y', strtotime($planArray['start_date'])) .'&nbsp;&nbsp;</span>  &nbsp;&nbsp;</td>
    //                     </tr>
    //                 </table>
    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2" style="text-align: left; height: 20px;" >

    //             </td>
    //         </tr>
    //         <tr>
    //             <td colspan="2"  style="text-align: center;font-weight: bold;height: 50px;width: 550px;">
    //                 Plan '. $planArray['plan_name'] .'
    //             </td>
    //         </tr>
    //         ';
    //         $plan_id = $planArray['plan_id'];
    //         $plan_name = $planArray['plan_name'];

    //         $planType = $GLOBALS['planType'];
    //         $planFeatuersMax = $GLOBALS['planFeatuersMax'];
    //         $planFeatuers = $GLOBALS['planFeatuers'];
    //         $planFeatuersDis = $GLOBALS['planFeatuersDis'];
    //         $planFeatuersHelpText = $GLOBALS['planFeatuersHelpText'];

    //         $fvalues = $planArray['fvalues'];
    //         $featureIds =  $planArray['fetures'];
    //         $AccessCandidateSearching = 0;
    //         $joncnt = '';
    //         $ddd = '';
    //         if ($featureIds) {
    //             foreach ($featureIds as $fid) {
    //                 $ddd = '<tr><td colspan="2" style="text-align: left" ><img src="'.HTTP_IMAGE . '/front/check.png "> ';
    //                 if (array_key_exists($fid, $fvalues)) {
    //                     if ($fvalues[$fid] == $planFeatuersMax[$fid]) {
    //                         $joncnt = 'Unlimited';
    //                         $ddd .= '<b> Unlimited</b>';
    //                     } else {
    //                         $joncnt = $fvalues[$fid];
    //                         $ddd .= '<b> ' . $fvalues[$fid] . '</b>';
    //                     }
    //                 }

    //                 if (array_key_exists($fid, $planFeatuersHelpText)) {
    //                     $timecnt = $planArray['type_value'] . ' ' . $planArray['type'];
    //                     if ($fid == 1) {
    //                         $farray = array('[!JOBS!]', '[!TIME!]', '[!RESUME!]');
    //                         $toarray = array($joncnt, $timecnt, '');
    //                     } elseif ($fid == 2) {
    //                         $farray = array('[!JOBS!]', '[!TIME!]', '[!RESUME!]');
    //                         $toarray = array('', $timecnt, $joncnt);
    //                     }

    //                     $msgText = str_replace($farray, $toarray, $planFeatuersHelpText[$fid]);
    //                     $disText = '';
    //                 } else {
    //                     $disText = '';
    //                 }
    //                 $ddd .= ' ' . $planFeatuersDis[$fid] . $disText . '</td></tr>';
                    
    //             }
    //         }


    //         $html.= $ddd;

    //         $html.='<tr>
    //             <td colspan="2" style="text-align: left; height: 20px;" >

    //             </td>
    //         </tr>


    //         <tr>
    //             <td style="width: 400px; text-align: right;font-weight: bold;">Total</td>
    //             <td style="text-align: center; width: 100px;">'.$planArray['amount'] .' '.CURRENCY .'</td>
    //         </tr>

    //     </table>';
        

       


    //     // Get HTML content from the request or any other source
    //   // $html = $request->input('html');

    //     // Generate PDF from HTML content
    //     $pdf = PDF::loadHtml($html);

    //     // Set paper size (optional)
    //     $pdf->setPaper('A4', 'landscape');

    //     // Download the PDF file
    //   //  return $pdf->download('example.pdf');
    //   //  echo $html;exit;

    //   // $dompdf = new Dompdf();
        
    //     // $html = view('users.generateinvoice', $planArray)->render(); // Assuming 'invoice_template' is the name of your Blade template

    //   // $dompdf->loadHtml($html);

    //     // $dompdf->loadHtml('users.generateinvoice', $planArray);

    //   // $dompdf->setPaper('A4', 'portrait');

    //     // $dompdf->render();

    //     // $pdfContent = $dompdf->output();

    //     // Save the PDF file to the public folder
    //     // $pdfPath = public_path('pdfs');
    //     // $fileName = 'example.pdf';




    //     // $pdf->render();

    //     // $pdfContent = $pdf->output();
        
    //     $fileName = ucfirst($user->first_name) . '_' . $user->last_name . '_INVOICE_' . date('Y_m_d').'_'.time().'.pdf';

    //     $pdfPath = UPLOAD_PAYMENT_PDF;

    //     if (!file_exists($pdfPath)) {
    //         mkdir($pdfPath, 0777, true);
    //     }

    //     $pdf->save($pdfPath . '/' . $fileName);


    //   //  file_put_contents($pdfPath, $pdfContent);

    //     $data['invoice'] = DISPLAY_PAYMENT_PDF.$fileName;


    //     return Response(['response'=>$data , 'message'=>'Your invoice have been generated successfully' ,'status' => 200 ]);
    // }
    
    
    ///
    
    // public function admin_index(Request $request):Response{
        
    //     $authenticateadmin = $this->adminauthentication();

    //     if(isset($authenticateadmin['id'])){
    //         if($authenticateadmin['id'] != '1'){

    //             $msgString='Sub-Admin do not have access to this path.';
    //             return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    //             exit;
    //         }

    //     }
    //     $userName = '';
    //     $searchByDateFrom = '';
    //     $searchByDateTo = '';

    //     if(!empty($request->all())){
    //         if($request->userName != ''){
    //             $userName = $request->userName;
    //         }

    //         if($request->searchByDateFrom != ''){
    //             $searchByDateFrom = $request->searchByDateFrom;
    //         }

    //         if($request->searchByDateTo != ''){
    //             $searchByDateTo = $request->searchByDateTo;
    //         }

    //         if($request->action != ''){
    //             $idList = $request->idList;
    //             if($idList){
    //                 if($request->action == 'activate'){
    //                     User::whereRaw('id IN ('.$idList.')')->update(['status' => 1]);
    //                 }else
    //                 if($request->action == 'deactivate'){
    //                     User::whereRaw('id IN ('.$idList.')')->update(['status' => 0]);
    //                 }else
    //                 if($request->action == 'delete'){
    //                     User::whereRaw('id IN ('.$idList.')')->delete();
    //                 }
    //             }
    //         }
    //     }

    //     $user = new User;

    //     if($userName != ''){
    //         $user = $user->whereRaw(" (company_name LIKE '%" . addslashes($userName) . "%' OR first_name LIKE '%" . addslashes($userName) . "%' or concat(first_name,' ',User.last_name) LIKE '%" . addslashes($userName) . "%' or email_address LIKE '%" . addslashes($userName) . "%' or last_name LIKE '%" . addslashes($userName) . "%' OR company_name LIKE '%" . addslashes($userName) . "%' ) ");
    //     }

    //     if($searchByDateFrom != ''){
    //         $user = $user->whereRaw(" (Date(User.created)>='$searchByDate_con1' ) ");
    //     }

    //     if($searchByDateTo != ''){
    //         $user = $user->where(" (Date(User.created)<='$searchByDate_con2' ) ");
    //     }


    //     $user = $user->select('first_name',
    //     'last_name',
    //     'email_address',
    //     'company_name',
    //     'position',
    //     'created',
    //     'activation_status',
    //     'company_contact',
    //     'contact',
    //     'address',
    //     'status',
    //     'slug',
    //     'user_type',
    //     'verify',
    //     'url',
    //     'id');

    //     $user = $user->where('user_type','recruiter');
    //     $user = $user->orderBy('id','Desc');
    //     $users = $user->limit(90)->get();
    //     $user_array = array();

    //     foreach($users as $key => $user){

    //         $user_array[$key]['first_name'] = $user->first_name;
    //         $user_array[$key]['last_name'] = $user->last_name;
    //         $user_array[$key]['user_type'] = $user->user_type;
    //         $user_array[$key]['email_address'] = $user->email_address;
    //         $user_array[$key]['company_name'] = $user->company_name;
    //         $user_array[$key]['company_contact'] = $user->company_contact;
    //         $user_array[$key]['contact'] = $user->contact;
    //         $user_array[$key]['address'] = $user->address;
    //         $user_array[$key]['position'] = $user->position;
    //         $user_array[$key]['url'] = $user->url;
    //         $user_array[$key]['created'] = date('F j, Y', strtotime($user->created));
    //         $user_array[$key]['activation_status'] = $user->activation_status;
    //         $user_array[$key]['status'] = $user->status;
    //         $user_array[$key]['id'] = $user->id;
    //         $user_array[$key]['slug'] = $user->slug;
    //         $user_array[$key]['verify'] = $user->verify;

            
    //         $userPlan = User_plan::join('plans','user_plans.plan_id' , '=' , 'plans.id' )
    //         ->where('user_plans.user_id',$user->id)
    //         ->orderBy('user_plans.id','DESC')
    //         ->select('plans.plan_name')
    //         ->first();

    //         if(isset($userPlan->plan_name)){
    //             $user_array[$key]['plan'] = $userPlan->plan_name;

    //         }else{
    //             $user_array[$key]['plan'] = 'N/A';

    //         }
    //     }

    //     $data['user_array'] = $user_array;

    //   // print_r($user_array);exit;

    //     return Response(['response' => $data ,'message' => 'success' ,'status' => 200 ],200);

    // }
    
    public function admin_index(Request $request):Response{
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            // if($authenticateadmin['id'] != '1'){

            //     $msgString='Sub-Admin do not have access to this path.';
            //     return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
            //     exit;
            // }

        }
        $userName = '';
        $searchByDateFrom = '';
        $searchByDateTo = '';

        if(!empty($request->all())){
            if($request->userName != ''){
                $userName = $request->userName;
            }

            if($request->searchByDateFrom != ''){
                $searchByDateFrom = $request->searchByDateFrom;
            }

            if($request->searchByDateTo != ''){
                $searchByDateTo = $request->searchByDateTo;
            }

            if($request->action != ''){
                $idList = $request->idList;
                if($idList){
                    if($request->action == 'activate'){
                        User::whereRaw('id IN ('.$idList.')')->update(['status' => 1]);
                    }else
                    if($request->action == 'deactivate'){
                        User::whereRaw('id IN ('.$idList.')')->update(['status' => 0]);
                    }else
                    if($request->action == 'delete'){
                        User::whereRaw('id IN ('.$idList.')')->delete();
                        
                        // new code to delete related data of every recruiter when they are deleted.
                        // $userId = $user->id;
                        // Delete related jobs
                        Job::whereIn('user_id', explode(',', $idList))->delete();
                        // Delete related payment history
                        Payment::whereIn('user_id', explode(',', $idList))->delete();
                        
                        // Delete related user plan history
                        User_plan::whereIn('user_id', explode(',', $idList))->delete();
                    }
                }
            }
        }

        $user = new User;

        if($userName != ''){
            $user = $user->whereRaw(" (company_name LIKE '%" . addslashes($userName) . "%' OR first_name LIKE '%" . addslashes($userName) . "%' or concat(first_name,' ',User.last_name) LIKE '%" . addslashes($userName) . "%' or email_address LIKE '%" . addslashes($userName) . "%' or last_name LIKE '%" . addslashes($userName) . "%' OR company_name LIKE '%" . addslashes($userName) . "%' ) ");
        }

        if($searchByDateFrom != ''){
            $user = $user->whereRaw(" (Date(User.created)>='$searchByDate_con1' ) ");
        }

        if($searchByDateTo != ''){
            $user = $user->where(" (Date(User.created)<='$searchByDate_con2' ) ");
        }


        $user = $user->select('first_name',
        'last_name',
        'email_address',
        'company_name',
        'position',
        'created',
        'activation_status',
        'company_contact',
        'contact',
        'address',
        'status',
        'slug',
        'user_type',
        'verify',
        'url',
        'id');

        $user = $user->where('user_type','recruiter');
        $user = $user->orderBy('id','Desc');
        $users = $user->get();
        $user_array = array();

        foreach($users as $key => $user){

            $user_array[$key]['first_name'] = $user->first_name;
            $user_array[$key]['last_name'] = $user->last_name;
            $user_array[$key]['user_type'] = $user->user_type;
            $user_array[$key]['email_address'] = $user->email_address;
            $user_array[$key]['company_name'] = $user->company_name;
            $user_array[$key]['company_contact'] = $user->company_contact;
            $user_array[$key]['contact'] = $user->contact;
            $user_array[$key]['address'] = $user->address;
            $user_array[$key]['position'] = $user->position;
            $user_array[$key]['url'] = $user->url;
            $user_array[$key]['created'] = date('F j, Y', strtotime($user->created));
            $user_array[$key]['activation_status'] = $user->activation_status;
            $user_array[$key]['status'] = $user->status;
            $user_array[$key]['id'] = $user->id;
            $user_array[$key]['slug'] = $user->slug;
            $user_array[$key]['verify'] = $user->verify;

            
            $userPlan = User_plan::join('plans','user_plans.plan_id' , '=' , 'plans.id' )
            ->where('user_plans.user_id',$user->id)
            ->orderBy('user_plans.id','DESC')
            ->select('plans.plan_name')
            ->first();

            if(isset($userPlan->plan_name)){
                $user_array[$key]['plan'] = $userPlan->plan_name;

            }else{
                $user_array[$key]['plan'] = 'N/A';

            }
        }

        $data['user_array'] = $user_array;

       // print_r($user_array);exit;

        return Response(['response' => $data ,'message' => 'success' ,'status' => 200 ],200);

    }
    
    public function admin_activateuser($slug = NULL):Response{
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {
            User::where('slug',$slug)->update([
                'status' => 1,
                'activation_status' => 1,
            ]);

            return Response(['response'=>'' ,'message'=>'Employer activated successfully' , 'status'=>200 ],200);
        }
    }

    public function admin_deactivateuser($slug = NULL):Response{
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $this->layout = "";
        if ($slug != '') {
            User::where('slug',$slug)->update([
                'status' => 0,
                'activation_status' => 0,
            ]);

            return Response(['response'=>'' ,'message'=>'Employer deactivated successfully' , 'status'=>200 ],200);
        }
    }

    // public function admin_deleteusers($slug = NULL, $type = NULL):Response{
        
    //     $authenticateadmin = $this->adminauthentication();

    //     if(isset($authenticateadmin['id'])){
    //         if($authenticateadmin['id'] != '1'){

    //             $msgString='Sub-Admin do not have access to this path.';
    //             return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    //             exit;
    //         }

    //     }
    //     if ($slug != '') {
    //         $image = User::where('slug',$slug)->pluck('profile_image')->implode(',');
    //         $user = User::where('slug',$slug);
    //         if($user->delete()){
    //             @unlink(UPLOAD_FULL_PROFILE_IMAGE_PATH . $image);
    //             @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $image);
    //             @unlink(UPLOAD_SMALL_PROFILE_IMAGE_PATH . $image);
    //         }
    //         return Response(['response'=>'', 'message'=>'Employer details deleted successfully' ,'status'=>200]);
    //     }
    // }
    public function admin_deleteusers($slug = NULL, $type = NULL):Response{
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {
            // echo $slug;
            $image = User::where('slug',$slug)->pluck('profile_image')->implode(',');
            $user = User::where('slug',$slug)->first();
            // echo $userId;
            $userId = $user->id;
            $jobsDeleted = Job::where('user_id',$userId)->delete();
            $paymentHistoryDeleted = Payment::where('user_id',$userId)->delete();
            $userPlanHistory = User_plan::where('user_id',$userId)->delete();
            
            if($user->delete()){
                @unlink(UPLOAD_FULL_PROFILE_IMAGE_PATH . $image);
                @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $image);
                @unlink(UPLOAD_SMALL_PROFILE_IMAGE_PATH . $image);
            }
            return Response(['response'=>'', 'message'=>'Employer details deleted successfully' ,'status'=>200]);
        }
    }
    
    public function admin_verifyNow($slug = NULL):Response{
             
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {

            User::where('slug',$slug)->update([
                'verify'=>1
            ]);

           
             return Response(['response'=>'' ,'message'=>'Employer verified successfully' , 'status'=>200 ],200);
        }

    }

    public function admin_deleteUserImage($userSlug = null):Response{
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if (!empty($userSlug)) {

            $userData = User::where('slug',$slug)->first();

            User::where('id',$userData->id)
            ->update([
                'profile_image' => ''
            ]);

            @unlink(UPLOAD_FULL_PROFILE_IMAGE_PATH . $image);
            @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $image);
            @unlink(UPLOAD_SMALL_PROFILE_IMAGE_PATH . $image);

            return Response(['response'=>'' , 'message'=>'Image deleted successfully' ,'status' => 200]);

        }
    }
    
    public function admin_editusers(Request $request , $slug = null):Response{
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $msgString='';
        $changedPassword='';

        if(!empty($request->all())){
            $validator = Validator::make($request->all(), [
                'company_name' => 'required',
                'company_about' => 'required',
                'first_name' => 'required',
                'last_name' => 'required',
                'address' => 'required',
                'contact' => 'required',
                'company_contact' => 'required',
                'confirm_password' => 'same:new_password',
                'status' => 'required',
            ]);


            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    
            }else {

                //$user = User::where('slug',$slug);
                $userdetails = User::where('slug',$slug)->first();

                //if(crypt($request->$new_password, $request->old_password) == $request->old_password){
                   // $msgString .= "- You cannot put old password for the new password!<br>";
               // } else {
                if($request->new_password != ''){
                    $changedPassword = 1;
                    $passwordPlain = $request->new_password;
                    $salt = uniqid(mt_rand(), true);
                  //  $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');
                    $new_password = Hash::make($request->new_password);

                    $password = $new_password;
                }else{
                    $password=$userdetails->password;
                }

                // if($request->profile_image != ''){
                //     $file = explode( ";base64,", $request->profile_image);
                //     if(isset($image_type_pieces[1])){
                //         $image_type_pieces = explode( "image/", $file[0] );
                //         $image_type = $image_type_pieces[1];
                //         $originalName = Str::random(10).'.'.$image_type;
                //         $decoded_string = base64_decode($file[1]);
                //         file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$originalName, $decoded_string);    
                //     } else{
                //         $originalName = $userdetails->profile_image;

                //     }
                    
                        
                // }else{
                //     $originalName = $userdetails->profile_image;
                // }
                
                $originalName = $userdetails->profile_image;
                
                if ($request->profile_image != '') {
                    $file = explode(";base64,", $request->profile_image);
                    if (isset($file[1])) {
                        $image_type_pieces = explode("image/", $file[0]);
                        if (isset($image_type_pieces[1])) {
                            $image_type = $image_type_pieces[1];
                            $originalName = Str::random(10) . '.' . $image_type;
                            $decoded_string = base64_decode($file[1]);
                            if ($decoded_string !== false && file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH . $originalName, $decoded_string) !== false) {
                                $userdetails->profile_image = $originalName;
                                $userdetails->save();
                            } else {
                                $originalName = $userdetails->profile_image;
                            }
                        }
                    }
                } 


                User::where('slug',$slug)->update([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'location' => $request->location,
                    'contact' => $request->contact,
                    'company_name' => $request->company_name,
                    'company_about' => $request->company_about,
                    'url' => $request->url,
                    'address' => $request->address,
                    'company_contact' => $request->company_contact,
                    'contact' => $request->contact,
                    'position' => $request->position,
                    'password' => $password,
                    'profile_image' => $originalName,
                    'status' => $request->status
                ]);


                    if ($changedPassword == 1) {

                        $email = $request->email_address;
                        $username = ucwords($request->first_name . ' ' . $request->last_name);
                        $firstname = $request->first_name;

                        $currentYear = date('Y', time());

                        $emailTemplate = Emailtemplate::where('id',29)->first();

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

                        $toSubArray = array('[!username!]', '[!company_name!]', '[!email!]', '[!password!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_URL!], [!first_name!]');

                        $fromSubArray = array($username, $request->company_name, $email, $passwordPlain, $currentYear, HTTP_PATH, SITE_TITLE, SITE_URL, $firstname);

                        $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                        $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                       

                        try {
                            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
        
                        } catch(\Exception $e) {
                            $msgString=$e->getMessage();
                        }

                    }

                    return Response(['response' => 'Employer detials updated successfully.' , 'message' => 'success' , 'status' => 200],200);

            }
        }else{
            $user = user::where('slug',$slug)->first();

            $data['user'] = $user;
            if($user->profile_image != '' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$user->profile_image)){
                $data['user']['profile_image'] =  DISPLAY_FULL_PROFILE_IMAGE_PATH.$user->profile_image;

            }else{
                $data['user']['profile_image'] = '';

            }
            return Response(['response'=>$user , 'message' => 'success' , 'status'=>200 ],200);
        }
    }

    public function admin_addusers(Request $request):Response{
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $msgString='';
        if(!empty($request->all())){
            $validator = Validator::make($request->all(), [
                'company_name' => 'required',
                'company_about' => 'required',
                'position' => 'required',
                'first_name' => 'required',
                'last_name' => 'required',
                'address' => 'required',
                'contact' => 'required',
                'company_contact' => 'required',
                'email_address' => 'required|unique:users,email_address',
                'password' => 'required',
                'confirm_password' => 'required|same:password',
                'location' => 'required',
            ]);


            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    
            }else {


                if($request->profile_image != ''){
                    $file = explode( ";base64,", $request->profile_image);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    $originalName = Str::random(10).'.'.$image_type;
                        $decoded_string = base64_decode($file[1]);
                        file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$originalName, $decoded_string);
                        
                }else{
                    $originalName = '';
                }

                $user = array();

                $user =  new User;

                $passwordPlain = $user->password;
                $salt = uniqid(mt_rand(), true);
                //$new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');
                $new_password = Hash::make($request->password);

                $user->password = $new_password;
                $user->first_name = trim($request->first_name);
                $user->last_name = trim($request->last_name);
                $user->status = 1;
                $user->activation_status = 1;
                $user->home_page_deleted = 1;
                $user->home_slider = 0;
                $user->user_type = 'recruiter';
                $user->slug = $this->createSlug(trim($request->first_name).' '.trim($request->last_name),'users');
                $user->company_name = $request->company_name;
                $user->company_about = $request->company_about;
                $user->position = $request->position;
                $user->location = $request->location;
                $user->url = $request->company_website;
                $user->address = $request->address;
                $user->contact = $request->contact;
                $user->company_contact = $request->company_contact;
                $user->email_address = $request->email_address;
                $user->profile_image = $originalName;
                User::where('id',$user->id)->update(['url' => $request->company_website]);
                
                if($user->save()){

                    $email = $request->email_address;
                    $username = $request->first_name .' ' . $request->last_name;
                    $firstname = $request->first_name;

                    $currentYear = date('Y', time());

                    $emailTemplate = Emailtemplate::where('id',29)->first();

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

                    $toSubArray = array('[!username!]', '[!company_name!]', '[!email!]', '[!password!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_URL!], [!first_name!]');

                    $fromSubArray = array($username, $request->company_name, $email, $passwordPlain, $currentYear, HTTP_PATH, SITE_TITLE, SITE_URL, $firstname);

                    $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                    $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);


                    try {
                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                    } catch(\Exception $e) {
                        $msgString=$e->getMessage();
                    }
                    return Response(['response' => 'User details added successfully.' , 'message'=>'success' , 'status'=>200 ]);


                }

            }
        }
        return Response(['response' => '' , 'message'=>'success' , 'status'=>200 ]);

    }
    
    public function admin_updateeployerorder(Request $request):Response{
        
        User::where('id',$request->id)
        ->update([
            'display_order' => $request->order
        ]);
        
        $msgString='success';
        return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 200],200);
        exit;
        
    }
    
    public function admin_addemployertoslider(Request $request):Response{
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }
        }
        
        if(!empty($request->all())){
            User::where('id',$request->value)
            ->update([
                'home_slider' => 1,
                'home_page_deleted' => 0
            ]);
        }
            $employerlist = User::where('home_page_deleted' , 1)
            ->where('home_slider',0 )
            ->where('activation_status' , 1 )
            ->where('user_type','recruiter')
            ->where('status' , 1)
            ->where('profile_image','<>','')
            ->select('id', DB::raw('CONCAT(first_name, " ", last_name) as name'))
            ->get()
            ->toArray();
            
           
            

        return Response(['response' => $employerlist , 'message' => 'success', 'status'=> 200],200);
        exit;
    }

    public function admin_selectforslider(Request $request):Response{
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        if(!empty($request->all())){

            if($request->action != ''){
                $idList = $request->idList;
                if($idList){
                    if($request->action == 'activate' ){
                        User::whereIn('id',$idList)
                        ->update([
                            'home_slider' => 1
                        ]);
                    }
                    elseif($request->action == 'deactivate'){
                        User::whereIn('id',$idList)
                        ->update([
                            'home_slider' => 0
                        ]);
                    }
                    elseif($request->action == 'delete'){
                        User::whereIn('id',$idList)
                        ->update([
                            'home_slider' => 0,
                            'home_page_deleted' => 1
                        ]);
                    }
                }
            }

        }

        $users = User::where('user_type','recruiter')
        ->where('activation_status' , 1 )
        ->where('status' , 1)
        ->where('profile_image','<>','')
        ->where('home_page_deleted',0)
        ->orderBy('display_order','ASC')
        ->get();

        $userDetails=array();

        //$data['Details'] = $userDetails;
        foreach($users as $key => $user){
            $userDetails[$key]['id'] = $user->id;
            $userDetails[$key]['slug'] = $user->slug;
            $userDetails[$key]['company_name'] = $user->company_name;
            $userDetails[$key]['position'] = $user->position;
            $userDetails[$key]['full_name'] = $user->first_name.' '.$user->last_name;


            // if($user->company_logo != ''){
            //     $logo = DISPLAY_EMPLOYER_IMAGES_PATH.$user->company_logo;
            // }
            // else{
            //     $logo= '';
            // }

            // $userDetails[$key]['company_logo'] = $logo;

            if($user->profile_image != ''){
                $logo = DISPLAY_FULL_PROFILE_IMAGE_PATH.$user->profile_image;
            }
            else{
                $logo= '';
            }

            $userDetails[$key]['profile_image'] = $logo;
            $userDetails[$key]['location'] = $user->location;
            $userDetails[$key]['address'] = $user->address;
            $userDetails[$key]['company_contact'] = $user->company_contact;
            $userDetails[$key]['contact'] = $user->contact;
            $userDetails[$key]['email_address'] = $user->email_address;
            $userDetails[$key]['created'] = date('M d, Y',strtotime($user->created));
            $userDetails[$key]['home_slider'] = $user->home_slider;
            $userDetails[$key]['display_order'] = $user->display_order;

        }
        return Response(['response' => $userDetails , 'message'=> 'success' , 'status' => 200],200);

    }

    public function admin_activateslider($slug = NULL):Response{
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {

            User::where('slug',$slug)
            ->update([
                'home_slider' => 1
            ]);

            return Response(['response' => '' , 'message' => 'activated slider successfully' , 'status' => 200 ],200);
        }
    }

    public function admin_deactivateslider($slug = NULL) {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $this->layout = "";
        if ($slug != '') {

            User::where('slug',$slug)
            ->update([
                'home_slider' => 0
            ]);

            return Response(['response' => '' , 'message' => 'deactivated slider successfully' , 'status' => 200 ],200);
        }
    }
    public function admin_generatecsv(){

        return Excel::download(new ExportEmployers, 'All_Employers_'.time().'.xlsx');

    }
    
    
    public function importjobseekers(Request $request) {
        // Validate the request
        // $request->validate([
        //     'file' => 'required|mimes:xls,xlsx,csv,txt', // Ensure the uploaded file is a CSV or Excel file
        // ]);
    
        // Handle file upload
        $file = $request->file('file');
    
        // Read the file using Laravel Excel
        $jobSeekers = Excel::toArray([], $file);
    
        // Loop through each row and extract the name
        foreach ($jobSeekers[1] as $row) {
            // Assuming the name is in the first column
            $name = $row[1]; // Assuming the name is in the first column, so index 0
    
            // Create a new JobSeeker instance and save it to the database
            User::create(['first_name' => $name]);
        }
    
        // Return a success response
        return response()->json(['message' => 'Job seekers imported successfully'], 200);
    }
    



        // *************** App api ********************

        public function apps_login(Request $request) {
            $this->requestAuthentication('POST', 2);
    
            // $jsonStr = $_POST['jsonData'];
            // $userData = json_decode($jsonStr, true);
    
            $userData = $request->all();
    
    
            $email_address = $userData['email_address'];
            $password = $userData['password'];
            $type = $userData['type'];
            $device_id = $userData['device_id'];
            $device_type = $userData['device_type'];
    
    
            $userCheck = User::where('email_address', $email_address)
            ->where('user_type','recruiter')
            ->first();
    
    
            $response = '';
            $message = 'Invalid email and/or password.';
            $status = 500;
    
           // if (!empty($userCheck) && crypt($password, $userCheck->password) == $userCheck->password) {
                if (password_verify($password, $userCheck->password)) {

                if ($userCheck->status == 1 && $userCheck->activation_status == 1) {
                    if ($type == 'recruiter') {
                        // $payLoad = array(
                        //     "user_id" => $userCheck['User']['id',
                        //     "time" => time()
                        // );
                        // $token = $this->setToken($payLoad);
                        // $userCheck['User']['token'] = $token;
    
                        $data = $this->logindata($userCheck);
                        User::where('id', $userCheck->id)->update(array('device_type' => $device_type, 'device_id' => $device_id));
    
                        $response = $data;
                        $message = 'login sucessfully';
                        $status = 200;
                    } else {
                        $response = '';
                        $message = 'Invalid email and/or password';
                        $status = 500;
                    }
                } else {
                    if ($userCheck->activation_status == 0) {
                        $response = '';
                        $message = 'Please check you mail for activation link to activate your account.';
                        $status = 500;
                    } else {
                        $response = '';
                        $message = 'Your account might have been temporarily disabled. Please contact us for more details.';
                        $status = 500;
                    }
                }
            } else {
                $response = '';
                $message = 'Invalid email and/or password.';
                $status = 500;
            }
            
            return Response(['response'=> $response , 'message'=>$message , 'status'=>$status],200);
        }

    
        public function logindata($userCheck) {
    
            $data = array();
            $data['user_id'] = $userCheck->id;
            $data['user_type'] = $userCheck->user_type;
            $data['first_name'] = $userCheck->first_name;
            $data['last_name'] = $userCheck->last_name;
            $data['email_address'] = $userCheck->email_address;
            
            $data['profile_image'] = "";
            if($userCheck->profile_image!='' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image))
                $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image;
                
            $data['video'] = '';
            if(file_exists(UPLOAD_VIDEO_PATH.$userCheck->video))
                $data['video'] = $userCheck->video;
            
            $token = $this->setToken($userCheck);
            $data['token'] = $token;
            return $data;
        }

        public function forgotPassword(Request $request) {
            $this->requestAuthentication('POST', 2);
    
            $userData = $request->all();
            $status=200;
            $response='';

            $site_title = '';
            $email_address = isset($userData['email_address']) ? $userData['email_address'] : $userData['email'];
    
            $userCheck = User::where('email_address' , $email_address)->first();
    
            if (!empty($userCheck)) {
    
    
                $email = $userCheck->email_address;
                $username = $userCheck->first_name;
    
                User::where('id',$userCheck->id)
                ->update([
                    'forget_password_status' => 1
                ]);

                $email = $userCheck->email_address;

                $link = HTTP_PATH_ROUTE . "/candidates/resetPassword/" . $userCheck->id . "/" . md5($userCheck->id) . "/" . urlencode($email);

                $currentYear = date('Y', time());

                $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

                $emailTemplate = Emailtemplate::where('id',4)->first();

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

                $toSubArray = array('[!username!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!activelink!]');
                $fromSubArray = array($username, HTTP_PATH, SITE_TITLE, $link);

                $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
                
                if($request->language == 'ukr'){
                    $message= 'На вашу електронну адресу надіслано посилання для зміни пароля';
                    $status = 200;
                } else if($request->language == 'el') {
                    $message= 'Ένας σύνδεσμος για την επαναφορά του κωδικού πρόσβασής σας στάλθηκε στη διεύθυνση email σας';
                    $status = 200;
                } else {
                    $message= 'A link to reset your password was sent to your email address';
                    $status = 200;
                }

            } else {
                if($request->language == 'ukr') {
                    $message= 'Ваша електронна адреса не зареєстрована в'. ' ' . SITE_TITLE .', Будь ласка, введіть правильний email або зареєструйтеся на ' . SITE_TITLE;
                    $status = 500;
                } else if($request->language == 'el') {
                    $message= 'Το email σας δεν είναι καταχωρημένο με'. ' ' . SITE_TITLE .', Εισαγάγετε το σωστό email ή εγγραφείτε ' . SITE_TITLE;
                    $status = 500;
                } else {
                    $message= 'Your email is not registered with'. ' ' . SITE_TITLE .', Please enter correct email or register on ' . SITE_TITLE;
                    $status = 500;
                }
            }

            return Response(['response'=> $response , 'message'=>$message , 'status'=>$status],200);

            exit;
        }

        public function apps_forgotPassword(Request $request) {
            $this->requestAuthentication('POST', 2);
    
            $userData = $request->all();
    

            $site_title = '';
            $email_address = isset($userData['email_address']) ? $userData['email_address'] : $userData['email'];
    
            $userCheck = User::where('email_address' , $email_address)->first();
    
            if (!empty($userCheck)) {
    
    
                $email = $userCheck->email_address;
                $username = $userCheck->first_name;
    
                User::where('id',$userCheck->id)
                ->update([
                    'forget_password_status' => 1
                ]);

                $email = $userCheck->email_address;

                //$link = HTTP_PATH_ROUTE . "/candidates/resetPassword/" . $userCheck->id . "/" . md5($userCheck->id) . "/" . urlencode($email);
                $link = HTTP_PATH_ROUTE . "/candidates/resetPassword/" . $userCheck->id . "/" . md5($userCheck->id) . "/" . urlencode($email);

                $currentYear = date('Y', time());

                $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

                $emailTemplate = Emailtemplate::where('id',4)->first();

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

                $toSubArray = array('[!username!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!activelink!]');
                $fromSubArray = array($username, HTTP_PATH, SITE_TITLE, $link);

                $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                echo $this->successOutput('A link to reset your password was sent to your email address');
            } else {
                echo $this->errorOutputResult('Your email is not registered with'. ' ' . SITE_TITLE .', Please enter correct email or register on ' . SITE_TITLE);
            }
            exit;
        }

        public function apps_signup(Request $request) {
            $this->requestAuthentication('POST', 2);

            $data["User"] = $request->all();
    
            $newUser = new User;
    
            if ($data["User"]['user_type'] == 'recruiter') {
                if (($newUser)->isRecordUniqueemail($data["User"]["email_address"]) == false) {
                   echo $this->errorOutputResult('Email already exists.');
                    exit;
                }


                $rules = array(
                    'email_address' => 'required|email|unique:users,email_address',
                    'user_type' => 'required',
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'company_name' => 'required',

                    'password' => 'required|min:8',
                    //'confirm_password' => 'required|min:8|same:password',
                );
                
                $validator = Validator::make($request->all(),$rules);
        
               // $validator = $this->validatersErrorString($validator->errors());
        
                $validator->setAttributeNames([
                    'email_address' => 'Email Address',
                    'first_name' => 'First name',
                    'last_name' => 'Last name',
                    'user_type' => 'User type',
                    'password' => 'Password',
                    'company_name' => 'Company Name',

                    //'confirm_password' => 'Confirm password',
        
                ]);
        
                if ($validator->fails()) {
                    $msg = $this->validatersErrorString($validator->errors());
                    echo $this->errorOutputResult($msg);
                    exit;
                }else{

                        $passwordPlain = $data["User"]["password"];
            
                        $salt = uniqid(mt_rand(), true);
                       // $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');
                $new_password = Hash::make($request->password);

                        $newUser->password = $new_password;
                        $newUser->first_name = trim($data['User']['first_name']);
                        $newUser->last_name = trim($data['User']['last_name']);
                        $newUser->email_address = trim($data["User"]["email_address"]);
                        $newUser->company_name = trim($data["User"]["company_name"]);
                        $newUser->slug = $this->createSlug(trim(strtolower($data['User']['first_name'])) . ' ' . trim(strtolower($data['User']['last_name'])), 'users', 'slug');
                        $newUser->country_id = 1;
                        $newUser->activation_status = 0;
                        $newUser->status = 0;
                        $newUser->user_type = 'recruiter';
            
            
            
                        if($newUser->save()){

                            $emailTemplate = Emailtemplate::where('id',13)->first();

                            $user = User::where('email_address',$data["User"]["email_address"])->first();
                            $userId=$user->id;
                            $company_name=$user->company_name;
                            $first_name=$user->first_name;
                            $last_name=$user->last_name;
                            $username=$user->first_name.' '.$user->last_name;
                            $passwordPlain=$user->password;
                            $email=$user->email;
                            $created=date('Y-m-d H:i:s');
                            $currentYear = date('Y', time());
                            $link = HTTP_FAV. "users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);;
                            
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
                            $toRepArray = array('[!username!]', '[!email!]', '[!password!]','[!company_name!]', '[!created!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]');
                            $fromRepArray = array($username, $email, $passwordPlain,$company_name, $created, $currentYear, HTTP_PATH, SITE_TITLE, SITE_LINK, SITE_URL,$link);
                            $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                            $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);
        
        
        
                            try {
                                Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
        
                            } catch(\Exception $e) {
                                $msgString=$e->getMessage();
                            }
    
                            echo $this->successOutput('Your account is successfully created.Please check your email for activation link. Thank you!');
                        }
                }

            }else{
                echo $this->errorOutputResult('User Type should be Employer!');
                exit;
            }
            exit;
        }


        public function apps_changepassword(Request $request) {
            $tokenData = $this->requestAuthentication('POST', 1);

            $userId = $tokenData['user_id'];

            $status=500;
            $data=array();
    
        
            $input = $request->all();
            $rules = array(
                'old_password' => 'required',
                'new_password' => 'required|min:8',
                'conf_password' => 'required|min:8|same:new_password',
            );
    
          //  $validator = $this->validatersErrorString($validator->errors());
            $validator = Validator::make($input, $rules);
            $validator->setAttributeNames([
                'old_password' => 'Old Password',
                'new_password' => 'New Password',
                'conf_password' => 'Confirm password',
            ]);
    
            if ($validator->fails()) {
                $msg = $validator->errors();
                echo $this->errorOutputResult($msg);
                exit;
            }else{
                 $getuser = User::where('id',$userId)->first();
                if (password_verify($request->old_password, $getuser->password)) {
                    if (!(password_verify($request->new_password, $getuser->password))) {
    
                        User::whereId($userId)->update([
                            'password'=> Hash::make($request->new_password),
                        ]);
                        $msg='Your Password has been changed successfully.';
                        $status=200;
    
                    }else{
                        $msg='You cannot put your old password for the new password.';
                        echo $this->errorOutputResult($msg);
                        exit;
                    }
    
                }else{
                    $msg='Current Password is not correct.';
                    echo $this->errorOutputResult($msg);
                    exit;
                }
            }
            echo $this->successOutputResult($msg,$data);
            exit;  
    
        }


        public function apps_dashboard(Request $request) {
            $tokenData = $this->requestAuthentication('GET', 1);

            $userId = $tokenData['user_id'];

            $status=500;
            $data=array();


                    $jobCount = Job::where('user_id', $userId)->count();
                    $favoriteCount = Favorite::where('user_id', $userId)->count();

                    $userPlan = (new Plan)->getcurrentplan($userId);
// echo $this->successOutputResult('success',$userId);
//             exit; 
                    

                    $today = date('Y-m-d');

            
                    $data = [
                        'is_plan' => 0,
                        'is_expire' => 0,
                        'favorite_count' => $favoriteCount,
                        'job_count' => $jobCount,
                        'plan_id' => "",
                        'plan_name' => "",
                        'app_payment' => '0',
                        'is_job_post' => 0,
                        'is_resume_download' => 0,
                        'is_search_candidate' => 0,
                    ];

                    $maxJobPost = '';
                    $user_plan_id = null;


                    if($userPlan != ''){
                        $data['is_plan'] = 1;

                        if ($userPlan->is_expire == 1 || $userPlan->end_date < $today) {
                            $data['is_expire'] = 1;
                        }

                        $myPlan = Plan::where('id',$userPlan->plan_id)->first();

                        $data['plan_id'] = $myPlan->id;
                        $data['plan_name'] = $myPlan->plan_name;
                        $user_plan_id = $myPlan->id;


                        $getRemainingFeatures = (new Plan)->getPlanFeature($userId);

                        if($getRemainingFeatures['availableJobpost'] > 0){
                            $data['is_job_post'] =1;
                        }
                        
                        if($getRemainingFeatures['availableDownloadCount'] > 0){
                            $data['is_resume_download'] =1;
                        }

                        if($getRemainingFeatures['searchCandidate'] > 0){
                            $data['is_search_candidate'] =1;
                        }

                    }


                    //echo '<pre>';print_r($getRemainingFeatures);exit;

                    $siteSetting = Site_setting::find(1);
                    $data['app_payment'] = $siteSetting ? $siteSetting->app_payment : '0';

          
            echo $this->successOutputResult('success',$data);
            exit;  
        }

        public function apps_viewprofile(Request $request) {
            $tokenData = $this->requestAuthentication('GET', 1);

            $userId = $tokenData['user_id'];

            $status=500;
            $data=array();

            $userCheck = User::find($userId);
            $data = [];
        
            if ($userCheck) {
                $data['user_id'] = $userCheck->id;
                $data['user_type'] = $userCheck->user_type;
                $data['first_name'] = $userCheck->first_name;
                $data['last_name'] = $userCheck->last_name;
                $data['email_address'] = $userCheck->email_address;
                $data['location'] = $userCheck->location;
                $locations = Location::where('id',$userCheck->location)
                ->first();
                if(isset($locations->location)){
                    $data['location_name'] =$locations->location;

                }else{
                $data['location_name'] ='N/A';

                }
        
                $data['contact'] = $userCheck->contact;
                $data['address'] = $userCheck->address;
                $data['position'] = $userCheck->position;
                $data['url'] = $userCheck->url;
        
                $data['company_name'] = $userCheck->company_name;
                $data['company_contact'] = $userCheck->company_contact;
                $data['company_about'] = $userCheck->company_about;
                if( $userCheck->profile_image!='' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image))
                $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image;
                else
                $data['profile_image'] = '';
                // $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image; //$userCheck->profile_image;
                $data['contact_person'] = $userCheck->contact_person;

            }

            echo $this->successOutputResult('success',$data);
            exit;  
        }


        public function apps_changeprofilepic(Request $request) {
            $tokenData = $this->requestAuthentication('POST', 1);
            $userId = $tokenData['user_id'];
    
            $UseroldImage = User::where('id',$userId)
            ->first();
    
            $msg='Success';

                    $input = $request->all();
                    $rules = array(
                        'image' => 'required',
                    );
                    $validator = Validator::make($request->all(),$rules);
        
                    $validator->setAttributeNames([
                        'image' => 'Profile Image',
                    ]);
        
                if ($validator->fails()) {
                    $msg = $validator->errors();
                    echo $this->errorOutputResult($msg);
                    exit;
                }else{
                    if ($request->hasFile('image')) {

                        $file = $request->file('image');
                        // $fileName = $file->getClientOriginalName();
            
                        $fileContent = file_get_contents($file->getRealPath());
            
                        $extension = $file->getClientOriginalExtension();
                        
                        $fileName = Str::random(10).'.'.$extension;
            
                        $customStoragePath = UPLOAD_FULL_PROFILE_IMAGE_PATH . $fileName;
            
                        file_put_contents($customStoragePath, $fileContent);
            
                        $this->resizeImage($fileName, UPLOAD_FULL_PROFILE_IMAGE_PATH, UPLOAD_THUMB_PROFILE_IMAGE_PATH, UPLOAD_THUMB_PROFILE_IMAGE_WIDTH , UPLOAD_THUMB_PROFILE_IMAGE_HEIGHT);
            
                        $this->resizeImage($fileName, UPLOAD_FULL_PROFILE_IMAGE_PATH, UPLOAD_SMALL_PROFILE_IMAGE_PATH, UPLOAD_SMALL_PROFILE_IMAGE_WIDTH , UPLOAD_SMALL_PROFILE_IMAGE_HEIGHT);
            
                        @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH.$UseroldImage->profile_image);
                        @unlink(UPLOAD_SMALL_PROFILE_IMAGE_PATH.$UseroldImage->profile_image);
            
                        User::where('id',$userId)->update([
                            'profile_image' =>  $fileName
                        ]);

                        $msg="Your Image has been Uploaded successfully.";
            
                        //echo $this->successOutput('Your Image has been Uploaded successfully.');

                    }
            }


            $getuser = User::where('id',$userId)->first();
                
            $data['profile_image'] = '';
            
            if($getuser->profile_image != '' )
                $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$getuser->profile_image;
            else
                $data['profile_image'] = '';
                
            $data['company_logo'] = '';
                
            if($getuser->company_logo != ''){
                $data['company_logo'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$getuser->company_logo;
            }
            else{
                $data['company_logo'] = '';
            }
            

            echo $this->successOutputResult($msg,$data);
            exit; 
            
        }

        public function apps_getlocationlist(Request $request) {
            $tokenData = $this->requestAuthentication('GET', 1);
            $userId = $tokenData['user_id'];

            $locationList = Location::where('status', 1)
            ->orderBy('name', 'ASC')
            ->get();
    
                $data = [];
                $catArray = [];
                $i = 0;
            
                foreach ($locationList as $location) {
                    $catArray[$i]['id'] = $location->id;
                    $catArray[$i]['name'] = $location->name;
                    $i++;
                }
                echo $this->successOutputResult('success',$catArray);
                exit; 
        }


        public function apps_editprofile(Request $request) {

            $tokenData = $this->requestAuthentication('POST', 1);
            $userId = $tokenData['user_id'];
            $user = User::find($userId);
            
                $input = $request->all();
                $userData = $request->all();

                $rules = array(
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'location' => 'required',
                    'contact' => 'required',
                    'address' => 'required',
                    'company_contact' => 'required',
                    'url' => 'required',
                    'contact_person' => 'required',
                    'company_name' => 'required',
                    'company_about' => 'required',

                );
                $validator = Validator::make($request->all(),$rules);
    
                $validator->setAttributeNames([
                    'first_name' => 'First Name',
                    'last_name' => 'Last Name',
                    'location' => 'Location',
                    'contact' => 'Contact',
                    'address' => 'Address',
                    'company_contact' => 'Company Contact',
                    'url' => 'URL',
                    'contact_person' => 'Contact Person',
                    'company_name' => 'Company Name',
                    'company_about' => 'Company About',

                ]);
        
                if ($validator->fails()) {
                    $msg = $validator->errors();
                    echo $this->errorOutputResult($msg);
                    exit;
                }else{
                    $userdetails = User::where('id',$userId)
                    ->first();

                    $user->address = $userData['address'];
                    $user->contact = $userData['contact'];
                    $user->first_name = $userData['first_name'];
                    $user->last_name = $userData['last_name'];
                    $user->company_contact = $userData['company_contact'];
                    $user->url = $userData['url'];
                    $user->contact_person = $userData['contact_person'];
                    $user->company_name = $userData['company_name'];
                    $user->location = $userData['location'];
                    $user->pre_location = $userData['location'];

                    $user->company_about = $userData['company_about'];
                    $user->profile_update_status = 1;
            
                    if($user->save()){
                        echo $this->successOutput('Profile details updated successfully.',$userdetails);
                    }
                    exit;

                }

        }

    public function apps_getplanslist(Request $request) {
        $tokenData = $this->requestAuthentication('GET', 1);

        $userId = $tokenData['user_id'];

        $status=500;
        $data=array();


        $userCheck = User::find($userId);

        if ($userCheck->user_type == 'recruiter') {
            $condition = ['status' => 1, 'planuser' => 'employer'];
        } else {
            $condition = ['status' => 1, 'planuser' => 'jobseeker'];
        }
    
        $plansList = Plan::where($condition)->orderBy('amount', 'ASC')->get();
        $planArray = [];

        $planFeaturesMax = $GLOBALS['planFeatuersMax'];
        $planFeatures = $GLOBALS['planFeatuers'];
        $planFeaturesDis = $GLOBALS['planFeatuersDis'];
        $planType = $GLOBALS['planType'];
        $planFeaturesHelpText = $GLOBALS['planFeatuersHelpText'];
    
        $cplanId = 0;
        $sdate = now()->format('Y-m-d');
        $sdateDIS = now()->format('M d, Y');
    
        $planInfo = (new Plan)->getcurrentplan($userId);
        $myPlan = (new Plan)->getfutureplan($userId, 1);

    
        if ($plansList->count() > 0) {
            $i = 0;
    
            foreach ($plansList as $val) {
                $tpvalue = $val->type_value;
    
                if ($val->type == 'Months') {
                    $edate = now()->addMonths($tpvalue)->format('Y-m-d');
                    $edateDIS = now()->addMonths($tpvalue)->format('M d, Y');
                } else {
                    $edate = now()->addYears($tpvalue)->format('Y-m-d');
                    $edateDIS = now()->addYears($tpvalue)->format('M d, Y');
                }
    
                $fvalues = json_decode($val->fvalues, true);
                $featureIds = explode(',', $val->feature_ids);
    
                $planArray[$i]['id'] = $val->id;
                $planArray[$i]['planuser'] = $val->planuser;
                $planArray[$i]['plan_name'] = $val->plan_name;
                $planArray[$i]['is_active'] = 0;
    
                if ($planInfo && $planInfo->id == $val->id) {
                    $planArray[$i]['is_active'] = 1;
                }
    
                $planArray[$i]['plan_name'] = $val->plan_name;
                $planArray[$i]['amount'] = $val->amount;
                $planArray[$i]['type'] = $val->type;
                $planArray[$i]['type_value'] = $val->type_value;
                $planArray[$i]['slug'] = $val->slug;
    
                $joncnt = '';
                $ddd = '';
                $resumedow = '';

                $planArray[$i]['AccessCandidateSearching'] = 0;
    
                if ($featureIds) {
                    foreach ($featureIds as $fid) {
                        if ($fid == 3) {
                            $planArray[$i]['AccessCandidateSearching'] = 1;
                        }
    
                        if (array_key_exists($fid, $fvalues)) {
                            if ($fvalues[$fid] == $planFeaturesMax[$fid]) {
                                if ($fid == 1) {
                                    $joncnt = 'Unlimited';
                                } 
                                if ($fid == 2) {
                                    $ddd = 'Unlimited';
                                }
                                if ($fid == 4) {
                                    $resumedow = 'Unlimited';
                                }
                            } else {
                                if ($fid == 1) {
                                    $joncnt = $fvalues[$fid];
                                } 
                                if ($fid == 2) {
                                    $ddd = $fvalues[$fid];
                                }
                                if ($fid == 4) {
                                    $resumedow = $fvalues[$fid];
                                }
                            }
                        }
                    }
                }
    
                $planArray[$i]['job_post'] = $joncnt;
                $planArray[$i]['resume_download'] = $ddd;
                $planArray[$i]['job_apply'] = $resumedow;

                $i++;
            }
        }

        return Response(['response' => $planArray , 'message'=>'success', 'status'=>200 ],200);

    }


    public function apps_socialLogin(Request $request) {

        $this->requestAuthentication('POST', 2);
        $userData = $request->all();



        $rules = array(
            'first_name' => 'required',
            'last_name' => 'required',
            'device_type' => 'required',
            'device_id' => 'required',
            'email_address' =>'required',
            'password' => 'required',
            'login_type' => 'required',
            'type' => 'required',


        );
        $validator = Validator::make($request->all(),$rules);

        $validator->setAttributeNames([
            'first_name' => 'first name',
            'last_name' => 'last name',
            'device_type' => 'device type',
            'device_id' => 'device id',
            'email_address' => 'email address',
            'password' => 'password',
            'login_type' => 'login type',
            'type' => 'user type',
        ]);

        if ($validator->fails()) {
            $msg = $validator->errors();
            echo $this->errorOutputResult($msg);
            exit;
        }else{


            $emailAddress = $userData['email_address'];
            $device_type = $userData['device_type'];
            $device_id = $userData['device_id'];
            $type = $userData['type'];

        if ($userData['login_type'] == 'facebook') {
            $userCheck = User::whereNotNull('facebook_user_id')->where('email_address',$emailAddress)->where('user_type',$type)
            ->first();
        }else if ($userData['login_type'] == 'linkedin') {
            $userCheck = User::whereNotNull('linkedin_id')->where('email_address',$emailAddress)->where('user_type',$type)
            ->first();
        }else if ($userData['login_type'] == 'google') {
            $userCheck = User::whereNotNull('google_id')->where('email_address',$emailAddress)->where('user_type',$type)
            ->first();
        }else{
            $userCheck = User::where('email_address',$emailAddress)
            ->first();
        }

            if($userCheck){
                $data = $this->logindata($userCheck);
                User::where('id', $userCheck->id)->update(array('device_type' => $device_type, 'device_id' => $device_id));

                echo $this->successOutputResult('login sucessfully', $data);
                exit;

            }else{

                $passwordPlain = $request->password;
                $salt = uniqid(mt_rand(), true);
              //  $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');
                $new_password = Hash::make($request->password);

                $user = new User;

                $user->password = $new_password;
                $user->first_name = $request->first_name;
                $user->last_name = $request->last_name;

                if ($userData['login_type'] == 'facebook') {
                    $user->facebook_user_id = '1';
                }else if ($userData['login_type'] == 'linkedin') {
                    $user->linkedin_id ='1';
                }else if ($userData['login_type'] == 'google') {
                    $user->google_id ='1';
                }
                $user->email_address =$request->email_address;

                $user->device_type = $request->device_type;
                $user->device_id = $request->device_id;
        
                $user->slug = $this->createSlug(trim(strtolower($request->first_name)).' '. trim(strtolower($request->last_name)),'users','slug');
               
                $user->country_id = 1;
                $user->activation_status = 0;
                $user->status = 0;
                $user->user_type = $type;

                if($user->save()){

                    $userCheck = User::where('email_address',$request->email_address)->first();
                    $userId=$user->id;

                    $email = $request->email_address;
                    $username = $request->first_name;


                    $link = HTTP_FAV. "users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);

                    $currentYear = date('Y', time());

                    $emailTemplate = Emailtemplate::where('id',13)->first();

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

                    $currentYear = date('Y', time());

                    $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';


                    $toSubArray = array('[!username!]', '[!email!]', '[!password!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!link!]');
                    $fromSubArray = array($username, $email, $passwordPlain, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $link);

                    $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                    $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                    Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                    $data = $this->logindata($userCheck);

                    echo $this->successOutputResult('View profile', $data);
                    exit;
                }
            }

        }

        exit;
    }

    public function apps_createJob(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();
        $rules = array(
            'job_title' => 'required',
            'category' => 'required',
            'company_name' => 'required',
            'work_type' => 'required',
            'contact_name' => 'required',
            'contact_number' => 'required',
            'companyProfile' => 'required',
            'experience' => 'required',
            'annual_salary'=>'required',
           'skill' => 'required',
            'designation' => 'required',
            'location' => 'required',
            'last_date' => 'required',
        );

        $validator = Validator::make($request->all(),$rules);

        $validator->setAttributeNames([
            'job_title' => 'Job title',
            'category' => 'Category',
            'company_name' => 'Company name',
            'work_type' => 'Work type',
            'contact_name' => 'Contact name',
            'contact_number' => 'Contact number',
            'companyProfile' => 'Company profile',
            'experience' => 'Experience',
            'annual_salary'=>'Annual Salary',
            'skill' => 'Skill',
            'designation' => 'Designation',
            'location' => 'Job location',
            'last_date' => 'Expire time',
        ]);

        if ($validator->fails()) {
            $msg = $validator->errors();
            echo $this->errorOutputResult($msg);
            //echo $this->successOutputResult('View profile', $data);
            exit;
        }else{

            $msgString .= $this->checkSwearWord($request->job_title);
            $msgString .= $this->checkSwearWord($request->jobDescription);
            $msgString .= $this->checkSwearWord($request->company_name);
            $msgString .= $this->checkSwearWord($request->contact_name);
            $msgString .= $this->checkSwearWord($request->contact_number);
            $msgString .= $this->checkSwearWord($request->companyProfile);

            $youtube_link = '';

            $isAbleToJob = (new Plan)->checkPlanFeature($userId, 1);



                if ($isAbleToJob['status'] == 0) {
                    $msgString .= $isAbleToJob['message'];
                }


            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $fileContent = file_get_contents($file->getRealPath());
                $extension = $file->getClientOriginalExtension();
                $originalName = Str::random(10).'.'.$extension;

            }else{
                $originalName = '';

            }

            if (isset($msgString) && $msgString != '') {

                echo $this->errorOutputResult($msgString);

            }else{

            $keyword = $request->job_title;

            $keywordId = Keyword::where('name',$keyword)
            ->where('type','Job')
            ->select('id')
            ->get();

            if($keywordId->count() == 0){
                $newKeyword = new Keyword;
                $newKeyword->name = $keyword;
                $newKeyword->slug = $this->createSlug($keyword,'keywords');
                $newKeyword->status = 1;
                $newKeyword->approval_status = 0;
                $newKeyword->type = 'job';
                $newKeyword->created = date('Y-m-d H:s:i');
                $newKeyword->course_id = 0;
                $newKeyword->save();
            }


            $newJob = new Job;

            $newJob->title = $request->job_title;
            $newJob->category_id = $request->category;
            $newJob->description = $request->jobDescription;
            $newJob->company_name = $request->company_name;
            $newJob->work_type = $request->work_type;
            $newJob->contact_name = $request->contact_name;
            $newJob->contact_number = $request->contact_number;
            $newJob->url = $request->company_website;
            $newJob->brief_abtcomp = $request->companyProfile;
            $newJob->designation = $request->designation;
            $newJob->job_city = $request->location;
            $newJob->lastdate = $request->last_date;

            $exp = explode('-',$request->experience);
            $newJob->min_exp = $exp[0];
            $newJob->max_exp = $exp[1];

            $sallery = explode('-',$request->annual_salary);
            $newJob->min_salary = $sallery[0];
            $newJob->max_salary = $sallery[1];

            if($originalName != ''){

                $file = $request->file('logo');
                $fileContent = file_get_contents($file->getRealPath());
                $customStoragePath = UPLOAD_JOB_LOGO_PATH . $originalName;
                file_put_contents($customStoragePath, $fileContent);
                $newJob->logo = $originalName;

            }else{
                $newJob->logo = '';
            }

            if($request->subCategory != ''){
                $newJob->subcategory_id = implode(',',$request->subCategory);
            }else{
                $newJob->subcategory_id =0;
            }

            $slug = $this->createSlug($request->job_title,'jobs');
            $newJob->slug = $slug;
            $newJob->type = 'Gold';

            $newJob->status = 1;
            $newJob->user_id = $userId;
            $newJob->payment_status = 2;
            $newJob->job_number = 'JOB'. $userId . time();

            if($request->exp_month == ''){
                $newJob->exp_month = 0;
            }



            $newJob->expire_time = strtotime($request->last_date); 
            if($request->skill != ''){
             //   $newJob->skill = implode(',',$request->skill);
                $newJob->skill = $request->skill;

            }

          //  print_r($isAbleToJob);exit;

            $newJob->user_plan_id = $isAbleToJob['user_plan_id'];

                if($newJob->save()){
                    $jobId = $newJob->id;
                    $jobDetail = Job::with('category','user')->find($jobId);
                    $title = $jobDetail->title;
                    $category = $jobDetail->category->name;
                    $skillIds = $jobDetail->skill;
                    $location = $jobDetail->job_city;
                    $minExp = $jobDetail->min_exp . ' Year';
                    $maxExp = $jobDetail->max_exp . ' Year';
                    $min_salary = CURRENCY . ' ' . intval($jobDetail->min_salary);
                    $max_salary = CURRENCY . ' ' . intval($jobDetail->max_salary);
                    $description = $jobDetail->description;
                    $company_name = $jobDetail->company_name;
                    $contact_number = $jobDetail->contact_number;
                    $website = $jobDetail->url ? $jobDetail->url : 'N/A';
                    $address = $jobDetail->address ? $jobDetail->address : 'N/A';

                    $designation = Skill::where('status',1)
                    ->where('type','Designation')
                    ->where('id',$jobDetail->designation)
                    ->select('name')
                    ->get();

                    $skill = (new Skill)->getSkillsNamesByIds($skillIds);

                    $username = $jobDetail->user->first_name . ' ' . $jobDetail->user->last_name;

                    $email = $jobDetail->user->email_address;

                    $currentYear = date('Y', time());

                    $emailTemplate = Emailtemplate::where('id',46)->first();

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

                    $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!min_experience!]', '[!max_experience!]', '[!min_salary!]', '[!max_salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');

                    $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $minExp, $maxExp, $min_salary, $max_salary, $description, $company_name, $contact_number, $website, $address, SITE_TITLE);

                    $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                    $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                   

                    try {
                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
                    } catch(\Exception $e) {
                        $msgString=$e->getMessage();
                    }
                    // Admin email;
                    $username = "Admin";
                    $adminInfo = Admin::whereId(1)->first();

                    $email = $adminInfo->email;

                    $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                    $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                   

                    try {
                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
                    } catch(\Exception $e) {
                        $msgString=$e->getMessage();
                    }

                    $users = (new Alert_location)->getUsersToAlert($jobId);


                    if (!empty($users)) {
                        foreach ($users as $user) {

                            $newAlertJob = new Alert_job; 

                            $newAlertJob->job_id = $jobId;
                            $newAlertJob->user_id = $user->id;
                            $newAlertJob->email_address = $user->email_address;
                            $newAlertJob->status = 1; 

                            $newAlertJob->save();

                        }
                    }

                    echo $this->successOutputResult('Your job posted successfully.', $data);

                }
        

        }

        }
    }

    public function apps_getJobsList(Request $request) {
        $tokenData = $this->requestAuthentication('GET', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $jobsList = Job::where('user_id', $userId)
        ->orderByDesc('id')
        ->orderByDesc('payment_status')
        ->get();

        $jobsArray = [];
        
        foreach ($jobsList as $val) {
            $alertjob_count = Alert_job::where('job_id', $val->id)->count();
            $all_job_count = (new Job_apply)->getTotalCandidate($val->id);
            $new_job_count = (new Job_apply)->getNewCount($val->id);
            
            
             $employer = User::where('id' , $val->user_id)->first();
            $emp_image = '';
            if(isset($employer->profile_image)){
                $emp_image = $employer->profile_image;
    
            }
            $logo = '';
            if (file_exists(UPLOAD_JOB_LOGO_PATH . $val->logo)) {
                $logo = $val->logo;
            }
            
          //  $created = date('Y-m-d',strtotime($val->created));

            $jobsArray[] = [
                'id' => $val->id,
                'user_id' => $val->user_id,
                'title' => $val->title,
                'company_name' => $val->company_name,
                'location' => $val->job_city,
                'status' => $val->status,
                'alertjob_count' => $alertjob_count,
                'all_job_count' => $all_job_count,
                'new_job_count' => $new_job_count,
                'logo' =>$logo,
                'profile_image' =>$emp_image,
                'created' => date('Y-m-d', strtotime($val->created)),
            ];
        }

        echo $this->successOutputResult('Your job posted successfully.', $jobsArray);

        exit;
    }

    public function apps_updateJobStatus(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $status = $request['status'];
        $job_id = $request['job_id'];

        $jobsDetail = Job::where('id', $job_id)
        ->where('user_id', $userId)
        ->first();

        if ($jobsDetail) {
            $jobsDetail = Job::find($job_id);
            $jobsDetail->status = $status;
            $jobsDetail->save();

          //  $cnd = array("Job.id = $job_id");
          //  $this->Job->updateAll(array('Job.status' => "$status"), $cnd);

            if ($status){
                echo $this->successOutputResult('Job activated successfully.');
            }
            else{
                echo $this->successOutputResult('Job deactivated successfully.');
            }
           
        }else{
            echo $this->errorOutputResult('Job not found.');

        }

        exit;

    }

    public function apps_getJobsDetail(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();
        $jobId = $request['job_id'];
        $jobdetails = Job::find($jobId);
        if ($jobdetails) {
            $expire_time='N/A';
            if(($jobdetails->lastdate != '') && ($jobdetails->lastdate != '1970-01-01')){
                $expire_time=date('d-m-Y', strtotime($jobdetails->lastdate));

            }

        $data = [
            'id' => $jobdetails->id,
            'title' => $jobdetails->title,
            'company_name' => $jobdetails->company_name,
            'location' => $jobdetails->job_city,
            'category_id' => $jobdetails->category_id,
            'expire_time' => $expire_time,
        ];
    
        $experience = isset($jobdetails->min_exp) && isset($jobdetails->max_exp)
            ? $jobdetails->min_exp . "-" . $jobdetails->max_exp . " Year"
            : "N/A";
        $data['experience'] = $experience;
    
        $data['applications'] = (new Job_apply)->getTotalCandidate($jobdetails->id);
    
        $jobIds = explode(',', $jobdetails->skill);
        $skillList = Skill::whereIn('id', $jobIds)
            ->where('type', 'Skill')
            ->where('status', '1')
            ->orderBy('name', 'asc')
            ->pluck('name', 'id')
            ->toArray();
    
        $skills_array = [];

        foreach ($jobIds as $jid) {
            if(isset($skillList[$jid])){

                $skills_array[] = [
                    'id' => $jid,
                    'name' => $skillList[$jid],
                ];
            }
        }

        $data['skills_array'] = $skills_array;
    
        $employer = User::where('id' , $jobdetails->user_id)->first();

       // echo '<pre>';print_r($employer);exit;
        if(isset($employer->profile_image)){
            $data['profile_image'] = $employer->profile_image;

        }else{
            $data['profile_image'] = '';

        }
    
        $logo = '';
        if (file_exists(UPLOAD_JOB_LOGO_PATH . $jobdetails->logo)) {
            $logo = $jobdetails->logo;
        }
        $data['logo'] = $logo;
    
        $data['description'] = $jobdetails->description;
    
        $salary = isset($jobdetails->min_salary) && isset($jobdetails->max_salary)
            ? CURRENCY . ' ' . intval($jobdetails->min_salary) . " - " . CURRENCY . ' ' . intval($jobdetails->max_salary)
            : "N/A";
        $data['salary'] = $salary;
    
        $data['category'] = $jobdetails->category->name;
        global $worktype;
        $data['job_type'] = $worktype[$jobdetails->work_type];
        $data['posted_date'] = date('F d,Y', strtotime($jobdetails->created));
        $data['job_type_id'] = $jobdetails->work_type;
        $data['salary_id'] = $jobdetails->min_salary . '-' . $jobdetails->max_salary;
        $data['experience_id'] = $jobdetails->min_exp . '-' . $jobdetails->max_exp;
        $data['designation_id'] = $jobdetails->designation;
        $data['designation'] = Skill::where('id', $jobdetails->designation)
            ->where('type', 'Designation')
            ->value('name');
    
        $company_profile = $jobdetails->brief_abtcomp
            ? strip_tags($jobdetails->brief_abtcomp)
            : (!empty(User::find($jobdetails->user_id)->company_about)
                ? User::find($jobdetails->user_id)->company_about
                : 'N/A');
        $data['company_profile'] = strip_tags($company_profile);
    
        $website = trim($jobdetails->url) != '' ? $jobdetails->url : 'N/A';
        $data['website'] = $website;
    
        $contact_name = $jobdetails->contact_name == ''
            ? User::find($jobdetails->user_id)->first_name
            : $jobdetails->contact_name;
        $contact_number = $jobdetails->contact_number == ''
            ? User::find($jobdetails->user_id)->contact
            : $jobdetails->contact_number;
    
        $data['contact_name'] = $contact_name;
        $data['contact_number'] = $contact_number;
    
        $data['view_count'] = $jobdetails->view_count;
        $data['search_count'] = $jobdetails->search_count;
    
        $active = (new Job_apply)->getStatusCount($jobdetails->id, 'active');
        $data['active_job_count'] = $active;
    
        $short_list = (new Job_apply)->getStatusCount($jobdetails->id, 'short_list');
        $data['short_list_job_count'] = $short_list;
    
        $interview = (new Job_apply)->getStatusCount($jobdetails->id, 'interview');
        $data['interview_job_count'] = $interview;
    
        $offer = (new Job_apply)->getStatusCount($jobdetails->id, 'offer');
        $data['offer_job_count'] = $offer;
    
        $accept = (new Job_apply)->getStatusCount($jobdetails->id, 'accept');
        $data['accept_job_count'] = $accept;
    
        $not_suitable = (new Job_apply)->getStatusCount($jobdetails->id, 'not_suitable');
        $data['not_suitable'] = $not_suitable;
    
        $getTotalCandidate = (new Job_apply)->getTotalCandidate($jobdetails->id);
        $data['get_total_candidate'] = $getTotalCandidate;
    
        $getNewCount = (new Job_apply)->getNewCount($jobdetails->id);
        $data['get_new_count'] = $getNewCount;
    
        $apply_array = Job_apply::where('status', 1)
            ->where('job_id', $jobdetails->id)
            ->get();
    
        $candidate_listing = [];
        foreach ($apply_array as $apply) {

            $userdetail = User::where('id', $apply->user_id)
            ->first();

            $candidate_id = $userdetail->id;
            $lastfave = Favorite::where('user_id', $userId)
                ->where('candidate_id', $candidate_id)
                ->first();
            $candidate_listing[] = [
                'id' => $apply->id,
                'apply_status' => $apply->apply_status,
                'is_favourite' => $lastfave ? '1' : '0',
                'rating' => $apply->rating,
                'created' => date('Y-m-d', strtotime($apply->created)),
                'user_id' => $userdetail->id,
                'first_name' => $userdetail->first_name,
                'last_name' => $userdetail->last_name,
                'full_name' => $userdetail->first_name . ' ' . $userdetail->last_name,
                'contact' => $userdetail->contact,
                'email_address' => $userdetail->email_address,
            ];
        }
    
        $data['get_candidate_count'] = count($candidate_listing);
        $data['candidate'] = $candidate_listing;

        echo $this->successOutputResult('Your job posted successfully.', $data);

    }else{
        echo $this->errorOutputResult('Job not found.');

    }

        exit;
    }

    public function apps_updateJob(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }

        $msgString='';
        $data=array();

        if($request->job_id != ''){
            $jobdetails = Job::where('id',$request->job_id)->first();
            if($jobdetails == ''){
                $msg ='Job not found.';
                echo $this->errorOutputResult($msg);
                exit;
            }
        }else{
            $msg ='Job ID is required';
            echo $this->errorOutputResult($msg);
            exit;
        }


        $newJob = Job::find($jobdetails->id);

        $rules = array(
            'job_title' => 'required',
            'category' => 'required',
            'company_name' => 'required',
            'work_type' => 'required',
            'contact_name' => 'required',
            'contact_number' => 'required',
            'companyProfile' => 'required',
            'experience' => 'required',
            'annual_salary'=>'required',
          // 'skill' => 'required',
            'designation' => 'required',
            'location' => 'required',
            'last_date' => 'required',
        );

        $validator = Validator::make($request->all(),$rules);

        $validator->setAttributeNames([
            'job_title' => 'Job title',
            'category' => 'Category',
            'company_name' => 'Company name',
            'work_type' => 'Work type',
            'contact_name' => 'Contact name',
            'contact_number' => 'Contact number',
            'companyProfile' => 'Company profile',
            'experience' => 'Experience',
            'annual_salary'=>'Annual Salary',
           // 'skill' => 'Skill',
            'designation' => 'Designation',
            'location' => 'Job location',
            'last_date' => 'Expire time',
        ]);

        if ($validator->fails()) {
            $msg = $validator->errors();
            echo $this->errorOutputResult($msg);
            //echo $this->successOutputResult('View profile', $data);
            exit;
        }else{

            $msgString .= $this->checkSwearWord($request->job_title);
            $msgString .= $this->checkSwearWord($request->jobDescription);
            $msgString .= $this->checkSwearWord($request->company_name);
            $msgString .= $this->checkSwearWord($request->contact_name);
            $msgString .= $this->checkSwearWord($request->contact_number);
            $msgString .= $this->checkSwearWord($request->companyProfile);

            $youtube_link = '';

            $isAbleToJob = (new Plan)->checkPlanFeature($userId, 1);



            //     if ($isAbleToJob['status'] == 0) {
            //         $msgString .= $isAbleToJob['message'];
            //     }


            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $fileContent = file_get_contents($file->getRealPath());
                $extension = $file->getClientOriginalExtension();
                $originalName = Str::random(10).'.'.$extension;

            }else{
                $originalName = '';

            }

            if (isset($msgString) && $msgString != '') {

                echo $this->errorOutputResult($msgString);

            }else{

            $keyword = $request->job_title;

            $keywordId = Keyword::where('name',$keyword)
            ->where('type','Job')
            ->select('id')
            ->get();

            if($keywordId->count() == 0){
                $newKeyword = new Keyword;
                $newKeyword->name = $keyword;
                $newKeyword->slug = $this->createSlug($keyword,'keywords');
                $newKeyword->status = 1;
                $newKeyword->approval_status = 0;
                $newKeyword->type = 'job';
                $newKeyword->created = date('Y-m-d H:s:i');
                $newKeyword->course_id = 0;
                $newKeyword->save();
            }


            // $newJob = new Job;

            $newJob->title = $request->job_title;
            $newJob->category_id = $request->category;
            $newJob->description = $request->jobDescription;
            $newJob->company_name = $request->company_name;
            $newJob->work_type = $request->work_type;
            $newJob->contact_name = $request->contact_name;
            $newJob->contact_number = $request->contact_number;
            $newJob->url = $request->company_website;
            $newJob->brief_abtcomp = $request->companyProfile;
            $newJob->designation = $request->designation;
            $newJob->job_city = $request->location;
            $newJob->lastdate = $request->last_date;

            $exp = explode('-',$request->experience);
            $newJob->min_exp = $exp[0];
            $newJob->max_exp = $exp[1];

            $sallery = explode('-',$request->annual_salary);
            $newJob->min_salary = $sallery[0];
            $newJob->max_salary = $sallery[1];

            if($originalName != ''){

                $file = $request->file('logo');
                $fileContent = file_get_contents($file->getRealPath());
                $customStoragePath = UPLOAD_JOB_LOGO_PATH . $originalName;
                file_put_contents($customStoragePath, $fileContent);
                $newJob->logo = $originalName;

            }else{
                $newJob->logo =  $jobdetails->logo;
            }

            if($request->subCategory != ''){
                $newJob->subcategory_id = implode(',',$request->subCategory);
            }else{
                $newJob->subcategory_id =0;
            }

            $slug = $this->createSlug($request->job_title,'jobs');
            $newJob->slug = $slug;
            $newJob->type = 'Gold';

            $newJob->status = 1;
            $newJob->user_id = $userId;
            $newJob->payment_status = 2;
            $newJob->job_number = 'JOB'. $userId . time();

            if($request->exp_month == ''){
                $newJob->exp_month = 0;
            }



            $newJob->expire_time = strtotime($request->last_date); 
            if($request->skill != ''){
               // $newJob->skill = implode(',',$request->skill);
                $newJob->skill =$request->skill;

            }

          //  print_r($isAbleToJob);exit;

          //  $newJob->user_plan_id = $isAbleToJob['user_plan_id'];

                if($newJob->save()){
                    $jobId = $newJob->id;
                    $jobDetail = Job::with('category','user')->find($jobId);
                    $title = $jobDetail->title;
                    $category = $jobDetail->category->name;
                    $skillIds = $jobDetail->skill;
                    $location = $jobDetail->job_city;
                    $minExp = $jobDetail->min_exp . ' Year';
                    $maxExp = $jobDetail->max_exp . ' Year';
                    $min_salary = CURRENCY . ' ' . intval($jobDetail->min_salary);
                    $max_salary = CURRENCY . ' ' . intval($jobDetail->max_salary);
                    $description = $jobDetail->description;
                    $company_name = $jobDetail->company_name;
                    $contact_number = $jobDetail->contact_number;
                    $website = $jobDetail->url ? $jobDetail->url : 'N/A';
                    $address = $jobDetail->address ? $jobDetail->address : 'N/A';

                    $designation = Skill::where('status',1)
                    ->where('type','Designation')
                    ->where('id',$jobDetail->designation)
                    ->select('name')
                    ->get();

                    $skill = (new Skill)->getSkillsNamesByIds($skillIds);

                    $username = $jobDetail->user->first_name . ' ' . $jobDetail->user->last_name;

                    $email = $jobDetail->user->email_address;

                    $currentYear = date('Y', time());

                    $emailTemplate = Emailtemplate::where('id',46)->first();

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

                    $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!min_experience!]', '[!max_experience!]', '[!min_salary!]', '[!max_salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');

                    $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $minExp, $maxExp, $min_salary, $max_salary, $description, $company_name, $contact_number, $website, $address, SITE_TITLE);

                    $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                    $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                   

                    try {
                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
                    } catch(\Exception $e) {
                        $msgString=$e->getMessage();
                    }


                    $users = (new Alert_location)->getUsersToAlert($jobId);


                    if (!empty($users)) {
                        foreach ($users as $user) {

                            $newAlertJob = new Alert_job; 

                            $newAlertJob->job_id = $jobId;
                            $newAlertJob->user_id = $user->id;
                            $newAlertJob->email_address = $user->email_address;
                            $newAlertJob->status = 1; 

                            $newAlertJob->save();

                        }
                    }

                    echo $this->successOutputResult('Your job updated successfully.', $data);

                }
        

        }

        }
       
    }

    public function apps_deleteJob(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $job_id =  $request->job_id;
        Job::where('id',$job_id)->delete();
        echo $this->successOutputResult('Job deleted successfully.', $data);
        exit;
    }

    public function apps_addtofavourite(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $userData = $request->all();

        $candidate_id = $request->candidate_id;

        if(!empty($candidate_id)){

    
        $lastfave = Favorite::where('user_id', $userId)
            ->where('candidate_id', $candidate_id)
            ->first();
    
        if (empty($lastfave)) {
            $favorite = new Favorite();
            $favorite->user_id = $userId;
            $favorite->candidate_id = $candidate_id;
            $favorite->save();
        }

        echo $this->successOutputResult('Added to favorite candidate list.', $data);

    }else{
        $msg ='Provide Candidate ID';
        echo $this->errorOutputResult($msg);
    }

        exit;
    }
    
    
    public function apps_getfavouritellist(Request $request) {
        $tokenData = $this->requestAuthentication('GET', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $tokenData = $this->requestAuthentication('GET', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $userId = $request->user()->id;
    
        $userfavList = Favorite::where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->with('candidate')
            ->get();
    
        $userfavArray = [];

       // echo '<pre>';print_r($userfavList);exit;
    
        foreach ($userfavList as $val) {

            $candidate = User::where('id', $val->candidate_id)
            ->first();

            if(isset($candidate->first_name)){
                $userfavArray[] = [
                    'id' => $val->id,
                    'candidate_id' => $val->candidate_id,
                    'full_name' => $candidate->first_name . ' ' . $candidate->last_name ,
                    'profile_image' => $candidate->profile_image,
                    'email_address' => $candidate->email_address,
                    'created' => $val->created_at,
                ];
            }


        }
    

        echo $this->successOutputResult('Success.', $userfavArray);
        exit;


    }


    public function apps_removetofavourite(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $userData = $request->all(); // Assuming the request contains the necessary data
    $candidate_id = $request->candidate_id;

    Favorite::where('user_id', $userId)
        ->where('candidate_id', $candidate_id)
        ->delete();

    $userfavList = Favorite::where('user_id', $userId)
        ->orderBy('id', 'desc')
        ->with('candidate')
        ->get();

    $userfavArray = [];

    foreach ($userfavList as $val) {

        $candidate = User::where('id', $val->candidate_id)
        ->first();
        if(isset($candidate->first_name)){

            $userfavArray[] = [
                'id' => $val->id,
                'candidate_id' => $val->candidate_id,
                'full_name' => $candidate->first_name . ' ' . $candidate->last_name ,
                'profile_image' => $candidate->profile_image,
                'email_address' => $candidate->email_address,
                'created' => $val->created_at,
            ];
        }
    }
        echo $this->successOutputResult('Candidate deleted from favorite candidate list.', $userfavArray);
        exit;
    }
    
    
    public function apps_getcandidatelist(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

    
        // $usercanList = User::where('user_type', 'candidate')
        //     ->Where('status',1)
        //     // ->Where('activation_status',1)
        //     ->orderBy('id', 'desc')
        //     ->get();


            if(!empty($request->all())){
                $keyword = $request->keyword;
                $location = $request->location;
                $total_exp = $request->exp;
                $exp_salary = $request->salary;
                $skills = $request->skill;
    
                // exit;
            
                $order = 'id Desc';
                $fields = [
                    'first_name',
                    'last_name',
                    'slug',
                    'id',
                    'email_address',
                    'skills',
                    'profile_image',
                    'contact',
                    'skills',
                    'Location.id',
                    'Location.name',
                    'total_exp',
                ];
            
    
                $query = User::where('users.status', '1');
    
                $condition = [];
    
                if (!empty($keyword) && ($keyword != '')){
                    $keyword = str_replace('_', '\_', $keyword);
                    $query = $query->where(function($q) use ($keyword){
                        $q->Where('users.first_name', 'like', '%'.$keyword.'%')
                        ->orWhere('users.last_name', 'like', '%'.$keyword.'%');
                    });
                    
                }
    
    
               // if(isset($request->total_exp) && ($request->total_exp) == 1){
                if(isset($total_exp) && ($total_exp != '')){
    
                    $expArray = explode('-', $total_exp);
                    if (!empty($expArray)) {
                        $expArray = explode('-', $total_exp);
        
                        $query = $query->where(function($q) use ($expArray){
                            $q->Where('users.total_exp', '>=', $expArray[0])
                            ->orWhere('users.total_exp', '<=', $expArray[1]);
            
                        });
        
                    }
                }
    
            
                if (!empty($exp_salary) && ($exp_salary != '')){
                    $expArray = explode('-', $exp_salary);
    
                    $query = $query->where(function($q) use ($expArray){
                        $q->Where('users.exp_salary', '>=', $expArray[0])
                        ->orWhere('users.exp_salary', '<=', $expArray[1]);
        
                    });
    
                }
               // echo '$skills ';print_r($request->skills);
               // echo '$skill ';print_r(count($skills));exit;
    
              //  if (!empty($skills) && ($skills != '') && (count($skills) > 1)){
                if (!empty($skills) && ($skills != '')){

                    $skills = explode(',',$request->skill);
                    foreach ($skills as $val) {
                      //  $temCnt[] = ['skills', 'LIKE', '%' . $val . '%'];
    
                        $query = $query->Where(function($q) use ($val){
                            $q->orWhere('users.skills', 'like', '%'.$val.'%');
                        });
                    }
                  
                }
    
                if (!empty($location) && ($location != '')){
                    $location = str_replace('_', '\_', $location);
                    $query = $query->where(function($q) use ($location){
                        $q->Where('users.pre_location', 'like', '%'.$location.'%')
                       ->orWhere('users.location', 'like', '%'.$location.'%');
                    });
               
                }
            
                    $usercanList= $query->orderByRaw($order)->get();
    
            }else{
                $usercanList = User::where('user_type','candidate')->where('status',1)->orderBy('id','desc')->get();
    
            }
    
        $usercandArray = [];
        foreach ($usercanList as $val) {
            
            $lastfave = Favorite::where('user_id', $userId)
                ->where('candidate_id', $val->id)
                ->first();
            
            $usercandArray[] = [
                'id' => $val->id,
                'candidate_id' => $val->id,
                'is_fav' => $lastfave ? 1 : 0,
                'full_name' => $val->first_name . ' ' . $val->last_name ,
                'profile_image' => $val->profile_image,
                'email_address' => $val->email_address,
                'created' => $val->created_at,
            ];
        }
        echo $this->successOutputResult('Success.', $usercandArray);
        exit;

    }
    

    public function apps_updateApplyStatus(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();
            $applyId = $request->apply_id;
            $applyStatus = $request->apply_status;

            $jobApply = Job_apply::find($applyId);

            if ($jobApply) {
                $jobApply->apply_status = $applyStatus;
                $jobApply->save();
    
                echo $this->successOutputResult('Job Apply status updated successfully', $data);
                exit;
            }else{
                echo $this->errorOutputResult('JobApply not found');
                exit;
            }
            exit;
    }

    public function apps_submitReview(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

       
        $jobAppliesId = $request->job_applies_id;
        $rating = $request->rating;
    
        $jobApply = Job_apply::find($jobAppliesId);
    
        if (!$jobApply) {
            echo $this->errorOutputResult('JobApply not found');
            exit;
        }
    
        $jobApply->rating = $rating;
        $jobApply->save();

        echo $this->successOutputResult('Rating successfully given to candidate.', $data);
        exit;
    }

    public function apps_getpaymenthistory(Request $request) {
        $tokenData = $this->requestAuthentication('GET', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $userPlansList = User_plan::with(['plan', 'payment'])
        ->where('user_id', $userId)
        ->orderByDesc('id')
        ->get();

            $planArray = [];

            foreach ($userPlansList as $val) {
                $Payment = Payment::where('id',$val->payment_id)->first();
                if(isset($Payment->transaction_id)){
                    $trannid=$Payment->transaction_id;

                }else{
                    $trannid='N/A';
                }

                $planArray[] = [
                    'id' => $val->id,
                    'plan_name' => $val->plan->plan_name,
                    'user_id' => $val->user_id,
                    'amount' => $val->amount,
                    'start_date' => $val->start_date,
                    'end_date' => $val->end_date,
                    'transaction_id' =>$trannid,
                    'created' => $val->created, 
                ];
            }

        echo $this->successOutputResult('Payment History.', $planArray);
        exit;
    }

    public function apps_deleteaccount(Request $request) {
        $tokenData = $this->requestAuthentication('GET', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $user = User::whereId($userId);

        if($user->count() > 0 ){
            $user->delete();
            echo $this->successOutput('Your Account has been deleted successfully.');
        }
        exit;
    }
    
    public function apps_candiprofile(Request $request)
    {
        // echo "Working";
        // echo $request->user_id;
        
        $tokenData = $this->requestAuthentication('POST', 1);
        // $userId = $tokenData['user_id'];
        $userId = $request->user_id;
        // echo $tokenData;
        $userData = $request->all();
        $userId = $userData['user_id'] ;

        $userCheck = User::find($userId);
        if ($userCheck) {
            $data['user_id'] = $userCheck->id;
            $data['user_type'] = $userCheck->user_type;
            $data['first_name'] = $userCheck->first_name;
            $data['last_name'] = $userCheck->last_name;
            $data['email_address'] = $userCheck->email_address;
            $data['location'] = $userCheck->location;
            $data['location_name'] = $userCheck->location ? Location::where('id',$userCheck->location)->pluck('name')->implode(',') : '';
            $gender = '';
            if ($userCheck->gender != '') {
                $gender = ($userCheck->gender == 0) ? 'Male' : 'Female';
            }
            
            $data['gender'] = $gender;
            $data['contact'] = $userCheck->contact;
            $data['pre_location'] = $userCheck->pre_location;
            $data['skills'] = $userCheck->skills ? explode(',', trim($userCheck->skills)) : [];
            $exp_salary = $userCheck->exp_salary ? $userCheck->exp_salary : '';
            $data['exp_salary'] = $exp_salary;

            $total_exp = '';
            if ($userCheck->total_exp) {
                // Assuming $totalexperienceArray is defined in the Laravel app.
                $totalexperienceArray = $GLOBALS['totalexperienceArray'];
                $total_exp = $totalexperienceArray[$userCheck->total_exp];
            }
            $data['total_exp'] = $userCheck->total_exp;

            $company_about = $userCheck->company_about ?: '';
            $data['about_me'] = $company_about;
            
            if( $userCheck->profile_image!='' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image))
                $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image;
            else
                $data['profile_image'] = '';

            if($userCheck->video != '' && file_exists(UPLOAD_VIDEO_PATH.$userCheck->video))
                $data['video'] = DISPLAY_VIDEO_PATH.$userCheck->video;
            else   
                $data['video'] = '';

           
            $cvImages = [];
            $showOldImages = Certificate::where('user_id', $userId)->get();
            foreach ($showOldImages as $showOldImage) {
                $image = $showOldImage->document;
                $id = $showOldImage->id;
                if (!empty($image) && file_exists(UPLOAD_CERTIFICATE_PATH . $image)) {
                    $cvImages[] = ['id' => $id, 'document' => DISPLAY_CERTIFICATE_PATH.$image, 'type' => $showOldImage->type];
                }
            }
            $data['certificates'] = $cvImages;
    
            // Education details
            $basicCourseList = Course::where('type', 'Basic')->where('status', 1)->orderBy('name', 'ASC')->pluck('name', 'id')->toArray();
            $specilyList1 = Specialization::where('status', 1)->orderBy('name', 'asc')->pluck('name', 'id')->toArray();
            $yearArray = array_combine(range(date("Y"), 1950), range(date("Y"), 1950));
            $eduDetails = Education::where('user_id', $userId)->get();
            $educationArray = [];
            foreach ($eduDetails as $eduDetail) {
                $record = [
                    'id' => $eduDetail->id,
                    'course_id' => $eduDetail->basic_course_id,
                    'course_name' => isset($basicCourseList[$eduDetail->basic_course_id]) ? $basicCourseList[$eduDetail->basic_course_id] : '',
                    'specialization_id' => $eduDetail->basic_specialization_id,
                    'specialization' => isset($specilyList1[$eduDetail->basic_specialization_id])?$specilyList1[$eduDetail->basic_specialization_id] :'' ,
                    'university' => $eduDetail->basic_university,
                    'passed_in' => isset($yearArray[$eduDetail->basic_year]) ? $yearArray[$eduDetail->basic_year] : '' ,
                ];
                $educationArray[] = $record;
            }
            $data['educations'] = $educationArray;
    
            // Experience details
            $experienceArray = [];
            $monthName = $GLOBALS['monthName'];
            $expDetails = Experience::where('user_id', $userId)->get();
            foreach ($expDetails as $expDetail) {
                $record = [
                    'id' => $expDetail->id,
                    'industry' => $expDetail->industry,
                    'functional_area' => $expDetail->functional_area,
                    'role' => $expDetail->role,
                    'company_name' => $expDetail->company_name,
                    'designation' => $expDetail->designation,
                    'duration_from' => ['month' => $monthName[$expDetail->from_month], 'month_key' => $expDetail->from_month ,'year' => $yearArray[$expDetail->from_year]],
                    'duration_to' => ['month' => $monthName[$expDetail->to_month], 'month_key' => $expDetail->to_month ,'year' => $yearArray[$expDetail->to_year]],
                    'job_profile' => $expDetail->job_profile,
                ];
                $experienceArray[] = $record;
            }
            $data['experience'] = $experienceArray;
            
            
            echo $this->successOutputResult('View profile.',$data);
            exit;

        }
    }

    public function apps_sendmail(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        if(!$this->recruiterAccess($userId)){
            $msg ='incorrect login type';
            echo $this->errorOutputResult($msg);
            exit;
        }
        $msgString='';
        $data=array();

        $emailAddress =  $request->email_address;
        $subject =  $request->subject;
        $jobId = $request->job_id;
        $message =  $request->message;
        $allEmails = explode(",", $emailAddress);
        $mail_from = MAIL_FROM;
        $site_url = HTTP_FAV;
        $site_title = SITE_TITLE;

        $jobInfo = Job::where('id', $jobId)->first();
        
        if ($jobInfo) {
            $recruiterInfo = User::where('id', $jobInfo->user_id)->first();
            $recruiter_email = $recruiterInfo->email_address;
            $recruiter_company = $recruiterInfo->company_name;
            $job_title = $jobInfo->title;
        }

        foreach ($allEmails as $email) {
            if (trim($email) != '') {
                if (User::where('email_address', $email)->exists()) {
                    $userInfo = User::where('email_address', $email)->first();
                    $userName = ucfirst($userInfo->first_name);


                    $emailTemplate = Emailtemplate::where('id',18)->first();

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

                    $currentYear = date('Y', time());
                    $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

                    $toRepArray = array('[!username!]', '[!MESSAGE!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]', '[!company_email!]', '[!company!]', '[!job!]');
                    $fromRepArray = array($userName, $message, $currentYear, HTTP_FAV, $site_title, $sitelink, $site_url, $subject, $recruiter_email, $recruiter_company, $job_title);
            
                    $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
                    $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);

                    Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

    
                    
                }
            }
        }

        echo $this->successOutputResult('Mail sent successfully.', $data);
        exit;
    }


    public function confirmation($id = null, $md5id = null, $email = null):Response{

        $status=500;
        $msg='';
        $data=array();
        $url=HTTP_FAV;

        if (md5($id) == $md5id) {

            $userInfo = User::where('id',$id)->first();

           // print_r($userInfo);exit;

            if(isset($userInfo->id) && ($userInfo->id != '')){

                if($userInfo->status != 1){

                    User::whereId($userInfo->id)->update([
                        'status'=> 1,
                        'activation_status'=> 1,
                    ]);
                    $msg='Account activated successfully';
                    $status=200;
                }else{
                    $msg='Already activated';
                    $status=200;
                }
            }else{
                $msg='No account found';

            }


        }else{
            $msg='Invalid URL';

        }

        if($status == 200){

            if($userInfo->user_type == 'recruiter'){
                $url=HTTP_FAV.'user/employerlogin';

            }else{
                $url=HTTP_FAV.'user/jobseekerlogin';

            }
        }else{
            $url=HTTP_FAV;

        }
        $data['url']=$url;

       // print_r($url);exit;
       // return Redirect::to($url);

   

    return Response(['response' => $data ,'message' => $msg ,'status' => 200 ],200);


    }

    public function sendsms(Request $request) {
                 $contact="7028362148";

        //$userdetials = $this->User->find('first', array('conditions' => array('User.contact' => $contact)));
        //$userId=$userdetials["User"]["first_name"];
       // $site_title = $this->getSiteConstant('title');
    //    $link = HTTP_PATH . "/users/verifymobilenumber/" . $userId . "/" . md5($userId) . "/" . urlencode($contact);
      //  echo '<pre>';print_r($link);exit;

        $link = HTTP_PATH . "/users/verifymobilenumber/";
        $ApiKey="vs5HTe8jLdUFL93oRODqlzM/PaD/tV24q2yhuUneqQY=";
        $ClientId="f77be74e-4673-474d-ba18-aa3f71612bad";
        $SenderId="12";
        $Message="Welcome to,<br> Please click on below link to verify your mobile number";
     // echo '<pre>';print_r($Message);exit;
       
        $MobileNumbers="91".$contact;


        $url = 'http://164.52.205.46:6005/api/v3/SendSMS';
        
        // Create an associative array to represent the JSON data
        $json_data = [
            'SingleSmsApiModel' => [
                'senderId' => $SenderId,
                'is_Unicode' => true,
                'is_Flash' => true,
                'schedTime' => '',
                'groupId' => '',
                'message' => 'test test',
                'mobileNumbers' => $MobileNumbers,
                'serviceId' => '',
                'coRelator' => '',
                'linkId' => '',
                'principleEntityId' => '',
                'templateId' => '',
                'apiKey' => $ApiKey,
                'clientId' => $ClientId,
            ],
        ];
        
        $json_data = json_encode($json_data);
        
        $headers = [
            'Accept: text/plain',
            'Content-Type: application/json',
        ];
        
        $ch = curl_init($url);
        
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        
        if (curl_errno($ch)) {
            echo 'cURL error: ' . curl_error($ch);
        } else {
            echo 'Response: ' . $response;
        }
        
        curl_close($ch);
       // echo 'called';
        exit;
     }


      
}
