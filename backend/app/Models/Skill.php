<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Skill extends Model
{

    public $timestamps = false;
            protected $guarded = []; 

    use HasFactory;
    
    public function getSkillsNamesByIds($skills){

        if($skills != ''){
            
            $skillArray = explode(',',$skills);

            $skillData = $this->whereIn('id',$skillArray)
            ->select(DB::raw("GROUP_CONCAT(name SEPARATOR '/') as name"))
            ->groupBy('type')
            ->first();
        
            return $skillData->name;

        }

        return '';
        
    }
}
