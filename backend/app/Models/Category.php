<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $guarded = []; 
    public $timestamps = false;

    public function getCategoryList(){
        $categories = $this->where('status',1)
        ->where('parent_id',0)
        ->select('id','name','slug')
        ->orderBy('name','asc')
        ->get();

        return $categories;
    }

    public function getSubCategoryList($categoryId) {
        $categories = $this->where('status',1)
        ->where('parent_id',$categoryId)
        ->select('id','name','slug')
        ->orderBy('name','asc')
        ->get();

        return $categories;
    }
}
