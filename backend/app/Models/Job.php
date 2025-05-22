<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Skill;
use App\Models\User;

class Job extends Model
{
    use HasFactory;
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';
    
    protected $fillable = [
        'view_count',
        'search_count',
        'user_id', 
        'title', 
        'category_id', 
        'description', 
        'company_name', 
        'work_type', 
        'contact_name', 
        'contact_number', 
        'url', 
        'brief_abtcomp',
        'designation', 
        'job_city', 
        'lastdate', 
        'expire_time', 
        'min_exp', 
        'max_exp', 
        'min_salary', 
        'max_salary', 
        'subcategory_id', 
        'slug', 
        'type', 
        'status', 
        'payment_status', 
        'job_number', 
        'exp_month', 
        'hot_job_time', 
        'skill',
        'lat',
        'long',
    ];
    
    // protected static function booted()
    // {
    //     static::creating(function ($model) {
    //         $model->job_id=0;
    //     	$model->admin_id = 0;
    //     	$model->role = '';
    //     	$model->vacancy = 0;
    //     	$model->address = '';
    //     	$model->state_id = 0;
    //     	$model->city_id = 0;
    //     	$model->postal_code = '';
    //     	$model->youtube_link = '';
    //     	//$model->lastdate = '';
    //     	$model->url = '';
    //     	$model->selling_point1 = '';
    //     	$model->search_count = 0;
    //     	$model->view_count = 0;
    //     	$model->exp_year = '';
    //     	$model->exp_month = '';
    //     	$model->confidential = '';
    //     	$model->job_position = '';
    //     	$model->eligibility = '';
    //     	$model->job_salary = '';
    //     	$model->job_experience_id = '';
    //     	$model->job_email = '';
    //     	$model->job_fax = '';
    //     	$model->designation_ofperson = '';
    //     	$model->lat = '';
    //     	$model->long = '';
    //     });
    // }

    public function category()
    {
        return $this->belongsTo(Category::class,'category_id');
    }

    public function skills()
    {
        return $this->belongsTo(Skill::class,'skill');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
