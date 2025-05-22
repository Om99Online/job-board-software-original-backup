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

use Session;

class HomesController extends Controller
{
    public function index():Response {

        $sloganText  = Admin::whereId(1)->select('slogan_text')->first();
        $data['sloganText'] = $sloganText;

        $categories = (new category)->getCategoryList();
        $data['categories'] = $categories;

        $subcategories=array();       
        $data['subcategories'] = $subcategories;

        $skillList = Skill::where('status',1)
        ->select('id','name')
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
        ->limit(12)
        ->get();

        $data['latestJobList'] =$latestJobList;

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

        $categories_listing = Category::where('parent_id',0)
        ->where('status',1)
        ->where('image','<>','')
        ->select('slug','name' ,'image','id')
        ->limit(8)
        ->get();
        $data['categories_listing'] = $categories_listing;

        $announcementList = Announcement::where('status',1)
        ->orderBy('id','desc')
        ->select('id','name','url')
        ->get();
        $data['announcementList'] = $announcementList;

        $sliderList  = Slider::where('status',1)
        ->orderBy('id','desc')
        ->select('id','image','title')
        ->get();
        $data['sliderList'] = $sliderList;

        $userId = Session::get('user_id');

        $plans = new Plan;
        $Plans =$plans->where('status',1);

        if($userId){
            $userCheck = User::whereId($userId);
            if($userCheck->user_type == 'recruiter'){
                $Plans =$plans->where('planuser','employer');
            }else{
                $Plans =$plans->where('planuser','jobseeker');
            }

        }else{
            $Plans =$plans->where('planuser','jobseeker');
        }

        $plans = $plans->orderBy('amount','ASC');
        $plans = $plans->get();

        $data['plans'] = $plans;


        return Response(['response' => $data ,'message' => 'success' ,'status' => 200 ],200);


    }

    
}
