<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Job;
use Illuminate\Support\Facades\DB;
use App\Models\Alert;

class Alert_location extends Model
{
    use HasFactory;

    public function getUsersToAlert($jobId = null) {
        $users = array();
        if (!empty($jobId)) {

            $jobDetail = Job::where('id',$jobId)
            ->first();

            if($jobDetail->count() > 0 ){

                $users = Alert::select(DB::raw('DISTINCT tbl_users.id, tbl_users.email_address'))
                ->join('users', 'users.id' , '=' , 'alerts.user_id')
                ->where('users.id' ,'>' , 0)
                ->where('alerts.location', 'like', '%'.trim($jobDetail->job_city).'%')
                ->where('alerts.designation', $jobDetail->designation)
                ->where('alerts.status', 1)
                ->get();


                // $users = DB::table('alerts')
                // ->select(DB::raw('DISTINCT tbl_users.id, tbl_users.email_address'))
                // ->join('users', 'users.id', '>', 0)
                // ->where('alerts.location', 'like', '%'.trim($jobDetail->job_city).'%')
                // ->where('alerts.designation', $jobDetail->designation)
                // ->where('alerts.status', 1)
                // ->get();

            }
        }
        return $users;
    }
}
