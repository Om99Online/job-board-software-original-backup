<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Models\Job;
use App\Models\Category;
use App\Models\Location;
use App\Models\Skill;
use App\Models\Keyword;
use App\Models\Certificate;
use App\Models\Plan;
use App\Models\User;
use App\Models\Alert_location;
use App\Models\Alert_job;
use App\Models\Job_apply;
use App\Models\Short_list;
use App\Models\Feed;
use App\Models\Alert;
use App\Models\Cover_letter;

use App\Imports\ImportJobs;
use Maatwebsite\Excel\Facades\Excel;

use Session;
use Validator;
use App\Models\Admin;
use App\Models\Emailtemplate;
use Mail;
use App\Mail\SendMailable;
use DateTime;

class JobsController extends Controller
{
    public function listing(Request $request, $categorySlug = ''):Response {

        // $tokenData = $this->requestAuthentication('POST', 2);

        // if(isset($tokenData['user_id']))
        //     $userId = $tokenData['user_id'];
        // else
        //     $userId = '';


        $category = Category::where('parent_id',0)
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name')
        ->get();


        // $Job = Job::where('status',1)
        // ->where('expire_time' ,'>=', time())
        // ->select(
        //     'job_number',
        //     'category_id',
        //     'location',
        //     'job_city',
        //     'description',
        //     'company_name',
        //     'contact_name',
        //     'min_exp',
        //     'max_exp',
        //     'min_salary',
        //     'max_salary',
        //     'logo',
        //     'skill',
        //     'slug',
        //     'title',
        //     'work_type'
        // )
        // ->get();


        $data['category'] =  $category;


        // return Response(['response' => $data , 'message' => 'success' ,'status'=>200 ],200);


        if(!empty($categorySlug)){

            if(trim($categorySlug)!='') {
                $categorieCount = Category::where('slug',$categorySlug)->get();
                $locationCount = Location::where('slug',$categorySlug)->get();
                $desginationCount = Skill::where('slug',$categorySlug)->get();
                $jobtitle = Job::where('slug',$categorySlug)->get();
                $stored_keywords  = Keyword::where('slug',$categorySlug )
                ->where('status',1)
                ->where('approval_status',1)
                ->get();
            }

            if(!empty($categorieCount)){
                $category_id = Category::where('slug',$categorySlug)->select('id')->first();
                $catData = Category::where('slug',$categorySlug)->first();

                $data['catData']= $catData;
                $data['category_id'] = $category_id;
            }

            if(!empty($locationCount)){

                $location = Location::where('slug',$categorySlug)->select('name')->first();
                $catData = Location::where('slug',$categorySlug)->first();

                $data['locData']= $catData;
            }

            if(!empty($desginationCount)){
                $catData = Skill::where('slug',$categorySlug)->first();
                $skill = $catData->name;

                $data['skill'] = $skill;
            }

            if(!empty($jobtitle)){
                $keyword = Job::where('slug',$categorySlug)->select('title')->first();

                $data['keyword'] = $keyword;
            }

            if(!empty($stored_keywords)){
                $keyword = Keyword::where('slug',$categorySlug)->select('name')->first();

                $data['keyword'] = $keyword;

            }

        }


        if(!empty($request->all())){
            $inputs = $request->all();

            // $inputs['keyword'];
            // $inputs['category_id'];
            // $inputs['subcategory_id'];
            // $inputs['location'];

            if (isset($inputs['keyword']) && $inputs['keyword'] != '') {

                $keyword = trim($inputs['keyword']);

                $keywordId = Keyword::where('name',$keyword)
                ->where('type','Search')->get();

                // if(!empty($keywordId)){

                //     $keywordInsert = new Keyword;

                //     $keywordInsert->name = $keyword;
                //     $keywordInsert->slug = $this->createSlug($keyword, 'keywords');
                //     $keywordInsert->status = '1';
                //     $keywordInsert->approval_status = '0';
                //     $keywordInsert->type = 'Search';
                //     $keywordInsert->course_id = '0';
                //     $keywordInsert->created = now();
                //     $keywordInsert->save();
                // }
            }

            if (isset($inputs['category_id']) && !empty($inputs['category_id'])) {
                if (is_array($inputs['category_id'])) {
                    $category_id = implode('-', $inputs['category_id']);
                } else {
                    $category_id = $inputs['category_id'];
                }
            }

            if (isset($inputs['subcategory_id']) && !empty($inputs['subcategory_id'])) {
                if (is_array($inputs['subcategory_id'])) {
                    $subcategory_id = implode('-', $inputs['subcategory_id']);
                } else {
                    $subcategory_id = $inputs['subcategory_id'];
                }
            }

            if (isset($inputs['location']) && !empty($inputs['location'])) {
                $location = trim($inputs['location']);
            }

        }

        $Job = new Job;

        if (isset($keyword) && $keyword != '') {

            $keyword = str_replace('_', '\_', $keyword);

            // $Job = $Job->join('skills','skills.id' , '=', 'jobs.skill')

            $Job = $Job->whereRaw("(title LIKE '%".addslashes($keyword)."%' or company_name LIKE '%".addslashes($keyword)."%' or description LIKE '%".addslashes($keyword)."%')");

            $keyword = str_replace('\_', '_', $keyword);
            $data['keyword']=$keyword;

            Keyword::create([
                'name' => $keyword,
                'course_id' => 0,
                'approval_status' => 0,
                'type'=>'Job',
                'slug' => $this->createSlug($keyword,'keywords'),
                'status' => 1,
            ]);
        }

        if (isset($category_id) && $category_id != '') {
            // $this->set('topcate', $category_id);

            $category_idCondtionArray = explode('-', $category_id);

            if (isset($subcategory_id) && $subcategory_id != '') {

                // $this->set('subcate', $subcategory_id);
                $subcategory_idCondtionArray = explode('-', $subcategory_id);

                foreach ($subcategory_idCondtionArray as $subMain) {

                    $subMainVal = Category::where('id',$subMain)
                    ->pluck('parent_id');

                    // $subMainVal = $this->Category->field('parent_id', array('Category.id' => $subMain));

                    if (($key = array_search($subMainVal, $category_idCondtionArray)) !== false) {
                        unset($category_idCondtionArray[$key]);
                    }

                    //   pr($category_idCondtionArray);
                }
                // pr($category_idCondtionArray);
                if ($category_idCondtionArray) {

                    $subcategory_idCondtion = implode(',', $subcategory_idCondtionArray);

                    $category_idCondtion = implode(',', $category_idCondtionArray);
                    $Job = $Job->whereRaw(" (category_id IN ($category_idCondtion) OR subcategory_id IN ($subcategory_idCondtion ) )");

                } else {

                    $subcategory_idCondtion = implode(',', $subcategory_idCondtionArray);
                    $Job = $Job->whereRaw(" (subcategory_id IN ($subcategory_idCondtion ))");

                }
            } else {

                $category_idCondtion = implode(',', $category_idCondtionArray);
                $Job = $Job->whereRaw(" (category_id IN ($category_idCondtion))");

            }
        }


        if (!empty($location)) {


            //$this->set('location', $location);
            $location = str_replace('_', '\_', $location);
            // print_r($location);exit;
            // $this->Job->virtualFields['relevance'] = "MATCH(`Job`.`job_city`) AGAINST ('$location' IN BOOLEAN MODE) ";
            // $condition[] = array("MATCH(`Job`.`job_city`) AGAINST ('$location' IN BOOLEAN MODE) ");


            $Job = $Job->whereRaw(" (`job_city` like '%" . addslashes($location) . "%') ");

            $location = str_replace('\_', '_', $location);
            // $order = 'relevance Desc';
        }

        $Job = $Job->where('status',1);
        //$Job = $Job->where('expire_time','>=',time());
        $Job = $Job->where('work_type','<>',0);
        $Job = $Job->select('job_number',
        'category_id',
        'location',
        'job_city',
        'description',
        'company_name',
        'contact_name',
        'min_exp',
        'max_exp',
        'min_salary',
        'max_salary',
        'logo',
        'skill',
        'slug',
        'title',
        'created',
        'work_type');

        // $jobs = $Job->toSql();
        $jobs = $Job->orderBy('id', 'DESC')->get();

        // print_r($jobs);
        // exit();

        $worktype = $GLOBALS['worktype'];

        $jobdetails = array();
        foreach($jobs as $key => $job){
            
            $specificDate = date('Y-m-d',strtotime($job->created));

            // Create DateTime objects for the specific date and current date
            $specificDateTime = new DateTime($specificDate);
            $currentDateTime = new DateTime();

            // Calculate the difference between the specific date and current date
            $interval = $specificDateTime->diff($currentDateTime);

            // Get the number of days from the interval
            $daysAgo = $interval->days;
            
            $jobdetails[$key]['job_number'] = $job->job_number;
            $jobdetails[$key]['category_id'] = $job->category_id;
            $jobdetails[$key]['location'] = $job->location;
            $jobdetails[$key]['job_city'] = $job->job_city;
            $jobdetails[$key]['description'] = $job->description;
            $jobdetails[$key]['company_name'] = $job->contact_name;
            $jobdetails[$key]['min_exp'] = $job->min_exp;
            $jobdetails[$key]['max_exp'] = $job->max_exp;
            $jobdetails[$key]['min_salary'] = $job->min_salary;
            $jobdetails[$key]['max_salary'] = $job->max_salary;
            
            if($job->logo != '')
                $jobdetails[$key]['logo'] = DISPLAY_JOB_LOGO_PATH.$job->logo;
            else
                $jobdetails[$key]['logo'] = '';
            
            $jobdetails[$key]['skill'] = $job->skill;
            $jobdetails[$key]['slug'] = $job->slug;
            $jobdetails[$key]['title'] = $job->title;
            $jobdetails[$key]['created'] = $daysAgo;
            $jobdetails[$key]['work_type'] = $worktype[$job->work_type];
            $jobdetails[$key]['cat_slug'] = Category::where('id',$job->category_id)->pluck('slug')->implode(',');
        }

        $data['jobs'] = $jobdetails;

        return Response(['response' => $data , 'message' => 'success', 'status'=>200 ],200);

    }

    public function getSubCategory($categoryId = null) {
        $this->layout = '';
        $subcategories = array();

        if($categoryId){
            $subcategories = Category::where('status',1)
            ->where('parent_id',$categoryId)
            ->orderBy('name')
            ->get();
        }

        return Response(['response' => $subcategories , 'message' => 'success' ,'status' => 200 ],200);
    }

    public function detail($slug = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        if($slug){
            $detailSlug = explode('.',$slug);
        }

        $jobdetails = Job::select(
            'category_id',
            'job_number',
            'user_id',
            'tittle',
            'subcategory_id',
            'skill',
            'designation',
            'Job_city',
            'discription',
            'company_name',
            'work_type',
            'contact_name',
            'contact_number',
            'vacancy',
            'created',
            'logo',
            'min_exp',
            'max_exp',
            'min_salary',
            'max_salary',
            'brief_abtcomp',
            'url'
        )
        ->where('slug',$detailSlug[0])
        ->first();


        $jobdetails->category_id;
        // subcategory_id
        // designation
        // skill
        // work_type

        $jobDetail = Job::with('category', 'skills' ,'user')->find($jobId);

        // Job::join('categories','jobs.category_id','=','categories.id')
        // ->join('skills', 'jobs.skill','=','skills.id')
        // ->join('user', 'jobs,user_id', '=' , 'users.id')
        // ->whereIn('skills',$request->skill)
        // ->where()



        $jobdetails = Job::select('jobs.id as job_id,
            jobs.category_id as job_cat_id,
            categories.slug as catslug')
        ->join('categories' , 'jobs.category_id' ,'=' ,'categories.id')
        ->where('jobs.slug',$detailSlug[0])
        ->where('jobs.status',1)
        ->first();


        if(empty($jobdetails)){
            return Response(['response' => 'Job not found' ,'message'=> 'Job not found' , 'status'=> 500 ],200);
        }elseif($jobdetails->catslug !== $catslug){

            $msgString='category slug not found';
            return Response(['response' => $msgString ,'message' => $msgString ,'status' => 500 ],200);

        }

        $data['jobdetails'] = $jobdetails;

        $cat_id = $jobdetails->job_id;
        $job_id = $jobdetails->job_cat_id;


        $relevantJobList =Job::where('status',1)
        ->where('id','<>',$job_id)
        ->where('category_id',$cat_id)
        ->where('expire_time','>=',time())
        ->orderBy('created','desc')
        ->get();

        $data['relevantJobList'] = $relevantJobList;

        if ($userId) {

            $showOldImages = Certificate::where('user_id',$userId)
            ->select('id','document')
            ->orderBy('id','ASC')->get();

            $data['showOldImages'] = $showOldImages;
        }

        return Response(['response' => $data ,'message'=> 'success' , 'status' => 200],200);

    }
    
    public function jobViewCount(Request $request, $slug = NULL){
        
        $jobDetail = Job::where('slug', $slug)->first();
        $jobId = $jobDetail->id;
        $userId = $request->id;
        // echo $userId;
        
        $jobFound = DB::table('jobviews')
        ->where('job_id', $jobId)
        ->where('user_id', $userId)
        ->first();
        
        // now check if this job and candidate exists in the job view table
        
        if($jobFound) {
            $jobStatus = $jobFound->status;
            
            //jobStatus == 1 means that candidate has not seen that job
            if($jobStatus == 1){
                $existingJobViewCount = $jobDetail->view_count;
                $updatedJobViewCount = $existingJobViewCount + 1;
                    
                // Update the view count
                $jobDetail->update(['view_count' => $updatedJobViewCount]);
            }
            
            //jobStatus == 2 means that candidate has already seen the job
            if($jobStatus == 2) {
                $existingJobViewCount = $jobDetail->view_count;
                $updatedJobViewCount = $existingJobViewCount;
                    
                // Update the view count
                $jobDetail->update(['view_count' => $updatedJobViewCount]);
            }
            
        } else {
            // insert the job view record in the table
            DB::table('jobviews')->insert([
                'job_id' => $jobId,
                'user_id' => $userId,
                'status' => 2, // Setting 2 means we are marking as the candidate has seen the job
            ]);
            
            $existingJobViewCount = $jobDetail->view_count;
            $updatedJobViewCount = $existingJobViewCount + 1;
                    
            // Update the view count
            $jobDetail->view_count = $updatedJobViewCount;
            $jobDetail->save();
            // $jobDetail->update(['view_count' => $updatedJobViewCount]);
        }
        
        return null;
    }
    
    public function jobSearchViewCount(Request $request, $slug = NULL){
        
        $jobDetail = Job::where('slug', $slug)->first();
        $jobId = $jobDetail->id;
        $userId = $request->id;
        // echo $userId;
        
        
        $jobFound = DB::table('jobseachviews')
        ->where('job_id', $jobId)
        ->where('user_id', $userId)
        ->first();
        
        // now check if this job and candidate exists in the job view table
        
        if($jobFound) {
            $jobStatus = $jobFound->status;
            
            //jobStatus == 1 means that candidate has not seen that job
            if($jobStatus == 1){
                $existingJobViewCount = $jobDetail->search_count;
                $updatedJobViewCount = $existingJobViewCount + 1;
                    
                // Update the view count
                $jobDetail->update(['search_count' => $updatedJobViewCount]);
            }
            
            //jobStatus == 2 means that candidate has already seen the job
            if($jobStatus == 2) {
                $existingJobViewCount = $jobDetail->search_count;
                $updatedJobViewCount = $existingJobViewCount;
                    
                // Update the view count
                $jobDetail->update(['search_count' => $updatedJobViewCount]);
            }
            
        } else {
            // insert the job search view record in the table
            DB::table('jobseachviews')->insert([
                'job_id' => $jobId,
                'user_id' => $userId,
                'status' => 2, // Setting 2 means we are marking as the candidate has searched and seen the job
            ]);
            
            $existingJobViewCount = $jobDetail->search_count;
            $updatedJobViewCount = $existingJobViewCount + 1;
            
            // echo $updatedJobViewCount;
            // print_r($jobDetail);
                    
            // Update the view count
            // $jobDetail->update(['search_count' => $updatedJobViewCount]);
            $jobDetail->search_count = $updatedJobViewCount;
            $jobDetail->save();

        }
        
        return null;
    }


    public function sendmail(Request $request):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        $msgString='';
        $data=array();

       // print_r($userId);exit;
         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        if(!empty($request->all())){

            $rules = array(
                'email_address' => 'required',
                'subject' => 'required',
                'job_id' => 'required',
                'message' => 'required',

            );


            $validator = Validator::make($request->all(),$rules);

            $validator->setAttributeNames([
                'email_address' => 'email address',
                'subject' => 'subject',
                'job_id' => 'Job',
                'message' => 'message',
            ]);

            if($validator->fails()){
               $msgString = $this->validatersErrorString($validator->errors());

               return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
            }else{


        
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

            }

        }

        return Response(['response'=>$data, 'message'=>'Mail send successfully.' , 'status'=>200 ],200);

        exit;

    }



    // public function createJob(Request $request , $isCopy = null):Response {


    //     $data['jobsCreate'] = 'active';
    //     // $data['isCopy'] = $isCopy;

    //     $tokenData = $this->requestAuthentication('POST', 1);
    //     $userId = $tokenData['user_id'];


    //      // $this->userLoginCheck();
    //     if(!$this->recruiterAccess($userId)){
    //         return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
    //     }
        
    //     $isAbleToJob = (new Plan)->checkPlanFeature($userId, 1);


    //     if ($isAbleToJob['status'] == 0) {

    //         return Response(['response' => $isAbleToJob['message'] , 'message' => $isAbleToJob['message'] , 'status' => 500 ],200);
    //     }

    //     global $extentions;

    //     $getemp = User::where('id',$userId)->first();

    //     $data2=array();
    //     $data2['company_name'] = $getemp->company_name;
    //     $data2['contact_number'] = $getemp->contact;
    //     $data2['companyProfile'] = $getemp->company_about;
    //     $data['jobData'] = $data2;

        

    //     $logo_status = User::where('id',$userId)->select('profile_image')->first();
    //     $data['logo_status'] = $logo_status->profile_image;

    //     $categories  = (new Category)->getCategoryList();
    //     $data['categories'] = $categories;

    //     $subcategories = array();
    //     $data['subcategories'] = $subcategories;

    //     $msgString = '';
    //     // get skills from skill table
    //     $skillList = Skill::where('type','Skill')
    //     ->where('status' , 1)
    //     ->select('id','name')
    //     ->orderBy('name','asc')
    //     ->get();
    //     $data['skillList'] = $skillList;


    //     // get designations from skill table
    //     $designationlList = Skill::where('type','Designation')
    //     ->where('status' , 1)
    //     ->select('id','name')
    //     ->orderBy('name','asc')
    //     ->get();
    //     $data['designationlList'] =  $designationlList;


    //     // get locations from location table
    //     $locationlList = Location::where('status',1)
    //     ->select('id','name')
    //     ->orderBy('name','asc')
    //     ->get();
    //     $data['locationlList'] = $locationlList;

    //     $data['sallery'] =  $GLOBALS['sallery'];
    //     $data['experience'] = $GLOBALS['experienceArray'];
    //     $data['worktype'] =  $GLOBALS['worktype'];

    //     $job['amount'] = '180.00';
    //     $job['type'] = 'Gold';


    //     if(!empty($request->all())){

    //         $rules = array(
    //             'job_title' => 'required',
    //             'category' => 'required',
    //             'jobDescription' => 'required',
    //             'company_name' => 'required',
    //             'work_type' => 'required',
    //             'contact_name' => 'required',
    //             'contact_number' => 'required',
    //             'companyProfile' => 'required',
    //           //  'company_website' => 'required',
    //             'experience' => 'required',
    //             'annual_salary'=>'required',
    //             'skill' => 'required',
    //             'designation' => 'required',
    //             'location' => 'required',
    //             'last_date' => 'required',
    //         );


    //         $validator = Validator::make($request->all(),$rules);

    //         $validator->setAttributeNames([
    //             'job_title' => 'Job title',
    //             'category' => 'Category',
    //             'jobDescription' => 'Job description',
    //             'company_name' => 'Company name',
    //             'work_type' => 'Work type',
    //             'contact_name' => 'Contact name',
    //             'contact_number' => 'Contact number',
    //             'companyProfile' => 'Company profile',
    //           //  'company_website' => 'Company website',
    //             'experience' => 'Experience',
    //             'annual_salary'=>'Annual Salary',
    //             'skill' => 'Skill',
    //             'designation' => 'Designation',
    //             'location' => 'Job location',
    //             'last_date' => 'Expire time',
    //         ]);

    //         if($validator->fails()){
    //           $msgString = $this->validatersErrorString($validator->errors());

    //           return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
    //         }else{

    //             $msgString .= $this->checkSwearWord($request->job_title);
    //             $msgString .= $this->checkSwearWord($request->jobDescription);
    //             $msgString .= $this->checkSwearWord($request->company_name);
    //             $msgString .= $this->checkSwearWord($request->contact_name);
    //             $msgString .= $this->checkSwearWord($request->contact_number);
    //             $msgString .= $this->checkSwearWord($request->companyProfile);

    //             // if (!isset($_SESSION['type']) && $_SESSION['type'] == '') {
    //             //     $msgString .= 'Select Job Type'. "<br>";
    //             // } else {
    //             //     $request['job']["type"] = $_SESSION['type'];
    //             // }


    //             $youtube_link = '';

    //             if($request->logo != ''){
    //                 $file = explode( ";base64,", $request->logo);
    //                 $image_type_pieces = explode( "image/", $file[0] );
    //                 $image_type = $image_type_pieces[1];
    //                 // $file = base64_decode($request->logo);
    //                 $originalName = Str::random(10).'.'.$image_type;
    //             }else{
    //                 $originalName = '';
    //             }

    //             // if($request->hasFile('logo')){

    //             //     $file = $request->file('logo');
    //             //     $originalName = $file->getClientOriginalName();
    //             //     $extension = $file->getClientOriginalExtension();
    //             //     $mimeType = $file->getClientMimeType();
    //             //     $size = $file->getSize();

    //             //     if($size > '2097152'){
    //             //         $msgString .= 'Max file size upload is 2MB.' . "<br>";
    //             //     }elseif(!in_array($extention, $extentions)){
    //             //         $msgString .= 'Not Valid Extention.' . "<br>";
    //             //     }

    //             // }else{
    //             //     $originalName ='';
    //             // }

    //             if (isset($msgString) && $msgString != '') {

    //                 $subcategories = (new Category)->getSubCategoryList($request->category);

    //                 $data['subcategories'] = $subcategories;

    //                 return Response(['response' => $data , 'message' => $msgString , 'status' => 500,],200);
    //             }else{

    //                 $keyword = $request->job_title;

    //                 $keywordId = Keyword::where('name',$keyword)
    //                 ->where('type','Job')
    //                 ->select('id')
    //                 ->get();

    //                 if($keywordId->count() == 0){
    //                     $newKeyword = new Keyword;
    //                     $newKeyword->name = $keyword;
    //                     $newKeyword->slug = $this->createSlug($keyword,'keywords');
    //                     $newKeyword->status = 1;
    //                     $newKeyword->approval_status = 0;
    //                     $newKeyword->type = 'job';
    //                     $newKeyword->created = date('Y-m-d H:s:i');
    //                     $newKeyword->course_id = 0;
    //                     $newKeyword->save();
    //                 }


    //                 $newJob = new Job;

    //                 $newJob->title = $request->job_title;
    //                 $newJob->category_id = $request->category;
    //                 $newJob->description = $request->jobDescription;
    //                 $newJob->company_name = $request->company_name;
    //                 $newJob->work_type = $request->work_type;
    //                 $newJob->contact_name = $request->contact_name;
    //                 $newJob->contact_number = $request->contact_number;
    //                 $newJob->url = $request->company_website;
    //                 $newJob->brief_abtcomp = $request->companyProfile;
    //                 $newJob->designation = $request->designation;
    //                 $newJob->job_city = $request->location;
    //                 $newJob->lastdate = $request->last_date;
    //                 $newJob->expire_time =  strtotime($request->last_date); 

    //                 $exp = explode('-',$request->experience);
    //                 $newJob->min_exp = $exp[0];
    //                 $newJob->max_exp = $exp[1];

    //                 $sallery = explode('-',$request->annual_salary);
    //                 $newJob->min_salary = $sallery[0];
    //                 $newJob->max_salary = $sallery[1];

    //                 if($originalName != ''){
    //                     // $specialCharacters = array('#', '$', '%', '@', '+', '=', '\\', '/', '"', ' ', "'", ':', '~', '`', '!', '^', '*', '(', ')', '|', "'");
    //                     // $toReplace = "-";

    //                     // $uploadedFileName = $this->uploadImage($file, UPLOAD_JOB_LOGO_PATH);

    //                     $decoded_string = base64_decode($file[1]);

    //                     file_put_contents(UPLOAD_JOB_LOGO_PATH.$originalName, $decoded_string);

    //                     $newJob->logo = $originalName;

    //                 }else{
    //                     $newJob->logo = '';
    //                 }

    //                 if($request->subCategory != ''){
    //                     $newJob->subcategory_id = implode(',',$request->subCategory);
    //                 }else{
    //                     $newJob->subcategory_id =0;
    //                 }

    //                 $slug = $this->createSlug($request->job_title,'jobs');
    //                 $newJob->slug = $slug;
    //                 $newJob->type = $job["type"];
    //                 $newJob->status = 1;
    //                 $newJob->user_id = $userId;
    //                 $newJob->payment_status = 2;
    //                 $newJob->amount_paid = $job['amount'];
    //                 $newJob->job_number = 'JOB'. $userId . time();

    //                 if($request->exp_month == ''){
    //                     $newJob->exp_month = 0;
    //                 }

    //                 if($job["type"] == 'gold'){
    //                     $newJob->hot_job_time = time() + 7 * 24 * 3600;
    //                 }else{
    //                     $newJob->hot_job_time = time();
    //                 }

    //                 $newJob->expire_time = strtotime($request->last_date); 
    //                 $newJob->skill = implode(',',$request->skill);
    //                 $newJob->user_plan_id = $isAbleToJob['user_plan_id'];

    //                 if($job['amount'] > 0){
    //                     if($newJob->save()){
    //                         $jobId = $newJob->id;
    //                         $jobDetail = Job::with('category','user')->find($jobId);
    //                         $title = $jobDetail->title;
    //                         $category = $jobDetail->category->name;
    //                         $skillIds = $jobDetail->skill;
    //                         $location = $jobDetail->job_city;
    //                         $minExp = $jobDetail->min_exp . ' Year';
    //                         $maxExp = $jobDetail->max_exp . ' Year';
    //                         $min_salary = CURRENCY . ' ' . intval($jobDetail->min_salary);
    //                         $max_salary = CURRENCY . ' ' . intval($jobDetail->max_salary);
    //                         $description = $jobDetail->description;
    //                         $company_name = $jobDetail->company_name;
    //                         $contact_number = $jobDetail->contact_number;
    //                         $website = $jobDetail->url ? $jobDetail->url : 'N/A';
    //                         $address = $jobDetail->address ? $jobDetail->address : 'N/A';

    //                         $designation = Skill::where('status',1)
    //                         ->where('type','Designation')
    //                         ->where('id',$jobDetail->designation)
    //                         ->value('name');
    //                         // ->get();

    //                         $skill = (new Skill)->getSkillsNamesByIds($skillIds);

    //                         $username = $jobDetail->user->first_name . ' ' . $jobDetail->user->last_name;

    //                         $email = $jobDetail->user->email_address;

    //                         $currentYear = date('Y', time());

    //                         $emailTemplate = Emailtemplate::where('id',46)->first();

    //                         $get_lang=DEFAULT_LANGUAGE;
    //                         if( $get_lang =='fra'){
    //                             $template_subject= $emailTemplate->subject_fra;
    //                             $template_body= $emailTemplate->template_fra;
    //                         }else if( $get_lang =='de'){
    //                             $template_subject= $emailTemplate->subject_de;
    //                             $template_body= $emailTemplate->template_de;
    //                         }else{
    //                             $template_subject= $emailTemplate->subject;
    //                             $template_body= $emailTemplate->template;
    //                         }

    //                         $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

    //                         $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!min_experience!]', '[!max_experience!]', '[!min_salary!]', '[!max_salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');

    //                         $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $minExp, $maxExp, $min_salary, $max_salary, $description, $company_name, $contact_number, $website, $address, SITE_TITLE);

    //                         $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
    //                         $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                           

    //                         try {
    //                             Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
    //                         } catch(\Exception $e) {
    //                             $msgString=$e->getMessage();
    //                         }
    //                         // Admin email;
    //                         $username = "Admin";
    //                         $adminInfo = Admin::whereId(1)->first();

    //                         $email = $adminInfo->email;

    //                         $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
    //                         $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                           

    //                         try {
    //                             Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
    //                         } catch(\Exception $e) {
    //                             $msgString=$e->getMessage();
    //                         }

    //                         $users = (new Alert_location)->getUsersToAlert($jobId);


    //                         if (!empty($users)) {
    //                             foreach ($users as $user) {

    //                                 $newAlertJob = new Alert_job; 

    //                                 $newAlertJob->job_id = $jobId;
    //                                 $newAlertJob->user_id = $user->id;
    //                                 $newAlertJob->email_address = $user->email_address;
    //                                 $newAlertJob->status = 1; 

    //                                 $newAlertJob->save();

    //                             }
    //                         }
                            
    //                         // send mail to those candidates who has set alert for designation, category and location
    //                         // start
    //                         $location = $request->location;
    //                         $designation = $request->designation;
    //                         $category = $request->category;
                            
    //                         // $alertLocation = Alert::where('location', $location)->first();
    //                         // // echo $alertLocation;
                            
    //                         // // echo $userId;
                            
    //                         // $alertDesignation = Alert::where('designation', $designation)->first();
                            
                            
                            
                            
    //                         // if($alertDesignation) {
    //                         //     $userId = $alertDesignation->user_id;

    //                         // }
    //                         // if($alertLocation) {
    //                         //     $userId = $alertLocation->user_id;

    //                         // }
    //                         // if($alertDesignation && $alertLocation) {
    //                         //     $userId = $alertLocation->user_id;

    //                         // }
                            
    //                         // echo $userId;
                            
                           
    //                             // $userDetails = User::where('id', $userId)->first();
    //                             // $userId = $userDetails->id;
    //                             // $email = $userDetails->email_address;
    //                             // $username = $userDetails->first_name;
    //                             // $title = $request->job_title;
    //                             // $category = $request->category;
    //                             // $location = $request->location;
    //                             // $skill = "";
    //                             // $designation = "";
    //                             // // $minExp = "";
    //                             // // $maxExp = "";
    //                             // $exp = $request->experience;
    //                             // $salary = $request->annual_salary;
    //                             // $description = $request->jobDescription;
    //                             // $company_name = $request->company_name;
    //                             // $contact_number = $request->contact_number;
    //                             // $website = $request->company_website;
    //                             // $address = "";
    
    //                             // $currentYear = date('Y', time());
    
    //                             // $emailTemplate = Emailtemplate::where('id',34)->first();
    
    //                             // $get_lang=DEFAULT_LANGUAGE;
    //                             // if( $get_lang =='fra'){
    //                             //     $template_subject= $emailTemplate->subject_fra;
    //                             //     $template_body= $emailTemplate->template_fra;
    //                             // }else if( $get_lang =='de'){
    //                             //     $template_subject= $emailTemplate->subject_de;
    //                             //     $template_body= $emailTemplate->template_de;
    //                             // }else{
    //                             //     $template_subject= $emailTemplate->subject;
    //                             //     $template_body= $emailTemplate->template;
    //                             //     // var_dump($template_subject);
    //                             //     // var_dump($template_body);
    
    //                             // }
    
    //                             // $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
    
    //                             // $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!experience!]', '[!salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');
    
    //                             // $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $exp, $salary, $description, $company_name, $contact_number, $website, $address, SITE_TITLE);
    
    //                             // // var_dump($toSubArray);
    //                             // // var_dump($fromSubArray);
    //                             // $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
    //                             // $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);
    
                               
    
    //                             // try {
    //                             //     Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
    //                             // } catch(\Exception $e) {
    //                             //     $msgString=$e->getMessage();
    //                             // }
                                
                                
    //                             // new code
    //                             $alertLocation = Alert::where('location', $location)->pluck('user_id')->toArray();
    //                             // $alertCategory = Alert::where('category_id', $category)->pluck('user_id')->toArray();
    //                             // echo $alertLocation;
                                
    //                             // echo $userId;
                                
    //                             $alertDesignation = Alert::where('designation', $designation)->pluck('user_id')->toArray();
    //                             $totalIds = array_unique(array_merge($alertLocation, $alertDesignation));

    //                             if($totalIds != "") {
    //                                 foreach ($totalIds as $userId) {
    //                                     // echo $userId;
    //                                 $userDetails = User::find($userId);
    //                                 // $userDetails = User::where('id', $totalIds)->get();
    //                                 $userId = $userDetails->id;
    //                                 $email = $userDetails->email_address;
    //                                 $username = $userDetails->first_name;
    //                                 $title = $request->job_title;
    //                                 $categoryId = $request->category; //
    //                                 $category = Category::where('id',$categoryId)->first()->name;
    //                                 $location = $request->location;
    //                                 $skillIds = $request->skill;
    //                                 $skillNames = [];

    //                                 foreach($skillIds as $skillId){
    //                                     $skillName = Skill::where('id', $skillId)->first();
    //                                     if($skillName) {
    //                                         $skillNames[] = $skillName->name;
    //                                     }
    //                                 }
                                    
    //                                 $skill = implode(', ', $skillNames);
    //                                 $designationId = $request->designation;
    //                                 $designation = Skill::where('id', $designationId)->first()->name;
    //                                                                     // echo $designation;
    //                                                                     // echo "hi";

    //                                 // $minExp = "";
    //                                 // $maxExp = "";
    //                                 $exp = $request->experience;
    //                                 $salary = $request->annual_salary;
    //                                 $description = $request->jobDescription;
    //                                 $company_name = $request->company_name;
    //                                 $contact_number = $request->contact_number;
    //                                 $website = $request->company_website;
    //                                 $address = "";
        
    //                                 $currentYear = date('Y', time());
        
    //                                 $emailTemplate = Emailtemplate::where('id',34)->first();
        
    //                                 $get_lang=DEFAULT_LANGUAGE;
    //                                 if( $get_lang =='fra'){
    //                                     $template_subject= $emailTemplate->subject_fra;
    //                                     $template_body= $emailTemplate->template_fra;
    //                                 }else if( $get_lang =='de'){
    //                                     $template_subject= $emailTemplate->subject_de;
    //                                     $template_body= $emailTemplate->template_de;
    //                                 }else{
    //                                     $template_subject= $emailTemplate->subject;
    //                                     $template_body= $emailTemplate->template;
    //                                     // var_dump($template_subject);
    //                                     // var_dump($template_body);
        
    //                                 }
        
    //                                 $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
        
    //                                 $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!experience!]', '[!salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');
        
    //                                 $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $exp, $salary, $description, $company_name, $contact_number, $website, $address, SITE_TITLE);
        
    //                                 // var_dump($toSubArray);
    //                                 // var_dump($fromSubArray);
    //                                 $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
    //                                 $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);
        
                                   
        
    //                                 try {
    //                                     Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
    //                                 } catch(\Exception $e) {
    //                                     $msgString=$e->getMessage();
    //                                 }
    //                             }
    //                             }
                                
                                
                                
    //                             // end

    //                         return Response(['response' => 'Your job posted successfully.', 'message' => 'Your job posted successfully.' ,'status'=> 200 ],200);

    //                     }
    //                 }else{
    //                     $newJob->dis_amount = 0;
    //                     $newJob->promo_code = '';
    //                     $newJob->status = 1;

    //                     if($newJob->save()){
    //                         $jobId = $newJob->id;
    //                         $jobDetail = Job::with('category', 'skills' ,'user')->find($jobId);
    //                         $title = $jobDetail->title;
    //                         $category = $jobDetail->category->name;
    //                         $skillIds = $jobDetail->skill;
    //                         $location = $jobDetail->job_city;
    //                         $minExp = $jobDetail->min_exp . ' Year';
    //                         $maxExp = $jobDetail->max_exp . ' Year';
    //                         $min_salary = CURRENCY . ' ' . intval($jobDetail->min_salary);
    //                         $max_salary = CURRENCY . ' ' . intval($jobDetail->max_salary);
    //                         $description = $jobDetail->description;
    //                         $company_name = $jobDetail->company_name;
    //                         $contact_number = $jobDetail->contact_number;
    //                         $website = $jobDetail->url ? $jobDetail->url : 'N/A';
    //                         $address = $jobDetail->address ? $jobDetail->address : 'N/A';

    //                         $designation = Skill::where('status',1)
    //                         ->where('type','Designation')
    //                         ->where('id',$jobDetail->designation)
    //                         ->select('name')
    //                         ->get();

    //                         $skill = (new Skill)->getSkillsNamesByIds($skillIds);


    //                         $username = $jobDetail->user->first_name . ' ' . $jobDetail->user->last_name;

    //                         $email = $jobDetail->user->email_address;

    //                         $currentYear = date('Y', time());

    //                         $emailTemplate = Emailtemplate::where('id',46)->first();

    //                         $get_lang=DEFAULT_LANGUAGE;
    //                         if( $get_lang =='fra'){
    //                             $template_subject= $emailTemplate->subject_fra;
    //                             $template_body= $emailTemplate->template_fra;
    //                         }else if( $get_lang =='de'){
    //                             $template_subject= $emailTemplate->subject_de;
    //                             $template_body= $emailTemplate->template_de;
    //                         }else{
    //                             $template_subject= $emailTemplate->subject;
    //                             $template_body= $emailTemplate->template;
    //                         }

    //                         $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

    //                         $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!min_experience!]', '[!max_experience!]', '[!min_salary!]', '[!max_salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');

    //                         $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $minExp, $maxExp, $min_salary, $max_salary, $description, $company_name, $contact_number, $website, $address, SITE_TITLE);

    //                         $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
    //                         $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                           

    //                         try {
    //                             Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
    //                         } catch(\Exception $e) {
    //                             $msgString=$e->getMessage();
    //                         }
    //                         // Admin email;
    //                         $username = "Admin";
    //                         $adminInfo = Admin::whereId(1)->first();

    //                         $email = $adminInfo->email;

    //                         $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
    //                         $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

    //                       //  

    //                       try {
    //                         Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
    //                     } catch(\Exception $e) {
    //                         $msgString=$e->getMessage();
    //                     }

    //                     }

    //                     return Response(['response' => 'Your job posted successfully.', 'message' => 'Your job posted successfully.', 'status'=>200 ],200);
    //                 }

    //             }
    //         }
    //     }else{
            
    //         if($isCopy!= ''){
    //             $data['sallery'] =  $GLOBALS['sallery'];
    //             $data['experience'] = $GLOBALS['experienceArray'];
    //             $data['worktype'] =  $GLOBALS['worktype'];
        
    //             $jobInfo = Job::where('slug', $isCopy)->first();

    //             $cat_name = Category::where('id',$jobInfo->category_id)
    //             ->pluck('name')
    //             ->implode(',');
        
    //             $sub_cat_name = Category::where('id',$jobInfo->subcategory_id)
    //             ->pluck('name')
    //             ->implode(',');
        
    //             $skill = Skill::whereIn('id',[$jobInfo->skill])
    //             ->pluck('name')
    //             ->toArray();
        
    //             $designation = Skill::whereIn('id',[$jobInfo->designation])
    //             ->pluck('name')
    //             ->toArray();
        
    //             $work_type = $GLOBALS['worktype'];
        
    //             $job_detail_array = array();
                
    //             $sub_array = explode(',',$jobInfo->subcategory_id);
    //             $skill_array = explode(',',$jobInfo->skill);

    //             $job_detail_array['category'] = $jobInfo->category_id;
    //             $job_detail_array['subCategory'] =  $sub_array;
    //             $job_detail_array['skill'] = $skill_array;
    //             $job_detail_array['designation'] = $jobInfo->designation;
    //             $job_detail_array['contact_name'] = $jobInfo->contact_name;
    //             $job_detail_array['contact_number'] =  $jobInfo->contact_number;
    //             $job_detail_array['location'] = $jobInfo->job_city;
    //             $job_detail_array['work_type'] =  $jobInfo->work_type;
    //             $job_detail_array['jobDescription'] = $jobInfo->description;
    //             $job_detail_array['company_name'] = $jobInfo->company_name;
    //             $job_detail_array['company_website'] = $jobInfo->url;
    //             $job_detail_array['companyProfile'] = $jobInfo->brief_abtcomp;
    //             $job_detail_array['experience'] = $jobInfo->min_exp.'-'.$jobInfo->max_exp;
    //             $job_detail_array['annual_salary'] = $jobInfo->min_salary.'-'.$jobInfo->max_salary;
    //             $job_detail_array['job_title'] = 'Copy of '.$jobInfo->title;
    //             $job_detail_array['logo'] = '';
        
    //             if($jobInfo->logo != ''){
    //                 $job_detail_array['logo_path'] = DISPLAY_JOB_LOGO_PATH.$jobInfo->logo;
    //             }else{
    //                 $job_detail_array['logo_path'] = '';
    //             }
                
    //             $job_detail_array['logo'] = '';
        
    //             $job_detail_array['last_date'] = $jobInfo->lastdate == '' ? date('Y-m-d') : $jobInfo->lastdate ;

    //             $data['job_details'] = $job_detail_array;
    //         }

    //         return Response(['response'=>$data, 'message'=>'success' , 'status'=>200 ],200);
    //     }

    // }
    
        public function createJob(Request $request , $isCopy = null):Response {


        $data['jobsCreate'] = 'active';
        // $data['isCopy'] = $isCopy;

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];


         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        $isAbleToJob = (new Plan)->checkPlanFeature($userId, 1);


        if ($isAbleToJob['status'] == 0) {

            return Response(['response' => $isAbleToJob['message'] , 'message' => $isAbleToJob['message'] , 'status' => 500 ],200);
            exit;
        }

        global $extentions;

        $getemp = User::where('id',$userId)->first();

        $data2=array();
        $data2['company_name'] = $getemp->company_name;
        $data2['contact_number'] = $getemp->contact;
        $data2['companyProfile'] = $getemp->company_about;
        $data['jobData'] = $data2;

        // $isAbleToJob = (new Plan)->checkPlanFeature($userId, 1);


        // if ($isAbleToJob['status'] == 0) {

        //     return Response(['response' => $isAbleToJob['message'] , 'message' => $isAbleToJob['message'] , 'status' => 500 ],200);
        // }

        $logo_status = User::where('id',$userId)->select('profile_image')->first();
        $data['logo_status'] = $logo_status->profile_image;

        $categories  = (new Category)->getCategoryList();
        $data['categories'] = $categories;

        $subcategories = array();
        $data['subcategories'] = $subcategories;

        $msgString = '';
        // get skills from skill table
        $skillList = Skill::where('type','Skill')
        ->where('status' , 1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['skillList'] = $skillList;


        // get designations from skill table
        $designationlList = Skill::where('type','Designation')
        // ->where('working_relation_type' , 1)
        ->where('status' , 1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['designationlList'] =  $designationlList;


        // get locations from location table
        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['locationlList'] = $locationlList;

        $data['sallery'] =  $GLOBALS['sallery'];
        $data['experience'] = $GLOBALS['experienceArray'];
        $data['worktype'] =  $GLOBALS['worktype'];

        $job['amount'] = '180.00';
        $job['type'] = 'Gold';


        if(!empty($request->all())){

            $rules = array(
                'job_title' => 'required',
                'category' => 'required',
                'jobDescription' => 'required',
                'company_name' => 'required',
                'work_type' => 'required',
                'contact_name' => 'required',
                'contact_number' => 'required',
                'companyProfile' => 'required',
              //  'company_website' => 'required',
                'experience' => 'required',
                'annual_salary'=>'required',
                // 'skill' => 'required',
                'designation' => 'required',
                'location' => 'required',
                'last_date' => 'required',
                //'job_type' => 'required',

            );


            $validator = Validator::make($request->all(),$rules);

            $validator->setAttributeNames([
                'job_title' => 'Job title',
                'category' => 'Category',
                'jobDescription' => 'Job description',
                'company_name' => 'Company name',
                'work_type' => 'Work type',
                'contact_name' => 'Contact name',
                'contact_number' => 'Contact number',
                'companyProfile' => 'Company profile',
              //  'company_website' => 'Company website',
                'experience' => 'Experience',
                'annual_salary'=>'Annual Salary',
                'skill' => 'Skill',
                'designation' => 'Designation',
                'location' => 'Job location',
                'last_date' => 'Expire time',
              //  'job_type' => 'Job Type',

            ]);

            if($validator->fails()){
               $msgString = $this->validatersErrorString($validator->errors());

               return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
            }else{





                $msgString .= $this->checkSwearWord($request->job_title);
                $msgString .= $this->checkSwearWord($request->jobDescription);
                $msgString .= $this->checkSwearWord($request->company_name);
                $msgString .= $this->checkSwearWord($request->contact_name);
                $msgString .= $this->checkSwearWord($request->contact_number);
                $msgString .= $this->checkSwearWord($request->companyProfile);

                // if (!isset($_SESSION['type']) && $_SESSION['type'] == '') {
                //     $msgString .= 'Select Job Type'. "<br>";
                // } else {
                //     $request['job']["type"] = $_SESSION['type'];
                // }


                $youtube_link = '';

                if($request->logo != ''){
                    $file = explode( ";base64,", $request->logo);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    // $file = base64_decode($request->logo);
                    $originalName = Str::random(10).'.'.$image_type;
                }else{
                    $originalName = '';
                }

                // if($request->hasFile('logo')){

                //     $file = $request->file('logo');
                //     $originalName = $file->getClientOriginalName();
                //     $extension = $file->getClientOriginalExtension();
                //     $mimeType = $file->getClientMimeType();
                //     $size = $file->getSize();

                //     if($size > '2097152'){
                //         $msgString .= 'Max file size upload is 2MB.' . "<br>";
                //     }elseif(!in_array($extention, $extentions)){
                //         $msgString .= 'Not Valid Extention.' . "<br>";
                //     }

                // }else{
                //     $originalName ='';
                // }

                if (isset($msgString) && $msgString != '') {

                    $subcategories = (new Category)->getSubCategoryList($request->category);

                    $data['subcategories'] = $subcategories;

                    return Response(['response' => $data , 'message' => $msgString , 'status' => 500,],200);
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
                    $newJob->expire_time =  strtotime($request->last_date); 
                    // $newJob->job_type = 1;

                    $exp = explode('-',$request->experience);
                    $newJob->min_exp = $exp[0];
                    $newJob->max_exp = $exp[1];

                    $sallery = explode('-',$request->annual_salary);
                    $newJob->min_salary = $sallery[0];
                    $newJob->max_salary = $sallery[1];

                    if($originalName != ''){
                        // $specialCharacters = array('#', '$', '%', '@', '+', '=', '\\', '/', '"', ' ', "'", ':', '~', '`', '!', '^', '*', '(', ')', '|', "'");
                        // $toReplace = "-";

                        // $uploadedFileName = $this->uploadImage($file, UPLOAD_JOB_LOGO_PATH);

                        $decoded_string = base64_decode($file[1]);

                        file_put_contents(UPLOAD_JOB_LOGO_PATH.$originalName, $decoded_string);

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
                    $newJob->type = $job["type"];
                    $newJob->status = 1;
                    $newJob->user_id = $userId;
                    $newJob->payment_status = 2;
                    $newJob->amount_paid = $job['amount'];
                    $newJob->job_number = 'JOB'. $userId . time();

                    if($request->exp_month == ''){
                        $newJob->exp_month = 0;
                    }

                    if($job["type"] == 'gold'){
                        $newJob->hot_job_time = time() + 7 * 24 * 3600;
                    }else{
                        $newJob->hot_job_time = time();
                    }

                    $newJob->expire_time = strtotime($request->last_date); 
                    $newJob->skill = implode(',',$request->skill);
                    $newJob->user_plan_id = $isAbleToJob['user_plan_id'];
                    
                    

                    if($job['amount'] > 0){
                        if($newJob->save()){
                            $jobId = $newJob->id;
                            
                            Job::where('id',$jobId)->update(['url' => $request->company_website]);
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
                            
                            // echo $website;

                            $designation = Skill::where('status',1)
                            ->where('type','Designation')
                            // ->where('working_relation_type' , 1)
                            ->where('id',$jobDetail->designation)
                            ->value('name');
                            // ->first();

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
                            // echo $designation;

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
                            
                            
                            
                            $location = $request->location;
                            $designation = $request->designation;
                            
                            // code for storing the notified jobseeker for a job
                            // start
                            
                            $jobseekerCount = Alert::where('location', $request->location)
                                      ->orWhere('designation', $request->designation)
                                      ->count();


                            


                            if (!empty($jobseekerCount)) {
                                $newAlertJob = new Alert_job; 
                                $newAlertJob->job_id = $jobId;
                                $newAlertJob->count = $jobseekerCount; 
                                $newAlertJob->save();
                            }
                            
                            // $users = (new Alert_location)->getUsersToAlert($jobId);
                            // if (!empty($users)) {
                            //     foreach ($users as $user) {

                            //         $newAlertJob = new Alert_job; 

                            //         $newAlertJob->job_id = $jobId;
                            //         $newAlertJob->user_id = $user->id;
                            //         $newAlertJob->email_address = $user->email_address;
                            //         $newAlertJob->status = 1; 

                            //         $newAlertJob->save();

                            //     }
                            // }
                            
                            //end
                            
                            
                            // send mail to those candidates who has set alert for designation, category and location
                            // start

                        
                                
                                
                                // new code
                                $alertLocation = Alert::where('location', $location)->pluck('user_id')->toArray();
                                $alertDesignation = Alert::where('designation', $designation)->pluck('user_id')->toArray();
                                $totalIds = array_unique(array_merge($alertLocation, $alertDesignation));

                                if($totalIds != "") {
                                    foreach ($totalIds as $userId) {
                                        // echo $userId;
                                        $userDetails = User::find($userId);
                                        if($userDetails) {
                                            // $userDetails = User::where('id', $totalIds)->get();
                                            $userId = $userDetails->id;
                                            $email = $userDetails->email_address;
                                            $username = $userDetails->first_name;
                                            $title = $request->job_title;
                                            $categoryId = $request->category; //
                                            $category = Category::where('id',$categoryId)->first()->name;
                                            $location = $request->location;
                                            $skillIds = $request->skill;
                                            $skillNames = [];
        
                                            foreach($skillIds as $skillId){
                                                $skillName = Skill::where('id', $skillId)->first();
                                                if($skillName) {
                                                    $skillNames[] = $skillName->name;
                                                }
                                            }
                                            
                                            $skill = implode(', ', $skillNames);
                                            $designationId = $request->designation;
                                            $designation = Skill::where('id', $designationId)->first()->name;
                                            
                                            $exp = $request->experience." "."Years";
                                            $salary =CURR." ". $request->annual_salary;
                                            $description = $request->jobDescription;
                                            $company_name = $request->company_name;
                                            $contact_number = $request->contact_number;
                                            $website = $request->company_website;
                                            $address = "";
                
                                            $currentYear = date('Y', time());
                
                                            $emailTemplate = Emailtemplate::where('id',34)->first();
                
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
                                                // var_dump($template_subject);
                                                // var_dump($template_body);
                
                                            }
                
                                            $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';
                
                                            $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!experience!]', '[!salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');
                
                                            $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $exp, $salary, $description, $company_name, $contact_number, $website, $address, SITE_TITLE);
                
                                            // var_dump($toSubArray);
                                            // var_dump($fromSubArray);
                                            $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                                            $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);
                
                                           
                
                                            try {
                                                Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
                                            } catch(\Exception $e) {
                                                $msgString=$e->getMessage();
                                            }
                                        }
                                        
                                    }
                                }
                                // end
                            return Response(['response' => 'Your job posted successfully.', 'message' => 'Your job posted successfully.' ,'status'=> 200 ],200);

                        }
                    }else{
                        $newJob->dis_amount = 0;
                        $newJob->promo_code = '';
                        $newJob->status = 1;

                        if($newJob->save()){
                            $jobId = $newJob->id;
                            
                            Job::where('id',$jobId)->update(['url' => $request->company_website]);
                            $jobDetail = Job::with('category', 'skills' ,'user')->find($jobId);
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
                            $website = $request->company_website ? $request->company_website : 'N/A';
                            $address = $jobDetail->address ? $jobDetail->address : 'N/A';

                            $designation = Skill::where('status',1)
                            ->where('type','Designation')
                            // ->where('working_relation_type' , 1)
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

                          //  

                          try {
                            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));
                        } catch(\Exception $e) {
                            $msgString=$e->getMessage();
                        }

                        }

                        return Response(['response' => 'Your job posted successfully.', 'message' => 'Your job posted successfully.', 'status'=>200 ],200);
                    }

                }
            }
        }else{
            
            if($isCopy!= ''){
                $data['sallery'] =  $GLOBALS['sallery'];
                $data['experience'] = $GLOBALS['experienceArray'];
                $data['worktype'] =  $GLOBALS['worktype'];
        
                $jobInfo = Job::where('slug', $isCopy)->first();

                $cat_name = Category::where('id',$jobInfo->category_id)
                ->pluck('name')
                ->implode(',');
        
                $sub_cat_name = Category::where('id',$jobInfo->subcategory_id)
                ->pluck('name')
                ->implode(',');
        
                $skill = Skill::whereIn('id',[$jobInfo->skill])
                ->pluck('name')
                ->toArray();
        
                $designation = Skill::whereIn('id',[$jobInfo->designation])
                ->pluck('name')
                ->toArray();
        
                $work_type = $GLOBALS['worktype'];
        
                $job_detail_array = array();
                
                $sub_array = explode(',',$jobInfo->subcategory_id);
                $skill_array = explode(',',$jobInfo->skill);

                $job_detail_array['category'] = $jobInfo->category_id;
                $job_detail_array['subCategory'] =  $sub_array;
                $job_detail_array['skill'] = $skill_array;
                $job_detail_array['designation'] = $jobInfo->designation;
                $job_detail_array['contact_name'] = $jobInfo->contact_name;
                $job_detail_array['contact_number'] =  $jobInfo->contact_number;
                $job_detail_array['location'] = $jobInfo->job_city;
                $job_detail_array['work_type'] =  $jobInfo->work_type;
                $job_detail_array['jobDescription'] = $jobInfo->description;
                $job_detail_array['company_name'] = $jobInfo->company_name;
                $job_detail_array['company_website'] = $jobInfo->url;
                $job_detail_array['companyProfile'] = $jobInfo->brief_abtcomp;
                $job_detail_array['experience'] = $jobInfo->min_exp.'-'.$jobInfo->max_exp;
                $job_detail_array['annual_salary'] = $jobInfo->min_salary.'-'.$jobInfo->max_salary;
                $job_detail_array['job_title'] = 'Copy of '.$jobInfo->title;
                $job_detail_array['logo'] = '';
        
                if($jobInfo->logo != ''){
                    $job_detail_array['logo_path'] = DISPLAY_JOB_LOGO_PATH.$jobInfo->logo;
                }else{
                    $job_detail_array['logo_path'] = '';
                }
                
                $job_detail_array['logo'] = '';
        
                $job_detail_array['last_date'] = $jobInfo->lastdate == '' ? date('Y-m-d') : $jobInfo->lastdate ;

                $data['job_details'] = $job_detail_array;
            }

            return Response(['response'=>$data, 'message'=>'success' , 'status'=>200 ],200);
        }

    }



    public function management():Response {
        // $this->layout = "client";
        // $this->set('jobsActive', 'active');
        // $site_title = $this->getSiteConstant('title');
        // $tagline = $this->getSiteConstant('tagline');
        // $title_for_pages = $site_title . " :: " . $tagline . " - ";
        // $this->set('title_for_layout', $title_for_pages . __d('controller', 'Manage Jobs', true));

        // $this->userLoginCheck();
        // $this->recruiterAccess();
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];


         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        // $userId = Session::get('user_id');

        $jobs = Job::where('user_id',$userId)
        ->orderBy('id','desc')
        ->orderBy('payment_status','desc')
        ->get();

        $jobApply = new Job_apply;
        
        // $data = "";
        
        // if(!empty($jobApply)) {
        //     foreach($jobs as $key => $job){
        //         $data[$key]['totalCandidate'] = $jobApply->getTotalCandidate($job->id);
        //         $data[$key]['newApplicationCount'] = $jobApply->getNewCount($job->id);
        //         $data[$key]['jobAlert'] = Alert_job::where('job_id',$job->id)->count();
        //         $data[$key]['Job'] = $job;
        //     }
        // } else{
        //     $data = "";
        // }
        
        $data = [];  // Initialize $data as an empty array

        if (!empty($jobApply)) {
            foreach ($jobs as $key => $job) {
                $data[$key]['totalCandidate'] = $jobApply->getTotalCandidate($job->id);
                $data[$key]['newApplicationCount'] = $jobApply->getNewCount($job->id);
                $data[$key]['jobAlert'] = Alert_job::where('job_id', $job->id)->count();
                $data[$key]['Job'] = $job;
            }
        } else {
            $data = [];  // You can keep this as an empty array if there are no jobs
        }

        

        return Response(['response'=>$data , 'message' => 'success', 'status' => 200 ],200);

    }

    public function deactive($slug = null):Response {
                
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];


         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        Job::where('slug',$slug)->update(['status' => 0]);
        $msgString = 'Job deactivated successfully.';
        return Response(['response' => $msgString , 'message' => $msgString,'status' => 200],200);
    }

    public function active($slug = null):Response {
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];


         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        Job::where('slug',$slug)->update(['status' => 1]);
        $msgString = 'Job activated successfully.';
        return Response(['response' => $msgString , 'message' => $msgString,'status' => 200],200);
    }

    // public function accdetail(Request $request, $slug = null, $status = null) : Response
    // {
    //     // $this->userLoginCheck();
    //     // $this->recruiterAccess();
    //     $tokenData = $this->requestAuthentication('POST', 1);
    //     $userId = $tokenData['user_id'];


    //      // $this->userLoginCheck();
    //     if(!$this->recruiterAccess($userId)){
    //         return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
    //     }


    //     $userDetails =  User::whereId($userId)
    //     ->select('profile_image','first_name','last_name','user_type','company_logo','location')
    //     ->first();
        
    //     $user_array = array();

    //     if($userDetails->profile_image != "")
    //         $user_array['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userDetails->profile_image;
    //     else 
    //         $user_array['profile_image'] = '';

    //     if($userDetails->company_logo != '')
    //         $user_array['company_logo'] = DISPLAY_EMPLOYER_IMAGES_PATH.$userDetails->company_logo;
    //     else
    //         $user_array['company_logo'] = "";

    //     $user_array['first_name'] = $userDetails->first_name;
    //     $user_array['last_name'] = $userDetails->last_name;
    //     $user_array['user_type'] = $userDetails->user_type;
    //     $user_array['loction'] = $userDetails->location;

    //     $data['userDetails'] = $user_array;
        
        

    //     // $data['userDetails'] = $userDetails;

    //     // Location::where('name',$userDetails->location)

    //     $planDetails = (new Plan)->getcurrentplan($userId);
        
    //     // print_r($planDetails->id);

    //     $data['planDetails'] = '';
    //     if($planDetails->count() > 0){
            
    //         $plan_name = Plan::where('id',$planDetails->plan_id)
    //         ->pluck('plan_name')
    //         ->implode(',');

    //         $data['planDetails'] = $plan_name;
            
    //         //$data['planDetails'] = $planDetails->plan_name;
    //     }
        
    //     $jobInfo = Job::where('slug', $slug)->first();
        
    //     $cat_slug=Category::where('id',$jobInfo->category_id)->first();
    //     $data['job_url'] = HTTP_FAV . 'jobdescription/'. $jobInfo->slug . '/' . $cat_slug->slug;
        
    //     $data['url'] = HTTP_PATH . '/' . $cat_slug->slug . '/' . $jobInfo->slug . '.html';
        
    //     $cat_name = Category::where('id',$jobInfo->category_id)
    //     ->pluck('name')
    //     ->implode(',');

    //     $sub_cat_name = Category::where('id',$jobInfo->subcategory_id)
    //     ->pluck('name')
    //     ->implode(',');

    //     $skill = Skill::whereIn('id',[$jobInfo->skill])
    //     ->pluck('name')
    //     ->toArray();

    //     $designation = Skill::whereIn('id',[$jobInfo->designation])
    //     ->pluck('name')
    //     ->toArray();

    //     $cat = Category::where('id',$jobInfo->category_id)->first();

    //     $work_type = $GLOBALS['worktype'];

    //     $job_detail_array = array();
    //     $job_detail_array['job_id'] = $jobInfo->id;
    //     $job_detail_array['slug'] = $jobInfo->slug;
    //     $job_detail_array['category'] = $cat_name;
    //     $job_detail_array['cat_slug'] = $cat->slug;
    //     $job_detail_array['sub_category'] = $sub_cat_name;
    //     $job_detail_array['contact_name'] = $jobInfo->contact_name;
    //     $job_detail_array['contact_number'] =  $jobInfo->contact_number;
    //     $job_detail_array['skill'] = $skill;
    //     $job_detail_array['location'] = $jobInfo->job_city;
    //     $job_detail_array['designation'] = $designation;
    //     $job_detail_array['work_type'] =  $work_type[$jobInfo->work_type];
    //     $job_detail_array['description'] = $jobInfo->description;
    //     $job_detail_array['company_name'] = $jobInfo->company_name;
    //     $job_detail_array['url'] = $jobInfo->url;
    //     $job_detail_array['company_profile'] = $jobInfo->brief_abtcomp;
    //     $job_detail_array['min_exp'] = $jobInfo->min_exp;
    //     $job_detail_array['max_exp'] = $jobInfo->max_exp;
    //     $job_detail_array['min_salary'] = $jobInfo->min_salary;
    //     $job_detail_array['max_salary'] = $jobInfo->max_salary;
    //     $job_detail_array['currency'] = CURRENCY;
    //     $job_detail_array['title'] = $jobInfo->title;
        
    //     if($jobInfo->logo != ''){
    //         $job_detail_array['logo'] = DISPLAY_JOB_LOGO_PATH.$jobInfo->logo;
    //     }else{
    //         $job_detail_array['logo'] = '';
    //     }
        
    //     $job_detail_array['search_count'] = $jobInfo->search_count;
    //     $job_detail_array['view_count'] = $jobInfo->view_count;
        
    //     $job_detail_array['status'] = $jobInfo->status;
    //     $job_detail_array['created'] = date('d F, Y',strtotime($jobInfo->created));

    //     $jobApply = new Job_apply;

    //     if ($status != '' && $status != null) {
    //         $jobApply = $jobApply->where('job_applies.status', '=', 1);
    //         $jobApply = $jobApply->where('job_applies.job_id', '=', $jobInfo->id);
    //         $jobApply = $jobApply->where('apply_status', '=', $status);
    //     } else {
    //         $jobApply = $jobApply->where('job_applies.status', '=', 1);
    //         $jobApply = $jobApply->where('job_applies.job_id', '=', $jobInfo->id);
    //     }

    //     $separator = [$slug, $status];
    //     $urlSeparator = [];

    //     $keyword = '';

    //     if (!empty($request->all())) {
    //         $keyword = $request->keyword;
    //         $action = $request->action;
    //         $idList = $request->idList;
    //         $statusChange = $request->status_change;
    //         $candidateId = $request->candidate_id;

            

    //         if ($keyword != '') {
    //             $separator[] = 'keyword:' . urlencode($keyword);

    //             $jobApply = $jobApply->join('users' , 'users.id' , 'Job_apply.user_id' );

    //             $jobApply = $jobApply->where('job_applies.apply_status', 'LIKE', '%' . addslashes($keyword) . '%');
    //             $jobApply = $jobApply->orWhere('users.first_name', 'LIKE', '%' . addslashes($keyword) . '%');
    //             $jobApply = $jobApply->orWhere(DB::raw("concat(users.first_name, ' ', users.last_name)"), 'LIKE', '%' . addslashes($keyword) . '%');
    //             $jobApply = $jobApply->orWhere('users.last_name', 'LIKE', '%' . addslashes($keyword) . '%');
    //             $jobApply = $jobApply->orWhere('users.email_address', 'LIKE', '%' . addslashes($keyword) . '%');
    //         }

    //         // if ($action == 'email' && $idList) {
    //         //     session(['email_ids' => $idList]);
    //         //     return view('send_mail');
    //         // }

    //         if ($statusChange != '' && $candidateId) {
    //             Job_apply::where('id', $candidateId)
    //                 ->update(['apply_status' => $statusChange]);
    //         }
    //     } elseif (!empty($request->route())) {
    //         $keyword = urldecode(trim($request->route('keyword')));
    //     }

    //     $jobApply = $jobApply->orderBy('id','desc');
    
    //     $separator = implode('/', $separator);
    //     $urlSeparator = implode('/', $urlSeparator);

    //     $candidates = $jobApply->get();
        
    //     $candidate_array = array();
    //     foreach($candidates as $key => $user){
    //         $candidate_array[$key]['apply_status'] = $user->apply_status;
    //         $candidate_array[$key]['rating'] = $user->rating;
    //         $candidate_array[$key]['created'] = date('d F,Y',strtotime($user->created));
    //         $candidate_array[$key]['status'] = $user->status;
    //         $candidate_array[$key]['user_id'] = $user->user_id;
    //         $candidate_array[$key]['id'] = $user->id;
    //         $candidate_array[$key]['new_status'] = $user->new_status;

    //         $userDeatails = User::where('id',$user->user_id)->select('first_name','email_address','last_name','slug','contact')->first();
    //         $candidate_array[$key]['email_address'] = $userDeatails->email_address;
    //         $candidate_array[$key]['name'] = $userDeatails->first_name." ".$userDeatails->last_name;
    //         $candidate_array[$key]['slug'] = $userDeatails->slug;
    //         $candidate_array[$key]['contact'] = $userDeatails->contact;
    //     }

    //     // $candidates = Job_apply::where($condition)
    //     //     ->orderByRaw($order)
    //     //     ->get();
        
    //     $active_option = $GLOBALS['active_option'];
    //     $data['active_option'] = $active_option;

    //     $jobApply = new Job_apply;

    //     $data['activeJobs'] = $jobApply->getStatusCount($jobInfo->id,'active');
    //     $data['shortList'] = $jobApply->getStatusCount($jobInfo->id,'short_list');
    //     $data['interview'] = $jobApply->getStatusCount($jobInfo->id,'interview');
    //     $data['offer'] = $jobApply->getStatusCount($jobInfo->id,'offer');
    //     $data['accept'] = $jobApply->getStatusCount($jobInfo->id,'accept');
    //     $data['notSuitable'] = $jobApply->getStatusCount($jobInfo->id,'not_suitable');
        
    //     $data['totalCandidate'] = $jobApply->getTotalCandidate($jobInfo->id);
    //     $data['newApplicationCount'] = $jobApply->getNewCount($jobInfo->id);


    //     $data['jobInfo'] = $job_detail_array;
    //     $data['status'] = $status;
    //     $data['candidates'] = $candidate_array;

    //     return Response(['response' => $data , 'message' => 'success' ,'status' => 200 ],200);
    // }
    
    public function accdetail(Request $request, $slug = null, $status = null) : Response
    {
        // $this->userLoginCheck();
        // $this->recruiterAccess();
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];


         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }


        $userDetails =  User::whereId($userId)
        ->select('profile_image','first_name','last_name','user_type','company_logo','location')
        ->first();
        
        $user_array = array();

        if($userDetails->profile_image != "")
            $user_array['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$userDetails->profile_image;
        else 
            $user_array['profile_image'] = '';

        if($userDetails->company_logo != '')
            $user_array['company_logo'] = DISPLAY_EMPLOYER_IMAGES_PATH.$userDetails->company_logo;
        else
            $user_array['company_logo'] = "";

        $user_array['first_name'] = $userDetails->first_name;
        $user_array['last_name'] = $userDetails->last_name;
        $user_array['user_type'] = $userDetails->user_type;
        $user_array['loction'] = $userDetails->location;

        $data['userDetails'] = $user_array;
        
        

        // $data['userDetails'] = $userDetails;

        // Location::where('name',$userDetails->location)

        $planDetails = (new Plan)->getcurrentplan($userId);
        
        // print_r($planDetails->id);

        $data['planDetails'] = '';
        
        if(isset($planDetails)){
            if($planDetails->count() > 0){
            
                $plan_name = Plan::where('id',$planDetails->plan_id)
                ->pluck('plan_name')
                ->implode(',');
    
                $data['planDetails'] = $plan_name;
                
                //$data['planDetails'] = $planDetails->plan_name;
            }
        }

        
        $jobInfo = Job::where('slug', $slug)->first();
        $cat_slug=Category::where('id',$jobInfo->category_id)->first();
        $data['job_url'] = HTTP_FAV . 'jobdescription/'. $jobInfo->slug . '/' . $cat_slug->slug;
        
        $data['url'] = HTTP_PATH . '/' . $cat_slug->slug . '/' . $jobInfo->slug . '.html';
        $cat_name = Category::where('id',$jobInfo->category_id)
        ->pluck('name')
        ->implode(',');

        $sub_cat_name = Category::where('id',$jobInfo->subcategory_id)
        ->pluck('name')
        ->implode(',');

        $skill = Skill::whereIn('id',[$jobInfo->skill])
        ->pluck('name')
        ->toArray();

        $designation = Skill::whereIn('id',[$jobInfo->designation])
        ->pluck('name')
        ->toArray();

        $cat = Category::where('id',$jobInfo->category_id)->first();

        $work_type = $GLOBALS['worktype'];

        $job_detail_array = array();
        $job_detail_array['job_id'] = $jobInfo->id;
        $job_detail_array['slug'] = $jobInfo->slug;
        $job_detail_array['category'] = $cat_name;
        $job_detail_array['cat_slug'] = $cat->slug;
        $job_detail_array['sub_category'] = $sub_cat_name;
        $job_detail_array['contact_name'] = $jobInfo->contact_name;
        $job_detail_array['contact_number'] =  $jobInfo->contact_number;
        $job_detail_array['skill'] = $skill;
        $job_detail_array['location'] = $jobInfo->job_city;
        $job_detail_array['designation'] = $designation;
        if(!empty($jobInfo->work_type)) {
                    $job_detail_array['work_type'] =  $work_type[$jobInfo->work_type];

        } else{
                                $job_detail_array['work_type'] =  "N/A";

        }
        $job_detail_array['description'] = $jobInfo->description;
        $job_detail_array['company_name'] = $jobInfo->company_name;
        $job_detail_array['url'] = $jobInfo->url;
        $job_detail_array['company_profile'] = $jobInfo->brief_abtcomp;
        $job_detail_array['min_exp'] = $jobInfo->min_exp;
        $job_detail_array['max_exp'] = $jobInfo->max_exp;
        $job_detail_array['min_salary'] = $jobInfo->min_salary;
        $job_detail_array['max_salary'] = $jobInfo->max_salary;
        $job_detail_array['currency'] = CURRENCY;
        $job_detail_array['title'] = $jobInfo->title;
        
        if($jobInfo->logo != ''){
            $job_detail_array['logo'] = DISPLAY_JOB_LOGO_PATH.$jobInfo->logo;
        }else{
            $job_detail_array['logo'] = '';
        }
        
        $job_detail_array['search_count'] = $jobInfo->search_count;
        $job_detail_array['view_count'] = $jobInfo->view_count;
        
        $job_detail_array['status'] = $jobInfo->status;
        $job_detail_array['created'] = date('d F, Y',strtotime($jobInfo->created));

        $jobApply = new Job_apply;

        if ($status != '' && $status != null) {
            $jobApply = $jobApply->where('job_applies.status', '=', 1);
            $jobApply = $jobApply->where('job_applies.job_id', '=', $jobInfo->id);
            $jobApply = $jobApply->where('apply_status', '=', $status);
        } else {
            $jobApply = $jobApply->where('job_applies.status', '=', 1);
            $jobApply = $jobApply->where('job_applies.job_id', '=', $jobInfo->id);
        }

        $separator = [$slug, $status];
        $urlSeparator = [];

        $keyword = '';

        if (!empty($request->all())) {
            $keyword = $request->keyword;
            $action = $request->action;
            $idList = $request->idList;
            $statusChange = $request->status_change;
            $candidateId = $request->candidate_id;
            $userId = $request->user_id;

            

            if ($keyword != '') {
                $separator[] = 'keyword:' . urlencode($keyword);

                $jobApply = $jobApply->join('users' , 'users.id' , 'Job_apply.user_id' );
                $jobApply = $jobApply->where('job_applies.apply_status', 'LIKE', '%' . addslashes($keyword) . '%');
                $jobApply = $jobApply->orWhere('users.first_name', 'LIKE', '%' . addslashes($keyword) . '%');
                $jobApply = $jobApply->orWhere(DB::raw("concat(users.first_name, ' ', users.last_name)"), 'LIKE', '%' . addslashes($keyword) . '%');
                $jobApply = $jobApply->orWhere('users.last_name', 'LIKE', '%' . addslashes($keyword) . '%');
                $jobApply = $jobApply->orWhere('users.email_address', 'LIKE', '%' . addslashes($keyword) . '%');
            }

            // if ($action == 'email' && $idList) {
            //     session(['email_ids' => $idList]);
            //     return view('send_mail');
            // }

            if ($statusChange != '' && $candidateId) {
                Job_apply::where('id', $candidateId)
                    ->update(['apply_status' => $statusChange]);
                    
                    $candidate_info = User::where('id', $userId)->first();
                    $candidate_name = $candidate_info->first_name;
                    $email = ucfirst($candidate_info->email_address);
                    // if ($candidate_info) {
                    //     echo $candidate_info->first_name;
                    // } else {
                    //     // Handle case when user with the given ID is not found
                    //     echo "User not found.";
                    // }
                    
                //Email start
                    
                $emailTemplate = Emailtemplate::where('id',53)->first();

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
                        
                        // echo $candidate_info->first_name;

                        $job_title = $jobInfo->title;
                        $company_email = $jobInfo->company_name;
                        $company = $jobInfo->company_name;
                        $userName = $candidate_name;
                        $message = nl2br($request->message);
                        $subject = $request->subject;
                        $currentYear = date('Y', time());
                        $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

                        $toSubArray = array('[!username!]', '[!status!]','[!company!]','[!company_email!]', '[!MESSAGE!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!subject!]', '[!Job_TITLE!]');

                        $fromSubArray = array($userName, $statusChange, $company,$company_email,$message, $currentYear, HTTP_PATH, SITE_TITLE , $sitelink, SITE_URL , $subject, $job_title);

                        $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                        $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                        Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                        // $mailFileArray
                        $msg='success';
                        $status=200;
                // Email End Here
            }
        } elseif (!empty($request->route())) {
            $keyword = urldecode(trim($request->route('keyword')));
        }

        $jobApply = $jobApply->orderBy('id','desc');
    
        $separator = implode('/', $separator);
        $urlSeparator = implode('/', $urlSeparator);

        $candidates = $jobApply->get();
        
        $candidate_array = array();
        $candidateCount = 0;
        foreach($candidates as $key => $user){

            $userDeatails = User::where('id',$user->user_id)->select('first_name','email_address','last_name','slug','contact')->first();
            $coverletters = Cover_letter::where('user_id',$user->user_id)->get();

            $coverletters_array = array();
            
            

            foreach($coverletters as $key1 => $coverletter){
                $coverletters_array[$key1]['id']=$coverletter->id;
                $coverletters_array[$key1]['title']=$coverletter->title;
                $coverletters_array[$key1]['description']=$coverletter->description;

            }
            if($userDeatails != ''){
                $candidate_array[$candidateCount]['coverletters'] = $coverletters_array;
                $candidate_array[$candidateCount]['apply_status'] = $user->apply_status;
                $candidate_array[$candidateCount]['rating'] = $user->rating;
                $candidate_array[$candidateCount]['created'] = date('d F,Y',strtotime($user->created));
                $candidate_array[$candidateCount]['status'] = $user->status;
                $candidate_array[$candidateCount]['user_id'] = $user->user_id;
                $candidate_array[$candidateCount]['id'] = $user->id;
                $candidate_array[$candidateCount]['new_status'] = $user->new_status;

            
                $candidate_array[$candidateCount]['email_address'] = $userDeatails->email_address;
                $candidate_array[$candidateCount]['name'] = $userDeatails->first_name." ".$userDeatails->last_name;
                $candidate_array[$candidateCount]['slug'] = $userDeatails->slug;
                $candidate_array[$candidateCount]['contact'] = $userDeatails->contact;
                
                $candidateCount++;
            }

        }

        // $candidates = Job_apply::where($condition)
        //     ->orderByRaw($order)
        //     ->get();
        
        $active_option = $GLOBALS['active_option'];
        $data['active_option'] = $active_option;

        $jobApply = new Job_apply;
        
        $activeJobIds = $jobApply::where('job_id', $jobInfo->id)
            ->where('apply_status', 'active')
            ->pluck('user_id');
        
        // Check how many of these IDs exist in the User table
        if ($activeJobIds->isNotEmpty()) {
            $activeUserCount = User::whereIn('id', $activeJobIds)->count();
            $data['activeJobs'] = $activeUserCount;
        } else {
            $data['activeJobs'] = 0;
        }
        
        // Define the job ID
$jobId = $jobInfo->id;

// Get counts for various statuses
$shortListIds = $jobApply::where('job_id', $jobId)
    ->where('apply_status', 'short_list')
    ->pluck('user_id');
$data['shortList'] = $shortListIds->isNotEmpty() ? User::whereIn('id', $shortListIds)->count() : 0;

$interviewIds = $jobApply::where('job_id', $jobId)
    ->where('apply_status', 'interview')
    ->pluck('user_id');
$data['interview'] = $interviewIds->isNotEmpty() ? User::whereIn('id', $interviewIds)->count() : 0;

$offerIds = $jobApply::where('job_id', $jobId)
    ->where('apply_status', 'offer')
    ->pluck('user_id');
$data['offer'] = $offerIds->isNotEmpty() ? User::whereIn('id', $offerIds)->count() : 0;

$acceptIds = $jobApply::where('job_id', $jobId)
    ->where('apply_status', 'accept')
    ->pluck('user_id');
$data['accept'] = $acceptIds->isNotEmpty() ? User::whereIn('id', $acceptIds)->count() : 0;

$notSuitableIds = $jobApply::where('job_id', $jobId)
    ->where('apply_status', 'not_suitable')
    ->pluck('user_id');
$data['notSuitable'] = $notSuitableIds->isNotEmpty() ? User::whereIn('id', $notSuitableIds)->count() : 0;

// Get total candidate count
$totalCandidateIds = $jobApply::where('job_id', $jobId)
    ->pluck('user_id');
$data['totalCandidate'] = $totalCandidateIds->isNotEmpty() ? User::whereIn('id', $totalCandidateIds)->count() : 0;

// Get new application count
$newApplicationIds = $jobApply::where('job_id', $jobId)
    ->where('apply_status', 'new')
    ->pluck('user_id');
$data['newApplicationCount'] = $newApplicationIds->isNotEmpty() ? User::whereIn('id', $newApplicationIds)->count() : 0;



        // $data['shortList'] = $jobApply->getStatusCount($jobInfo->id,'short_list');
        // $data['interview'] = $jobApply->getStatusCount($jobInfo->id,'interview');
        // $data['offer'] = $jobApply->getStatusCount($jobInfo->id,'offer');
        // $data['accept'] = $jobApply->getStatusCount($jobInfo->id,'accept');
        // $data['notSuitable'] = $jobApply->getStatusCount($jobInfo->id,'not_suitable');
        
        // $data['totalCandidate'] = $jobApply->getTotalCandidate($jobInfo->id);
        // $data['newApplicationCount'] = $jobApply->getNewCount($jobInfo->id);


        $data['jobInfo'] = $job_detail_array;
        $data['status'] = $status;
        $data['candidates'] = $candidate_array;

        return Response(['response' => $data , 'message' => 'success' ,'status' => 200 ],200);
    }

    public function shortList():Response{
        
        
        if($_SERVER["REQUEST_METHOD"] == 'GET' ){
            $tokenData = $this->requestAuthentication('GET', 1);
        }else{
            $tokenData = $this->requestAuthentication('POST', 1);
        }

        
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $ShortLists = Short_list::join('jobs', 'short_lists.job_id','=','jobs.id')
        ->where('jobs.status', 1)
        ->where('jobs.job_status', 0)
        ->where('short_lists.user_id', $userId)
        ->select('jobs.id as job_id',
        'jobs.title','jobs.slug' ,
        'jobs.work_type',
        'jobs.expire_time',
        'short_lists.id as short_lists_id',
        'jobs.category_id',
        'jobs.user_id',
        'jobs.logo',
        'jobs.company_name',
        'jobs.job_city',
        'short_lists.created',
        'jobs.skill as skill',
        'jobs.min_salary as min_salary',
        'jobs.max_salary as max_salary'
        )
        ->orderBy('short_lists.id','Desc')
        ->get();
        
        
        // print_r($ShortLists);
        // exit();


        // $ShortLists = Short_list::with(['job' => function ($query) {
        //         $query->select('id','title','slug' ,'work_type','expire_time');
        //         $query->where('status', 1)
        //               ->where('job_status', 0);
        //     }])
        //     ->where('user_id', $userId)
        //     ->orderBy('short_lists.id','Desc')
        //     ->get();

        $work = $GLOBALS['worktype'];
    
        $list = array();
    
        foreach($ShortLists as $key => $lists){
            // $list[$key]['job_id'] = $lists->job_id;
            
            $is_applied = 0;
 
            if (isset($userId) && $userId > 0) {
                $apply_status = Job_apply::where('user_id', $userId)
                    ->where('job_id', $lists->id)
                    ->first();
    
                if ($apply_status) {
                    $is_applied = 1;
                }
            }
            
            $jobIds = explode(',', $lists->skill);
            
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
            
            if ($lists->min_salary && $lists->max_salary) {
                $salary = CURRENCY . ' ' . intval($lists->min_salary) . " - " . CURRENCY . ' ' . intval($lists->max_salary);
            } else {
                $salary = "N/A";
            }
        
            $list[$key]['id'] = $lists->job_id;
            $list[$key]['title'] = $lists->title;
            $list[$key]['slug'] = $lists->slug;
            $list[$key]['work_type'] =  $work[$lists->work_type];
            $list[$key]['expire_time'] =  date('jS F, Y', $lists->expire_time);
            $list[$key]['short_lists_id'] = $lists->short_lists_id;
            $list[$key]['cat_slug'] = Category::where('id',$lists->category_id)->pluck('slug')->implode(',');
            
            $profile_image = User::where('id',$lists->user_id)->pluck('profile_image')->implode(',');

            $list[$key]['company_name']  = $lists->company_name;
            $list[$key]['logo'] = ''; 
            if($lists->logo != '' && file_exists(UPLOAD_JOB_LOGO_PATH . $lists->logo)){
                $list[$key]['logo'] = DISPLAY_JOB_LOGO_PATH.$lists->logo;
            }

            $list[$key]['profile_image'] = '';

            if($profile_image !='' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH . $profile_image )){
                $list[$key]['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$profile_image;
            }
            
            $list[$key]['location'] = $lists->job_city;
            $list[$key]['date'] = date('F j, Y',strtotime($lists->created));
            $list[$key]['is_applied'] = $is_applied;
            $list[$key]['is_saved'] = 1;
            $list[$key]['skill'] = $skills_array;
            $list[$key]['salary'] = $salary;
        }



        $data['ShortLists'] = $list;

        return Response(['response' => $data , 'message' => 'success' , 'status'=> 200],200);


    }
    
    // public function edit(Request $request,$slug = null):Response {

    //     $tokenData = $this->requestAuthentication('POST', 1);
    //     $userId = $tokenData['user_id'];

    //     if(!$this->recruiterAccess($userId)){
    //         return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
    //     }

    //     $data['slug'] = $slug;

    //     $logo_status = User::where('id',$userId)
    //     ->pluck('profile_image')->implode(',');

    //     $data['logo_status'] =  $logo_status;

    //     $categories = (new Category)->getCategoryList();

    //     $data['categories'] = $categories;

    //     $subcategories = array();
    //     $data['subcategories'] = $subcategories;

    //     $skillList = Skill::where('type','Skill')
    //     ->where('status',1)
    //     ->select('id','name')
    //     ->orderBy('name','asc')
    //     ->get();

    //     $data['skillList'] = $skillList;

    //     $designationlList = Skill::where('type','Designation')
    //     ->where('status',1)
    //     ->select('id','name')
    //     ->orderBy('name','asc')
    //     ->get();

    //     $data['designationlList'] = $designationlList;

    //     $locationlList = Location::where('status',1)
    //     ->select('id','name')
    //     ->orderBy('name','asc')
    //     ->get();

    //     $data['locationlList'] = $locationlList;

    //     $msgString = '';
    //     global $extentions;
        
    //     $data['sallery'] =  $GLOBALS['sallery'];
    //     $data['experience'] = $GLOBALS['experienceArray'];
    //     $data['worktype'] =  $GLOBALS['worktype'];
        
    //     $planDetails = (new Plan)->getcurrentplan($userId);

    //     $data['planDetails'] = '';
    //     if($planDetails->count() > 0){

    //         $plan_name = Plan::where('id',$planDetails->plan_id)
    //         ->pluck('plan_name')
    //         ->implode(',');

    //         $data['planDetails'] = $plan_name;
    //     }

    //     if(!empty($request->all())){
            
    //         $rules = array(
    //             'job_title' => 'required',
    //             'category' => 'required',
    //             'jobDescription' => 'required',
    //             'company_name' => 'required',
    //             'work_type' => 'required',
    //             'contact_name' => 'required',
    //             'contact_number' => 'required',
    //             'companyProfile' => 'required',
    //             'experience' => 'required',
    //             'annual_salary'=>'required',
    //             'skill' => 'required',
    //             'designation' => 'required',
    //             'location' => 'required',
    //             'last_date' => 'required',
    //          //   'company_website' => 'required'
    //         );

    //         $validator = Validator::make($request->all(),$rules);

    //         $validator->setAttributeNames([
    //             'job_title' => 'Job title',
    //             'category' => 'Category',
    //             'jobDescription' => 'Job description',
    //             'company_name' => 'Company name',
    //             'work_type' => 'Work type',
    //             'contact_name' => 'Contact name',
    //             'contact_number' => 'Contact number',
    //             'companyProfile' => 'Company profile',
    //             'experience' => 'Experience',
    //             'annual_salary'=>'Annual Salary',
    //             'skill' => 'Skill',
    //             'designation' => 'Designation',
    //             'location' => 'Job location',
    //             'last_date' => 'Expire time',
    //         ]);

    //         if($validator->fails()){
    //             $msgString = $this->validatersErrorString($validator->errors());
 
    //             return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
    //         }else{

    //             $msgString .= $this->checkSwearWord($request->job_title);
    //             $msgString .= $this->checkSwearWord($request->jobDescription);
    //             $msgString .= $this->checkSwearWord($request->company_name);
    //             $msgString .= $this->checkSwearWord($request->contact_name);
    //             $msgString .= $this->checkSwearWord($request->contact_number);
    //             $msgString .= $this->checkSwearWord($request->companyProfile);

    //             $youtube_link = '';

    //             if($request->logo != ''){
    //                 $file = explode( ";base64,", $request->logo);
    //                 $image_type_pieces = explode( "image/", $file[0] );
    //                 $image_type = $image_type_pieces[1];
    //                 // $file = base64_decode($request->logo);
    //                 $originalName = Str::random(10).'.'.$image_type;
    //             }else{
    //                 $originalName = '';
    //             }

    //             if (isset($msgString) && $msgString != '') {

    //                 $subcategories = (new Category)->getSubCategoryList($request->category);

    //                 $data['subcategories'] = $subcategories;

    //                 return Response(['response' => $data , 'message' => $msgString , 'status' => 500,],200);
    //             }else{

    //                 $keyword = $request->job_title;

    //                 $keywordId = Keyword::where('name',$keyword)
    //                 ->where('type','Job')
    //                 ->select('id')
    //                 ->get();

    //                 if($keywordId->count() == 0){
    //                     $newKeyword = new Keyword;
    //                     $newKeyword->name = $keyword;
    //                     $newKeyword->slug = $this->createSlug($keyword,'keywords');
    //                     $newKeyword->status = 1;
    //                     $newKeyword->approval_status = 0;
    //                     $newKeyword->type = 'job';
    //                     $newKeyword->created = date('Y-m-d H:s:i');
    //                     $newKeyword->course_id = 0;
    //                     $newKeyword->save();
    //                 }

    //                 $jobId = Job::where('slug',$slug)->pluck('id')->implode(',');

    //                 $newJob = Job::find($jobId);

    //                 $newJob->title = $request->job_title;
    //                 $newJob->category_id = $request->category;
    //                 $newJob->description = $request->jobDescription;
    //                 $newJob->company_name = $request->company_name;
    //                 $newJob->work_type = $request->work_type;
    //                 $newJob->contact_name = $request->contact_name;
    //                 $newJob->contact_number = $request->contact_number;
    //                 $newJob->url = $request->company_website;
    //                 $newJob->brief_abtcomp = $request->companyProfile;
    //                 $newJob->designation = $request->designation;
    //                 $newJob->job_city = $request->location;
    //                 $newJob->lastdate = $request->last_date;
    //                 $newJob->expire_time = strtotime($request->last_date); 
                    
                    
    //                 if($request->skill != '' ){
    //                     $newJob->skill = implode(',',$request->skill);
    //                 }

    //                 $exp = explode('-',$request->experience);
    //                 $newJob->min_exp = $exp[0];
    //                 $newJob->max_exp = $exp[1];

    //                 $sallery = explode('-',$request->annual_salary);
    //                 $newJob->min_salary = $sallery[0];
    //                 $newJob->max_salary = $sallery[1];

    //                 if($originalName != ''){
    //                     $decoded_string = base64_decode($file[1]);
    //                     file_put_contents(UPLOAD_JOB_LOGO_PATH.$originalName, $decoded_string);
    //                     $newJob->logo = $originalName;
    //                 }

    //                 if($request->subCategory){
    //                     $newJob->subcategory_id = implode(',',$request->subCategory);
    //                 }else{
    //                     $newJob->subcategory_id = 0;
    //                 }

    //                 if($newJob->save()){

    //                     $jobId = $newJob->id;
    //                     $jobDetail = Job::with('category','user')->find($jobId);
    //                     $title = $jobDetail->title;
    //                     $category = $jobDetail->category->name;
    //                     $skillIds = $jobDetail->skill;
    //                     $location = $jobDetail->job_city;
    //                     $minExp = $jobDetail->min_exp . ' Year';
    //                     $maxExp = $jobDetail->max_exp . ' Year';
    //                     $min_salary = CURRENCY . ' ' . intval($jobDetail->min_salary);
    //                     $max_salary = CURRENCY . ' ' . intval($jobDetail->max_salary);
    //                     $description = $jobDetail->description;
    //                     $company_name = $jobDetail->company_name;
    //                     $contact_number = $jobDetail->contact_number;
    //                     $website = $jobDetail->url ? $jobDetail->url : 'N/A';
    //                     $address = $jobDetail->address ? $jobDetail->address : 'N/A';

    //                     $designation = Skill::where('status',1)
    //                     ->where('type','Designation')
    //                     ->where('id',$jobDetail->designation)
    //                     ->select('name')
    //                     ->get();

    //                     $skill = (new Skill)->getSkillsNamesByIds($skillIds);

    //                     $username = $jobDetail->user->first_name . ' ' . $jobDetail->user->last_name;

    //                     $email = $jobDetail->user->email_address;

    //                     $currentYear = date('Y', time());

    //                     $emailTemplate = Emailtemplate::where('id',46)->first();

    //                     $get_lang=DEFAULT_LANGUAGE;
    //                     if( $get_lang =='fra'){
    //                         $template_subject= $emailTemplate->subject_fra;
    //                         $template_body= $emailTemplate->template_fra;
    //                     }else if( $get_lang =='de'){
    //                         $template_subject= $emailTemplate->subject_de;
    //                         $template_body= $emailTemplate->template_de;
    //                     }else{
    //                         $template_subject= $emailTemplate->subject;
    //                         $template_body= $emailTemplate->template;
    //                     }

    //                     $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

    //                     $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!min_experience!]', '[!max_experience!]', '[!min_salary!]', '[!max_salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');

    //                     $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $minExp, $maxExp, $min_salary, $max_salary, $description, $company_name, $contact_number, $website, $address, SITE_TITLE);

    //                     $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
    //                     $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

    //                     try {
    //                         Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
    //                     } catch(\Exception $e) {
    //                         $msgString=$e->getMessage();
    //                     }
                        
    //                     return Response(['response' => $data , 'message' =>'success','status'=>200 ],200);

    //                 }
    //             }

    //         }

    //     }else{

    //         $job = Job::where('slug',$slug)->first();
            
    //         if(file_exists(UPLOAD_JOB_LOGO_PATH.$job->logo) && $job->logo != ''){
    //             $logo = DISPLAY_JOB_LOGO_PATH.$job->logo;
    //         }else{
    //             $logo = '';
    //         }
            
    //         $data['job']['job_title'] = $job->title;
    //         $data['job']['category'] = $job->category_id;
    //         $data['job']['subcategory_id'] = $job->subcategory_id;
    //         $data['job']['company_name'] = $job->company_name;
    //         $data['job']['contact_name'] = $job->contact_name;
    //         $data['job']['contact_number'] = $job->contact_number;
    //         $data['job']['work_type'] = $job->work_type;
    //         $data['job']['company_website'] = $job->url;
    //         $data['job']['companyProfile'] = $job->brief_abtcomp;
    //         $data['job']['skill'] = explode(',',$job->skill);
    //         $data['job']['location'] = $job->job_city;
    //         $data['job']['experience'] = $job->min_exp.'-'.$job->max_exp;
    //         $data['job']['annual_salary'] = $job->min_salary.'-'.$job->max_salary;
    //         $data['job']['logo'] = '';
    //         $data['job']['logo_path'] = $logo;
    //         $data['job']['last_date'] = $job->lastdate;
    //         $data['job']['jobDescription'] = $job->description;
    //         $data['job']['designation'] = $job->designation;

    //         $subcategories = (new Category)->getSubCategoryList($job->category_id);
    //         $data['subcategories'] = $subcategories;

    //         return Response(['response' => $data , 'message' =>'success','status'=>200 ],200);


    //     }

    // }
    public function edit(Request $request,$slug = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $data['slug'] = $slug;

        $logo_status = User::where('id',$userId)
        ->pluck('profile_image')->implode(',');

        $data['logo_status'] =  $logo_status;

        $categories = (new Category)->getCategoryList();

        $data['categories'] = $categories;

        $subcategories = array();
        $data['subcategories'] = $subcategories;

        $skillList = Skill::where('type','Skill')
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['skillList'] = $skillList;

        $designationlList = Skill::where('type','Designation')
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['designationlList'] = $designationlList;

        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['locationlList'] = $locationlList;

        $msgString = '';
        global $extentions;
        
        $data['sallery'] =  $GLOBALS['sallery'];
        $data['experience'] = $GLOBALS['experienceArray'];
        $data['worktype'] =  $GLOBALS['worktype'];
        
        $planDetails = (new Plan)->getcurrentplan($userId);

        $data['planDetails'] = '';
        if($planDetails->count() > 0){

            $plan_name = Plan::where('id',$planDetails->plan_id)
            ->pluck('plan_name')
            ->implode(',');

            $data['planDetails'] = $plan_name;
        }

        if(!empty($request->all())){
            
            $rules = array(
                'job_title' => 'required',
                'category' => 'required',
                'jobDescription' => 'required',
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
             //   'company_website' => 'required'
            );

            $validator = Validator::make($request->all(),$rules);

            $validator->setAttributeNames([
                'job_title' => 'Job title',
                'category' => 'Category',
                'jobDescription' => 'Job description',
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

            if($validator->fails()){
                $msgString = $this->validatersErrorString($validator->errors());
 
                return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
            }else{

                $msgString .= $this->checkSwearWord($request->job_title);
                $msgString .= $this->checkSwearWord($request->jobDescription);
                $msgString .= $this->checkSwearWord($request->company_name);
                $msgString .= $this->checkSwearWord($request->contact_name);
                $msgString .= $this->checkSwearWord($request->contact_number);
                $msgString .= $this->checkSwearWord($request->companyProfile);

                $youtube_link = '';

                if($request->logo != ''){
                    $file = explode( ";base64,", $request->logo);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    // $file = base64_decode($request->logo);
                    $originalName = Str::random(10).'.'.$image_type;
                }else{
                    $originalName = '';
                }

                if (isset($msgString) && $msgString != '') {

                    $subcategories = (new Category)->getSubCategoryList($request->category);

                    $data['subcategories'] = $subcategories;

                    return Response(['response' => $data , 'message' => $msgString , 'status' => 500,],200);
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

                    $jobId = Job::where('slug',$slug)->pluck('id')->implode(',');

                    $newJob = Job::find($jobId);

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
                    $newJob->expire_time = strtotime($request->last_date); 
                    
                    
                    if($request->skill != '' ){
                        $newJob->skill = implode(',',$request->skill);
                    }

                    $exp = explode('-',$request->experience);
                    $newJob->min_exp = $exp[0];
                    $newJob->max_exp = $exp[1];

                    $sallery = explode('-',$request->annual_salary);
                    $newJob->min_salary = $sallery[0];
                    $newJob->max_salary = $sallery[1];

                    if($originalName != ''){
                        $decoded_string = base64_decode($file[1]);
                        file_put_contents(UPLOAD_JOB_LOGO_PATH.$originalName, $decoded_string);
                        $newJob->logo = $originalName;
                    }

                    if($request->subCategory){
                        $newJob->subcategory_id = implode(',',$request->subCategory);
                    }else{
                        $newJob->subcategory_id = 0;
                    }

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
                            Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
                        } catch(\Exception $e) {
                            $msgString=$e->getMessage();
                        }
                        
                        return Response(['response' => $data , 'message' =>'success','status'=>200 ],200);

                    }
                }

            }

        }else{

            $job = Job::where('slug',$slug)->first();
            
            if(file_exists(UPLOAD_JOB_LOGO_PATH.$job->logo) && $job->logo != ''){
                $logo = DISPLAY_JOB_LOGO_PATH.$job->logo;
            }else{
                $logo = '';
            }
            
            $data['job']['job_title'] = $job->title;
            $data['job']['category'] = $job->category_id;
            $data['job']['subcategory_id'] = $job->subcategory_id;
            $data['job']['company_name'] = $job->company_name;
            $data['job']['contact_name'] = $job->contact_name;
            $data['job']['contact_number'] = $job->contact_number;
            $data['job']['work_type'] = $job->work_type;
            $data['job']['company_website'] = $job->url;
            $data['job']['companyProfile'] = $job->brief_abtcomp;
            $data['job']['skill'] = explode(',',$job->skill);
            $data['job']['location'] = $job->job_city;
            $data['job']['experience'] =  $job->min_exp != '' ? $job->min_exp.'-'.$job->max_exp: '';
            $data['job']['annual_salary'] = $job->min_salary != '' ? $job->min_salary.'-'.$job->max_salary : '';
            $data['job']['logo'] = '';
            $data['job']['logo_path'] = $logo;
            $data['job']['last_date'] = $job->lastdate;
            $data['job']['jobDescription'] = $job->description;
            $data['job']['designation'] = $job->designation;

            $subcategories = (new Category)->getSubCategoryList($job->category_id);
            $data['subcategories'] = $subcategories;

            return Response(['response' => $data , 'message' =>'success','status'=>200 ],200);


        }

    }
    
    public function applied():Response {
        
        if($_SERVER["REQUEST_METHOD"] == 'GET' ){
            $tokenData = $this->requestAuthentication('GET', 1);
        }else{
            $tokenData = $this->requestAuthentication('POST', 1);
        }

        $userId = $tokenData['user_id'];

        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $jobApplied = Job_apply::join('jobs','jobs.id','=','job_applies.job_id')
        ->where('job_applies.user_id',$userId)
        ->where('job_applies.status',1)
        ->select('jobs.title',
        'jobs.work_type',
        'job_applies.created',
        'job_applies.apply_status',
        'jobs.id','jobs.slug',
        'jobs.category_id',
        'jobs.logo',
        'jobs.user_id',
        'jobs.job_city',
        'jobs.company_name',
        'job_applies.new_status',
        'job_applies.rating',
        'job_applies.attachment_ids',
        'job_applies.cover_letter_id',
        'job_applies.user_employer_id',
        'job_applies.id as aid',
        'jobs.skill as skill',
        'jobs.min_salary as min_salary',
        'jobs.max_salary as max_salary'
        )
        ->orderBy('id','Desc')
        ->get();

        $jobApply = array();
        
        $worktype = $GLOBALS['worktype'];
        

        foreach($jobApplied  as $key =>  $jobs_applied){
            
            $is_saved = 0;
            
            if (isset($userId) && $userId > 0) {
                
                $save_status = Short_list::where('short_lists.user_id', $userId)
                    ->join('jobs','short_lists.job_id','=','jobs.id')
                    ->where('short_lists.job_id', $jobs_applied->id)
                    ->where('jobs.job_status', 0)
                    ->first();
    
                if ($save_status) {
                    $is_saved = 1;
                }
            }
            
            $jobIds = explode(',', $jobs_applied->skill);
            
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
            
            if ($jobs_applied->min_salary && $jobs_applied->max_salary) {
                $salary = CURRENCY . ' ' . intval($jobs_applied->min_salary) . " - " . CURRENCY . ' ' . intval($jobs_applied->max_salary);
            } else {
                $salary = "N/A";
            }
                
            $jobApply[$key]['title'] = $jobs_applied->title;
            $jobApply[$key]['worktype'] = $worktype[$jobs_applied->work_type];
            $jobApply[$key]['created'] = date('jS F, Y',strtotime($jobs_applied->created));
            $jobApply[$key]['status'] = $jobs_applied->apply_status;
            $jobApply[$key]['id'] = $jobs_applied->id;
            $jobApply[$key]['slug'] = $jobs_applied->slug;
            $jobApply[$key]['cat_slug'] = Category::where('id',$jobs_applied->category_id)->pluck('slug')->implode(',');

            $profile_image = User::where('id',$jobs_applied->user_id)->pluck('profile_image')->implode(',');

            $jobApply[$key]['date'] =  date('F j, Y',strtotime($jobs_applied->created));

            $jobApply[$key]['logo'] = '';
            if($jobs_applied->logo != '' && file_exists(UPLOAD_JOB_LOGO_PATH.$jobs_applied->logo)){
                $jobApply[$key]['logo'] = DISPLAY_JOB_LOGO_PATH.$jobs_applied->logo;
            }

            $jobApply[$key]['profile_image'] = '';

            if($profile_image !='' && file_exists(UPLOAD_FULL_PROFILE_IMAGE_PATH . $profile_image )){
                $jobApply[$key]['profile_image'] = DISPLAY_FULL_PROFILE_IMAGE_PATH.$profile_image;
            }

            $jobApply[$key]['applied_job_id'] = $jobs_applied->aid;
            $jobApply[$key]['location'] = $jobs_applied->job_city;
            // $jobApply[$key]['job_id'] = $jobs_applied->id;
            $jobApply[$key]['company_name'] = $jobs_applied->company_name;
            $jobApply[$key]['user_id'] = $jobs_applied->user_id;
            $jobApply[$key]['new_status'] = $jobs_applied->new_status;
            $jobApply[$key]['rating'] = $jobs_applied->rating;
            $jobApply[$key]['attachment_ids'] = $jobs_applied->attachment_ids;
            $jobApply[$key]['cover_letter_id'] = $jobs_applied->cover_letter_id;
            $jobApply[$key]['is_saved'] = $is_saved;
            $jobApply[$key]['is_applied'] = 1;
            $jobApply[$key]['skill'] = $skills_array;
            $jobApply[$key]['salary'] = $salary;
            
            
        }

        $data['jobApplyed'] = $jobApply;

        return Response(['response'=> $data , 'message'=> 'success' , 'status'=> 200 ],200);

    }
    
    public function deleteShortList($id = null):Response {

        if ($id != '') {
            Short_list::where('id',$id)->delete();

            return Response(['response' => 'Job deleted successfully.' , 'message' => 'Job deleted successfully.' , 'status' => 200],200);
        }
        return Response(['response' => '' , 'message' => '' , 'status' => 200],500);
    }
    
    public function JobSave($slug = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }
        
        if($slug == '' ){
            return Response(['response'=>'', 'message'=>'slug empty','status'=>'500']);
        }
        

        $jobData = Job::where('slug',$slug)->first();
    

        $job_id = $jobData->id;

        $msgString = '';
        if ($job_id == '') {
            $msgString .= "- Invalid URL.<br>";
        }

        $checkStatus = Short_list::where('user_id',$userId)
        ->where('job_id',$job_id)
        ->count();

        if ($checkStatus > 0 ) {
            $msgString .= 'You already saved this job.';
        }

        if (isset($msgString) && $msgString != '') {
            return Response(['response' => '', 'message' => $msgString ,'status' => 500],200);
        } else {

            $Short_list = new Short_list;
            $Short_list->status = 1;
            $Short_list->user_id = $userId;
            $Short_list->job_id = $job_id;
            if($Short_list->save()){
                return Response([ 'response'=>'' ,'message' => 'Job added in saved Jobs list' , 'status' => 200],200);
            }
        }
    }
    
    // public function jobApplyDetail($slug = null) {

    //     $tokenData = $this->requestAuthentication('POST', 1);

    //     if(isset($tokenData['user_id']))
    //         $userId = $tokenData['user_id'];
    //     else
    //         $userId = '';

    //     if(!$this->candidateAccess($userId)){
    //         return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
    //     }

    //     if(!$this->applyJobLoginCheck($userId)){
    //         return Response(['response' => '' , 'message'=>'Your account is not activated to apply' , 'status'=>500],200);
    //     }

    //     $job_id = Job::where('slug',$slug)->select('id')->first();

    //     if($job_id->id == '' ){
    //         return Response(['response' => '' , 'message'=>'Invalid slug' , 'status'=>500],200);
    //     }
        
        
    //     //Check if plan is present for a user
    //     $isPlanactive = (new Plan)->getcurrentplan($userId);

    //     if (!isset($isPlanactive->id)) {

    //         return Response(['response' => '' , 'message' => 'You need to purchase Plan to apply for jobs' , 'status' => 500 ],200);
    //         exit;

    //     }
        
    //     $isAbleToJob = (new Plan)->checkPlanFeature($userId, 4);


    //     if ($isAbleToJob['status'] == 0) {

    //         return Response(['response' => $isAbleToJob['message'] , 'message' => $isAbleToJob['message'] , 'status' => 500 ],200);
    //         exit;
    //     }
        
    //     // end

    //     $jobdetails = Job::where('slug',$slug)->first();

    //     $checkStatus = Job_apply::where('user_id',$userId)
    //     ->where('job_id',$job_id)
    //     ->count();
        



    //     if ($checkStatus > 0) {
    //         return Response(['response' => '' , 'message'=>'You already applied for this job' , 'status'=>500],200);
    //     }


    //     $jobapply = new Job_apply;

    //     $jobapply->new_status = 1;
    //     $jobapply->status = 1;
    //     $jobapply->apply_status = 'active';
    //     $jobapply->user_id = $userId;
    //     $jobapply->job_id = $job_id->id;
    //     $jobapply->user_employer_id = 0;
    //     $jobapply->rating = 0;

    //     // if (!empty($this->data['JobApply']['cover_letter'])) {
    //     //     $this->request->data['JobApply']['cover_letter_id'] = $this->data['JobApply']['cover_letter'];
    //     // } else {
    //     //     $this->request->data['JobApply']['cover_letter_id'] = " ";
    //     // }

    //     // $isAbleToJob = (new Plan)->checkPlanFeature($userId, 4);
        
    //     $jobapply->user_plan_id = 24;

    //     // $jobapply->user_plan_id = $isAbleToJob['user_plan_id'];

    //     $jobapply->attachment_ids = '';

    //     if($jobapply->save()){

    //         $userInfo = User::where('id',$userId)->first();
    //         $jobInfo = Job::where('id',$job_id->id)->first();
    //         $recruiterInfo = User::where('id',$jobInfo->user_id)->first();


    //         $jobTitle = $jobInfo->title;
    //         $email = $userInfo->email_address;
    //         $userName = ucfirst($userInfo->first_name);

    //         $cat_slug = Category::where('id',$jobInfo->category_id)->pluck('slug')->implode(',');

    //         $currentYear = date('Y', time());
    //         // $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . $mail_from . '">' . $mail_from . '</a>';

    //         $emailTemplate = Emailtemplate::where('id',15)->first();

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

    //         $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

    //         $link = HTTP_PATH . "/" . $cat_slug . '/' . $jobInfo->slug . '.html';

    //         $toSubArray = array('[!username!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!activelink!]');

    //         $fromRepArray = array($userName, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $link);

    //         $emailSubject = str_replace($toSubArray, $fromRepArray, $template_subject);
    //         $emailBody = str_replace($toSubArray, $fromRepArray, $template_body);

    //         try {
    //             Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
    //         } catch(\Exception $e) {
    //             $msgString=$e->getMessage();
    //         }


    //         $showOldImages=Certificate::where('user_id',$userId)
    //         ->pluck('document')
    //         ->toArray();

    //         $mailFileArray = array();
    //         if ($showOldImages) {
    //             foreach ($showOldImages as $image) {
    //                 $mailFileArray[$image] = UPLOAD_CERTIFICATE_PATH . $image;
    //             }
    //         }

    //         // send mail to the recruiter    
    //         $recruiterEmail = $recruiterInfo->email_address;
    //         $recruiterName = ucfirst($recruiterInfo->first_name);

    //         $emailTemplate = Emailtemplate::where('id',16)->first();

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
    //         $link = HTTP_PATH . "/candidates/profile/" . $userInfo->slug;

    //         $currentYear = date('Y', time());

    //         $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

    //         $toRepArray = array('[!username!]', '[!job_title!]', '[!jobseeker_name!]', '[!jobseeker_email!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!activelink!]');
            
    //         $fromRepArray = array($recruiterName, $jobTitle, $userName, $email, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $link);

    //         $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
    //         $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);

           

    //         try {
    //             Mail::to($recruiterEmail)->send(new SendMailable($emailBody, $emailSubject));
    //         } catch(\Exception $e) {
    //             $msgString=$e->getMessage();
    //         }

    //         return Response(['Response' => '' , 'message' => 'job applied successfully' , 'status'=>200 ]);

    //     }

    // }
    
    public function jobApplyDetail($slug = null) {

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        // if(!$this->applyJobLoginCheck($userId)){
        //     return Response(['response' => '' , 'message'=>'Your account is not activated to apply' , 'status'=>500],200);
        // }

        $job_id = Job::where('slug',$slug)->select('id')->first();

        if($job_id->id == '' ){
            return Response(['response' => '' , 'message'=>'Invalid slug' , 'status'=>500],200);
        }

        $jobdetails = Job::where('slug',$slug)->first();

        $checkStatus = Job_apply::where('user_id',$userId)
        ->where('job_id',$job_id)
        ->count();

        if ($checkStatus > 0) {
            return Response(['response' => '' , 'message'=>'You already applied for this job' , 'status'=>500],200);
        }


        $jobapply = new Job_apply;

        $jobapply->new_status = 1;
        $jobapply->status = 1;
        $jobapply->apply_status = 'active';
        $jobapply->user_id = $userId;
        $jobapply->job_id = $job_id->id;
        $jobapply->user_employer_id = 0;
        $jobapply->rating = 0;

        // if (!empty($this->data['JobApply']['cover_letter'])) {
        //     $this->request->data['JobApply']['cover_letter_id'] = $this->data['JobApply']['cover_letter'];
        // } else {
        //     $this->request->data['JobApply']['cover_letter_id'] = " ";
        // }

        $isAbleToJob = (new Plan)->checkPlanFeature($userId, 4);
        if ($isAbleToJob['status'] == 0) {

            return Response(['response' => $isAbleToJob['message'] , 'message' => $isAbleToJob['message'] , 'status' => 500 ],200);
            exit;
        }
        // print_r($isAbleToJob['user_plan_id']);
        
        $myPlan =  (new Plan)->getcurrentplan($userId);
        if(!empty($myPlan)){
            $Plan = Plan::where('id',$myPlan->plan_id)->first();
            $jobapply->user_plan_id = $myPlan->plan_id;

        }
        

        // $jobapply->user_plan_id = $isAbleToJob['user_plan_id'];

        $jobapply->attachment_ids = '';

        if($jobapply->save()){

            $userInfo = User::where('id',$userId)->first();
            $jobInfo = Job::where('id',$job_id->id)->first();
            $recruiterInfo = User::where('id',$jobInfo->user_id)->first();


            $jobTitle = $jobInfo->title;
            $email = $userInfo->email_address;
            $userName = ucfirst($userInfo->first_name);

            $cat_slug = Category::where('id',$jobInfo->category_id)->pluck('slug')->implode(',');

            $currentYear = date('Y', time());
            // $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . $mail_from . '">' . $mail_from . '</a>';

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

            $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

            $link = HTTP_PATH . "/" . $cat_slug . '/' . $jobInfo->slug . '.html';

            $toSubArray = array('[!username!]', '[!DATE!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]', '[!SITE_LINK!]', '[!SITE_URL!]', '[!activelink!]');

            $fromRepArray = array($userName, $currentYear, HTTP_PATH, SITE_TITLE, $sitelink, SITE_URL, $link);

            $emailSubject = str_replace($toSubArray, $fromRepArray, $template_subject);
            $emailBody = str_replace($toSubArray, $fromRepArray, $template_body);

            try {
                Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
            } catch(\Exception $e) {
                $msgString=$e->getMessage();
            }


            $showOldImages=Certificate::where('user_id',$userId)
            ->pluck('document')
            ->toArray();

            $mailFileArray = array();
            if ($showOldImages) {
                foreach ($showOldImages as $image) {
                    $mailFileArray[$image] = UPLOAD_CERTIFICATE_PATH . $image;
                }
            }

            if($recruiterInfo != ''){

            // send mail to the recruiter    
            $recruiterEmail = $recruiterInfo->email_address;
            $recruiterName = ucfirst($recruiterInfo->first_name);

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

           

            try {
                Mail::to($recruiterEmail)->send(new SendMailable($emailBody, $emailSubject));
            } catch(\Exception $e) {
                $msgString=$e->getMessage();
            }
        }

            return Response(['Response' => '' , 'message' => 'job applied successfully' , 'status'=>200 ]);

        }

    }
    

    
    public function applypop(Request $request,$jobid):Response{

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        $isAbleToJob = (new Plan)->checkPlanFeature($userId , 4);

        if($isAbleToJob['status']==0){
            return Response(['response'=> '' ,'message' => $isAbleToJob['message'] ,'status'=>500],200);
        }

        $job = Job::find($jobid);

        $data['action'] = $request->actionc;

        return Response(['response'=>$data , 'message'=>'success' , 'status'=>200],200);
    }
    
    public function updateRating($id = NULL, $rating = null):Response {
        if ($id != '' && $rating != '') {
            $this->layout = "";

            Job_apply::where('id',$id)
            ->update([
                'rating' => $rating,
            ]);

            return Response(['response' => '', 'message' => 'rating updated' , 'status'=> 200],200);

        }
    }
    
    public function delete($slug = null):Response {

        $tokenData = $this->requestAuthentication('POST', 1);

        if(isset($tokenData['user_id']))
            $userId = $tokenData['user_id'];
        else
            $userId = '';

        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        $jobInfo = Job::where('slug',$slug)->first();
        $jobDetail = $jobInfo;

        if($slug != ''){

            $title = $jobDetail->title;
            $location = $jobDetail->job_city;
            $category = Category::where('id',$jobDetail->category_id)
            ->pluck('name')
            ->implode(',');

            $userDetails = User::where('id',$userId)->select('first_name','last_name','email_address')->first();
    
            $username = $userDetails->first_name.' '.$userDetails->last_name;
            $email = $userDetails->email_address;

            $currentYear = date('Y', time());

            $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

            $emailTemplate = Emailtemplate::where('id',47)->first();

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


            // $toSubArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!skill!]', '[!designation!]', '[!min_experience!]', '[!max_experience!]', '[!min_salary!]', '[!max_salary!]', '[!description!]', '[!company_name!]', '[!contact_number!]', '[!website!]', '[!address!]', '[!SITE_TITLE!]');

            // $fromSubArray = array($username, $title, $category, $location, $skill, $designation, $minExp, $maxExp, $min_salary, $max_salary, $description, $company_name, $contact_number, $website, $address, $site_title);

            // $subjectToSend = str_replace($toSubArray, $fromSubArray, $emailtemplateMessage['Emailtemplate']['subject']);


            $toRepArray = array('[!username!]', '[!Job_TITLE!]', '[!category!]', '[!location!]', '[!SITE_TITLE!]');
            $fromRepArray = array($username, $title, $category, $location, SITE_TITLE);

            $emailSubject = str_replace($toRepArray, $fromRepArray, $template_subject);
            $emailBody = str_replace($toRepArray, $fromRepArray, $template_body);

            try {
                Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
            } catch(\Exception $e) {
                $msgString=$e->getMessage();
            }

            Job::where('slug',$slug)->delete();

            return response(['response'=>'', 'message'=>'Job deleted successfully' ,'status'=>200]);

        }
    }

    public function admin_index(Request $request):Response {
        $authenticateadmin = $this->adminauthentication();

        $jobs = Job::orderBy('id','desc')->get();

        $jobsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('jobs')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('jobs')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('jobs')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        


        foreach($jobs as $key => $job){

            $user_name = User::where('id',$job->user_id)->first();
            $empname='N/A';
            if(isset($user_name->first_name)){
                $empname=$user_name->first_name.' '.$user_name->last_name;
            }
    
            $cat_name = Category::where('id',$job->category_id)
            ->pluck('name')
            ->implode(',');
    
            $sub_cat_name = Category::where('id',$job->subcategory_id)
            ->pluck('name')
            ->implode(',');
    
            $skill = Skill::whereIn('id',[$job->skill])
            ->pluck('name')
            ->toArray();
    
            $designation = Skill::whereIn('id',[$job->designation])
            ->pluck('name')
            ->toArray();

            $jobsarray[$key]['id'] = $job->id;
            $jobsarray[$key]['slug'] = $job->slug;
            $jobsarray[$key]['title'] = $job->title;
           // $jobsarray[$key]['emp_name'] = $user_name->first_name.' '.$user_name->last_name;
            $jobsarray[$key]['emp_name'] = $empname;

            $jobsarray[$key]['cat_name'] = $cat_name;
            $jobsarray[$key]['sub_cat_name'] = $sub_cat_name;
            $jobsarray[$key]['skill'] = $skill;
            $jobsarray[$key]['designation'] = $designation;
            $jobsarray[$key]['location'] = $job->job_city;
            $jobsarray[$key]['jobseeker_count'] = 0;
            $jobsarray[$key]['type'] = $job->type;
            $jobsarray[$key]['price'] = $job->price;
            $jobsarray[$key]['price_status'] = $job->price_status;
            $jobsarray[$key]['role'] = $job->role;
            $jobsarray[$key]['description'] = $job->description;
            $jobsarray[$key]['company_name'] = $job->company_name;
            $jobsarray[$key]['work_type'] = $job->work_type;
            $jobsarray[$key]['contact_name'] = $job->contact_name;
            $jobsarray[$key]['contact_number'] = $job->contact_number;
            $jobsarray[$key]['vacancy'] = $job->vacancy;
            $jobsarray[$key]['address'] = $job->address;
            $jobsarray[$key]['state_id'] = $job->state_id;
            $jobsarray[$key]['city_id'] = $job->city_id;
            $jobsarray[$key]['postal_code'] = $job->postal_code;
            $jobsarray[$key]['url'] = $job->url;
            $jobsarray[$key]['youtube_link'] = $job->youtube_link;
            $jobsarray[$key]['max_exp'] = $job->max_exp;
            $jobsarray[$key]['min_salary'] = $job->min_salary;
            $jobsarray[$key]['max_salary'] = $job->max_salary;
            $jobsarray[$key]['job_salary'] = $job->job_salary;
            $jobsarray[$key]['created'] = date('M d, Y',strtotime($job->created));
            $jobsarray[$key]['status'] = $job->status;

        }

        return Response(['response' => $jobsarray ,'message' => 'success' ,'status' => 200 ],200);
    }

    public function admin_add(Request $request , $isCopy = null):Response {
        $authenticateadmin = $this->adminauthentication();

        global $extentions;

        // get EMPLOYER LIST
        $employers = User::where('status',1)
        ->select('id','first_name','last_name')
        ->where('user_type' , 'recruiter')
        ->orderBy('first_name','asc')
        //->limit(90)
        ->get();
        $data['employers'] = $employers;


        $categories  = (new Category)->getCategoryList();
        $data['categories'] = $categories;

        $subcategories = array();
        $data['subcategories'] = $subcategories;

        $msgString = '';
        // get skills from skill table
        $skillList = Skill::where('type','Skill')
        ->where('status' , 1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['skillList'] = $skillList;


        // get designations from skill table
        $designationlList = Skill::where('type','Designation')
        ->where('status' , 1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['designationlList'] =  $designationlList;


        // get locations from location table
        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();
        $data['locationlList'] = $locationlList;




        $data['sallery'] =  $GLOBALS['sallery'];
        $data['experience'] = $GLOBALS['experienceArray'];
        $data['worktype'] =  $GLOBALS['worktype'];

        $job['amount'] = '180.00';
        $job['type'] = 'Gold';


        if(!empty($request->all())){

            $rules = array(
                'user_id' => 'required',
                'job_title' => 'required',
                'category' => 'required',
                'company_name' => 'required',
                'work_type' => 'required',
                'contact_name' => 'required',
                'contact_number' => 'required',
                'companyProfile' => 'required',
                //  'company_website' => 'required',
                'experience' => 'required',
                'annual_salary'=>'required',
                'skill' => 'required',
                'designation' => 'required',
                'location' => 'required',
                'last_date' => 'required',
            );

            $validator = Validator::make($request->all(),$rules);

            $validator->setAttributeNames([
                'user_id' => 'Employer',
                'job_title' => 'Job title',
                'category' => 'Category',
                'company_name' => 'Company name',
                'work_type' => 'Work type',
                'contact_name' => 'Contact name',
                'contact_number' => 'Contact number',
                'companyProfile' => 'Company profile',
                //  'company_website' => 'Company website',
                'experience' => 'Experience',
                'annual_salary'=>'Annual Salary',
                'skill' => 'Skill',
                'designation' => 'Designation',
                'location' => 'Job location',
                'last_date' => 'Expire time',
            ]);

            if($validator->fails()){
               $msgString = $this->validatersErrorString($validator->errors());

               return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
            }else{

                $msgString .= $this->checkSwearWord($request->job_title);
                $msgString .= $this->checkSwearWord($request->jobDescription);
                $msgString .= $this->checkSwearWord($request->company_name);
                $msgString .= $this->checkSwearWord($request->contact_name);
                $msgString .= $this->checkSwearWord($request->contact_number);
                $msgString .= $this->checkSwearWord($request->companyProfile);

                $userId=$request->user_id;
                $youtube_link = '';

                if($request->logo != ''){
                    $file = explode( ";base64,", $request->logo);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    // $file = base64_decode($request->logo);
                    $originalName = Str::random(10).'.'.$image_type;
                }else{
                    $originalName = '';
                }



                if (isset($msgString) && $msgString != '') {

                    $subcategories = (new Category)->getSubCategoryList($request->category);

                    $data['subcategories'] = $subcategories;

                    return Response(['response' => $data , 'message' => $msgString , 'status' => 500,],200);
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
                    $newJob->user_id = $request->user_id;
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
                    $newJob->expire_time =  strtotime($request->last_date); 

                    $exp = explode('-',$request->experience);

                    $newJob->min_exp = $exp[0];
                    $newJob->max_exp = $exp[1];
                    $sallery = explode('-',$request->annual_salary);
                    $newJob->min_salary = $sallery[0];
                    $newJob->max_salary = $sallery[1];

                    if($originalName != ''){

                        $decoded_string = base64_decode($file[1]);

                        file_put_contents(UPLOAD_JOB_LOGO_PATH.$originalName, $decoded_string);

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
                    $newJob->type = $job["type"];
                    $newJob->status = 1;
                    $newJob->user_id = $userId;
                    $newJob->payment_status = 2;
                    $newJob->amount_paid = $job['amount'];
                    $newJob->job_number = 'JOB'. $userId . time();

                    if($request->exp_month == ''){
                        $newJob->exp_month = 0;
                    }

                    if($job["type"] == 'gold'){
                        $newJob->hot_job_time = time() + 7 * 24 * 3600;
                    }else{
                        $newJob->hot_job_time = time();
                    }

                    $newJob->skill = implode(',',$request->skill);
                    $newJob->user_plan_id = 0;

                        if($newJob->save()){
                            $jobId = $newJob->id;
                            Job::where('id',$jobId)->update(['url' => $request->company_website]);
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
                                    return Response(['response'=>'Job posted successfully.', 'message'=>'Job posted successfully.' , 'status'=>200 ],200);
                        }
                }
            }
        }else{
            
            if($isCopy!= ''){
                $data['sallery'] =  $GLOBALS['sallery'];
                $data['experience'] = $GLOBALS['experienceArray'];
                $data['worktype'] =  $GLOBALS['worktype'];
        
                $jobInfo = Job::where('slug', $isCopy)->first();


                $user_name = User::where('id',$jobInfo->user_id)
                ->select('first_name','last_name')
                ->first();

                $cat_name = Category::where('id',$jobInfo->category_id)
                ->pluck('name')
                ->implode(',');
        
                $sub_cat_name = Category::where('id',$jobInfo->subcategory_id)
                ->pluck('name')
                ->implode(',');
        
                $skill = Skill::whereIn('id',[$jobInfo->skill])
                ->pluck('name')
                ->toArray();
        
                $designation = Skill::whereIn('id',[$jobInfo->designation])
                ->pluck('name')
                ->toArray();
        
                $work_type = $GLOBALS['worktype'];
        
                $job_detail_array = array();
                
                $sub_array = explode(',',$jobInfo->subcategory_id);
                $skill_array = explode(',',$jobInfo->skill);

                $job_detail_array['category'] = $jobInfo->category_id;
                $job_detail_array['user_id'] = $jobInfo->user_id;
                $job_detail_array['subCategory'] =  $sub_array;
                $job_detail_array['skill'] = $skill_array;
                $job_detail_array['designation'] = $jobInfo->designation;
                $job_detail_array['contact_name'] = $jobInfo->contact_name;
                $job_detail_array['contact_number'] =  $jobInfo->contact_number;
                $job_detail_array['location'] = $jobInfo->job_city;
                $job_detail_array['work_type'] =  $jobInfo->work_type;
                $job_detail_array['jobDescription'] = $jobInfo->description;
                $job_detail_array['company_name'] = $jobInfo->company_name;
                $job_detail_array['company_website'] = $jobInfo->url;
                $job_detail_array['companyProfile'] = $jobInfo->brief_abtcomp;
                $job_detail_array['experience'] = $jobInfo->min_exp.'-'.$jobInfo->max_exp;
                $job_detail_array['annual_salary'] = $jobInfo->min_salary.'-'.$jobInfo->max_salary;
                $job_detail_array['job_title'] = 'Copy of '.$jobInfo->title;
        
                if($jobInfo->logo != ''){
                    $job_detail_array['logo'] = DISPLAY_JOB_LOGO_PATH.$jobInfo->logo;
                }else{
                    $job_detail_array['logo'] = '';
                }
                
        
                $job_detail_array['last_date'] = $jobInfo->lastdate == '' ? date('Y-m-d') : $jobInfo->lastdate ;

                $data['job_details'] = $job_detail_array;
            }

            return Response(['response'=>$data, 'message'=>'success' , 'status'=>200 ],200);
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
        $AnnouncementData = Job::where('slug',$slug)->first();
 
        if(!empty($AnnouncementData)){
             Job::where('slug',$slug)->delete();
 
             $msgString = 'Job deleted successfully';
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
 
             Job::where('slug',$slug)->update([
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
 
             Job::where('slug',$slug)->update([
                 'status' => 0,
             ]);
 
             return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
         }
 
         return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }


    public function admin_edit(Request $request,$slug = null):Response {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

         }


         
        $jobdetails = Job::where('slug',$slug)->first();
        // $data['jobdetails'] = $jobdetails;

        // get EMPLOYER LIST
        $employers = User::where('status',1)
        ->select('id','first_name','last_name')
        ->where('user_type' , 'recruiter')
        ->orderBy('first_name','asc')
        //->limit(90)
        ->get();
        $data['employers'] = $employers;


        $categories = (new Category)->getCategoryList();

        $data['categories'] = $categories;

        $subcategories = array();
        $data['subcategories'] = $subcategories;

        $skillList = Skill::where('type','Skill')
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['skillList'] = $skillList;

        $designationlList = Skill::where('type','Designation')
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['designationlList'] = $designationlList;

        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['locationlList'] = $locationlList;

        $msgString = '';
        global $extentions;
        
        $data['sallery'] =  $GLOBALS['sallery'];
        $data['experience'] = $GLOBALS['experienceArray'];
        $data['worktype'] =  $GLOBALS['worktype'];
        

        if(!empty($request->all())){
            
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
             //   'company_website' => 'required'
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

            if($validator->fails()){
                $msgString = $this->validatersErrorString($validator->errors());
 
                return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
            }else{

                $msgString .= $this->checkSwearWord($request->job_title);
                $msgString .= $this->checkSwearWord($request->jobDescription);
                $msgString .= $this->checkSwearWord($request->company_name);
                $msgString .= $this->checkSwearWord($request->contact_name);
                $msgString .= $this->checkSwearWord($request->contact_number);
                $msgString .= $this->checkSwearWord($request->companyProfile);

                $youtube_link = '';



                if($jobdetails->logo != ''){
                    $img=DISPLAY_JOB_LOGO_PATH.$jobdetails->logo;
                }else{
                    $img='1';
                }

                //echo '<br>logo';print_r($request->logo);
              //  echo '<br>$img';print_r($img);

                if(($request->logo != '') && ($request->logo != $img)){
                    $file = explode( ";base64,", $request->logo);
                    $image_type_pieces = explode( "image/", $file[0] );
                    $image_type = $image_type_pieces[1];
                    $originalName = Str::random(10).'.'.$image_type;
                    $decoded_string = base64_decode($file[1]);

                  //  echo '<br>if';print_r($decoded_string);
                  file_put_contents(UPLOAD_JOB_LOGO_PATH.$originalName, $decoded_string);
    
                }else{
                  //  echo '<br>else';
                    $originalName = $jobdetails->logo;
                }

                //exit;



                if (isset($msgString) && $msgString != '') {

                    $subcategories = (new Category)->getSubCategoryList($request->category);

                    $data['subcategories'] = $subcategories;

                    return Response(['response' => $data , 'message' => $msgString , 'status' => 500,],200);
                }else{

                    $keyword = $request->job_title;
                    $userId = $request->user_id;

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

                    $jobId = Job::where('slug',$slug)->pluck('id')->implode(',');

                    $newJob = Job::find($jobId);

                    $newJob->user_id = $request->user_id;
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
                    $newJob->expire_time =  strtotime($request->last_date); 
                    
                    
                    if($request->skill != '' ){
                        $newJob->skill = implode(',',$request->skill);
                    }

                    $exp = explode('-',$request->experience);
                    $newJob->min_exp = $exp[0];
                    $newJob->max_exp = $exp[1];

                    $sallery = explode('-',$request->annual_salary);
                    $newJob->min_salary = $sallery[0];
                    $newJob->max_salary = $sallery[1];

                
                    $newJob->logo = $originalName;

                    if($request->subCategory){
                        $newJob->subcategory_id = implode(',',$request->subCategory);
                    }else{
                        $newJob->subcategory_id = 0;
                    }

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
                            Mail::to($email)->send(new SendMailable($messageToSend, $subjectToSend));
                        } catch(\Exception $e) {
                            $msgString=$e->getMessage();
                        }
                        
                        return Response(['response' => $data , 'message' =>'success','status'=>200 ],200);

                    }
                }

            }

        }else{

            $job = Job::where('slug',$slug)->first();
            
            if(file_exists(UPLOAD_JOB_LOGO_PATH.$job->logo) && $job->logo != ''){
                $logo = DISPLAY_JOB_LOGO_PATH.$job->logo;
            }else{
                $logo = '';
            }
            
            $data['job']['user_id'] = $job->user_id;
            $data['job']['job_title'] = $job->title;
            $data['job']['category'] = $job->category_id;
            $data['job']['subcategory_id'] = $job->subcategory_id;
            $data['job']['company_name'] = $job->company_name;
            $data['job']['first_name'] = $job->first_name;
            $data['job']['last_name'] = $job->last_name;
            $data['job']['contact_name'] = $job->contact_name;
            $data['job']['contact_number'] = $job->contact_number;
            $data['job']['work_type'] = $job->work_type;
            $data['job']['company_website'] = $job->url;
            $data['job']['companyProfile'] = $job->brief_abtcomp;
            $data['job']['skill'] = explode(',',$job->skill);
            $data['job']['location'] = $job->job_city;
            $data['job']['experience'] = $job->min_exp != '' ? $job->min_exp.'-'.$job->max_exp : '';
            $data['job']['annual_salary'] = $job->min_salary != '' ? $job->min_salary.'-'.$job->max_salary : '';
            $data['job']['logo'] = '';
            $data['job']['logo_path'] = $logo;
            $data['job']['last_date'] = $job->lastdate;
            $data['job']['created'] = date('Y-m-d', strtotime($job->created));

            $data['job']['jobDescription'] = $job->description;
            $data['job']['designation'] = $job->designation;

            if($job->logo != ''){
                $data['job']['logo'] = DISPLAY_JOB_LOGO_PATH.$job->logo;
            }else{
                $data['job']['logo'] = '';
            }



            $subcategories = (new Category)->getSubCategoryList($job->category_id);
            $data['subcategories'] = $subcategories;

            return Response(['response' => $data , 'message' =>'success','status'=>200 ],200);


        }

    }


    public function admin_appliedcandidates(Request $request,$slug = null) : Response
    {

                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $jobdetails = Job::where('slug',$slug)->first();
        $jobid=$jobdetails->id;
        if($jobid != ''){

        $applications = Job_apply::where('job_id',$jobid)->where('status',1)->where('user_id','!=','')->orderBy('id', 'DESC')->get();


        $subcategoryarray = array();


        foreach($applications as $key => $category){
            $jobseeker = User::where('id',$category->user_id)->first();

            $subcategoryarray[$key]['first_name'] = $jobseeker->first_name;
            $subcategoryarray[$key]['last_name'] = $jobseeker->last_name;
            $subcategoryarray[$key]['email_address'] = $jobseeker->email_address;
            $subcategoryarray[$key]['contact'] = $jobseeker->contact;
            $subcategoryarray[$key]['location'] = $jobseeker->location;
            $subcategoryarray[$key]['slug'] = $jobseeker->slug;
        }
        $categoryarray['subcategories']= $subcategoryarray;
        return Response(['response' => $categoryarray , 'message'=>'success' , 'status' => 200 ],200);
        }

    }
    
public function admin_jobimportdata(Request $request): Response
{
    $data=array();
        //$file = 'https://jobfeed.equest.com/1.0/boards/3a8out97q9p9g8vp5u2t4c5e0k/jobs';
        //$file = 'https://job-board-software.logicspice.com/job-board-script/jobimport.xml';
        if(!empty($request->all())){
        if(!empty($request->xml_url)){

          $file=$request->xml_url;
                try {
                    $xml = simplexml_load_file($file);
                    
                    if ($xml) {
                        $tagNames = [];
                        
                        // Recursive function to extract tag names
                        $this->extractTagNames($xml, $tagNames);

                        // Store data in session if needed
                        session(['import_joburl' => $file]);
                        session(['import_tag_names' => $tagNames]);
                        
                        $data['tagNames']=$tagNames;
                        $data['xml_url']=$file;
                        
                        // get EMPLOYER LIST
                        $employers = User::where('status',1)
                        ->where('user_type','recruiter')
                        ->select('id','first_name','last_name','company_name')
                        ->orderBy('company_name','asc')
                        ->get();
                        $data['employer_id'] = $employers;
                    

                        return response(['response' => $data , 'message' => 'Success', 'status' => 200], 200);
                    } else {
                        return response(['response' => $data ,'message' => 'Failed to load XML file', 'status' =>500],200);
                    }
                } catch (Exception $e) {
                    return response(['response' => $data ,'message' => $e->getMessage(), 'status' =>500],200);
                }
            }else{
                return response(['response' => $data ,'message' => 'Please Provide XML URL.', 'status' =>500],200);

            }
        }else{
            return response(['response' => $data ,'message' => 'success', 'status' =>200],200);

        }
}

// Recursive function to extract tag names
private function extractTagNames($xml, &$tagNames) {
    foreach ($xml->children() as $child) {
        $tagName = $child->getName();
        if (!in_array($tagName, $tagNames)) {
            $tagNames[] = $tagName;
        }
        // Recursively call for nested elements
        if ($child->count() > 0) {
            $this->extractTagNames($child, $tagNames);
        }
    }
}


 public function admin_jobimportnew(Request $request) : Response{
        
       

        // $authenticateadmin = $this->adminauthentication();

        // if(isset($authenticateadmin['id'])){
        //     if($authenticateadmin['id'] != '1'){

        //         $msgString='Sub-Admin do not have access to this path.';
        //         return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
        //         exit;
        //     }

        // }


        $data=array(); 
        $msg='';
        // get EMPLOYER LIST
        $employers = User::where('status',1)
        ->where('user_type','recruiter')
        ->select('id','first_name','last_name','company_name')
        ->orderBy('company_name','asc')
        ->get();
        $data['employers'] = $employers;

       // echo '<pre>';print_r($data);exit;

        if(!empty($request->all())){

          //  if(isset($request->xml_url) && isset($request->employer_id)){


            $xmlUrl=$request->xml_url;
            $employer_id=$request->employer_id;
            $employer = User::where('id',$employer_id)->first();

            $job_id=$request->job_id;
            $job_title=$request->job_title;
            $job_discription=$request->job_discription;
            $job_category=$request->job_category;
            $job_skills=$request->job_skills;
            $job_designation=$request->job_designation;
            $job_location=$request->job_location;
            $expirydate=$request->expirydate;
            $comapany_name=$request->comapany_name;
            $comapany_website=$request->comapany_website;
            $contact_person=$request->contact_person;


           // $xmlUrl='https://job-board-software.logicspice.com/job-board-script/jobimport.xml';
            // $xmlUrl='https://jobfeed.equest.com/1.0/boards/3a8out97q9p9g8vp5u2t4c5e0k/jobs';
           $xml = simplexml_load_file($xmlUrl);
 
           if ($xml) {
            $Values = [];

            foreach ($xml->job as $job) { 

                $sjob_id='';
                $sjob_title='';
                $sjob_discription='';
                $category='';
                $sjob_skills='';
                $desig='';
                $sexpirydate='';
                $scomapany_name='';
                $scomapany_website='';
                $scontact_person='';
                $sjob_location='';

                foreach ($job->children() as $child) { 
                    $tagName = $child->getName();


                    
                    if ($tagName == $job_id) {
                        $sjob_id = (string)$child; 
                    }
                   // echo '<pre>tagName ';print_r($tagName);

                   // echo '<pre>job_title ';print_r($job_title);


                    if(empty($sjob_id)){

                        $job_number = 'JOB'. $employer_id . time();
                    }

                    if ($tagName == $job_title) {
                        $sjob_title = (string)$child; 
                    }
                  //  echo '<pre>job_title ';print_r($sjob_title);

                    if ($tagName == $job_discription) {
                        $sjob_discription = (string)$child; 
                    }

                    if ($tagName == $job_category) {
                        $category = (string)$child; 
                    }

                    if ($tagName == $job_skills) {
                        $sjob_skills = (string)$child; 
                    }

                    if ($tagName == $job_designation) {
                        $desig = (string)$child; 
                    }

                    if ($tagName == $expirydate) {
                        $sexpirydate = (string)$child; 
                    }


                 
        
                 
                    if ($tagName == $comapany_name) {
                        $scomapany_name = (string)$child; 
                    }else{
                        if(!empty($employer->company_name)){
                            $scomapany_name=$employer->company_name;
                        }else{
                            
                            $scomapany_name=$employer->first_name.' '.$employer->last_name;
                        }
    
                    }
                    if ($tagName == $comapany_website) {
                        $scomapany_website = (string)$child; 
                    }

                    if ($tagName == $contact_person) {
                        $scontact_person = (string)$child; 
                    }

                    if ($tagName == $job_location) {
                        $sjob_location = (string)$child; 
                    }
                }
                    

                    $skill_arr = explode(",", $sjob_skills);
                    $skillArray =[];
                    foreach ($skill_arr as $skillhave) {
                        $skillDetail = Skill::where('name','LIKE',"%$skillhave%")->first();
                        if(isset($skillDetail->id)){
                            $skillArray[] = $skillDetail->id;
                        }else{
                          Skill::create([
                                'name' => $skillhave,
                                'type'=>'Skill',
                                'slug' => $this->createSlug($skillhave,'skills'),
                                'status' => 1,
                            ]);
                        }
    
                    }
                    $category1 = Category::where('name','LIKE',"%$category%")->first();
                    if(empty($category1->id)){
                            Category::create([
                                'name' => $category,
                                'image' => '',
                                'parent_id' => 0,
                                'cat_id' => 0,
                                'meta_keywords' => $category,
                                'meta_title' => $category,
                                'meta_description' => $category,
                                'keywords' => $category,
                                'slug' => $this->createSlug($category,'categories'),
                                'status' => 1,
                            ]);
                    }
    
                    $designation = Skill::where('type','Designation')->where('name','LIKE',"%$desig%")->first();
                    if(empty($designation->id)){
                            Skill::create([
                                'name' => $desig,
                                'type'=>'Designation',
                                'slug' => $this->createSlug($desig,'skills'),
                                'status' => 1,
                            ]);
                    }
    
                        //echo '<pre>';print_r($category);exit;
    
                   
                    //////
                    foreach ($skill_arr as $skillhave) {
                        $skillDetail = Skill::where('name','LIKE',"%$skillhave%")->first();
                        if(isset($skillDetail->id)){
                            $skillArray[] = $skillDetail->id;
                        }
    
                    }
                    $designation = Skill::where('type','Designation')->where('name','LIKE',"%$desig%")->first();
                    $category1 = Category::where('name','LIKE',"%$category%")->first();

                    $newJob = new Job();
                    $newJob->user_id = $employer_id;
                    $newJob->company_name = $scomapany_name;
                    $newJob->title = $sjob_title;
                    $newJob->job_number = $job_number;
                    $newJob->description = $sjob_discription;
                    $newJob->brief_abtcomp = $sjob_discription;
                    $newJob->category_id = $category1->id;
                    $newJob->skill = implode(",",$skillArray);
                    $newJob->designation = $designation->id;
                    $newJob->job_city = $sjob_location;
                    $newJob->contact_name = $contact_person;
                    $newJob->url = $scomapany_website;
                  

                    $date = new DateTime($sexpirydate);
                    if ($date->format('Y-m-d') == $sexpirydate) {
                        $newJob->lastdate = $sexpirydate;
                        $newJob->expire_time = strtotime($sexpirydate); 

                    }else{
                        $date = new DateTime();
                        $date->modify('+2 month');
                        $newJob->lastdate = $date->format('Y-m-d');
                        $newJob->expire_time = strtotime($date->format('Y-m-d')); 
                    }



                    //$work_type = array_search((string)$job->workingTimes, $work);
                  //  $newJob->work_type = $work_type;

               // $newJob->contact_number = (string)$job->contact_number;

                    // $exp = explode('-',$job->experience);

                    // if(isset($exp[0])){
                    //     $newJob->min_exp = $exp[0];
                    // }else{
                    //     $newJob->min_exp =0;
                    // }

                    // if(isset($exp[1])){
                    //     $newJob->max_exp = $exp[1];
                    // }else{
                    //     $newJob->max_exp = 0;
                    // }
                    // $sallery = explode('-',$job->salary);

                    // if(isset($sallery[0])){
                    //     $newJob->min_salary = $sallery[0];
                    // }else{
                    //     $newJob->max_salary =0;
                    // }

                    // if(isset($sallery[1])){
                    //     $newJob->max_salary = $sallery[1];
                    // }else{
                    //     $newJob->max_salary =0;
                    // }
                    //$newJob->job_number = (string)$job->id;
                    
                    $slug = $this->createSlug($sjob_title,'jobs');
                    $newJob->slug = $slug;
                    $newJob->type = 'Import';
                    $newJob->status = 1;
                    $newJob->payment_status = 2;
                    $newJob->exp_month = 0;
                    $newJob->hot_job_time = time();

                    $newJob->save();
                    $msg='Job Saved';

                    
                    //echo '<pre>';print_r($msg.' '.$sjob_title);

            }
             

            }
           // exit;

            // $checkfeed= Feed::where('feed_url',$xmlUrl)->first();


            // if(empty($checkfeed)){
            //     $Feed = new Feed();
            //     $Feed->name = $xmlUrl;
            //     $Feed->feed_url = $xmlUrl;
            //     $Feed->user_id = $employer_id;
            //     $Feed->slug = $this->createSlug($xmlUrl,'jobs');
            //     $Feed->status = 1;
            //     $Feed->created = date('Y-m-d H:s:i');
            //     $Feed->save();
            // }

         
            }else{
                return Response(['response' => $data , 'message'=>'Please provide required fields.', 'status' => 500 ],500);
        
            }

       // }
        return Response(['response' => $data , 'message'=>$msg, 'status' => 200 ],200);

       // exit;


    }


    public function admin_jobimport(Request $request) : Response{

        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }


        $data=array(); 
        $msg='';
        // get EMPLOYER LIST
        $employers = User::where('status',1)
        ->where('user_type','recruiter')
        ->select('id','first_name','last_name','company_name')
        ->orderBy('company_name','asc')
        ->get();
        $data['employers'] = $employers;

       // echo '<pre>';print_r($data);exit;

        if(!empty($request->all())){

            if(isset($request->xml_url) && isset($request->employer_id)){


            $xmlUrl=$request->xml_url;
            $employer_id=$request->employer_id;
            $employer = User::where('id',$employer_id)->first();

            if(!empty($employer->company_name)){
                $cname=$employer->company_name;
            }else{
                
                $cname=$employer->first_name.' '.$employer->last_name;
            }

            // $xmlUrl = 'https://job-board-software.logicspice.com/job-board-script/jobimport.xml';
            // $employer_id='962';

                $response = Http::get($xmlUrl);
                $xmlString = $response->body();
                
                $xml = simplexml_load_string($xmlString);
                $work = $GLOBALS['worktype'];
         

        
            foreach ($xml->job as $job) {

                $checkjobid = Job::where('job_number',$job->id)->first();


                if(empty($checkjobid)){

                $category=(string)$job->category;
                $skills=(string)$job->skills;
                $desig=(string)$job->designation;

                $skill_arr = explode(",", $skills);
                $skillArray =[];
                foreach ($skill_arr as $skillhave) {
                    $skillDetail = Skill::where('name','LIKE',"%$skillhave%")->first();
                    if(isset($skillDetail->id)){
                        $skillArray[] = $skillDetail->id;
                    }

                }
                $category = Category::where('name','LIKE',"%$category%")->first();

                $designation = Skill::where('type','Designation')->where('name','LIKE',"%$desig%")->first();

              //  echo '<pre>';print_r($skillDetail);

             // echo '<pre>';print_r((string)$job->workingTimes);exit;


                if(isset($category->id) && isset($designation->id) && !empty($skillArray)){

                   // echo '<pre>';print_r($category->id);
                   // echo '<pre>';print_r($designation->id);
                   // echo '<pre>';print_r($skillArray);
                //    if(isset($employer->company_name)){
                //     $company_name=$employer->company_name;

                //    }else{
                //     $company_name=$employer->first
                //    }

                    $category_id=$category->id;
                    $designation_id=$designation->id;
                    $skill=implode(',',$skillArray);

                    $newJob = new Job();
                    $newJob->user_id = $employer_id;
                    $newJob->company_name = $cname;
                    $newJob->title = (string)$job->title;
                    $newJob->description = (string)$job->jobDescription;
                    $newJob->brief_abtcomp = (string)$job->companyDescription;
                    $newJob->category_id = $category_id;
                    $newJob->skill = $skill;
                    $newJob->designation = $designation_id;
                    $work_type = array_search((string)$job->workingTimes, $work);
                    $newJob->work_type = $work_type;
                    $newJob->job_city = (string)$job->location;
                    $newJob->lastdate = (string)$job->last_date;
                    $newJob->expire_time = strtotime($job->last_date); 
                    $newJob->url = (string)$job->company_website;
                    $newJob->contact_name = (string)$job->contactName;
                    $newJob->contact_number = (string)$job->contact_number;
                    $exp = explode('-',$job->experience);

                    if(isset($exp[0])){
                        $newJob->min_exp = $exp[0];
                    }else{
                        $newJob->min_exp =0;
                    }

                    if(isset($exp[1])){
                        $newJob->max_exp = $exp[1];
                    }else{
                        $newJob->max_exp = 0;
                    }
                    $sallery = explode('-',$job->salary);

                    if(isset($sallery[0])){
                        $newJob->min_salary = $sallery[0];
                    }else{
                        $newJob->max_salary =0;
                    }

                    if(isset($sallery[1])){
                        $newJob->max_salary = $sallery[1];
                    }else{
                        $newJob->max_salary =0;
                    }

                    $slug = $this->createSlug($request->job_title,'jobs');
                    $newJob->slug = $slug;
                    $newJob->type = 'Import';
                    $newJob->status = 1;
                    $newJob->payment_status = 2;
                    $newJob->job_number = (string)$job->id;
                    $newJob->exp_month = 0;
                    $newJob->hot_job_time = time();

                    $newJob->save();
                    $msg='Job Saved';

                    


                }
               

            }
            // echo '<pre>';print_r($data);exit;


            }

            $checkfeed= Feed::where('feed_url',$xmlUrl)->first();


            if(empty($checkfeed)){
                $Feed = new Feed();
                $Feed->name = $xmlUrl;
                $Feed->feed_url = $xmlUrl;
                $Feed->user_id = $employer_id;
                $Feed->slug = $this->createSlug($xmlUrl,'jobs');
                $Feed->status = 1;
                $Feed->created = date('Y-m-d H:s:i');
                $Feed->save();
            }

            return Response(['response' => $data , 'message'=>$msg, 'status' => 200 ],200);
    

            }else{
                return Response(['response' => $data , 'message'=>'Please provide required fields.', 'status' => 500 ],500);
        
            }

        }
        return Response(['response' => $data , 'message'=>$msg, 'status' => 200 ],200);

        exit;

    }

    public function admin_feedindex(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $Blogs = Feed::orderBy('id','desc')->get();

        $Blogsarray = array();


        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('feeds')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('feeds')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('feeds')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } elseif ($request->filled('name')) {
            $name = urldecode(trim($request->name));
        }

        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['slug'] = $blog->slug;
            $Blogsarray[$key]['name'] = $blog->name;
            $Blogsarray[$key]['feed_url'] = $blog->feed_url;
            $Blogsarray[$key]['status'] = $blog->status;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
        }

        return Response(['response' => $Blogsarray ,'message' => 'success' ,'status' => 200 ],200);
    }

    public function admin_feeddelete($slug = NULL):Response {
        $authenticateadmin = $this->adminauthentication();

       $AnnouncementData = Feed::where('slug',$slug)->first();

       if(!empty($AnnouncementData)){
            Feed::where('slug',$slug)->delete();

            $msgString = 'Deleted successfully';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 200  ],200);
       }else{

            $msgString = 'No record deleted';
            return Response(['response' => $msgString , 'message' => $msgString ,'status' => 500 ],200);
       }
    }

    public function admin_feedactivate($slug = NULL) {
        $authenticateadmin = $this->adminauthentication();

        if ($slug != '') {

            Feed::where('slug',$slug)->update([
                'status' => 1,
            ]);

            return Response(['response' => 'Activated successfully' , 'message' => 'Activated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);

    }

    public function admin_feeddeactivate($slug = NULL) {
        $authenticateadmin = $this->adminauthentication();

        if ($slug != '') {

            Feed::where('slug',$slug)->update([
                'status' => 0,
            ]);

            return Response(['response' => 'Deactivated successfully' , 'message' => 'Deactivated successfully' , 'status' => 200 ],200);
        }

        return Response(['response' => 'Slug not found' , 'message' => 'Slug not found' , 'status' => 500],200);
    }
    
    public function admin_import(Request $request){
        $data=array(); 
        $msg='';

        $employers = User::where('status',1)
        ->where('user_type','recruiter')
        ->select('id','first_name','last_name','company_name')
        ->orderBy('company_name','asc')
        ->get();
        $data['employers'] = $employers;
        
        $data['xlsxfile'] = HTTP_PATH.'/public/files/Job_import_sample_xlsx_formate.xlsx';
        $data['csvfile'] = HTTP_PATH.'/public/files/Job_import_sample_csv_formate.csv';
        
        if(!empty($request->all())){
            if (!empty($request->file('file'))) {
                $file = $request->file('file');
                $originalName = $file->getClientOriginalName();
                
                $extension = $file->getClientOriginalExtension();
                $allowedExtensions = ['csv', 'xlsx', 'xls']; // Allowed file formats
            
                // Check if the file format is valid
                if (!in_array(strtolower($extension), $allowedExtensions)) {
                    return Response(['response' => $data, 'message' => 'Invalid file format. Only CSV, XLSX, and XLS files are allowed.', 'status' => 500], 200);
                }
            
                try {
                    $user = User::where('id',$request->input('employer'))->first();
                    
                    if(!isset($user->id)){
                        return Response(['response' => $data , 'message'=>'Invalid employer', 'status' => 500 ],200);
                    }
                    
                    // $file->move(UPLOAD_FILE, $originalName);
                    Excel::import(new ImportJobs($user), $request->file('file'));
                    
                    return Response(['response' => $data , 'message'=>'Import Successfully.', 'status' => 200 ],200);
                    exit();
                    
                } catch (\Exception $e) {
                    return Response(['response' => $data , 'message'=>$e->getMessage(), 'status' => 500 ],200);
                    exit();
                }
            } else {
                return Response(['response' => $data , 'message'=>'No file uploaded.', 'status' => 500 ],200);
                exit();
            }
        }
        
        return Response(['response' => $data , 'message'=>'', 'status' => 200 ],200);
        exit();
        
    }

}
