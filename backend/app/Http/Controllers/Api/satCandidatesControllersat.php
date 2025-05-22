<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Exports\ExportUsers;
use App\Imports\ImportUsers;
use Maatwebsite\Excel\Facades\Excel;

use App\Models\User;
use App\Models\Favorite;
use App\Models\Certificate;
use App\Models\Job_apply;
use App\Models\Short_list;
use App\Models\Education;
Use App\Models\Experience;
use App\Models\Professional;
use App\Models\Course;
use App\Models\Skill;
use App\Models\Job;
use App\Models\Profile_view;
use App\Models\User_plan;
//use App\Models\Mail;
use App\Models\Category;
use App\Models\Cover_letter;
use App\Models\MailHistory;
use App\Models\Admin;
use App\Models\Plan;
use App\Models\Location;
use App\Models\Setting;
use App\Models\Emailtemplate;
use App\Models\Specialization;
use App\Models\Designation;
use App\Models\Alert;
use App\Models\Payment;

use DateTime;
use Mail;
use App\Mail\SendMailable;
use Dompdf\Dompdf;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\SimpleType\Jc;

class CandidatesController extends Controller
{

    public function listing(Request $request):Response {


        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        $data = array();
        $totalexperienceArray = $GLOBALS['totalexperienceArray'];
        $experienceArray = $GLOBALS['experienceArray'];
        $sallery = $GLOBALS['sallery'];


        $expArray = array();
        $i = 0;
        foreach ($experienceArray as $key => $val) {
            $expArray[$i]['id'] = $key;
            $expArray[$i]['val'] = $val;
            $i++;
        }
        
        
        $salleryArray = array();
        $i = 0;
        foreach ($sallery as $key => $val) {
            $salleryArray[$i]['id'] = $key;
            $salleryArray[$i]['val'] = $val;
            $i++;
        }

        $skillList = Skill::where('type', 'Skill')
        ->where('status', 1)
        ->select('name', 'id')
        ->get();

        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();


        if(!empty($request->all())){
            $keyword = $request->keyword;
            $location = $request->location;
            $total_exp = $request->total_exp;
            $exp_salary = $request->exp_salary;
            $skills = $request->skill;
            $basic_course_id = $request->basic_course_id;
            $basic_specialization_id = $request->basic_specialization_id;

            // echo '<br>keyword ';print_r($keyword);
            // echo '<br>location ';print_r($location);
            // echo '<br>skills ';print_r($skills);
            // echo '<br>total_exp ';print_r($total_exp);

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
            if(isset($request->total_exp) && ($request->total_exp != '')){

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

            if (!empty($skills) && ($skills != '') && (count($skills) > 1)){
              //  $skills = explode(',',$request->skill);
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
        
            // $jobseekers = User::where('users.status', '1')->where($condition)
            //     ->orderByRaw($order)
            //     ->limit(90)->get();

        //   echo'<pre>';
        //    print_r($query);
        //    exit;

                $jobseekers= $query->orderByRaw($order)->limit(90)->get();

        }else{
            $jobseekers = User::where('user_type','candidate')->where('status',1)->orderBy('id','desc')->limit(90)->get();

        }

        //   echo'<pre>';
        //    print_r($jobseekers);
        //    exit;
        $data['candidates']=array();
        if(!empty($jobseekers)){

        foreach($jobseekers as $key => $userdetails){

            $getviewrecord = Profile_view::where('candidate_id',$userdetails->id)
            ->where('emp_id',$userId)->count();
                
                //$getviewrecord=1;
            if($getviewrecord > 0){
            $data['candidates'][$key]['contact'] = $userdetails->contact;

            }else{
                $data['candidates'][$key]['contact'] = '+xxxxxxxxxx';

            }
            $data['candidates'][$key]['id'] = $userdetails->id;
            $data['candidates'][$key]['slug'] = $userdetails->slug;
            $data['candidates'][$key]['first_name'] = $userdetails->first_name;
            $data['candidates'][$key]['last_name'] = $userdetails->last_name;
            $data['candidates'][$key]['gender'] = $userdetails->gender;
            $data['candidates'][$key]['location'] = $userdetails->location;
            $data['candidates'][$key]['pre_location'] = $userdetails->pre_location;
            $data['candidates'][$key]['exp_salary'] = $userdetails->exp_salary;
            $data['candidates'][$key]['total_exp'] = $userdetails->total_exp;
            
            $data['candidates'][$key]['profile_image'] = '';
            if($userdetails->profile_image != '' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$userdetails->profile_image))
                $data['candidates'][$key]['profile_image'] =  DISPLAY_FULL_PROFILE_IMAGE_PATH.$userdetails->profile_image;

                $total_exp = '';
                if ($userdetails->total_exp) {

                    $total_exp = $totalexperienceArray[$userdetails->total_exp];
                }
                $data['candidates'][$key]['total_exp'] = $total_exp;

            if($userdetails->dob == '' || $userdetails->dob == '0000-00-00'){
                $data['candidates'][$key]['dob'] = $userdetails->dob;
            }else{
                $data['candidates'][$key]['dob'] = '';
            }

            if($userdetails->email_notification_id != ''){
                $data['candidates'][$key]['email_notification_id'] = explode(',',$userdetails->email_notification_id );
            }else{
                $data['candidates'][$key]['email_notification_id'] = '';
            }

            if($userdetails->skills){
                $data['candidates'][$key]['skills'] = explode(',',$userdetails->skills);
            }else{
                $data['candidates'][$key]['skills'] ='';
            }

            if($userdetails->interest_categories){
                $data['candidates'][$key]['interest_categories'] = explode(',',$userdetails->interest_categories);
            }else{
                $data['candidates'][$key]['interest_categories'] ='';
            }
            $data['candidates'][$key]['created'] = date('M d, Y',strtotime($userdetails->created));
            $data['candidates'][$key]['status'] = $userdetails->status;
        }
    }

        //$data['adminDetails'] = $Blogsarray;
        $data['experience'] = $expArray;
        $data['salary'] = $salleryArray;
        $data['skills'] = $skillList;
        $data['locationlList'] = $locationlList;

        return Response(['response' => $data ,'message' => 'success' ,'status' => 200 ],200);
    }


    public function favorite():Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        // $Favorite = Favorite::with('user','candidate')
        // ->where('user_id',$userId)
        // ->orderBy('id','desc')
        // ->get();
        
        $Favorite = Favorite::join('users','users.id','=','favorites.candidate_id')
        ->where('user_id',$userId)
        ->orderBy('favorites.id','desc')
        ->select('favorites.id','users.first_name','users.last_name','users.email_address','users.slug')
        ->get();

        $data['Favorite'] = $Favorite;

        return Response(['response'=> $data , 'message'=>'success' , 'status'=> 200 ],200);
    }

    public function deleteFavorite($id = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        if ($id != '') {
            Favorite::whereId($id)->delete();

            $msgString = 'Favorite Jobseeker deleted successfully.';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' =>200 ],200);

        }
        $msgString = 'Id is blank';
        return Response(['response'=>$msgString, 'message'=>$msgString, 'status' => 500 ],200);
    }


    public function addtoFavorite($jobseekerid = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        if ($jobseekerid != '') {

            Favorite::insert([
                'user_id'=>$userId,
                'candidate_id'=>$jobseekerid,
                'modified'=>date('Y-m-d H:i:s'),
                'created'=>date('Y-m-d H:i:s'),
            ]);

            $msgString = 'Add to favorite successfully.';

            return Response(['response' => $msgString , 'message' => $msgString , 'status' =>200 ],200);

        }
        $msgString = 'Id is blank';
        return Response(['response'=>$msgString, 'message'=>$msgString, 'status' => 500 ],200);
    }

    public function profile($slug = null):Response
    {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        
        $userDetails = User::select('id','first_name','last_name','email_address','contact','location','company_about','slug','total_exp','profile_image','skills','interest_categories')
            //->with('education', 'experience')
            ->where('slug', $slug)
            ->first();


            $data['userdetails'] = $userDetails;
            if($userDetails->profile_image != '' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$userDetails->profile_image)){
                $data['userdetails']['profile_image'] =  DISPLAY_FULL_PROFILE_IMAGE_PATH.$userDetails->profile_image;

            }else{
                $data['userdetails']['profile_image'] = '';

            }
            $getviewrecord = Profile_view::where('candidate_id',$userDetails->id)
            ->where('emp_id',$userId)->count();
                
                //$getviewrecord=1;
            if($getviewrecord > 0){
                $data['userdetails']['contact'] = $userDetails->contact;
                $data['userdetails']['email_address'] = $userDetails->email_address;


            }else{
                $data['userdetails']['contact'] = '+xxxxxxxxxx';
                $data['userdetails']['email_address'] = 'xxxxxx@xxxx.xxx';

            }
               
               
                $totalexperienceArray = $GLOBALS['totalexperienceArray'] ;
                $total_exp = '';
                if ($userDetails->total_exp) {

                    $total_exp = $totalexperienceArray[$userDetails->total_exp];
                }
                $data['userdetails']['total_exp'] = $total_exp;


            if($userDetails->skills){
                $data['userdetails']['skills'] = explode(',',$userDetails->skills);
            }else{
                $data['userdetails']['skills'] ='';
            }
        
        $interest_categories = $userDetails->interest_categories;
        if ($interest_categories) {
            $categoryIds = explode(',', $interest_categories);
            $categories = Category::whereIn('id', $categoryIds)
                ->orderBy('name', 'asc')
                ->pluck('name')
                ->toArray();
            $interestCategories = implode(', ', $categories);
        } else {
            $interestCategories = '';
        }
        
        // $showOldImages = Certificate::where('user_id', $userDetails->id)
        //     ->where('type', 'image')
        //     ->get();
        
        // $showOldDocs = Certificate::where('user_id', $userDetails->id)
        //     ->where('type', 'doc')
        //     ->get();


            $cvImages = [];
            $showOldImages = Certificate::where('user_id', $userDetails->id)
            ->where('type', 'image')
            ->get();
            foreach ($showOldImages as $showOldImage) {
                $image = $showOldImage->document;
                $id = $showOldImage->id;
                
                if (!empty($image) && file_exists(UPLOAD_CERTIFICATE_PATH . $image)) {
                    $cvImages[] = ['id' => $id,'slug' => $showOldImage->slug, 'document' => DISPLAY_CERTIFICATE_PATH.$image, 'type' => $showOldImage->type];
                }
            }
    
            $data['showOldImages'] = $cvImages;

            $cvImages2 = [];
            $showOldDocs = Certificate::where('user_id', $userDetails->id)
            ->where('type', 'doc')
            ->get();
            foreach ($showOldDocs as $showOldImage) {
                $image = $showOldImage->document;
                $id = $showOldImage->id;
                
                if (!empty($image) && file_exists(UPLOAD_CERTIFICATE_PATH . $image)) {
                    $cvImages2[] = ['id' => $id,'slug' => $showOldImage->slug, 'document' => DISPLAY_CERTIFICATE_PATH.$image, 'type' => $showOldImage->type];
                }
            }
    
            $data['showOldDocs'] = $cvImages2;


        $fav_status = Favorite::where('user_id',$userId)
        ->where('candidate_id',$userDetails->id)
        ->count();


        $data['fav_status'] = $fav_status;
        $data['interestCategories'] = $interestCategories;
       // $data['showOldImages'] = $showOldImages;
       // $data['showOldDocs'] = $showOldDocs;

        $education = Education::join('courses','educations.basic_course_id' , '=','courses.id' )
        ->where('user_id',$userDetails->id)
        ->select('courses.name as course_name',
                'educations.basic_course_id',
                'educations.basic_university',
                'educations.basic_year'
        )->get();

        $data['userdetails']['education'] = $education;
        
        $experience = Experience::where('user_id',$userDetails->id)
        ->select( 'company_name',
            'industry',
            'functional_area',
            'role',
            'designation',
            'from_month',
            'from_year',
            'to_month',
            'to_year'
        )->get();

        $months = $GLOBALS['monthName'];

        $expe = array();
        foreach($experience as $key => $exp){
            $expe[$key]['company_name'] = $exp->company_name;
            $expe[$key]['industry'] = $exp->industry;
            $expe[$key]['functional_area'] = $exp->functional_area;
            $expe[$key]['role'] = $exp->role;
            $expe[$key]['designation'] = $exp->designation;
            $expe[$key]['from_year'] = $months[$exp->from_month].'-'.$exp->from_year;
            $expe[$key]['to_year'] = $months[$exp->to_month].'-'.$exp->to_year;
        }
        

        $data['userdetails']['experience'] = $expe;

        
        return Response(['response'=> $data , 'message' => 'success' , 'status' => 200],200);
    }

    public function makecv():Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $userdetail = User::where('id',$userId)
        ->select('first_name',
            'last_name',
            'email_address',
            'profile_image',
            'location',
            'address',
            'id'
        )->first();

        $user_array =  array(); 

        // foreach($userdetail as $key => $user){
            $user_array['first_name'] = $userdetail->first_name;
            $user_array['last_name'] = $userdetail->last_name;
            $user_array['email_address'] = $userdetail->email_address;
            if($userdetail->profile_image != '')
                $user_array['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userdetail->profile_image;
            else
                $user_array['profile_image'] = '';
                
            $user_array['location'] = $userdetail->location;
            $user_array['address'] = $userdetail->address;
            $user_array['id'] = $userdetail->id;
        // }

        $data['userdetail'] = $user_array;

        $education = Education::join('courses','educations.basic_course_id' , '=','courses.id' )
        ->where('user_id',$userdetail->id)
        ->select('courses.name as course_name',
                'educations.basic_course_id',
                'educations.basic_university',
                'educations.basic_year'
        )->get();

        $data['education'] = $education;
        
        $experience = Experience::where('user_id',$userdetail->id)
        ->select( 'company_name',
            'industry',
            'functional_area',
            'role',
            'designation',
            'from_month',
            'from_year',
            'to_month',
            'to_year'
        )->get();

        $months = $GLOBALS['monthName'];

        $expe = array();
        foreach($experience as $key => $exp){
            $expe[$key]['company_name'] = $exp->company_name;
            $expe[$key]['industry'] = $exp->industry;
            $expe[$key]['functional_area'] = $exp->functional_area;
            $expe[$key]['role'] = $exp->role;
            $expe[$key]['designation'] = $exp->designation;
            $expe[$key]['from_year'] = $months[$exp->from_month].'-'.$exp->from_year;
            $expe[$key]['to_year'] = $months[$exp->to_month].'-'.$exp->to_year;
        }
        

        $data['experience'] = $expe;

        return Response(['response' => $data , 'message' => 'success','status' => 200],200);
    }

    public function editProfessional(Request $request,$status = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $userDetails = User::where('id',$userId);

        if(!empty($request->all())){

            $input = $request->all();

            foreach($input['Professional'] as $experience){
                if(empty($experience["registration"])){
                    $msgString = 'Professional Registration is required field.';

                    return Response(['response'=>'' , 'message'=>$msgString , 'status' => 200],200);
                }
            }

            foreach($input['Professional'] as $experience){

                if(isset($experience['id'])){
                    $professional = Professional::find($experience['id']);
                }else{
                    $professional = new Professional;
                    $professional->slug = 'pro-'.$userId.'-'.time();
                    $professional->created = now();
                }

                $professional->user_id = $userId;
                $professional->registration = $experience["registration"];
                $professional->status = 1;
                

                // if($experience['id']!=''){
                //     $professional = $professional->where('id',$experience['id']);
                // }
                
                $professional->save();

            }

            return Response(['responce'=>'Professional Registration updated successfully.' ,'message'=>'Professional Registration updated successfully.','status'=>200],200);

        }else{

             $proDetails = Professional::where('user_id',$userId)
             ->select('registration','status','id')
             ->get();

             $data=$proDetails;
             $msgString = 'success';
             $status = 200;

             return Response(['response' => $data , 'message'=>$msgString , 'status' => $status ],200);
        }

    }

    public function deleteprofessional($id = NULL): Response{

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $status = 500;
        $msgString = 'error';
        $response = 'error';

        if($id!=''){
            Professional::where('id',$id)->delete();

            $status = 200;
            $msgString = 'success';
            $response = 'success';
        }

        return Response(['response'=>$response , 'message'=>$msgString , 'status'=>$status],200);
       
    }

    public function myaccount():Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $userdetail = User::where('id',$userId)->first();

        // $data['userdetail'] = $userdetail;

        $userData = array();


        // foreach($userdetail as $key => $user){
            $path = UPLOAD_FULL_PROFILE_IMAGE_PATH . $userdetail->profile_image;
            if (file_exists($path) && !empty($userdetail->profile_image)) {
                $userData['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userdetail->profile_image;
            }else{
                $userData['profile_image'] = '';
            }
            $userData['first_name'] = $userdetail->first_name;
            $userData['last_name'] = $userdetail->last_name;
            $userData['contact'] = $userdetail->contact;
            $userData['email_address'] = $userdetail->email_address;
            $userData['location'] = $userdetail->location;
            $userData['skill'] = explode(',',$userdetail->skills);
            $userData['company_about'] = $userdetail->company_about;
            $userData['gender'] = $userdetail->gender;
            $userData['pre_location'] = $userdetail->pre_location;
            $userData['exp_salary'] = CURRENCY.$userdetail->exp_salary;
            $userData['total_exp'] = $userdetail->total_exp;
        // }

        $data['userdetail'] = $userData;

        $myPlan =  (new Plan)->getcurrentplan($userId);
        if(!empty($myPlan)){
            $Plan = Plan::where('id',$myPlan->plan_id)->first();
            $data['plan_name'] = $Plan->plan_name;
            $data['is_plan_active']=1;
            $getRemainingFeatures = (new Plan)->getPlanFeature($userId);
            $data['getRemainingFeatures'] = $getRemainingFeatures;

        }else{
            $data['plan_name']='';
            $data['is_plan_active']=0;

        }
        $showOldImages = Certificate::where('user_id',$userId)
        ->where('type' ,'image')
        ->get();

        $imgi=0;
        $img_array = array();

        foreach ($showOldImages as $showOldImage) {
            $image = $showOldImage->document;
            if (!empty($image) && file_exists(UPLOAD_CERTIFICATE_PATH . $image)) {
                $img_array[$imgi]['image'] = DISPLAY_CERTIFICATE_PATH . $image;
                $img_array[$imgi]['slug'] = $showOldImage->slug;

                $imgi++;
            }
        }

        $data['showOldImages'] = $img_array;

        $showOldDocs = Certificate::where('user_id',$userId)
        ->where('type' ,'doc')
        ->get();

        $doci = 0;
        $doc_array = array();
        foreach($showOldDocs as $showOldDoc){
            $doc = $showOldDoc->document;
            if (!empty($doc) && file_exists(UPLOAD_CERTIFICATE_PATH . $doc)) {
                $doc_array[$doci]['doc_sub']= substr($doc,6);
                $doc_array[$doci]['doc']= $doc;
                $doc_array[$doci]['path'] = DISPLAY_CERTIFICATE_PATH;
                $doc_array[$doci]['slug'] = $showOldDoc->slug;
                $doci = $doci++;
            }
        }

        $data['showOldDocs']= $doc_array;

        $coverLetters = Cover_letter::where('user_id', $userId)
        ->orderBy('id', 'desc')
        ->pluck('title', 'id');

        if ($coverLetters->count() > 0) {
            $data['coverLetters'] = $coverLetters->implode(',');
        } else {
            $data['coverLetters'] = '';
        }

        $interest_categories = $userdetail->interest_categories;

        $education = Education::join('courses','educations.basic_course_id' , '=','courses.id' )
        ->where('user_id',$userdetail->id)
        ->select('courses.name as course_name',
                'educations.basic_course_id',
                'educations.basic_university',
                'educations.basic_year'
        )->get();

        $data['education'] = $education;


        $experience = Experience::where('user_id',$userdetail->id)
        ->select( 'company_name',
            'industry',
            'functional_area',
            'role',
            'designation',
            'from_month',
            'from_year',
            'to_month',
            'to_year'
        )->get();


        $months = $GLOBALS['monthName'];


        $expe = array();
        foreach($experience as $key => $exp){
            $expe[$key]['company_name'] = $exp->company_name;
            $expe[$key]['industry'] = $exp->industry;
            $expe[$key]['functional_area'] = $exp->functional_area;
            $expe[$key]['role'] = $exp->role;
            $expe[$key]['designation'] = $exp->designation;
            $expe[$key]['from_year'] = $months[$exp->from_month].'-'.$exp->from_year;
            $expe[$key]['to_year'] = $months[$exp->to_month].'-'.$exp->to_year;
        }

        $data['experience'] = $expe;
        
        $interestCategories = $userdetail->interest_categories;

        if ($interestCategories) {
            $condition = "tbl_categories.id IN ($interestCategories)";
            $categories = Category::whereRaw($condition)
                ->orderBy('name', 'asc')
                ->pluck('name');

            if ($categories->count() > 0 ) {
                $data['interestCategories'] = $categories->implode(',');
            } else {
                $data['interestCategories'] = '';
            }
        } else {
            $data['interestCategories'] = '';
        }

        $cplan = (new Plan)->getcurrentplan($userdetail->id);
        
        if($cplan){
            $plan = Plan::where('id',$cplan->plan_id)->first();
            $data['plan_name'] = $plan->plan_name;
        }else{
            $data['plan_name']='';
        }
        
        return Response(['response'=> $data , 'message'=>'success' , 'status' => 200 ],200);

    }

    public function editEducation(Request $request, $status = null) {


        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        $msgString = '';

        $userDetails = User::where('id',$userId)->first();

        $user_type = $userDetails->user_type;

        $basicCourseList = Course::where('type','Basic')
        ->where('status',1)
        ->orderBy('name','Asc')
        ->get();

        $data['basicCourseList'] = $basicCourseList;

        $specilyList = '';
        $data['specilyList1'] = $specilyList;


        if(!empty($request->all())){
            foreach ($request->Education as $education) {

                if (empty($education["basic_course_id"])) {
                    $msgString .= "- Course name is required field.<br>";
                }
                // if (empty($education["basic_specialization_id"])) {
                //$msgString .= "- Select specialization is required field.<br>";
                // }
                if (empty($education["basic_university"])) {
                    $msgString .= "- University name is required field.<br>";
                }
                if (empty($education["basic_year"])) {
                    $msgString .= "- Graduation year is required field.<br>";
                }
            }

            if(isset($msgString) && $msgString != ''){
                return Response(['response' => '' , 'message'=> $msgString , 'status' => 500],200);
            }else{
                if($request->Education){
                    foreach($request->Education as $education){

                        if(isset($education['id']))
                            $edu = Education::find($education['id']);
                        else
                            $edu  = new Education;

                        $edu->user_id = $userId;
                        $edu->user_type = $user_type;
                        $edu->education_type = 'Basic';
                        $edu->basic_course_id = $education['basic_course_id'];

                        if (!empty($education['basic_specialization_id'])) {
                            $edu->basic_specialization_id = $education['basic_specialization_id'];
                        } else {
                            $edu->basic_specialization_id = '0';
                        }

                        $edu->basic_university = $education['basic_university'];
                        $edu->basic_year = $education['basic_year'];

                        if(!empty($education['basic_course_id']) || !empty($education['basic_university']) || !empty($education['basic_year'])){
                            $edu->save();
                        }
                    }
                    
                    return Response(['responce'=>'', 'message'=>'success','status'=>200],200);
                }
            }
        }else{
            $eduDetails = Education::where('user_id',$userId)->get();

            $data['eduDetails'] = $eduDetails;
            $data['user_type'] = $user_type;

            return Response(['response' => $data , 'message' => 'success' ,'status' => 200 ],200);
        }
    }
    
    public function companyprofile($slug):Response {

        $userDetails = User::where('slug',$slug)
        ->select('id','company_name','verify','company_about','company_contact','postal_code','address',DB::raw('CONCAT("'.DISPLAY_FULL_PROFILE_IMAGE_PATH.'",profile_image) as profile_image'),'slug')
        ->first();

        $data['userDetails'] = $userDetails;

        $jobsof = Job::where('jobs.status',1)
        ->join('categories','categories.id','=','jobs.category_id')
        ->where('user_id',$userDetails->id)
        ->where('expire_time', '>=' ,time())
        ->where('category_id','<>',0)
        ->select(
        'jobs.id',
        'jobs.type',
        'jobs.title',
        'categories.slug as cslug',
        'jobs.slug as jslug',
        'jobs.company_name',
        'jobs.max_exp',
        'jobs.min_exp',
        'jobs.job_city',
        'jobs.description',
        'jobs.min_salary',
        'jobs.max_salary',
        'jobs.work_type',
        'jobs.created',
        'jobs.designation',
        'jobs.skill'
        )
        ->get();

        $tokenData = $this->requestAuthentication('POST', 2);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';
        
        $job_details = array();

        $work = $GLOBALS['worktype'];

        foreach($jobsof as $key => $job){

            $job_details[$key]['id'] = $job->id;
            $job_details[$key]['type'] = $job->type;
            $job_details[$key]['title'] = $job->title;
            $job_details[$key]['cslug'] = $job->cslug;
            $job_details[$key]['jslug'] = $job->jslug;
            $job_details[$key]['company_name'] = $job->company_name;
            $job_details[$key]['max_exp'] = $job->max_exp;
            $job_details[$key]['min_exp'] = $job->min_exp;
            $job_details[$key]['job_city'] = $job->job_city;
            $job_details[$key]['description'] = $job->description;
            $job_details[$key]['min_salary'] = $job->min_salary;
            $job_details[$key]['max_salary'] = $job->max_salary;
            $job_details[$key]['work_type'] = $work[$job->work_type];
            $job_details[$key]['created'] = date('F j, Y', strtotime($job->created));

            if($userId != ''){
                $short_status = Short_list::where('user_id', $userId)
                ->where('job_id',$job->id)
                ->first();
                if(!empty($short_status))
                    $job_details[$key]['ShortList'] = true;
                else
                    $job_details[$key]['ShortList'] = false;
            }else{
                $job_details[$key]['ShortList'] = false;
            }

            $designation = Skill::where('type','Designation')
            ->where('id',$job->designation)
            ->select('name')
            ->first();

            if (!empty($designation)) {
                $job_details[$key]['Designation'] = $designation->name;
            } else {
                $job_details[$key]['Designation'] = 'N/A';
            }

            $jobId = explode(',', $job->skill);

            $i = 1;
            
            foreach ($jobId as $id) {

                $Skill = Skill::where('id',$id)
                ->select('name')
                ->get();

                if (!empty($skill)) {
                    if ($i == 1) {
                        $job_details[$key]['skill'] = $skill->name;
                    } else {
                        $job_details[$key]['skill'].= " , " . $skill->name;
                    }
                    $i = $i + 1;
                } else {
                    $job_details[$key]['skill'] = "N/A";
                }
            }
        }

        $data['jobDetails'] = $job_details;

        return Response(['response'=>$data , 'message'=>'success' , 'status'=>200],200);
    }

    public function getUserdetail($uslug = null) {

        if (!empty($uslug)) {
            $user = array();
            $user['status']='0';

            $tokenData = $this->requestAuthentication('POST', 1);
            $euserId = $tokenData['user_id'];
             
            $userCheck = User::where('slug',$uslug)
            ->first();

            $getviewrecord = Profile_view::where('candidate_id',$userCheck->id)
            ->where('emp_id',$euserId)->count();
                
                //$getviewrecord=1;
            if($getviewrecord > 0){
                $user['email']=$userCheck->email_address;
                $user['contact']=$userCheck->contact ? $userCheck->contact : 'N/A';
                $user['status']='1';
            }else{
                
                $date = date('Y-m-d');

                $userPlan = User_plan::where('user_id',$euserId)
                ->orderBy('invoice_no','DESC')
                ->first();

                $features = $userPlan->features_ids;
                $featuresArray = explode(',', $features);
                $user['UserPlan_id']=$userPlan->id;
                         
                 if(in_array(5, $featuresArray)){
    
                    $fvalues = json_decode($userPlan->fvalues, true);
                    $maxviews = $fvalues[5];
                    
                    if($maxviews > 0){
                        
                        $pdate=$userPlan->created;

                        $totalviews = Profile_view::where('status',1)
                        ->where('emp_id',$euserId)
                        ->count();
                        
                        if($maxviews > $totalviews){

                            $user['totalviews'] = $totalviews;
                            $user['$pdate'] = $pdate;
                            $user['maxviews'] = $maxviews;
                            $user['email'] = $userCheck->email_address;
                            $user['contact'] = $userCheck->contact ? $userCheck->contact : 'N/A';
                            $user['status'] = '1';

                            Profile_view::insert([
                                'status' => 1,
                                'emp_id' => $euserId,
                                'candidate_id' => $userCheck->id,
                                'created' => now(),
                                'modified' => now(),
                            ]);
                        }
        
                    }
                }else{
                    return Response(['response' => '' , 'message' => 'You do not have the membership plan active to view the jobseeker contact details. Please purchase that respective membership plan ' , 'status'=>500 ],200);

                }
            }

            return Response(['response' => $user , 'message' => 'success' , 'status'=>200 ],200);
            
        }

        return Response(['response' => '' , 'message' => 'slug missing' , 'status'=>500 ],200);
    }
    
    public function sendmailjobseeker(Request $request,$slug = null) {
        $msgString = '';

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';
        

        $recruiterInfo = User::where('id',$userId)->first();
        $recruiter_email = $recruiterInfo->email_address;
        $recruiter_company = $recruiterInfo->company_name;

        if(!empty($request->all())){

            $rules = ([
                'id' => 'required',
                'subject' => 'required',
                'message' => 'required',
            ]);

            $validator = Validator::make($request->all(),$rules);

            if($validator->fails()){
                $msgString = $this->validatersErrorString($validator->errors());
            }else{

                $userInfo = User::where('id',$request->id)
                ->select('id','first_name','email_address')
                ->first();

                $imageArray = array();

                if($userInfo){

                    if(!empty($request->emailFiles)){
                        $selectedFileName = $request->selectedFileName;
                        foreach($request->emailFiles as $key => $files){
                            $file = explode(';base64',$files);
                            $fileName = $selectedFileName[$key];
                            $originalName = '';

                            if(strstr($file[0],'image')){
                                $image_type_pieces = explode('image/',$file[0]);
                                $image_type = $image_type_pieces[1];
                                $originalName = Str::random(4).'-'.$fileName;
                                $extention = $image_type;
                                $imageArray[] = $originalName;

                                $decoded_string = base64_decode($file[1]);

                                file_put_contents(UPLOAD_MAIL_PATH.$originalName, $decoded_string);

                            }else
                            if(strstr($file[0],'application/msword')){
                                //.doc
                                $originalName = Str::random(4).'-'.$fileName;
                                $extention = 'doc';
                                $imageArray[] = $originalName;

                                $decoded_string = base64_decode($file[1]);

                                file_put_contents(UPLOAD_MAIL_PATH.$originalName, $decoded_string);
                            }
                            else
                            if(strstr($file[0],'application/vnd')){
                                //.docx
                                $originalName = Str::random(4).'-'.$fileName;
                                $extention = 'docx';
                                $imageArray[] = $originalName;

                                $decoded_string = base64_decode($file[1]);

                                file_put_contents(UPLOAD_MAIL_PATH.$originalName, $decoded_string);
                            }else
                            if(strstr($file[0],'application/pdf')){
                                //.pdf
                                $originalName = Str::random(4).'-'.$fileName;
                                $extention = 'pdf';
                                $imageArray[] = $originalName;

                                $decoded_string = base64_decode($file[1]);

                                file_put_contents(UPLOAD_MAIL_PATH.$originalName, $decoded_string);
                            }

                        }
                    }

                    $image = implode(',',$imageArray);

                    $Mail = new MailHistory;
                    $Mail->to_id = $userInfo->id;
                    $Mail->from_id = $userId;
                    $Mail->slug = $this->createSlug($request->subject, 'mails', 'slug');
                    $Mail->subject = $request->subject;
                    $Mail->message = $request->message;
                    $Mail->files = $image;
                    $Mail->status = '1';
                    $Mail->job_apply = 0;
                    $Mail->is_read = 0;
                    $Mail->created = now();
                    if($Mail->save()){
                        $mailId = $Mail->id;
                        $mailDetail = MailHistory::where('id',$mailId)
                        ->first();
                        $files = explode(',', $mailDetail->files);
                        $mailFileArray = array();

                        foreach($files as $file){
                            $mailFileArray[] = UPLOAD_MAIL_PATH . $file;
                        }

                        $userName = ucfirst($userInfo->first_name);
                        $email = ucfirst($userInfo->email_address);


                        $emailTemplate = Emailtemplate::where('id',45)->first();

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


                        $toSubArray = array('[!username!]', '[!MESSAGE!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');

                        $fromSubArray = array($userName, $message, $currentYear, HTTP_PATH, SITE_TITLE , $sitelink, SITE_URL , $subject);

                        $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                        $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                        // $mailFileArray

                        return Response(['Response' => '' , 'message' => 'You have sent the email to the candidate successfully.' , 'status' => 200 ]);


                    }
                }
            }

        }
    }
    
    public function sendmailemployer(Request $request ,$slug = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        $msgString = '';

        $userInfo = User::where('id',$userId)->first();
        $user_email = $userInfo->email_address;

        if(!empty($request->all())){
            if($request->id == ''){
                $msgString .= "- User Name is required field.<br>";
            }
            if($request->subject == ''){
                $msgString .= "- Subject is required field.<br>";
            }
            if($request->message == ''){
                $msgString .= "- Message is required field.<br>";
            }

            if(isset($msgString) && $msgString != ''){
                return Response(['response' => '' , 'message' => $msgString , 'status' => 500]);
            }else{

                $recruiterInfo = User::where('id',$userId)->first();
                $recruiter_email = $recruiterInfo->email_address;
                $recruiter_company = $recruiterInfo->company_name;

                $imageArray = array();

                if($recruiterInfo){
                    if(!empty($request->emailFiles)){
                         $selectedFileName = $request->selectedFileName;
                        foreach($request->emailFiles as $key => $files){
                            $file = explode(';base64',$files);
                            $fileName = $selectedFileName[$key];
                            $originalName = '';

                            if(strstr($file[0],'image')){
                                $image_type_pieces = explode('image/',$file[0]);
                                $image_type = $image_type_pieces[1];
                                $originalName = Str::random(4).'-'.$fileName;
                                $extention = $image_type;
                                $imageArray[] = $originalName;

                                $decoded_string = base64_decode($file[1]);

                                file_put_contents(UPLOAD_MAIL_PATH.$originalName, $decoded_string);

                            }else
                            if(strstr($file[0],'application/msword')){
                                //.doc
                                $originalName = Str::random(4).'-'.$fileName;
                                $extention = 'doc';
                                $imageArray[] = $originalName;

                                $decoded_string = base64_decode($file[1]);

                                file_put_contents(UPLOAD_MAIL_PATH.$originalName, $decoded_string);
                            }
                            else
                            if(strstr($file[0],'application/vnd')){
                                //.docx
                                $originalName = Str::random(4).'-'.$fileName;
                                $extention = 'docx';
                                $imageArray[] = $originalName;

                                $decoded_string = base64_decode($file[1]);

                                file_put_contents(UPLOAD_MAIL_PATH.$originalName, $decoded_string);
                            }else
                            if(strstr($file[0],'application/pdf')){
                                //.pdf
                                $originalName = Str::random(4).'-'.$fileName;
                                $extention = 'pdf';
                                $imageArray[] = $originalName;

                                $decoded_string = base64_decode($file[1]);

                                file_put_contents(UPLOAD_MAIL_PATH.$originalName, $decoded_string);
                            }

                        }
                    }

                    $image = implode(',',$imageArray);

                    $Mail = new MailHistory;
                    $Mail->to_id = $recruiterInfo->id;
                    $Mail->from_id = $userId;
                    $Mail->slug = $this->createSlug($request->subject, 'mails', 'slug');
                    $Mail->subject = $request->subject;
                    $Mail->message = $request->message;
                    $Mail->files = $image;
                    $Mail->status = '1';
                    $Mail->job_apply = 0;
                    $Mail->is_read = 0;
                    $Mail->created = now();
                    if($Mail->save()){
                        $mailId = $Mail->id;
                        $mailDetail = MailHistory::where('id',$mailId)
                        ->first();
                        $files = explode(',', $mailDetail->files);
                        $mailFileArray = array();


                        foreach($files as $file){
                            $mailFileArray[] = UPLOAD_MAIL_PATH . $file;
                        }

                        $userName = ucfirst($recruiterInfo->first_name);
                        $email = ucfirst($recruiterInfo->email_address);


                        $emailTemplate = Emailtemplate::where('id',51)->first();

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


                        $toSubArray = array('[!username!]', '[!MESSAGE!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');

                        $fromSubArray = array($userName, $message, $currentYear, HTTP_PATH, SITE_TITLE , $sitelink, SITE_URL, $subject);

                        $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                        $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                        return Response(['response' =>'' , 'message' => 'You have sent the email to the employer successfully.' , 'status'=>200 ]);

                    }

                }

            }
        }
    }

    public function editExperience(Request $request, $status = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        
        

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';
        

        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        $msgString = '';

        $userDetails = User::where('id',$userId)->get();

        if(!empty($request->all())){
            foreach($request->Experience as $experience){
                if(empty($experience["industry"])){
                    $msgString .= 'Industry is required field.' . "<br>";
                }
                if (empty($experience["company_name"])) {
                    $msgString .= 'Company name is required field.'. "<br>";
                }
                if (empty($experience["role"])) {
                    $msgString .= 'Role is required field.'. "<br>";
                }
                if (empty($experience["designation"])) {
                    $msgString .= 'Designation is required field.'. "<br>";
                }

                if(!empty($experience["from_month"]) && !empty($experience["to_month"])){
                    if($experience["from_year"] > $experience["to_year"]){
                        $msgString .= "- To year must be greater than from year<br>";
                    }else if($experience["from_year"] == $experience["to_year"]){
                        if($experience["to_month"] <= $experience["from_month"]){
                            $msgString .= 'to month must be greater than from month in same year'. "<br>";
                        }
                    }
                }
            }

            if (isset($msgString) && $msgString != '') {
                return Response(['response' => '' , 'mesasge'=>$msgString , 'status'=>500],200);
            }else{

                if($request->Experience){
                    foreach($request->Experience as $experience){

                        if(isset($experience['id'])){
                            $exp = Experience::find($experience['id']);
                        }else{
                            
                            $exp = new Experience;
                            $exp->created = now();
                            $exp->slug = 'exp-' . $userId . '-' . time();
                        }
                        
                        $exp->user_id = $userId;
                        $exp->industry = $experience['industry'];
                        $exp->company_name = $experience['company_name'];
                        $exp->functional_area = $experience['functional_area'];
                        $exp->role = $experience['role'];
                        $exp->designation = $experience['designation'];
                        $exp->ctclakhs = '0';
                        $exp->ctcthousand = '0';
                        $exp->from_month = $experience['from_month'];
                        $exp->from_year = $experience['from_year'];
                        $exp->to_month = $experience['to_month'];
                        $exp->to_year = $experience['to_year'];
                        $exp->job_profile = $experience['job_profile'];
                        
                        $exp->status = 1;

                        if(!empty($experience['company_name']) || !empty($experience['role']) || !empty($experience['designation'])){
                            $exp->save();
                        }
                    }

                    return Response(['response'=>'' ,'message'=> 'Data updated' , 'status'=>200 ],200);

                }
            }


        }else{

            $expDetails = Experience::where('user_id',$userId)->get();

            return Response(['response' => $expDetails , 'message'=> 'success' , 'status'=>200],200);

        }
    }

    public function deleteexperience($id = NULL) {

        Experience::where('id',$id)->delete();

        return Response(['response'=> '' , 'message'=> 'success' , 'status' => 200],200);
        
    }
    
    public function mailhistory():Response{

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        // $userdetail = User::where('id',$userId);

        $mails = MailHistory::with('Sender','Reciever')->where('to_id',$userId)
        ->orWhere('from_id',$userId)
        ->orderBy('id','desc')
        ->get();
        
       // print_r($mails);exit;
        
        
        foreach($mails as $key => $mail){
         
            $data[$key]['id'] = $mail->id;
            $data[$key]['subject'] = $mail->subject;
            $data[$key]['message'] = $mail->message;
            $data[$key]['created'] = $mail->created;
            $data[$key]['user_name'] = $mail->Reciever->company_name ? ucwords($mail->Sender->first_name . ' ' . $mail->Sender->last_name) : ucwords($mail->Reciever->first_name . ' ' . $mail->Reciever->last_name);
            $data[$key]['company_name'] = isset($mail->Sender->company_name) ? $mail->Sender->company_name : $mail->Reciever->company_name;
            $data[$key]['slug'] = $mail->slug;

        }

        return Response(['response' => $data  , 'message' => 'success' , 'status'=>200],200);
    }
    
    public function maildetail($slug = null):Response{

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->candidateAccess($userId)){
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

        $jobInfo = Job::where('slug',$mails->slug)->first();

        $data['jobInfo'] = $jobInfo;

        $data['mails'] = $mails;

        return Response(['response' => $data , 'message' => 'success'  ,'status' => 200 ],200);
    }
    
    public function changePassword(Request $request):Response{

        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $status='500';
        $data=array();

        if(!$this->candidateAccess($user_id)){
            $msg ='incorrect login type';
           // return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }else{
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
                $getuser = User::where('id',$user_id)->first();
                if (password_verify($request->old_password, $getuser->password)) {
                    if (!(password_verify($request->new_password, $getuser->password))) {

                        User::whereId($user_id)->update([
                            'password'=> Hash::make($request->new_password),
                        ]);
                        $msg='Your Password has been changed successfully.';
                        $status='200';

                    }else{
                        $msg='You cannot put your old password for the new password.';
                    }

                }else{
                    $msg='Old Password is not correct.';

                }
            }
        }
        return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);

    }
    
    public function uploadPhoto(Request $request):Response{
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $status=500;
        $data=array();
        $msg = '';

        if(!$this->candidateAccess($user_id)){
            $msg ='incorrect login type';
           // return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }else{

            if(!empty($request->all())){
                $input = $request->all();
                $rules = array(
                    'profile_image' => 'required',
                );
    
                $validator = Validator::make($input, $rules);
    
                $validator->setAttributeNames([
                    'profile_image' => 'Comapny Logo',
                ]);
    
                if ($validator->fails()) {
                    $msg = $this->validatersErrorString($validator->errors());
                }else{
                    $getuser = User::where('id',$user_id)->first();
    
    
                    if($request->profile_image != ''){
    
                        $file = explode( ";base64,", $request->profile_image);
                        $image_type_pieces = explode( "image/", $file[0] );
                        $image_type = $image_type_pieces[1];
                        $profile_image = Str::random(10).'.'.$image_type;
                        $decoded_string = base64_decode($file[1]);
    
                        file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$profile_image, $decoded_string);
    
    
                        // $file2 = base64_decode($request->profile_image);
                        // $profile_image =Str::random(10).'.'.'png';
                        // file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$profile_image, $file2);
                    }else{
                        $profile_image =$getuser->profile_image;
                    }
    
                    User::whereId($user_id)->update([
    
                        'profile_image' => $profile_image,
                    ]);
    
                    $msg='Your Image has been Uploaded successfully.';
                    $status=200;
    
    
                }
            }else{
                $getuser = User::where('id',$user_id)->first();
                
                if($getuser->profile_image != ''){
                    $data=array(
                        'profile_image' =>DISPLAY_FULL_PROFILE_IMAGE_PATH.$getuser->profile_image,
                    );
                }else{
                    $data=array(
                        'profile_image' =>'',
                    );
                }

                $status=200;
            }

        }
            return Response(['response' => $data , 'message' => $msg ,'status'=> $status],200);


    }
    
    public function editProfile(Request $request, $status = null) {

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        // global $extentions;
        // global $extentions_doc;
        // global $extentions_video;

        $msgString = '';

        $userdetails = User::where('id',$userId)->first();

        $coverLetters = Cover_letter::where('user_id', $userId)
        ->orderBy('id', 'desc')
        ->select('title', 'id' , 'description')->get();
        
        $data['CoverLetter'] = $coverLetters;


        $showOldImages = Certificate::where('user_id',$userId)
        ->where('type' ,'image')
        ->get();

        $imgi=0;
        $img_array = array();

        foreach ($showOldImages as $showOldImage) {
            $image = $showOldImage->document;
            if (!empty($image) && file_exists(UPLOAD_CERTIFICATE_PATH . $image)) {
                $img_array[$imgi]['image'] = DISPLAY_CERTIFICATE_PATH . $image;
                $img_array[$imgi]['slug'] = $showOldImage->slug;

                $imgi++;
            }

        }

        $data['showOldImages'] = $img_array;

        $showOldDocs = Certificate::where('user_id',$userId)
        ->where('type' ,'doc')
        ->get();

        $doci = 0;
        $doc_array = array();
        foreach($showOldDocs as $showOldDoc){
            $doc = $showOldDoc->document;
            if (!empty($doc) && file_exists(UPLOAD_CERTIFICATE_PATH . $doc)) {
                $doc_array[$doci]['doc_sub']= substr($doc,6);
                $doc_array[$doci]['doc']= $doc;
                $doc_array[$doci]['path'] = DISPLAY_CERTIFICATE_PATH;
                $doc_array[$doci]['slug'] = $showOldDoc->slug;
                $doci = $doci++;
            }
        }

        $data['showOldDocs']= $doc_array;

        $categoryList = Category::where('status',1)
        ->where('parent_id',0)
        ->select('id','name')
        ->orderBy('name','ASC')
        ->get(); 
        $data['categoryList'] = $categoryList;

        $categories = (new Category)->getCategoryList();
        $data['categories'] = $categories;


        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['locationlList'] = $locationlList;

        $skillList = Skill::where('type','Skill')
        ->where('status',1)
        ->select('name','id')
        ->get();
        
        $data['skillList'] = $skillList;

        $specilyList = '';
        $data['specilyList1'] = $specilyList;

        $mob = "/^[1-9][0-9]*$/";


        if(!empty($request->all())){
            
            $rule = array([
                // 'first_name' => 'required',
                // 'last_name' => 'required',
                // 'location' => 'required',
                // 'contact' => 'required'
            ]);

            $validator = Validator::make($request->all(),$rule);

            $validator->setAttributeNames([
                'first_name' => 'First name',
                'last_name' => 'Last name'
            ]);
            

            if($validator->fails()){
                $msgString = $this->validatersErrorString($validator->errors());

                return Response(['response'=>'','message'=>$msgString ,'status'=>500],200);
            }else{

                $msgString.= $this->checkSwearWord($request->first_name);
                $msgString.= $this->checkSwearWord($request->last_name);
                $msgString.= $this->checkSwearWord($request->contact);

                if(!empty($request->CoverLetter)){
                    $countter=1;
                    foreach ($request->CoverLetter as $key => $value) {
                        if (trim($value['title']) == '') {
                            $msgString .= "- Cover letter " . $countter . " title is required field.<br>";
                        } else {
                            $msgString .= $this->checkSwearWord($value['title']);
                        }
                        if (trim($value['description']) == '') {
                            $msgString .= "- Cover letter " . $countter . " description is required field.<br>";
                        } else {
                            $msgString .= $this->checkSwearWord($value['description']);
                        }
                        $countter++;
                    }
                }

                if($msgString != ''){
                    return Response(['response' => '' , 'message'=> $msgString ,'status'=>500],200);
                }else{

                    $user = User::find($userId);
                    
                    $user->first_name = $request->first_name;
                    $user->last_name = $request->last_name;
                    $user->gender = $request->gender;
                    $user->location = $request->location;
                    $user->contact = $request->contact;
                    $user->pre_location = $request->pre_location;
                    $user->exp_salary = $request->exp_salary;
                    $user->total_exp = $request->total_exp;
                    $user->company_about = $request->company_about;
                    $user->url = $request->url;
                    
                    // $this->request->data['User']['email_notification_id'] = implode(',', $this->data["User"]["email_notification_id"]);
                    $user->profile_update_status = 1;
                    
                    if($request->Certificate){
                        if($request->Certificate['images']){
                            $postArray = explode(',', $request->Certificate['images']);
    
                            $certificateArray = Certificate::where('user_id', $userId)
                            ->pluck('document', 'id')
                            ->toArray();
    
                            $deleteArray = array_diff($certificateArray, array_values($postArray));
                            if ($deleteArray) {
                                foreach ($deleteArray as $value) {
    
                                    Certificate::where('document',$value)
                                    ->delete();
    
                                    @unlink(UPLOAD_CERTIFICATE_PATH . $value);
                                }
                            }
    
                        }
                    }
                    

                    if($request->CoverLetter){
                        foreach($request->CoverLetter as $key => $value){
                            if($value['title'] != '' && $value['description'] != ''){
                                
                                if(isset($value['id'])){
                                    Cover_letter::where('id',$value['id'])
                                        ->update([
                                        'title' => $value['title'],
                                        'description' => $value['description'],
                                        'user_id' => $userId,
                                        'modified' => now(),
                                    ]);
                                }else{
                                    Cover_letter::insert([
                                        'title' => $value['title'],
                                        'description' => $value['description'],
                                        'user_id' => $userId,
                                        'created' => now(),
                                        'modified' => now(),
                                    ]);
                                }

                            }
                        }
                    }

                    if($request->skills){
                        $user->skills = implode(',',$request->skills);
                    }

                    $user->interest_categories = $request->interest_categories ? implode(',',$request->interest_categories) : $request->interest_categories;

                    if($user->save()){
                        
                        $extentions = $GLOBALS['extentions'];
                        $extentions_doc = $GLOBALS['extentions_doc'];
                        $selectedFileName = $request->selectedFileName;
                        
                        if(!empty($request->selectedCV)){
                            foreach($request->selectedCV as $key => $files){
                                $file = explode(';base64',$files);
                                $fileName = $selectedFileName[$key];
                                $originalName = '';

                                if(strstr($file[0],'image')){
                                    $image_type_pieces = explode('image/',$file[0]);
                                    $image_type = $image_type_pieces[1];
                                    $originalName = Str::random(4).'-'.$fileName;
                                    $extention = $image_type;

                                    $decoded_string = base64_decode($file[1]);

                                    file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);

                                }else
                                if(strstr($file[0],'application/msword')){
                                    //.doc
                                    $originalName = Str::random(4).'-'.$fileName;
                                    $extention = 'doc';

                                    $decoded_string = base64_decode($file[1]);

                                    file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);
                                }
                                else
                                if(strstr($file[0],'application/vnd')){
                                    //.docx
                                    $originalName = Str::random(4).'-'.$fileName;
                                    $extention = 'docx';

                                    $decoded_string = base64_decode($file[1]);

                                    file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);
                                }else
                                if(strstr($file[0],'application/pdf')){
                                    //.pdf
                                    $originalName = Str::random(4).'-'.$fileName;
                                    $extention = 'pdf';

                                    $decoded_string = base64_decode($file[1]);

                                    file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);
                                }

                                if($originalName != '' ){

                                    $certificate = new Certificate;

                                    $certificate->document = $originalName;
                                    $certificate->user_id = $userId;

                                    if (in_array($extention, $extentions)) {
                                        $certificate->type = 'image';
                                        $certificate->slug = 'image-' . $userId . time() . rand(111, 99999);
                                    } elseif (in_array($extention, $extentions_doc)) {
                                        $certificate->type = 'doc';
                                        $certificate->slug = 'doc-' . $userId . time() . rand(111, 99999);
                                    }
                                    
                                    $certificate->created = now();

                                    $certificate->save();
                                }

                            }
                        }

                        // if(!empty($request->Certificate['document'])){
                        //     $imagesArr = explode(',', $request->Certificate["document"]);
                        //     foreach ($imagesArr as $imageName) {
                        //         if (!empty($imageName) && file_exists(UPLOAD_TMP_CERTIFICATE_PATH . $imageName)){
                        //             copy(UPLOAD_TMP_CERTIFICATE_PATH . $imageName, UPLOAD_CERTIFICATE_PATH . $imageName);

                        //             $certificate = new Certificate;

                        //             $certificate->document = $imageName;
                        //             $certificate->user_id = $userId;

                        //             // $getextention = $this->PImage->getExtension($imageName);
                        //             // $extention = strtolower($getextention);

                        //             if (in_array($extention, $extentions)) {
                        //                 $certificate->type = 'image';
                        //                 $certificate->slug = 'image-' . $userId . time() . rand(111, 99999);
                        //             } elseif (in_array($extention, $extentions_doc)) {
                        //                 $certificate->type = 'doc';
                        //                 $certificate->slug = 'doc-' . $userId . time() . rand(111, 99999);
                        //             }

                        //             $certificate->save();
                        //             @unlink(UPLOAD_TMP_CERTIFICATE_PATH . $imageName);
                        //         }
                        //     }
                        // }

                        return Response(['response' => '' , 'message'=> 'Your Profile Details are updated Succesfully. Now you can apply for the job which you want.' ,'status' =>200],200);

    
                        // if ($userDetails['User']['profile_update_status'] == 0) {
                        //     $this->Session->write('success_msg', __d('controller', 'Your account is now complete, Happy job searching.', true));
                        // } else {
                        //     $this->Session->write('success_msg', __d('controller', 'Profile details updated successfully.', true));
                        // }

                    }
                    
                }

            }
        }else{

            $data['first_name'] = $userdetails->first_name;
            $data['last_name'] = $userdetails->last_name;
            $data['gender'] = $userdetails->gender;
            $data['location'] = $userdetails->location;
            $data['contact'] = $userdetails->contact;
            $data['pre_location'] = $userdetails->pre_location;
            $data['exp_salary'] = $userdetails->exp_salary;
            $data['total_exp'] = $userdetails->total_exp;
            $data['company_about'] = $userdetails->company_about;
            $data['url'] = $userdetails->url;
            
            $data['profile_image'] = '';
            if($userdetails->profile_image != '' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$userdetails->profile_image))
                $data['profile_image'] =  DISPLAY_FULL_PROFILE_IMAGE_PATH.$userdetails->profile_image;

            $totalexperienceArray = $GLOBALS['totalexperienceArray'] ;

            $data['experienceArray'] = $totalexperienceArray;

            if($userdetails->dob == '' || $userdetails->dob == '0000-00-00'){
                $data['dob'] = $userdetails->dob;
            }else{
                $data['dob'] = '';
            }

            if($userdetails->email_notification_id != ''){
                $data['email_notification_id'] = explode(',',$userdetails->email_notification_id );
            }else{
                $data['email_notification_id'] = '';
            }

            if($userdetails->skills){
                $data['skills'] = explode(',',$userdetails->skills);
            }

            if($userdetails->interest_categories){
                $data['interest_categories'] = explode(',',$userdetails->interest_categories);
            }

            return Response(['response' => $data, 'message' => 'success' , 'status'=>200],200);

        }
    }
    
    public function deleteCover($id = NULL):Response {

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if ($id != '') {

            Cover_letter::where('id',$id)->delete();

            $data['CoverLetter'] = Cover_letter::where('user_id',$userId)->get();

            return Response(['response' => $data , 'message'=>'cover Later Deleted' ,'status'=>200]);

        }
    }
    
    public function deleteCertificate($slug = NULL):Response {
        if ($slug != '') {

            $certificate = Certificate::where('slug',$slug)->select('id','document')->get();

            Certificate::where('id',$certificate->id)->delete();
            @unlink(UPLOAD_CERTIFICATE_PATH.$certificate->document);

            return response(['response' => '' , 'message' => 'Certificate deleted successfully.','status'=>200 ]);
        }
        
    }
    
    public function deleteeducation($id = NULL):Response{
        
        Education::where('id',$id)->delete();
        return Response(['response'=> '' , 'message'=>'education deleted' ,'status'=>200]);
        
    }
    
    public function uploadmultipleimages(Request $request) {
        
        if($reuest->hasFile('selectedCV')){
            return Response(['file found']);
        }
        
        return Response(['file not found']);
    }
    
    public function addVideoCv(Request $request){

        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $data=array();

        if(!$this->candidateAccess($user_id)){
            $msgString ='incorrect login type';
        }

        $userDetails = User::where('id',$user_id)->first();

        if(!empty($request->all())){
            $extentions_video = $GLOBALS['extentions_video'];
            
            $user = User::find($user_id);
            
            
            if(!empty($request->video)){
                
                $fileName = $request->videoName;
                
                $file = explode(';base64',$request->video);
                $image_type_pieces = explode('video/',$file[0]);
                $image_type = $image_type_pieces[1];
                $originalName = Str::random(4).'-'.$fileName;
                $extention = $image_type;

                $decoded_string = base64_decode($file[1]);

                file_put_contents(UPLOAD_VIDEO_PATH.$originalName, $decoded_string);
                
                $user->video = $originalName;
                
                @unlink(UPLOAD_VIDEO_PATH . $userDetails->video);
                
                $user->save();
                
                $data['path'] = DISPLAY_VIDEO_PATH.$originalName;
                $data['name'] = $originalName;
                
            }
            

            return Response(['responce' => $data , 'message' => 'Video Uploaded Successfully!!' , 'status' => 200 ],200);   

        }
        
        $data['path'] = DISPLAY_VIDEO_PATH.$userDetails->video;
        $data['name'] = $userDetails->video;
        
        return Response(['response' => $data , 'message'=>'' ,'status'=> 200]);
    
    }
    
    public function deleteVideo():Response {
          
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        if($user_id > 0){
            
            $video = User::where('id',$user_id)->pluck('video')->implode(',');
            
            User::where('id',$user_id)->update([
                'video' => '',
                ]);
            @unlink(UPLOAD_VIDEO_PATH.$video);
            
            return Response(['response' => '' , 'message' => 'Video deleted successfully.' , 'status'=>200 ]);
        }
    }
    
    public function uploadCvLogin(Request $request):Response{

        $tokenData = $this->requestAuthentication('POST', 2);

        if(isset($tokenData['user_id']))
            $user_id = $tokenData['user_id'];
        else
            $user_id = '';

        if($request->docs){
            $file = explode(';base64',$request->docs);
            $fileName = $request->selectedFileName;
            $originalName = '';

            if(strstr($file[0],'application/msword')){
                //.doc
                $originalName = Str::random(4).'-'.$fileName;
                $extention = 'doc';
                $imageArray[] = $originalName;

                $decoded_string = base64_decode($file[1]);

                file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);
            }
            else
            if(strstr($file[0],'application/vnd')){
                //.docx
                $originalName = Str::random(4).'-'.$fileName;
                $extention = 'docx';
                $imageArray[] = $originalName;

                $decoded_string = base64_decode($file[1]);

                file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);
            }

            if($user_id != ''){

                Certificate::insert([
                    'user_id' => $user_id,
                    'document' => $originalName,
                    'type' => 'doc',
                    'slug' => 'doc-'.$user_id.time().rand(111, 99999),
                    'created' => now(),
                ]);

            }

        }

    }
    
    public function deleteImage($slug = null):Response {

        $userProfileImage = User::where('slug',$slug)->select('profile_image')->first();
        if($userProfileImage){
            User::where('slug',$slug)->update([
                'profile_image' => ''
            ]);

            @unlink(UPLOAD_FULL_PROFILE_IMAGE_PATH . $userProfileImage);
            @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $userProfileImage);
            @unlink(UPLOAD_SMALL_PROFILE_IMAGE_PATH . $userProfileImage);

            return Response(['response' => '' ,'message'=>'rofile Image deleted successfully.' ,'status'=>200 ]);
        }
    }
    
    public function forgotPassword():Response {
        if(!empty($request->all())){
            if (empty($request->email_address)) {
                $msgstring = ('Please enter your email address.') . "<br>";
            } elseif ((new User)->checkEmail($request->email_address) == false) {
                $msgstring .= ('Please enter valid email address.') . "<br>";
            }

            if($msgstring == ''){
                $email = $request->email_address;

                $userCheck = User::where('email_address',$email)->first();

                if($userCheck){
                    User::where('id',$userCheck->id)
                    ->update([
                        'forget_password_status' => 1
                    ]);

                    $email = $userCheck->email_address;

                    $link = HTTP_PATH . "/candidates/resetPassword/" . $userCheck->id . "/" . md5($userCheck->id) . "/" . urlencode($email);

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

                    return Response(['response'=>'' ,'message' => 'A link to reset your password was sent to your email address','status'=>200],200);

                }else{

                    return Response(['response'=>'' ,'message' => 'Email address you enter not found in our database, please enter correct email address.','status'=>500],200);

                }
            }else{
                return Response(['response'=>'' , 'message'=>$msgstring ,'status'=>500 ]);
            }
        }
    }
    
    public function resetPassword($id = null, $md5id = null, $email = null):Response {
        if (md5($id) == $md5id) {

            $userCheck = User::where('email_address',urldecode($email))
            ->where('id',$id)
            ->select('forget_password_status','password')
            ->first();

            if($userCheck->forget_password_status == 1){
                if($request->password == ''){
                    $msgString .= ('New Password is required field.') . "<br>";
                }else
                if(strlen($request->password) < 8){
                    $msgString .= ('New Password must be at least 8 characters.') . "<br>";
                }

                if($request->confirm_password == ''){
                    $msgString .= ('Confirm Password is required field.') . "<br>";
                }

                $password = $request->password;
                $conformpassword = $request->confirm_password;

                if($password != $conformpassword){
                    $msgString .=('New password and confirm password mismatch.') . "<br>";
                }elseif(crypt($request->password, $userCheck->password) == $userCheck->password) {
                    $msgString .= ('You cannot put your old password for the new password') . "<br>";
                }else {
                    $passwordPlain = $request->password;
                    $salt = uniqid(mt_rand(), true);
                    $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');

                    $user = User::where('id',$userCheck->id);
                    $user->password = $new_password;
                    $user->enc_password = $this->generatePassword($passwordPlain);
                }

                if (isset($msgString) && $msgString != '') {
                    $this->Session->write('error_msg', $msgString);
                } else {
                    $user->forget_password_status = 0;
                    $user->save();
                    
                    return Response(['response'=>'' , 'message' => 'Password is reset successfully. Please Login' ,'status'=>500]);
                }
            }else{
                return Response(['response' => '' , 'message'=>'You have already use this link!' , 'status' => 500]);
            }
        } else {
            return Response(['responce'=>'' ,'message'=>'', 'status'=>500]);
        }
    }
    
    
    /// Admin
    
    
    public function admin_index(Request $request):Response {
        $authenticateadmin = $this->adminauthentication();

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
        'status',
        'contact',
        'slug',
        'location',
        'user_type',
        'id');

        $user = $user->where('user_type','candidate');
        $user = $user->orderBy('id','Desc');
        $users = $user->limit(90)->get();
        $user_array = array();

        foreach($users as $key => $user){

            $user_array[$key]['first_name'] = $user->first_name;
            $user_array[$key]['last_name'] = $user->last_name;
            $user_array[$key]['user_type'] = $user->user_type;
            $user_array[$key]['email_address'] = $user->email_address;
            $user_array[$key]['contact'] = $user->contact;
            $user_array[$key]['position'] = $user->position;
            $user_array[$key]['location'] = $user->location;
            $user_array[$key]['created'] = date('M d, Y',strtotime($user->created));
            $user_array[$key]['activation_status'] = $user->activation_status;
            $user_array[$key]['status'] = $user->status;
            $user_array[$key]['id'] = $user->id;
            $user_array[$key]['slug'] = $user->slug;

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

    public function admin_addcandidates(Request $request):Response{
        $authenticateadmin = $this->adminauthentication();

        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name', 'asc')
        ->get();
        $msgString='';

        if(!empty($request->all())){
            $validator = Validator::make($request->all(), [
                'first_name' => 'required',
                'last_name' => 'required',
                'contact' => 'required',
                'location' => 'required',
                'email_address' => 'required|unique:users,email_address',
                'password' => 'required',
                'confirm_password' => 'required|same:password',
            ]);

            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    
            }else {

                $passwordPlain = $request->password;
                $salt = uniqid(mt_rand(), true);
                $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');

                $user = new User;
                $user->password = $new_password;
                $user->email_address = $request->email_address;
                $user->first_name = trim($request->first_name);
                $user->last_name = trim($request->last_name);
                $user->status = 1;
                $user->contact = $request->contact;
                $user->location = $request->location;
                $user->activation_status = 1;
                $user->user_type = 'candidate';
                $user->slug = $this->createSlug($request->first_name.' '.$request->last_name, 'users');

                if($request->profile_image){
                    $file = explode( ";base64,", $request->profile_image);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    $originalName = Str::random(10).'.'.$image_type;
                    $decoded_string = base64_decode($file[1]);
                    file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$originalName, $decoded_string);
                    $user->profile_image = $originalName;
                }

                if($user->save()){

                    $email = $request->email_address;
                    $username = $request->first_name;

                    $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

                    $emailTemplate = Emailtemplate::where('id',26)->first();

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

                    $toSubArray = array('[!email!]', '[!password!]', '[!username!]', '[!SITE_TITLE!]', '[!subject!]');
                    $fromSubArray = array($email, $passwordPlain, $username, SITE_TITLE, $request->subject);

                    $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                    $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);


                    try {
                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                    } catch(\Exception $e) {
                        $msgString=$e->getMessage();
                    }


                    return Response(['response'=>'Jobseeker detials added successfully.', 'message'=>'success' , 'status'=>200 ],200);

                }

            }

        }

    }

    public function admin_editcandidates(Request $request,$slug = null):Response {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $data=array();
        $msgString='';
        $changedPassword='';
        if(!empty($request->all())){
            $validator = Validator::make($request->all(), [
                'first_name' => 'required',
                'last_name' => 'required',
                'contact' => 'required',
                'confirm_password' => 'same:new_password',
                'location' => 'required',
                'status' => 'required',

            ]);


            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
    
            }else {

             $userdetails = User::where('slug',$slug)->first();
              if($userdetails->profile_image != ''){
                $img=DISPLAY_FULL_PROFILE_IMAGE_PATH.$userdetails->profile_image;
    
            }else{
                $img='';
    
            }
               $user = array();

                if($request->new_password != ''){
                    $changedPassword = 1;
                    $passwordPlain = $request->new_password;
                    $salt = uniqid(mt_rand(), true);
                    $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');

                    $password = $new_password;
                }else{
                    $password=$userdetails->password;
                }

                if(($request->profile_image !='') && ($request->profile_image != $img)){
                    $file = explode( ";base64,", $request->profile_image);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    $originalName = Str::random(10).'.'.$image_type;
                    $decoded_string = base64_decode($file[1]);
                    file_put_contents(UPLOAD_FULL_PROFILE_IMAGE_PATH.$originalName, $decoded_string);
                    $profile_image = $originalName;
                }else{
                    $profile_image=$userdetails->profile_image;
                }

                User::where('slug',$slug)->update([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'location' => $request->location,
                    'contact' => $request->contact,
                    'password' => $password,
                    'profile_image' => $profile_image,
                    'status' => $request->status
                ]);

                    if($changedPassword == 1){
                        $email = $request->email_address;
                        $username = $request->first_name;
    
                        $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
    
                        $emailTemplate = Emailtemplate::where('id',27)->first();
    
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
    
                        // $toSubArray = array('[!email!]', '[!password!]', '[!username!]', '[!SITE_TITLE!]', '[!subject!]');
                        // $fromSubArray = array($email, $passwordPlain, $username, SITE_TITLE, $this->data['Job']['subject']);
    
                        // $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                        // $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);
     
                        // Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
                        //return Response(['response' => $data , 'message'=>'Jobseeker detials updated successfully.', 'status'=> 200 ],200);
    
                    }

                    $userDetails = User::where('slug',$slug)->first();
            
                    $data['userdetails'] = $userDetails;
                    return Response(['response'=> $userDetails, 'message'=>'Jobseeker detials updated successfully.' , 'status'=>200 ],200);


                   // return Response(['response'=>'Jobseeker detials updated successfully.', 'message'=>'success' , 'status'=>200 ],200);

            }
        }else{
            $userDetails = User::where('slug',$slug)
            ->first();

            $data['userdetails'] = $userDetails;

            return Response(['response' => $userDetails , 'message'=>'success', 'status'=> 200 ],200);

        }
    }

    public function admin_activateuser($slug = NULL):Response {
               
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

            return Response(['response'=>'', 'message'=>'Candidate activated successfully' , 'status'=>200 ],200);

        }
    }

    public function admin_deactivateuser($slug = NULL):Response {
                
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
                'status' => 0,
            ]);

            return Response(['response'=>'', 'message'=>'Candidate deactivated successfully' , 'status'=>200 ],200);
        }
    }

    public function admin_deletecandidates($slug = NULL):Response {
              
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        if ($slug != '') {

            $image = User::where('slug',$slug)->pluck('profile_image')->implode(',');

            $user = User::where('slug',$slug);

            if($user->delete()){
                @unlink(UPLOAD_FULL_PROFILE_IMAGE_PATH . $image);
                @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $image);
                @unlink(UPLOAD_SMALL_PROFILE_IMAGE_PATH . $image);
            }

            return Response(['response'=>'', 'message'=>'Candidate details deleted successfully','status'=>200],200);
        }
    }

    public function admin_deleteUserImage($userSlug = null):Response {
        $authenticateadmin = $this->adminauthentication();

        if (!empty($userSlug)) {

            $image = User::where('slug',$slug)->pluck('profile_image')->implode(',');

            $user = User::where('slug',$slug);
            $user->profile_image = "";
            if($user->save()){
                @unlink(UPLOAD_FULL_PROFILE_IMAGE_PATH . $image);
                @unlink(UPLOAD_THUMB_PROFILE_IMAGE_PATH . $image);
                @unlink(UPLOAD_SMALL_PROFILE_IMAGE_PATH . $image);
            }

            return Response(['response'=>'' , 'message'=> 'Image deleted successfully', 'status'=>200],200);

        }
    }

    public function admin_certificates(Request $request, $cslug):Response {

        $authenticateadmin = $this->adminauthentication();
        $data=array();
        $candidateInfo = User::where('slug',$cslug)->count();

        if($candidateInfo <=0 ){
            return Response(['response'=>'' , 'message'=>'candidate not found' , 'status'=>200],200);
        }
        $candidateInfo = User::where('slug',$cslug)->first();
        User::where('slug',$cslug)->first();

        $userId = $candidateInfo->id;
        $data['first_name'] = $candidateInfo->first_name;
        $data['last_name'] = $candidateInfo->last_name;

        $message = "";

        if(!empty($request->all())){
            $extentions = $GLOBALS['extentions'];
            $extentions_doc = $GLOBALS['extentions_doc'];
            $selectedFileName = $request->selectedFileName;
            
            if(!empty($request->selectedCV)){
                foreach($request->selectedCV as $key => $files){
                    $file = explode(';base64',$files);
                    $fileName = $selectedFileName[$key];
                    $originalName = '';

                    if(strstr($file[0],'image')){
                        $image_type_pieces = explode('image/',$file[0]);
                        $image_type = $image_type_pieces[1];
                        $originalName = Str::random(4).'-'.$fileName;
                        $extention = $image_type;

                        $decoded_string = base64_decode($file[1]);

                        file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);

                    }else
                    if(strstr($file[0],'application/msword')){
                        //.doc
                        $originalName = Str::random(4).'-'.$fileName;
                        $extention = 'doc';

                        $decoded_string = base64_decode($file[1]);

                        file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);
                    }
                    else
                    if(strstr($file[0],'application/vnd')){
                        //.docx
                        $originalName = Str::random(4).'-'.$fileName;
                        $extention = 'docx';

                        $decoded_string = base64_decode($file[1]);

                        file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);
                    }else
                    if(strstr($file[0],'application/pdf')){
                        //.pdf
                        $originalName = Str::random(4).'-'.$fileName;
                        $extention = 'pdf';

                        $decoded_string = base64_decode($file[1]);

                        file_put_contents(UPLOAD_CERTIFICATE_PATH.$originalName, $decoded_string);
                    }

                    if($originalName != '' ){

                        $certificate = new Certificate;

                        $certificate->document = $originalName;
                        $certificate->user_id = $userId;

                        if (in_array($extention, $extentions)) {
                            $certificate->type = 'image';
                            $certificate->slug = 'image-' . $userId . time() . rand(111, 99999);
                        } elseif (in_array($extention, $extentions_doc)) {
                            $certificate->type = 'doc';
                            $certificate->slug = 'doc-' . $userId . time() . rand(111, 99999);
                        }
                        
                        $certificate->created = now();

                        $certificate->save();
                    }

                }
            }

            $message = 'Documents/Certificate uploaded successfully';

        }

        // $showOldImages = Certificate::where('user_id',$userId)
        // ->where('type','image')
        // ->get();

        // $data['showOldImages'] = $showOldImages;

        // $showOldDocs = Certificate::where('user_id',$userId)
        // ->where('type','doc')
        // ->get();
       // $data['showOldDocs'] = $showOldDocs;

        $cvImages = [];
        $showOldImages = Certificate::where('user_id', $userId)->get();
        foreach ($showOldImages as $showOldImage) {
            $image = $showOldImage->document;
            $id = $showOldImage->id;
            
            if (!empty($image) && file_exists(UPLOAD_CERTIFICATE_PATH . $image)) {
                $cvImages[] = ['id' => $id,'slug' => $showOldImage->slug, 'document' => DISPLAY_CERTIFICATE_PATH.$image, 'type' => $showOldImage->type];
            }
        }

        $data['certificates'] = $cvImages;

        $data['first_name'] = $candidateInfo->first_name;
        $data['last_name'] = $candidateInfo->last_name;
        //$data['certificates_data'] = $showOldImages;

        return Response(['response'=>$data, 'message'=> $message ,'status'=>200]);

    }

    public function admin_deleteCertificate($slug = NULL):Response {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {

            $certificate = Certificate::where('slug',$slug)
            ->select('document','id')->first();

            Certificate::where('id',$certificate->id)->delete();

            @unlink(UPLOAD_CERTIFICATE_PATH . $certificate->document);

            return Response(['response'=>'' ,'message'=>'Certificate deleted successfully','status'=>200]);
        }
    }

    public function admin_deleteExperience($slug = NULL, $cslug):Response {
               
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {
            $id = Experience::where('slug',$slug)->pluck('id')->implode(',');

            Experience::where('id',$id)->delete();

            return Response(['response' => '' , 'message' => 'Experience deleted successfully' ,'status' => 200 ]);
        }
    }

    public function admin_experience($cslug, $exslug = null):Response {
               

        $msgString = '';

        $extentions = $GLOBALS['extentions'];

        $candidateInfo = Users::where('slug',$cslug)
        ->first();

        if(!$candidateInfo){
            return Response(['responce'=> '/admin/certificates/index/','message'=>'' , 'status' =>200]);
        }

        if(!empty($request->all())){
            if (empty($request->company_name)) {
                $msgString .= "- Company name is required field.<br>";
            }
            if (empty($request->fdate)) {
                $msgString .= "- From is required field.<br>";
            } else {
                $fff = strtotime('01-' . str_replace('/', '-', $request->fdate));
                $fdateA = date('Y-m-d', $fff);
                if ($fdateA == '1970-01-01') {
                    $msgString .= "- Please enter valid From date .<br>";
                } elseif ($fdateA > date('Y-m-d')) {
                    $msgString .= "- From date must be past date .<br>";
                }
            }
            if (empty($request->tdate)) {
                $msgString .= "- Until is required field.<br>";
            } else {
                $ttt = strtotime('01-' . str_replace('/', '-', $request->tdate));
                $fdateA = date('Y-m-d', $ttt);
                if ($fdateA == '1970-01-01') {
                    $msgString .= "- Please enter valid Until date .<br>";
                } elseif ($fdateA > date('Y-m-d')) {
                    $msgString .= "- Until date must be past date .<br>";
                }
            }

            if ($ttt <= $fff) {
                $msgString .= "- From date must be less then Until date .<br>";
            }

            if (isset($msgString) && $msgString != '') {
               return Response(['response'=>'' ,'message'=> $msgString , 'status'=>200]);
            }else{
                $experience = new Experience;

                $experience->user_id = $candidateInfo->id;
                $experience->status = 1;
                $experience->fdate = date('Y-m-d', $fff);
                $experience->tdate = date('Y-m-d', $ttt);
                $experience->slug = 'exp-' . $candidateInfo->id . '-' . time();

                if ($experience->save()) {

                    return response(['response'=>'' , 'message'=>'Candidate experience details saved successfully' , 'status'=>200],200);
                }
            }
        }else {
            if (isset($exslug) && $exslug != '') {

                $exp = Experience::where('slug',$exslug)->first();

            }
        }

        $experiences = Experience::where('user_id',$candidateInfo->id)
        ->orderBy('id','DESC')
        ->get();

        $data['experiences'] = $experiences;

        return Response(['response'=>$data,'message'=>'','status'=>200]);

    }

    public function admin_deleteCvDocument($slug = null):Response {

        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        
        $userDetails = User::where('slug',$slug)
        ->first();

        if($userDetails){
            $id = $userDetails->id;

            User::where('id',$id)->update([
                'cv' => '',
            ]);

            @unlink(UPLOAD_CV_PATH . $userDetails->cv);

            return Response(['response' => '' , 'message'=>'Cv document deleted successfully.' , 'status' => 200]);

        }
    }

    public function admin_downloadDocCertificate($filename = null):Response {
        set_time_limit(0);
        $file_path = DISPLAY_CERTIFICATE_PATH . $filename;

        return Response(['response' => $file_path , 'message'=> '' , 'status'=>200]);
    }

    public function admin_downloadImage($filename = null):Response {
        set_time_limit(0);
        $file_path = DISPLAY_CERTIFICATE_PATH . $filename;

        return Response(['response' => $file_path , 'message'=> '' , 'status'=>200]);
    }
    
    

    // *************** App api ********************

    public function apps_login(Request $request) {
        $this->layout = '';
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
        ->where('user_type','candidate')
        ->first();


        $response = '';
        $message = 'Invalid email and/or password.';
        $status = 500;

        if (!empty($userCheck) && crypt($password, $userCheck->password) == $userCheck->password) {
            if ($userCheck->status == 1 && $userCheck->activation_status == 1) {
                if ($type == 'candidate') {
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
        if(file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image))
            $data['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userCheck->profile_image;
            
        $data['video'] = '';
        if(file_exists(UPLOAD_VIDEO_PATH.$userCheck->video))
            $data['video'] = $userCheck->video;
        
        $token = $this->setToken($userCheck);
        $data['token'] = $token;
        return $data;
    }

    public function apps_signup(Request $request) {
        $this->requestAuthentication('POST', 2);

        $data["User"] = $request->all();

        $newUser = new User;

        if ($data["User"]['user_type'] == 'candidate') {
            if (($newUser)->isRecordUniqueemail($data["User"]["email_address"]) == false) {
               echo $this->errorOutputResult('Email already exists.');
                exit;
            }


            $rules = array(
                'email_address' => 'required|email|unique:users,email_address',
                'user_type' => 'required',
                'first_name' => 'required',
                'last_name' => 'required',
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

                //'confirm_password' => 'Confirm password',
    
            ]);
    
            if ($validator->fails()) {
                $msg = $this->validatersErrorString($validator->errors());
                echo $this->errorOutputResult($msg);
                exit;
            }else{

                    $passwordPlain = $data["User"]["password"];
        
                    $salt = uniqid(mt_rand(), true);
                    $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');
                    $newUser->password = $new_password;
                    $newUser->first_name = trim($data['User']['first_name']);
                    $newUser->last_name = trim($data['User']['last_name']);
                    $newUser->email_address = trim($data["User"]["email_address"]);
                    $newUser->slug = $this->createSlug(trim(strtolower($data['User']['first_name'])) . ' ' . trim(strtolower($data['User']['last_name'])), 'users', 'slug');
                    $newUser->country_id = 1;
                    $newUser->activation_status = 0;
                    $newUser->status = 0;
                    $newUser->user_type = 'candidate';



        
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
                        $link = HTTP_PATH . "/users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);;
                        
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

                        
                        echo $this->successOutput('Your account is successfully created.Please check your email for activation link. Thank you!');
                    }
            }

        }else{
            echo $this->errorOutputResult('User Type should be Candidate!');
            exit;
        }
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

            $link = HTTP_PATH . "/candidates/resetPassword/" . $userCheck->id . "/" . md5($userCheck->id) . "/" . urlencode($email);

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
            echo $this->errorOutputResult('Your email is not registered with'. ' ' . SITE_TITLE .' Please enter correct email or register on' . '. ' . SITE_TITLE);
        }
        exit;
    }

    public function apps_homescreen(Request $request)
    {
        // $jsonStr = $_POST['jsonData'];
        // $userData = json_decode($jsonStr, true);
        // $auth_type = $userData['auth_type'];
        $headers = $_SERVER;
    
        if (!empty($headers['HTTP_TOKEN'])) {
            // if (strlen(request()->header('HTTP_TOKEN')) > 32) {
            //     $tokenData = $this->requestAuthentication('GET', 2);
            // } else {
            //     $tokenData = $this->requestAuthentication('GET', 1);
            // }
             $tokenData = $this->requestAuthentication('GET',1);
        } else {
            $tokenData = $this->requestAuthentication('GET', 2);
        }
        
        

        $userId = !isset($tokenData['user_id']) ? '' : $tokenData['user_id'] ;
        $data = [];
        $data['new_jobs'] = [];
        $data['new_jobs_count'] = 0;
        $data['recommended_jobs_count'] = 0;
        $data['recommended_jobs'] = [];

        $getRemainingFeatures = (new Plan)->getPlanFeature($userId);
      //  print_r($getRemainingFeatures);exit;

       if(isset($getRemainingFeatures['availableAppliedCount']) && ($getRemainingFeatures['availableAppliedCount'] > 0)){
        $data['available_jobapply_count'] = $getRemainingFeatures['availableAppliedCount'];

       }else{
        $data['available_jobapply_count'] = 0;

       }
       $userPlan = (new Plan)->getcurrentplan($userId);

     //  $isAbleToJob = (new Plan)->checkPlanFeature($userId, 4);

       if($userPlan != ''){
            $data['is_plan_active'] = 1;

        }else{
                
            $data['is_plan_active'] = 0;
        }


        
        $job = new Job;
  
    
        if (!empty($userId)) {

            $userData  = User::find($userId);
            $condition_rec = [];

            if (!empty($userData->location) || !empty($userData->pre_location)) {
                $location = $userData->location;
                $pre_location = $userData->pre_location;

                if (!empty($userData->location) && !empty($userData->pre_location)) {
                    $job = $job->where(function ($query) use ($location, $pre_location) {
                                    $query->where('jobs.job_city', 'like', "%{$location}%")
                                        ->orWhere('jobs.job_city', 'like', "%{$pre_location}%");
                                });
                } else {
                    if (!empty($userData->location)) {
                        $job = $job->where('jobs.job_city','like',"%{$location}%");
                    } else {
                        $job = $job->where('jobs.job_city','like',"%{$pre_location}%");
                    }
                }
            }
            
            // dd($userData);

            if (!empty($userData->skills)) {
                
                $skill_arr = explode(",", $userData->skills);
                $condition_skill = [];
                $rawSkillArray = [];
                $skillArray =[];

                foreach ($skill_arr as $skillhave) {
                    $skillDetail = Skill::where('name',$skillhave)->first();
                    
                    // if ($skillDetail->count() > 0) {
                    //     $idshave = $skillDetail->id;
                    //     $rawSkillArray[] = 'FIND_IN_SET("'.$idshave.'", tbl_jobs.skill)';
                    // } else {
                        if ($skillhave != '') {
                            $skillArray[] = $skillhave;
                        }
                    // }
                }
                
                if(!empty($skillArray)){
                     $job = $job->crossJoin('skills');   
                }
        
                $job = $job->orWhere(function ($query) use ($rawSkillArray,$skillArray) {
                    foreach ($rawSkillArray as $condition) {
                        $query->orWhereRaw($condition);
                    }
                    
                    foreach($skillArray as $condition){
                        $query->orWhere('skills.name','like',"%{$condition}%");
                    }
                });
                
            }
            
            // dd($userData);

            // if (!empty($userData->designation)) {
            //     $designation_arr = explode(",", $userData->designation);
            //     $condition_designation = [];

            //     foreach ($designation_arr as $des) {
            //         $dDetail = Designation::where('name',$des)->first();
            //         if ($dDetail->count() > 0) {
            //             $idshave = $dDetail->id;
            //             $condition_designation[] = '(Job.designation LIKE "%' . $idshave . '%")';
            //         } else {
            //             if ($des != '') {
            //                 $condition_designation[] = "(Designation.name LIKE '%" . addslashes($des) . "%')";
            //             }
            //         }
            //     }

            //     $condition_rec[] = ['OR' => $condition_designation];
            // }
        
            
            $job = $job->join('users', 'jobs.user_id' , '=' , 'users.id');
            $job = $job->where('jobs.status',1);
            $job = $job->where('jobs.expire_time','>=',time());
            $job = $job->groupBy('jobs.id');
            
            $total_record_rec = $job->count();
            
            $job = $job->select('jobs.id as id',
            'jobs.title as title',
            'jobs.company_name as company_name',
            'jobs.logo as logo',
            'users.profile_image as profile_image',
            'jobs.job_city as job_city',
            'jobs.created as created');
            
            $job = $job->orderBy('jobs.created','DESC');
            
            $jobslist_rec = $job->get();
            

            // $total_record_rec = $this->Job->where($condition_rec)->count();
            // $jobslist_rec = $this->Job->where($condition_rec)->orderBy('created', 'DESC')->get();
            $jobArray_rec = [];

            if ($jobslist_rec) {
                foreach ($jobslist_rec as $job_rec) {
                    
                    $is_applied = 0;
                    $is_saved = 0;
                    
                    if (isset($userId) && $userId > 0) {
                        $apply_status = Job_apply::where('user_id', $userId)
                            ->where('job_id', $job_rec->id)
                            ->first();
            
                        if ($apply_status) {
                            $is_applied = 1;
                        }
                        
                        $save_status = Short_list::where('short_lists.user_id', $userId)
                            ->join('jobs','short_lists.job_id','=','jobs.id')
                            ->where('short_lists.job_id', $job_rec->id)
                            ->where('jobs.job_status', 0)
                            ->first();
            
                        if ($save_status) {
                            $is_saved = 1;
                        }
                    }
                    
                    $jobIds = explode(',', $job_rec->skill);
                    
                    $skillList = Skill::where('type', 'Skill')
                        ->where('status', 1)
                        ->pluck('name', 'id')
                        ->toArray();
                    
                    $skills_array = array();
            
                    if ($skillList) {
                        foreach ($jobIds as $jid) {
                            if(isset($skillList[$jid]))
                            $skills_array[] = [
                                'id' => $jid,
                                'name' => $skillList[$jid]
                            ];
                        }
                    }
                
        
                    $jobArray_rec[] = [
                        'id' => $job_rec->id,
                        'title' => $job_rec->title,
                        'company_name' => $job_rec->company_name,
                        'logo' => file_exists(UPLOAD_JOB_LOGO_PATH . $job_rec->logo)  && $job_rec->logo != '' ? DISPLAY_JOB_LOGO_PATH.$job_rec->logo : '',
                        'profile_image' => file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH . $job_rec->profile_image) && $job_rec->profile_image !='' ? DISPLAY_FULL_PROFILE_IMAGE_PATH.$job_rec->profile_image : '',
                        'location' => $job_rec->job_city,
                        'date' => date('F j, Y', strtotime($job_rec->created)),
                        'is_applied' => $is_applied,
                        'is_saved' => $is_saved,
                        'skills' => $skills_array,
                    ];
                }
            }

            $data['recommended_jobs_count'] = $total_record_rec;
            $data['recommended_jobs'] = $jobArray_rec;
        }
        
        $jobNew = new Job;
        $jobNew = $jobNew->join('users', 'jobs.user_id' , '=' , 'users.id');
        $jobNew = $jobNew->where('jobs.status',1);
        $jobNew = $jobNew->where('jobs.expire_time','>=',time());
        
        $total_record = $jobNew->count();
        
        $jobNew = $jobNew->select('jobs.id as id',
        'jobs.title as title',
        'jobs.company_name as company_name',
        'jobs.logo as logo',
        'users.profile_image as profile_image',
        'jobs.job_city as job_city',
        'jobs.created as created',
        'jobs.skill as skill',
        'jobs.max_salary as max_salary',
        'jobs.min_salary as min_salary'
        );
        
        $jobNew = $jobNew->orderBy('jobs.created','DESC');
        $jobslist = $jobNew->get();
        
        // $sql = $job->toSql();
        // dd($sql);
        
        // $total_record = $this->Job->where($condition)->count();
        // $jobslist = $this->Job->where($condition)->orderBy('created', 'DESC')->get();
        $jobArray = [];

        if ($jobslist) {
            foreach ($jobslist as $jobs) {
                $is_applied = 0;
                $is_saved = 0;
                
                if (isset($userId) && $userId > 0) {
                    $apply_status = Job_apply::where('user_id', $userId)
                        ->where('job_id', $jobs->id)
                        ->first();
        
                    if ($apply_status) {
                        $is_applied = 1;
                    }
                    
                    $save_status = Short_list::where('short_lists.user_id', $userId)
                        ->join('jobs','short_lists.job_id','=','jobs.id')
                        ->where('short_lists.job_id', $jobs->id)
                        ->where('jobs.job_status', 0)
                        ->first();
        
                    if ($save_status) {
                        $is_saved = 1;
                    }
                }
                
                $jobIds = explode(',', $jobs->skill);
                
                $skillList = Skill::where('type', 'Skill')
                    ->where('status', 1)
                    ->pluck('name', 'id')
                    ->toArray();
                
                $skills_array = array();
        
                if ($skillList) {
                    foreach ($jobIds as $jid) {
                        if(isset($skillList[$jid]))
                        $skills_array[] = [
                            'id' => $jid,
                            'name' => $skillList[$jid]
                        ];
                    }
                }
                
                if ($jobs->min_salary && $jobs->max_salary) {
                    $salary = CURRENCY . ' ' . intval($jobs->min_salary) . " - " . CURRENCY . ' ' . intval($jobs->max_salary);
                } else {
                    $salary = "N/A";
                }
                    
                $jobArray[] = [
                    'id' => $jobs->id,
                    'title' => $jobs->title,
                    'company_name' => $jobs->company_name,
                    'logo' => file_exists(UPLOAD_JOB_LOGO_PATH . $jobs->logo) && $jobs->logo != ''  ? DISPLAY_JOB_LOGO_PATH.$jobs->logo : '',
                    'profile_image' => file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH . $jobs->profile_image) && $jobs->profile_image != '' ? DISPLAY_FULL_PROFILE_IMAGE_PATH.$jobs->profile_image : '',
                    'location' => $jobs->job_city,
                    'date' => date('F j, Y', strtotime($jobs->created)),
                    'is_applied' => $is_applied,
                    'is_saved' => $is_saved,
                    'skill' => $skills_array,
                    'salary' => $salary,
                ];
            }
        }
        
        $fullTimeJobs = Job::where('work_type',1)->count();
        $partTimeJobs = Job::where('work_type',2)->count();
        $jobsPosted = Job::count();
        
        $data['new_jobs'] = $jobArray;
        $data['new_jobs_count'] = $total_record;
        $data['full_time_jobs'] = $fullTimeJobs;
        $data['part_time_jobs'] = $partTimeJobs;
        $data['jobs_posted'] = $jobsPosted;
        

        return $this->successOutputResult('Jobs Lists Homescreen',$data);
        exit;
    }

    public function apps_jobdetail(Request $request , $slug = null)
    {

        // $jsonData = $request->input('jsonData');
        // $userData = json_decode($jsonData, true);
        
        if(!empty($request->all())){
            $userData = $request->all();
            $jobId = $userData['id'];
        }
        

        
        // $auth_type = $userData['auth_type'];
        // $slug = isset($userData['slug']) ? $userData['slug'] :'' ;

        $headers = $_SERVER;
    
        if (!empty($headers['HTTP_TOKEN'])) {
            // if (strlen(request()->header('HTTP_TOKEN')) > 32) {
            //     $tokenData = $this->requestAuthentication('GET', 2);
            // } else {
            //     $tokenData = $this->requestAuthentication('GET', 1);
            // }
             $tokenData = $this->requestAuthentication('POST',1);
        } else {
            $tokenData = $this->requestAuthentication('POST', 2);
        }


        // $tokenData = $this->requestAuthentication('POST', $auth_type);
        $userId = isset($tokenData['user_id']) ? $tokenData['user_id'] :'';

        if (!empty($slug)) {
            $jobdetails = Job::where('slug', $slug)->first();
        } else {
            $jobdetails = Job::find($jobId);
        }

        $data = [];
        $data['title'] = $jobdetails->title;
        $data['company_name'] = $jobdetails->company_name;
        $data['location'] = $jobdetails->job_city;
        $data['expire_time'] = date('Y-m-d', $jobdetails->expire_time);

        if ($jobdetails->min_exp && $jobdetails->max_exp) {
            $experience = $jobdetails->min_exp . "-" . $jobdetails->max_exp . " Year";
        } else {
            $experience = "N/A";
        }
        $data['experience'] = $experience;
        $data['view_count'] = $jobdetails->view_count;
        $data['applications'] = (new Job_apply)->getTotalCandidate($jobdetails->id);
        $is_applied = 0;

        if (isset($userId) && $userId > 0) {
            $apply_status = Job_apply::where('user_id', $userId)
                ->where('job_id', $jobdetails->id)
                ->first();

            if ($apply_status) {
                $is_applied = 1;
            }
        }

        $is_saved = 0;
        $clArray = [];
        $skills_array = [];

        if (isset($userId) && $userId > 0) {
            $save_status = Short_list::where('short_lists.user_id', $userId)
                ->join('jobs','short_lists.job_id','=','jobs.id')
                ->where('short_lists.job_id', $jobdetails->id)
                ->where('jobs.job_status', 0)
                ->first();

            if ($save_status) {
                $is_saved = 1;
            }

            $coverLetters = Cover_letter::where('user_id', $userId)
                ->orderBy('id', 'DESC')
                ->get();

            if ($coverLetters) {
                foreach ($coverLetters as $coverLetter) {
                    $clArray[] = [
                        'id' => $coverLetter->id,
                        'title' => $coverLetter->title
                    ];
                }
            }
        }

        $jobIds = explode(',', $jobdetails->skill);
        $skillList = Skill::where('type', 'Skill')
            ->where('status', 1)
            ->pluck('name', 'id')
            ->toArray();

        if ($skillList) {
            foreach ($jobIds as $jid) {
                if(isset($skillList[$jid]))
                $skills_array[] = [
                    'id' => $jid,
                    'name' => $skillList[$jid]
                ];
            }
        }

        $data['skills_array'] = $skills_array;
        $data['coverletter'] = $clArray;
        $data['is_applied'] = $is_applied;
        $data['is_saved'] = $is_saved;
        
        $profile_image = User::where('id',$jobdetails->user_id)->pluck('profile_image')->implode(',');
        
        $data['profile_image'] = $profile_image;
        $data['user_id'] = $userId;
        $logo = '';
        if ($jobdetails->logo != '') {

            if (file_exists(UPLOAD_JOB_LOGO_PATH . $jobdetails->logo)) {
                $logo = DISPLAY_JOB_LOGO_PATH.$jobdetails->logo;
            }
        }

        $data['logo'] = $logo;
        $data['description'] = $jobdetails->description;

        if ($jobdetails->min_salary && $jobdetails->max_salary) {
            $salary = CURRENCY . ' ' . intval($jobdetails->min_salary) . " - " . CURRENCY . ' ' . intval($jobdetails->max_salary);
        } else {
            $salary = "N/A";
        }
        $data['salary'] = $salary;
        
        $cat_name = Category::where('id',$jobdetails->category_id)->pluck('name')->implode(',');
        
        $data['category'] = $cat_name;
        
        $worktype = $GLOBALS['worktype'];
        $data['job_type'] = $worktype[$jobdetails->work_type];
        $data['posted_date'] = date('F d, Y', strtotime($jobdetails->created));

        $data['designation'] = Skill::where('id', $jobdetails->designation)
            ->where('type', 'Designation')
            ->value('name');

        if ($jobdetails->brief_abtcomp) {
            $company_profile = strip_tags($jobdetails->brief_abtcomp);
        } else {
            $company_about = User::where('id',$jobdetails->user_id)->pluck('company_about')->implode(',');
            if (!empty($company_about)) {
                $company_profile = $company_about;
            } else {
                $company_profile = 'N/A';
            }
        }
        $data['company_profile'] = strip_tags($company_profile);

        if (trim($jobdetails->url) != '') {
            $website = $jobdetails->url;
        } else {
            $website = 'N/A';
        }
        $data['website'] = $website;

        if ($jobdetails->contact_name == '') {
            $contact_name = User::where('id',$jobdetails->user_id)->pluck('first_name')->implode(',');
        } else {
            $contact_name = $jobdetails->contact_name;
        }

        if ($jobdetails->contact_number == '') {
            $contact_number = User::where('id',$jobdetails->user_id)->pluck('contact')->implode(',');
        } else {
            $contact_number = $jobdetails->contact_number;
        }

        $data['contact_name'] = $contact_name;
        $data['contact_number'] = $contact_number;
        $data['job_id'] = $jobdetails->id;
        
                $cat_id = $jobdetails->category_id;
        $job_id = $jobdetails->id;


        $relevantJobList =Job::where('status',1)
        ->where('id','<>',$job_id)
        ->where('category_id',$cat_id)
        ->where('expire_time','>=',time())
        ->orderBy('created','desc')
        ->get();
        
        $relevantJobdetails = array();

        foreach($relevantJobList  as $relKey => $relevantJob){
            
            
            $specificDate = date('Y-m-d',strtotime($relevantJob->created));


            // Create DateTime objects for the specific date and current date
            $specificDateTime = new DateTime($specificDate);
            $currentDateTime = new DateTime();

            // Calculate the difference between the specific date and current date
            $interval = $specificDateTime->diff($currentDateTime);

            // Get the number of days from the interval
            $daysAgo = $interval->days;

            $relevantJobdetails[$relKey]['job_number'] = $relevantJob->job_number;
            $relevantJobdetails[$relKey]['category_id'] = $relevantJob->category_id;
            $relevantJobdetails[$relKey]['location'] = $relevantJob->location;
            $relevantJobdetails[$relKey]['job_city'] = $relevantJob->job_city;
            $relevantJobdetails[$relKey]['description'] = $relevantJob->description;
            $relevantJobdetails[$relKey]['company_name'] = $relevantJob->contact_name;
            $relevantJobdetails[$relKey]['min_exp'] = $relevantJob->min_exp;
            $relevantJobdetails[$relKey]['max_exp'] = $relevantJob->max_exp;
            $relevantJobdetails[$relKey]['min_salary'] = $relevantJob->min_salary;
            $relevantJobdetails[$relKey]['max_salary'] = $relevantJob->max_salary;
            $logo1 = '';
        if ($jobdetails->logo != '') {

            if (file_exists(UPLOAD_JOB_LOGO_PATH . $relevantJob->logo)) {
                $logo1 = DISPLAY_JOB_LOGO_PATH.$relevantJob->logo;
            }
        }
            $relevantJobdetails[$relKey]['logo'] = $logo1;

            $relevantJobdetails[$relKey]['skill'] = $relevantJob->skill;
            $relevantJobdetails[$relKey]['slug'] = $relevantJob->slug;
            $relevantJobdetails[$relKey]['title'] = $relevantJob->title;
            $relevantJobdetails[$relKey]['work_type'] = $worktype[$relevantJob->work_type];
            $relevantJobdetails[$relKey]['created'] = $daysAgo;
            $relevantJobdetails[$relKey]['cat_slug'] = Category::where('id',$relevantJob->category_id)->pluck('slug')->implode(',');

        }

        $data['relevantJobList'] = $relevantJobdetails;
        $getRemainingFeatures = (new Plan)->getPlanFeature($userId);
        //  print_r($getRemainingFeatures);exit;
  
         if(isset($getRemainingFeatures['availableAppliedCount']) && ($getRemainingFeatures['availableAppliedCount'] > 0)){
          $data['available_jobapply_count'] = $getRemainingFeatures['availableAppliedCount'];
  
         }else{
          $data['available_jobapply_count'] = 0;
  
         }

         $userPlan = (new Plan)->getcurrentplan($userId);

         //  $isAbleToJob = (new Plan)->checkPlanFeature($userId, 4);
    
           if($userPlan != ''){
                $data['is_plan_active'] = 1;
    
            }else{
                    
                $data['is_plan_active'] = 0;
            }
        
        $cat_slug=Category::where('id',$jobdetails->category_id)->pluck('slug');
        
        $data['url'] = HTTP_PATH . '/' . $cat_slug[0] . '/' . $jobdetails->slug . '.html';

        return $this->successOutputResult('Job details', $data);
    }
    
    public function apps_contactUs(Request $request) {

       
        $this->requestAuthentication('POST', 2);

        $msg ='';

        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'username' => 'required',
            'message' => 'required',
            'subject' => 'required',
        ]);
        $msgString='';

        if ($validator->fails()) {

            $msg .= implode("<br> - ", $validator->errors()->all());
            echo $this->errorOutputResult($msg);
            exit;
        }else {


        $email = $request->email;
        $username = $request->username;
        $message = $request->message;
        $subjectbyuser = $request->subject;

        $currentYear = date('Y', time());
        $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

        $contact_details = Setting::first();
        $email = $contact_details->email;

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

        $toSubArray = array('[!username!]', '[!email!]', '[!subject!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');

        $fromSubArray = array($username, $email, $subjectbyuser, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $subjectbyuser);

        $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
        $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));


        $emailTemplate = Emailtemplate::where('id',17)->first();

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

        $toSubArray = array('[!username!]', '[!email!]', '[!message!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]');
        $fromSubArray = array($username, $email, $message, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $subjectbyuser);

        $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
        $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));


        echo $this->successOutput('Your enquiry has been successfully sent to us!');
    }

        exit;
    }
    
    public function apps_deletesavedjob(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];

        $job_id = $request->id;

        Short_list::where('job_id',$job_id)
        ->where('user_id',$user_id)
        ->delete();

        $jobs = Short_list::join('jobs','jobs.id','=','short_lists.job_id')
        ->where('jobs.job_status',0)
        ->where('jobs.status',1)
        ->where('short_lists.user_id',$user_id)
        ->select('short_lists.id', 'short_lists.job_id','short_lists.user_id','short_lists.created','jobs.logo','jobs.job_city','jobs.company_name','jobs.title')
        ->get();

        $jobArray = array();
        foreach($jobs as $key => $job){
            $jobArray[$key]['id'] = $job->job_id;
            $jobArray[$key]['short_lists_id'] = $job->id;
            $jobArray[$key]['user_id'] = $job->user_id;
            $jobArray[$key]['title'] = $job->title;
            $jobArray[$key]['company_name'] = $job->company_name;
            $jobArray[$key]['location'] = $job->job_city;
            $jobArray[$key]['date'] = date('F j, Y',strtotime($job->created));
            $jobArray[$key]['logo'] = '';
            if ($job->logo !='' && file_exists(UPLOAD_JOB_LOGO_PATH . $job->logo)) {
                $jobArray[$key]['logo'] = DISPLAY_JOB_LOGO_PATH.$job->logo;
            }

            $profile_image = User::where('id',$user_id)->pluck('profile_image')->implode(',');
            $jobArray[$key]['profile_image'] = '' ;
            if($profile_image != '' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$profile_image) ){
                $jobArray[$key]['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$profile_image;
            }
        }

        echo $this->successOutputResult('Job removed from Saved Jobs List',$jobArray);
        exit;
    }
    
    public function apps_getskillslist() {
        $tokenData = $this->requestAuthentication('GET', 0);

        $skillList = Skill::where('type','Skill')
        ->where('status',1)
        ->select('name')
        ->orderBy('name','asc')
        ->get();

        $skillArray = array();
        foreach($skillList as $key => $val){
            $skillArray[] = $val;
        }

        echo $this->successOutputResult('Skills List',$skillArray);
        exit;
    }

    public function apps_getcourselist() {
        
        $tokenData = $this->requestAuthentication('GET', 0);
        $basicCourseList = Course::where('type', 'Basic')
            ->where('status', 1)
            ->orderBy('name', 'asc')
            ->pluck('name', 'id');

        $skillArray = array();
        $specializationList = Specialization::where('status', 1)
            ->orderBy('name', 'asc')
            ->get();

        $spArray = array();
        foreach ($specializationList as $val) {
            $spArray[$val->course_id][] = array('id' => $val->id, 'name' => $val->name);
        }

        $i = 0;
        foreach ($basicCourseList as $key => $val) {
            $skillArray[$i]['id'] = $key;
            $skillArray[$i]['name'] = $val;
            $skillArray[$i]['Specialization'] = isset($spArray[$key]) ? $spArray[$key] : array();
            $i++;
        }
        
        
        // $tokenData = $this->requestAuthentication('GET', 0);

        // $basicCourseList = Course::where('type','Basic')
        // ->where('status',1)
        // ->select('id','name')
        // ->orderBy('name','asc')
        // ->get();
        // $skillArray = array();

        // $specializationList = Specialization::where('status',1)
        // ->orderBy('name','asc')
        // ->get();
        // $spArray = array();

        // foreach($specializationList as $val){
        //     $spArray[$val->course_id][] = array('id' => $val->id , 'name'=> $val->name);
        // }

        // $i = 0;
        // foreach($basicCourseList as $key => $val){
        //     $skillArray[$i]['id'] = $val->id;
        //     $skillArray[$i]['name'] = $val->name;
        //     if (array_key_exists($key, $spArray)) {
        //         $skillArray[$i]['Specialization'] = $spArray[$key];
        //     } else {
        //         $skillArray[$i]['Specialization'] = array();
        //     }
        //     $i++;
        // }

        echo $this->successOutputResult('Course List',$skillArray);
        exit;
    }

    public function apps_getspecializationlist(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 0);

        $course_id = $request->course_id;
        
        $specializationList = Specialization::where('status',1)
        ->where('course_id',$course_id)
        ->orderBy('name','asc')
        ->get();

        echo $this->successOutputResult('Specialization List', $specializationList);
        exit;
    }

    public function apps_updateSkills(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        $skills = $request->skills;

        User::where('id',$userId)->update([
            'skills' => $skills
        ]);

        echo $this->successOutput('Skills updated successfully.');
        exit;
    }
    
    public function apps_viewProfile(Request $request)
    {
        $tokenData = $this->requestAuthentication('GET', 1);
        $userId = $tokenData['user_id'];

        // $jsonStr = $request->input('jsonData');
        // $userData = json_decode($jsonStr, true);

        // $userData = $request->all();
        // $userId = $userData['user_id'] ? $userData['user_id'] : $userId;

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

            // Assuming $FavoriteCount and $jobCount are defined somewhere in the code.
            $FavoriteCount=0;
            $jobCount=0;
            $data['favorite_count'] = $FavoriteCount;
            $data['job_count'] = $jobCount;

            $myPlan = (new Plan)->getcurrentplanEXP($userId);
            if ($myPlan == 0) {
                $data['is_plan'] = 0;
            }
            
            $data['is_expire'] = 0;
            $maxJobPost = '';
            
            if($myPlan == 1){
                $cplan = (new Plan)->getcurrentplan($userId);
                
                $data['plan_id'] = $cplan->plan_id ? $cplan->plan_id :'' ;
                $data['plan_name'] = Plan::whereId($cplan->plan_id)->pluck('plan_name')->implode(',');
                $featureIds = explode(',',$cplan->feature_ids);
                $fvalues = json_decode($cplan->fvalues, true);
                $maxJobPost = isset($fvalues[1]) ? $fvalues[1] : '';
                $maxResumeDownload = isset($fvalues[2]) ? $fvalues[2] : '';
                $maxSearchCandidate = isset($fvalues[3]) ? $fvalues[3] : '';
                $job_apply = isset($fvalues[4]) ? $fvalues[4] : '';
                $data['is_plan'] = 1;
                $tdaye = date('Y-m-d');
                if ($cplan->is_expire == 1 || $cplan->end_date < $tdaye) {
                    $data['is_expire'] = 1;
                }
                
            }
            

            $coverLetters = Cover_letter::where('user_id', $userId)->orderBy('id', 'DESC')->get();
            $clArray = [];
            foreach ($coverLetters as $coverLetter) {
                $clArray[] = [
                    'id' => $coverLetter->id,
                    'title' => $coverLetter->title,
                    'description' => $coverLetter->description,
                ];
            }
            $data['coverletter'] = $clArray;

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
            
                        $interest_categories = $userCheck->interest_categories;
            $data['interest_array'] = array();
            $Categories_array = array();
            $categoriesarray = array();
            if ($interest_categories) {
                $condition = array();
                Category::whereRaw("id IN ($interest_categories )")->select('id','name')->get();

            }

            if ($Categories_array) {
                foreach ($Categories_array as $id => $val) {
                    $record = array();
                    $record['id'] = $val->id;
                    $record['name'] = $val->name;
                    $categoriesarray[] = $record;
                }
            }
            $data['interest_array'] = $categoriesarray;
            
            echo $this->successOutputResult('View profile.',$data);
            exit;

        }
    }
    
    public function apps_addEducation(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        // $userData = $request->input('jsonData');
        // $userData = json_decode($userData, true);

        $userData = $request->all();

        $specilyList1 = Specialization::where('status', 1)->orderBy('name', 'asc')->pluck('name', 'id')->toArray();
        $yearArray = array_combine(range(date("Y"), 1950), range(date("Y"), 1950));

        $education = new Education();
        $education->user_id = $userId;
        $education->user_type = 'candidate';
        $education->education_type = 'Basic';
        $education->basic_course_id = $userData['course_id'];
        $education->basic_specialization_id = isset($userData['specialization_id']) && !empty($userData['specialization_id']) ? $userData['specialization_id'] : 0;
        $education->basic_university = $userData['university'];
        $education->basic_year = $userData['year'];
        $education->save();

        $educationId = $education->id;
        $eduDetail = Education::where('id', $educationId)->first();
        $educationArray = [];

        if ($eduDetail) {
            $record = [
                'id' => $eduDetail->id,
                'course_id' => $eduDetail->basic_course_id,
                'course_name' => Course::find($eduDetail->basic_course_id)->name,
                'specialization_id' => $eduDetail->basic_specialization_id,
                'specialization' => isset($specilyList1[$eduDetail->basic_specialization_id])?$specilyList1[$eduDetail->basic_specialization_id]:'',
                'university' => $eduDetail->basic_university,
                'passed_in' => isset($yearArray[$eduDetail->basic_year])?$yearArray[$eduDetail->basic_year] : $eduDetail->basic_year,
            ];
            $educationArray[] = $record;
        }

        $data['educations'] = $educationArray;

        echo $this->successOutputResult('View educations', $data);
        exit;
    }
    
    public function apps_editEducation(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        // $userData = $request->input('jsonData');
        // $userData = json_decode($userData, true);

        $userData = $request->all();

        $educationId = $userData['id'];

        $education = Education::find($educationId);
        if (!$education) {
            echo $this->errorOutput('Education not found');
            exit;
        }

        $education->user_id = $userId;
        $education->user_type = 'candidate';
        $education->education_type = 'Basic';
        $education->basic_course_id = $userData['course_id'];
        $education->basic_specialization_id = isset($userData['specialization_id']) && !empty($userData['specialization_id']) ? $userData['specialization_id'] : 0;
        $education->basic_university = $userData['university'];
        $education->basic_year = $userData['year'];
        $education->save();

        $specilyList1 = Specialization::where('status', 1)->orderBy('name', 'asc')->pluck('name', 'id')->toArray();
        $yearArray = array_combine(range(date("Y"), 1950), range(date("Y"), 1950));

        $eduDetail = Education::where('id', $educationId)->first();
        $educationArray = [];

        if ($eduDetail) {
            $record = [
                'id' => $eduDetail->id,
                'course_id' => $eduDetail->basic_course_id,
                'course_name' => Course::find($eduDetail->basic_course_id)->name,
                'specialization_id' => $eduDetail->basic_specialization_id,
                'specialization' => isset($specilyList1[$eduDetail->basic_specialization_id])?$specilyList1[$eduDetail->basic_specialization_id] : '',
                'university' => $eduDetail->basic_university,
                'passed_in' => isset($yearArray[$eduDetail->basic_year])?$yearArray[$eduDetail->basic_year]:$eduDetail->basic_year,
            ];
            $educationArray[] = $record;
        }

        $data['educations'] = $educationArray;

        echo $this->successOutputResult('View educations',$data);
        exit;
    }
    
    public function apps_deleteEducation(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        Education::where('id',$request->id)
        ->delete();

        echo $this->successOutput('Education delete successfully.');
        exit;
    }
    
    public function apps_addExperience(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        // $userData = $request->input('jsonData');
        // $userData = json_decode($userData, true);

        $userData = $request->all();

        $experience = new Experience();
        $experience->user_id = $userId;
        $experience->industry = $userData['industry'];
        $experience->functional_area = $userData['functional_area'];
        $experience->role = $userData['role'];
        $experience->company_name = $userData['company_name'];
        $experience->designation = $userData['designation'];
        $experience->ctclakhs = 0;
        $experience->ctcthousand = 0;
        $experience->from_month = $userData['from_month'];
        $experience->from_year = $userData['from_year'];
        $experience->to_month = $userData['to_month'];
        $experience->to_year = $userData['to_year'];
        $experience->job_profile = $userData['job_profile'];
        $experience->status = 1;
        $experience->slug = 'exp-' . $userId . '-' . time();
        $experience->created = now();
        $experience->save();

        $experienceId = $experience->id;
        
        $experienceArray = [];
        $monthName = $GLOBALS['monthName']; // Assuming this global variable is defined somewhere with month names.
        $yearArray = array_combine(range(date("Y"), 1950), range(date("Y"), 1950)); // Assuming year array is required.

        $expDetail = Experience::where('id', $experienceId)->first();
        if ($expDetail) {
            $record = [
                'id' => $expDetail->id,
                'industry' => $expDetail->industry,
                'functional_area' => $expDetail->functional_area,
                'role' => $expDetail->role,
                'company_name' => $expDetail->company_name,
                'designation' => $expDetail->designation,
                'duration_from' => ['month' => $monthName[$expDetail->from_month], 'year' => isset($yearArray[$expDetail->from_year])?$yearArray[$expDetail->from_year] : $expDetail->from_year ],
                'duration_to' => ['month' => $monthName[$expDetail->to_month], 'year' => isset($yearArray[$expDetail->to_year])? $yearArray[$expDetail->to_year] : $expDetail->to_year ],
                'job_profile' => $expDetail->job_profile,
            ];
            $experienceArray[] = $record;
        }

        $data['experience'] = $experienceArray;

        echo $this->successOutputResult('Experience Details saved successfully', $data);
        exit;
    }
    
    public function apps_editExperience(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        // $userData = $request->input('jsonData');
        // $userData = json_decode($userData, true);

        $userData = $request->all();

        $experienceId = $userData['id'];

        $experience = Experience::where('id', $experienceId)->first();
        if (!$experience) {
            return response()->json(['status' => 'error', 'message' => 'Experience not found']);
        }

        $experience->user_id = $userId;
        $experience->industry = $userData['industry'];
        $experience->functional_area = $userData['functional_area'];
        $experience->role = $userData['role'];
        $experience->company_name = $userData['company_name'];
        $experience->designation = $userData['designation'];
        $experience->ctclakhs = 0;
        $experience->ctcthousand = 0;
        $experience->from_month = $userData['from_month'];
        $experience->from_year = $userData['from_year'];
        $experience->to_month = $userData['to_month'];
        $experience->to_year = $userData['to_year'];
        $experience->job_profile = $userData['job_profile'];
        $experience->save();

        $experienceArray = [];
        $monthName = $GLOBALS['monthName']; // Assuming this global variable is defined somewhere with month names.
        $yearArray = array_combine(range(date("Y"), 1950), range(date("Y"), 1950)); // Assuming year array is required.

        $expDetail = Experience::where('id', $experienceId)->first();
        if ($expDetail) {
            $record = [
                'id' => $expDetail->id,
                'industry' => $expDetail->industry,
                'functional_area' => $expDetail->functional_area,
                'role' => $expDetail->role,
                'company_name' => $expDetail->company_name,
                'designation' => $expDetail->designation,
                'duration_from' => ['month' => $monthName[$expDetail->from_month], 'year' => isset($yearArray[$expDetail->from_year])?$yearArray[$expDetail->from_year] : $expDetail->from_year],
                'duration_to' => ['month' => $monthName[$expDetail->to_month], 'year' => isset($yearArray[$expDetail->to_year])?$yearArray[$expDetail->to_year]:$expDetail->to_year],
                'job_profile' => $expDetail->job_profile,
            ];
            $experienceArray[] = $record;
        }

        $data['experience'] = $experienceArray;

        echo $this->successOutputResult('Experience Details saved successfully', $data);
        exit;
    }
    
    public function apps_deleteExperience(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        Experience::where('id',$request->id)->delete();

        echo $this->successOutput('Experience Details deleted successfully');
        exit;
    }

    public function apps_searchjobs(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 0);
        $userId = !isset($tokenData['user_id']) ? '' : $tokenData['user_id'] ;
        
        $userData = $request->all();
        $tablePrefix = DB::getTablePrefix();


        $job = Job::where('jobs.status',1);
        $job = $job->where('jobs.expire_time', '>=' , time());

        if($userData['keyword'] != ''){
            $keyword = $userData['keyword'];

            $job = $job->whereRaw(" (".$tablePrefix."jobs.title LIKE '%" . addslashes($keyword) . "%' OR ".$tablePrefix."jobs.description LIKE '%" . addslashes($keyword) . "%' OR ".$tablePrefix."jobs.company_name LIKE '%" . addslashes($keyword) . "%' ) ");
        }
        if($userData['category_id'] != ''){
            $category_idCondtionArray = explode('-', $userData['category_id']);
            $category_idCondtion = implode(',', $category_idCondtionArray);
            $job = $job->whereRaw(" (".$tablePrefix."jobs.category_id IN ($category_idCondtion))");
        }
        if($userData['location'] != ''){
            $location = $userData['location'];
            $job = $job->whereRaw(" (".$tablePrefix."jobs.job_city like '%" . addslashes($location) . "%') ");
        }
        if ($userData['exp'] != '') {
            $expArray = explode('-', $userData['exp']);
            $min_exp = $expArray[0];
            $max_exp = $expArray[1];
            if ($min_exp == $max_exp) {
                $job = $job->whereRaw(" ((".$tablePrefix."jobs.min_exp <= $min_exp AND ".$tablePrefix."jobs.max_exp >= $min_exp)) ");
            } else {
                $job = $job->whereRaw(" ((".$tablePrefix."jobs.min_exp >= $min_exp AND ".$tablePrefix."jobs.max_exp <= $max_exp)) ");
            }
        }
        if ($userData['salary'] != '') {
            $expsalary = explode('-', $userData['salary']);
            $min_salary = $expsalary[0];
            $max_salary = $expsalary[1];
            $job = $job->whereRaw(" ((".$tablePrefix."jobs.min_salary >= $min_salary AND ".$tablePrefix."jobs.max_salary <= $min_salary) OR (".$tablePrefix."jobs.min_salary >= $min_salary AND ".$tablePrefix."jobs.max_salary <= $max_salary) OR (".$tablePrefix."jobs.min_salary = $max_salary ) OR (".$tablePrefix."jobs.max_salary = $min_salary )) ");
        }


        if ($userData['skill'] != '') {
            $skill_arr = explode(",", $userData['skill']);
            $keyword = array();
            $skilljoin = false;
            foreach ($skill_arr as $skillhave) {
                $cbd = array();
                $skillDetail = Skill::where('name',$skillhave)->first();

                if ($skillDetail) {
                    $idshave = $skillDetail->id;
                    $condition_skill[] = "(FIND_IN_SET('" . $idshave . "',".$tablePrefix."jobs.skill))";
                } else {
                    if ($skillhave != '') {
                        $skilljoin = true;
                        $condition_skill[] = "(".$tablePrefix."skills.name LIKE '%" . addslashes($skillhave) . "%')";
                    }
                }
            }

            if($skilljoin == true){
                $job = $job->crossJoin('skills');
            }

            $raw_condition_skill = implode(' OR ', $condition_skill);

            $job = $job->WhereRaw("( ".$raw_condition_skill." )");
        }

        if ($userData['designation'] != '') {
            $designation_arr = explode(",", $userData['designation']);
            $desjoin = false;
            foreach ($designation_arr as $des) {

                $dDetail = Designation::where('name',$des)->first();

                if ($dDetail) {
                    $idshave = $dDetail->id;
                    $condition_designation[] = '('.$tablePrefix.'jobs.designation LIKE "%' . $idshave . '%")';
                } else {
                    if ($des != '') {
                        $desjoin = true;
                        $condition_designation[] = "(".$tablePrefix."designations.name LIKE '%" . addslashes($des) . "%')";
                    }
                }
            }

            if($desjoin == true){
                $job = $job->crossJoin('designations');
            }

            $raw_condition_designation = implode(' OR ',$condition_designation);

            $job = $job->WhereRaw("( ".$raw_condition_designation." )");

        }


        if ($userData['work_type'] != '') {
            $worktype_arr = explode(",", $userData['work_type']);
            foreach ($worktype_arr as $work) {
                $condition_worktype[] = "(FIND_IN_SET('" . $work . "',".$tablePrefix."jobs.work_type))";
            }

            $raw_condition_worktype = implode(' OR ', $condition_worktype );
            
            $job = $job->WhereRaw("( ".$raw_condition_worktype." )");

        }


        // if ($userData['page'] != '') {
        //     $page = $userData['page'];
        // }
        if ($userData['sort'] != '') {
            $order = $userData['sort'];
        }

        $limit = 10;

        if (!isset($page)) {
            $page = 1;
            $limit = 99999999;
        }

        if (!isset($order)) {
            $job = $job->orderBy('jobs.created','DESC');
        }

        // $jobslist = $job->toSql();
        
        // print_r($jobslist);
     
        // if(!isset($page)){
            $jobslist = $job->get();
        // }

        $total_record = $job->count();


        $i = 0;
        
        $jobArray = array();
        
        foreach($jobslist as $job){
            
            $is_applied = 0;
            $is_saved = 0;
            
            if (isset($userId) && $userId > 0) {
                $apply_status = Job_apply::where('user_id', $userId)
                    ->where('job_id', $job->id)
                    ->first();
    
                if ($apply_status) {
                    $is_applied = 1;
                }
                
                $save_status = Short_list::where('short_lists.user_id', $userId)
                    ->join('jobs','short_lists.job_id','=','jobs.id')
                    ->where('short_lists.job_id', $job->id)
                    ->where('jobs.job_status', 0)
                    ->first();
    
                if ($save_status) {
                    $is_saved = 1;
                }
            }
            
            $jobIds = explode(',', $job->skill);
            
            $skillList = Skill::where('type', 'Skill')
                ->where('status', 1)
                ->pluck('name', 'id')
                ->toArray();
            
            $skills_array = array();
    
            if ($skillList) {
                foreach ($jobIds as $jid) {
                    if(isset($skillList[$jid]))
                    $skills_array[] = [
                        'id' => $jid,
                        'name' => $skillList[$jid]
                    ];
                }
            }
            
            if ($job->min_salary && $job->max_salary) {
                $salary = CURRENCY . ' ' . intval($job->min_salary) . " - " . CURRENCY . ' ' . intval($job->max_salary);
            } else {
                $salary = "N/A";
            }
                
            $jobArray[$i]['id'] = $job->id;
            $jobArray[$i]['title'] = $job->title;
            $jobArray[$i]['company_name'] = $job->company_name;
            $logo = '';
            if (file_exists(UPLOAD_JOB_LOGO_PATH.$job->logo) && $job->logo !='' ) {
                $logo = DISPLAY_JOB_LOGO_PATH.$job->logo;
            }

            $jobArray[$i]['logo'] = $logo;
            $jobArray[$i]['profile_image'] = "";

            $profile_image = User::where('id',$job->user_id)->pluck('profile_image')->implode(',');

            if(file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH.$profile_image) && $profile_image != '')
                $jobArray[$i]['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$profile_image;

            $jobArray[$i]['location'] = $job->job_city;
            $jobArray[$i]['date'] = date('F j, Y', strtotime($job->created));
            $jobArray[$i]['is_applied'] = $is_applied;
            $jobArray[$i]['is_saved'] = $is_saved;
            $jobArray[$i]['skill'] = $skills_array;
            $jobArray[$i]['salary'] = $salary;
            
            $i++;
        }

        $data = array();
        $data['total_records'] = $total_record;
        $data['job_array'] = $jobArray;

        echo $this->successOutputResult('Job List', $data);
        exit;
    }

    public function apps_deleteaccount() {

        $tokenData = $this->requestAuthentication('GET', 1);
        $userId = $tokenData['user_id'];
        $user = User::whereId($userId);

        if($user->count() > 0 ){
            $user->delete();
            echo $this->successOutput('Your Account has been deleted successfully.');
        }
        exit;
    }

    public function apps_getconstant() {

        $tokenData = $this->requestAuthentication('GET', 0);

        $worktype = $GLOBALS['worktype'];
        $experienceArray = $GLOBALS['experienceArray'];
        $sallery = $GLOBALS['sallery'];
        $totalexperienceArray = $GLOBALS['totalexperienceArray'];
        $data = array();
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
        echo $this->successOutputResult('Conatnts', $data);
        exit;
    }

    // used web api
    public function apps_applyforjob(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];

        // $isAbleToJob = (new Plan)->checkPlanFeature($user_id, 4);
        // if($isAbleToJob['status'] == 0){
        //     echo $this->errorOutput($isAbleToJob['message']);
        //     exit;
        // }

        $userData = $request->all();
        $job_id = $userData['jobid'];
        // $cover_letter = $userData['cover_letter'];

        $jobApplay = new Job_apply;
        // $jobApplay->user_plan_id = $isAbleToJob['user_plan_id'];
        $jobApplay->user_plan_id = 27;
        $jobApplay->new_status = 1;
        $jobApplay->status = 1;
        $jobApplay->apply_status = 'active';
        $jobApplay->user_id = $user_id;
        $jobApplay->job_id = $job_id;
        // $jobApplay->cover_letter_id = $cover_letter;

        if(!empty($request->cover_letter)){
            $jobApplay->cover_letter_id = $request->cover_letter;
        }else{
            $jobApplay->cover_letter_id = '0';
        }

        $jobApplay->attachment_ids = '';

        if($jobApplay->save()){
            $userInfo = User::where('id',$user_id)->first();
            $jobInfo = Job::where('id',$job_id)->first();
            $recruiterInfo = User::where('id',$jobInfo->user_id)->first();

            $cat_slug = Category::where('id',$jobInfo->category_id)->pluck('slug')->implode(',');

            $jobTitle = $jobInfo->title;
            $email = $userInfo->email_address;
            $userName = ucfirst($userInfo->first_name);

            $currentYear = date('Y', time());
            $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

            $emailTemplate = Emailtemplate::where('id',15)->first();

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

            $link = HTTP_PATH . "/" . $cat_slug . '/' . $jobInfo->slug . '.html';

            $toSubArray = array('[!username!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!activelink!]');

            $fromRepArray = array($userName, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $link);

            $emailSubject = str_replace($toSubArray, $fromRepArray, $template_subject);
            $emailBody = str_replace($toSubArray, $fromRepArray, $template_body);

            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

            $recruiterEmail = $recruiterInfo->email_address;
            $recruiterName = ucfirst($recruiterInfo->first_name);

            $email = $recruiterEmail;

            $emailTemplate = Emailtemplate::where('id',16)->first();

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

            $link = HTTP_PATH . "/candidates/profile/" . $userInfo->slug;

            $currentYear = date('Y', time());

            $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';


            $toRepArray = array('[!username!]', '[!job_title!]', '[!jobseeker_name!]', '[!jobseeker_email!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!activelink!]');

            $fromRepArray = array($recruiterName, $jobTitle, $userName, $email, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $link);

            $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
            $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);

            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

            echo $this->successOutput('Your job application is successfully posted. We will contact you soon.');
            exit;

        }

    }

    public function apps_changeprofilepic(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        $UseroldImage = User::where('id',$userId)
        ->select('profile_image','slug')
        ->first();

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

            echo $this->successOutput('Your Image has been Uploaded successfully.');
        }
        
        exit;
    }
    
    public function apps_savecoverletter(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $userData = $request->all();

        $cover_id = $userData['id'];
        $title = $userData['title'];
        $description = $userData['description'];
        if ($cover_id) {
            if ($title && $description) {
                Cover_letter::where('id',$cover_id)
                ->update([
                    'user_id' => $user_id,
                    'title' => $title,
                    'description' => $description,
                ]); 

                $msg = "Cover Letter saved successfully";

            } else {
                $msg = "Cover Letter deleted successfully";
                Cover_letter::where('id',$cover_id)->delete();
            }

            $coverLetters = Cover_letter::where('user_id',$user_id)
            ->orderBy('id','DESC')
            ->get();

            $clArray = array();
            if ($coverLetters) {
                foreach ($coverLetters as $coverLetter) {
                    $clArray[] = array('id' => $coverLetter->id, 'title' => $coverLetter->title, 'description' => $coverLetter->description);
                }
            }
            $data['coverletter'] = $clArray;
            echo $this->successOutputResult($msg,$data);
            exit;
        } else {
            $msg = "Cover Letter saved successfully";

            $CoverLetter = new Cover_letter;
            $CoverLetter->user_id = $user_id;
            $CoverLetter->title = $title;
            $CoverLetter->description = $description;

            if($CoverLetter->save()){
                $coverLetters = Cover_letter::where('user_id',$user_id)
                ->orderBy('id','DESC')
                ->get();

                $clArray = array();
                if ($coverLetters) {
                    foreach ($coverLetters as $coverLetter) {
                        $clArray[] = array('id' => $coverLetter->id, 'title' => $coverLetter->title, 'description' => $coverLetter->description);
                    }
                }
                $data['coverletter'] = $clArray;
                echo $this->successOutputResult($msg,$data);
                exit;
            }
        }
    }
  
    public function apps_saveAlert(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];

        $userData = $request->all();
        $location = $userData['location'];
        $designation = $userData['designation'];

        $alert = new Alert;
        $alert->status = 1;
        $alert->slug = 'ALERT' . time() . rand(10000, 999999);
        $alert->user_id = $user_id;
        $alert->designation = $designation;
        $alert->location = $location;
        if($alert->save()){
            echo $this->successOutput('Alert saved. You will receive an alert when jobs are created and match your criteria.');
            exit;
        }
    }

    public function apps_updateAlert(Request $request) {
        $this->layout = '';
        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];
        $userData = $request->all();
        $location = $userData['location'];
        $alert_id = $userData['id'];
        $designation = $userData['designation'];

        $alert = Alert::find($alert_id);
        $alert->status = 1;
        $alert->user_id = $user_id;
        $alert->designation = $designation;
        $alert->location = $location;
        if($alert->save()){
            echo $this->successOutput('Alert saved. You will receive an alert when jobs are created and match your criteria.');
            exit;
        }
    }

    public function apps_deleteAlert(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userData = $request->all();
        $user_id = $tokenData['user_id'];

        Alert::where('id',$userData['id'])->delete();

        $alerts = Alert::where('status',1)
        ->where('user_id',$user_id)
        ->get();

        $data = array();
        $alertArray = array();
        $i = 0;
        foreach ($alerts as $key => $alert) {

            $designation = Skill::where('id',$alert->designation)
            ->where('type','Designation')
            ->select('name')
            ->first();

            $alertArray[$i]['id'] = $alert->id;
            $alertArray[$i]['user_id'] = $alert->user_id;
            $alertArray[$i]['designation'] = $alert->designation;
            $alertArray[$i]['name'] = $designation;
            $alertArray[$i]['location'] = $alert->location;
            $alertArray[$i]['date'] = date('F j, Y', strtotime($alert->created));
            $i++;
        }
        echo $this->successOutputResult('Job Alert deleted successfully', $alertArray);
        exit;
    }

    public function apps_getAlertList(Request $request) {

        $tokenData = $this->requestAuthentication('GET', 1);
        $user_id = $tokenData['user_id'];

        $alerts = Alert::where('status',1)
        ->where('user_id',$user_id)
        ->get();

        $data = array();
        $alertArray = array();
        $i = 0;
        foreach ($alerts as $key => $alert) {
            
            $designation = Skill::where('id',$alert->designation)
            ->where('type','Designation')
            ->select('name')
            ->first();
            
            if($designation){
               $desName = $designation->name;
            }else{
               $desName = '' ;
            }

            $alertArray[$i]['id'] = $alert->id;
            $alertArray[$i]['user_id'] = $alert->user_id;
            $alertArray[$i]['designation'] = $alert->designation;
            $alertArray[$i]['name'] = $desName ;
            $alertArray[$i]['location'] = $alert->location;
            $alertArray[$i]['date'] = date('F j, Y', strtotime($alert->created));
            $i++;
        }

        echo $this->successOutputResult('Save Alert List', $alertArray);
        exit;
    }

    public function apps_getDesignationList() {

        $tokenData = $this->requestAuthentication('GET', 1);
        // $user_id = $tokenData['user_id'];

        $designationlList = Skill::where('type','Designation')
        ->where('status',1)
        ->select('id','name')
        ->get();
        $data = array();
        $designationArray = array();
        $i = 0;
        foreach ($designationlList as $key => $designation) {
            $designationArray[$i]['id'] = $designation->id;
            $designationArray[$i]['name'] = $designation->name;

            $i++;
        }

        echo $this->successOutputResult('Get Designation List', $designationArray);
        exit;
    }
    
    public function apps_getcategorylist() {
        $tokenData = $this->requestAuthentication('GET', 0);

        $categories = (new Category)->getCategoryList();
        // $data = array();
        // $catArray = array();
        // $i = 0;
        // foreach ($categories as $key => $val) {
        //     $catArray[$i]['id'] = $key;
        //     $catArray[$i]['val'] = $val;
        //     $i++;
        // }
        echo $this->successOutputResult('Category List', $categories);
        exit;
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

        ]);

        if ($validator->fails()) {
            $msg = $validator->errors();
            echo $this->errorOutputResult($msg);
            exit;
        }else{


            $emailAddress = $userData['email_address'];
            $device_type = $userData['device_type'];
            $device_id = $userData['device_id'];

        if ($userData['login_type'] == 'facebook') {
            $userCheck = User::whereNotNull('facebook_user_id')->where('email_address',$emailAddress)
            ->first();
        }else if ($userData['login_type'] == 'linkedin') {
            $userCheck = User::whereNotNull('linkedin_id')->where('email_address',$emailAddress)
            ->first();
        }else if ($userData['login_type'] == 'google') {
            $userCheck = User::whereNotNull('google_id')->where('email_address',$emailAddress)
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
                $new_password = crypt($passwordPlain, '$2a$07$' . $salt . '$');

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
                $user->user_type = 'candidate';

                if($user->save()){

                    $userCheck = User::where('email_address',$request->email_address)->first();
                    $userId=$user->id;

                    $email = $request->email_address;
                    $username = $request->first_name;


                    $link = HTTP_PATH . "/users/confirmation/" . $userId . "/" . md5($userId) . "/" . urlencode($email);

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

    public function apps_editprofile(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        $userData = $request->all();

        $user = User::find($userId);
        $user->company_about = $userData['aboutme'];
        $user->address = $userData['address'];
        $user->contact = $userData['contact'];
        $user->exp_salary = $userData['exp_salary'];
        $user->first_name = $userData['first_name'];
        $user->last_name = $userData['last_name'];
        $user->location = $userData['location'];
        $user->work_exp = $userData['work_exp'];
        if ($userData['gender'] == 'Male') {
            $user->gender = 0;
        } else {
            $user->gender = 1;
        }
        $user->profile_update_status = 1;

        if($user->save()){
            echo $this->successOutput('Profile details updated successfully.');
        }
        exit;
    }
    
    // used web api
    public function apps_savejob(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];

        $userData = $request->all();
        $job_id = $userData['id'];

        $checkStatus = Short_list::where('user_id',$user_id)
        ->where('job_id',$job_id)
        ->first();

        if (!empty($checkStatus)) {
            echo $this->errorOutputResult('You already saved this job.');
            exit;
        }

        Short_list::insert([
            'status' => 1,
            'user_id' => $user_id,
            'job_id' => $job_id,
            'created' => now(),
            'modified' => now()
        ]);

        echo $this->successOutput('Job added in saved Jobs list');
        exit;
    }
    
    public function apps_generatecv():Response {

        $tokenData = $this->requestAuthentication('GET', 1);
        $user_id = $tokenData['user_id'];

        $userdetail = User::find($user_id);

        $name = ucfirst($userdetail->first_name) . '_' . $userdetail->last_name . '_CV';

        $date = date('m/d/Y');
        $firstLast = $userdetail->first_name . ' ' . $userdetail->last_name;
        $profile_image = '';
        $profile_image1 = '';
        $address = '';
        $address1 = '';
        $address2 = '';
        $contact = $userdetail->contact;
        $contact = sprintf("%s-%s-%s", substr($contact, 0, 3), substr($contact, 3, 3), substr($contact, 6));
        $email_address = $userdetail->email_address;

        if ($userdetail->location) {
            $address = "<tr><td style='font-size: 10px;'>Address: " . $userdetail->location . "</td></tr>";
            $address1 = '<td style="text-align: right;font-size: 10px;">Address: ' . $userdetail->location . '</td>';
            $address2 = '<td style="text-align: right;">Address: ' . $userdetail->location . '</td>';
        }

        if ($userdetail->profile_image != "") {
            $profile_image = $address;
        }

        if ($userdetail->contact) {
            $contact_str = "<tr> <td style='font-size: 10px;'>" . $contact . "</td></tr>";
        }else{
            $contact_str = "<tr> <td style='font-size: 10px;'>N/A</td></tr>";

        }


        $profile_image_url = DISPLAY_THUMB_PROFILE_IMAGE_PATH . $userdetail->profile_image;

        if ($userdetail->profile_image == "") {
            $string = $addresss1;
        } else {
            $path = UPLOAD_FULL_PROFILE_IMAGE_PATH . $userdetail->profile_image;

            if (file_exists($path) && !empty($userdetail->profile_image)) {
                $string = "<td style='text-align: right;'><img src='$profile_image_url' style='width:80px;height:80px;' rel = 'nofollow'></td>";
            } else {
                $string = $address2;
            }
        }

        $userEducation = Education::where('user_id',$user_id)->get();


        $Education = '';
        foreach ($userEducation as $education) {
            $couses[] = $education->basic_course_id;
            $Education .= '<tr><td style="line-height: 15px;font-size: 9px;" colspan="2">• I have Passed';

            $courseName = Course::where('id',$education->basic_course_id)
            ->select('name')
            ->first();

            $Education .= ' ' . $courseName->name;
            $Education .= " in ";

            if (isset($education->basic_year)) {
                $Education .= $education->basic_year;
            } else {
                $Education .= 'N/A';
            }

            $Education .= " in ";

            $specialization = Specialization::where('id',$education->basic_specialization_id)
            ->select('name')
            ->first();
            
            if($specialization){
                $Education .= $specialization->name;
                $Education .= " from ";
            }

            if (isset($education->basic_university)) {
                $Education .= $education->basic_university;
            } else {
                $Education .= 'N/A';
            }
            $Education .= ".</td></tr>";

        }

        $userExperience = Experience::where('user_id',$user_id)->get();

        $Experience = '';
        foreach ($userExperience as $experience) {
            $Experience .= '<tr><td style="line-height: 15px;font-size: 9px;" colspan="2">• I have worked as a ';

            if ($experience->role != '') {
                $Experience .= $experience->role;
            } else {
                $Experience .= 'N/A';
            }
            if ($experience->designation != "" ) {
                $Experience .= ' ' . $experience->designation;
            } else {
                $Experience .= ' ' . 'N/A';
            }
            $Experience .= " for ";
            $Experience .= $experience->company_name;
            $Experience .= " since ";
            if($experience->from_month != '' && $experience->from_year != '' && $experience->to_month != '' && $experience->to_year != '') {

                // $experience['from_month'] == 1;
                switch ($experience->from_month) {
                    case "1":
                        $fromName = 'Jan';
                        break;
                    case "2":
                        $fromName = 'Feb';
                        break;
                    case "3":
                        $fromName = 'Mar';
                        break;
                    case "4":
                        $fromName = 'Apr';
                        break;
                    case "5":
                        $fromName = 'May';
                        break;
                    case "6":
                        $fromName = 'June';
                        break;
                    case "7":
                        $fromName = 'Jul';
                        break;
                    case "8":
                        $fromName = 'Aug';
                        break;
                    case "9":
                        $fromName = 'Sept';
                        break;
                    case "10":
                        $fromName = 'Oct';
                        break;
                    case "11":
                        $fromName = 'Nov';
                        break;
                    case "12":
                        $fromName = 'Dec';
                        break;
                    default:
                        $fromName = 'N/A';
                }

                // $experience['to_month'] == 1;
                switch ($experience->to_month) {
                    case "1":
                        $toName = 'Jan';
                        break;
                    case "2":
                        $toName = 'Feb';
                        break;
                    case "3":
                        $toName = 'Mar';
                        break;
                    case "4":
                        $toName = 'Apr';
                        break;
                    case "5":
                        $toName = 'May';
                        break;
                    case "6":
                        $toName = 'June';
                        break;
                    case "7":
                        $toName = 'Jul';
                        break;
                    case "8":
                        $toName = 'Aug';
                        break;
                    case "9":
                        $toName = 'Sept';
                        break;
                    case "10":
                        $toName = 'Oct';
                        break;
                    case "11":
                        $toName = 'Nov';
                        break;
                    case "12":
                        $toName = 'Dec';
                        break;
                    default:
                        $toName = 'N/A';
                }

                $Experience .= $fromName . '-' . $experience->from_year . ' to ' . $toName . '-' . $experience->to_year;
            } else {
                $Experience .= 'N/A';
            }
            $Experience .= "<br>
                <table>";
            if ($experience->industry != "") {
                $Experience .= '<tr><td style="line-height: 15px;font-size: 9px;" colspan="2"><label style="font-weight: bold">Industry: </label> ' . $experience->industry . ' </td></tr>';
            }
            if ($experience->functional_area != "") {
                $Experience .= '<tr><td style="line-height: 15px;font-size: 9px;" colspan="2"><label style="font-weight: bold">Functional area: </label> ' . $experience->functional_area . ' </td></tr>';
            }
            if ($experience->role != "") {
                $Experience .= '<tr><td style="line-height: 15px;font-size: 9px;" colspan="2"><label style="font-weight: bold">Role: </label> ' . $experience->role . ' </td></tr>';
            }
            if ($experience->job_profile != "") {
                $Experience .= '<tr><td style="line-height: 15px;font-size: 9px;" colspan="2"><label style="font-weight: bold">Job profile: </label> ' . $experience->job_profile . ' </td></tr>';
            }
            $Experience .= "</table>
            </td>
            </tr>
            <tr> <td style='line-height: 5px;font-size: 12px;' colspan='2'> </td></tr>";
        }


        $template_html =
        '<table border="0" style="width:600px; font-size:8px; font-family:Open Sans">
            <tbody>
                <tr style="width:100%;">
                    <td style="width:10px;">&nbsp;</td>
                    <td style="width:560px;">
                        <table style="width:90%;">
                            <tr> <td style="line-height: 35px; width: 100%; text-align: center; font-size: 18px;" colspan="2">Curriculum Vitae (CV) </td></tr>
                        </table>
                        <table style="width:90%;">
                            <tr> <td style="line-height: 35px;" colspan="2"> </td></tr>
                            <tr>
                                <td>
                                    <table>
                                        <tr>
                                            <td style="font-size: 10px;font-weight: bold;">'.$firstLast.'</td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 10px;">'.$email_address.'</td>
                                        </tr>
                                        '.$contact_str.$profile_image.'
                                    </table>
                                </td>
                                    '.$string.'
                            </tr>     
                            <tr> <td style="line-height: 25px;font-size: 12px;border-bottom: 0px solid #333" colspan="2"> Education Qualification</td></tr>          
                            <tr> <td style="line-height: 5px;font-size: 12px;" colspan="2"> </td></tr>
                            '.$Education.'
                            <tr> <td style="line-height: 25px;font-size: 12px;" colspan="2"> </td></tr>
                            <tr> <td style="line-height: 24px;font-size: 12px;border-bottom: 0px solid #333" colspan="2"> Experience</td></tr>
                            <tr> <td style="line-height: 5px;font-size: 12px;" colspan="2"> </td></tr>
                            '.$Experience.'
                            <tr> <td style="line-height: 25px;font-size: 12px;" colspan="2"> </td></tr>
                            <tr><td><label style="font-weight: bold; font-size: 11px; text-align: left;">Date: '.$date.'</label></td><td><label style="text-align: right;font-size: 11px;font-weight: bold">Signature</label></td></tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>';


        $dompdf = new Dompdf();

        $dompdf->loadHtml($template_html);
        $dompdf->setPaper('A4', 'portrait');

        $dompdf->render();
        
        $pdfContent = $dompdf->output();
        
        $pdfPath = UPLOAD_RESUME_PATH. $name . '.pdf';
        
        file_put_contents($pdfPath, $pdfContent);
        
        $data['resume_path'] = DISPLAY_RESUME_PATH . $name . '.pdf';
    
        
        // echo $this->successOutputResult('Your CV have been generated successfully', $data);
        // exit;
        
        return Response(['response'=>$data , 'message'=>'Your CV have been generated successfully' ,'status' => 200 ]);
        
        // $response = new Response($pdfContent);
        // $response->header('Content-Type', 'application/pdf');
        // $response->header('Content-Disposition', 'attachment; filename="'.$name.'.pdf"');

        // return $response;

        // return $dompdf->stream($name.'.pdf');

    }

    public function generatecvdoc():Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $user_id = $tokenData['user_id'];

        $userdetail = User::find($user_id);

        $filename = ucfirst($userdetail->first_name) . '_' . $userdetail->last_name . '_CV';

        $username = ucwords($userdetail->first_name . ' ' . $userdetail->last_name);

        $path = UPLOAD_FULL_PROFILE_IMAGE_PATH . $userdetail->profile_image;
        if (file_exists($path) && !empty($userdetail->profile_image)) {
            $logoPath = DISPLAY_FULL_PROFILE_IMAGE_PATH . $userdetail->profile_image;
        } else {
            $logoPath = HTTP_IMAGE . '/front/no_image_user.png';
        }

        $phpWord = new \PhpOffice\PhpWord\PhpWord();
        $cellRowSpan = array('vMerge' => 'restart');
        $cellRowContinue = array('vMerge' => 'continue');
        $cellColSpan = array('gridSpan' => 2);

        $textLeft = array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT, 'spaceAfter' => 4);
        $textRight = array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::RIGHT, 'spaceAfter' => 4);
        $textCenter = array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 4);
        $textJustify = array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::BOTH, 'spaceAfter' => 4);

        $txLeftb4space = array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT, 'spaceAfter' => 4); // 'spaceBefore'=>2
        $txJustifyb4space = array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::BOTH, 'spaceAfter' => 4); //, 'spaceBefore'=>2

        $listStyleEmptyBullet = array('listType' => \PhpOffice\PhpWord\Style\ListItem::TYPE_BULLET_EMPTY);
        $listStyleNumber = array('listType' => \PhpOffice\PhpWord\Style\ListItem::TYPE_NUMBER);

        $fbkbold11 = array('size' => 11, 'bold' => true, 'color' => '000000');
        $fbrnbold11 = array('size' => 11, 'bold' => true, 'color' => '6d0a13');
        $lightbold10 = array('size' => 10, 'bold' => true, 'color' => '0b0a0a');
        $fbkbold10 = array('size' => 10, 'bold' => true); //'color'=>'565555'
        $fbknormal10 = array('size' => 11); //, 'color'=>'565555'
        $fbrnbold10 = array('size' => 10, 'bold' => true, 'color' => '0c0303');

        $linespace = array('alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT, 'spaceAfter' => 0);

        $section = $phpWord->addSection();
        $table = $section->addTable(array('align' => 'left'));

        $table->addRow();
        $table->addCell(2500, array())->addText('Name and surname' . " : ", array('size' => 11, 'bold' => true));
        $table->addCell(5800, array())->addText($username, array('size' => 11, 'bold' => FALSE));
        $table->addCell(2000, $cellRowSpan)->addImage($logoPath, array('width' => '100', 'height' => '100'));
        $section->addText('');
        $table->addRow();
        $table->addCell(2500, array())->addText('Email Address' . " : ", array('size' => 11, 'bold' => true));
        $table->addCell(5800, array())->addText($userdetail->email_address, array('size' => 11, 'bold' => FALSE));
        $table->addCell(null, $cellRowContinue);
        $section->addText('');
        $table->addRow();
        $table->addCell(2500, array())->addText('Phone Number' . " : ", array('size' => 11, 'bold' => true));
        $table->addCell(5800, array())->addText($userdetail->contact, array('size' => 11, 'bold' => FALSE));
        $table->addCell(null, $cellRowContinue);
        $section->addText('');
        $table->addRow();
        $table->addCell(2500, array())->addText('Address' . " : ", array('size' => 11, 'bold' => true));
        $table->addCell(5800, array())->addText($userdetail->location, array('size' => 11, 'bold' => FALSE));
        $table->addCell(null, $cellRowContinue);
        $table = $section->addTable(array('spaceAfter' => 5));
        $table->addRow();
        $table->addCell(8000, array('gridSpan' => 2))->addText(strtoupper('Experience'), array('size' => 11, 'bold' => true));

        $userExperience = Experience::where('user_id',$user_id)->get();
        $total_records = Experience::where('user_id',$user_id)->count();

        $total_records = count($userdetail['Experience']);
        foreach ($userExperience as $key => $experience) {
            if ($experience->from_month != '' && $experience->from_year != '' && $experience->to_month != '' && $experience->to_year != '' ) {

                // $experience['from_month'] == 1;
                switch ($experience['from_month']) {
                    case "1":
                        $fromName = 'January';
                        break;
                    case "2":
                        $fromName = 'Febuary';
                        break;
                    case "3":
                        $fromName = 'March';
                        break;
                    case "4":
                        $fromName = 'April';
                        break;
                    case "5":
                        $fromName = 'May';
                        break;
                    case "6":
                        $fromName = 'June';
                        break;
                    case "7":
                        $fromName = 'July';
                        break;
                    case "8":
                        $fromName = 'August';
                        break;
                    case "9":
                        $fromName = 'September';
                        break;
                    case "10":
                        $fromName = 'October';
                        break;
                    case "11":
                        $fromName = 'November';
                        break;
                    case "12":
                        $fromName = 'Decemeber';
                        break;
                    default:
                        $fromName = 'N/A';
                }

                // $experience['to_month'] == 1;
                switch ($experience['to_month']) {
                    case "1":
                        $toName = 'January';
                        break;
                    case "2":
                        $toName = 'Febuary';
                        break;
                    case "3":
                        $toName = 'March';
                        break;
                    case "4":
                        $toName = 'April';
                        break;
                    case "5":
                        $toName = 'May';
                        break;
                    case "6":
                        $toName = 'June';
                        break;
                    case "7":
                        $toName = 'July';
                        break;
                    case "8":
                        $toName = 'August';
                        break;
                    case "9":
                        $toName = 'September';
                        break;
                    case "10":
                        $toName = 'October';
                        break;
                    case "11":
                        $toName = 'November';
                        break;
                    case "12":
                        $toName = 'Decemeber';
                        break;
                    default:
                        $toName = 'N/A';
                }

                $exp_name = $fromName . '-' . $experience->from_year . ' ' . ('to') . ' ' . $toName . '-' . $experience->to_year . ' - ' . $experience->company_name;
            } else {
                $exp_name = 'N/A';
            }

            $section->addText('');
            $table->addRow();
            $table->addCell(450);
            $table->addCell(8000)->addText($exp_name, array('size' => 11), $txLeftb4space);
            $table->addRow();
            $table->addCell(450);
            $table->addCell(8000)->addText($experience['role'], array('size' => 11));
            $table->addRow();
            $table->addCell(450);
            $table->addCell(8000)->addText($experience['job_profile'], array('size' => 11));
            if (($key + 1) != $total_records) {
                $table->addRow();
                $table->addCell(8000, array('gridSpan' => 2));
            }
        }

        $table = $section->addTable(array('spaceAfter' => 5));
        $table->addRow();

        $table->addCell(8000, array('gridSpan' => 2))->addText(strtoupper('Education Specialization'), array('size' => 11, 'bold' => true));

        $userEducation = Education::where('user_id',$user_id)->get();
        $total_records = Education::where('user_id',$user_id)->count();

        foreach ($userEducation as $key => $education) {
            $couses[] = $education->basic_course_id;

            $section->addText('');

            $table->addRow();
            $table->addCell(400);
            $table->addCell(8000)->addText($education->basic_year . ' – ' . $education->basic_university, array('size' => 11));

            $specialization = Specialization::where('id',$education->basic_specialization_id)
            ->select('name')
            ->first();
            
            if($specialization){
                $speName = $specialization->name;
            }else{
                $speName ='';
            }

            $table->addRow();
            $table->addCell(400);
            $table->addCell(8000)->addText($speName, array('size' => 11));
            if (($key + 1) != $total_records) {
                $table->addRow();
                $table->addCell(8000, array('gridSpan' => 2));
            }
        }

        $table = $section->addTable(array('spaceAfter' => 5));
        $table->addRow();
        
        $table->addCell(6000)->addText(strtoupper('Skills'), array('size' => 11, 'bold' => true));

        if (isset($userdetail->skills) && !empty($userdetail->skills)) {
            $experiences = explode(',', $userdetail->skills);
            $total_records = count($experiences);
            foreach ($experiences as $key => $experience) {
                $section->addText('');
                $table->addRow();
                $table->addCell(6000, array())->addListItem($experience, 0, $fbknormal10, $listStyleEmptyBullet);
            }
        }

        $tempFilePath = UPLOAD_CV_PATH.$filename.".docx";
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save($tempFilePath);
        
        $data['resume_path'] = DISPLAY_CV_PATH . $filename . '.docx';
        
        return Response(['response'=>$data,'message'=>'Your CV have been generated successfully','status'=>200]);
        
        // echo $this->successOutputResult(, $data);
        // exit;

        // Download the file and delete it afterward
        // return response()->download($tempFilePath,$filename.".docx")->deleteFileAfterSend(true);

    }
    
    public function apps_savecvdocument1(Request $request) {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        // $UseroldImage = User::where('id',$userId)
        // ->select('profile_image','slug')
        // ->first();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // $fileName = $file->getClientOriginalName();

            $fileContent = file_get_contents($file->getRealPath());

                $extentions = $GLOBALS['extentions'];
                $extentions_doc = $GLOBALS['extentions_doc'];
                $fileContent = file_get_contents($file->getRealPath());
                $extension = $file->getClientOriginalExtension();
            
                $fileName = Str::random(10).'.'.$extension;
                $customStoragePath = UPLOAD_CERTIFICATE_PATH . $fileName;
                file_put_contents($customStoragePath, $fileContent);
                $image = $fileName;

             $certificate = new Certificate;
              if (in_array($extension, $extentions)) {
                    $certificate->type = 'image';
                    $certificate->slug = 'image-' . $userId . time() . rand(111, 99999);
                } elseif (in_array($extension, $extentions_doc)) {
                    $certificate->type = 'doc';
                    $certificate->slug = 'doc-' . $userId . time() . rand(111, 99999);
                }
                
             if($image){
                    $certificate->document = $fileName;
                    $certificate->user_id = $userId;
                    $certificate->created = now();
                    $certificate->save();
                        $id = $certificate->id;
                        $docInfo = Certificate::where('user_id',$userId)->get();
                        
                        $docArray = array();
                        
                        foreach($docInfo as $key => $doc){
                            
                            $docArray[$key]['id'] = $doc->id;
                            if(file_exists(UPLOAD_CERTIFICATE_PATH.$doc->document) && $doc->document != ''){
                                $docArray[$key]['document'] = DISPLAY_CERTIFICATE_PATH.$doc->document;
                            }else{
                                $docArray[$key]['document'] = '';
                            }
                            $docArray[$key]['type'] = $doc->type;
                            $docArray[$key]['slug'] = $doc->slug;

                        }

                        echo $this->successOutputResult('Document saved successfully.',$docArray);
                        exit;
             }
             else{
                 echo $this->errorOutputResult('image not uploaded');
                    exit;
             }
        }
        else{
            echo $this->errorOutputResult('Must be file');
                exit;
        }
    }

    public function apps_savecvdocument(Request $request) {

      

        $tokenData = $this->requestAuthentication('POST', 1);

        $userId = $tokenData['user_id'];
        $user_id = $tokenData['user_id'];

        $userData = $request->all();
        //$doc_id = isset($userData['id']) ? $userData['id'] :'';

        // if($doc_id != ''){
        //     $docInfo = Certificate::where('id',$doc_id)->first();
        //     $doc = $docInfo->document;
        //     Certificate::where('id',$doc_id)->delete();
        //     @unlink(UPLOAD_CERTIFICATE_PATH.$doc);
        //     echo $this->successOutput('Document deleted successfully.');
        //     exit;
        // }else{

            $input = $request->all();
            $rules = array(
                'image' => 'required',
                'type' => 'required',

            );
            $validator = Validator::make($request->all(),$rules);

            $validator->setAttributeNames([
                'image' => 'Document',
                'type' => 'Document type',

            ]);

        if ($validator->fails()) {
            $msg = $validator->errors();
            echo $this->errorOutputResult($msg);
            exit;
        }else{

            if($request->hasFile('image')) {
                $file = $request->file('image');
                // $fileName = $file->getClientOriginalName();

              //  echo 'apps_savecvdocument called';
               // echo '<pre>file';print_r($file);exit;

                $extentions = $GLOBALS['extentions'];
                $extentions_doc = $GLOBALS['extentions_doc'];
                $fileContent = file_get_contents($file->getRealPath());
                $extension = $file->getClientOriginalExtension();

                // if (in_array($extension, $extentions)) {
                //     $fileName = Str::random(10).'.'.$extension;
                //     $customStoragePath = UPLOAD_CERTIFICATE_PATH . $fileName;
                //     file_put_contents($customStoragePath, $fileContent);
                //     $image = $fileName;
                // } elseif (in_array($extension, $extentions_doc)) {
                //     $fileName = Str::random(10).'.'.$extension;
                //     $customStoragePath = UPLOAD_CERTIFICATE_PATH . $fileName;
                //     file_put_contents($customStoragePath, $fileContent);
                //     $image = $fileName;
                // }

                $fileName = Str::random(10).'.'.$extension;
                $customStoragePath = UPLOAD_CERTIFICATE_PATH . $fileName;
                file_put_contents($customStoragePath, $fileContent);
                $image = $fileName;


                $certificate = new Certificate;

                    $certificate->type =$request->type;
                    $certificate->slug = $request->type . $user_id . time() . rand(111, 99999);

                // if (in_array($extension, $extentions)) {
                //     $certificate->type = 'image';
                //     $certificate->slug = 'image-' . $user_id . time() . rand(111, 99999);

                // } elseif (in_array($extension, $extentions_doc)) {
                //     $certificate->type = 'doc';
                //     $certificate->slug = 'doc-' . $user_id . time() . rand(111, 99999);
                // }

                if($image) {
                    $certificate->document = $image;
                    $certificate->user_id = $user_id;
                    $certificate->created = now();
                    $certificate->save();
                        $id = $certificate->id;
                        $docInfo = Certificate::where('user_id',$user_id)->get();
                        
                        $docArray = array();
                        
                        foreach($docInfo as $key => $doc){
                            
                            $docArray[$key]['id'] = $doc->id;
                            if(file_exists(UPLOAD_CERTIFICATE_PATH.$doc->document) && $doc->document != ''){
                                $docArray[$key]['document'] = DISPLAY_CERTIFICATE_PATH.$doc->document;
                            }else{
                                $docArray[$key]['document'] = '';
                            }
                            $docArray[$key]['type'] = $doc->type;
                            $docArray[$key]['slug'] = $doc->slug;

                        }

                        echo $this->successOutputResult('Document saved successfully.',$docArray);
                        exit;

                        

                }else{
                    
                    echo $this->errorOutputResult('image not uploaded');
                    exit;
                }
    
            }else{
               
                echo $this->errorOutputResult('Must be file');
                exit;
            }

        }
        exit;
        
    }
    public function apps_deletedocument(Request $request ) {
                
        $tokenData = $this->requestAuthentication('POST', 1);
        $userData = $request->all();

        $userId = $tokenData['user_id'];

        $rules = array(
            'doc_id' => 'required',
        );
        $validator = Validator::make($request->all(),$rules);

        $validator->setAttributeNames([
            'doc_id' => 'document',
        ]);

        if ($validator->fails()) {
            $msg = $validator->errors();
            echo $this->errorOutputResult($msg);
            exit;
        }else{

            $doc_id=$request->doc_id;

                $certificate = Certificate::where('id',$doc_id)
                ->select('document','id')->first();

            if ($certificate != '') {
                Certificate::where('id',$certificate->id)->delete();

                @unlink(UPLOAD_CERTIFICATE_PATH . $certificate->document);
                echo $this->successOutput('Certificate deleted successfully');

            }else{
                echo $this->errorOutputResult('Not found');
            }
        }

        exit;
    }



    public function apps_purchaseplan(Request $request) {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userData = $request->all();

        $userId = $tokenData['user_id'];

        $input = $request->all();
        $userData = $request->all();

        $rules = array(
            'plan_id' => 'required',
            'transaction_id' => 'required',
        );
        $validator = Validator::make($request->all(),$rules);

        $validator->setAttributeNames([
            'plan_id' => 'Plan',
            'transaction_id' => 'Transaction ID',
        ]);

        if ($validator->fails()) {
            $msg = $validator->errors();
            echo $this->errorOutputResult($msg);
            exit;
        }else{


        $planId = $request->plan_id;
        $transactionId = $request->transaction_id;
        $aplimp = $request->aplimp;

        if(isset($request->device_type) && ($request->device_type == 'iphone'))
        {
            $applie_plan_id = $request->applie_plan_id;
            $planInfo = Plan::where('applie_plan_id',$applie_plan_id)->first();
          //  echo $this->errorOutput('1');
           // exit;
        }else{
            $planInfo = Plan::where('id',$planId)
            ->whereOr('plan_name',$planId)
            ->first();
          //  echo $this->errorOutput('2');
           // exit;
        }


        if(empty($planInfo)){
            echo $this->errorOutput('There is no such plan found.');
            exit;
        }

        $payment = new Payment;
        $payment_number = 'pay-' . date('Ymd') . time();
        $payment->user_id = $userId;
        $payment->payment_number = $payment_number;
        $payment->transaction_id = $transactionId;
        $payment->payment_status = 'completed';
        $payment->price = $planInfo->amount;
        $payment->plan_id = $planInfo->id;
        $payment->status = 0;
        $payment->slug = $payment_number . $userId;
        if ($aplimp) {
            $aplimp = 1;
        }
        $payment->aplimp = $aplimp;

        if($payment->save()){
            $payment_id = $payment->id;

            $paymentInfo = Payment::where('id',$payment_id)->first();

            $userInfo = User::where('id',$paymentInfo->user_id)->first();

            $planInfo = Plan::where('id',$paymentInfo->plan_id)->first();

            $email = $userInfo->email_address;
            $companyname = $userInfo->company_name;
            $name = $userInfo->first_name .' '. $userInfo->last_name;
            $planName = $planInfo->plan_name . ' Plan';
            $amount = CURR . ' ' . $planInfo->amount;
            $date = date('F d, Y h:i A');

            $userPlan = new User_plan;
            $userPlan->payment_id = $paymentInfo->id;
            $userPlan->user_id = $paymentInfo->user_id;
            $userPlan->plan_id = $paymentInfo->plan_id;
            $userPlan->features_ids = $planInfo->feature_ids;
            $userPlan->fvalues = $planInfo->fvalues;
            $userPlan->amount = $planInfo->amount;

            $lastPlan = User_plan::where('user_id',$paymentInfo->user_id)
            ->orderBy('id','DESC')
            ->first();

            // if($lastPlan){
            //     if($paymentInfo->aplimp){
            //         User_plan::where('id',$lastPlan->id)
            //         ->update([
            //             'is_expire' => 1
            //         ]);
            //         $sdate = date('Y-m-d');
            //     }else{
            //         $lastend_date = $lastPlan->end_date;
            //         $sdate = date('Y-m-d', strtotime($lastend_date . ' + 1 days'));
            //     }
            // }

            if($lastPlan){
                    User_plan::where('id',$lastPlan->id)
                    ->update([
                        'is_expire' => 1
                    ]);
            }
            $sdate = date('Y-m-d');

            $tpvalue = $planInfo->type_value;
            if ($planInfo->type == 'Months') {
                $edate = date('Y-m-d', strtotime($sdate . " + $tpvalue Months"));
            } else {
                $edate = date('Y-m-d', strtotime($sdate . " + $tpvalue Years"));
            }
            $tdate = date('Y-m-d');
            $userPlan->created = $tdate;
            $userPlan->start_date = $sdate;
            $userPlan->end_date = $edate;
            $userPlan->slug = 'uplan-' . $paymentInfo->user_id . time();

            $userPlan->save();

            $payinfo = '<p style="color:#434343; margin:10px 0 0;"><b>' . ('Plan Name') . ':</b> ' . $planName . '</p>';
            $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>' . ('Amount') . ':</b> ' . $amount . '</p>';
            $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>' . ('Transaction ID') . ':</b> ' . $transactionId . '</p>';
            $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>' . ('Date') . ':</b> ' . $date . '</p>';

            $currentYear = date('Y', time());

            $emailTemplate = Emailtemplate::where('id',41)->first();

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

            $toSubArray = array('[!username!]', '[!payinfo!]', '[!SITE_TITLE!]', '[!DATE!]');
            $fromSubArray = array($name, $payinfo, SITE_TITLE, $currentYear);
            $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
            $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

            $adminInfo = Admin::whereId(1)->first();

            $adminInfo->email;

            $emailTemplate = Emailtemplate::where('id',42)->first();

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

            $toSubArray = array('[!username!]', '[!SITE_TITLE!]', '[!DATE!]', '[!transactionId!]', '[!amountPaid!]', '[!company_name!]');
            $fromSubArray = array($name, SITE_TITLE, $date, $transactionId, $amount, $companyname);
            $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);

            $toRepArray = array('[!username!]', '[!payinfo!]', '[!SITE_TITLE!]', '[!DATE!]');
            $fromRepArray = array($name, $payinfo, SITE_TITLE, $date);
            $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);

            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
        }

        echo $this->successOutput('You have successfully completed payment for your membership plan.');

    }

        exit;
    }


    public function admin_applied(Request $request, $slug):Response {
        $getuser = User::where('slug',$slug)->first();
        $Blogs = Job_apply::where('user_id',$getuser->id)->orderBy('id','desc')->get();
        //$Blogs = Job_apply::orderBy('id','desc')->get();

        $data = array();

        $data['first_name'] = $getuser->first_name;
        $data['last_name'] = $getuser->last_name;

        // if ($request->filled('action')) {
        //     $idList = $request->idList;
        //     if ($idList) {
        //         if ($request->action == 'activate') {
        //             DB::table('job_applies')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
        //         } elseif ($request->action == 'deactivate') {
        //             DB::table('job_applies')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
        //         } elseif ($request->action == 'delete') {
        //             DB::table('job_applies')->whereIn('id', explode(',', $idList))->delete();
                   
        //         }
        //     }
        // } elseif ($request->filled('name')) {
        //     $name = urldecode(trim($request->name));
        // }
        $Blogsarray = array();

        foreach($Blogs as $key => $blog){
            $job = Job::where('id',$blog->job_id)->first();
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['job_id'] = $blog->job_id;

            if(isset($job->title)){
                $worktype = $GLOBALS['worktype'];
                $Blogsarray[$key]['jobtitle'] = $job->title;
                $Blogsarray[$key]['jobwork_type'] = $worktype[$job->work_type];
                $Blogsarray[$key]['job_slug'] = $job->slug;

            }else{
                $Blogsarray[$key]['jobtitle'] ='N/A';
                $Blogsarray[$key]['jobwork_type'] = 'N/A';
                $Blogsarray[$key]['job_slug'] = 'N/A';

            }
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
            $Blogsarray[$key]['apply_status'] = $blog->apply_status;
            $Blogsarray[$key]['new_status'] = $blog->new_status;
            $Blogsarray[$key]['first_name'] = $getuser->first_name;
            $Blogsarray[$key]['last_name'] = $getuser->last_name;


        }

        $data['candidates'] = $Blogsarray;

        return Response(['response' => $data ,'message' => 'success' ,'status' => 200 ],200);
    }

    public function admin_generatecsv(){

        return Excel::download(new ExportUsers, 'All_Candidates_'.time().'.xlsx');

    }
}
