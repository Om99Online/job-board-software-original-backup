<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Education extends Model
{
    use HasFactory;
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';
    
    protected $table = 'educations';
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
