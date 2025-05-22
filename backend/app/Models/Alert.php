<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';
    
    protected $fillable = ['designation','user_id','location','status','slug' , 'modified' , 'created'];
    
    use HasFactory;
}
