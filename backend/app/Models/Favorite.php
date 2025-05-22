<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Favorite extends Model
{
    use HasFactory;
    protected $guarded = []; 
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }
    
    public function candidate(){
        return $this->belongsTo(User::class , 'candidate_id');
    }

}
