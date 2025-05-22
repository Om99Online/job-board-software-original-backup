<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Models\User;
Use App\Models\Job;
Use App\Models\Category;
use App\Models\Skill;
use App\Models\Country;
use App\Models\Location;
use App\Models\Blog;
use App\Models\Changecolor;
use App\Models\Admin;
use App\Models\Setting;
use App\Models\Plan;
use App\Models\Site_setting;
use App\Models\Emailtemplate;
use Carbon\Carbon;
use Cookie;
use Session;
use Validator;
use DateTime;
use Mail;
use App\Mail\SendMailable;

class AdminsController extends Controller
{

    public function admin_dashboard():Response{

      $authenticateadmin = $this->adminauthentication();

      $total_customers = User::where('user_type','recruiter')->count();



                    $now = Carbon::now();
                    $lastSixMonths = $now->subMonths(8);
                    $range=5;
                    $employersArray=array();
                    $jobseekerchart=array();



                    $monthsData = [];
                    for ($i = 0; $i < 8; $i++) {
                        $startOfMonth = $lastSixMonths->copy()->startOfMonth();
                        $endOfMonth = $lastSixMonths->copy()->endOfMonth();

                        $userCount = User::where('user_type','recruiter')->whereBetween('created', [$startOfMonth, $endOfMonth])->count();
                        $userCount2 = User::where('user_type', 'candidate')->whereBetween('created', [$startOfMonth, $endOfMonth])->count();

                        $monthsData[] = [
                            'month' => $lastSixMonths->format('M'),
                            'user_count' => $userCount,
                            'userCount2' => $userCount2,

                        ];

                        $lastSixMonths->addMonth();
                    }

                    foreach ($monthsData as $key => $monthData) {
                        $month = $monthData['month'];
                        $userCount = $monthData['user_count'];
                        $userCount2 = $monthData['userCount2'];


                        if ($userCount > 0) {
                            $employersArray[$key]['name'] = $monthData['month'];
                            $employersArray[$key]['Employer'] = $userCount;
                            $employersArray[$key]['range'] = $range;

                        } else {
                            $employersArray[$key]['name'] = $monthData['month'];
                            $employersArray[$key]['Employer'] = $userCount;
                            $employersArray[$key]['range'] = $range;
                        }

                        if ($userCount2 > 0) {
                            $jobseekerchart[$key]['name'] = $monthData['month'];
                            $jobseekerchart[$key]['Jobseeker'] = $userCount2;
                            $jobseekerchart[$key]['range'] = $range;

                        } else {
                            $jobseekerchart[$key]['name'] = $monthData['month'];
                            $jobseekerchart[$key]['Jobseeker'] = 0;
                            $jobseekerchart[$key]['range'] = $range;
                        }

                        $range=$range+5;

                    }


//echo '<pre>';print_r($employersArray);exit;


        $total_candidate = User::where('user_type','candidate')->count();

        $total_job = Job::count();

        $total_categories = Category::where('parent_id',0)->count();

        $total_skill = Skill::where('type','Skill')->count();

        $total_designation = Skill::where('type','Designation')->count();

        $total_location = Location::count();

        $total_country = Country::count();

        $total_blog = Blog::count();

        $current_date = date('d');
        $curr_month = date('m');
        $current_year = date('Y');

        $count_data_arr = array();
        for ($i = 1; $i <= $current_date; $i++) {
            $day = $i;

            // $count_data = User::where('DATE(created)',$day)
            // ->where('MONTH(created)',$curr_month)
            // ->where('YEAR(created)',$current_year)
            // ->where('user_type','recruiter')
            // ->count();

            $count_data = User::whereDay('created',$day)
            ->whereMonth('created',$curr_month)
            ->whereYear('created',$current_year)
            ->where('user_type','recruiter')
            ->count();

            $user_datas[$i] = $day . ',' . $count_data;

            $count_data_arr[] = $count_data;
        }

        $total_user_no = array_sum($count_data_arr);
        $total_user_time = sizeof($count_data_arr);
        $max_user = max($count_data_arr);

        $jobseeker_datas = array();
        $count_data_arr1 = array();
        for ($i = 1; $i <= $current_date; $i++) {
            $day = $i;

            // $count_data = User::where('DATE(created)',$day)
            // ->where('MONTH(created)',$curr_month)
            // ->where('YEAR(created)',$current_year)
            // ->where('user_type','candidate')
            // ->count();
            $count_data = User::whereDay('created',$day)
            ->whereMonth('created',$curr_month)
            ->whereYear('created',$current_year)
            ->where('user_type','recruiter')
            ->count();

            $jobseeker_datas[$i] = $day . ',' . $count_data;
            $count_data_arr1[] = $count_data;
        }

        $total_jobseeker_no = array_sum($count_data_arr1);
        $total_jobseeker_time = sizeof($count_data_arr1);
        $max_jobseeker = max($count_data_arr1);

        $employers = user::where('user_type','recruiter')->orderBy('id', 'DESC')->limit(5)->get();
        $jobseekers = user::where('user_type','candidate')->orderBy('id', 'DESC')->limit(5)->get();
        $empsarray = array();
        $jobseeekerarray = array();



        foreach($employers as $key => $emp){
            $empsarray[$key]['id'] = $emp->id;
            $empsarray[$key]['slug'] = $emp->slug;
            $empsarray[$key]['company_name'] = $emp->company_name;
            $empsarray[$key]['fullname'] = $emp->first_name.' '.$emp->last_name;
            $empsarray[$key]['position'] = $emp->position;
            $empsarray[$key]['email_address'] = $emp->email_address;

            $cplan = (new Plan)->getcurrentplan($emp->id);
        
            if($cplan){
                $plan = Plan::where('id',$cplan->plan_id)->first();
                $empsarray[$key]['current_plan'] = $plan->plan_name;
            }else{
                $empsarray[$key]['current_plan'] = '';
            }

            $empsarray[$key]['created'] = date('M d, Y',strtotime($emp->created));
            $empsarray[$key]['status'] = $emp->status;

        }

        foreach($jobseekers as $key => $jobseeker){
            $jobseeekerarray[$key]['id'] = $jobseeker->id;
            $jobseeekerarray[$key]['slug'] = $jobseeker->slug;
            $jobseeekerarray[$key]['fullname'] = $jobseeker->first_name.' '.$jobseeker->last_name;
            $jobseeekerarray[$key]['contact'] = $jobseeker->contact;
            $jobseeekerarray[$key]['email_address'] = $jobseeker->email_address;
            $jobseeekerarray[$key]['location'] = $jobseeker->location;
            $jobseeekerarray[$key]['created'] = date('M d, Y',strtotime($jobseeker->created));
            $jobseeekerarray[$key]['status'] = $jobseeker->status;

        }

      //  echo '<pre>';print_r($employers);exit;

        $data=[
            'total_customers' => $total_customers,
            'total_candidate' => $total_candidate,
            'total_job' => $total_job,
            'total_categories' => $total_categories,
            'total_skill' => $total_skill,
            'total_designation' => $total_designation,
            'total_location' => $total_location,
            'total_country' => $total_country,
            'total_blog' => $total_blog,
            'total_user_no' => $total_user_no,
            'total_user_time' => $total_user_time,
            'max_user' => $max_user,
            'user_datas' => $user_datas,
            'total_jobseeker_no' => $total_jobseeker_no,
            'total_jobseeker_time' => $total_jobseeker_time,
            'max_jobseeker' => $max_jobseeker,
            'jobseeker_datas' => $jobseeker_datas,
            'employees' => $empsarray,
            'jobseekers' => $jobseeekerarray,
            'employerchart' => $employersArray,
            'jobseekerchart' => $jobseekerchart,
         ];

      // echo '<pre>';print_r($data);exit;

        return Response(['response' => $data, 'message'=>'success' ,'status'=>200],200);
    }
    
    public function admin_login(Request $request) {
        // $pp='jobsite_admin';
        
        //  Admin::whereId(1)->update([
        //                 'password'=> Hash::make($pp),
        //             ]);
                    
        //             echo 'updated';exit;
        // $this->requestAuthentication('POST', 2);

        // $jsonStr = $_POST['jsonData'];
        // $userData = json_decode($jsonStr, true);

        $userData = $request->all();

        $username = $userData['username'];
        $password = $userData['password'];


        $userCheck = Admin::where('username', $username)
        ->first();


        $response = '';
        $message = 'Invalid email and/or password.';
        $status = 500;

        if (!empty($userCheck) && crypt($password, $userCheck->password) == $userCheck->password) {
            $data = $this->logindata($userCheck);
            // User::where('id', $userCheck->id)->update(array('device_type' => $device_type, 'device_id' => $device_id));

            $response = $data;
            $message = 'login sucessfully';
            $status = 200;
        } else {
            
        //             $pp='jobsite_admin';
        
        //  Admin::whereId(1)->update([
        //                 'password'=> Hash::make($pp),
        //             ]);
                    
        //             echo 'updated';exit;
        
            $response = '';
            $message = 'Invalid username and/or password.';
            $status = 500;
        }
        
        return Response(['response'=> $response , 'message'=>$message , 'status'=>$status],200);
    }

    public function logindata($userCheck) {

        $data = array();
        $data['adminid'] = $userCheck->id;
        $data['user_type'] = $userCheck->user_type;
        $data['first_name'] = $userCheck->first_name;
        $data['last_name'] = $userCheck->last_name;
        $data['email_address'] = $userCheck->email_address;
        $data['profile_image'] = $userCheck->profile_image;
        $data['video'] = $userCheck->video;
        $data['access'] = isset($userCheck->role_ids) ? unserialize($userCheck->role_ids) : '';

        $randomString = Str::random(240);

        $d =  strtotime("now");
        $d1 =  strtotime("+3 Hours",$d);

        $token  = $randomString.'.'.base64_encode($d1);
        // $token = $this->setToken($userCheck);
        $data['token'] = $token;
        return $data;
    }
    
    public function admin_changecolorscheme(Request $request):Response{
        $authenticateadmin = $this->adminauthentication();

        if(empty($request->all())){
            $Change_color=Changecolor::first();
            return Response(['response' =>$Change_color , 'message' => 'success' ,'status'=>200],200);
        }else{

            $msgString = '';

            if(empty($request->theme_color)){
                $msgString .= 'Theme Color is a required field';
            }

            if(empty($request->theme_background)){
                $msgString .= 'Theme Background is a required field';
            }

            if (isset($msgString) && $msgString != '') {
                return Response(['responce'=>$msgString , 'status'=>500 ],200);

            }else{

                if(empty($request->is_default)){
                    $is_default=0;
                }else{
                    $is_default=$request->is_default;
                }

                try{
                    Changecolor::where('id',6)->update([
                        'theme_color' => $request->theme_color,
                        'theme_background' => $request->theme_background,
                        'is_default' => $request->is_default,
                        'updated_at' => now(),
                    ]);

                    $Change_color=Changecolor::first();

                    return Response(['response' =>$Change_color , 'message' => 'Color Theme Updated Successfully' ,'status'=>200],200);

                }
                catch(\Exception $e){

                    return Response(['response' => '' , 'message' => 'Something went wrong' ,'status'=>500],200);

                }

            }

        }

    }
    
    public function changePassword(Request $request):Response{
        $authenticateadmin = $this->adminauthentication();

        // $tokenData = $this->requestAuthentication('POST', 1);
        // $user_id = $tokenData['user_id'];
        $status=500;
        $data=array();
        $id = $authenticateadmin['id'];

        $input = $request->all();
        $rules = array(
            'old_password' => 'required',
            'new_password' => 'required|min:8',
            'conf_password' => 'required|min:8|same:new_password',
        );

        $validator = Validator::make($input, $rules);

        $validator->setAttributeNames([
            'old_password' => 'Old Password',
            'new_password' => 'New Password',
            'conf_password' => 'Confirm password',
        ]);

        if ($validator->fails()) {
            $msg = $this->validatersErrorString($validator->errors());
        }else{
            $getuser = Admin::where('id',$id)->first();
            if (password_verify($request->old_password, $getuser->password)) {
                if (!(password_verify($request->new_password, $getuser->password))) {

                    Admin::whereId($id)->update([
                        'password'=> Hash::make($request->new_password),
                    ]);
                    $msg='Your Password has been changed successfully.';
                    $status=200;

                }else{
                    $msg='You cannot put your old password for the new password.';
                }

            }else{
                $msg='Old Password is not correct.';

            }
        }
        return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);

    }

    public function admin_changeusername(Request $request):Response{
        $authenticateadmin = $this->adminauthentication();

        // $id = $this->Session->read("adminid");
        $id = $authenticateadmin['id'];

        $Admindetail= Admin::where('id',$id)->first();

        $msgString = "";

        if(!empty($request->all())){

            if(empty($request->new_username)){
                $msgString = "- New Username is required field.<br>";
            }elseif ($request->new_username  == $Admindetail->username) {
                $msgString .= "- You can not change new username same as current username.<br>";
            }

            if(empty($request->conf_username)){
                $msgString .= "- Confirm Username is required field.<br>";
            }

            if(trim($request->new_username) != trim($request->conf_username)){
                $msgString .= "- New Username And Confirm Username Should be Match.<br>";
            }
            if(trim($request->new_username) != trim($request->old_username)){

                $admin_count = Admin::where('username',$request->new_username)
                ->count();

                if($admin_count > 0){
                     $msgString .= "- Username already exists.<br>";
                 }
            }
            if(isset($msgString) && $msgString != ''){
                return Response(['responce'=>'','message'=>$msgString , 'status'=>500 ],200);
            }else{

                try{
                    Admin::whereId($id)->update([
                        'username' => $request->new_username,
                    ]);

                    return Response(['responce' => 'Admin Username Updated Successfully.' ,'message' => 'Admin Username Updated Successfully.' , 'status'=>200],200);
                }
                catch(\Exception $e){
                    return Response(['responce' => 'There was an error while updating Admin Username.' ,'message' => 'There was an error while updating Admin Username.' , 'status'=>500],200);
                }


            }
        }
        
        $data['username'] = $Admindetail->username;
        
        return Response(['response' => $data , 'message' => '' , 'status' => 200 ]);

    }

    public function admin_changeemail(Request $request):Response{
        $authenticateadmin = $this->adminauthentication();

        // $id = $this->Session->read("adminid");
        $id = $authenticateadmin['id'];

        $msgString = "";

        $Admindetail = Admin::where('id',$id)->first();
        
        $input = $request->all();
        
        if(!empty($input)){
            $rules = array(
                'old_email' => 'required|email|different:new_email',
                'new_email' => 'required|email|unique:admins,email',
                'conf_email' => 'required|email|same:new_email'
            );

            $validator = Validator::make($input, $rules);
    
            $validator->setAttributeNames([
                'old_email' => 'Old Email',
                'new_email' => 'New Email',
                'conf_email' => 'Confirm Email',
            ]);
    
            if ($validator->fails()) {
    
                $errors = $validator->errors();
                    
                foreach ($errors->all() as $error) {
                    $msgString .= " - ".$error."<br>";
                }
    
                return Response(['responce'=>$msgString ,'message'=>$msgString, 'status'=> 500],200);
            } else {
                try{
                    Admin::whereId($id)->update(['email' => $request->new_email ]);
                    return Response(['responce'=>'' , 'message' =>'Admin Email Updated Successfully.' , 'status'=>200],200);
                }catch(\Exception $e){
                    return Response(['responce'=>'' , 'message' =>'There was an error while updating Admin Email.' ,'status'=>500],200);
                }
            }
        }


        
        $data['old_email'] = $Admindetail->email;
        
        return Response(['response' => $data , 'message' => '' , 'status' => 200 ]);
    }

    public function admin_changeccemail(Request $request):Response{
        $authenticateadmin = $this->adminauthentication();

        $id = $authenticateadmin['id'];

        $msgString='';

        $Admindetail = Admin::where('id',$id)->first();

        $input = $request->all();
        
        if(!empty($input)){
            $rules = array(
                'old_email' => 'required|email|different:new_email',
                'new_email' => 'required|email|unique:Admin,cc_email',
                'conf_email' => 'required|email|same:new_email'
            );
    
            $validator = Validator::make($input, $rules);
    
            $validator->setAttributeNames([
                'old_email' => 'Old CC Email',
                'new_email' => 'New CC Email',
                'conf_email' => 'Confirm CC Email',
            ]);
            if ($validator->fails()) {
    
                $errors = $validator->errors();
                    
                foreach ($errors->all() as $error) {
                    $msgString .= " - ".$error."<br>";
                }
    
                return Response(['responce'=>$msgString ,'message'=>$msgString, 'status'=> 500],200);
            } else {
                try{
                    Admin::whereId($id)->update(['cc_email' => $request->new_email ]);
                    return Response(['responce'=>'' , 'message' =>'Admin CC Email Updated Successfully.' , 'status'=>200],200);
                }catch(\Exception $e){
                    return Response(['responce'=>'' , 'message' =>'There was an error while updating Admin CC Email.' ,'status'=>500],200);
                }
            }
        }


        
        $data['old_email'] = $Admindetail->cc_email;
        
        return Response(['response'=> $data , 'message' => '' , 'status' => 200  ]);
    }

    public function admin_settings(Request $request):Response{
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $Admindetail = Setting::where('id',1)->first();

        $msgString = '';
        
        if(!empty($request->all())){
            $input = $request->all();
    
            $rules = array(
                'company_name' => 'required',
                'email' => 'required',
                'address' => 'required',
                'contact' => 'required',
            );
    
            $validator = Validator::make($input, $rules);
    
            $validator->setAttributeNames([
                'company_name' => 'Company Name',
                'email' => 'Email Address',
                'address' => 'Address',
                'contact' => 'Contact',
            ]);
    
            if($validator->fails()){
    
                $errors = $validator->errors();
                
                foreach ($errors->all() as $error) {
                    $msgString .= " - ".$error."<br>";
                }
    
                return Response(['responce'=>$msgString ,'message'=>$msgString, 'status'=> 500],200);
            }else{
                // try{
                    Setting::where('id',1)->update([
                        'company_name' => $request->company_name,
                        'email' => $request->email,
                        'address' => $request->address,
                        'contact' => $request->contact,
                    ]);
    
                    return Response(['response'=>'Contact Us Details Updated Successfully.' ,'message'=>'Contact Us Details Updated Successfully.' ,'status'=>200],200);
                // }
                // catch(\Exception $e){
                //     return Response(['response' => 'There was an error while updating contact us details.' , 'message' => 'There was an error while updating contact us details.' ,'status'=>500],200);
                // }
    
            }
        }
        
        $data['company_name'] = $Admindetail->company_name;
        $data['email'] = $Admindetail->email;
        $data['address'] = $Admindetail->address;
        $data['contact'] = $Admindetail->contact;
        
        return Response(['response' => $data , 'message' => '' ,'status'=>200 ]);
        


    }


    public function userdetails():Response {
        $id = $authenticateadmin['id'];

        $userdetails = Admin::find($id);

        return Response(['response' => $userdetails , 'message' => '' ,'status' => 200],200);
    }

    public function admin_picture(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $id = 1;

        $Admindetail = Admin::where('id',$id)->first();

        if(!empty($request->all())){

            $rule = array([
                'profile_image' => 'required',
            ]);

            $validator = Validator::make($request->all(),$rule);

            if($validator->fails()){
                return Response(['response' => '', 'message' => 'profile image required' , 'status' => 500 ],200);
            }else{

                if($request->profile_image){
                    $file = explode( ";base64,", $request->profile_image);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    $originalName = Str::random(10).'.'.$image_type;
                    $decoded_string = base64_decode($file[1]);
                    file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$originalName, $decoded_string);

                    // $this->resizeImage();
                    // $uploadedFileName, $imgFolder, $thumbfolder, $newWidth = false, $newHeight = false, $quality = 75, $bgcolor = false

                    if ($Admindetai->profile_image != '') {
                        @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $Admindetail->profile_image);
                        @unlink(UPLOAD_FULL_PROFILE_IMAGE_PATH . $Admindetail->profile_image);
                    }

                    $admin = Admin::find(1);
                    $admin->profile_image = $originalName;
                    $admin->save();

                    $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$originalName;
                }
            }
        }else{
            $data['profile_image'] = $Admindetail->profile_image;
        }


        return Response(['response' => $data , 'message'=> 'success' , 'status' => 200],200);

    }

    public function admin_commission(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $input = $requests->all();

        $rules = array(
            'commission' => 'required|gt:0',
        );

        $validator = Validator::make($input, $rules);

        if($validator->fails()){

            $errors = $validator->errors();
            
            foreach ($errors->all() as $error) {
                $msgString .= " - ".$error."<br>";
            }

            return Response(['responce'=>$msgString ,'message'=>$msgString, 'status'=> 500],200);
        }else{
            try{
                Admin::whereId($id)->update([
                    'commission' => $request->commission
                ])->save();

                return Response(['response' => 'Admin Commission Set Successfully.' ,'message'=>'Admin Commission Set Successfully.' , 'status'=>200],200);
            }catch(\Exception $e){
                return Response(['response' => 'There was an error while setting admin commission.' ,'message'=>'There was an error while setting admin commission.' , 'status'=>500],200);
            }
        }
    }

    public function admin_promocode(Request $request):Response{
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $id=1;

        $input = $requests->all();

        $rule = array(
            'promocode' => 'required',
            'selectuser' => 'required',
            'offer' => 'required',
        );

        $validator = Validator::make($input, $rules);

        $validator->setAttributeNames([
            'promocode' => 'Promo Code',
            'selectuser' => 'Select the any one user',
            'offer' => 'Offer',
        ]);

        if($validator->fails()){

            $errors = $validator->errors();
            
            foreach ($errors->all() as $error) {
                $msgString .= " - ".$error."<br>";
            }

            return Response(['responce'=>$msgString ,'message'=>$msgString, 'status'=> 500],200);
        }else{

            Admin::whereId($id)->update([
                'promocode' => $request->promocode,
                'selectuser' => $request->selectuser,
                'offer' => $request->offer,
            ])->save();

            return Response(['response' => 'Promo Code Set Successfully.' , 'message' => 'Promo Code Set Successfully.' , 'status'=>200],200);
        }

    }


    public function admin_securityQuestions(Request $request):Response{
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $id=1;
        $msgString ='';
            

        if(!empty($request->all())){

            $input = $request->all();

            $rule = array(
                'question1' => 'required',
                'answer1' => 'required',
                'question2' => 'required',
                'answer2' => 'required,'
            );

            $validator = Validator::make($input, $rule);

            $validator->setAttributeNames([
                'question1' => 'Question 1',
                'answer1' => 'Answer 1',
                'question2' => 'Question 2',
                'answer2' => 'Answer 2'
            ]);

            // if($validator->fails()){

            //     $errors = $validator->errors();
            
            //     foreach ($errors->all() as $error) {
            //         $msgString .= " - ".$error."<br>";
            //     }

            //     return Response(['responce'=>$msgString ,'message'=>$msgString, 'status'=> 500],200);
            // }else{

                try{
                    Admin::where('id',$id)->update([
                        'question1' => $request->question1,
                        'answer1' => $request->answer1,
                        'question2' => $request->question2,
                        'answer2' => $request->answer2,
                    ]);

                    $msgString='Security questions and answer updated Successfully.';

                    return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200 ],200);
                }
                catch(\Exception $e){

                    $msgString='There was an error while updating security questions.';
                    return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);

                }

            // }

        }else{

            $AdminDetails = Admin::where('id',$id)->first();
            
            $data['question1'] = $AdminDetails->question1;
            $data['answer1'] = $AdminDetails->answer1;
            $data['question2'] = $AdminDetails->question2;
            $data['answer2'] = $AdminDetails->answer2;

            return Response(['response' => $data ,'message'=>'' ,'status'=>200 ],200);

        }
    }


    public function admin_planPrice(Request $request):Response{

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $id = 1;

        if(!empty($request->all())){
            $rule = array([
                'bronze' => 'required|gt:0',
                'silver' => 'required|gt:0',
                'gold' => 'required|gt:0',
            ]);

            $validator = Validator::make($request->all());

            if($validator->fails()){
                $errors = $validator->errors();
                return Response(['response'=>'' , 'message' => $error ,'status'=>500],500);
            }else{
                Admin::where('id',$id)->update([
                    'bronze' => $request->bronze,
                    'silver' => $request->silver,
                    'gold' => $reques->gold,
                ]);

                return Response(['response'=>'' , 'message'=> 'Plan price updated Successfully', 'status'=>200],200);
            }
        } else{
            $data['plan_price'] = Admin::where('id',$id)->select('bronze','silver','gold')->first();

            return Response(['response' => '' , 'message' => 'success','status'=>200]);
        }
    }

    public function admin_changeSlogan(Request $request):Response {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $id = 1;

        $msgString = '';

        if(!empty($request->all())){

            $input = $request->all();

            $rules = array(
                'slogan_text' => 'required',
                'slogan_title' => 'required',
            );

            $validator = Validator::make($input , $rules);

            $validator->setAttributeNames([
                'slogan_text' => 'Slogan Text',
                 'slogan_title' => 'Slogan Title',
            ]);

            if($validator->fails()){
                $errors = $validator->errors();

                foreach($errors->all() as $error){
                    $msgString .= " - ".$error."<br>";
                }

                return Response(['response' =>$msgString  ,'message'=>$msgString , 'status'=>500],200);
            }else{

                Site_setting::whereId($id)->update([
                    'slogan_text' => $request->slogan_text,
                    'slogan_title' => $request->slogan_title,
                ]);

                $msgString='Slogan details updated Successfully';

                return Response(['response' => $msgString ,'message'=> $msgString , 'status'=>200],200);
            }

        }else{

            $data['slogan_text'] = Site_setting::whereId($id)->first();

            return Response(['response' => $data ,'message'=>'success', 'status'=>200],200);

        }
    }

    public function admin_changePaymentdetail(Request $request):Response {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $msgString = '';

        $id = 1;

        if(!empty($request->all())){

            $input = $request->all();

            $rules = array(
                'paypal_email' => 'required',
            );

            $validator = Validator::make($input,$rules);

            $validator->setAttributeNames([
                'paypal_email' => 'Paypal Email',
            ]);

            if($validator->fails()){

                $errors = $validator->errors();

                $msgString = $this->validatersErrorString($errors);

                return Response(['response'=> $msgString , 'message' => $msgString , 'status'=>500],200);
            }
            else{

                Admin::where('id',$id)
                ->update([
                    'paypal_email' => $request->paypal_email,
                    'stripe_secret_key' => $request->stripe_secret_key,
                    'paypal_url' => $request->paypal_url,
                    'stripe_pk' => $request->stripe_pk
                ]);

                $msgString='Payment Email updated Successfully';

                return Response(['response' => $msgString ,'message' => $msgString ,'status'=>200],200);
            }
        }else{
            $AdminDetails = Admin::where('id',$id)->first();
            $data['paypal_email'] = $AdminDetails->paypal_email;
            $data['stripe_secret_key'] = $AdminDetails->stripe_secret_key;
            $data['paypal_url'] = $AdminDetails->paypal_url;
            $data['stripe_pk'] = $AdminDetails->stripe_pk;

            return Response(['response' => $data , 'message' => 'success' , 'status'=>200 ],200);
        }
    }

    public function admin_metaManagement(Request $request): Response {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $msgString = "";

        $id = 1;

        if(!empty($request->all())){

            $input = $request->all();

            // $rules = array([
            //     'default_title'
            //     'default_keyword'
            //     'default_description'
            //     'meta_jobtitle'
            //     'meta_jobkeywords'
            //     'meta_jobdescription'
            //     'meta_catetitle'
            //     'meta_catekeywords'
            //     'meta_catedescription'
            // ]);

            Admin::where('id',$id)
            ->update([
                'default_title' => $request->default_title,
                'default_keyword' => $request->default_keyword,
                'default_description' => $request->default_description,
                'meta_jobtitle' => $request->meta_jobtitle,
                'meta_jobkeywords' => $request->meta_jobkeywords,
                'meta_jobdescription' => $request->meta_jobdescription,
                'meta_catetitle' => $request->meta_catetitle,
                'meta_catekeywords' => $request->meta_catekeywords,
                'meta_catedescription' => $request->meta_catedescription,
            ]);

            $msgString = 'Meta details update sucessfully.';

            return Response(['response' => $msgString , 'message' => $msgString , 'status'=>200 ],200);


        }else{
            $data=Admin::where('id',$id)
            ->select(
                'default_title',
                'default_keyword',
                'default_description',
                'meta_jobtitle',
                'meta_jobkeywords',
                'meta_jobdescription',
                'meta_catetitle',
                'meta_catekeywords',
                'meta_catedescription'
            )->first();

            return Response(['response'=>$data , 'message'=>'success' , 'status'=>200],200);
        }
    }
    
    public function admin_manage(Request $request):Response{

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $id=1;

        if($id > 1 ){
            return Response(['response' =>'You dont have access to this option.', 'message' => 'You dont have access to this option.', 'status' => 200 ],200);
        }

        $name = '';

        if(!empty($request->all())){
            if($request->name != ''){
                $name = $request->name;
            }
            if($request->action != ''){
                $idList = $request->idList;
                if($idList){
                    if($request->action == 'activate'){
                        Admin::whereRaw('id IN ('.$idList.')')->update(['status' => 1]);
                    }else
                    if($request->action == 'deactivate'){
                        Admin::whereRaw('id IN ('.$idList.')')->update(['status' => 0]);
                    }else
                    if($request->action == 'delete'){
                        Admin::whereRaw('id IN ('.$idList.')')->delete();
                    }
                }
            }
        }

        $admin = new Admin;

        if($name != ''){
            $admin->whereRaw("(first_name LIKE '%" . addslashes($name) . "%' or last_name LIKE '%" . addslashes($name) . "%' or username LIKE '%" . addslashes($name) . "%' or email LIKE '%" . addslashes($name) . "%') ");
        }

        $admin->where('id','<>',1);
        $admin->select(    
            'id',
            'slug',
            'first_name',
            'last_name',
            'username',
            'email',
            'created',
            'status');
        $adminDetails = $admin->where('id','!=',1)->get();

        $adminArray = array();

        foreach($adminDetails as $key => $admins){
            $adminArray[$key]['id'] = $admins->id;
            $adminArray[$key]['slug'] = $admins->slug;
            $adminArray[$key]['first_name'] = $admins->first_name;
            $adminArray[$key]['last_name'] = $admins->last_name;
            $adminArray[$key]['username'] = $admins->username;
            $adminArray[$key]['email'] = $admins->email;
            $adminArray[$key]['created'] = date('M d, Y',strtotime($admins->created));
            $adminArray[$key]['status'] = $admins->status;
        }

        $data['adminDetails'] = $adminArray;

        return Response(['response'=>$data , 'message'=>'success', 'status' => 200],200);
    }

    public function admin_addsubadmin(Request $request):Response {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $msgString = '';

        $id = 1;

        if($id != 1){
            return Response(['response' => '' , 'message' =>'' , 'status'=>500],200);
        }
        
        if(!empty($request->all())){
            $input = $request->all();
    
            $rules = array(
                'first_name' => 'required',
                'last_name' => 'required',
                'username' => 'required|unique:admins,username',
                'email' => 'required|email|unique:admins,email',
                'password' => 'required|min:8',
                'confirm_password' => 'required|same:password',
            );
    
            $validator = Validator::make($input,$rules);
    
            $validator->setAttributeNames([
                'first_name' => 'First Name',
                'last_name' => 'Last Name',
                'username' => 'Username',
                'email' => 'Email Address',
                'password' => 'Password',
                'confirm_password' => 'Confirm Password',
            ]);
    
    
            if($validator->fails()){
                $errors = $validator->errors();
    
                $msgString = $this->validatersErrorString($errors);
    
                return Response(['response' => $msgString ,'message' => $msgString , 'status' => 500 ],200);
            }else{
    
                $strongPassword = preg_match('((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20})', $request->password);
                if ($strongPassword == 0) {
                        $msgString = "- Password minimum length must be 8 characters and combination of 1 special character, 1 lowercase character, 1 uppercase character and 1 number.<br>";
                        return Response(['response'=>$msgString ,'message'=>$msgString,'status'=>500],200);
                }
    
                $passwordPlain = $request->password;
                $salt = uniqid(mt_rand(), true);
                $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');
    
                Admin::insert([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'username' => $request->username,
                    'email' => $request->email,
                    'password' => $new_password,
                    'slug' => $this->createSlug($request->first_name.'_'.$request->last_name,'admins'),
                    'status' => 1,
                    'created' => now(),
                    'modified' => now(),
                ]);
    
                $msgString ='Sub admin account created successfully';
    
                return Response(['response' => $msgString ,'message' => $msgString , 'status'=>200],200);
            }
        }

    }

    public function admin_editadmins(Request $request , $slug = ""):Response{
        $msgString = '';

        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }


        if(!empty($request->all())){

            $input = $request->all();
            $rules = array(
                'first_name' => 'required',
                'last_name' => 'required',
                'username' => 'required',
                'email' => 'required|email',
            );

            $validator = Validator::make($input,$rules);

            $validator->setAttributeNames([
                'first_name' => 'First Name',
                'last_name' => 'Last Name',
                'username' => 'Username',
                'email' => 'Email Address',
            ]);

            if($validator->fails()){

                $errors = $validator->errors();

                $msgString = $this->validatersErrorString($errors);

                return Response(['response' => $msgString , 'message' => $msgString  ,'status'=>500 ],200);
            }else{

                $is_username=Admin::where('slug','<>',$slug)
                ->where('username',$request->username)
                ->count();

                if($is_username > 0){
                    $msgString .= "- Username already exists.<br>";
                }

                $is_email=Admin::where('slug','<>',$slug)
                ->where('email',$request->email)
                ->count();

                if($is_email > 0){
                    $msgString .= "- Email already exists.<br>";
                }

                if(trim($request->new_password)!=''){
                    if(strlen($request->new_password) < 8 ){
                        $msgString .= "- Password must be at least 8 characters.<br>";
                    }else{
                        $strongPassword = preg_match('((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20})', $request->new_password);
                        if ($strongPassword == 0) {
                            $msgString .= "- Password minimum length must be 8 characters and combination of 1 special character, 1 lowercase character, 1 uppercase character and 1 number.<br>";
                        }
                    }

                    if(trim($request->confirm_password) == ''){
                        $msgString .= "- Confirm Password is required field.<br>";
                    } else {
                        $password = $request->new_password;
                        $conformpassword = $request->confirm_password;

                        if ($password != $conformpassword) {
                            $msgString .= "- New password and confirm password mismatch.<br>";
                        }
                        elseif (crypt($request->new_password, $request->old_password) == $request->old_password) {// Checking the both password matched aur not
                            $msgString .= "- You cannot put old password for the new password!<br>";
                        } else {
                            $changedPassword = 1;
                            $passwordPlain = $request->new_password;
                            $salt = uniqid(mt_rand(), true);
                            $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');

                            $password = $new_password;
                        }
                    }
                }
               

                if (isset($msgString) && $msgString != '') {
                    return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500],200);
                } else {

                    Admin::where('slug',$slug)->update([
                        'first_name' => $request->first_name,
                        'last_name' => $request->last_name,
                        'username' => $request->username,
                        'email' => $request->email,
                    ]);


                    if(isset($password) && $password != '' ){
                        Admin::where('slug',$slug)
                        ->update([
                            'password' => $password,
                        ]);
                        
                     //   echo 'helooo';exit;
                    }


                    $msgString='Sub admin account updated successfully.';
                    return Response(['response' =>$msgString ,'message'=> $msgString ,'status'=>200],200);
                }

            }
        }else{
            $adminDetails = Admin::where('slug', $slug)
            ->select(
                'first_name',
                'last_name',
                'username',
                'email'
            )->first();
            
            $data['first_name'] = $adminDetails->first_name;
            $data['last_name'] = $adminDetails->last_name;
            $data['username'] = $adminDetails->username;
            $data['email'] = $adminDetails->email;

            return Response(['response'=>$adminDetails , 'message'=>'sucess','status'=>200],200);

        }

    }

    public function admin_deleteadmins($slug = NULL):Response {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        if ($slug != '') {

            Admin::where('slug',$slug)->delete();

            $msgString = 'Sub admin details deleted successfully';

            return Response(['response' => $msgString ,'message' => $msgString ,'status' => 200 ],200);
        }
        
        return Response(['response' => 'No slug' ,'message' => 'No slug' , 'status' => 500 ],200);
    }

    public function admin_activateuser($slug = NULL) {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        if ($slug != '') {

            Admin::where('slug',$slug)->update([
                'status' => 1,
            ]);

            $msgString = 'Sub admin activated successfully';

            return Response(['response' => $msgString ,'message' => $msgString ,'status' => 200 ],200);
        }
        return Response(['response' => 'No slug' ,'message' => 'No slug' , 'status' => 500 ],200);
    }

    public function admin_deactivateuser($slug = NULL) {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        if ($slug != '') {

            Admin::where('slug',$slug)->update([
                'status' => 0,
            ]);

            $msgString = 'Sub admin deactivated successfully';

            return Response(['response' => $msgString ,'message' => $msgString ,'status' => 200 ],200);
        }
        return Response(['response' => 'No slug' ,'message' => 'No slug' , 'status' => 500 ],200);
    }

    public function admin_managerole(Request $request, $slug = null) {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }
        }

        $msgString = '';


        if(!empty($request->all())){

            // $request->role_ids;
            // $request->sub_role_ids;
            
            $checkboxs = $request->access;
            
            // print_r($checkboxs);
            

            $access = array();
            foreach($checkboxs as $key => $checkbox){
                $access[$key]['Module'] = $checkbox['Module'];
                $access[$key]['Add'] = isset($checkbox['Add']) ? $checkbox['Add'] : 0;
                $access[$key]['Edit'] = $checkbox['Edit'];
                $access[$key]['Delete'] = isset($checkbox['Delete'])? $checkbox['Delete'] : 0 ;
            }

            Admin::where('slug',$slug)->update([
                'role_ids' => serialize($access),
            ]);

            return response()->json(['message' => 'Staff access updated sucessfully' , 'status' => 200 ],200);

        }else{
            
            $adminData=Admin::where('slug',$slug)
            ->select('role_ids')
            ->first();
            
            $accessData = isset($adminData->role_ids) ? unserialize($adminData->role_ids) : '' ;
            
            global $subadminAccess;
            
            $accessControlArray = $subadminAccess;
            
            $accessArray = array();
            
            foreach($accessControlArray as $key => $ac){
                
                $accessArray[$key]['name'] = $ac['name'];
                $accessArray[$key]['Module'] = $ac['Module'];
                $accessArray[$key]['Edit'] = $ac['Edit'];
                
                if(isset($ac['Add'])){
                    $accessArray[$key]['Add'] = $ac['Add'];
                    $accessArray[$key]['Delete'] = $ac['Delete'];
                }


                if(isset($accessData[$key])){
                    $accessArray[$key]['Module'] = $accessData[$key]['Module'];
                    $accessArray[$key]['Edit'] = $accessData[$key]['Edit'];
                    
                    if(isset($accessData[$key]['Add'])){
                        $accessArray[$key]['Add'] = $accessData[$key]['Add'];
                        $accessArray[$key]['Delete'] = $accessData[$key]['Delete'];
                    }
                }
            }
            
            $data['accesscontrol'] =  $accessArray;
            //$data['full_name'] = $access->full_name;

            
            // $adminData=Admin::where('slug',$slug)
            // ->select('role_ids','sub_role_ids')
            // ->get();

            return Response(['response' => $data ,'message'=>'success', 'status'=>200 ],200);
        }

    }

    public function admin_uploadLogo(Request $request):response {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
    

        $id = 1;
        $oldLogo = Admin::where('id',1)->select('logo')->first();

        if(!empty($request->all())){

            if($request->logo){
                $file = explode( ";base64,", $request->logo);
                $image_type_pieces = explode( "image/", $file[0] );
                $image_type = $image_type_pieces[1];
                $originalName = 'logo.png';
                $decoded_string = base64_decode($file[1]);
                file_put_contents(LOGO_IMAGE_UPLOAD_PATH.$originalName, $decoded_string);

                // $this->resizeImage();
                // $uploadedFileName, $imgFolder, $thumbfolder, $newWidth = false, $newHeight = false, $quality = 75, $bgcolor = false

                // if ($Admindetai->profile_image != '') {
                //     // @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $Admindetail->profile_image);
                //     @unlink(LOGO_IMAGE_UPLOAD_PATH . $oldLogo->logo);
                // }

                $admin = Admin::find(1);
                $admin->logo = $originalName;
                $admin->save();
                
                $data['logo_path'] = LOGO_PATH;
                $data['logo'] = '';
            }else{
                return Response(['response' => '' , 'message'=> 'logo required', 'status'=>500],200);
            }
            
        }else{
            $data['logo_path'] = LOGO_PATH;
            $data['logo'] = '';

        }

        return Response(['response'=>$data , 'message'=>'success' , 'status' => 200 ],200);


    }

    public function deleteLogo():Response {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
 

            $logo = Admin::where('id',$id)->select('logo')->first();
            Admin::where('id',$id)->update(['logo' => '']);
            @unlink(UPLOAD_FULL_WEBSITE_LOGO_PATH . $logo->logo);

            return Response(['response' => '' , 'message' => 'Logo Deleted Successfully' ,'status' => 200 ],200);

    }


    public function admin_changeFavicon(Request $request):Response {
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $id = 1;
        
        $oldFav = Admin::where('id',$id)->select('favicon')->first();

        if(!empty($request->all())){
            if($request->favicon == '' ){
                return Response(['response' => '' , 'mesasge'=> 'favicon required' , 'status'=> 500],200);
            }else{
                if($request->favicon != ''){
                    $file = explode( ";base64,", $request->favicon);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    // $originalName = Str::random(10).'.'.$image_type;
                    $decoded_string = base64_decode($file[1]);
                    file_put_contents(UPLOAD_FULL_FAV_PATH.'favicon.ico', $decoded_string);

                    // $this->resizeImage();
                    // $uploadedFileName, $imgFolder, $thumbfolder, $newWidth = false, $newHeight = false, $quality = 75, $bgcolor = false

                    // if ($Admindetai->profile_image != '') {
                    //     // @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $Admindetail->profile_image);
                    //     @unlink(UPLOAD_FULL_FAV_PATH . $oldFav->favicon);
                    // }

                    $admin = Admin::find(1);
                    $admin->favicon = 'favicon.ico';
                    $admin->save();


                    $data['favicon_path'] = DISPLAY_FULL_FAV_PATH.'favicon.ico';
                    $data['favicon'] = "";
                }
            }

        }else{
            $data['favicon_path'] = DISPLAY_FULL_FAV_PATH.'favicon.ico';
            $data['favicon'] = '';
        }

        return Response(['response' => $data , 'message' => 'success' ,'status' => 200],200);


      
    }

    public function deletefavicon() {

        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $id = 1;

        if ($id > 0) {

            $oldFav = Admin::where('id',$id)->select('favicon')->first();
            Admin::where('id',$id)->update(['favicon'=>'']);
            @unlink(UPLOAD_FULL_WEBSITE_LOGO_PATH . $oldFav->favicon);

            return Response(['response' =>''  ,'message'=> 'Favicon deleted successfully.' , 'status'=> 200 ],200);
        }
    }


    public function admin_emailtemplates(Request $request):Response{
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
      
        $emails = Emailtemplate::orderBy('id','Desc')->get();
        $mails_array = array();
        foreach($emails as $key => $email){
            $mails_array[$key]['id'] = $email->id;
            $mails_array[$key]['slug'] = $email->static_email_heading;
            $mails_array[$key]['title'] = $email->title;
            $mails_array[$key]['static_email_heading'] = $email->static_email_heading;
            $mails_array[$key]['subject'] = $email->subject;
            $mails_array[$key]['variables'] = $email->variables;
            $mails_array[$key]['template'] = $email->template;
            $mails_array[$key]['subject_de'] = $email->subject_de;
            $mails_array[$key]['template_de'] = $email->template_de;
            $mails_array[$key]['subject_fra'] = $email->subject_fra;
            $mails_array[$key]['template_fra'] = $email->template_fra;

        }

        $data['email'] = $mails_array;

        return Response(['response'=>$data , 'message'=>'success' , 'status'=>200],200);

    }

    public function admin_editemailtemplates(Request $request, $slug = null):Response{


        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        $EmailtemplateArray=array();
        $EmailtemplateData = Emailtemplate::where('static_email_heading',$slug)->first();
        $EmailtemplateArray['id '] = $EmailtemplateData->id;
        $EmailtemplateArray['slug'] = $EmailtemplateData->static_email_heading;
        $EmailtemplateArray['static_email_heading'] = $EmailtemplateData->static_email_heading;
        $EmailtemplateArray['title'] = $EmailtemplateData->title;
        $EmailtemplateArray['subject'] = $EmailtemplateData->subject;
        $EmailtemplateArray['variables'] = explode(',',$EmailtemplateData->variables);
        $EmailtemplateArray['template'] = $EmailtemplateData->template;
        $EmailtemplateArray['subject_de'] = $EmailtemplateData->subject_de;
        $EmailtemplateArray['template_de'] = $EmailtemplateData->template_de;
        $EmailtemplateArray['subject_fra'] = $EmailtemplateData->subject_fra;
        $EmailtemplateArray['template_fra'] = $EmailtemplateData->template_fra;


            if(!empty($request->all())){
                
                $validator = Validator::make($request->all(), [
                    'title' => 'required',
                    'subject' => 'required',
                    'template' => 'required',
                    'subject_de' => 'required',
                    'template_de' => 'required',
                    'subject_fra' => 'required',
                    'template_fra' => 'required',
                ]);
                $msgString='';

                if ($validator->fails()) {
                    $msgString .= implode("<br> - ", $validator->errors()->all());
                    return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);

                }else {
                    Emailtemplate::where('static_email_heading',$slug)->update([
                        'title' => $request->title,
                        'subject' => $request->subject,
                        'template' => $request->template,
                        'subject_de' => $request->subject_de,
                        'template_de' => $request->template_de,
                        'subject_fra' => $request->subject_fra,
                        'template_fra' => $request->template_fra,
                    ]);

                    $msgString = 'Announcement updated successfully';

                    return Response(['response' => $EmailtemplateArray , 'message'=> $msgString , 'status'=> 200 ],200);
                }

            }else{


                return Response(['response'=>$EmailtemplateArray , 'message'=>'sucess','status'=>200],200);

            }

    }

    
    public function admin_testmail(Request $request, $slug = null):Response{


        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $EmailtemplateData = Emailtemplate::where('static_email_heading',$slug)->first();
        $contact_details  = Setting::first();

        $username = $contact_details->company_name;
        $email = $contact_details->email;
        $message = 'Mail send for testing purpose.';
        $subjectbyuser = 'Test Mail';
        $currentYear = date('Y', time());
        $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
        $admin_email = $contact_details->email;
        

        $emailTemplate = Emailtemplate::where('id',6)->first();


            $template_subject= $emailTemplate->subject;
            $template_body= $emailTemplate->template;

        $toSubArray = array('[!username!]', '[!email!]', '[!subjectuser!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');
        $fromSubArray = array($username, $email, $subjectbyuser, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $request->subject);

        $subjectToSend = str_replace($toSubArray, $fromSubArray, $template_subject);

        $toRepArray = array('[!username!]', '[!email!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');
        $fromRepArray = array($username, $email, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $request->subject);
        $messageToSend = str_replace($toRepArray, $fromRepArray, $template_body);
     
         try {
            Mail::to($admin_email)->send(new SendMailable($messageToSend, $subjectToSend));
        } catch(\Exception $e) { 
            $msgString=$e->getMessage();
        }

        return Response(['response'=>'sucess', 'message'=>'sucess','status'=>200],200);

    }

        

    public function getconstant(Request $request):Response {
       // $authenticateadmin = $this->adminauthentication();

       $data = array();

    //   $data['site_title'] = SITE_TITLE;
       $data['site_title'] = Site_setting::value('title');
       $data['link'] = HTTP_FAV;
       $data['site_link'] = Site_setting::value('url');
       $data['site_logo'] = LOGO_PATH;
       $data['site_favicon'] = DISPLAY_FULL_FAV_PATH.'favicon.ico';
       $data['site_email'] = MAIL_FROM;
       $data['curr'] = CURR;
       $data['currency'] = CURRENCY;
       $data['primary_color'] = PRIMARY_COLOR;
       $data['secondary_color'] = SECONDARY_COLOR;
       $data['captcha_public_key'] = CAPTCHA_PUBLIC_KEY;
       $data['map_key'] = MAP_KEY;
       $data['stripe_key'] = Admin::where('id', 1)->value('stripe_pk');
       


       $worktype = $GLOBALS['worktype'];
       $experienceArray = $GLOBALS['experienceArray'];
       $sallery = $GLOBALS['sallery'];
       $totalexperienceArray = $GLOBALS['totalexperienceArray'];
       $workArray = array();
       $i = 0;
       foreach ($worktype as $key => $val) {
           $workArray[$i]['id'] = $key;
           $workArray[$i]['val'] = $val;
           $i++;
       }

       $expArray = array();
       $i = 0;
       foreach ($experienceArray as $key => $val) {
           $expArray[$i]['id'] = $key;
           $expArray[$i]['val'] = $val;
           $i++;
       }
       
       $totalExpArray = array();
       $i = 0;
       foreach ($totalexperienceArray as $key => $val) {
           $totalExpArray[$i]['id'] = $key;
           $totalExpArray[$i]['val'] = $val;
           $i++;
       }
       
       
       $salleryArray = array();
       $i = 0;
       foreach ($sallery as $key => $val) {
           $salleryArray[$i]['id'] = $key;
           $salleryArray[$i]['val'] = $val;
           $i++;
       }
       $data['worktype'] = $workArray;
       $data['experience'] = $expArray;
       $data['salary'] = $salleryArray;
       $data['totalExpArray'] = $totalExpArray;
       $data['planFeatuersMax'] = $GLOBALS['planFeatuersMax'];
       $data['planFeatuers'] = $GLOBALS['planFeatuers'];
       $data['planFeatuersDis'] = $GLOBALS['planFeatuersDis'];



       
        return Response(['response'=>$data , 'message'=>'sucess','status'=>200],200);

        exit;

    }

    public function getMetaData(Request $request):Response{

        $metaData = Admin::where('id',1)
        ->select('meta_jobtitle',
        'meta_jobkeywords',
        'meta_jobdescription',
        'meta_catetitle',
        'meta_catekeywords',
        'meta_catedescription',
        'default_title',
        'default_keyword',
        'default_description')->first();

        
        $data['meta_jobtitle'] = $metaData->meta_jobtitle;
        $data['meta_jobkeywords'] = $metaData->meta_jobkeywords;
        $data['meta_jobdescription'] = $metaData->meta_jobdescription;

        $data['meta_catetitle'] = $metaData->meta_catetitle;
        $data['meta_catekeywords'] = $metaData->meta_catekeywords;
        $data['meta_catedescription'] = $metaData->meta_catedescription;

        $data['default_title'] = $metaData->default_title;
        $data['default_keyword'] = $metaData->default_keyword;
        $data['default_description'] = $metaData->default_description;

        return Response(['response'=>$data , 'message'=>'sucess','status'=>200],200);


    }
    
    public function getadminroles(Request $request){
        $authenticateadmin = $this->adminauthentication();
        $id = $authenticateadmin['id'];
        
        $admin = Admin::where('id',$id)->select('role_ids')->first();
        
        $data['access'] = isset($admin->role_ids) ? unserialize($admin->role_ids) : '';
        
        return response()->json(['message' => 'roleData' , 'response' => $data ,'status' => 200 ],200);
    }

}
