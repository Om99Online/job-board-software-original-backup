<?php

namespace App\Imports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use DB;
use App\Models\Skill;

class ImportUsers implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        $slug=$this->createSlug($row[0].' '.$row[1],'users');
        
        //print_r($row);exit;

        
        $sw = explode(",", $row[5]);
        $skill =array();

        foreach ($sw as $k => $v) {
        $get_skill = Skill::Where('name',$v)->first();
          if(isset($get_skill->name)){
            $skill[] =$get_skill->name;
          }
        }
        $skills = implode(",", $skill);

        // print_r($skills);
        // exit;

        return new User([
                'first_name' => $row[0],
                'last_name' => $row[1],
                // 'user_type' => $row[2],
                'email_address' => $row[2],
                // 'password' =>  Hash::make($row[4]),
                'status' => '1',
                // 'activation_status' => '1',
                'slug' => $slug,
                // 'skills' => $skills,
                // 'modified' => date('Y-m-d H:i:s'),
                // 'created' => date('Y-m-d H:i:s'),
        ]);
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
