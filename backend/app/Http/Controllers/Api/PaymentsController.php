<?php

namespace App\Http\Controllers\Api;
use Stripe\Checkout\Session;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use App\Models\User_plan;
use App\Models\Plan;
use Mail;
use App\Mail\SendMailable;
use App\Models\Payment;
use App\Models\User;
use App\Models\Admin;
use App\Models\Emailtemplate;

use Validator;

class PaymentsController extends Controller
{
    // public function history():Response {

    //     // $this->userLoginCheck();
        
    //     if($_SERVER["REQUEST_METHOD"] == 'GET' ){
    //         $tokenData = $this->requestAuthentication('GET', 1);
    //     }else{
    //         $tokenData = $this->requestAuthentication('POST', 1);
    //     }
        
    //     // $tokenData = $this->requestAuthentication('POST', 1);
    //     $userId = $tokenData['user_id'];

    //     // if(!$this->recruiterAccess($userId)){
    //     //     return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
    //     // }

    //     $payments = User_plan::with('plan','payment','user')
    //     ->where('user_plans.user_id',$userId)
    //     ->orderBy('user_plans.id','desc')
    //     ->get();

    //     return Response(['response' => $payments , 'message' => $payments , 'status' => 200 ],200);

    // }
    

    public function history():Response {

        if($_SERVER["REQUEST_METHOD"] == 'GET' ){
            $tokenData = $this->requestAuthentication('GET', 1);
        }else{
            $tokenData = $this->requestAuthentication('POST', 1);
        }

        $userId = $tokenData['user_id'];

        // if(!$this->recruiterAccess($userId)){
        //     return Response(['response'=>'incorrect login type','message' => 'incorrect login type' , 'status' => 401],200);
        // }

        // $this->userLoginCheck();

        $user_plan = User_plan::where('user_id',$userId)
        ->orderBy('id','desc')
        ->get();

        $planType = $GLOBALS['planType'];
        $planFeatuersMax = $GLOBALS['planFeatuersMax'];
        $planFeatuers = $GLOBALS['planFeatuers'];
        
        $planArray = array();
        foreach($user_plan as $key => $userPlan){
            $planArray[$key]['id'] = $userPlan->id;
            $planArray[$key]['user_id'] = $userPlan->user_id;
            $planArray[$key]['amount'] = $userPlan->amount;
            $planArray[$key]['start_date'] = $userPlan->start_date;
            $planArray[$key]['end_date'] = $userPlan->end_date;
            $planArray[$key]['created'] = $userPlan->created;
            $planArray[$key]['invoice_no'] = $userPlan->invoice_no;

            $plan = Plan::where('id',$userPlan->plan_id)->first();
            $payment = Payment::where('id',$userPlan->payment_id)->first();

            $planArray[$key]['plan_name'] = $plan->plan_name;
            $planArray[$key]['transaction_id'] = $payment->transaction_id;

            $user = User::where('id',$userPlan->user_id)->first();
            $planArray[$key]['first_name'] = $user->first_name;
            $planArray[$key]['last_name'] = $user->last_name;
            $planArray[$key]['contact'] = $user->contact;
            $planArray[$key]['address'] = $user->address;
            $planArray[$key]['email_address'] = $user->email_address;
            
            $planArray[$key]['formated_start_date'] = date('F j,Y',strtotime($userPlan->start_date));
            $planArray[$key]['formated_end_date'] = date('F j, Y',strtotime($userPlan->end_date));
            $planArray[$key]['formated_created'] = date('F j, Y',strtotime($userPlan->created));

            $fvalues = json_decode($userPlan->fvalues, true);
            $fetures = explode(',',$userPlan->features_ids);

            $i=0;
            foreach($fetures as $fid){
                $ddd = $planFeatuers[$fid];
                if(array_key_exists($fid, $fvalues)){
                    if($fvalues[$fid] == $planFeatuersMax[$fid]){
                        $ddd .= ' - Unlimited';
                    }else{
                        $ddd .= ' - '.$fvalues[$fid];
                    }
                }
                $planArray[$key]['features'][$i] = $ddd ;
                $i++;
            }

        }

        return Response(['response' => $planArray , 'message' => 'success' , 'status' => 200 ],200);

    }


    public function admin_index(Request $request):Response {
        
        $authenticateadmin = $this->adminauthentication();

        if(isset($authenticateadmin['id'])){
            if($authenticateadmin['id'] != '1'){

                // $msgString='Sub-Admin do not have access to this path.';
                // return Response(['response' => $msgString , 'message' => $msgString, 'status'=> 500],200);
                // exit;
            }

        }
        //$Blogs = User_plan::orderBy('id','desc')->limit(90)->get();

        $planArray = array();
        $planType = $GLOBALS['planType'];
        $planFeatuersMax = $GLOBALS['planFeatuersMax'];
        $planFeatuers = $GLOBALS['planFeatuers'];
        $searchByDateFrom = '';
        $searchByDateTo = '';

        if(!empty($request->all())){
            if ($request->filled('action')) {
                $idList = $request->idList;
                if ($idList) {
                    if ($request->action == 'activate') {
                        DB::table('payments')->whereIn('id', explode(',', $idList))->update(['status' => '1']);
                    } elseif ($request->action == 'deactivate') {
                        DB::table('payments')->whereIn('id', explode(',', $idList))->update(['status' => '0']);
                    } elseif ($request->action == 'delete') {
                        DB::table('payments')->whereIn('id', explode(',', $idList))->delete();
                    
                    }
                }



            } elseif ($request->filled('name')) {
                $name = urldecode(trim($request->name));
            }

            if($request->searchByDateFrom != ''){
                $searchByDateFrom = $request->searchByDateFrom;
            }

            if($request->searchByDateTo != ''){
                $searchByDateTo = $request->searchByDateTo;
            }

        }
       // $Blogs = User_plan::orderBy('id','desc')->limit(90)->get();

        $Blogs = new User_plan;

        if($searchByDateFrom != ''){
            $Blogs = $Blogs->whereRaw(" (Date(User_plan.created)>='$searchByDate_con1' ) ");
        }

        if($searchByDateTo != ''){
            $Blogs = $Blogs->where(" (Date(User_plan.created)<='$searchByDate_con2' ) ");
        }

        $Blogs = $Blogs->orderBy('id','Desc');
        $Blogs = $Blogs->limit(90)->get();

        foreach($Blogs as $key => $blog){
            $planArray[$key]['id'] = $blog->id;
            $planArray[$key]['slug'] = $blog->slug;
            $user = User::where('id',$blog->user_id)->first();

            if(isset($user->first_name)){
                $planArray[$key]['full_name'] = $user->first_name.' '.$user->last_name;
                $planArray[$key]['company_name'] = $user->company_name;
            }else{
                $planArray[$key]['full_name'] = 'N/A';
                $planArray[$key]['company_name'] = 'N/A';
            }


            $plan = Plan::where('id',$blog->plan_id)->first();
            $payment = Payment::where('id',$blog->payment_id)->first();

            if(isset($plan->plan_name)){
                $planArray[$key]['plan_name'] = $plan->plan_name;

            }else{
                $planArray[$key]['plan_name'] = 'N/A';

            }

            if(isset($payment->transaction_id)){
                $planArray[$key]['transaction_id'] = $payment->transaction_id;

            }else{
                $planArray[$key]['transaction_id'] = 'N/A';

            }

            $planArray[$key]['price'] = $blog->amount;
            $planArray[$key]['start_date'] = date('d-m-Y',strtotime($blog->start_date));
            $planArray[$key]['end_date'] = date('d-m-Y',strtotime($blog->end_date));
            $planArray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $planArray[$key]['status'] = $blog->status;

            $fvalues = json_decode($blog->fvalues, true);
            $fetures = explode(',',$blog->features_ids);

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
                $planArray[$key]['features'][$i] = $ddd ;
                $i++;
            }

            }
        }

        //$data['adminDetails'] = $planArray;

       // echo '<pre>';print_r($planArray);exit;

        return Response(['response' => $planArray ,'message' => 'success' ,'status' => 200 ],200);
    }

    public function planpurchase(Request $request):Response {

        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];


        $getemp = User::where('id',$userId)->first();

        $data=array();
        $msgString='';


            $rules = array(
                'plan_id' => 'required',
                'payment_option' => 'required',

            );


            $validator = Validator::make($request->all(),$rules);

            $validator->setAttributeNames([
                'plan_id' => 'Plan',
                'payment_option' => 'Payment Option',
            ]);

            if($validator->fails()){
               $msgString = $this->validatersErrorString($validator->errors());

               return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
            }else{

                $planId = $request->plan_id;
                $payment_option = $request->payment_option;
                $aplimp = 1;
                $planInfo = Plan::find($planId);
        
                $idOld = Payment::where('user_id', $userId)
                    ->where('payment_status', 'pending')
                    ->first();
        
                if ($idOld) {
                    $paymentId = $idOld->id;
                } else {
                    $paymentId = null;
                }
        
                $payment_number = 'pay-' . date('Ymd') . time();
        
                $payment = new Payment;
                $payment->user_id = $userId;
                $payment->payment_number = $payment_number;
                $payment->payment_status = 'pending';
                $payment->price = $planInfo->amount;
                $payment->plan_id = $planInfo->id;
                $payment->payment_type = $payment_option;
                $payment->status = 0;
                $payment->slug = $payment_number . $userId;
                $payment->aplimp = 1;
        
                // if ($paymentId) {
                //     $payment->id = $paymentId;
                // }
        
                $payment->save();

                $paymentinfo = Payment::where('payment_number', $payment_number)->first();

                // if($payment_option == 'stripe'){

                //     if(CURR == 'USD'){
                //         $amount=$planInfo->amount * 100;

                //     }else{
                //         $amount=$planInfo->amount;

                //     }

                //     try {
                //         \Stripe\Stripe::setApiKey(STRIPE_SECRET);

                //         $intent = \Stripe\PaymentIntent::create([
                //             'amount' => $amount, // Amount in cents
                //             'currency' => 'usd',
                //             'description' => 'Plan Purchase',
                //         ]);
                //       // print_r($intent->client_secret);exit;
    
                //         $client_secret=$intent->client_secret;
                //         $paymentinfo['client_secret']=$client_secret;
                //     } catch (Throwable $e) {
                //         $paymentinfo['client_secret']=0;
                //     }


                // }
                return Response(['response' => $paymentinfo ,'message' => 'success' ,'status' => 200 ],200);

            }
        exit;
    }

    // public function checkoutSuccess(Request $request,$slug = null):Response{
    //     $tokenData = $this->requestAuthentication('POST', 1);
    //     $userId = $tokenData['user_id'];


    //     $data=array();
    //     $msgString='';


    //         $rules = array(
    //             'transaction_id' => 'required',
    //         );


    //         $validator = Validator::make($request->all(),$rules);

    //         $validator->setAttributeNames([
    //             'transaction_id' => 'transaction id',
    //         ]);

    //         if($validator->fails()){
    //           $msgString = $this->validatersErrorString($validator->errors());
    //           return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
    //         }else{

    //             $invoice_no = User_plan::selectRaw('MAX(invoice_no) AS max_invoice_no')->first();
    //             $max_invoice_no = $invoice_no->max_invoice_no + 1;
            
    //             $paymentInfo = Payment::where('slug', $slug)->first();
            
    //             if ($paymentInfo->payment_status == 'pending') {
    //                 $transactionId = $request->transaction_id;
            
    //                 Payment::where('id', $paymentInfo->id)->update([
    //                     'payment_status' => 'completed',
    //                     'transaction_id' => $transactionId,
    //                 ]);

    //                 $user =User::where('id', $paymentInfo->user_id)->first();
    //                 $plan =Plan::where('id', $paymentInfo->plan_id)->first();
            
            
    //                 $companyname = $user->company_name;
    //                 $email = $user->email_address;
    //                 $name = $user->first_name . ' ' . $user->last_name;
    //                 $planName = $plan->plan_name . ' Plan';
    //                 $amount = 'CURR ' . $plan->amount;
    //                 $date = date('F d, Y h:i A');
    //                 $site_title=SITE_TITLE;
            
    //                 $userPlan = new User_plan();
    //                 $userPlan->payment_id = $paymentInfo->id;
    //                 $userPlan->user_id = $userId;
    //                 $userPlan->plan_id = $plan->id;
    //                 $userPlan->features_ids = $plan->feature_ids;
    //                 $userPlan->fvalues = $plan->fvalues;
    //                 $userPlan->amount = $plan->amount;
            
    //                 $lastPlan = User_plan::where('user_id', $userId)->orderBy('id', 'DESC')->first();
    //                 $sdate = date('Y-m-d');
            
    //                 if ($lastPlan) {
    //                     if ($paymentInfo->aplimp) {
    //                         User_plan::where('id', $lastPlan->id)->update(['is_expire' => 1]);
    //                         $sdate = date('Y-m-d');
    //                     } else {
    //                         $lastend_date = $lastPlan->end_date;
    //                         $sdate = date('Y-m-d', strtotime($lastend_date . ' + 1 days'));
    //                     }
    //                 }
            
    //                 $tpvalue = $plan->type_value;
            
    //                 if ($plan->type == 'Months') {
    //                     $edate = date('Y-m-d', strtotime($sdate . " + $tpvalue Months"));
    //                 } else {
    //                     $edate = date('Y-m-d', strtotime($sdate . " + $tpvalue Years"));
    //                 }
            
    //                 $userPlan->start_date = $sdate;
    //                 $userPlan->end_date = $edate;
    //                 $userPlan->slug = 'uplan-' . $userId . time();
    //                 $userPlan->invoice_no = $max_invoice_no;
    //                 $userPlan->is_expire = '0';

    //                 $userPlan->created =  date('Y-m-d');
    //                 $userPlan->save();
            
    //                 $payinfo = '<p style="color:#434343; margin:10px 0 0;"><b>Plan Name:</b> ' . $planName . '</p>';
    //                 $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>Amount:</b> ' . $amount . '</p>';
    //                 $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>Transaction ID:</b> ' . $transactionId . '</p>';
    //                 $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>Date:</b> ' . $date . '</p';
            
    //                 $currentYear = date('Y', time());
    //                 $emailtemplateMessage = Emailtemplate::find(41);
    //                 $subjectToSend = str_replace(
    //                     ['[!username!]', '[!payinfo!]', '[!SITE_TITLE!]', '[!DATE!]'],
    //                     [$name, $payinfo, $site_title, $currentYear],
    //                     $emailtemplateMessage->subject
    //                 );
            
    //               // Mail::to($email)->send(new EmailTemplate($subjectToSend, $messageToSend));
            
    //                 $adminInfo = Admin::find(1);
    //                 $emailtemplateMessage = Emailtemplate::find(42);
            
    //                 // $subjectToSend = str_replace(
    //                 //     ['[!username!]', '[!job_title!]', '[!SITE_TITLE!]', '[!DATE!]', '[!transactionId!]', '[!amountPaid!]', '[!company_name!]'],
    //                 //     [$name, $jobTitle, $site_title, $date, $transactionId, $amount, $companyname],
    //                 //     $emailtemplateMessage->subject
    //                 // );
            
    //               // Mail::to($adminInfo->email)->send(new EmailTemplate($subjectToSend, $messageToSend));
    //             }

    //         }
    //     return Response(['response' => $data , 'message' => 'You have successfully completed payment for your membership plan.'  ,'status' => 200 ],200);
    //     exit;
    // }
    public function checkoutSuccess(Request $request,$slug = null):Response{
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];


        $data=array();
        $msgString='';


            $rules = array(
                'transaction_id' => 'required',
            );


            $validator = Validator::make($request->all(),$rules);

            $validator->setAttributeNames([
                'transaction_id' => 'transaction id',
            ]);

            if($validator->fails()){
               $msgString = $this->validatersErrorString($validator->errors());
               return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
            }else{

                $invoice_no = User_plan::selectRaw('MAX(invoice_no) AS max_invoice_no')->first();
                $max_invoice_no = $invoice_no->max_invoice_no + 1;
            
                $paymentInfo = Payment::where('slug', $slug)->first();
            
                if ($paymentInfo->payment_status == 'pending') {
                    $transactionId = $request->transaction_id;
            
                    Payment::where('id', $paymentInfo->id)->update([
                        'payment_status' => 'completed',
                        'transaction_id' => $transactionId,
                    ]);

                    $user =User::where('id', $paymentInfo->user_id)->first();
                    $plan =Plan::where('id', $paymentInfo->plan_id)->first();
            
            
                    $companyname = $user->company_name;
                    $email = $user->email_address;
                    $name = $user->first_name . ' ' . $user->last_name;
                    $planName = $plan->plan_name . ' Plan';
                    $amount = CURRENCY ." ". $plan->amount;
                    $date = date('F d, Y h:i A');
                    $site_title=SITE_TITLE;
            
                    $userPlan = new User_plan();
                    $userPlan->payment_id = $paymentInfo->id;
                    $userPlan->user_id = $userId;
                    $userPlan->plan_id = $plan->id;
                    $userPlan->features_ids = $plan->feature_ids;
                    $userPlan->fvalues = $plan->fvalues;
                    $userPlan->amount = $plan->amount;
            
                    $lastPlan = User_plan::where('user_id', $userId)->orderBy('id', 'DESC')->first();
                    $sdate = date('Y-m-d');
            
                    if ($lastPlan) {
                        if ($paymentInfo->aplimp) {
                            User_plan::where('id', $lastPlan->id)->update(['is_expire' => 0]);
                            $sdate = date('Y-m-d');
                        } else {
                            $lastend_date = $lastPlan->end_date;
                            $sdate = date('Y-m-d', strtotime($lastend_date . ' + 1 days'));
                        }
                    }
            
                    $tpvalue = $plan->type_value;
            
                    if ($plan->type == 'Months') {
                        $edate = date('Y-m-d', strtotime($sdate . " + $tpvalue Months"));
                    } else {
                        $edate = date('Y-m-d', strtotime($sdate . " + $tpvalue Years"));
                    }
            
                    $userPlan->start_date = $sdate;
                    $userPlan->end_date = $edate;
                    $userPlan->slug = 'uplan-' . $userId . time();
                    $userPlan->invoice_no = $max_invoice_no;
                    $userPlan->created =  date('Y-m-d');
                    $userPlan->save();
            
                    $payinfo = '<p style="color:#434343; margin:10px 0 0;"><b>Plan Name:</b> ' . $planName . '</p>';
                    $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>Amount:</b> ' . $amount . '</p>';
                    $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>Transaction ID:</b> ' . $transactionId . '</p>';
                    $payinfo .= '<p style="color:#434343; margin:0px 0 0;"><b>Date:</b> ' . $date . '</p';
            
                    $currentYear = date('Y', time());
                    $emailtemplateMessage = Emailtemplate::find(41);
                    $subjectToSend = str_replace(
                        ['[!username!]', '[!payinfo!]', '[!SITE_TITLE!]', '[!DATE!]'],
                        [$name, $payinfo, $site_title, $currentYear],
                        $emailtemplateMessage->subject
                    );
            
                   // Mail::to($email)->send(new EmailTemplate($subjectToSend, $messageToSend));
            
                    $adminInfo = Admin::find(1);
            
                    
                    //new code
                    $emailTemplate = Emailtemplate::where('id',42)->first();

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
                            // echo $designation;

                            $sitelink = '<a style="color:#000; text-decoration: underline;" href="mailto:' . MAIL_FROM . '">' . MAIL_FROM . '</a>';

                            $toSubArray = array('[!username!]', '[!SITE_TITLE!]', '[!plan_name!]', '[!DATE!]', '[!transactionId!]', '[!amountPaid!]', '[!company_name!]');

                            $fromSubArray = array($name, $site_title, $planName, $date, $transactionId, $amount, $companyname);

                            $emailSubject = str_replace($toSubArray, $fromSubArray, $template_subject);
                            $emailBody = str_replace($toSubArray, $fromSubArray, $template_body);
                            
                            // print_r($date);
                            // print_r($transactionId);
                            // print_r($amount);
                            // print_r($companyname);
                           

                            try {
                                Mail::to($adminInfo->email)->send(new SendMailable($emailBody, $emailSubject));
                            } catch(\Exception $e) {
                                $msgString=$e->getMessage();
                            }
                }

            }
        return Response(['response' => $data , 'message' => 'You have successfully completed payment for your membership plan.'  ,'status' => 200 ],200);
        exit;
    }

    public function cancelpayment(Request $request,$slug = null):Response{
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        $paymentInfo = Payment::where('slug', $slug)->first();
        if ($paymentInfo){
            if ($paymentInfo->payment_status == 'pending') {
        
                Payment::where('id', $paymentInfo->id)->update([
                    'payment_status' => 'cancelled',
                ]);
                return Response(['response' => $data , 'message' => 'You have successfully completed payment for your membership plan.'  ,'status' => 200 ],200);
            }else{
                return Response(['response'=> 'Somthing went wrong' , 'message' => 'Somthing went wrong' ,'status' => 500 ],200);
            }
        }else{
            return Response(['response'=> 'Somthing went wrong' , 'message' => 'Somthing went wrong' ,'status' => 500 ],200);
        }
        exit;
    }


    public function stripepayment(Request $request):Response {
        

        try {
            \Stripe\Stripe::setApiKey(STRIPE_SECRET);

            $amount=22.00 * 100;


    
            $intent = \Stripe\PaymentIntent::create([
                'amount' => $amount, // Amount in cents
                'currency' => 'usd',
                'description' => 'Plan Purchase',
            ]);

            // Validate the value...
        } catch (Throwable $e) {
            print_r($e);
     
        }
       
        print_r($intent->client_secret);exit;
        exit;
        // require_once '../vendor/autoload.php';


        // \Stripe\Stripe::setApiKey(STRIPE_KEY);
        // header('Content-Type: application/json');
        
        // $YOUR_DOMAIN = 'https://job-board-software.logicspice.com';
        
        // $checkout_session = \Stripe\Checkout\Session::create([
        //   'line_items' => [[
        //     # Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
        //     'price' => '100',
        //     'quantity' => 1,
        //   ]],
        //   'mode' => 'payment',
        //   'success_url' => $YOUR_DOMAIN . '?success=true',
        //   'cancel_url' => $YOUR_DOMAIN . '?canceled=true',
        // ]);
        
        // print_r($checkout_session->url);exit;
        
        //header("HTTP/1.1 303 See Other");
       // header("Location: " . $checkout_session->url);

        
                \Stripe\Stripe::setApiKey(STRIPE_SECRET);

        $YOUR_DOMAIN = env('APP_URL'); // Assuming your Laravel app is running on the same domain
        $amount='pr_1234';

        $checkoutSession = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $amount,
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $YOUR_DOMAIN . '?success=true',
            'cancel_url' => $YOUR_DOMAIN . '?canceled=true',
        ]);
         print_r($checkoutSession->url);exit;

        return redirect()->away($checkoutSession->url, 303);
        

        // $tokenData = $this->requestAuthentication('POST', 1);
        // $userId = $tokenData['user_id'];


        // $getemp = User::where('id',$userId)->first();

        // $data=array();
        // $msgString='';
        // Set your secret key
       // Stripe::setApiKey(STRIPE_KEY);

        exit;
    }
    
    
    ///rohan stripe
    public function PayWithStripe(Request $request):Response{
        
        $tokenData = $this->requestAuthentication('POST', 1);
        $userId = $tokenData['user_id'];
        
        
        require_once BASE_PATH.'/vendor/stripe/stripe-php/init.php';
        
        // $settingsInfo = DB::table('settings')->where('id', 1)->first();
        // $stripe_sk = STRIPE_KEY;
        // if($settingsInfo->stripe_mode == 1){
        //     $stripe_sk = $settingsInfo->stripe_sk;
        // }
        
        $stripe_sk = Admin::where('id',1)->value('stripe_secret_key');

        \Stripe\Stripe::setApiKey($stripe_sk);
        
        header('Content-Type: application/json');

        $getemp = User::where('id',$userId)->first();

        $data=array();
        $msgString='';


        $rules = array(
            'plan_id' => 'required',
            'payment_option' => 'required',
        );


        $validator = Validator::make($request->all(),$rules);

        $validator->setAttributeNames([
            'plan_id' => 'Plan',
            'payment_option' => 'Payment Option',
        ]);
        
        if($validator->fails()){
           $msgString = $this->validatersErrorString($validator->errors());

           return Response(['response'=> $msgString , 'message' => $msgString ,'status' => 500 ],200);
        }else{
            
            $planId = $request->plan_id;
            
            try{
                
                $planInfo = Plan::find($planId);
                            // works fine
                // $paymentIntent = \Stripe\PaymentIntent::create([
                //     'amount' => $planInfo->amount * 100,
                //     'currency' => 'inr',
                //     'description' => 'Plan Purchase',
                //     'payment_method_types' => [ 
                //         'card' 
                //     ] 
                // ]);
                
                $paymentIntent = \Stripe\PaymentIntent::create([
    'amount' => $planInfo->amount * 100,
    'currency' => 'inr',
    'description' => 'Plan Purchase',
    'payment_method_types' => [
        'card'
    ],
    'shipping' => [
        'name' => 'John Doe', // Static customer name
        'address' => [
            'line1' => '123 Main Street', // Static address line 1
            'line2' => 'Suite 100', // Static address line 2
            'city' => 'Mumbai', // Static city
            'state' => 'Maharashtra', // Static state
            'postal_code' => '400001', // Static postal code
            'country' => 'IN' // Static country code for India
        ]
    ]
]);

                
                return Response(['clientSecret' => $paymentIntent->client_secret , 'id' =>$paymentIntent->id ]);
                exit();
                
            }catch (Error $e) { 
                http_response_code(500); 
                Response(['error' => $e->getMessage()]); 
            }
            
        }
        
        
        // try {

        //     if($request->request_type == 'intra'){
                
        //         $paymentIntent = \Stripe\PaymentIntent::create([
        //             'amount' => $recordInfo->total_amount * 100,
        //             'currency' => 'USD',
        //             'description' => $recordInfo->Gig->title,
        //             'payment_method_types' => [ 
        //                 'card' 
        //             ] 
        //         ]);
                
        //         echo json_encode(['clientSecret' => $paymentIntent->client_secret , 'id' =>$paymentIntent->id ]);
        //         exit();
                
        //     }else
        //     if($request->request_type == 'create_customer'){
                
        //         $payment_intent_id = $request->payment_intent_id;
                
        //         $loginUserInfo = User::where('id', Session::get('user_id'))->first();
                
        //         $name = $loginUserInfo->first_name . ' ' . $loginUserInfo->last_name;
        //         $email = $loginUserInfo->email_address;
            
                 
        //         // Add customer to stripe 
        //         try {   
        //             $customer = \Stripe\Customer::create(array(  
        //                 'name' => $name,  
        //                 'email' => $email 
        //             ));  
        //         }catch(Exception $e) {   
        //             $api_error = $e->getMessage();   
        //         } 
                 
        //         if(empty($api_error) && $customer){ 
        //             try { 
        //                 // Update PaymentIntent with the customer ID 
        //                 $paymentIntent = \Stripe\PaymentIntent::update($payment_intent_id, [ 
        //                     'customer' => $customer->id 
        //                 ]); 
        //             } catch (Exception $e) {  
        //                 // log or do what you want 
        //             } 
                     
        //             $output = [ 
        //                 'id' => $payment_intent_id, 
        //                 'customer_id' => $customer->id 
        //             ]; 
        //             echo json_encode($output); 
        //         }else{ 
        //             http_response_code(500); 
        //             echo json_encode(['error' => $api_error]); 
        //         } 
                    
        //     }else
        //     if($request->request_type == 'payment_insert'){
        //         $payment_intent = $request->payment_intent;
                
        //         if(!empty($payment_intent) && $payment_intent['status'] == 'succeeded'){
                    
        //             $transactionId = $payment_intent['id'];
        //             $paymenttype = 'stripe';
                    
        //             $gig_id = $recordInfo->gig_id;
        //             $total_amount = $recordInfo->total_amount;
        //             $wallet_trn_id = $transactionId;
                    
        //             $data = array('success' => true , 'trx_id' => $transactionId);
                    
        //             $paymentrecord = Payment::where('transaction_id', $transactionId)->first();
        //             $orderrecord = Myorder::where('paypal_trn_id', $transactionId)->first();
            
        //             if(!empty($paymentrecord) && !empty($orderrecord)){
        //                 echo json_encode(['success' => false]);
        //                 exit();
        //             }else{
            
        //                 if ($transactionId) {
        //                     $serialisedData = array();
        //                     $serialisedData['user_id'] = Session::get('user_id');
        //                     $serialisedData['order_slug'] = bin2hex(openssl_random_pseudo_bytes(30));
        //                     $serialisedData['order_number'] = $wallet_trn_id;
        //                     $serialisedData['slug'] = bin2hex(openssl_random_pseudo_bytes(30));
        //                     $serialisedData['status'] = 1;
        //                     $serialisedData['amount'] = $total_amount;
        //                     $serialisedData['gig_id'] = $gig_id;
        //                     $serialisedData['transaction_id'] = $wallet_trn_id;
        //                     Payment::insert($serialisedData);
                
        //                     $serialisedData = array();
        //                     $serialisedData['buyer_id'] = Session::get('user_id');
        //                     $serialisedData['gig_id'] = $recordInfo->gig_id;
        //                     $serialisedData['seller_id'] = $recordInfo->Gig->user_id;
        //                     $serialisedData['package'] = $recordInfo->package;
        //                     $serialisedData['amount'] = $recordInfo->amount;
        //                     $serialisedData['extra_ids'] = $recordInfo->extra_ids;
        //                     $serialisedData['extra_amount'] = $recordInfo->extra_amount;
        //                     $serialisedData['total_amount'] = $recordInfo->total_amount;
        //                     $serialisedData['revenue'] = $recordInfo->revenue;
        //                     $serialisedData['admin_amount'] = $recordInfo->admin_amount;
        //                     $serialisedData['admin_commission'] = $recordInfo->admin_commission;
        //                     $serialisedData['quantity'] = 1;
        //                     $serialisedData['pay_type'] = 'stripe';
        //                     $serialisedData['paypal_trn_id'] = $wallet_trn_id;
        //                     $serialisedData['status'] = 1;
        //                     $serialisedData['slug'] = bin2hex(openssl_random_pseudo_bytes(20));
        //                     $serialisedData = $this->serialiseFormData($serialisedData);
        //                     Myorder::insert($serialisedData);
                            
                            
        //                     $amountseller = CURR.$recordInfo->revenue;
            
        //                     // Email sent to login user
        //                     $gigInfo = Gig::where('id', $recordInfo->gig_id)->first();
        //                     $loginUserInfo = User::where('id', Session::get('user_id'))->first();
        //                     $loginuser = $loginUserInfo->first_name . ' ' . $loginUserInfo->last_name;
        //                     $amount = CURR . $total_amount;
        //                     $transactionId = $wallet_trn_id;
        //                     $datetime = date('M d, Y');
        //                     $title = $gigInfo->title;
                
        //                     $emailId = $loginUserInfo->email_address;
        //                     $emailTemplate = DB::table('emailtemplates')->where('id', 13)->first();
        //                     $toRepArray = array('[!username!]', '[!title!]', '[!amount!]', '[!transactionId!]', '[!paymenttype!]', '[!datetime!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]');
        //                     $fromRepArray = array($loginuser, $title, $amount, $transactionId, $paymenttype, $datetime, HTTP_PATH, SITE_TITLE);
        //                     $emailSubject = str_replace($toRepArray, $fromRepArray, $emailTemplate->subject);
        //                     $emailBody = str_replace($toRepArray, $fromRepArray, $emailTemplate->template);
        //                     Mail::to($emailId)->send(new SendMailable($emailBody, $emailSubject));
                
        //                     // Email sent to admin user
        //                     $adminInfo = DB::table('admins')->where('id', 1)->first();
        //                     $emailId = $adminInfo->email;
        //                     $emailTemplate = DB::table('emailtemplates')->where('id', 14)->first();
        //                     $toRepArray = array('[!username!]', '[!title!]', '[!amount!]', '[!transactionId!]', '[!paymenttype!]', '[!datetime!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]');
        //                     $fromRepArray = array($loginuser, $title, $amount, $transactionId, $paymenttype, $datetime, HTTP_PATH, SITE_TITLE);
        //                     $emailSubject = str_replace($toRepArray, $fromRepArray, $emailTemplate->subject);
        //                     $emailBody = str_replace($toRepArray, $fromRepArray, $emailTemplate->template);
        //                     Mail::to($emailId)->send(new SendMailable($emailBody, $emailSubject));
                
        //                     // Email sent to seller user
        //                     $sellerInfo = User::where('id', $gigInfo->user_id)->first();
        //                     $emailId = $sellerInfo->email_address;
        //                     $sellername = $sellerInfo->first_name . ' ' . $sellerInfo->last_name;
                
        //                     $emailTemplate = DB::table('emailtemplates')->where('id', 15)->first();
        //                     $toRepArray = array('[!username!]', '[!title!]', '[!amount!]', '[!transactionId!]', '[!paymenttype!]', '[!datetime!]', '[!sellername!]', '[!HTTP_PATH!]', '[!SITE_TITLE!]');
        //                     $fromRepArray = array($loginuser, $title, $amountseller, $transactionId, $paymenttype, $datetime, $sellername, HTTP_PATH, SITE_TITLE);
        //                     $emailSubject = str_replace($toRepArray, $fromRepArray, $emailTemplate->subject);
        //                     $emailBody = str_replace($toRepArray, $fromRepArray, $emailTemplate->template);
        //                     Mail::to($emailId)->send(new SendMailable($emailBody, $emailSubject));
                
        //                     Cart::where('id', $recordInfo->id)->delete();
                            
        //                     $data['gig_id'] = $recordInfo->gig_id;
        //                     $data['rev'] = $recordInfo->revenue;
        //                     $data['amount'] = $total_amount;
                            
        //                 }
        //             }
                    
                    
        //             echo json_encode($data);
        //         }

        //     }
        // } catch (Error $e) { 
        //     http_response_code(500); 
        //     echo json_encode(['error' => $e->getMessage()]); 
        // }
        
    }
}
