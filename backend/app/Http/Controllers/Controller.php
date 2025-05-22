<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Swear;
use App\Models\User;
use App\Models\Site_setting;
use App\Models\Admin;
use Session;
use Image;
use JWTFactory;
use JWTAuth;
use Imagick;
use DB;
use Illuminate\Http\Response;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;


    public function validatersErrorString($errors){

        $msgString='';

        foreach($errors->all() as $error){
            $msgString.=' - '.$error.'<br>';
        }

        return $msgString;
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

    public function checkSwearWord($data){
        $msgString = '';
        $swearWord = Swear::get();

        foreach($swearWord as $words){
            if (preg_match("/".strtolower(($words->s_word))."\b/", strtolower(($data)))) {
                $msgString = 'Unsuitable word "' . $words->s_word . '" not permitted.';
                break;
            }
        }

        if ($msgString != '') {
            return $msgString;
        } else {
            return '';
        }
    }

    public function userLoginCheck($userid) {

        $isExists = User::where('id',$userid)
        ->where('activation_status',1)
        ->where('status',1)
        ->first();

        if ($isExists->count() == 0) {
            $msgString = 'Please Login';

            $data['error_msg']=$msgString;

            return $data;
        }

        return '';
    }

    public function candidateAccess($userid) {

        $type = $this->getUserDetialsById($userid);
        if($type['user_type'] != 'candidate'){
            return false;
        }

        return true;
    }
    
    public function recruiterAccess($userid) {
        $type = $this->getUserDetialsById($userid);
        if($type['user_type'] != 'recruiter'){
            return false;
        }
        return true;
    }

    public function uploadImageWithSameName($file, $upload_path=null){
        $orgName = $file->getClientOriginalName();
        $newFileName = $orgName;
        $file->move($upload_path, $newFileName);
        return $newFileName;
    }
    public function uploadImage($file, $upload_path=null){
        $orgName = $file->getClientOriginalName();
        $newFileName = bin2hex(openssl_random_pseudo_bytes(4)).'_'.$orgName;
        $file->move($upload_path, $newFileName);
        return $newFileName;
    }
    
    public function image_type_to_extension($imagetype) {
        if (empty($imagetype))
            return false;
        switch ($imagetype) {
            case IMAGETYPE_GIF : return 'gif';
            case IMAGETYPE_JPEG : return 'jpg';
            case IMAGETYPE_PNG : return 'png';
            case IMAGETYPE_SWF : return 'swf';
            case IMAGETYPE_PSD : return 'psd';
            case IMAGETYPE_BMP : return 'bmp';
            case IMAGETYPE_TIFF_II : return 'tiff';
            case IMAGETYPE_TIFF_MM : return 'tiff';
            case IMAGETYPE_JPC : return 'jpc';
            case IMAGETYPE_JP2 : return 'jp2';
            case IMAGETYPE_JPX : return 'jpf';
            case IMAGETYPE_JB2 : return 'jb2';
            case IMAGETYPE_SWC : return 'swc';
            case IMAGETYPE_IFF : return 'aiff';
            case IMAGETYPE_WBMP : return 'wbmp';
            case IMAGETYPE_XBM : return 'xbm';
            default : return false;
        }
    }
    
    public function resizeImage($uploadedFileName, $imgFolder, $thumbfolder, $newWidth = false, $newHeight = false, $quality = 75, $bgcolor = false) {
        $img = $imgFolder . $uploadedFileName;
        $newName = $uploadedFileName;
        $dest = $thumbfolder.$newName;
        list($oldWidth, $oldHeight, $type) = getimagesize($img);
        $ext = $this->image_type_to_extension($type);
        if ($newWidth OR $newHeight) {
            $widthScale = 2;
            $heightScale = 2;

            if ($newWidth)
                $widthScale = $newWidth / $oldWidth;
            if ($newHeight)
                $heightScale = $newHeight / $oldHeight;
            //debug("W: $widthScale  H: $heightScale<br>");
            if ($widthScale < $heightScale) {
                $maxWidth = $newWidth;
                $maxHeight = false;
            } elseif ($widthScale > $heightScale) {
                $maxHeight = $newHeight;
                $maxWidth = false;
            } else {
                $maxHeight = $newHeight;
                $maxWidth = $newWidth;
            }

            if ($maxWidth > $maxHeight) {
                $applyWidth = $maxWidth;
                $applyHeight = ($oldHeight * $applyWidth) / $oldWidth;
            } elseif ($maxHeight > $maxWidth) {
                $applyHeight = $maxHeight;
                $applyWidth = ($applyHeight * $oldWidth) / $oldHeight;
            } else {
                $applyWidth = $maxWidth;
                $applyHeight = $maxHeight;
            }
          
            $startX = 0;
            $startY = 0;
                 
            switch ($ext) {
                case 'gif' :
                    $oldImage = imagecreatefromgif($img);
                    break;
                case 'png' :
                    $oldImage = imagecreatefrompng($img);
                    break;
                case 'jpg' :
                case 'jpeg' :
                    $oldImage = imagecreatefromjpeg($img);
                    break;
                default :
                    return false;
                    break;
            }
            //create new image
            $newImage = imagecreatetruecolor($applyWidth, $applyHeight);
            imagecopyresampled($newImage, $oldImage, 0, 0, $startX, $startY, $applyWidth, $applyHeight, $oldWidth, $oldHeight);
            switch ($ext) {
                case 'gif' :
                    imagegif($newImage, $dest, $quality);
                    break;
                case 'png' :
                    imagepng($newImage, $dest, 8);
                    break;
                case 'jpg' :
                case 'jpeg' :
                    imagejpeg($newImage, $dest, $quality);
                    break;
                default :
                    return false;
                    break;
            }
            imagedestroy($newImage);
            imagedestroy($oldImage);
            if (!$newName) {
                unlink($img);
                rename($dest, $img);
            }
            return true;
        }
        
    }
    
    public function resizeImage_std($newFileName, $to_path ,$from_path=null, $max_width=null, $max_height=null){
        list($width, $height)  = getimagesize($from_path . $newFileName);
        $image = Image::make($from_path . $newFileName);
        if($width > $height){
            if($max_width < $width){
                $image->resize($max_width, null, function ($constraint) { $constraint->aspectRatio();});
            }            
        }else{
            if($max_height < $height){
                $image->resize(null, $max_height, function ($constraint) { $constraint->aspectRatio();});
            } 
        }
        $image->save($to_path.$newFileName);
        return;
    }
    
    public function getSiteConstant($index = ' ') {
        $sitelist = Site_setting::where('id',1)->select($index)->first();
        
        if ($sitelist) {
            return $sitelist;
        } else {
            return '';
        }
    }
    
    public function getMailConstant($index = ' ') {

        $mailData = Mail_setting::where('mail_type',$index)
        ->select('mail_value')
        ->first();

        if ($mailData->count() > 0) {
            return $mailData->mail_value;
        } else {
            return '';
        }
    }

    public function applyJobLoginCheck($userid) {

        $isExists  = User::where('id',$userid)
        ->where('activation_status',1)
        ->where('status',1)
        ->count();

        if($isExists > 0 ){
            return true;
        }
        return false;
    }


       /*     * ******* For token process ********** */

    // public function requestAuthentication($mth = 'GET', $checkToken = 0) {
    //     $reqMethod = $_SERVER["REQUEST_METHOD"];
    //     if ($reqMethod != $mth) {
    //         echo $this->errorOutputResult('bad request.');
    //         exit;
    //     }

    // //        $headers = apache_request_headers();
    //     //        $headers = apache_request_headers();
    // //        
    // $headers = array();
    // ////
    // foreach($_SERVER as $key => $value) {
    //     if(strpos($key, 'HTTP_') === 0) {
    //         $key = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
    //         $headers[$key] = $value;
    //     }
    // }
    //     $apiKey = $headers['key'];
    //     if (!$apiKey) {
    //         $apiKey = $headers['Key'];
    //     }
    //     if ($apiKey != API_KEY) {
    //         echo $this->errorOutputResult('Unauthorized Access.');
    //         exit;
    //     }

    //     if ($checkToken == 1) {
    //         if (isset($headers['token']) && $headers['token'] != '') {
    //             $token = $headers['token'];
    //         } else {
    //             $token = $headers['Token'];
    //         }
    //         $tokenData = $this->verifyToken($token);
    //         $tokenData = (array) $tokenData;

    //         //pr($tokenData);exit;
    //         if (isset($tokenData['error']) && $tokenData['error'] == 1) {
    //             echo $this->errorOutputResult($tokenData['msg']);
    //             exit;
    //         }
    //         return $tokenData;
    //     }

    //     if ($checkToken == 2) {
    //         $token = $headers['token'];
    //         if (!$token) {
    //             $token = $headers['Token'];
    //         }
    //         $tokenData = $this->verifyGuestToken($token);
    //         $tokenData = (array) $tokenData;
    //         if (isset($tokenData['error']) && $tokenData['error'] == 1) {
    //             echo $this->errorOutputResult($tokenData['msg']);
    //             exit;
    //         }
    //         return $tokenData;
    //     }
    //     return;
    // }

    // public function verifyGuestToken($jwt = null) {
    //     $string = strlen($jwt);
    //     $tokenData = array();
    //     if ($string > 32) {
    //         $tokenData = $this->Jwt->decode($jwt, API_KEY, array('HS256'));
    //         $tokenData = (array) $tokenData;
    //         if ($tokenData['error'] == 1) {
    //             $tokenData['msg'] = 'Guest token is invalid.';
    //         }
    //     } else {
    //         $this->verifyToken($jwt = null);
    //     }
    //     return $tokenData;
    // }

    // public function setGuestToken($payLoad = null) {
    //     return $this->Jwt->encode($payLoad, API_KEY);
    // }

    // public function setToken($payLoad = null) {
    //     $str = implode(',', $payLoad);
    //     $str = md5($str);
    //     if ($payLoad['user_id']) {
    //         $this->User->updateAll(array('User.token' => "'$str'"), array("User.id" => $payLoad['user_id']));
    //     }
    //     return $str;
    // }

    // public function errorOutputResult($errormsg = null) {
    //     return '{"response_status":"error","response_msg":"' . $errormsg . '","response_data":""}';
    // }

    // public function successOutputResult($successmsg = null, $response_data = '') {
    //     $response_data = str_replace(":null,", ':"",', $response_data);
    //     $response_data = str_replace(":null", ':""', $response_data);
    //     return '{"response_status":"success","response_msg":"' . $successmsg . '","response_data":' . $response_data . '}';
    // }

    // public function successOutputMsg($successmsg = null) {
    //     return '{"response_status":"success","response_msg":"' . $successmsg . '","response_data":""}';
    // }

    // public function errorOutputMsg($errormsg = null) {
    //     return '{"message":"error","description":"' . $errormsg . '"}';
    // }


    /////////


    public function requestAuthentication($mth='GET', $checkToken=0) {
        
        //print_r($_SERVER);die;
        $reqMethod = $_SERVER["REQUEST_METHOD"];
        
        // if($reqMethod != $mth){
        //     echo $this->errorOutputResult('bad request.');
        //     exit;
        // }
        
        //print_r($_SERVER['HTTP_KEY']); die;
        // $headers = apache_request_headers();
        $headers = $_SERVER;
        //print_r($headers); die;
        if(isset($headers['HTTP_KEY'])){
            $apiKey = $headers['HTTP_KEY'];
        }elseif(isset($headers['HTTP_KEY'])){
            $apiKey = $headers['HTTP_KEY'];
        }else{
            $apiKey = '';
        }
       // print_r($_SERVER); die;
        // $headers = apache_request_headers();
        // if(isset($_SERVER['HTTP_KEY'])){
        //     $apiKey = $_SERVER['HTTP_KEY'];
        // }elseif(isset($_SERVER['HTTP_KEY'])){
        //     $apiKey = $_SERVER['HTTP_KEY'];
        // }
        
        if ($apiKey != API_KEY) {
            echo $this->errorOutputResult('Unauthorized Access.');
            exit;
        }
        
       /* if($checkToken == 1){
            if(isset($headers['token']) && $headers['token'] !=''){
                $token = $headers['token'];
            }else{
                $token = $headers['Token'];
            }
            
            $tokenData = $this->verifyToken($token);
            $tokenData = (array)$tokenData;
            
            if(isset($tokenData['error']) && $tokenData['error'] == 1){
                echo $this->errorOutputResult($tokenData['msg']);
                exit;
            } 
            return $tokenData;
        }
        
        if($checkToken == 0){            
            if(isset($headers['token']) || isset($headers['Token'])){
                if(isset($headers['token']) && $headers['token'] !=''){
                    $token = $headers['token'];
                }else{
                    $token = $headers['Token'];
                }
                $tokenData = $this->verifyToken($token);
                $tokenData = (array)$tokenData;
                if(isset($tokenData['error']) && $tokenData['error'] == 1){
                    echo $this->errorOutputResult($tokenData['msg']);
                    exit;
                }
                return $tokenData;
            }            
        }
        */
        
        // if($checkToken == 1){
        //     if(isset($headers['token']) && $headers['token'] !=''){
        //         $token = $headers['token'];
        //     }elseif(isset($headers['Token']) && $headers['Token'] !=''){
        //         $token = $headers['Token'];
        //     }
        //     if(isset($token)){
        //         $tokenData = $this->verifyToken($token);
        //         $tokenData = (array)$tokenData;
                
        //         if(isset($tokenData['error']) && $tokenData['error'] == 1){
        //             echo $this->errorOutputResult($tokenData['msg']);
        //             exit;
        //         } 
        //         return $tokenData;
        //     }
        // }
        
        // if($checkToken == 0){            
        //     if(isset($headers['token']) || isset($headers['Token'])){
        //         if(isset($headers['token']) && $headers['token'] !=''){
        //             $token = $headers['token'];
        //         }if(isset($headers['Token']) && $headers['Token'] !=''){
        //             $token = $headers['Token'];
        //         }
        //         if(isset($token)){
        //             $tokenData = $this->verifyToken($token);
        //             $tokenData = (array)$tokenData;
        //             if(isset($tokenData['error']) && $tokenData['error'] == 1){
        //                 echo $this->errorOutputResult($tokenData['msg']);
        //                 exit;
        //             }
        //             return $tokenData;
        //         }
                    
        //     }            
        // }
        
        
         if($checkToken == 1){
            if(isset($headers['HTTP_TOKEN']) && $headers['HTTP_TOKEN'] !=''){
                $token = $headers['HTTP_TOKEN'];
            }elseif(isset($headers['HTTP_TOKEN']) && $headers['HTTP_TOKEN'] !=''){
                $token = $headers['HTTP_TOKEN'];
            }
            if(isset($token)){
                $tokenData = $this->verifyToken($token);
                $tokenData = (array)$tokenData;
        //echo '<pre>11';print_r($tokenData);exit;
                
                if(isset($tokenData['error']) && $tokenData['error'] == 1){
                    echo $this->errorOutputResult($tokenData['msg']);
                    exit;
                } 
                return $tokenData;
            }
        }
        
        if($checkToken == 0){            
            if(isset($headers['HTTP_TOKEN']) || isset($headers['HTTP_TOKEN'])){
                if(isset($headers['HTTP_TOKEN']) && $headers['HTTP_TOKEN'] !=''){
                    $token = $headers['HTTP_TOKEN'];
                }if(isset($headers['HTTP_TOKEN']) && $headers['HTTP_TOKEN'] !=''){
                    $token = $headers['HTTP_TOKEN'];
                }
                if(isset($token)){
                    $tokenData = $this->verifyToken($token);

                    $tokenData = (array)$tokenData;
                    
                 
                    
                    if(isset($tokenData['error']) && $tokenData['error'] == 1){
                        echo $this->errorOutputResult($tokenData['msg']);
                        exit;
                    }
                    return $tokenData;
                }
                    
            }            
        }
        
        
        
        return;
    }
    
    public function setToken($userCheck = null) {
        return JWTAuth::fromUser($userCheck);
    }    
    
    public function deleteToken($token = null) {
        $token = $_SERVER['HTTP_TOKEN'];
        // print_r($token);exit;

       // return JWTAuth::setToken($token)->invalidate();
      // $dd = JWTAuth::removeToken($token);
      //  $dd->invalidate();
    //   JWTAuth::setToken($token)->invalidate();
    //   // print_r($dd);
    //   $user = $this->verifyToken($token);
    //   print_r($user);
    //   echo 'removed';
    //   exit;
    //   $dd = JWTAuth::removeToken($token);
    //    $dd->invalidate();
        return JWTAuth::setToken($token)->invalidate();
    }  
    
    public function verifyToken($token = null) {
        JWTAuth::setToken($token);
        
        $dataRaw = explode(".",$token);
        $dataRaw =  base64_decode ($dataRaw[1]);
        $now = time();
        $dataRaw = json_decode($dataRaw);
         
        if($dataRaw->exp < $now-60){
          //  echo json_encode(['response' => '' , 'message' => 'Token Expired', 'status' => 500 ],200);
              echo json_encode(['response' => '' , 'message' => 'Please login.', 'status' => 400 ],200);
            exit();
            $this->errorOutputResult('Token Expired');
            exit; 
        }

        $tokenData  = JWTAuth::toUser($token);
        if (!empty($tokenData)) {
            $data = array();
            
            $data=$this->getUserDetialsById($tokenData->id);
            
            // $data['user_id']  = $tokenData->id;
            // $data['user_name']  = $tokenData->first_name.' '.$tokenData->last_name;
            // $data['email_address']  = $tokenData->email_address;
            return $data;
        }else{
            exit;
        }
    }  
    
    public function errorOutputResult($errormsg = null) {
        return json_encode(['response'=> '', 'message'=>$errormsg, 'status'=>500],200);exit;
        // echo '{"response_status":"error","response_msg":"' . $errormsg . '","response_data":""}'; exit;
    }
     
    public function successOutputResult($successmsg = null, $response_data='') {
        return json_encode(['response'=> $response_data, 'message'=>$successmsg, 'status'=>200],200);exit;
        
        // $response_data = str_replace(":null", ':""', $response_data);
        // echo '{"response_status":"success","response_msg":"' . $successmsg . '","response_data":'.$response_data.'}'; exit;
    }
    
    public function successOutput($successmsg = null) {
        
        return json_encode(['response'=> '', 'message'=>$successmsg, 'status'=>200],200);exit;
        
        // echo '{"response_status":"success","response_msg":"' . $successmsg . '","response_data":""}'; exit;
    }    
    
    public function errorOutput($errormsg = null) {
        return json_encode(['response'=> '', 'message'=>$errormsg ,'status'=>500],200);exit;
        // echo  '{"message":"error","description":"' . $errormsg . '"}'; exit;
    }
    
    // public function errorOutputResult($errormsg = null):Response {
    //     // echo '{"response_status":"error","response_msg":"' . $errormsg . '","response_data":""}'; 
                
    //     return Response(['response' => "error" , 'message'=>$errormsg , 'status'=>500]);

    //     exit;
    // }
     
    // public function successOutputResult($successmsg = null, $response_data='') {
    //     // $response_data = str_replace(":null,", ':"",', $response_data);
    //     // echo '{"response_status":"success","response_msg":"' . $successmsg . '","response_data":'.$response_data.'}'; 

    //     // return response()->json(['response'=>$data,'message'=> 'Jobs Lists Homescreen','status'=>200 ]);
    //     echo response()->json(['response' => $response_data , 'message'=>$successmsg , 'status'=>200]);
    //     exit();
    // }
    
    // public function successOutput($successmsg = null):Response {
    //     // echo '{"response_status":"success","response_msg":"' . $successmsg . '","response_data":""}'; exit;
        
    //     return Response(['response' => "success" , 'message'=>$successmsg , 'status'=>200]);
    // }    
    
    // public function errorOutput($errormsg = null):Response {
    //     // echo  '{"message":"error","description":"' . $errormsg . '"}'; exit;
        
    //     return Response(['response' => "error" , 'message'=>$errormsg , 'status'=>500]);
    // }
    
    public function getUserDetialsById($id =null)
    {
        $getuser = User::where('id',$id)->first();
        $user=array(
          'user_id' =>$getuser->id,
          'first_name' =>$getuser->first_name,
          'last_name' =>$getuser->last_name,
          'company_name' =>$getuser->company_name,
          'user_type' =>$getuser->user_type,
          'email_address' =>$getuser->email_address,
          'profile_image' =>$getuser->profile_image,
          'contact' =>$getuser->contact,
          'address' =>$getuser->address,
          //'web_token' =>$getuser->web_token,
        );
        return $user;

    }
    
    public function checkAdminLogin(){
        $headers = $_SERVER;
        //print_r($headers); die;
        if(isset($headers['HTTP_KEY'])){
            $apiKey = $headers['HTTP_KEY'];
        }elseif(isset($headers['HTTP_KEY'])){
            $apiKey = $headers['HTTP_KEY'];
        }else{
            $apiKey = '';
        }

        
        if ($apiKey != API_KEY) {
            echo $this->errorOutputResult('Unauthorized Access.');
            exit;
        }

        $token = $headers['HTTP_TOKEN'];

        $time_array = explod('.',$token);

        $expiryTime = base64_decode($time_array[1]);
        $now = strtotime('now');

        if($now > $expiryTime){
            echo $this->errorOutputResult('Token expiry.');
            exit;
        }

    }


    public function adminauthentication($key=null, $adminid=null) {
        $apiKey = '';
        $headers = $_SERVER;
    //    echo '<pre>';print_r($headers);exit;
       
        if(isset($headers['HTTP_KEY'])){
            $apiKey = $headers['HTTP_KEY'];
        }

        if ($apiKey == '') {
            echo $this->errorOutputResult('Please Provide Key.');
            exit;
        }

        if ($apiKey != API_KEY) {
            echo $this->errorOutputResult('Unauthorized Access.');
            exit;
        }

        
        $adminid='';
        if(isset($headers['HTTP_ADMINID'])){
            $adminid = $headers['HTTP_ADMINID'];
        }

        if ($adminid == '') {
            echo $this->errorOutputResult('Unauthorized Access.');
            exit;
        }
        if ($adminid != '') {
            $data = array();
            $isadmin=0;
            $admincheck = Admin::where('id', $adminid)->first();
            if ($admincheck != '') {
               // $data= $admincheck;
                if($admincheck->id == 1)
                {
                    $isadmin=1;
                }
                $data=array(
                    'id' =>$admincheck->id,
                    'first_name' =>$admincheck->first_name,
                    'last_name' =>$admincheck->last_name,
                    'username' =>$admincheck->username,
                    'email' =>$admincheck->email,
                    'isadmin' =>$isadmin,

                  );

                return $data;

            }else{
                echo $this->errorOutputResult('Unauthorized Access.');
                exit;
            }
        }

        exit;

    }


}
