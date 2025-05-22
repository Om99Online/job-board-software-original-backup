<?php
namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use DB;
class ExportEmployers implements FromCollection,WithHeadings
{

        /**
    * @return \Illuminate\Support\Collection
    */

    public function collection()
    {
        $type='recruiter';
        return User::select("id"
        , "first_name"
        , "last_name"
        , "email_address"
        , "company_name"
        , "position"
        , "status"
        , DB::raw('DATE(`created`)'))->where('user_type',$type)->get();
    }
     public function headings(): array
    {
        return ["ID", "First Name", "Last Email", "Email", "Company Name", "Position", "Status", "Joining Date"];

    }
}