<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;
use App\Models\Education;
use App\Models\Experience;
use App\Models\MailHistory;


class User extends Authenticatable implements JWTSubject
{
    // use HasApiTokens, HasFactory, Notifiable;

    use  HasFactory;
    
    const UPDATED_AT = 'modified';
    const CREATED_AT = 'created';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'password',
    // ];

    // /**
    //  * The attributes that should be hidden for serialization.
    //  *
    //  * @var array<int, string>
    //  */
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];

    // /**
    //  * The attributes that should be cast.
    //  *
    //  * @var array<string, string>
    //  */
    // protected $casts = [
    //     'email_verified_at' => 'datetime',
    // ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
    
    public function education()
    {
        return $this->hasMany(Education::class, 'user_id');
    }

    public function experience()
    {
        return $this->hasMany(Experience::class, 'user_id');
    }
    
    public function mailhistory_sender()
    {
        return $this->hasMany(MailHistory::class, 'from_id');
    }
    
    public function mailhistory_reciever()
    {
        return $this->hasMany(MailHistory::class, 'to_id');
    }
    
    
    public function isRecordUniqueemail($email_address = null) {

        $resultUser = $this->where('email_address',addslashes($email_address))->count();
        

        if ($resultUser > 0) {
            return false;
        } else {
            return true;
        }
    }
}
