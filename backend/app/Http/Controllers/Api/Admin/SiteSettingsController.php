<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use App\Models\site_setting;

class SiteSettingsController extends Controller
{
    public function getSiteSettings():Response{

        $site_settings=site_setting::first();

        // $site_settings=DB::table('site_settings')->get();

        return Response(['responce'=>$site_settings,'status'=>200],200);
    }

    public function updateSiteSettings(Request $request):Response{

        try{
            site_setting::whereId(1)->update($request->all());
        }catch(\Exception $e){
            return Response(['responce'=>'There was an error while updating site settings','status'=>500],200);
        }


        // DB::table('site_settings')
        // ->where('id',1)
        // ->update([
        //     'title'=>$request->title,
        //     'url'=>$request->url,
        //     'tagline'=>$request->tagline,
        //     'phone'=>$request->phone,
        //     'max_size'=>$request->max_size,
        //     'facebook_link'=>$request->facebook_link,
        //     'twitter_link'=>$request->twitter_link,
        //     'instagram_link'=>$request->instagram_link,
        //     'linkedin_link'=>$request->linkedin_link,
        //     'pinterest'=>$request->pinterest,
        //     'video_link'=>$request->video_link,
        //     'app_payment'=>$request->app_payment,
        //     'jobs_count'=>$request->jobs_count,
        //     'top_emp_text'=>$request->top_emp_text,
        //     'modified'=>now(),
        // ]);

        return Response(['responce'=>'Site settings updated successfully','status'=>200],200);
    }
}
