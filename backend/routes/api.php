<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\Admin\SiteSettingsController;
use App\Http\Controllers\Api\AdminsController;
use App\Http\Controllers\Api\BlogsController;
use App\Http\Controllers\Api\JobsController;
use App\Http\Controllers\Api\HomesController;
use App\Http\Controllers\Api\PagesController;
use App\Http\Controllers\Api\CandidatesController;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\PaymentsController;
use App\Http\Controllers\Api\CategoriesController;
use App\Http\Controllers\Api\AlertsController;
use App\Http\Controllers\Api\PlansController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\SmtpsettingsController;
use App\Http\Controllers\Api\SlidersController;
use App\Http\Controllers\Api\AnnouncementsController;
use App\Http\Controllers\Api\KeywordsController;
use App\Http\Controllers\Api\BanneradvertisementController;
use App\Http\Controllers\Api\CoursesController;
use App\Http\Controllers\Api\DesignationsController;
use App\Http\Controllers\Api\SkillsController;
use App\Http\Controllers\Api\CurrenciesController;
use App\Http\Controllers\Api\SwearsController;
use App\Http\Controllers\Api\NewslettersController;
use App\Http\Controllers\Api\SpecializationsController;
use App\Http\Controllers\Api\JobsImportsController;


// use App\Http\Controllers\Api\TestApi;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::post('/insertData',[TestApi::class,'storeUsersData']);
// Route::get('/getData',[Testapi::class,'getUsersData']);

	Route::any('/getconstant',[AdminsController::class,'getconstant']);
	Route::any('/importjob',[JobsImportsController::class,'importjob']);
	Route::any('/getimportjob',[JobsImportsController::class,'getimportjob']);
		Route::any('/getMetaData',[AdminsController::class,'getMetaData']);
Route::prefix('admin')->group(function(){
    
    Route::any('/getadminroles',[AdminsController::class,'getadminroles']);


	Route::any('/changeemail',[AdminsController::class,'admin_changeemail']);
	Route::any('/dashboard/',[AdminsController::class, 'admin_dashboard']);
	Route::any('/login/',[AdminsController::class, 'admin_login']);
	Route::any('/changecolorscheme/',[AdminsController::class, 'admin_changecolorscheme']);
	Route::any('/changeusername/',[AdminsController::class, 'admin_changeusername']);
	Route::any('/changePassword/',[AdminsController::class, 'changePassword']);
	Route::any('/changeccemail/',[AdminsController::class, 'admin_changeccemail']);
	Route::any('/settings/',[AdminsController::class, 'admin_settings']);
	Route::any('/userdetails/',[AdminsController::class, 'userdetails']);
	Route::any('/picture/',[AdminsController::class, 'admin_picture']);
	Route::any('/commission/',[AdminsController::class, 'admin_commission']);
	Route::any('/promocode/',[AdminsController::class, 'admin_promocode']);
	Route::any('/securityQuestions/',[AdminsController::class, 'admin_securityQuestions']);
	Route::any('/planPrice/',[AdminsController::class, 'admin_planPrice']);
	Route::any('/changeSlogan/',[AdminsController::class, 'admin_changeSlogan']);
	Route::any('/changePaymentdetail/',[AdminsController::class, 'admin_changePaymentdetail']);
	Route::any('/metaManagement/',[AdminsController::class, 'admin_metaManagement']);
	Route::any('/manage/',[AdminsController::class, 'admin_manage']);
	Route::any('/addsubadmin/',[AdminsController::class, 'admin_addsubadmin']);
	Route::any('/editadmins/{slug}',[AdminsController::class, 'admin_editadmins']);
	Route::any('/deleteadmins/{slug}',[AdminsController::class, 'admin_deleteadmins']);
	Route::any('/activateuser/{slug}',[AdminsController::class, 'admin_activateuser']);
	Route::any('/deactivateuser/{slug}',[AdminsController::class, 'admin_deactivateuser']);
	Route::any('/managerole/{slug}',[AdminsController::class, 'admin_managerole']);
	Route::any('/uploadLogo/',[AdminsController::class, 'admin_uploadLogo']);
	Route::any('/deleteLogo/',[AdminsController::class, 'deleteLogo']);
	Route::any('/changeFavicon/',[AdminsController::class, 'admin_changeFavicon']);
	Route::any('/deletefavicon/',[AdminsController::class, 'deletefavicon']);
	
	Route::any('/plan/index/',[PlansController::class, 'admin_index']);
	Route::any('/plan/addPlan/',[PlansController::class, 'admin_addPlan']);
	Route::any('/plan/editPlan/{slug}',[PlansController::class, 'admin_editPlan']);
	Route::any('/plan/activateplans/{slug}',[PlansController::class, 'admin_activateplans']);
	Route::any('/plan/deactivateplans/{slug}',[PlansController::class, 'admin_deactivateplans']);
	Route::any('/plan/deletePlan/{slug}',[PlansController::class, 'admin_deletePlan']);
	
	Route::any('/settings/siteSettings/',[SettingsController::class, 'admin_siteSettings']);
	Route::any('/settings/manageMails/',[SettingsController::class, 'admin_manageMails']);
	Route::any('/settings/editMails/{slug}',[SettingsController::class, 'admin_editMails']);
	
	Route::any('/users/index/',[UsersController::class, 'admin_index']);
	Route::any('/users/activateuser/{slug}',[UsersController::class, 'admin_activateuser']);
	Route::any('/users/deactivateuser/{slug}',[UsersController::class, 'admin_deactivateuser']);
	Route::any('/users/deleteusers/{slug}/{type?}',[UsersController::class, 'admin_deleteusers']);
	Route::any('/users/verifyNow/{slug}/{type?}',[UsersController::class, 'admin_verifyNow']);
	Route::any('/users/deleteUserImage/{userSlug}',[UsersController::class, 'admin_deleteUserImage']);
	Route::any('/users/editusers/{slug}',[UsersController::class, 'admin_editusers']);
	Route::any('/users/addusers/',[UsersController::class, 'admin_addusers']);
	Route::any('/users/selectforslider/',[UsersController::class, 'admin_selectforslider']);
	Route::any('/users/activateslider/{slug}',[UsersController::class, 'admin_activateslider']);
	Route::any('/users/deactivateslider/{slug}',[UsersController::class, 'admin_deactivateslider']);
	Route::any('/users/addemployertoslider/',[UsersController::class, 'admin_addemployertoslider']);
	Route::any('/users/updateeployerorder/',[UsersController::class, 'admin_updateeployerorder']);
    
    Route::any('/smtpsettings/configuration',[SmtpsettingsController::class, 'admin_configuration']);

	Route::any('/blog/index/',[BlogsController::class , 'admin_index']);
	Route::any('/blog/admin_editblogs/{slug}',[BlogsController::class, 'admin_editblogs']);
	Route::any('/blog/admin_addblogs',[BlogsController::class, 'admin_addblogs']);
	Route::any('/blog/admin_activateblog/{slug}',[BlogsController::class, 'admin_activateblog']);
	Route::any('/blog/admin_deactivateblog/{slug}',[BlogsController::class, 'admin_deactivateblog']);
	Route::any('/blog/admin_deleteblogs/{slug}',[BlogsController::class, 'admin_deleteblogs']);
	Route::any('/blog/admin_deleteBlogImage/{slug}',[BlogsController::class, 'admin_deleteBlogImage']);

	Route::any('/slider/index/',[SlidersController::class , 'admin_index']);
	Route::any('/slider/admin_edit/{slug}',[SlidersController::class, 'admin_edit']);
	Route::any('/slider/admin_add',[SlidersController::class, 'admin_add']);
	Route::any('/slider/admin_activate/{slug}',[SlidersController::class, 'admin_activate']);
	Route::any('/slider/admin_deactivate/{slug}',[SlidersController::class, 'admin_deactivate']);
	Route::any('/slider/admin_delete/{slug}',[SlidersController::class, 'admin_delete']);
	Route::any('/slider/admin_deleteImage/{slug}',[SlidersController::class, 'admin_deleteImage']);

	Route::any('/announcement/index/',[AnnouncementsController::class , 'admin_index']);
	Route::any('/announcement/admin_edit/{slug}',[AnnouncementsController::class, 'admin_edit']);
	Route::any('/announcement/admin_add',[AnnouncementsController::class, 'admin_add']);
	Route::any('/announcement/admin_activate/{slug}',[AnnouncementsController::class, 'admin_activate']);
	Route::any('/announcement/admin_deactivate/{slug}',[AnnouncementsController::class, 'admin_deactivate']);
	Route::any('/announcement/admin_delete/{slug}',[AnnouncementsController::class, 'admin_delete']);


	Route::any('/keyword/index/',[KeywordsController::class , 'admin_index']);
	Route::any('/keyword/admin_edit/{slug}',[KeywordsController::class, 'admin_edit']);
	Route::any('/keyword/admin_add',[KeywordsController::class, 'admin_add']);
	Route::any('/keyword/admin_activate/{slug}',[KeywordsController::class, 'admin_activate']);
	Route::any('/keyword/admin_deactivate/{slug}',[KeywordsController::class, 'admin_deactivate']);
	Route::any('/keyword/admin_delete/{slug}',[KeywordsController::class, 'admin_delete']);
	Route::any('/keyword/admin_approveStatus/{slug}',[KeywordsController::class, 'admin_approveStatus']);
	
	Route::any('/banner/index/',[BanneradvertisementController::class , 'admin_index']);
	Route::any('/banner/admin_add/',[BanneradvertisementController::class , 'admin_add']);
	Route::any('/banner/admin_edit/{slug}',[BanneradvertisementController::class, 'admin_edit']);
	Route::any('/banner/admin_activate/{slug}',[BanneradvertisementController::class, 'admin_activate']);
	Route::any('/banner/admin_deactivate/{slug}',[BanneradvertisementController::class, 'admin_deactivate']);
	Route::any('/banner/admin_delete/{slug}',[BanneradvertisementController::class, 'admin_delete']);
	
	Route::any('/course/index/',[CoursesController::class , 'admin_index']);
	Route::any('/course/admin_edit/{slug}',[CoursesController::class, 'admin_edit']);
	Route::any('/course/admin_add',[CoursesController::class, 'admin_add']);
	Route::any('/course/admin_activate/{slug}',[CoursesController::class, 'admin_activate']);
	Route::any('/course/admin_deactivate/{slug}',[CoursesController::class, 'admin_deactivate']);
	Route::any('/course/admin_delete/{slug}',[CoursesController::class, 'admin_delete']);

	Route::any('/page/index/',[PagesController::class , 'admin_index']);
	Route::any('/page/admin_edit/{slug}',[PagesController::class, 'admin_edit']);
	Route::any('/page/admin_activate/{slug}',[PagesController::class, 'admin_activate']);
	Route::any('/page/admin_deactivate/{slug}',[PagesController::class, 'admin_deactivate']);
	Route::any('/page/admin_delete/{slug}',[PagesController::class, 'admin_delete']);
	
	Route::any('/designation/index/',[DesignationsController::class , 'admin_index']);
	Route::any('/designation/admin_edit/{slug}',[DesignationsController::class, 'admin_edit']);
	Route::any('/designation/admin_add',[DesignationsController::class, 'admin_add']);
	Route::any('/designation/admin_activate/{slug}',[DesignationsController::class, 'admin_activate']);
	Route::any('/designation/admin_deactivate/{slug}',[DesignationsController::class, 'admin_deactivate']);
	Route::any('/designation/admin_delete/{slug}',[DesignationsController::class, 'admin_delete']);
	
	Route::any('/skill/index/',[SkillsController::class , 'admin_index']);
	Route::any('/skill/admin_edit/{slug}',[SkillsController::class, 'admin_edit']);
	Route::any('/skill/admin_add',[SkillsController::class, 'admin_add']);
	Route::any('/skill/admin_activate/{slug}',[SkillsController::class, 'admin_activate']);
	Route::any('/skill/admin_deactivate/{slug}',[SkillsController::class, 'admin_deactivate']);
	Route::any('/skill/admin_delete/{slug}',[SkillsController::class, 'admin_delete']);

	Route::any('/currency/index/',[CurrenciesController::class , 'admin_index']);
	Route::any('/currency/admin_edit/{slug}',[CurrenciesController::class, 'admin_edit']);
	Route::any('/currency/admin_add',[CurrenciesController::class, 'admin_add']);
	Route::any('/currency/admin_activate/{slug}',[CurrenciesController::class, 'admin_activate']);
	Route::any('/currency/admin_deactivate/{slug}',[CurrenciesController::class, 'admin_deactivate']);
	Route::any('/currency/admin_delete/{slug}',[CurrenciesController::class, 'admin_delete']);
	Route::any('/currency/admin_defaultcurrency/{id}',[CurrenciesController::class, 'admin_defaultcurrency']);

	Route::any('/swear/index/',[SwearsController::class , 'admin_index']);
	Route::any('/swear/admin_edit/{slug}',[SwearsController::class, 'admin_edit']);
	Route::any('/swear/admin_add',[SwearsController::class, 'admin_add']);
	Route::any('/swear/admin_delete/{slug}',[SwearsController::class, 'admin_delete']);

	Route::any('/job/index/',[JobsController::class , 'admin_index']);
	Route::any('/job/admin_add',[JobsController::class, 'admin_add']);
	Route::any('/job/admin_edit/{slug}',[JobsController::class, 'admin_edit']);
	Route::any('/job/admin_activate/{slug}',[JobsController::class, 'admin_activate']);
	Route::any('/job/admin_deactivate/{slug}',[JobsController::class, 'admin_deactivate']);
	Route::any('/job/admin_delete/{slug}',[JobsController::class, 'admin_delete']);
	Route::any('/job/admin_appliedcandidates/{slug}',[JobsController::class, 'admin_appliedcandidates']);
	Route::any('/payment/index',[PaymentsController::class,'admin_index']);
    Route::any('/job/admin_jobimport',[JobsController::class, 'admin_jobimport']);
    Route::any('/job/admin_jobimportnew',[JobsController::class, 'admin_jobimportnew']);
    Route::any('/job/admin_jobimportdata',[JobsController::class, 'admin_jobimportdata']);
    Route::any('/job/admin_feeddeactivate/{slug}',[JobsController::class, 'admin_feeddeactivate']);
    Route::any('/job/admin_feedactivate/{slug}',[JobsController::class, 'admin_feedactivate']);
    Route::any('/job/admin_feeddelete/{slug}',[JobsController::class, 'admin_feeddelete']);
    Route::any('/job/admin_feedindex',[JobsController::class, 'admin_feedindex']);
    
    Route::any('/job/admin_import',[JobsController::class, 'admin_import']);
		
    Route::any('/newsletter/index/',[NewslettersController::class , 'admin_index']);
    Route::any('/newsletter/admin_add',[NewslettersController::class, 'admin_add']);
    Route::any('/newsletter/admin_emailtest/{slug}',[NewslettersController::class, 'admin_emailtest']);
    Route::any('/newsletter/admin_edit/{slug}',[NewslettersController::class, 'admin_edit']);
    Route::any('/newsletter/admin_activate/{slug}',[NewslettersController::class, 'admin_activate']);
    Route::any('/newsletter/admin_deactivate/{slug}',[NewslettersController::class, 'admin_deactivate']);
    Route::any('/newsletter/admin_delete/{slug}',[NewslettersController::class, 'admin_delete']);
    Route::any('/newsletter/admin_sendNewsletter',[NewslettersController::class, 'admin_sendNewsletter']);
    Route::any('/newsletter/sentMail/',[NewslettersController::class , 'admin_sentMail']);
    Route::any('/newsletter/deleteSentMail/{slug}',[NewslettersController::class , 'admin_deleteSentMail']);
    Route::any('/newsletter/unsubscriberlist/',[NewslettersController::class , 'admin_unsubscriberlist']);
        
	Route::any('/candidates/index/',[CandidatesController::class, 'admin_index']);
	Route::any('/candidates/activateuser/{slug}',[CandidatesController::class, 'admin_activateuser']);
	Route::any('/candidates/deactivateuser/{slug}',[CandidatesController::class, 'admin_deactivateuser']);
	Route::any('/candidates/deleteusers/{slug}',[CandidatesController::class, 'admin_deletecandidates']);
	Route::any('/candidates/editusers/{slug}',[CandidatesController::class, 'admin_editcandidates']);
	Route::any('/candidates/addusers/',[CandidatesController::class, 'admin_addcandidates']);
   	Route::any('/candidates/applied/{slug}',[CandidatesController::class, 'admin_applied']);
    Route::any('/candidates/certificates/{slug}',[CandidatesController::class, 'admin_certificates']);
    Route::any('/candidates/deleteCertificate/{slug}',[CandidatesController::class, 'admin_deleteCertificate']);
	Route::any('/candidates/generatecsv/',[CandidatesController::class, 'admin_generatecsv']);
	Route::any('/users/generatecsv/',[UsersController::class, 'admin_generatecsv']);

	Route::any('/emailtemplates/',[AdminsController::class, 'admin_emailtemplates']);
	Route::any('/editemailtemplates/{slug}',[AdminsController::class, 'admin_editemailtemplates']);
		Route::any('/testmail/{slug}',[AdminsController::class, 'admin_testmail']);

		Route::any('/category/index/',[CategoriesController::class , 'admin_index']);
	Route::any('/category/admin_edit/{slug}',[CategoriesController::class, 'admin_edit']);
	Route::any('/category/admin_add',[CategoriesController::class, 'admin_add']);
	Route::any('/category/admin_activate/{slug}',[CategoriesController::class, 'admin_activate']);
	Route::any('/category/admin_deactivate/{slug}',[CategoriesController::class, 'admin_deactivate']);
	Route::any('/category/admin_delete/{slug}',[CategoriesController::class, 'admin_delete']);
	
	
	Route::any('/subcategory/index/{slug}',[CategoriesController::class , 'admin_subindex']);
	Route::any('/subcategory/admin_add/{slug}',[CategoriesController::class, 'admin_subadd']);
	Route::any('/subcategory/admin_edit/{slug}',[CategoriesController::class, 'admin_edit']);
	Route::any('/subcategory/admin_activate/{slug}',[CategoriesController::class, 'admin_activate']);
	Route::any('/subcategory/admin_deactivate/{slug}',[CategoriesController::class, 'admin_deactivate']);
	Route::any('/subcategory/admin_delete/{slug}',[CategoriesController::class, 'admin_delete']);
	
	
	Route::any('/specialization/index/{slug}',[SpecializationsController::class , 'admin_index']);
	Route::any('/specialization/admin_add/{slug}',[SpecializationsController::class, 'admin_add']);
	Route::any('/specialization/admin_edit/{slug}',[SpecializationsController::class, 'admin_edit']);
	Route::any('/specialization/admin_activate/{slug}',[SpecializationsController::class, 'admin_activate']);
	Route::any('/specialization/admin_deactivate/{slug}',[SpecializationsController::class, 'admin_deactivate']);
	Route::any('/specialization/admin_delete/{slug}',[SpecializationsController::class, 'admin_delete']);
	
	
});

	Route::get('/blog',[BlogsController::class , 'index']);
	Route::get('/blog/{slug}',[BlogsController::class , 'detail']);

	Route::any('/job/listing/{categorySlug?}',[JobsController::class,'listing']);
    Route::any('/job/detail/{catslug}/{slug}',[JobsController::class,'detail']);
	Route::any('/job/getSubCategory/{categoryId}',[JobsController::class,'getSubCategory']);
	
    Route::any('/course/getSpecialization/{courseid}',[CoursesController::class,'getSpecialization']);

	Route::any('/job/createJob/{isCopy?}',[JobsController::class,'createJob']);
	Route::any('/job/management',[JobsController::class,'management']);
	
	Route::any('/job/deactivate/{slug}',[JobsController::class,'deactive']);
	
	Route::any('/job/activate/{slug}',[JobsController::class,'active']);
	
	Route::any('/job/accdetail/{slug?}/{status?}',[JobsController::class,'accdetail']);
	Route::any('/job/savedjob',[JobsController::class,'shortList']);
	Route::any('/job/applied',[JobsController::class,'applied']);
	Route::any('/job/deleteShortList/{id}',[JobsController::class,'deleteShortList']);
	
		Route::any('/job/view/{slug}',[JobsController::class,'jobViewCount']);
	Route::any('/job/searchView/{slug}',[JobsController::class,'jobSearchViewCount']);
	Route::any('/job/JobSave/{slug}',[JobsController::class,'JobSave']);
	Route::any('/job/jobApplyDetail/{slug}',[JobsController::class,'jobApplyDetail']);
	Route::any('/job/applypop/{slug}',[JobsController::class,'applypop']);
	Route::any('/job/edit/{slug}',[JobsController::class,'edit']);
	Route::any('/job/updateRating/{id}/{rating}',[JobsController::class,'updateRating']);
	Route::any('/job/delete/{slug}',[JobsController::class,'delete']);
	Route::any('/job/sendmail',[JobsController::class , 'sendmail']); 
	
	Route::any('/home',[HomesController::class,'index']);
	Route::any('/homeslider',[HomesController::class,'home_slider']);
	Route::any('/sitemap',[HomesController::class,'sitemap']);

	Route::any('/page/staticpage/{slugPage}',[PagesController::class,'staticpage']);
	Route::any('/page/contact-us',[PagesController::class,'contactUs']);
	Route::any('/page/about_us',[PagesController::class,'about_us']);
	

	Route::any('/users/login',[UsersController::class,'login']);
	Route::any('/users/registration',[UsersController::class,'registration']);
	Route::any('/users/usercheck',[UsersController::class,'usercheck']);
	Route::any('/users/myaccount',[UsersController::class,'myaccount']);
	Route::any('/users/editProfile',[UsersController::class,'editProfile']);
	Route::any('/users/changePassword',[UsersController::class,'changePassword']);
	Route::any('/users/uploadPhoto',[UsersController::class,'uploadPhoto']);
    Route::any('/users/deleteAccount',[UsersController::class,'deleteAccount']);
	Route::any('/users/logout',[UsersController::class,'logout']);
	Route::any('/users/mailhistory',[UsersController::class,'mailhistory']);
	Route::any('/users/maildetail/{slug}',[UsersController::class,'maildetail']);

	Route::any('/users/export',[UsersController::class,'export']);
	Route::any('/users/import',[UsersController::class,'import']);
	
	Route::any('/users/importjobseekers',[UsersController::class,'importjobseekers']);

	Route::any('/users/generateinvoice/{slug}',[UsersController::class,'generateinvoice']);
		Route::any('/users/confirmation/{id}/{md5id}/{email}',[UsersController::class,'confirmation']);

	Route::any('/payments/history',[PaymentsController::class,'history']);
	Route::any('/payments/planpurchase',[PaymentsController::class,'planpurchase']);
	Route::any('/payments/checkoutSuccess/{slug}',[PaymentsController::class,'checkoutSuccess']);
	Route::any('/payments/cancelpayment/{slug}',[PaymentsController::class,'cancelpayment']);
	Route::any('/payments/stripepayment',[PaymentsController::class,'stripepayment']);
	
	
	
	Route::any('/payments/PayWithStripe',[PaymentsController::class,'PayWithStripe']);
	

	
	Route::any('/candidates/favorite',[CandidatesController::class,'favorite']);
	Route::any('/candidates/profile/{slug}',[CandidatesController::class,'profile']);
	Route::any('/candidates/deleteFavoriteList/{id}',[CandidatesController::class,'deleteFavorite']);
	Route::any('/candidates/companyprofile/{slug}',[CandidatesController::class,'companyprofile']);
	Route::any('/candidates/getUserdetail/{uslug}',[CandidatesController::class,'getUserdetail']);
		Route::any('/candidates/downloadCandidateCV/{uslug}',[CandidatesController::class,'downloadCandidateCV']);

	Route::any('/candidates/myaccount',[CandidatesController::class,'myaccount']);
	
	Route::any('/candidates/editEducation',[CandidatesController::class,'editEducation']);
	Route::any('/candidates/editExperience',[CandidatesController::class,'editExperience']);
	Route::any('/candidates/editProfessional',[CandidatesController::class,'editProfessional']);
	Route::any('/candidates/makecv',[CandidatesController::class,'makecv']);
	Route::any('/candidates/editcvdocuments',[CandidatesController::class,'editcvdocuments']);
	Route::any('/candidates/mailhistory',[CandidatesController::class,'mailhistory']);
	Route::any('/candidates/maildetail/{slug}',[CandidatesController::class,'maildetail']);
	Route::any('/candidates/changePassword',[CandidatesController::class,'changePassword']);
	Route::any('/candidates/uploadPhoto',[CandidatesController::class,'uploadPhoto']);
	Route::any('/candidates/editProfile',[CandidatesController::class,'editProfile']);
	Route::any('/candidates/deleteCover/{id}',[CandidatesController::class,'deleteCover']);
	Route::any('/candidates/deleteCertificate/{slug}',[CandidatesController::class,'deleteCertificate']);
	Route::any('/candidates/uploadCvLogin',[CandidatesController::class,'uploadCvLogin']);
	
	Route::any('/candidates/deleteexperience/{id}',[CandidatesController::class,'deleteexperience']);
	Route::any('/candidates/deleteprofessional/{id}',[CandidatesController::class,'deleteprofessional']);
	Route::any('/candidates/deleteeducation/{id}',[CandidatesController::class,'deleteeducation']);
	
	Route::any('/candidates/uploadmultipleimages',[CandidatesController::class,'uploadmultipleimages']);
	Route::any('/candidates/addVideoCv',[CandidatesController::class,'addVideoCv']);
 	Route::any('/candidates/deleteVideo',[CandidatesController::class,'deleteVideo']);
 	Route::any('/candidates/sendmailjobseeker/{slug}',[CandidatesController::class,'sendmailjobseeker']);
 	Route::any('/candidates/sendmailToalljobseekers',[CandidatesController::class,'sendmailToalljobseekers']);
	Route::any('/candidates/sendmailemployer/{slug}',[CandidatesController::class,'sendmailemployer']);
	Route::any('/candidates/listing',[CandidatesController::class,'listing']);
    Route::any('/candidates/addtoFavorite/{jobseekerid}',[CandidatesController::class,'addtoFavorite']);
			
	Route::any('/categories/getSubCategory/{categoryId?}',[CategoriesController::class,'getSubCategory']);
	Route::any('/categories/allcategories',[CategoriesController::class,'allcategories']);
	
	Route::any('/alerts/index',[AlertsController::class, 'index']);
	Route::any('/alerts/edit/{slug}',[AlertsController::class, 'edit']);
	Route::any('/alerts/delete/{slug}',[AlertsController::class, 'delete']);
	Route::any('/alerts/add',[AlertsController::class, 'add']);
	
	Route::any('/plans/purchase/',[PlansController::class, 'purchase']);
// 	Route::any('/candidates/resetPassword/{id}/{md5id}/{email}',[CandidatesController::class , 'resetPassword']);
	Route::post('/candidates/resetPassword',[CandidatesController::class , 'resetPassword']);
	

	// ************** App Api ************

	/////employer app

    Route::any('/users/apps_login',[UsersController::class , 'apps_login']); 
    Route::any('/users/apps_forgotPassword',[UsersController::class , 'apps_forgotPassword']); 
    Route::any('/users/forgotPassword',[UsersController::class , 'forgotPassword']);
     Route::any('/users/resetPassword',[CandidatesController::class , 'resetPassword']);
    Route::any('/users/apps_signup',[UsersController::class , 'apps_signup']); 
    Route::any('/users/apps_changepassword',[UsersController::class , 'apps_changepassword']); 
    Route::any('/users/apps_dashboard',[UsersController::class , 'apps_dashboard']); 
    Route::any('/users/apps_viewprofile',[UsersController::class , 'apps_viewprofile']); 
	Route::any('/users/apps_changeprofilepic',[UsersController::class , 'apps_changeprofilepic']); 
	Route::any('/users/apps_getlocationlist',[UsersController::class , 'apps_getlocationlist']); 
	Route::any('/users/apps_editprofile',[UsersController::class , 'apps_editprofile']); 
	Route::any('/users/apps_getplanslist',[UsersController::class , 'apps_getplanslist']); 

	Route::any('/users/apps_createJob',[UsersController::class , 'apps_createJob']); 
	Route::any('/users/apps_socialLogin',[UsersController::class , 'apps_socialLogin']); 
	Route::any('/users/apps_getJobsList',[UsersController::class , 'apps_getJobsList']); 
	Route::any('/users/apps_updateJobStatus',[UsersController::class , 'apps_updateJobStatus']); 
	Route::any('/users/apps_getJobsDetail',[UsersController::class , 'apps_getJobsDetail']); 
	Route::any('/users/apps_updateJob',[UsersController::class , 'apps_updateJob']); 
	Route::any('/users/apps_deleteJob',[UsersController::class , 'apps_deleteJob']); 
	Route::any('/users/apps_addtofavourite',[UsersController::class , 'apps_addtofavourite']); 
	Route::any('/users/apps_removetofavourite',[UsersController::class , 'apps_removetofavourite']); 
	Route::any('/users/apps_getcandidatelist',[UsersController::class , 'apps_getcandidatelist']); 
	Route::any('/users/apps_getfavouritellist',[UsersController::class , 'apps_getfavouritellist']); 
	
	Route::any('/users/apps_sendmail',[UsersController::class , 'apps_sendmail']); 
	Route::any('/users/apps_updateApplyStatus',[UsersController::class , 'apps_updateApplyStatus']); 
	Route::any('/users/apps_submitReview',[UsersController::class , 'apps_submitReview']); 
	Route::any('/users/apps_getpaymenthistory',[UsersController::class , 'apps_getpaymenthistory']); 
	Route::any('/users/apps_deleteaccount',[UsersController::class , 'apps_deleteaccount']);
	Route::any('/users/apps_candiprofile',[UsersController::class , 'apps_candiprofile']);


	
	////////candidate app
	Route::any('/candidates/apps_getpagedetail',[CandidatesController::class , 'apps_getpagedetail']); 

	Route::any('/candidates/apps_login',[CandidatesController::class , 'apps_login']); 
	Route::any('/candidates/apps_forgotPassword',[CandidatesController::class , 'apps_forgotPassword']); 
	Route::any('/candidates/apps_signup',[CandidatesController::class , 'apps_signup']); 
	Route::get('/candidates/apps_homescreen',[CandidatesController::class , 'apps_homescreen']); 
	Route::any('/candidates/apps_jobdetail/{slug?}',[CandidatesController::class , 'apps_jobdetail']); 
	Route::any('/candidates/apps_contactUs',[CandidatesController::class , 'apps_contactUs']);
	Route::any('/candidates/apps_deletesavedjob',[CandidatesController::class , 'apps_deletesavedjob']);
	Route::any('/candidates/apps_getskillslist',[CandidatesController::class , 'apps_getskillslist']);
	Route::any('/candidates/apps_getcourselist',[CandidatesController::class , 'apps_getcourselist']);
	Route::any('/candidates/apps_getspecializationlist',[CandidatesController::class , 'apps_getspecializationlist']);
	Route::any('/candidates/apps_updateSkills',[CandidatesController::class , 'apps_updateSkills']);
	Route::any('/candidates/apps_viewProfile',[CandidatesController::class , 'apps_viewProfile']);
	Route::any('/candidates/apps_addEducation',[CandidatesController::class , 'apps_addEducation']);
	Route::any('/candidates/apps_editEducation',[CandidatesController::class , 'apps_editEducation']);
	Route::any('/candidates/apps_deleteEducation',[CandidatesController::class , 'apps_deleteEducation']);
	Route::any('/candidates/apps_addExperience',[CandidatesController::class , 'apps_addExperience']);
	Route::any('/candidates/apps_editExperience',[CandidatesController::class , 'apps_editExperience']);
	Route::any('/candidates/apps_deleteExperience',[CandidatesController::class , 'apps_deleteExperience']);
	Route::any('/candidates/apps_searchjobs',[CandidatesController::class , 'apps_searchjobs']);
	Route::any('/candidates/apps_deleteaccount',[CandidatesController::class , 'apps_deleteaccount']);
	Route::any('/candidates/apps_applyforjob',[CandidatesController::class , 'apps_applyforjob']);
	Route::any('/candidates/apps_changeprofilepic',[CandidatesController::class , 'apps_changeprofilepic']);
	Route::any('/candidates/apps_getconstant',[CandidatesController::class , 'apps_getconstant']);
	Route::any('/candidates/apps_getcategorylist',[CandidatesController::class , 'apps_getcategorylist']);
	Route::any('/candidates/apps_savecoverletter',[CandidatesController::class , 'apps_savecoverletter']);
	Route::any('/candidates/apps_saveAlert',[CandidatesController::class , 'apps_saveAlert']);
	Route::any('/candidates/apps_updateAlert',[CandidatesController::class , 'apps_updateAlert']);
	Route::any('/candidates/apps_deleteAlert',[CandidatesController::class , 'apps_deleteAlert']);
	Route::any('/candidates/apps_getAlertList',[CandidatesController::class , 'apps_getAlertList']);
	Route::any('/candidates/apps_getDesignationList',[CandidatesController::class , 'apps_getDesignationList']);
	Route::any('/candidates/apps_socialLogin',[CandidatesController::class , 'apps_socialLogin']);
	Route::any('/candidates/apps_editprofile',[CandidatesController::class , 'apps_editprofile']);
	Route::any('/candidates/apps_savejob',[CandidatesController::class , 'apps_savejob']);
	Route::any('/candidates/apps_generatecv',[CandidatesController::class , 'apps_generatecv']);
	Route::any('/candidates/generatecvdoc',[CandidatesController::class , 'generatecvdoc']);
	Route::any('/candidates/apps_savecvdocument',[CandidatesController::class , 'apps_savecvdocument']);
	Route::any('/candidates/apps_purchaseplan',[CandidatesController::class , 'apps_purchaseplan']);
	Route::any('/candidates/apps_deletedocument',[CandidatesController::class , 'apps_deletedocument']);
	
	
 Route::any('/users/sendsms',[UsersController::class , 'sendsms']); 
	

	
