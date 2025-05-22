<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site_setting extends Model
{
    use HasFactory;

    const UPDATED_AT = 'modified';

    protected $fillable = [
        'title',
        'url',
        'tagline',
        'phone',
        'max_size',
        'facebook_link',
        'twitter_link',
        'instagram_link',
        'linkedin_link',
        'pinterest',
        'video_link',
        'app_payment',
        'jobs_count',
        'top_emp_text',
    ];
}
