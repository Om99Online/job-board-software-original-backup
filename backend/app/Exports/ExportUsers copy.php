<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;

class ExportUsers implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {

        $Blogs = User::orderBy('id','desc')->get();
        $Blogsarray = array();
        foreach($Blogs as $key => $blog){
            $Blogsarray[$key]['id'] = $blog->id;
            $Blogsarray[$key]['first_name'] = $blog->first_name;
            $Blogsarray[$key]['last_name'] = $blog->last_name;
            $Blogsarray[$key]['email_address'] = $blog->email_address;
            $Blogsarray[$key]['created'] = date('M d, Y',strtotime($blog->created));
            $Blogsarray[$key]['status'] = $blog->status;
        }
        return $Blogsarray;
       // return User::all();
        // return User::select("id"
        // , "first_name"
        // , "last_name"
        // , "email_address"
        // , "contact"
        // , "location"
        // , "status"
        // , "created")->get();


    }

    public function headings(): array
    {
        return ["ID", "First Name", "Last Email", "Email", "Conatact Number", "Location", "Status", "Joining Date"];
    }

}
