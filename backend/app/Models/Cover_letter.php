<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cover_letter extends Model
{
    use HasFactory;
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';
}
