<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Plan;
use App\Models\User;
use App\Models\Payment;

class User_plan extends Model
{
    use HasFactory;
        public $timestamps = false;
    public function plan(){
        return $this->belongsTo(Plan::class ,'plan_id');
    }

    public function user(){
        return $this->belongsTo(User::class , 'user_id');
    }

    public function payment(){
        return $this->belongsTo(Payment::class , 'payment_id');
    }
}
