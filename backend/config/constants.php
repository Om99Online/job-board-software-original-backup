<?php

$servername= env('DB_HOST', '');
$username=env('DB_USERNAME', '');
$password=env('DB_PASSWORD', '');
$database=env('DB_DATABASE', '');
$currency='';
$curr='';
$theme_color='';
$theme_background='';

$conn = mysqli_connect($servername, $username, $password,$database);
$result = $conn->query('SELECT * FROM tbl_currencies where is_default=1');
$row = $result->fetch_assoc();

$currency=$row['code'];
$curr=$row['symbol'];

$result1 = $conn->query('SELECT * FROM tbl_changecolors');
$row1 = $result1->fetch_assoc();

$theme_color=$row1['theme_color'];
$theme_background=$row1['theme_background'];
$conn->close();
//echo 'here<pre> ';print_r($theme_background);

// exit;

define('HTTP_PATH','https://job-board-software.logicspice.com/job-board-script');
define('HTTP_PATH_ROUTE','https://job-board-software.logicspice.com');

define("BASE_PATH", $_SERVER['DOCUMENT_ROOT'].'/job-board-script');
$public_path=public_path();
define("BASE_PATH2",$public_path );
define('HTTP_IMAGE', HTTP_PATH . '/public/img');


define('HTTP_FAV','https://job-board-software.logicspice.com/');
define('BASE_FAV',$_SERVER['DOCUMENT_ROOT'].'/');

define('UPLOAD_PAYMENT_PDF',BASE_PATH.'/public/files/invoice/');
define('DISPLAY_PAYMENT_PDF',HTTP_PATH.'/public/files/invoice/');


if(($currency != '') && ($curr != '')){
    define('CURRENCY', $currency);
    define('CURR', $curr);
}else{
    define('CURRENCY', '$');
    define('CURR', 'USD');
}

if(($theme_color != '') && ($theme_background != '')){
    define('PRIMARY_COLOR', $theme_color);
    define('SECONDARY_COLOR', $theme_background);
}else{
    define('PRIMARY_COLOR', '#294a9c');
    define('SECONDARY_COLOR', '#f3734c');
}


define('STRIPE_KEY', 'pk_test_dRE4KNR2BxPpRbNsKFa1yRAw');
define('STRIPE_SECRET', 'sk_test_RghbAItpHxV12Nv3SUFhq0o4');

define('CAPTCHA_PUBLIC_KEY', '6Ld8bV8nAAAAAEp24xWlKsVFhVDYlBctFF50MI1x');


define('LOGO_IMAGE_UPLOAD_PATH', BASE_PATH . '/public/files/joblogo/');

define('API_KEY', 'JOB45689ASD9857ASDSCRIPT');
// define('MAP_KEY', 'AIzaSyAfLv-IdHZm0Xy3kYlAm3TypjjqeUjra9Q');
define('MAP_KEY', 'AIzaSyBqdy82sEIazQCEM3lajeKBYcYOzbJbt08');


define('PAYPAL_EMAIL', 'pradhan.ashish@logicspice.com');
define('PAYPAL_URL', 'https://www.sandbox.paypal.com/cgi-bin/webscr');
define('BRAINTREE_MERCHANT_ID','s52tpvcxfkqx4j89');
define('BRAINTREE_PUBLIC_KEY','c94s8548ft6rp88w');
define('BRAINTREE_PRIVATE_KEY','d65449d0b50f2d18abbb4b5a9ce26e59');

define('UPLOAD_CV_PATH', BASE_PATH . '/public/files/cv/');
define('DISPLAY_CV_PATH', HTTP_PATH . '/public/files/cv/');

/* Global Array to validate extentions for image upload */

global $max_size;
$max_size = array(
    '2' => 2,
    '4' => 4,
    '6' => 6,
    '8' => 8,
    '10' => 10,
);

global $extentions;
$extentions = array(
    'jpg' => 'jpg',
    'jpeg' => 'jpeg',
    'gif' => 'gif',
    'png' => 'png'
);

/* Global Array to validate extentions for video upload */
global $extentions_video;
$extentions_video = array(
    'mp4' => 'mp4',
    '3gp' => '3gp',
    'avi' => 'avi'
);

global $favextentions;
$favextentions = array(
    'ico' => 'ico',
);

/* Global Array to validate extentions for cv upload */
global $extentions_doc;
$extentions_doc = array(
    'doc' => 'doc',
    'docx' => 'docx',
    'pdf' => 'pdf'
);

define('UPLOAD_FILE',BASE_PATH.'/public/files/files/');

/* * ***************************** favicon Path ****************************** */
define('UPLOAD_FULL_FAV_PATH', BASE_FAV);
define('DISPLAY_FULL_FAV_PATH', HTTP_FAV);


/* * ***************************** Category Image Path ****************************** */
define('UPLOAD_FULL_CATEGORY_IMAGE_PATH', BASE_PATH . '/public/files/categoryimages/full/');

define('UPLOAD_THUMB_CATEGORY_IMAGE_PATH', BASE_PATH . '/public/files/categoryimages/thumb/');
define('UPLOAD_SMALL_CATEGORY_IMAGE_PATH', BASE_PATH . '/public/files/categoryimages/small/');

define('UPLOAD_FULL_CATEGORY_IMAGE_WIDTH', '');
define('UPLOAD_FULL_CATEGORY_IMAGE_HEIGHT', '');
define('UPLOAD_THUMB_CATEGORY_IMAGE_WIDTH', 200);
define('UPLOAD_THUMB_CATEGORY_IMAGE_HEIGHT', 100);
define('UPLOAD_SMALL_CATEGORY_IMAGE_WIDTH', 80);
define('UPLOAD_SMALL_CATEGORY_IMAGE_HEIGHT', 100);

define('DISPLAY_FULL_CATEGORY_IMAGE_PATH', HTTP_PATH . '/public/files/categoryimages/full/');
define('DISPLAY_THUMB_CATEGORY_IMAGE_PATH', HTTP_PATH . '/public/files/categoryimages/thumb/');
define('DISPLAY_SMALL_CATEGORY_IMAGE_PATH', HTTP_PATH . '/public/files/categoryimages/small/');

/* * ***************************** Blog Path ****************************** */
define('UPLOAD_FULL_BLOG_PATH', BASE_PATH . '/public/files/blog/full/');

define('UPLOAD_THUMB_BLOG_PATH', BASE_PATH . '/public/files/blog/thumb/');
define('UPLOAD_SMALL_BLOG_PATH', BASE_PATH . '/public/files/blog/small/');

define('UPLOAD_FULL_BLOG_WIDTH', '');
define('UPLOAD_FULL_BLOG_HEIGHT', '');
define('UPLOAD_THUMB_BLOG_WIDTH', 200);
define('UPLOAD_THUMB_BLOG_HEIGHT', '');
define('UPLOAD_SMALL_BLOG_WIDTH', 80);
define('UPLOAD_SMALL_BLOG_HEIGHT', '');

define('DISPLAY_FULL_BLOG_PATH', HTTP_PATH . '/public/files/blog/full/');
define('DISPLAY_THUMB_BLOG_PATH', HTTP_PATH . '/public/files/blog/thumb/');
define('DISPLAY_SMALL_BLOG_PATH', HTTP_PATH . '/public/files/blog/small/');

// Defining images path for slider images

define('UPLOAD_FULL_SLIDER_IMAGE_PATH', BASE_PATH . '/public/files/slider/full/');
define('UPLOAD_THUMB_SLIDER_IMAGE_PATH', BASE_PATH . '/public/files/slider/thumb/');

define('UPLOAD_THUMB_SLIDER_IMAGE_WIDTH', 150);
define('UPLOAD_THUMB_SLIDER_IMAGE_HEIGHT', '');

define('UPLOAD_FULL_SLIDER_IMAGE_WIDTH', '');
define('UPLOAD_FULL_SLIDER_IMAGE_HEIGHT', '');

define('DISPLAY_FULL_SLIDER_IMAGE_PATH', HTTP_PATH . '/public/files/slider/full/');
define('DISPLAY_THUMB_SLIDER_IMAGE_PATH', HTTP_PATH . '/public/files/slider/thumb/');

/* * ***************************** Job Logo Path ****************************** */
define('UPLOAD_JOB_LOGO_PATH', BASE_PATH . '/public/files/joblogo/');
define('UPLOAD_JOB_LOGO_WIDTH', 200);
define('UPLOAD_JOB_LOGO_HEIGHT', '');
define('DISPLAY_JOB_LOGO_PATH', HTTP_PATH . '/public/files/joblogo/');

define('MAIL_FROM', 'info@jobboarddemo@logicspice.in');
define('SITE_TITLE', 'Job Board Software');
define('SITE_LINK', HTTP_PATH);
define('SITE_URL', HTTP_PATH);
define('LOGO_PATH', HTTP_PATH . '/public/files/joblogo/logo.png');
define('DEFAULT_LANGUAGE', 'en');

/* * ***************************** Employer Path ****************************** */
define('UPLOAD_EMPLOYER_IMAGES_PATH', BASE_PATH . '/public/files/user/employer/');
define('DISPLAY_EMPLOYER_IMAGES_PATH', HTTP_PATH . '/public/files/user/employer/');

// define('DISPLAY_FULL_PROFILE_IMAGE_PATH', HTTP_PATH . '/public/files/user/full/');
// define('DISPLAY_THUMB_PROFILE_IMAGE_PATH', HTTP_PATH . '/public/files/user/thumb/');
// define('DISPLAY_SMALL_PROFILE_IMAGE_PATH', HTTP_PATH . '/public/files/user/small/');

// Defining images path for Banner Advertisement

define('UPLOAD_FULL_BANNER_AD_IMAGE_PATH', BASE_PATH . '/public/files/bannerad/full/');
define('UPLOAD_THUMB_BANNER_AD_IMAGE_PATH', BASE_PATH . '/public/files/bannerad/thumb/');

define('UPLOAD_THUMB_BANNER_AD_IMAGE_WIDTH', 150);
define('UPLOAD_THUMB_BANNER_AD_IMAGE_HEIGHT', '');

define('UPLOAD_FULL_BANNER_AD_IMAGE_WIDTH', '');
define('UPLOAD_FULL_BANNER_AD_IMAGE_HEIGHT', '');

define('DISPLAY_FULL_BANNER_AD_IMAGE_PATH', HTTP_PATH . '/public/files/bannerad/full/');
define('DISPLAY_THUMB_BANNER_AD_IMAGE_PATH', HTTP_PATH . '/public/files/bannerad/thumb/');

/* * ***************************** Website Logo Path ****************************** */
define('UPLOAD_FULL_WEBSITE_LOGO_PATH', BASE_PATH . '/public/files/websitelogo/full/');

define('UPLOAD_THUMB_WEBSITE_LOGO_PATH', BASE_PATH . '/public/files/websitelogo/thumb/');
define('UPLOAD_SMALL_WEBSITE_LOGO_PATH', BASE_PATH . '/public/files/websitelogo/small/');

define('UPLOAD_FULL_WEBSITE_LOGO_WIDTH', 285);
define('UPLOAD_FULL_WEBSITE_LOGO_HEIGHT', 50);
define('UPLOAD_THUMB_WEBSITE_LOGO_WIDTH', 200);
define('UPLOAD_THUMB_WEBSITE_LOGO_HEIGHT', '');
define('UPLOAD_SMALL_WEBSITE_LOGO_WIDTH', 80);
define('UPLOAD_SMALL_WEBSITE_LOGO_HEIGHT', '');

define('DISPLAY_FULL_WEBSITE_LOGO_PATH', HTTP_PATH . '/public/files/websitelogo/full/');
define('DISPLAY_THUMB_WEBSITE_LOGO_PATH', HTTP_PATH . '/public/files/websitelogo/thumb/');
define('DISPLAY_SMALL_WEBSITE_LOGO_PATH', HTTP_PATH . '/public/files/websitelogo/small/');

/* * ***************************** User Image Path ****************************** */
define('UPLOAD_FULL_PROFILE_IMAGE_PATH', BASE_PATH . '/public/files/user/full/');

define('UPLOAD_THUMB_PROFILE_IMAGE_PATH', BASE_PATH . '/public/files/user/thumb/');
define('UPLOAD_SMALL_PROFILE_IMAGE_PATH', BASE_PATH . '/public/files/user/small/');

define('UPLOAD_FULL_PROFILE_IMAGE_WIDTH', '');
define('UPLOAD_FULL_PROFILE_IMAGE_HEIGHT', '');
define('UPLOAD_THUMB_PROFILE_IMAGE_WIDTH', 200);
define('UPLOAD_THUMB_PROFILE_IMAGE_HEIGHT', '');
define('UPLOAD_SMALL_PROFILE_IMAGE_WIDTH', 80);
define('UPLOAD_SMALL_PROFILE_IMAGE_HEIGHT', '');

define('UPLOAD_FULL_PROFILE_LOGO_IMAGE_WIDTH', 1260);
define('UPLOAD_FULL_PROFILE_LOGO_IMAGE_HEIGHT', 264);

define('DISPLAY_FULL_PROFILE_IMAGE_PATH', HTTP_PATH . '/public/files/user/full/');
define('DISPLAY_THUMB_PROFILE_IMAGE_PATH', HTTP_PATH . '/public/files/user/thumb/');
define('DISPLAY_SMALL_PROFILE_IMAGE_PATH', HTTP_PATH . '/public/files/user/small/');

/* * ***************************** resume Path ****************************** */
define('DISPLAY_RESUME_PATH', HTTP_PATH . '/public/files/resumes/');
define('UPLOAD_RESUME_PATH', BASE_PATH . '/public/files/resumes/');

/* * ***************************** mail Path ****************************** */
define('DISPLAY_MAIL_PATH', HTTP_PATH . '/public/files/mail/');
define('UPLOAD_MAIL_PATH', BASE_PATH . '/public/files/mail/');

define('DISPLAY_VIDEO_PATH', HTTP_PATH . '/public/files/video/');
define('UPLOAD_VIDEO_PATH', BASE_PATH . '/public/files/video/');

define('UPLOAD_CERTIFICATE_PATH', BASE_PATH . '/public/files/certificates/');
define('DISPLAY_CERTIFICATE_PATH', HTTP_PATH . '/public/files/certificates/');


global $sallery;
$sallery = array('0-1000' => '<'.CURRENCY.' 1000', '1000-2000' => CURRENCY.' 1000 To '.CURRENCY.'2000', '2000-3000' => CURRENCY.' 2000 To '.CURRENCY.'3000', '4000-5000' => CURRENCY.' 4000 To '.CURRENCY.'5000', '5000-7000' => CURRENCY.' 5000 To '.CURRENCY.'7000', '7000-10000' => CURRENCY.' 7000 To '.CURRENCY.'10000'
    , '10000-12000' => CURRENCY.' 10000 To '.CURRENCY.'12000', '12000-15000' => CURRENCY.' 12000 To '.CURRENCY.'15000', '15000-20000' => CURRENCY.' 15000 To '.CURRENCY.'20000', '20000-25000' => CURRENCY.' 20000 To '.CURRENCY.'25000', '25000-30000' => CURRENCY.' 25000 To '.CURRENCY.'30000', '30000-1000000' => '>'.CURRENCY.' 30000');

global $salleryMin;
$salleryMin = array('0-1000' => '<'.CURRENCY.' 1000', '1-2' => CURRENCY.' 1000 To '.CURRENCY.'2000', '2-3' => CURRENCY.' 2000 To '.CURRENCY.'3000', '4-5' => CURRENCY.' 4000 To '.CURRENCY.'5000', '5-7' => CURRENCY.' 5000 To '.CURRENCY.'7000', '7-10' => CURRENCY.' 7000 To '.CURRENCY.'10000'
    , '10-12' => CURRENCY.' 10000 To '.CURRENCY.'12000', '12-15' => CURRENCY.' 12000 To '.CURRENCY.'15000', '15-20' => CURRENCY.' 15000 To '.CURRENCY.'20000', '20-25' => CURRENCY.' 20000 To '.CURRENCY.'25000', '25-30' => CURRENCY.' 25000 To '.CURRENCY.'30000', '30-1000' => '>'.CURRENCY.' 30000');

$currentYear = date("Y");

// Initialize an empty array to store years
global $yearsArray;
$yearsArray = array();

// Loop from the current year to 1980
for ($year = 2024; $year >= 1980; $year--) {
    // Add each year to the array
    $yearsArray[] = $year;
}

global $experienceArray;
$experienceArray = array(
    '0-1' => 'Less than 1 Year',
    '1-2' => '1+ to 2 Years',
    '2-5' => '2+ to 5 Years',
    '2-5' => '2+ to 5 Years',
    '5-7' => '5+ to 7 Years',
    '7-10' => '7+ to 10 Years',
    '10-15' => '10+ to 15 Years',
    '15-35' => 'More than 15 Years',
);

global $worktype;
$worktype = array(
    '1' => 'Full Time',
    '2' => 'Part Time',
    '3' => 'Casual',
    '4' => 'Seasonal',
    '5' => 'Fixed Term',
);

global $planFeatuersMax;
$planFeatuersMax = array(
    '1' => '50000',
    '2' => '1000000',
    '4' => '1000000',
    '5' => '1000000',
);

global $planType;
$planType = array(
    'Years' => 'Yearly',
    'Months' => 'Monthly',
);
global $planFeatuers;
$planFeatuers = array(
    '1' => 'Number of Job Post',
    '2' => 'Number of resume download',
    '3' => 'Access candidate search functionality',
    '4' => 'Number of Job Apply',
    '5' => 'Number of Candidate Profile Views',
);

global $planFeatuersDis;
$planFeatuersDis = array(
    '1' => 'Job Post',
    '2' => 'Resume Download',
    '3' => 'Access Candidate Searching',
    '4' => 'Job Apply',
    '5' => 'Candidates Profile View',
);
global $planFeatuersHelpText;
$planFeatuersHelpText = array(
    '1' => 'You can post [!JOBS!] jobs within [!TIME!]',
    '2' => 'You can download [!RESUME!] Resume under this plan within [!TIME!]',
    '3' => 'You can access candidate search functionality to filter best candidate for your job',
    '5' => 'You can view the candidate profile for all the information.'
);

global $monthName;
$monthName = array(
    '1' => 'January',
    '2' => 'February',
    '3' => 'March',
    '4' => 'April',
    '5' => 'May',
    '6' => 'June',
    '7' => 'July',
    '8' => 'August',
    '9' => 'September',
    '10' => 'October',
    '11' => 'November',
    '12' => 'December',
);

global $totalexperienceArray;
$totalexperienceArray = array(
    '0' => 'Less than 1 Year',
    '1' => '1 Years',
    '2' => '2 Years',
    '3' => '3 Years',
    '4' => '4 Years',
    '5' => '5 Years',
    '6' => '6 Years',
    '7' => '7 Years',
    '8' => '8 Years',
    '9' => '9 Years',
    '10' => '10+ Years',
    '15' => '15+ Years',
);

global $active_option;
$active_option = array('short_list' => 'Shortlist', 'interview' => 'Interview', 'offer' => 'Offer', 'accept' => 'Accept', 'not_suitable' => 'Not suitable');


global $subadminAccess;
$subadminAccess = array(
    0 => array(
        'name' => 'Manage Employers',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    1 => array(
        'name' => 'Manage Designations',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    2 => array(
        'name' => 'Manage Jobseekers',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    3 => array(
        'name' => 'Manage Jobs',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    4 => array(
        'name' => 'Manage Currencies',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    5 => array(
        'name' => 'Manage Courses',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    6 => array(
        'name' => 'Manage Blogs',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    7 => array(
        'name' => 'Manage Categories',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    8 => array(
        'name' => 'Manage Skills',
        'Add' => 0,
        'Edit' => 0,
        'Delete' => 0,
        'Module' => 0,
    ),
    9 => array(
        'name' => 'Manage Pages',
        'Edit' => 0,
        'Module' => 0,
    ),
    10 => array(
        'name' => 'Manage Email Template List',
        'Edit' => 0,
        'Module' => 0,
    ),
    
);



?>