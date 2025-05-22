<?php

namespace App\Imports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use DB;
use App\Models\Skill;
use App\Models\Job;
use App\Models\Category;
use DateTime;

class ImportJobs  implements ToModel
{
    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
    }
    
    public function model(array $row){
        
        \Log::info('excel row', $row);
        
        try{
        
        if ($row[0] === 'Job title' || $row[0] === '') {
            return null; 
        }
        
        $title = $row[0];
        $category = $row[1];
        $description= $row[2];
        $work_type = $row[3];
        $contact_name = $row[4];
        $discription = $row[5];
        $contact_number = $row[6];
        $url = $row[7];
        $min_exprience = $row[8];
        $max_exprience = $row[9];
        $salary = $row[10];
        $sjob_skills = $row[11];
        $desig = $row[12];
        $location = $row[13];
        $last_data = $row[14];
        
        } catch (\Exception $e) {
            throw new \Exception('Upload the file data in the provided sample file format only.');
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
        
        $designation = Skill::where('type','Designation')->where('name','LIKE',"%$desig%")->first();
        if(empty($designation->id)){
                Skill::create([
                    'name' => $desig,
                    'type'=>'Designation',
                    'slug' => $this->createSlug($desig,'skills'),
                    'status' => 1,
                ]);
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
        
        $category1 = Category::where('name','LIKE',"%$category%")->first();
        
        foreach ($skill_arr as $skillhave) {
            $skillDetail = Skill::where('name','LIKE',"%$skillhave%")->first();
            if(isset($skillDetail->id)){
                $skillArray[] = $skillDetail->id;
            }

        }
        
        $designation = Skill::where('type','Designation')->where('name','LIKE',"%$desig%")->first();
        
        global $worktype;
        
        $work_type_id = array_search($work_type, $worktype) ?? null;
        
        $salary_array = explode('-',$salary);
        
        $slug = $this->createSlug($title,'jobs');
        
        $date = DateTime::createFromFormat('d/m/Y', $last_data);
        
        if($date && $date->format('d/m/Y') === $last_data){
            $formatted_date = $date->format('Y-m-d');
        }else{
            $formatted_date = date('Y-m-d', strtotime('+ 30 days'));
        }
        
        // echo $this->user->id;
        // echo $title;
        // echo $category;
        // exit();
        
        // echo $category1;
        // exit();

        
        try{
            
            $jobData = [
                'user_id' => $this->user->id,
                'title' => $title,
                'category_id' => $category1->id ?? null,
                'description' => $description,
                'company_name' => $this->user->company_name,
                'work_type' => $work_type_id,
                'contact_name' => $contact_name,
                'contact_number' => $contact_number,
                'url' => $url,
                'brief_abtcomp' => $discription,
                'designation' => $designation->id ?? null,
                'job_city' => $location,
                'lastdate' => $formatted_date,
                'expire_time' => strtotime($formatted_date),
                'min_exp' => $min_exprience != '' ? $min_exprience : null,
                'max_exp' => $max_exprience != '' ? $max_exprience : null,
                'min_salary' => $salary_array[0] != '' ? $salary_array[0] : null,
                'max_salary' => $salary_array[1] ?? null,
                // 'subcategory_id' => '',
                'slug' => $slug,
                'type' => 'Excel import',
                'status' => 1,
                'payment_status' => 2,
                'job_number' => 'JOB' . $this->user->id . time(),
                'exp_month' => 0,
                'hot_job_time' => time(),
                'skill' => implode(',', $skillArray),
            ];
            
            // Insert the job using create() and print the SQL
            $job = Job::create($jobData);
            
            // $sql = Job::where('id', $job->id)->toSql();
            // dd($sql);

            // $job = new Job([
            //     'user_id' => $this->user->id,
            //     'title' => $title,
            //     'category_id' => $category1,
            //     'description' => $description,
            //     'company_name' => $this->user->company_name,
            //     'work_type' => $work_type_id,
            //     'contact_name' => $contact_name,
            //     'contact_number' => $contact_number,
            //     'url' => $url,
            //     'brief_abtcomp' => $discription,
            //     'designation' => $designation,
            //     'job_city' => $location,
            //     'lastdate' => $formatted_date,
            //     'expire_time' => strtotime($formatted_date),
            //     'min_exp' => $exp_array[0] ?? '',
            //     'max_exp' => $exp_array[1] ?? '',
            //     'min_salary' => $salary_array[0] ?? '',
            //     'max_salary' => $salary_array[1] ?? '',
            //     'subcategory_id' => '',
            //     'slug' =>  $slug,
            //     'type' => 'Excel import',
            //     'status' => 1,
            //     'payment_status' => 2,
            //     'job_number' => 'JOB'. $this->user->id . time(),
            //     'exp_month' => 0,
            //     'hot_job_time' => time(),
            //     'skill' => implode(',', $skillArray),
            // ]);
            
            // // Log the SQL query
            // $sql = $job->getConnection()->table($job->getTable())->toSql();
            // dd($sql);
            
        } catch (\Exception $e) {
            \Log::error('Error inserting Job: ' . $e->getMessage());
        }
    }
    
    public function createSlug($slug=null,$tablename=null, $fieldname='slug'){
        // replace non letter or digits by -
        $text = preg_replace('~[^\pL\d]+~u', '-', $slug);
        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);
        // trim
        $text = trim($text, '-');
        // remove duplicate -
        $text = preg_replace('~-+~', '-', $text);
        // lowercase
        $text = strtolower($text);
        if (!empty($text)) {
          $slug= $text;
        }
        $slug = filter_var($slug, FILTER_SANITIZE_STRING);
        $slug = str_replace(' ', '-', strtolower($slug));
        $isSlugExist = DB::table($tablename)->where($fieldname,$slug)->first();               
        if (!empty($isSlugExist)) {
            $slug = $slug.'-'.bin2hex(openssl_random_pseudo_bytes(6));
            $this->createSlug($slug, $tablename, $fieldname);
        }
        return $slug;
    }
    
}

?>