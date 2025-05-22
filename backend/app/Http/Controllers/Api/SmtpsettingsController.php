<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use Mail;
use App\Mail\SendMailable;
use App\Models\Admin;
use App\Models\Smtpsetting;

class SmtpsettingsController extends Controller
{
    public function admin_configuration(Request $request) {        
        
        $msgString = '';
        if(!empty($request->all())){
            if($request->is_smtp == 1){
                if($request->smtp_host == ''){
                    $msgString .= "- Please enter SMTP Host Name.<br>";
                }
                if($request->smtp_username == ''){
                    $msgString .= "- Please enter SMTP Username.<br>";
                }
                if($request->smtp_password == ''){
                    $msgString .= "- Please enter SMTP Password.<br>";
                }
                if($request->smtp_port == ''){
                    $msgString .= "- Please enter SMTP Post.<br>";
                }
                if($request->smtp_timeout == '' ){
                    $msgString .= "- Please enter SMTP Timeout.<br>";
                }

                if(isset($msgString) && $msgString != ''){
                    return Response(['response' => '' , 'message' => $msgString ,'status' => 200]);
                }else{
                    $adminInfo = Admin::where('id',1)->select('email')->first();

                    $emailBody = 'Test mail sent via SMTP';
                    $emailBody = 'This is the test mail sent via SMTP';

                    //Mail::to($adminInfo->email)->send(new SendMailable($emailBody, $emailSubject));

                    Smtpsetting::where('id',1)->update([
                        'is_smtp' => 1,
                        'smtp_host' => $request->smtp_host,
                        'smtp_username' => $request->smtp_username,
                        'smtp_password' => $request->smtp_password,
                        'smtp_port' => $request->smtp_port,
                        'smtp_timeout' => $request->smtp_timeout,
                    ]);

                    return Response(['response' => '' , 'message'=>'SmptSettings updated sucessfully' , 'status' => 200 ]);
                }
            }else{
                Smtpsetting::where('id',1)->update([
                    'is_smtp' => 0,
                ]);
                return Response(['response' => '' , 'message'=>'SmptSettings updated sucessfully' , 'status' => 200 ]);
            }
        }else{
           $data['smtpsetting'] = Smtpsetting::where('id',1)->first();
           return Response(['response' => $data ,'message' => '' ,'status' => 200 ]);
        }       
    }
}
