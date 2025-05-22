<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Job_apply extends Model
{
    use HasFactory;
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';
    
    function getTotalCandidate($job_id = null) {

        $resultCode = $this->join('users', 'users.id', '=' , 'job_applies.user_id' )
        ->where('job_id' , $job_id)
        ->where('users.id' , '<>' , '')
        ->count();
        return $resultCode;
    }
    
    function getNewCount($job_id = null) {
        $resultCode = $this->where('job_id',$job_id)
        ->where('new_status', 1)
        ->count();
        return $resultCode;
    }
    
    public function getStatusCount($job_id = null, $status = null) {

        $resultCode = $this->where('job_id',$job_id)
        ->where('apply_status',$status)
        ->count();

        return $resultCode;
    }
    

}
