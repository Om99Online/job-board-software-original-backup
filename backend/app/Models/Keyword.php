<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keyword extends Model
{
    use HasFactory;
    
    const UPDATED_AT = '';
    const CREATED_AT = 'created';
    
    public $timestamps = false;
    protected $guarded = []; 

}
