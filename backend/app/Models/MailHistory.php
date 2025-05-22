<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class MailHistory extends Model
{
    protected $table = 'mails';
    
    public $timestamps = false;
    
    use HasFactory;
    
        public function Sender()
    {
        return $this->belongsTo('App\Models\User', 'from_id');
    }
    
    public function Reciever()
    {
        return $this->belongsTo('App\Models\User', 'to_id');
    }
    
}
