<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';
    
    use HasFactory;
    
}
