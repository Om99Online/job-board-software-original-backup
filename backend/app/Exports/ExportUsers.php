<?php
namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use DB;
class ExportUsers implements FromCollection,WithHeadings
{

        /**
    * @return \Illuminate\Support\Collection
    */

    public function collection()
    {
        $type='candidate';
        return User::select("id"
        , "first_name"
        , "last_name"
        , "email_address"
        , "contact"
        , "location"
        , "status"
        , "created")->where('user_type',$type)->get();
    }
     public function headings(): array
    {
        return ["ID", "First Name", "Last Email", "Email", "Conatact Number", "Location", "Status", "Joining Date"];

    }
}