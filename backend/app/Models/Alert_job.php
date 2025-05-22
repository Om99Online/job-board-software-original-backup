<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert_job extends Model
{
    use HasFactory;
      public $timestamps = false;
   // const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';
}
