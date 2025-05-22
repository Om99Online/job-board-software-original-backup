<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\OtpConfiguration;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Session;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class AutologinController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    // use AuthenticatesUsers;

    public function autologin($id) {
        $curl_need = curl_init();
        curl_setopt_array($curl_need, array(
            CURLOPT_URL => 'https://www.needtoday.com/api/autologin',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_HTTPHEADER => array(
                    "token:".$id,
                ),
        ));
        $response = curl_exec($curl_need);
        curl_close($curl_need);
        $response=json_decode($response);
        // dd($response);
        // dd($response->token_error);
        // if(!isset($response->token_error) and $response->status == 1) {
        //     dd('if');
        // } else {
        //     dd($response);
        // }
        // die();
        if(!isset($response->token_error) and isset($response->status)) {
            if($response->status == 1) {
                $email = $response->data->email;
                // $user = User::select('id','email','password')->where('email',$email)->where('user_type','User')->first();
                $user = User::select('id','email_address as email','password')->where('email_address',$email)->first();
                // dd($user->id);

                $first_name = $response->data->first_name;
                $last_name = $response->data->last_name;
                $profile_image = $response->avatar_url;
                $email = $response->data->email;
                $phone = $response->data->phone;
                $country_code = $response->data->phone_code;
                $password = $response->data->password;
                $token = $response->token;
                $is_seller = $response->data->is_seller;
                $status = 1;
                $activation_status = 1;
                $arruser = array('token'=>$token,'first_name'=>$first_name, 'last_name'=>$last_name, 'photo'=>$profile_image, 'email_address'=>$email, 'phone'=>$phone, 'country_code'=>$country_code, 'password'=>$password,'is_seller'=>$is_seller,'user_type'=>'member','email_verified_at'=>date('Y-m-d H:i:s'),'status'=>$status,'activation_status'=>$activation_status);
                // $arrmember = array('token'=>$token,'first_name'=>$first_name, 'last_name'=>$last_name, 'profile_image'=>$avatar_url, 'email'=>$email, 'phone'=>$phone, 'country_code'=>$country_code, 'password'=>$password,'is_seller'=>$is_seller);
                Session::put('userdata',$response);
                if(!empty($user)) {
                    $userid = $user->id;
                    $token = $response->token;
                    User::where('id',$userid)->update($arruser);
                    // User::where('user_id',$userid)->update($arrmember);
                    // $member = User::where('email',$response->data->email)->first();
                    $user = User::where('email',$response->data->email)->first();
                    auth()->login($user);
                    // Auth::guard('member')->login($user);
                    // dd(Auth::guard('member')->user());
                    return redirect()->to('dashboard');
                } else {
                    $userid = User::insertGetId($arruser);
                    $member_user_id = User::select('user_id')->where('user_id',$userid)->first();
                    $arrmember = array('token'=>$token,'first_name'=>$first_name, 'last_name'=>$last_name, 'profile_image'=>$profile_image, 'email'=>$email, 'phone'=>$phone, 'country_code'=>$country_code, 'password'=>$password,'is_seller'=>$is_seller, 'user_id'=>$userid);
                    if($member_user_id !== '') {
                        User::insert($arrmember);
                    }
                    // $member = Member::where('user_id',$userid)->first();
                    $user = User::where('email',$response->data->email)->first();
                    auth()->login($user);
                    // Auth::guard('member')->login($member);
                    return redirect()->to('dashboard');
                }
                // Account::where('id',$userid)->update(['token'=>'']);
            } else {
                return redirect()->to('/');
            }
        } else {
            return redirect()->to('/');
        }
    }

}

