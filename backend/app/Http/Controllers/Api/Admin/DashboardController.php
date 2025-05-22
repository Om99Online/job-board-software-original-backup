<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use App\Models\User;
Use App\Models\Job;
Use App\Models\Category;
use App\Models\Skill;
use App\Models\Country;
use App\Models\Location;
use App\Models\Blog;

class DashboardController extends Controller
{
    public function loadDasboard():Response{
        $total_customers = User::where('user_type','recruiter')->count();

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

            $count_data = User::where('DATE(created)',$day)
            ->where('MONTH(created)',$curr_month)
            ->where('YEAR(created)',$current_year)
            ->where('user_type','recruiter')
            ->count();

            $user_datas[$i] = $day . ',' . $count_data;

            $count_data_arr[] = $count_data;
        }

        $total_users_no = array_sum($count_data_arr);
        $total_users_time = sizeof($count_data_arr);
        $max_users = max($count_data_arr);

        $jobseeker_datas = array();
        $count_data_arr1 = array();
        for ($i = 1; $i <= $current_date; $i++) {
            $day = $i;

            $count_data = User::where('DATE(created)',$day)
            ->where('MONTH(created)',$curr_month)
            ->where('YEAR(created)',$current_year)
            ->where('user_type','candidate')
            ->count();

            $jobseeker_datas[$i] = $day . ',' . $count_data;
            $count_data_arr1[] = $count_data;
        }

        $total_jobseeker_no = array_sum($count_data_arr1);
        $total_jobseeker_time = sizeof($count_data_arr1);
        $max_jobseeker = max($count_data_arr1);

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
         ];


        return Response(['responce' => $data, 'status'=>200],200);


    }
}
