<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User_plan;
use App\Models\Download;
use App\Models\Job;
use App\Models\Job_apply;
use App\Models\Profile_view;

class Plan extends Model
{
    use HasFactory;
    
    public $timestamps = false;
    
    public function checkPlanFeature($userId=null, $fid=null){
        $myPlan = $this->getcurrentplanEXP($userId);
        if($myPlan == 0){
            $pdata = array('status'=>0,'message'=>'');
            $pdata['status'] = 0;
            $pdata['message'] = 'You do not have any plan, please purchase any suitable plan to access website functionality.';
            return $pdata;
        }

        $myPlan = User_plan::where('user_id',$userId)
        ->where('is_expire' , 0)
        ->orderBy('invoice_no','DESC')
        ->first();
   

        $features = $myPlan->features_ids;
        $user_plan_id = $myPlan->id;
        $featuresArray = explode(',', $features);
        $fvalues = json_decode($myPlan->fvalues, true);
        $sdate = $myPlan->start_date;
        $edate = $myPlan->end_date;
        
        $pdata = array('status'=>0,'message'=>'');
         
        $tdaye = date('Y-m-d');
        if(!empty($myPlan)){
            if($myPlan->is_expire == 1 || $myPlan->end_date < $tdaye){
                $pdata['status'] = 0;
                $pdata['message'] = 'Your current plan has been expiered, so please upgrade your plan first and than try to access this functionality.';
                return $pdata;
            }
        }
        
        switch ($fid) {
            case 1:
                if(in_array(1, $featuresArray)){
                    $maxJobPost = $fvalues[1];

                    $postJobCount = Job::where('user_id',$userId)
                    ->where('user_plan_id',$user_plan_id)
                    ->count();

                    if($postJobCount >= $maxJobPost){
                        $pdata['message'] = 'You have already posted maximum number of jobs as per your plan, please upgrade your plan to post more jobs.';
                    }else{
                       $pdata['status'] = 1; 
                       $pdata['user_plan_id'] = $myPlan->id; 
                    }
                }else{
                    $pdata['message'] = 'You can not post new job now, please upgrade your plan to post more jobs.';
                }
                break;
            case 2:
                if(in_array(2, $featuresArray)){
                    $maxJobPost = $fvalues[2];

                    $postJobCount = Download::where('user_id',$userId)
                    ->where('user_plan_id',$user_plan_id)
                    ->count();

                    if($postJobCount >= $maxJobPost){
                        $pdata['message'] = 'You have already download maximum number of resume as per your plan, please upgrade your plan to download this document.';
                    }else{
                       $pdata['status'] = 1; 
                       $pdata['user_plan_id'] = $myPlan->id; 
                    }
                }else{
                    $pdata['message'] = 'You can not download this document, please upgrade your plan to download this document.';
                }
                break;
            case 3:
                if(in_array(3, $featuresArray)){
                       $pdata['status'] = 1;
                       $pdata['user_plan_id'] = $myPlan->id; 
                }else{
                    $pdata['message'] = 'You can not access search candidate feature, please upgrade your plan to access this feature.';
                }
                break;
                
            case 4:
  
            if(in_array(4, $featuresArray)){
                $maxJobPost = $fvalues[4];

                $postJobCount = Job_apply::where('user_id',$userId)
                ->where('user_plan_id',$user_plan_id)
                ->count();

                if($postJobCount >= $maxJobPost){
                    $pdata['message'] = 'You have already applied maximum number of jobs as per your plan, please upgrade your plan to apply more jobs.';
                }else{
                   $pdata['status'] = 1; 
                   $pdata['user_plan_id'] = $myPlan->id; 
                }
            }else{
                $pdata['message'] = 'You can not apply a job now, please upgrade your plan to apply more jobs.';
            }
            break;
        } 
        
        return $pdata;
        exit;
    }

    public function getcurrentplanEXP($userId=null){
        $date = date('Y-m-d');

        $userPlan = User_plan::where('user_id',$userId)
        ->where('start_date' , '<=' , $date)
        ->orderBy('id','DESC')
        ->count();
        
        $futurePlan = 0;
        if($userPlan > 0){
            $futurePlan = 1;
        }

        return $futurePlan;
        
    }
    
    public function getcurrentplan($userId=null){
        $date = date('Y-m-d');

        $userPlan = User_plan::where('user_id',$userId)
        ->where('is_expire',0)
        ->orderBy('invoice_no','DESC')
        ->first();
        
        return $userPlan;
    }
    
    
    public function getPlanFeature($userId=null){
       
        $date = date('Y-m-d');
        $pdata = array('status'=>0);

        $myPlan = $this->getcurrentplan($userId);
   
   
        if(!empty($myPlan)){
            $pdata = array('status'=>1);
            $features = $myPlan->features_ids;
            $user_plan_id = $myPlan->id;
            $featuresArray = explode(',', $features);
            $fvalues = json_decode($myPlan->fvalues, true);
            $sdate = $myPlan->start_date;
            $edate = $myPlan->end_date;
            $pdate=$myPlan->created;
            $pdata['sdate'] =$sdate;
            $pdata['edate'] =$edate;
            
            
                  
            if(in_array(1, $featuresArray)){
                $maxJobPost = isset($fvalues[1]) ? $fvalues[1] : 0;

                $postJobCount = job::where('user_id',$userId)
                ->where('user_plan_id',$user_plan_id)
                ->count();
                
                $pdata['maxJobPost'] =$maxJobPost;
                $pdata['postJobCount'] =$postJobCount;
                
                if($maxJobPost > 500){
                     
                    $pdata['availableJobpost'] ='1000000';
                }else{
                    $pdata['availableJobpost'] =$maxJobPost - $postJobCount;
               
                }
              
            }else{
                 $pdata['maxJobPost'] =0;
                $pdata['postJobCount'] =0;
                $pdata['availableJobpost'] ='';
            }
            
            $maxDownloadCount = 0;
            $downloadCount = 0;
            
            
            if(in_array(2, $featuresArray)){
                $maxDownloadCount = isset($fvalues[2]) ? $fvalues[2] : 0;

                $downloadCount = Download::where('user_id',$userId)
                ->where('user_plan_id',$user_plan_id)
                ->count();
               
                $pdata['maxDownloadCount'] =$maxDownloadCount;
                $pdata['downloadCount'] =$downloadCount;
                
                if($maxDownloadCount > 500){
                    $pdata['availableDownloadCount'] ='1000000';
                }else{
                     $pdata['availableDownloadCount'] =$maxDownloadCount - $downloadCount;
               
                }
                
            }else{
                $pdata['maxDownloadCount'] =$maxDownloadCount;
                $pdata['downloadCount'] =$downloadCount;
                $pdata['availableDownloadCount'] ='';
            }
            
            
            if(in_array(3, $featuresArray)){
                 $pdata['searchCandidate'] =1;
            }else{
                
                $pdata['searchCandidate'] ='';
                
            }
            
            $maxAppliedCount = 0;
            $appliedCount = 0;
            
            if(in_array(4, $featuresArray)){
                $maxAppliedCount = isset($fvalues[4]) ? $fvalues[4] : 0;

                $appliedCount = Job_apply::where('user_id',$userId)
                ->where('user_plan_id',$user_plan_id)
                ->count();
                
                $pdata['maxAppliedCount'] =$maxAppliedCount;
                $pdata['appliedCount'] =$appliedCount;
                
            //     print_r($userId);
            // print_r('******');
            // print_r($user_plan_id);exit;
                
                 if($maxAppliedCount > 500){
                    $pdata['availableAppliedCount'] ='1000000';
                 }else
                 {
                    $pdata['availableAppliedCount'] =$maxAppliedCount - $appliedCount;
                 }
               
            }else{
                
                $pdata['maxAppliedCount'] =$maxAppliedCount;
                $pdata['appliedCount'] =$appliedCount;
                
                $pdata['availableAppliedCount'] ='';
            }
            
        
            if(in_array(5, $featuresArray)){
                $maxProfileView = isset($fvalues[5]) ? $fvalues[5] : 0;

                $profileViewCount = Profile_view::where('emp_id',$userId)
                ->where('status',1)
                ->count();
                         
                $pdata['maxProfileView'] =$maxProfileView;
                $pdata['profileViewCount'] =$profileViewCount;
                
                $cc=$maxProfileView - $profileViewCount;
                
                 if($maxProfileView > 500){
                    $pdata['availableProfileView'] ='1000000';
                 }else{
                    $pdata['availableProfileView'] =$maxProfileView - $profileViewCount;
                 }
            }else{
                 $pdata['maxProfileView'] =0;
                $pdata['profileViewCount'] =0;
                $pdata['availableProfileView'] ='2';
            }   
        }

        return $pdata;
    }
    
    public function getfutureplan($userId=null){
        $date = date('Y-m-d');
        $userPlan = User_plan::where('user_id',$userId)
        ->where('is_expire',0)
        ->where('start_date', '>' , $date )
        ->count();

        $futurePlan = 0;
        if($userPlan > 0){
            $futurePlan = 1;
        }    
        return $futurePlan;
    }
    
    public function isRecordUniquePlan($name_name = null,$user_type= null) {

        $resultCompany =  $this::where('plan_name',addslashes($name_name))
        ->where('planuser',$user_type)
        ->count();
        
        if ($resultCompany > 0) {
            return false;
        } else {
            return true;
        }
    }
}
