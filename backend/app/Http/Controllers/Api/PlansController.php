<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\Plan;
use App\Models\Payment;
use App\Models\User_plan;

use Validator;


class PlansController extends Controller
{
    public function admin_index(Request $request):Response {

        
        // $authenticateadmin = $this->adminauthentication();

        // if(isset($authenticateadmin['id'])){
        //     if($authenticateadmin['id'] != '1'){

        //         $msgString='Sub-Admin do not have access to this path.';
        //         return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
        //         exit;
        //     }

        // }

        if ($request->filled('action')) {
            $idList = $request->idList;
            if ($idList) {
                if ($request->action == 'activate') {
                    DB::table('plans')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                } elseif ($request->action == 'deactivate') {
                    DB::table('plans')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                } elseif ($request->action == 'delete') {
                    DB::table('plans')->whereIn('id', explode(',', $idList))->delete();
                   
                }
            }
        } 

        $plans = Plan::orderBy('id','desc')->get();

        $plan_array = array();
        $planType = $GLOBALS['planType'];
        $planFeatuersMax = $GLOBALS['planFeatuersMax'];
        $planFeatuers = $GLOBALS['planFeatuers'];

        foreach($plans as $key=> $plan){
            $plan_array[$key]['id'] = $plan->id;
            $plan_array[$key]['plan_name'] = $plan->plan_name;
            $plan_array[$key]['amount'] = $plan->amount;
            $plan_array[$key]['planuser'] = $plan->planuser;
            $plan_array[$key]['type'] = $plan->type;
            $plan_array[$key]['created'] = date('F j,Y',strtotime($plan->created));
            $plan_array[$key]['status'] = $plan->status;
            $plan_array[$key]['type_value'] = $plan->type_value;
            $plan_array[$key]['slug'] = $plan->slug;
            $feature_ids=explode(',',$plan->feature_ids);
            $fvalues = json_decode($plan->fvalues, true);


            $fvalues = json_decode($plan->fvalues, true);
            $fetures = explode(',',$plan->feature_ids);

            
            $i=0;
            foreach($fetures as $fid){
                if(isset($planFeatuers[$fid])){

                $ddd = $planFeatuers[$fid];
                if(array_key_exists($fid, $fvalues)){
                    if($fvalues[$fid] == $planFeatuersMax[$fid]){
                        $ddd .= ' - Unlimited';
                    }else{
                        $ddd .= ' - '.$fvalues[$fid];
                    }
                }
                $plan_array[$key]['features'][$i] = $ddd ;
                $i++;
            }

            }


            // if ($feature_ids) {
            //     foreach ($feature_ids as $fid) {
            //         if (array_key_exists($fid, $planFeatures)) {
            //             $plan_array[$key]['features'][$fid]['feature']=$planFeatures[$fid];
            //             if(isset($fvalues[$fid])){
            //                 $plan_array[$key]['features'][$fid]['feature_value']=$fvalues[$fid];

            //             }else{
            //                 $plan_array[$key]['features'][$fid]['feature_value']='';
            //             }
            //         }
            //     }
            // }
            
        }

      // print_r($plan_array);exit;
      //  $data['user_array'] = $plan_array;
        return Response(['response' => $plan_array , 'message'=>'success', 'status'=>200],200);

    }

    public function admin_addPlan(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $data['planType'] = $GLOBALS['planType'];
        $data['userType'] = array('employer'=>'Employer','jobseeker'=>'Jobseeker');

        if(!empty($request->all())){


            $validator = Validator::make($request->all(), [
                'plan_name' => 'required',
                'planuser' => 'required',
                'amount' => 'required',
                'type_value' => 'required',
                'type' => 'required',
            ]);

            $msgString='';

            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $data , 'message' => $msgString, 'status'=> 500],200);

            }else {

                $isPlanExist = (new Plan)->isRecordUniquePlan($request->plan_name);

                if($isPlanExist == false){
                    return Response(['response' => $data , 'message' => 'Plan name already exsist.', 'status'=> 500],200);

                }else{
                    $feature_ids=array();
                    $fvaluesarray=array();
                    $job_post = $request->job_post;
                    $resume_download = $request->resume_download;
                    $candidate_search = $request->candidate_search;
                    $job_apply = $request->job_apply;
                    $profile_view = $request->profile_view;
            
                    
                    // $job_post =1;
                    // $resume_download = 10;
                    // $candidate_search = 2;
                    // $job_apply = 0;
                    // $profile_view =3;
            
                    if ($request->planuser == 'jobseeker') {
                        if ($job_apply != 'empty') {
                            array_push($feature_ids,4);
                            $fvaluesarray[4] = $job_apply;
                        }
                    } else {
                       
                        if ($job_post != 'empty') {
                            array_push($feature_ids,1);
                            $fvaluesarray[1] = $job_post;
                        }
                        if ($resume_download != 'empty') {
                            array_push($feature_ids,2);
                            $fvaluesarray[2] = $resume_download;
                        }
                        if ($candidate_search != 'empty') {
                            array_push($feature_ids,3);
                
                        }
                        if ($profile_view != 'empty') {
                            array_push($feature_ids,5);
                            $fvaluesarray[5] = $profile_view;
                        }
                    }
                    // echo '<pre>fvaluesarray ';print_r(json_encode($fvaluesarray));
            
                    // echo '<pre>feature_ids ';print_r($feature_ids);
                    // exit;

                    $plan = new Plan;
                    $plan->status = 1;
                    $plan->slug = $this->createSlug(trim($request->plan_name),'plans');
                    $plan->feature_ids = implode(',', $feature_ids);
                    $plan->fvalues = json_encode($fvaluesarray);
                    $plan->plan_name = $request->plan_name;
                    $plan->amount = $request->amount;
                    $plan->planuser = $request->planuser;
                    $plan->type_value = $request->type_value;
                    $plan->type = $request->type;
                    $plan->created = now();

                    if($plan->save()){
                    return Response(['response' => $data , 'message'=> 'Plan added successfully.' , 'status'=> 200 ],200);

                    }
                }
            }
        }else{
            return Response(['response' => $data , 'message'=> 'success' , 'status'=> 200 ],200);

        }
    }

    public function admin_editPlan(Request $request,$slug = null):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        $data['planType'] = $GLOBALS['planType'];
        $data['userType'] = array('employer'=>'Employer','jobseeker'=>'Jobseeker');

        if(!empty($request->all())){
            $validator = Validator::make($request->all(), [
                'plan_name' => 'required',
                'planuser' => 'required',
                'amount' => 'required',
                'type_value' => 'required',
                'type' => 'required',
            ]);

            $msgString='';

            if ($validator->fails()) {
                $msgString .= implode("<br> - ", $validator->errors()->all());
                return Response(['response' => $data , 'message' => $msgString, 'status'=> 500],200);

            }else {

                $isPlanExist = (new Plan)->isRecordUniquePlan($request->plan_name);

              //  if($isPlanExist == false){
                    $getplan = Plan::where('slug',$slug)->first();
                    $plan = Plan::find($getplan->id);

                    $feature_ids=array();
                    $fvaluesarray=array();
                    $job_post = $request->job_post;
                    $resume_download = $request->resume_download;
                    $candidate_search = $request->candidate_search;
                    $job_apply = $request->job_apply;
                    $profile_view = $request->profile_view;
            
                    if ($request->planuser == 'jobseeker') {
                        if ($job_apply != 'empty') {
                            array_push($feature_ids,4);
                            $fvaluesarray[4] = $job_apply;
                        }
                    } else {
                       
                        if ($job_post != 'empty') {
                            array_push($feature_ids,1);
                            $fvaluesarray[1] = $job_post;
                        }
                        if ($resume_download != 'empty') {
                            array_push($feature_ids,2);
                            $fvaluesarray[2] = $resume_download;
                        }
                        if ($candidate_search != 'empty') {
                            array_push($feature_ids,3);
                
                        }
                        if ($profile_view != 'empty') {
                            array_push($feature_ids,5);
                            $fvaluesarray[5] = $profile_view;
                        }
                    }
                    // echo '<pre>fvaluesarray ';print_r(json_encode($fvaluesarray));
            
                    // echo '<pre>feature_ids ';print_r($feature_ids);
                    // exit;
                   
                    $plan->feature_ids = implode(',', $feature_ids);
                    $plan->fvalues = json_encode($fvaluesarray);
                    $plan->plan_name = $request->plan_name;
                    $plan->amount = $request->amount;
                    $plan->planuser = $request->planuser;
                    $plan->type_value = $request->type_value;
                    $plan->type = $request->type;

                    if($plan->save()){
                        return Response(['response'=>'' , 'message'=>'Plan Updated successfully', 'status'=>200],200);
                    }

               // }


            }
        }else if($slug != ''){
            $data['plan'] = Plan::where('slug',$slug)->first();
            $job_post='empty';
            $resume_download='empty';
            $candidate_search='empty';
            $job_apply='empty';
            $profile_view='empty';

            $plan=Plan::where('slug',$slug)->first();

            $fvalues = json_decode($plan->fvalues, true);
            $fetures = explode(',',$plan->feature_ids);

            $i=0;
            foreach($fetures as $fid){
            if(isset($fvalues[$fid])){
                if($fid == '1'){
                    $job_post=$fvalues[$fid];
                }
                if($fid == '2'){
                    $resume_download=$fvalues[$fid];
                }

                if($fid == '4'){
                    $job_apply=$fvalues[$fid];
                }
                if($fid == '5'){
                    $profile_view=$fvalues[$fid];
                }
            }
            if($fid == '3'){
                $candidate_search=1;
            }

                $i++;

            }
            $data['plan']['job_post']=$job_post;
            $data['plan']['resume_download']=$resume_download;
            $data['plan']['candidate_search']=$candidate_search;
            $data['plan']['job_apply']=$job_apply;
            $data['plan']['profile_view']=$profile_view;


            return Response(['response'=>$data, 'message'=>'success' , 'status'=>200],200);
        }
    }

    public function admin_activateplans($slug = NULL) {
                
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {
            $this->layout = "";

            Plan::where('slug',$slug)->update(['status'=>1]);

            return Response(['response'=>'' ,'mesasge'=>'plan activated Successfully' , 'status'=>200]);
        }
    }

    public function admin_deactivateplans($slug = NULL) {
                        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }


        if ($slug != '') {

            Plan::where('slug',$slug)->update(['status'=>0]);

            return Response(['response'=>'' ,'mesasge'=>'plan Deactivated Successfully' , 'status'=>200]);
        }
    }

    public function admin_deletePlan($slug = NULL) {
                        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        if ($slug != '') {

            $plaInfo = Plan::where('slug',$slug)->first();
            $id = $plaInfo->id;

            $isPlan = User_plan::where('plan_id',$id)->count();

            if($isPlan > 0){
                return Response(['response'=>'' , 'message' => 'You can not delete this plan because an employee purchased this plan.' , 'status'=>500],200);
            }else{
                Plan::where('slug',$slug)->delete();
                return Response(['response'=>'' , 'message' => 'Plan deleted successfully.' , 'status'=>200],200);
            }
        }
    }
    
    public function purchase(Request $request):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];

         // $this->userLoginCheck();
        // if(!$this->candidateAccess($userId)){
        //     return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        // }
      

        $userdetail = User::where('id',$userId)->first();
        //$data['userdetail'] = $userdetail;

        $plans = new Plan;
        $plans = $plans->where('status',1);

        if ($userdetail->user_type == 'recruiter') {
            $plans = $plans->where('planuser','employer');
        } else {
            $plans = $plans->where('planuser','jobseeker'); 
        }


        $plans = $plans->orderBy('amount','asc');
        $plans = $plans->get();

        // $data['plans'] = $plans;
        $msgString = '';

        if(!empty($request->all())){

            if($request->id == ''){
                $msgString .= " Please select plan.<br>";
            }

            if (isset($msgString) && $msgString != '') {
                $this->Session->write('error_msg', $msgString);
            }else{
                $planId = $request->id;
                $payment_option = $request->payment_option;
                $aplimp = $request->aplimp;

                $planInfo = Plan::where('id',$planId);

                $idOld = Payment::where('user_id',$userId)
                ->where('payment_status','pending')
                ->get();

                $newPayment = new Payment;

                // if(!$idOld->isEmpty()){
                //     $newPayment->id = $idOld->id;
                // }

                $payment_number = 'pay-' . date('Ymd') . time();
                $newPayment->user_id = $userId;
                $newPayment->payment_number = $payment_number;
                $newPayment->payment_status = 'pending';
                $newPayment->price = $planInfo->amount;
                $newPayment->plan_id = $planInfo->id;
                $newPayment->payment_option = $payment_option;
                $newPayment->status = 0;
                $newPayment->slug = $payment_number . $userId;

                if ($aplimp) {
                    $aplimp = 1;
                }
                $newPayment->aplimp = $aplimp;

                $newPayment->save();

                if ($payment_option == 'stripe') {
                    $msgString = '/payments/checkoutStripe/' . $payment_number;
                } else {
                    $msgString = '/payments/checkout/' . $payment_number;

                }
                return Response(['response' => $msgString , 'message' => 'success' ,'status'=>200],200);

            }

        }else{

            $cplan = (new Plan)->getcurrentplan($userId);
            $futureplan = (new Plan)->getfutureplan($userId);
            $cplanId = 0;
            $sdate = date('Y-m-d');
            $sdateDIS = date('M d, Y');
            if($cplan){
                $cplanId = $cplan['plan_id'];
                $sdate = date('Y-m-d', strtotime($cplan['end_date'] . ' + 1 days'));
                $sdateDIS = date('M d, Y', strtotime($cplan['end_date'] . ' + 1 days'));
            }
            $planFeatuersMax = $GLOBALS['planFeatuersMax'];
            $planFeatuers = $GLOBALS['planFeatuers'];
            $planFeatuersDis = $GLOBALS['planFeatuersDis'];
            $planType = $GLOBALS['planType'];
            $planFeatuersHelpText = $GLOBALS['planFeatuersHelpText'];

            $plans_details = array();

            $myPlan =  (new Plan)->getcurrentplan($userId);
            if(!empty($myPlan)){
                $plan_id=$myPlan->plan_id;
            }else{
                $plan_id=0;

            }
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
                $plans_details[$planKey]['plan_id'] = $plan->id;
                $plans_details[$planKey]['plan_name'] = $plan_name;
                $plans_details[$planKey]['amount'] = $plan->amount; 
                $plans_details[$planKey]['currency'] = CURRENCY; 

                $plans_details[$planKey]['plan_type'] = $plan->type_value . ' ' . $plan->type;
                $plans_details[$planKey]['slug'] = $plan->slug;
                $plans_details[$planKey]['planuser'] = $plan->planuser;

                if($plan_id ==$plan->id){
                    $plans_details[$planKey]['is_plan_active'] = 1;

                }else{
                    $plans_details[$planKey]['is_plan_active'] = 0;

                }
    
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
                        
                        
                        $ddd .= ' ' . $planFeatuersDis[$fid];
    
                        $fdata[$key] = ['outer'=>$ddd,'inner'=>$disText];
                    }
    
                }
    
                $plans_details[$planKey]['features'] =  $fdata;
            }

            $data['plan'] = $plans_details;
            $data['paypal']['PAYPAL_EMAIL'] = PAYPAL_EMAIL;
            $data['paypal']['PAYPAL_URL'] = PAYPAL_URL;
            $data['paypal']['BRAINTREE_MERCHANT_ID'] = BRAINTREE_MERCHANT_ID;
            $data['paypal']['BRAINTREE_PUBLIC_KEY'] = BRAINTREE_PUBLIC_KEY;
            $date['paypal']['BRAINTREE_PRIVATE_KEY'] = BRAINTREE_PRIVATE_KEY;

            return Response(['response' => $data , 'message'=>'success', 'status'=>500 ],200);
        }
    }
}
