<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banneradvertisement extends Model
{
    use HasFactory;
    
        protected $guarded = []; 
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';
    public $timestamps = false;
    function getBanneradvertisement($position = null, $limit = null) {

        $banner = $this::where('status',1)
        ->where('advertisement_place',$position)
        ->inRandomOrder()
        ->limit($limit)
        ->get();

        return $banner;
    }
}
