<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Job;
use App\Models\Category;

class Short_list extends Model
{
    use HasFactory;
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';

    public function job(){
        return $this->belongsTo(Job::class,'job_id');
    }

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'job_id')
            ->whereColumn('categories.id', 'jobs.category_id')
            ->withDefault();
    }
}
