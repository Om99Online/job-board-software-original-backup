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
use App\Models\Importjob;

use Session;
use Validator;
use App\Models\Admin;
use App\Models\Emailtemplate;
use Mail;
use App\Mail\SendMailable;
use DateTime;

class JobsImportsController extends Controller
{
     public function importjob(){
         
           
               // $xmlUrl = 'https://vendors.pandologic.com/RegalEnterprises_A/RegalEnterprises_A3.xml';
                $xmlUrl = 'https://vendors.pandologic.com/RegalEnterprises_A/RegalEnterprises_A2.xml';
              //  $xmlUrl = 'https://job-board-software.logicspice.com/job-board-script/tryhirehub.xml';

                $response = Http::get($xmlUrl);
                $xmlString = $response->body();
                
                $xml = simplexml_load_string($xmlString);
                $work = $GLOBALS['worktype'];

                foreach ($xml->job as $job) {
                   // $title=(string)$job->title;
                    //echo '<br>'.$title;
                    
                    $date=(string)$job->date;
                    $dateTime = date('Y-m-d H:i:s', strtotime($date));
                    $rfid=(string)$job->referencenumber;
                    $importjob = Importjob::where('referencenumber',$rfid)->first();
                    $add='N/A';
                    if(empty($importjob)){

                         $city = trim((string)$job->city);
                         $state = trim((string)$job->state);
                         $country = trim((string)$job->country);
                         $postalcode = trim((string)$job->postalcode);
                         if(($postalcode != 'N/A') && ($postalcode != '')){
                              $add=$postalcode;

                         }else{
                              $add=$city.','.$state.','.$country;

                         }
                         //echo '<pre>'.$add;

                         $apiKey = MAP_KEY; // Replace with your Google Maps API key
                 
                         $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                             'address' => $add,
                             'key' => $apiKey,
                         ]);
                 
                         $data = $response->json();
                       //  $location = $data['results'][0]['geometry']['location'];

                         //echo '<pre>';print_r($location);exit;



                         $lat='';
                         $lng='';

                         if (isset($data['results'][0]['geometry']['location'])) {
                             $location = $data['results'][0]['geometry']['location'];
                             $lat=$location['lat'];
                             $lng=$location['lng'];
                            // return response()->json(['latitude' => $location['lat'], 'longitude' => $location['lng']]);
                         }


                         $newJob = new Importjob();
                         $newJob->title = trim((string)$job->title);
                         $newJob->referencenumber = trim((string)$job->referencenumber);
                         $newJob->date = $dateTime;
                         $newJob->url = trim((string)$job->url);
                         $newJob->company = trim((string)$job->company);
                         $newJob->category = (string)$job->CategoryID;
                         $newJob->city = trim((string)$job->city);
                         $newJob->state = trim((string)$job->state);
                         $newJob->country = trim((string)$job->country);
                         $newJob->postalcode = trim((string)$job->postalcode);
                         $newJob->description = (string)$job->description;
                         $newJob->cpc = trim((string)$job->cpc);
                         $newJob->education = trim((string)$job->education);
                         $newJob->jobtype = trim((string)$job->jobtype);
                         $newJob->latitude = $lat;
                         $newJob->longitude = $lng;
                         $newJob->save();
                    }
                }
                echo 'jobs data saved.';exit;
     }

     public function getimportjob_old(Request $request):Response {


          $jobs = Importjob::orderBy('id','desc')->limit(90)->get();
          return Response(['response' => $jobs ,'message' => 'success' ,'status' => 200 ],200);

     }

    public function getimportjob(Request $request):Response {

          $data=array();
          $categories = Importjob::where('category', 'regexp', '^[A-Z]')
          ->select('category')
          ->groupBy('category')
          ->orderBy('id', 'DESC')
         // ->limit(90)
          ->get();

          $data['categories'] =  $categories;
          $keyword='';
          $category='';
          $location='';
          $radius='50';


        if(!empty($request->all())){
            $inputs = $request->all();



            if (isset($inputs['keyword']) && $inputs['keyword'] != '') {

                $keyword = trim($inputs['keyword']);

                $keywordId = Keyword::where('name',$keyword)
                ->where('type','Search')->get();

                if(!empty($keywordId)){

                    $keywordInsert = new Keyword;

                    $keywordInsert->name = $keyword;
                    $keywordInsert->slug = $this->createSlug($keyword, 'keywords');
                    $keywordInsert->status = '1';
                    $keywordInsert->approval_status = '0';
                    $keywordInsert->type = 'Search';
                    $keywordInsert->course_id = '0';
                    $keywordInsert->created = now();
                    $keywordInsert->save();
                }
                $data['keyword'] =  $keyword;
            }

            if (isset($inputs['category']) && !empty($inputs['category'])) {
               
               $category = $inputs['category'];
               $data['category'] =  $category;

            }

            if (isset($inputs['location']) && !empty($inputs['location'])) {
               

                $location = trim($inputs['location']);

            }

        }

        $Job = new Importjob;

        if (isset($keyword) && $keyword != '') {
            $keyword = str_replace('_', '\_', $keyword);
            $Job = $Job->whereRaw("(title LIKE '%".addslashes($keyword)."%' or company LIKE '%".addslashes($keyword)."%')");
            $keyword = str_replace('\_', '_', $keyword);
            $data['keyword']=$keyword;

        }

        if (isset($category) && $category != '') {
               $category = str_replace('_', '\_', $category);
               $Job = $Job->whereRaw("(category LIKE '%".addslashes($category)."%')");
               $category = str_replace('\_', '_', $category);
               $data['category']=$category;
        }


          if (isset($location) && !empty($location)) {
               $location = str_replace('_', '\_', $location);
               // $Job = $Job->whereRaw(" (`city` like '%" . addslashes($location) . "%') ");


               $apiKey = MAP_KEY; // Replace with your Google Maps API key
                    
               $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                    'address' => $location,
                    'key' => $apiKey,
               ]);
     
               $data = $response->json();
                    //  $location = $data['results'][0]['geometry']['location'];

               //echo '<pre>';print_r($location);exit;
               if (isset($inputs['radius']) && !empty($inputs['radius'])) {
                    $ratio = 1.609344;
                    $miles=trim($inputs['radius']);
                    $radius = round($miles * $ratio);
               }


               $latitude='';
               $longitude='';

               if (isset($data['results'][0]['geometry']['location'])) {
                    $loca = $data['results'][0]['geometry']['location'];
                    $latitude=$loca['lat'];
                    $longitude=$loca['lng'];
               }

              // $Job = $Job->selectRaw('( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance', [$latitude, $longitude, $latitude]);
               $Job = $Job->whereRaw('( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) < ?', [$latitude, $longitude, $latitude, $radius]);

               $data['location']=$location;
               $data['radius'] =  $radius;

          }


        // $jobs = $Job->toSql();
        //$jobs = $Job->orderBy('id', 'DESC')->limit(90)->get();
        $jobs = $Job->orderBy('id', 'DESC')->get();


        // print_r($jobs);
        // exit();

        $worktype = $GLOBALS['worktype'];

        $jobdetails = array();
        foreach($jobs as $key => $job){
            
            $specificDate = date('Y-m-d',strtotime($job->date));

            // Create DateTime objects for the specific date and current date
            $specificDateTime = new DateTime($specificDate);
            $currentDateTime = new DateTime();

            // Calculate the difference between the specific date and current date
            $interval = $specificDateTime->diff($currentDateTime);

            // Get the number of days from the interval
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
           // $jobdetails[$key]['description'] = $job->description;
            $jobdetails[$key]['cpc'] = $job->cpc;
            $jobdetails[$key]['education'] = $job->education;
            $jobdetails[$key]['jobtype'] = $job->jobtype;
            $jobdetails[$key]['created'] = $daysAgo;
            $jobdetails[$key]['date'] = $daysAgo;

        }

        $data['jobs'] = $jobdetails;

        return Response(['response' => $data , 'message' => 'success', 'status'=>200 ],200);

    }

    public function jobdetail($id = NULL):Response {

     $data=array();

     
          if($id != ''){
               $job = Importjob::where('id',$id)->first();

               if(!empty($job)){


               $specificDate = date('Y-m-d',strtotime($job->date));

               // Create DateTime objects for the specific date and current date
               $specificDateTime = new DateTime($specificDate);
               $currentDateTime = new DateTime();
   
               // Calculate the difference between the specific date and current date
               $interval = $specificDateTime->diff($currentDateTime);
   
               // Get the number of days from the interval
               $daysAgo = $interval->days;
               $data['id'] = $job->id;
               $data['referencenumber'] = $job->referencenumber;
               $data['title'] = $job->title;
               $data['url'] = $job->url;
               $data['company'] = $job->company;
               $data['category'] = $job->category;
               $data['city'] = $job->city;
               $data['state'] = $job->state;
               $data['country'] = $job->country;
               $data['postalcode'] = $job->postalcode;
               $data['description'] = $job->description;
               $data['cpc'] = $job->cpc;
               $data['education'] = $job->education;
               $data['jobtype'] = $job->jobtype;
               $data['created'] = $daysAgo;
               $data['date'] = $daysAgo;
          }

          }

        return Response(['response' => $data , 'message' => 'success', 'status'=>200 ],200);

    }

}
