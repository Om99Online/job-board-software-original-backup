<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

use Session;
use App\Models\Admin;
use Validator;
use App\Models\Emailtemplate;
use Mail;
use App\Mail\SendMailable;

class JobsController extends Controller
{
    public function listing(Request $request, $categorySlug = ''):Response {

        $userId = Session::get('user_id');


        $category = Category::where('parent_id',0)
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name')
        ->get();


        $Job = Job::where('status',1)
        ->where('expire_time' ,'>=', time())
        ->select(
            'job_number',
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
            'work_type'
        )
        ->get();


        $data = [
            'category' => $category,
            'jobs' => $Job,
        ];

        return Response(['response' => $data , 'message' => 'success' ,'status'=>200 ],200);


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

        }else{
            $metaData = Admin::whereId(1)->first();

            $data['metaData'] = $metaData;

        }

        $slug = $categorySlug;

        if($userId){
            $showOldImages = Certificate::where('user_id',$userId)->orderBy('id','ASC')->first();

            $data['showOldImages'] = $showOldImages;
        }


        $categories = Category::where('parent_id',0)
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name','ASC')
        ->get();

        $data['categories'] = $categories;


        $subcategories = array();
        if (isset($category_id) && $category_id != '') {

            $subcategories = Category::where('status',1)
            ->where('parent_id',$category_id)
            ->orderBy('name','ASC')
            ->select('id','name')
            ->get();

            $data['subcategories'] = $subcategories;
        } else {
            $data['subcategories'] = $subcategories;
        }

        // get skills
        $skillDesList = Skill::where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['skillDesList '] = $skillDesList;

        // get skills from skill table
        $skillList  = Skill::where('type','Skill')
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['skillList'] = $skillList;


        // get designations from skill table
        $designationlList = Skill::where('type','Designation')
        ->where('status',1)
        ->select('id','name')
        ->orderBy('name','asc')
        ->get();

        $data['designationlList'] = $designationlList;

        // get locations from location table
        $locationlList  = Location::where('status',1)
        ->select('id','name')
        ->get();

        $data['locationlList'] = $locationlList;


        $condition = array('Job.status' => 1, 'Job.expire_time >=' => time());

        $order = '';




    

 

        if (!empty($this->data)) {

            if (isset($this->data['Job']['created']) && $this->data['Job']['created'] != '') {
                $order = 'Job.' . $this->data['Job']['created'];
            }

            if (isset($this->data['Job']['keyword']) && $this->data['Job']['keyword'] != '') {
                $keyword = trim($this->data['Job']['keyword']);
                $keywordId = $this->Keyword->field('id', array('Keyword.name' => $keyword, 'Keyword.type' => 'Search'));
                if (!$keywordId) {
                    $this->request->data['Keyword']['name'] = $keyword;
                    $this->request->data['Keyword']['slug'] = $this->stringToSlugUnique($keyword, 'Keyword');
                    $this->request->data['Keyword']['status'] = '1';
                    $this->request->data['Keyword']['approval_status'] = '0';
                    $this->request->data['Keyword']['type'] = 'Search';
                    $this->Keyword->save($this->data);
                }
            }

            if (isset($this->data['Job']['category_id']) && !empty($this->data['Job']['category_id'])) {
                if (is_array($this->data['Job']['category_id'])) {
                    $category_id = implode('-', $this->data['Job']['category_id']);
                } else {
                    $category_id = $this->data['Job']['category_id'];
                }
            }

            if (isset($this->data['Job']['searchkey']) && $this->data['Job']['searchkey'] != '') {
                if (is_array($this->data['Job']['searchkey'])) {
                    $searchkey = implode('-', $this->data['Job']['searchkey']);
                } else {
                    $searchkey = $this->data['Job']['searchkey'];
                }
            }

            if (isset($this->data['Job']['subcategory_id']) && !empty($this->data['Job']['subcategory_id']) && count($this->data['Job']['subcategory_id']) > 0) {
                if (is_array($this->data['Job']['subcategory_id'])) {
                    $subcategory_id = implode('-', $this->data['Job']['subcategory_id']);
                } else {
                    $subcategory_id = $this->data['Job']['subcategory_id'];
                }
            }

            if (isset($this->data['Job']['location']) && !empty($this->data['Job']['location'])) {
                $location = trim($this->data['Job']['location']);
                // $location = str_replace(',', '', $location);
                //                if (is_array($this->data['Job']['location'])) {
                //                    $location = implode('-', str_replace(',', '', $this->data['Job']['location']));
                //                } else {
                //                    $location = str_replace(',', '', $this->data['Job']['location']);
                //                }
            }
            if (isset($this->data['Job']['radius']) && $this->data['Job']['radius'] != '') {
                $radius = trim($this->data['Job']['radius']);
            }

            if (isset($this->data['Job']['work_type']) && !empty($this->data['Job']['work_type']) && count($this->data['Job']['work_type']) > 0) {
                if (is_array($this->data['Job']['work_type'])) {
                    $worktype = implode('-', $this->data['Job']['work_type']);
                } else {
                    $worktype = $this->data['Job']['work_type'];
                }
            }


            if (!empty($this->data['Job']['skill'])) {
                //$skill = implode(",", $this->data['Job']['skill']);
                $skill = $this->data['Job']['skill'];
                //$skill = addslashes($skill);
                $this->set('skill', $this->data['Job']['skill']);
            }

            if (!empty($this->data['Job']['designation'])) {

                $designation = addslashes($this->data['Job']['designation']);
                $this->set('designation', $this->data['Job']['designation']);
            }
            if (isset($this->data['Job']['salary']) && $this->data['Job']['salary'] != '') {
                $salary = trim($this->data['Job']['salary']);
            }
            //            if (isset($this->data['Job']['max_salary']) && $this->data['Job']['max_salary'] != '') {
            //                $max_salary = trim($this->data['Job']['max_salary']);
            //            }

            if (isset($this->data['Job']['exp']) && $this->data['Job']['exp'] != '') {
                $exp = $this->data['Job']['exp'];
                $expArray = explode('-', $exp);
                $min_exp = $expArray[0];
                $max_exp = $expArray[1];
            }

            if (isset($this->data['Job']['min_exp']) && $this->data['Job']['min_exp'] != '') {
                $min_exp = trim($this->data['Job']['min_exp']);
            }
            if (isset($this->data['Job']['max_exp']) && $this->data['Job']['max_exp'] != '') {
                $max_exp = trim($this->data['Job']['max_exp']);
            }
            if (isset($this->data['Job']['lat']) && $this->data['Job']['lat'] != '') {
                $lat = trim($this->data['Job']['lat']);
            }
            if (isset($this->data['Job']['long']) && $this->data['Job']['long'] != '') {
                $long = trim($this->data['Job']['long']);
            }
        } elseif (!empty($this->params)) {

            if (isset($this->params['named']['keyword']) && $this->params['named']['keyword'] != '') {
                $keyword = urldecode(trim($this->params['named']['keyword']));
            }
            if (isset($this->params['named']['radius']) && $this->params['named']['radius'] != '') {
                $radius = urldecode(trim($this->params['named']['radius']));
            }
            if (isset($this->params['named']['category_id']) && $this->params['named']['category_id'] != '') {
                $category_id = trim($this->params['named']['category_id']);
            }
            if (isset($this->params['named']['subcategory_id']) && $this->params['named']['subcategory_id'] != '') {
                $subcategory_id = trim($this->params['named']['subcategory_id']);
            }

            if (isset($this->params['named']['location']) && $this->params['named']['location'] != '') {
                $location = urldecode(trim($this->params['named']['location']));
            } else if (isset($_SESSION['locationid']) && $_SESSION['locationid'] > 0) {
                $location = $_SESSION['locationid'];
            }

            if (isset($this->params['named']['work_type']) && $this->params['named']['work_type'] != '') {
                $worktype = urldecode(trim($this->params['named']['work_type']));
            }

            if (isset($this->params['named']['skill']) && $this->params['named']['skill'] != '') {
                $skill = trim($this->params['named']['skill']);
                $skill = addslashes($skill);
                $this->set('skill', $skill);
            }

            if (isset($this->params['named']['designation']) && $this->params['named']['designation'] != '') {
                $designation = trim($this->params['named']['designation']);
                $designation = addslashes($designation);
                $this->set('designation', $designation);

                $catData = $this->Skill->find('first', array('conditions' => array('Skill.name' => $designation)));
                $this->set('degData', $catData);
            }
            if (isset($this->params['named']['salary']) && $this->params['named']['salary'] != '') {
                $salary = urldecode(trim($this->params['named']['salary']));
            }
            if (isset($this->params['named']['max_salary']) && $this->params['named']['max_salary'] != '') {
                $max_salary = urldecode(trim($this->params['named']['max_salary']));
            }
            if (isset($this->params['named']['min_exp']) && $this->params['named']['min_exp'] != '') {
                $min_exp = urldecode(trim($this->params['named']['min_exp']));
            }
            if (isset($this->params['named']['max_exp']) && $this->params['named']['max_exp'] != '') {
                $max_exp = urldecode(trim($this->params['named']['max_exp']));
            }
            if (isset($this->params['named']['lat']) && $this->params['named']['lat'] != '') {
                $lat = urldecode(trim($this->params['named']['lat']));
            }
            if (isset($this->params['named']['long']) && $this->params['named']['long'] != '') {
                $long = urldecode(trim($this->params['named']['long']));
            }
            if (isset($this->params['named']['searchkey']) && $this->params['named']['searchkey'] != '') {
                $searchkey = urldecode(trim($this->params['named']['searchkey']));
            }

            //            if (isset($this->params['named']['order']) && $this->params['named']['order'] != '') {
            //                $order = urldecode(trim($this->params['named']['order']));
            //            }
        }



        if (isset($keyword) && $keyword != '') {
            $separator[] = 'keyword:' . urlencode($keyword);
            $keyword = str_replace('_', '\_', $keyword);
            $condition[] = " (`Job`.`title` LIKE '%" . addslashes($keyword) . "%' OR `Job`.`description` LIKE '%" . addslashes($keyword) . "%' OR `Job`.`company_name` LIKE '%" . addslashes($keyword) . "%' ) ";
            $keyword = str_replace('\_', '_', $keyword);
            $this->set('keyword', $keyword);
            // print_r('asdasd');exit;
        }


        if (isset($searchkey) && !empty($searchkey)) {

            $searchkey_arr = explode("-", $searchkey);

            foreach ($searchkey_arr as $id) {
                $condition_search[] = "(FIND_IN_SET('" . $id . "',Job.skill) OR FIND_IN_SET('" . $id . "',Job.designation) )";
            }
            $condition[] = array('OR' => $condition_search);
            $urlSeparator[] = 'searchkey:' . $searchkey;
            $separator[] = 'searchkey:' . $searchkey;
            $this->set('searchkey', $searchkey);
        }
        // pr($condition); exit; 

        if (isset($category_id) && $category_id != '') {
            $this->set('topcate', $category_id);
            $separator[] = 'category_id:' . $category_id;
            $category_idCondtionArray = explode('-', $category_id);

            if (isset($subcategory_id) && $subcategory_id != '') {
                $this->set('subcate', $subcategory_id);
                $subcategory_idCondtionArray = explode('-', $subcategory_id);
                foreach ($subcategory_idCondtionArray as $subMain) {
                    $subMainVal = $this->Category->field('parent_id', array('Category.id' => $subMain));
                    if (($key = array_search($subMainVal, $category_idCondtionArray)) !== false) {
                        unset($category_idCondtionArray[$key]);
                    }
                    //   pr($category_idCondtionArray);
                }
                // pr($category_idCondtionArray);
                if ($category_idCondtionArray) {
                    $subcategory_idCondtion = implode(',', $subcategory_idCondtionArray);
                    $separator[] = 'subcategory_id:' . $subcategory_id;

                    $category_idCondtion = implode(',', $category_idCondtionArray);
                    $condition[] = " (Job.category_id IN ($category_idCondtion) OR Job.subcategory_id IN ($subcategory_idCondtion ) )";
                } else {
                    $subcategory_idCondtion = implode(',', $subcategory_idCondtionArray);
                    $condition[] = " (Job.subcategory_id IN ($subcategory_idCondtion ))";
                    $separator[] = 'subcategory_id:' . $subcategory_id;
                }
            } else {
                $category_idCondtion = implode(',', $category_idCondtionArray);
                $condition[] = " (Job.category_id IN ($category_idCondtion))";
            }
        }
        /* if (isset($categoryId) && $categoryId != '') {
          $separator[] = 'categoryId:' . urlencode($categoryId);
          $categoryId = str_replace('_', '\_', $categoryId);
          $condition[] = " (`Job`.`category_id` = $categoryId) ";
          $categoryId = str_replace('\_', '_', $categoryId);
          $this->set('categoryId', $categoryId);
          }
          if (isset($subcategoryId) && $subcategoryId != '') {
          $separator[] = 'subcategoryId:' . urlencode($subcategoryId);
          $subcategoryId = str_replace('_', '\_', $subcategoryId);
          $condition[] = "( FIND_IN_SET('$subcategoryId',`Job`.`subcategory_id`)) ";
          $subcategoryId = str_replace('\_', '_', $subcategoryId);
          $this->set('subcategoryId', $subcategoryId);
          }
          if (isset($skill) && $skill != '') {
          $separator[] = 'skill:' . urlencode($skill);
          $skill = str_replace('_', '\_', $skill);
          $condition[] = "( FIND_IN_SET('$skill',`Job`.`skill`)) ";
          $skill = str_replace('\_', '_', $skill);
          $this->set('skill', $skill);
          } */

        if (!empty($skill)) {
            // print_r($skill);exit;
            $skill_arr = explode(",", $skill);

            //            foreach ($skill_arr as $skil) {
            //                $condition_skill[] = "(FIND_IN_SET('" . $skil . "',Job.skill))";
            //            }
            $keyword = array();
            foreach ($skill_arr as $skillhave) {
                $cbd[] = '(Skill.name = "' . $skillhave . '")';


                $skillDetail = $this->Skill->find('first', array('conditions' => $cbd));
                // print_r($skillDetail['Skill']['id']);exit;

                if ($skillDetail) {

                    $idshave = $skillDetail['Skill']['id'];
                    $condition_skill[] = "(FIND_IN_SET('" . $idshave . "',Job.skill))";
                    //$condition_skill[] = '(Job.skill LIKE "%'.$idshave.'%")';
                    // $condition_skill[] = '(Job.skill = "'.$idshave.'")';
                } else {
                    if ($skillhave != '') {
                        $condition_skill[] = "(Skill.name LIKE '%" . addslashes($skillhave) . "%')";
                    }
                }
            }

            $condition[] = array('OR' => $condition_skill);
            $urlSeparator[] = 'skill:' . $skill;
            $separator[] = 'skill:' . $skill;
        }

        if (!empty($location)) {

            //            $location_arr = explode("-", $location);
            //            if (count($location_arr) > 1) {
            //                foreach ($location_arr as $loc) {
            //                    $condition_location[] = "(FIND_IN_SET('" . $loc . "',Job.location))";
            //                }
            //                $condition[] = array('OR' => $condition_location);
            //            } else {
            //                $condition[] = "(FIND_IN_SET('" . $location . "',Job.location))";
            //            }
            //            $location_arr = explode("-", $location);
            // $condition[] = array("MATCH(job_city) AGAINST ('$location' IN BOOLEAN MODE)");
            //    $condition[] = " (`Job`.`job_city` like '%" . addslashes($location) . "%') ";

            $urlSeparator[] = 'location:' . $location;
            $separator[] = 'location:' . $location;
            $this->set('location', $location);
            $location = str_replace('_', '\_', $location);
            // print_r($location);exit;
            $this->Job->virtualFields['relevance'] = "MATCH(`Job`.`job_city`) AGAINST ('$location' IN BOOLEAN MODE) ";
            // $condition[] = array("MATCH(`Job`.`job_city`) AGAINST ('$location' IN BOOLEAN MODE) ");
            $condition[] = " (`Job`.`job_city` like '%" . addslashes($location) . "%') ";

            $location = str_replace('\_', '_', $location);
            $order = 'relevance Desc';
        }

        if (!empty($worktype)) {

            $worktype_arr = explode("-", $worktype);

            foreach ($worktype_arr as $work) {
                $condition_worktype[] = "(FIND_IN_SET('" . $work . "',Job.work_type))";
            }
            $condition[] = array('OR' => $condition_worktype);
            $urlSeparator[] = 'work_type:' . $worktype;
            $separator[] = 'work_type:' . $worktype;
            $this->set('worktype', $worktype);
        }



        //        if (isset($designation) && $designation != '') {
        //            $separator[] = 'designation:' . urlencode($designation);
        //            $designation = str_replace('_', '\_', $designation);
        //            $condition[] = " (`Job`.`designation` = $designation) ";
        //            $designation = str_replace('\_', '_', $designation);
        //            $this->set('designation', $designation);
        //        }


        if (!empty($designation)) {
            $designation_arr = explode(",", $designation);
            foreach ($designation_arr as $des) {
                $cbsd[] = '(Designation.name = "' . $des . '")';
                $dDetail = $this->Designation->find('first', array('conditions' => $cbsd));
                if ($dDetail) {
                    $idshave = $dDetail['Designation']['id'];
                    $condition_designation[] = '(Job.designation LIKE "%' . $idshave . '%")';
                } else {
                    if ($des != '') {
                        //$condition_designation[] = "(FIND_IN_SET('" . $des . "',Job.designation))";
                        $condition_designation[] = "(Designation.name LIKE '%" . addslashes($des) . "%')";
                    }
                }
            }
            $condition[] = array('OR' => $condition_designation);
            $urlSeparator[] = 'designation:' . $designation;
            $separator[] = 'designation:' . $designation;
        }
        /* if (isset($min_salary) && $min_salary != '') { //echo 'vdsdv';exit;
          $separator[] = 'min_salary:' . urlencode($min_salary);
          $min_salary = str_replace('_', '\_', $min_salary);
          $condition[] = " ( Job.min_salary >= '$min_salary' ) ";
          $min_salary = str_replace('\_', '_', $min_salary);
          }
          if (isset($max_salary) && $max_salary != '') {
          $separator[] = 'max_salary:' . urlencode($max_salary);
          $max_salary = str_replace('_', '\_', $max_salary);
          $condition[] = " ( Job.max_salary <= '$max_salary' ) ";
          $max_salary = str_replace('\_', '_', $max_salary);
          } */

        if ((isset($salary) && $salary != '')) {
            $separator[] = 'salary:' . urlencode($salary);

            $salary = str_replace('_', '\_', $salary);
            $expsalary = explode('-', $salary);
            $min_salary = $expsalary[0];
            $max_salary = $expsalary[1];

            $condition[] = " ((Job.min_salary >= $min_salary AND Job.max_salary <= $min_salary) OR (Job.min_salary >= $min_salary AND Job.max_salary <= $max_salary) OR (Job.min_salary = $max_salary ) OR (Job.max_salary = $min_salary )) ";

            $salary = str_replace('\_', '_', $salary);

            $this->set('salary', $salary);
            // $this->set('max_salary', $max_salary);
        }

        /* if (isset($min_exp) && $min_exp != '') { //echo 'vdsdv';exit;
          $separator[] = 'min_exp:' . urlencode($min_exp);
          $min_exp = str_replace('_', '\_', $min_exp);
          $condition[] = " (Job.min_exp >= '$min_exp' AND (Job.max_exp >= '$min_exp' AND Job.max_exp <= '$max_exp')) ";
          $min_exp = str_replace('\_', '_', $min_exp);
          $this->set('min_exp', $min_exp);
          }
          if (isset($max_exp) && $max_exp != '') {
          $separator[] = 'max_exp:' . urlencode($max_exp);
          $max_exp = str_replace('_', '\_', $max_exp);
          $condition[] = " ( Job.max_exp <= '$max_exp') ";
          $max_exp = str_replace('\_', '_', $max_exp);
          $this->set('max_exp', $max_exp);
          } */

        if ((isset($min_exp) && $min_exp != '') && (isset($max_exp) && $max_exp != '')) {
            $separator[] = 'min_exp:' . urlencode($min_exp);
            $separator[] = 'max_exp:' . urlencode($max_exp);
            $min_exp = str_replace('_', '\_', $min_exp);

            if ($min_exp == $max_exp) {
                $condition[] = " ((Job.min_exp <= $min_exp AND Job.max_exp >= $min_exp)) ";
            } else {
                // $condition[] = " ((Job.min_exp >= $min_exp AND Job.max_exp <= $min_exp) OR (Job.min_exp >= $min_exp AND Job.max_exp <= $max_exp) OR (Job.min_exp = $max_exp ) OR (Job.max_exp = $min_exp )) ";
                $condition[] = " ((Job.min_exp >= $min_exp AND Job.max_exp <= $max_exp)) ";
            }
            $min_exp = str_replace('\_', '_', $min_exp);

            $this->set('min_exp', $min_exp);
            $this->set('max_exp', $max_exp);
        }

            //        $sort = '';
            //        if (isset($order) && $order != '') {
            //
            //            $ord = explode(" ", $order);
            //
            //            $separator[] = 'sort:' . urlencode($ord[0]);
            //            $sort = str_replace('_', '\_', $order);
            //
            //            $separator[] = 'order:' . urlencode($ord[1]);
            //            $order = str_replace('_', '\_', $order);
            //            $this->set('order', $order);
            //        }
                    //2017-02-18
            //        $condition[] = array("(Job.category_id != 0)");
            //        if (!empty($radius) && !empty($lat) && !empty($long)) {
            //            $latitude = $lat;
            //            $longitude = $long;
            ////            $this->Job->virtualFields['distance'] = "(((acos(sin(($latitude* pi()/ 180)) * sin((User.lat * pi()/ 180))+ cos(($latitude * pi()/ 180)) * cos((User.lat * pi()/ 180)) * cos((($longitude - User.long) * pi()/ 180)))))* 60 * 1.1515 * 1.609344)";
            //            $condition[] = array("(((acos(sin(($latitude* pi()/ 180)) * sin((Job.lat * pi()/ 180))+ cos(($latitude * pi()/ 180)) * cos((Job.lat * pi()/ 180)) * cos((($longitude - Job.long) * pi()/ 180)))))* 60 * 1.1515 * 1.609344)  < $radius");
            //            // $condition[] = array("MATCH(job_city) AGAINST ('$location' IN BOOLEAN MODE)");
            ////             $condition[] = " (Job__distance < $radius ) ";
            //
            //            $separator[] = 'radius:' . $radius;
            //            $this->set('radius', $radius);
            //            $separator[] = 'lat:' . $lat;
            //            $this->set('lat', $lat);
            //            $separator[] = 'long:' . $long;
            //            $this->set('long', $long);
            //        }
        if (empty($order))
            $order = 'Job.id Desc, Job.created Desc';
        // echo "<pre>"; print_r($order); //exit;
        $separator = implode("/", $separator);
        $urlSeparator = implode("/", $urlSeparator);

        $this->set('separator', $separator);
        $this->set('urlSeparator', $urlSeparator);
        //    echo "<pre>"; print_r($condition); exit;
        $this->paginate['Job'] = array('conditions' => $condition, 'limit' => '20', 'page' => '1', 'order' => $order);
        //        echo '<pre>';
        //    print_r($this->paginate('Job'));exit;
        $this->set('jobs', $this->paginate('Job'));

        if ($this->request->is('ajax')) {
            $this->layout = '';
            $this->viewPath = 'Elements' . DS . 'jobs';
            $this->render('listing');
        }

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


    public function detail($catslug = null, $slug = null):Response {

        $userId = Session::get('user_id');

        if($slug){
            $detailSlug = explode('.',$slug);
        }


        $jobdetails = Job::select('jobs.id as job_id,jobs.category_idn as job_cat_id,categories.slug as catslug')
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
    
    public function createJob(Request $request , $isCopy = null):Response {

        $data['jobsCreate'] = 'active';
        $data['isCopy'] = $isCopy;

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];


         // $this->userLoginCheck();
        if(!$this->recruiterAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }

        global $extentions;


        $isAbleToJob = (new Plan)->checkPlanFeature($userId, 1);


        if ($isAbleToJob['status'] == 0) {

            return Response(['response' => $isAbleToJob['message'] , 'message' => $isAbleToJob['message'] , 'status' => 500 ],200);
        }

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
                'company_website' => 'required',
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
                'jobDescription' => 'Job description',
                'company_name' => 'Company name',
                'work_type' => 'Work type',
                'contact_name' => 'Contact name',
                'contact_number' => 'Contact number',
                'companyProfile' => 'Company profile',
                'company_website' => 'Company website',
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

                // if (!isset($_SESSION['type']) && $_SESSION['type'] == '') {
                //     $msgString .= 'Select Job Type'. "<br>";
                // } else {
                //     $request['job']["type"] = $_SESSION['type'];
                // }


                $youtube_link = '';

                if($request->logo != '' && !empty($request->logo)){
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

                    $exp = explode('-',$request->experience);
                    $newJob->min_exp = $exp[0];
                    $newJob->max_exp = $exp[1];

                    $sallery = explode('-',$request->annual_salary);
                    $newJob->min_salary = $sallery[0];
                    $newJob->max_salary = $sallery[1];
                    

                    if($originalName != '' && !empty($originalName)){
                        // $specialCharacters = array('#', '$', '%', '@', '+', '=', '\\', '/', '"', ' ', "'", ':', '~', '`', '!', '^', '*', '(', ')', '|', "'");
                        // $toReplace = "-";

                        // $uploadedFileName = $this->uploadImage($file, UPLOAD_JOB_LOGO_PATH);

                        $decoded_string = base64_decode($file[1]);

                        file_put_contents(UPLOAD_JOB_LOGO_PATH.$originalName, $decoded_string);

                        $newJob->logo = $originalName;

                    }else{
                        $newJob->logo = '';
                    }

                    if($request->subCategory){
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

                            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));


                            // Admin email;
                            $username = "Admin";
                            $adminInfo = Admin::whereId(1)->first();

                            $email = $adminInfo->email;

                            $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                            $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                            $users = (new Alert_location)->getUsersToAlert($jobId);


                            if (!empty($users)) {
                                foreach ($users as $user) {

                                    $newAlertJob = new AlertJob; 

                                    $newAlertJob->job_id = $jobId;
                                    $newAlertJob->user_id = $user->id;
                                    $newAlertJob->email_address = $user->email_address;
                                    $newAlertJob->status = 1; 

                                    $newAlertJob->save();

                                }
                            }

                            return Response(['response' => 'Your job posted successfully.', 'message' => 'Your job posted successfully.' ,'status'=> 200 ],200);

                        }
                    }else{
                        $newJob->dis_amount = 0;
                        $newJob->promo_code = '';
                        $newJob->status = 1;

                        if($newJob->save()){
                            $jobId = $newJob->id;
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

                            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));


                            // Admin email;
                            $username = "Admin";
                            $adminInfo = Admin::whereId(1)->first();

                            $email = $adminInfo->email;

                            $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                            $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);

                            Mail::to($email)->send(new SendMailable($emailBody, $emailSubject));

                        }

                        return Response(['response' => 'Your job posted successfully.', 'message' => 'Your job posted successfully.', 'status'=>200 ],200);
                    }

                }
            }
        }else{

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


        $jobs = Job::where('user_id',$userId)
        ->orderBy('expire_time','desc')
        ->orderBy('payment_status','desc')
        ->get();
        
        $jobApply = new Job_apply;
        
        foreach($jobs as $key => $job){
            $data[$key]['totalCandidate'] = $jobApply->getTotalCandidate($job->id);
            $data[$key]['newApplicationCount'] = $jobApply->getNewCount($job->id);
            $data[$key]['jobAlert'] = Alert_job::where('job_id',$job->id)->count();
            $data[$key]['Job'] = $job;
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
    
    public function accdetail(Request $request, $slug = null, $status = null):Response
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

        $data['userDetails'] = $userDetails;

        // Location::where('name',$userDetails->location)

        $planDetails = (new Plan)->getcurrentplan($userId);

        $data['planDetails'] = '';
        if($planDetails->count() > 0){
            $data['planDetails'] = $planDetails->plan_name;
        }
        

        $jobInfo = Job::where('slug', $slug)->first();
        

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
            }
        } elseif (!empty($request->route())) {
            $keyword = urldecode(trim($request->route('keyword')));
        }

        $jobApply = $jobApply->orderBy('id','desc');
    
        $separator = implode('/', $separator);
        $urlSeparator = implode('/', $urlSeparator);

        $candidates = $jobApply->get();
        
        $jobApply = new Job_apply;

        $data['activeJobs'] = $jobApply->getStatusCount($jobInfo->id,'active');
        $data['shortList'] = $jobApply->getStatusCount($jobInfo->id,'short_list');
        $data['interview'] = $jobApply->getStatusCount($jobInfo->id,'interview');
        $data['offer'] = $jobApply->getStatusCount($jobInfo->id,'offer');
        $data['accept'] = $jobApply->getStatusCount($jobInfo->id,'accept');
        $data['notSuitable'] = $jobApply->getStatusCount($jobInfo->id,'not_suitable');
        
        $data['totalCandidate'] = $jobApply->getTotalCandidate($jobInfo->id);
        $data['newApplicationCount'] = $jobApply->getNewCount($jobInfo->id);

        // $candidates = Job_apply::where($condition)
        //     ->orderByRaw($order)
        //     ->get();

        $data['jobInfo'] = $jobInfo;
        $data['status'] = $status;
        $data['separator'] = $urlSeparator;
        $data['candidates'] = $candidates;

        return Response(['response' => $data , 'message' => 'success' ,'status' => 200 ],200);
    }
    
    public function shortList():Response{

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        if(!$this->candidateAccess($userId)){
            return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        }
        
        // $shortLists = Short_list::whereHas('job', function ($query) {
        //         $query->select('id', 'title', 'slug', 'work_type', 'expire_time');
        //         $query->where('status', 1)
        //               ->where('job_status', 0);
        //     })
        //     ->where('user_id', $userId)
        //     ->orderBy('short_lists.id', 'DESC')
        //     ->get();
        
        // $ShortLists = Short_list::has('job')
        // ->where('user_id', $userId)
        // ->orderBy('short_lists.id', 'DESC')
        // ->get();
        
         $ShortLists = Short_list::select()
        ->join('jobs', 'short_lists.job_id','=','jobs.id')
        ->where('jobs.status', 1)
        ->where('jobs.job_status', 0)
        ->where('short_lists.user_id', $userId)
        ->select('jobs.id as job_id','jobs.title','jobs.slug' ,'jobs.work_type','jobs.expire_time','short_lists.id as short_list_id')
        ->orderBy('short_lists.id','Desc')
        ->get();
        
        
        
        // $ShortLists = Short_list::with(['job' => function ($query) {
        //     $query->select('id','title','slug' ,'work_type','expire_time');
        //     $query->where('status', 1)
        //           ->where('job_status', 0);
        // }])
        // ->where('user_id', $userId)
        // ->orderBy('short_lists.id','Desc')
        // ->get();
        
        $work = $GLOBALS['worktype'];
        $lists = array();

        foreach($ShortLists as $key => $list){

            $lists[$key]['job_id'] = $list->job_id;
            $lists[$key]['title'] = $list->title;
            $lists[$key]['slug'] = $list->slug;
            $lists[$key]['work_type'] =  $work[$list->work_type];
            $lists[$key]['expire_time'] =  date('jS F, Y', $list->expire_time);
            $lists[$key]['short_lists_id'] = $list->short_lists_id;
        }



        $data['ShortLists'] = $lists;

        
        return Response(['response' => $data , 'message' => 'success' , 'status'=> 200],200);

    }

}
