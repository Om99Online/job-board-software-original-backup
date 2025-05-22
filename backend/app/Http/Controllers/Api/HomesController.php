<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Skill;
use App\Models\Location;
use App\Models\Job;
use App\Models\Announcement;
use App\Models\Plan;
use App\Models\User;
use App\Models\Slider;
use App\Models\Keyword;
use App\Models\Banneradvertisement;
use App\Models\Importjob;
use App\Models\Site_setting;

use Session;
use DateTime;

class HomesController extends Controller
{


    public function home_slider():Response{

        $sloganText  = Admin::whereId(1)->select('slogan_text')->first();
        $data['sloganText'] = $sloganText;
        
        $site_setting = Site_setting::where('id',1)->first();
        $data['site_setting'] = $site_setting;

        $sliderList  = Slider::where('status',1)
        ->select('id','image','title')
        ->orderBy('id','asc')
        ->get();

        $key = 0;
        $sliderarray = array();

        foreach ($sliderList as $slider) {


            if(file_exists(UPLOAD_FULL_SLIDER_IMAGE_PATH.$slider->image) && $slider->image != ''){
                $sliderarray[$key]['id'] = $slider->id;
                $sliderarray[$key]['image'] = DISPLAY_FULL_SLIDER_IMAGE_PATH.$slider->image;
                $sliderarray[$key]['title'] = $slider->title;
                $key++;

            }
        }
        $data['sliderList'] = $sliderarray;

        $freelancers = User::where('user_type','recruiter')
        ->where('status',1)
        ->count();
        $data['freelancers'] =$freelancers; 

        $time = time();
        $jobscount = Job::where('status' ,1 )
        ->where('expire_time', '>=' , $time)
        ->count();
        $data['jobscount'] =$jobscount; 




        return Response(['response' => $data ,'message' => 'success' ,'status' => 200 ],200);
        
        exit;
    }
    
    // public function index1():Response{
        

    //     $sloganText  = Admin::whereId(1)->select('slogan_text')->first();
        
    //     $sliderList  = Slider::where('status',1)
    //     ->select('id','image','title')
    //     ->orderBy('id','asc')
    //     ->get();

    //     $site_setting = Site_setting::where('id',1)->first();


    //     $data['site_setting'] = $site_setting;
        
    //     $key = 0;
    //     $sliderarray = array();
    //   // foreach($sliderList as $key => $slider){

    //     foreach ($sliderList as $slider) {


    //         if(file_exists(UPLOAD_FULL_SLIDER_IMAGE_PATH.$slider->image) && $slider->image != ''){
    //             $sliderarray[$key]['id'] = $slider->id;
    //             $sliderarray[$key]['image'] = DISPLAY_FULL_SLIDER_IMAGE_PATH.$slider->image;
    //             $sliderarray[$key]['title'] = $slider->title;
    //             $key++;

    //         }
    //     }

        
    //     $data['sliderList'] = $sliderarray;
        
    //     $freelancers = User::where('user_type','recruiter')
    //     ->where('status',1)
    //     ->count();
    //     $data['freelancers'] =$freelancers; 
        
    //     $time = time();
    //     $jobscount = Job::where('status' ,1 )
    //     ->where('expire_time', '>=' , $time)
    //     ->count();
    //     $data['jobscount'] =$jobscount; 


    //     return Response(['response' => $data ,'message' => 'success' ,'status' => 200 ],200);


    // }
    
    public function index():Response{
        //exit;

        $sloganText  = Admin::whereId(1)->select('slogan_text')->first();
        //$data['sloganText'] = $sloganText;

        $oldLogo = Admin::where('id',1)->select('logo')->first();


            if($oldLogo->logo){
             
                $data['logo_path'] =HTTP_PATH.'/public/files/joblogo/'.$oldLogo->logo;
            }else{
                $data['logo_path'] = '';
               
            }
            


        $categories = (new category)->getCategoryList();
        $data['categories'] = $categories;

        $subcategories=array();       
        $data['subcategories'] = $subcategories;

        $skillList = Skill::where('status',1)
        ->select('id','name','slug')
        ->orderBy('name','asc')
        ->get();
        $data['skillList'] = $skillList;

        $locationlList = Location::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $time = time();

        $latestJobList = Job::where('status' ,1 )
        ->where('category_id','<>',0)
        ->where('expire_time', '>=' , $time)
        ->orderBy('created' , 'Desc')
        ->limit(6)
        ->select('id','slug','title','job_city','work_type','company_name','created','expire_time','min_exp','max_exp','min_salary','max_salary','brief_abtcomp','category_id','logo')
        ->get();

        $latest_job = array();

        $work = $GLOBALS['worktype'];

        foreach($latestJobList as $key =>$value){

            $specificDate = date('Y-m-d',strtotime($value->created));

            // Create DateTime objects for the specific date and current date
            $specificDateTime = new DateTime($specificDate);
            $currentDateTime = new DateTime();

            // Calculate the difference between the specific date and current date
            $interval = $specificDateTime->diff($currentDateTime);

            // Get the number of days from the interval
            $daysAgo = $interval->days;
            $latest_job[$key]['id'] = $value->id;
            $latest_job[$key]['slug'] = $value->slug;
            $latest_job[$key]['title'] = $value->title;
            $latest_job[$key]['job_city'] = $value->job_city;
            if(!empty($value->work_type)) {
                $latest_job[$key]['work_type'] = $work[$value->work_type];
            } else{
                $latest_job[$key]['work_type'] = "N/A";
            }
            $latest_job[$key]['company_name'] = $value->company_name;
            $latest_job[$key]['created'] = $daysAgo;
            $latest_job[$key]['expire_time'] = $value->expire_time;
            $latest_job[$key]['min_exp'] =  $value->min_exp;
            $latest_job[$key]['max_exp'] =  $value->max_exp;
            $latest_job[$key]['min_salary'] =  $value->min_salary;
            $latest_job[$key]['max_salary'] =  $value->max_salary;
            $latest_job[$key]['brief_abtcomp'] = $value->brief_abtcomp;
            $latest_job[$key]['cat_slug'] = Category::where('id',$value->category_id)->pluck('slug')->implode(',');
            
                        if($value->logo != '')
                $latest_job[$key]['logo'] = DISPLAY_JOB_LOGO_PATH.$value->logo;
            else
                $latest_job[$key]['logo'] = '';
                
            
            // $latest_job[$key]['logo'] = '';
            // if($latest_job[$key]['logo'] != '')
            //     $latest_job[$key]['logo'] = UPLOAD_JOB_LOGO_PATH.$value->logo;

        }

        $data['latestJobList'] = $latest_job;

        $importjobs = Importjob::where('category', 'regexp', '^[A-Z]')
        ->orderBy('id', 'DESC')
        ->limit(3)
        ->get();

        $jobdetails = array();
        foreach($importjobs as $key => $job){
            
            $specificDate = date('Y-m-d',strtotime($job->date));
            $specificDateTime = new DateTime($specificDate);
            $currentDateTime = new DateTime();
            $interval = $specificDateTime->diff($currentDateTime);

            $daysAgo = $interval->days;
            $jobdetails[$key]['id'] = $job->id;
            $jobdetails[$key]['referencenumber'] = $job->referencenumber;
            $jobdetails[$key]['title'] = $job->title;
            $jobdetails[$key]['url'] = $job->url;
            $jobdetails[$key]['company'] = $job->company;
            $jobdetails[$key]['category'] = $job->category;
            $jobdetails[$key]['city'] = $job->city;
            $jobdetails[$key]['state'] = $job->state;
            $jobdetails[$key]['country'] = $job->country;
            $jobdetails[$key]['postalcode'] = $job->postalcode;
            $jobdetails[$key]['cpc'] = $job->cpc;
            $jobdetails[$key]['education'] = $job->education;
            $jobdetails[$key]['jobtype'] = $job->jobtype;
            $jobdetails[$key]['created'] = $daysAgo;
            $jobdetails[$key]['date'] = $daysAgo;

        }

        $data['importjobs'] = $jobdetails;

        // $newJobseeker = User::with('education', 'experience')->where('user_type','candidate')
        // ->where('status',1)
        // ->orderBy('id','desc')
        // ->limit(5000)
        // ->get();


        // $nrtt = array();
        // if ($newJobseeker) {
        //     $count = 0;
        //     foreach ($newJobseeker as $newJobseekerVal) {
        //         if (isset($newJobseekerVal['Education']) && count($newJobseekerVal['Education']) > 0 || isset($newJobseekerVal['Experience']) && count($newJobseekerVal['Experience']) > 0) {
        //             $nrtt[] = $newJobseekerVal;
        //             $count ++;
        //         }
        //         if ($count == 5) {
        //             break;
        //         }
        //     }
        // }

        $job_titles = Job::where('status',1)
        ->where('expire_time', '>=' , time())
        ->select('slug','title','id')
        ->get();

        $jobTitle = array();

        foreach($job_titles as $key => $value){
            $jobTitle[$key]['title'] =  ucfirst($value->title);
            $jobTitle[$key]['slug'] =  $value->slug;
            $jobTitle[$key]['id'] =  $value->id;
        }

        $data['job_title'] = $jobTitle;


        $keywords = Keyword::where('status',1)
        ->where('approval_status',1)
        ->select('slug','id','name')
        ->get();

        $data['keywords'] = $keywords;


        $condition2 = array();

        $newJobrecuirer = User::where('user_type','recruiter')
        ->where('status',1)
        ->orderBy('verify','desc')
        ->orderBy('id','desc')
        ->limit(10)
        ->get();

        $data['newJobrecuirer '] =$newJobrecuirer; 

        // $categoryDetail = Job::join('categories' , 'job.category_id','=','categories.id')
        // ->where('job.status',1)
        // ->where('job.category_id','<>',0)
        // ->where('job.expire_time','>=',$time)
        // ->orderBy('job.created','Desc')
        // ->groupBy('job.category_id')
        // ->select('count(job.id),categories.name,categories.slug')
        // ->get();

        // $categories_listing = DB::table('categories as c1')
        // ->select('c1.slug as slug', 'c1.name as name', 'c1.image as image', 'c1.id as id')
        // ->selectSub(function ($query) {
        //     $query->selectRaw("GROUP_CONCAT(c2.name SEPARATOR ' | ')")
        //         ->from('categories as c2')
        //         ->whereColumn('c2.parent_id', 'c1.id')
        //         ->where('c2.status', 1)
        //         ->groupBy('c1.id')
        //         ->limit(3);
        // }, 'sub_cat')
        // ->where('c1.status', 1)
        // ->where('c1.image', '<>', '')
        // ->where('c1.parent_id', 0)
        // ->limit(8)
        // ->get();

        $categories_listing = DB::select("
                SELECT 
                    c1.slug AS slug, 
                    c1.name AS name, 
                    CONCAT('".DISPLAY_FULL_CATEGORY_IMAGE_PATH."',c1.image) AS image, 
                    c1.id AS id, 
                    (
                        SELECT 
                            GROUP_CONCAT(c2.name SEPARATOR ' | ')
                        FROM 
                            tbl_categories AS c2
                        WHERE 
                            c2.parent_id = c1.id
                            AND c2.status = 1
                        GROUP BY 
                            c1.id
                        LIMIT 3
                    ) AS sub_cat
                FROM 
                    tbl_categories AS c1
                WHERE 
                    c1.status = 1
                    AND c1.image <> ''
                    AND c1.parent_id = 0
                LIMIT 8;
            ");

        // $categories_listing = Category::where('parent_id',0)
        // ->where('status',1)
        // ->where('image','<>','')
        // ->select('slug','name' ,'image','id')
        // ->limit(8)
        // ->get();
        $data['categories_listing'] = $categories_listing;

        $announcementList = Announcement::where('status',1)
        ->orderBy('id','desc')
        ->select('id','name','url')
        ->get();
        $data['announcementList'] = $announcementList;

        $sliderList  = Slider::where('status',1)
        ->select('id','image','title')
        ->orderBy('id','asc')
        ->get();

 $site_setting = Site_setting::where('id',1)->first();


        $data['site_setting'] = $site_setting;
        
        $key = 0;
        $sliderarray = array();
       // foreach($sliderList as $key => $slider){

        foreach ($sliderList as $slider) {


            if(file_exists(UPLOAD_FULL_SLIDER_IMAGE_PATH.$slider->image) && $slider->image != ''){
                $sliderarray[$key]['id'] = $slider->id;
                $sliderarray[$key]['image'] = DISPLAY_FULL_SLIDER_IMAGE_PATH.$slider->image;
                $sliderarray[$key]['title'] = $slider->title;
                $key++;

            }
        }

        
        $data['sliderList'] = $sliderarray;

      // echo '<pre>'; print_r($data['sliderList']);exit;

        $userId = Session::get('user_id');

        $plans = new Plan;
        $plans =$plans->where('status',1);

        if($userId){
            $userCheck = User::whereId($userId);
            if($userCheck->user_type == 'recruiter'){
                $plans =$plans->where('planuser','employer');
            }else{
                $plans =$plans->where('planuser','jobseeker');
            }

        }else{
            $plans =$plans->where('planuser','jobseeker');
        }

        $plans = $plans->orderBy('amount','ASC');
        $plans = $plans->get();


        $planFeatuersMax = $GLOBALS['planFeatuersMax'];
        $planFeatuers = $GLOBALS['planFeatuers'];
        $planFeatuersDis = $GLOBALS['planFeatuersDis'];
        $planType = $GLOBALS['planType'];
        $planFeatuersHelpText = $GLOBALS['planFeatuersHelpText'];

        $sdate = date('Y-m-d');

        $plans_details =  array();
        foreach ($plans as $planKey => $plan) {
            $tpvalue = $plan->type_value;
            $plan_name = $plan->plan_name;

            if ($plan->type == 'Months') {
                $edate = date('Y-m-d', strtotime($sdate . " + $tpvalue Months"));
                $edateDIS = date('M d, Y', strtotime($sdate . " + $tpvalue Months"));
            } else {
                $edate = date('Y-m-d', strtotime($sdate . " + $tpvalue Years"));
                $edateDIS = date('M d, Y', strtotime($sdate . " + $tpvalue Years"));
            }

            $plans_details[$planKey]['plan_name'] = $plan_name;
            $plans_details[$planKey]['amount'] = $plan->amount; 
            $plans_details[$planKey]['plan_type'] = $plan->type_value . ' ' . $plan->type;
            $plans_details[$planKey]['slug'] = $plan->slug;
            $plans_details[$planKey]['planuser'] = $plan->planuser;

            $fvalues = $plan->fvalues;
            $featureIds = explode(',', $plan->feature_ids);
            $fvalues = json_decode($plan->fvalues, true);

            $fdata = array();

            if ($featureIds) {
                foreach ($featureIds as $key => $fid) {
                    $ddd = '';
                    if (array_key_exists($fid, $fvalues) &&  array_key_exists($fid, $planFeatuersMax)) {
                        if ($fvalues[$fid] == $planFeatuersMax[$fid]) {
                            $joncnt = 'Unlimited';
                            $ddd .= '<b>' . 'Unlimited' . '</b>';
                        } else {
                            $joncnt = $fvalues[$fid];
                            $ddd .= '<b>' . $fvalues[$fid] . '</b>';
                        }
                    }

                    if (array_key_exists($fid, $planFeatuersHelpText)) {
                        $timecnt = $plan->type_value . ' ' . $plan->type;
                        if ($fid == 1) {
                            $farray = array('[!JOBS!]', '[!TIME!]', '[!RESUME!]');
                            $toarray = array($joncnt, $timecnt, '');
                        } elseif ($fid == 2) {
                            $farray = array('[!JOBS!]', '[!TIME!]', '[!RESUME!]');
                            $toarray = array('', $timecnt, $joncnt);
                        }

                        $msgText = str_replace($farray, $toarray, $planFeatuersHelpText[$fid]);
                        $disText = $msgText;
                    } else {
                        $disText = '';
                    }
                    $ddd .= ' ' . $planFeatuersDis[$fid] . $disText;

                    $fdata[$key] = $ddd;
                }

            }

            $plans_details[$planKey]['features'] =  $fdata;
        }

        $data['plans_details'] = $plans_details;

       //echo '<pre>'; print_r($plans_details);exit;
        

        $top_employeer = User::where('home_slider',1)
        ->where('status',1)
        ->where('activation_status',1)
        ->where('profile_image' , '<>' , '')
        ->select( DB::raw('CONCAT("'.DISPLAY_FULL_PROFILE_IMAGE_PATH.'" ,profile_image ) as profile_image'),'slug','id')
        ->orderBy('display_order','ASC')
        ->limit(8)
        ->get();


        $data['top_employer'] = $top_employeer;
        
        $site_setting = Site_setting::where('id',1)->first();


        $data['site_setting'] = $site_setting;
        

        //echo '<pre>';print_r(count($top_employeer));exit;

        $adDetails = (new Banneradvertisement)->getBanneradvertisement('home_ad1' , 1);
        $adDetails2 = (new Banneradvertisement)->getBanneradvertisement('home_ad2' , 1);

        $bannerDetails = array();

        if (!empty($adDetails) || !empty($adDetails2)) {
            $i = 0;
            if (!empty($adDetails)) {
                foreach ($adDetails as $ad_listing) {
                    if (strpos($ad_listing->url, 'http') === false) {
                        $url1 = 'http://' . $ad_listing->url;
                    } else {
                        $url1 = $ad_listing->url;
                    }

                    $bannerDetails[$i]['url'] = $url1;


                    if ($ad_listing->type == 1) {
                        $bannerDetails[$i]['image'] = DISPLAY_FULL_BANNER_AD_IMAGE_PATH . $ad_listing->image;

                    } elseif ($ad_listing->type == 2) {

                        $bannerDetails[$i]['code'] = $ad_listing->code;

                    } else {
                        $bannerDetails[$i]['text'] = $ad_listing->text;
                    }

                    $i++;
                }
            }

            if (!empty($adDetails2)) {
                foreach ($adDetails2 as $ad_listing2) { 
                    if (strpos($ad_listing2->url, 'http') === false) {
                        $url1 = 'http://' . $ad_listing2->url;
                    } else {
                        $url1 = $ad_listing2->url;
                    }

                    $bannerDetails[$i]['url'] = $url1;

                    if ($ad_listing2->type == 1) {
                        $bannerDetails[$i]['image'] = DISPLAY_FULL_BANNER_AD_IMAGE_PATH . $ad_listing2->image;
                    } elseif ($ad_listing2->type == 2) {
                        $bannerDetails[$i]['code'] = $ad_listing2->code;
                    } else {
                        $bannerDetails[$i]['text'] = $ad_listing2->text;
                    }

                    $i++;
                }
            }
        }

        $data['bannerDetails'] = $bannerDetails;
        
        $freelancers = User::where('user_type','recruiter')
        ->where('status',1)
        ->count();
        $data['freelancers'] =$freelancers; 
        
        $time = time();
        $jobscount = Job::where('status' ,1 )
        ->where('expire_time', '>=' , $time)
        ->count();
        $data['jobscount'] =$jobscount; 

        // $data['plans'] = $plans;


        return Response(['response' => $data ,'message' => 'success' ,'status' => 200 ],200);


    }
    
    public function sitemap():Response {

        $categories = (new Category)->getCategoryList();

        $jobs = Job::join('categories','categories.id','=','jobs.category_id')
        ->where('jobs.status',1)
        ->where('expire_time', '>=' , time())
        ->limit(95)
        ->orderBy('jobs.id','DESC')
        ->select('categories.slug as cat_slug','jobs.slug as job_slug','jobs.title')
        ->get();

        $data['category'] = $categories;
        $data['jobs'] = $jobs;

        return Response(['response'=>$data, 'message'=>'success' , 'status'=>200 ],200);
    }

    
}
