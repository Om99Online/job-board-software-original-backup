import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
  } from "react-router-dom";
  import "./App.css";
  import UserPage from "./Components/home/UserPage";
  import AboutUs from "./Components/aboutUs/AboutUs";
  import Faq from "./Components/faq/Faq";
  import BlogPage from "./Components/blog/BlogPage";
  import DynamicBlogPage from "./Components/blog/DynamicBlogPage";
  import SearchJobPage from "./Components/searchJob/SearchJobPage";
  import Contact from "./Components/contactUs/Contact";
  import CreateJob from "./Components/employersSide/CreateJob";
  import ManageJob from "./Components/employersSide/ManageJob";
  import CopyJob from "./Components/employersSide/CopyJob";
  import FavouriteList from "./Components/employersSide/FavouriteList";
  import PaymentHistory from "./Components/employersSide/PaymentHistory";
  import MailHistory from "./Components/employersSide/MailHistory";
  import MailDetail from "./Components/employersSide/MailDetail";
  import MyProfile from "./Components/employersSide/MyProfile";
  import EditProfile from "./Components/employersSide/EditProfile";
  import ChangePassword from "./Components/employersSide/ChangePassword";
  import ChangeLogo from "./Components/employersSide/ChangeLogo";
  import EmployerLogin from "./Components/login/EmployerLogin";
  import JobseekerLogin from "./Components/login/JobseekerLogin";
  import ImportJobseekers from "./Components/employersSide/ImportJobseekers";
  import JobDescription from "./Components/element/JobDescription";
  import AllCategoryPage from "./Components/home/AllCategoryPage";
  import CompanyProfile from "./Components/home/CompanyProfile";
  import InnerAccountdetail from "./Components/employersSide/InnerAccountdetail";
  import JSEditProfile from "./Components/jobseekersSide/JSEditProfile";
  import JSMyProfile from "./Components/jobseekersSide/JSMyProfile";
  import JSEducation from "./Components/jobseekersSide/JSEducation";
  import JSExperience from "./Components/jobseekersSide/JSExperience";
  import JSProfessionalRegistration from "./Components/jobseekersSide/JSProfessionalRegistration";
  import JSVideoCV from "./Components/jobseekersSide/JSVideoCV";
  import JSMakeCV from "./Components/jobseekersSide/JSMakeCV";
  import JSAddDocuments from "./Components/jobseekersSide/JSAddDocument";
  
  import JSPaymentHistory from "./Components/jobseekersSide/JSPaymentHistory";
  import JSManageAlerts from "./Components/jobseekersSide/JSManageAlerts";
  import JSSavedJobs from "./Components/jobseekersSide/JSSavedJobs";
  import JSAppliedJobs from "./Components/jobseekersSide/JSAppliedJobs";
  import JSMailHistory from "./Components/jobseekersSide/JSMailHistory";
  import JSChangePassword from "./Components/jobseekersSide/JSChangePassword";
  import JSChangePhoto from "./Components/jobseekersSide/JSChangePhoto";
  import JSEditAlert from "./Components/jobseekersSide/JSEditAlert";
  import JSMailDetail from "./Components/jobseekersSide/JSMailDetail";
  import FavouriteListProfile from "./Components/employersSide/FavouriteListProfile";
  import JSAddAlert from "./Components/jobseekersSide/JSAddAlert";
  import EmployerRegister from "./Components/register/EmployerRegister";
  import JobseekerRegister from "./Components/register/JobseekerRegister";
  import APChangeUsername from "./Components/adminpanel/Configuration/APChangeUsername";
  import APChangePassword from "./Components/adminpanel/Configuration/APChangePassword";
  import APChangeEmail from "./Components/adminpanel/Configuration/APChangeEmail";
  import InnerMembershipPlan from "./Components/employersSide/InnerMembershipPlan";
  import APSecurityQuestions from "./Components/adminpanel/Configuration/APSecurityQuestions";
  import APSetContactAddress from "./Components/adminpanel/Configuration/APSetContactAddress";
  import APSloganText from "./Components/adminpanel/Configuration/APSloganText";
  import APChangeLogo from "./Components/adminpanel/Configuration/APChangeLogo";
  import APChangePaymentDetail from "./Components/adminpanel/Configuration/APChangePaymentDetail";
  import APChangeFavicon from "./Components/adminpanel/Configuration/APChangeFavicon";
  import APMetaManagement from "./Components/adminpanel/Configuration/APMetaManagement";
  import APSMTPsettings from "./Components/adminpanel/Configuration/APSMTPsettings";
  import APSiteSetting from "./Components/adminpanel/Setting/APSiteSetting";
  import APManageEmailSetting from "./Components/adminpanel/Setting/APManageEmailSetting";
  import APAddEmployer from "./Components/adminpanel/Employers/APAddEmployer";
  import APEmployerList from "./Components/adminpanel/Employers/APEmployerList";
  import APAddJobseekers from "./Components/adminpanel/Jobseekers/APAddJobseekers";
  import APAddCategory from "./Components/adminpanel/Categories/APAddCategory";
  import APAddSwearWords from "./Components/adminpanel/Swearwords/APAddSwearWords";
  import APAddSkills from "./Components/adminpanel/Skills/APAddSkills";
  import DetailEditInner from "./Components/employersSide/DetailEditInner";
  import PrivacyPolicy from "./Components/element/PrivacyPolicy";
  import SiteMap from "./Components/element/SiteMap";
  import TermsConditions from "./Components/element/TermsConditions";
  import Companies from "./Components/element/Companies";
  import CareerTools from "./Components/element/CareerTools";
  import CareerResources from "./Components/element/CareerResources";
  import Benefits from "./Components/element/Benefits";
  import HowItWorks from "./Components/howItWorks/HowItWorks";
  import AdminLogin from "./Components/adminpanel/login/AdminLogin";
  import Dashboard from "./Components/adminpanel/Dashboard/Dashboard";
  import APAddSubAdmin from "./Components/adminpanel/Configuration/APAddSubAdmin";
  import APManageSubAdmins from "./Components/adminpanel/Configuration/APManageSubAdmins";
  import APManagePlans from "./Components/adminpanel/Configuration/APManagePlans";
  import APEditSubAdmin from "./Components/adminpanel/Configuration/APEditSubAdmin";
  import APAddPlan from "./Components/adminpanel/Configuration/APAddPlan";
  import HomePageSlider from "./Components/adminpanel/Employers/HomePageSlider";
  import APJobseekerList from "./Components/adminpanel/Jobseekers/APJobseekersList";
  import APEditEmailSetting from "./Components/adminpanel/Setting/APEditEmailSetting";
  import APEditEmployer from "./Components/adminpanel/Employers/APAddEmployer";
  import APManageCertificate from "./Components/adminpanel/Jobseekers/APManageCertificate";
  import APAppliedJobsList from "./Components/adminpanel/Jobseekers/APAppliedJobsList";
  import APAddSubCategory from "./Components/adminpanel/Categories/APAddSubCategory";
  import APCategoryList from "./Components/adminpanel/Categories/CategoryList";
  import SubCategoryList from "./Components/adminpanel/Categories/SubCategoryList";
  import APEditSubCategory from "./Components/adminpanel/Categories/APEditSubCategory";
  import APEditCategory from "./Components/adminpanel/Categories/APEditCategory";
  import APSwearWordsList from "./Components/adminpanel/Swearwords/APSwearWordsList";
  import APEditSwearWords from "./Components/adminpanel/Swearwords/APEditSwearWords";
  import APEditSkills from "./Components/adminpanel/Skills/APEditSkills";
  import APSkillsList from "./Components/adminpanel/Skills/APSkillsList";
  import APDesignationsList from "./Components/adminpanel/Designations/APDesignationsList";
  import APAddDesignations from "./Components/adminpanel/Designations/APAddDesignations";
  import APEditDesignations from "./Components/adminpanel/Designations/APEditDesignations";
  import APCurrencyList from "./Components/adminpanel/Currency/APCurrencyList";
  import APAddCurrency from "./Components/adminpanel/Currency/APAddCurrency";
  import APEditCurrency from "./Components/adminpanel/Currency/APEditCurrency";
  import APBannerList from "./Components/adminpanel/Banner Advertisement/APBannerList";
  import APAddBanner from "./Components/adminpanel/Banner Advertisement/APAddBanner";
  import APEditBanner from "./Components/adminpanel/Banner Advertisement/APEditBanner";
  import APCourseList from "./Components/adminpanel/Course/APCourseList";
  import APAddCourse from "./Components/adminpanel/Course/APAddCourse";
  import APEditCourse from "./Components/adminpanel/Course/APEditCourse";
  import APSpecializationList from "./Components/adminpanel/Course/APSpecializationList";
  import APAddSpecialization from "./Components/adminpanel/Course/APAddSpecialization";
  import APBlogList from "./Components/adminpanel/Blogs/APBlogList";
  import APAddBlog from "./Components/adminpanel/Blogs/APAddBlog";
  import APEditBlog from "./Components/adminpanel/Blogs/APEditBlog";
  import APSliderList from "./Components/adminpanel/Sliders/APSliderList";
  import APAddSlider from "./Components/adminpanel/Sliders/APAddSlider";
  import APEditSlider from "./Components/adminpanel/Sliders/APEditSlider";
  import APAnnouncementList from "./Components/adminpanel/Announcements/APAnnouncementList";
  import APAddAnnouncement from "./Components/adminpanel/Announcements/APAddAnnouncement";
  import APEditAnnouncement from "./Components/adminpanel/Announcements/APEditAnnouncement";
  import APTransactionList from "./Components/adminpanel/Payment History/APTransactionList";
  import APTextPages from "./Components/adminpanel/Contents/APTextPages";
  import APEditPageDetail from "./Components/adminpanel/Contents/APEditPageDetail";
  import APSearchKeywordList from "./Components/adminpanel/Keywords/APSearchKeywordList";
  import APAddSearchKeyword from "./Components/adminpanel/Keywords/APAddSearchKeyword";
  import APEditSearchKeyword from "./Components/adminpanel/Keywords/APEditSearchKeyword";
  import APJobKeywordList from "./Components/adminpanel/Keywords/APJobKeywordList";
  import APAddJobKeyword from "./Components/adminpanel/Keywords/APAddJobKeyword";
  import APEditJobKeyword from "./Components/adminpanel/Keywords/APEditJobKeyword";
  import APRequestedKeywordList from "./Components/adminpanel/Keywords/APRequestedKeywordList";
  import APJobsList from "./Components/adminpanel/Jobs/APJobsList";
  import APAddJob from "./Components/adminpanel/Jobs/APAddJob";
  import APEditJob from "./Components/adminpanel/Jobs/APEditJob";
  import APInternalJobList from "./Components/adminpanel/Jobs/APInternalJobList";
  import APCopyJob from "./Components/adminpanel/Jobs/APCopyJob";
  import APImportJob from "./Components/adminpanel/Jobs/APImportJob";
  import APAutoJobImportList from "./Components/adminpanel/Jobs/APAutoJobImportList";
  import APNewsletterList from "./Components/adminpanel/Manage Newsletter/APNewsletterList";
  import APAddNewsletter from "./Components/adminpanel/Manage Newsletter/APAddNewsletter";
  import APEditNewsletter from "./Components/adminpanel/Manage Newsletter/APEditNewsletter";
  import APSendNewsLetterEmail from "./Components/adminpanel/Manage Newsletter/APSendNewsLetterEmail";
  import APEmailLogs from "./Components/adminpanel/Manage Newsletter/APEmailLogs";
  import APUnsubscribeUserlist from "./Components/adminpanel/Manage Newsletter/APUnsubscribeUserlist";
  import APEditJobseeker from "./Components/adminpanel/Jobseekers/APEditJobseeker";
  import Jobseekers from "./Components/employersSide/Jobseekers";
  import APEmailTemplateSetting from "./Components/adminpanel/Email Templates/APEmailTemplateSetting";
  import APEditEmployerDetails from "./Components/adminpanel/Employers/APEditEmployerDetails";
  import APEditSpecializations from "./Components/adminpanel/Course/APEditSpecializations";
  import APEditPlan from "./Components/adminpanel/Configuration/APEditPlan";
  import APManageRoles from "./Components/adminpanel/Configuration/APManageRoles";
  import APEditEmailTemplate from "./Components/adminpanel/Email Templates/APEditEmailTemplate";
  import { useEffect, useState } from "react";
  import Cookies from "js-cookie";
  import Error from "./Components/element/Error";
  import BaseApi from "./Components/api/BaseApi";
  import axios from "axios";
  import APChangeColorTheme from "./Components/adminpanel/Configuration/APChangeColorTheme";
  import APHomePageSlider from "./Components/adminpanel/Employers/APHomePageSlider";
  import Swal from "sweetalert2";
  import BlankPage from "./Components/element/BlankPage";
  import JSDeleteAccount from "./Components/jobseekersSide/JSDeleteAccount";
  import MyProfileNew from "./Components/employersSide/MyProfileNew";
  import DeleteAccount from "./Components/employersSide/DeleteAccount";
  import Success from "./Components/element/Success";
  import CheckoutForm from "./Components/element/CheckoutForm";
  import PaymentOption from "./Components/element/PaymentOption";
  import ForgotPassword from "./Components/element/ForgotPassword";
  import ResetPassword from "./Components/element/ResetPassword";
  import APNewImportJob from "./Components/adminpanel/Jobs/APNewImportJob";
  import APImportJobUpdated from "./Components/adminpanel/Jobs/APImportJobUpdated";
  import APImportJobElements from "./Components/adminpanel/Jobs/APImportJobElements";
  
  
  
  function App() {
    const [adminAuthentication, setAdminAuthentication] = useState(false);
    const [employerAuthentication, setEmployerAuthentication] = useState(false);
    const [jobseekerAuthentication, setJobseekerAuthentication] = useState(false);
  
    const tokenKey = Cookies.get("token");
    const adminID = Cookies.get("adminID");
    const userType = Cookies.get("user_type");
    const tokenClient = Cookies.get("tokenClient");
  
    const checkAdminLogin = () => {
      if (adminID != null && tokenKey != null) {
        setAdminAuthentication(true);
      }
    };
  
    const checkEmployerLogin = () => {
      if (userType === "recruiter" && tokenClient) {
        setEmployerAuthentication(true);
        setJobseekerAuthentication(false);
      }
    };
  
    const checkJobseekerLogin = () => {
      if (userType === "candidate" && tokenClient) {
        setJobseekerAuthentication(true);
        setEmployerAuthentication(false);
      }
    };
  
    const getConstantData = async () => {
      try {
        const response = await axios.get(BaseApi + '/getconstant');
        const responseData = response.data.response;
        // Set cookies
        Cookies.set('siteLogo', responseData.site_logo);
        Cookies.set('siteLink', responseData.site_link);
        Cookies.set('siteTitle', responseData.site_title); // Store site title in cookies
        Cookies.set('siteFavicon', responseData.site_favicon);
        Cookies.set('siteEmail', responseData.site_email);
        Cookies.set('captchaKey', responseData.captcha_public_key);
        Cookies.set('primaryColor', responseData.primary_color);
        Cookies.set('secondaryColor', responseData.secondary_color);
        Cookies.set('mapKey', responseData.map_key);
        Cookies.set('curr', responseData.curr);
    
        // Set document title
        document.title = responseData.site_title;
      } catch (error) {
        console.log('Error getting constant information:', error);
      }
    };
  
    const getMeteData = async () => {
      try {
        const response = await axios.get(BaseApi + "/getMetaData");
  
        console.log(response.data.response);
  
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription) {
          metaDescription.content = response.data.response.default_description;
        }
  
        const metaKeyword = document.querySelector('meta[name="keyword"]');
        if (metaKeyword) {
          metaKeyword.content = response.data.response.default_keyword;
        }
  
        Cookies.set("default_title", response.data.response.default_title);
        Cookies.set("default_keyword", response.data.response.default_keyword);
        Cookies.set(
          "default_description",
          response.data.response.default_description
        );
      } catch (error) {
        console.log("Error getting meta data");
      }
    };
  
    useEffect(() => {
      getConstantData();
      getMeteData();
      checkAdminLogin();
      checkEmployerLogin();
      checkJobseekerLogin();
    }, []);
  
    useEffect(() => {
      const url = window.location.href;
      const baseApi = window.location.origin;
  
      if (url.includes("/users/confirmation")) {
        // console.log("The URL contains email link.");
        let actualURLFirstPart = `/users`;
        let secondURLfetch = url.split("/users");
        let actualURLSecondPart = secondURLfetch[1];
  
        let actualURL = actualURLFirstPart + actualURLSecondPart;
        console.log(actualURL);
        // window.location.href = actualURL;
        handleMailURL(actualURL);
  
        // console.log(actualURLSecondPart);
      }
      if (url.includes("/candidates/resetPassword")) {
        console.log("The URL contains reset link.");
        let URLSplit = url.split("/candidates/resetPassword"); // This is spliting the total URL into two parts from /candidates. The left side of /candidates has the BASE API and the right side has the remaining link.
        let URLRightPart = URLSplit[1]; // Here the acctual part of the link is achieved, that is the right part of the link. Now we need to get data from this part of the link
  
        console.log(URLRightPart);
  
        // Remove the leading "/" and split the URL by "/"
        const parts = URLRightPart.slice(1).split("/");
  
        // Extract values
        const id = parts[0];
        const md5id = parts[1];
        const email = parts[2];
  
        console.log("id:", id);
        console.log("mdid:", md5id);
        console.log("email:", email);
  
        // Construct the URL using the dynamic base API
        const resetPasswordURL = `${BaseApi}/users/resetPassword/${id}/${md5id}/${email}`;
  
        console.log(resetPasswordURL);
  
        // Use the constructed URL
        window.location.href = resetPasswordURL;
  
        // window.location.href = `/users/resetPassword/${id}/${md5id}/${email}`;
      }
    }, []);
  
    const [mailURLData, setMailURLData] = useState([]);
  
    const handleMailURL = async (url) => {
      try {
        const response = await axios.post(BaseApi + url);
        // navigate(response.data.response.url)
        if (response.data.status === 200) {
          Swal.fire({
            title: response.data.message,
            icon: "success",
            confirmButtonText: "Close",
          });
          // Wait for 3 seconds and then redirect
          setTimeout(() => {
            window.location.href = response.data.response.url;
          }, 2000);
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
  
        setMailURLData(response);
      } catch (error) {
        console.log("Error hitting mail URL Api", error);
      }
    };
  
  
  
    const [faviconURL, setFaviconURL] = useState('');
  
    useEffect(() => {
      const fetchFavicon = async () => {
        try {
          const response = await axios.get(BaseApi + "/getconstant");
          const faviconUrl = response.data.response.site_favicon;
  
          // Create a new link element for the favicon
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = faviconUrl;
  
          // Update the HTML head with the new favicon link
          document.head.appendChild(link);
  
          // Set the favicon URL state
          setFaviconURL(faviconUrl);
        } catch (error) {
          console.error('Error fetching favicon URL:', error);
        }
      };
  
      fetchFavicon();
    }, []);
  
    return (
      <>
        <Router>
          <Routes>
  
  
            <Route
              path="/admin/jobs/importlistxml"
              element={<APImportJobUpdated />}
            />
  
            <Route
              path="/admin/jobs/importlistupdated"
              element={<APImportJobElements />}
            />
  
  
            <Route
              path="/users/confirmation/:slug1/:slug2/:slug3"
              element={<BlankPage />}
            />
            <Route
              path="//candidates/resetPassword/:slug1/:slug2/:slug3"
              element={<BlankPage />}
            />
  
            {/* Stripe */}
            <Route path="/paymentwithstripe/success" element={<Success />} />
            <Route
              path="/paymentwithstripe/checkout"
              element={<CheckoutForm />}
            />
            <Route
              path="/payment/paymentoption/:slug"
              element={<PaymentOption />}
            />
  
            <Route path="*" element={<Error />} />
            <Route path="/" element={<UserPage />} />
            <Route path="/aboutus" element={<AboutUs />} />
            {/* <Route path="/aboutus" element={<Suspense fallback={<Loading />}><AboutUs /></Suspense>} /> */}
  
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/dynamicblogpage/:slug" element={<DynamicBlogPage />} />
            <Route path="/searchjob" element={<SearchJobPage />} />
            <Route path="/jobs/searchjob/:slug" element={<SearchJobPage />} />
            <Route
              path="/jobdescription/:slug/:catslug"
              element={<JobDescription />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/allcategory" element={<AllCategoryPage />} />
            <Route path="/companyprofile/:slug" element={<CompanyProfile />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/sitemap" element={<SiteMap />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/career-tools" element={<CareerTools />} />
            <Route path="/career-resources" element={<CareerResources />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/terms_and_conditions" element={<TermsConditions />} />
  
            {/* Employer Authentication */}
            {employerAuthentication ? (
              <Route
                path="/user/employerlogin"
                element={<Navigate to="/user/myprofile" />}
              />
            ) : (
              <Route path="/user/employerlogin" element={<EmployerLogin />} />
            )}
            {employerAuthentication ? (
              <Route
                path="/user/jobseekerlogin"
                element={<Navigate to="/user/myprofile" />}
              />
            ) : (
              <Route path="/user/employerlogin" element={<EmployerLogin />} />
            )}
  
            {/* Authentication for Jobseeker Login */}
            {jobseekerAuthentication ? (
              <Route
                path="/user/jobseekerlogin"
                element={<Navigate to="/candidates/myaccount" />}
              />
            ) : (
              <Route path="/user/jobseekerlogin" element={<JobseekerLogin />} />
            )}
            {jobseekerAuthentication ? (
              <Route
                path="/user/employerlogin"
                element={<Navigate to="/candidates/myaccount" />}
              />
            ) : (
              <Route path="/user/jobseekerlogin" element={<JobseekerLogin />} />
            )}
  
            {/* <Route path="/user/employerlogin" element={<EmployerLogin />} /> */}
  
            {/* <Route path="/user/jobseekerlogin" element={<JobseekerLogin />} /> */}
  
            <Route
              path="/user/register/employer"
              element={<EmployerRegister />}
            />
            <Route
              path="/user/register/jobseeker"
              element={<JobseekerRegister />}
            />
            <Route path="/users/forgotPassword" element={<ForgotPassword />} />
            <Route
              path="/users/resetPassword/:slug1/:slug2/:slug3"
              element={<ResetPassword />}
            />
            <Route path="/candidates/listing" element={<Jobseekers />} />
            <Route path="/user/createjob" element={<CreateJob />} />
            <Route path="/user/managejob" element={<ManageJob />} />
            <Route
              path="/user/managejob/accdetail/:slug"
              element={<InnerAccountdetail />}
            />
            <Route path="/job/edit/:slug" element={<DetailEditInner />} />
            <Route path="/jobs/createJob/:slug" element={<CopyJob />} />
            <Route path="/user/paymenthistory" element={<PaymentHistory />} />
            <Route path="/user/favouritelist" element={<FavouriteList />} />
            <Route
              path="/candidates/profile/:slug"
              element={<FavouriteListProfile />}
            />
            <Route path="/user/importjobseekers" element={<ImportJobseekers />} />
            <Route path="/user/mailhistory" element={<MailHistory />} />
            <Route path="/user/maildetail/:slug" element={<MailDetail />} />
            <Route path="/user/myprofile" element={<MyProfileNew />} />
            <Route path="/plans/purchase" element={<InnerMembershipPlan />} />
            <Route path="/user/editprofile" element={<EditProfile />} />
            <Route path="/user/changepassword" element={<ChangePassword />} />
            <Route path="/user/changelogo" element={<ChangeLogo />} />
            <Route path="/user/deleteaccount" element={<DeleteAccount />} />
  
            {/* Jobseekers */}
            <Route path="/candidates/myaccount" element={<JSMyProfile />} />
            <Route path="/candidates/editprofile" element={<JSEditProfile />} />
            <Route path="/candidates/editEducation" element={<JSEducation />} />
            <Route path="/candidates/editExperience" element={<JSExperience />} />
            <Route
              path="/candidates/editProfessional"
              element={<JSProfessionalRegistration />}
            />
            <Route path="/candidates/addvideocv" element={<JSVideoCV />} />
            <Route path="/candidates/makecv" element={<JSMakeCV />} />
            <Route path="/candidates/addcvdocuments" element={<JSAddDocuments />} />
  
            <Route path="/payments/history" element={<JSPaymentHistory />} />
            <Route path="/alerts/index" element={<JSManageAlerts />} />
            <Route path="/alerts/add" element={<JSAddAlert />} />
            <Route path="/alerts/edit/:slug" element={<JSEditAlert />} />
            <Route path="/jobs/savedjobs" element={<JSSavedJobs />} />
            <Route path="/jobs/applied" element={<JSAppliedJobs />} />
            <Route path="/candidates/mailhistory" element={<JSMailHistory />} />
            <Route
              path="/candidates/maildetail/:slug"
              element={<JSMailDetail />}
            />
            <Route
              path="/candidates/changepassword"
              element={<JSChangePassword />}
            />
            <Route path="/candidates/uploadPhoto" element={<JSChangePhoto />} />
            <Route
              path="/candidates/deleteAccount"
              element={<JSDeleteAccount />}
            />
  
            {/* Admin panel routes */}
            {/* <Route
              path="/admin"
              element={<AdminLogin />}
            /> */}
  
            {adminAuthentication ? (
              <Route
                path="/admin"
                element={<Navigate to="/admin/admins/dashboard" />}
              />
            ) : (
              <Route path="/admin" element={<AdminLogin />} />
            )}
  
            {/* Admin Dashboard */}
            <Route path="/admin/admins/dashboard" element={<Dashboard />} />
  
            {/* Configuration */}
            <Route
              path="/admin/admins/changeusername"
              element={<APChangeUsername />}
            />
            <Route
              path="/admin/admins/changepassword"
              element={<APChangePassword />}
            />
            <Route path="/admin/admins/changeemail" element={<APChangeEmail />} />
            <Route
              path="/admin/admins/securityQuestions"
              element={<APSecurityQuestions />}
            />
            <Route path="/admin/plans/index" element={<APManagePlans />} />
            <Route path="/admin/plans/addplan" element={<APAddPlan />} />
            <Route path="/admin/plans/editPlan/:slug" element={<APEditPlan />} />
            <Route
              path="/admin/admins/settings"
              element={<APSetContactAddress />}
            />
            <Route path="/admin/admins/changeSlogan" element={<APSloganText />} />
            <Route path="/admin/admins/uploadLogo" element={<APChangeLogo />} />
            <Route
              path="/admin/admins/changecolorscheme"
              element={<APChangeColorTheme />}
            />
            <Route
              path="/admin/admins/changePaymentdetail"
              element={<APChangePaymentDetail />}
            />
            <Route
              path="/admin/admins/changeFavicon"
              element={<APChangeFavicon />}
            />
            <Route
              path="/admin/admins/metaManagement"
              element={<APMetaManagement />}
            />
  
            <Route path="/admin/admins/manage" element={<APManageSubAdmins />} />
            <Route path="/admin/admins/addsubadmin" element={<APAddSubAdmin />} />
            <Route
              path="/admin/admins/editadmins/:slug"
              element={<APEditSubAdmin />}
            />
            <Route
              path="/admin/admins/managerole/:slug"
              element={<APManageRoles />}
            />
            <Route
              path="/admin/smtpsettings/configuration"
              element={<APSMTPsettings />}
            />
            <Route
              path="/admin/settings/siteSettings"
              element={<APSiteSetting />}
            />
            <Route
              path="/admin/settings/manageMails"
              element={<APManageEmailSetting />}
            />
            <Route
              path="/admin/settings/editMails/:slug"
              element={<APEditEmailSetting />}
            />
  
            {/* Employer */}
            <Route path="/admin/users/addusers" element={<APAddEmployer />} />
            <Route
              path="/admin/users/editusers/:slug"
              element={<APEditEmployerDetails />}
            />
            <Route path="/admin/users" element={<APEmployerList />} />
            <Route
              path="/admin/users/selectforslider"
              element={<HomePageSlider />}
            />
            <Route
              path="/admin/users/addhomepageslider"
              element={<APHomePageSlider />}
            />
  
            {/* Jobseeker */}
            <Route
              path="/admin/candidates/addcandidates"
              element={<APAddJobseekers />}
            />
            <Route path="/admin/candidates" element={<APJobseekerList />} />
            <Route
              path="/admin/candidates/certificates/:slug"
              element={<APManageCertificate />}
            />
            <Route
              path="/admin/jobs/applied/:slug"
              element={<APAppliedJobsList />}
            />
            <Route
              path="/admin/candidates/editcandidates/:slug"
              element={<APEditJobseeker />}
            />
  
            {/* Categories */}
            <Route
              path="/admin/categories/addcategory"
              element={<APAddCategory />}
            />
            <Route path="/admin/categories" element={<APCategoryList />} />
            <Route
              path="/admin/categories/addsubcat/:slug"
              element={<APAddSubCategory />}
            />
            <Route
              path="/admin/categories/subindex/:slug"
              element={<SubCategoryList />}
            />
            <Route
              path="/admin/categories/editsubcat/:slug1/:slug2"
              element={<APEditSubCategory />}
            />
            <Route
              path="/admin/categories/editcategory/:slug"
              element={<APEditCategory />}
            />
  
            {/* Swear Words */}
            <Route path="/admin/swears/addswears" element={<APAddSwearWords />} />
            <Route
              path="/admin/swears/editswear/:slug"
              element={<APEditSwearWords />}
            />
            <Route path="/admin/swears" element={<APSwearWordsList />} />
  
            {/* Skills */}
            <Route path="/admin/skills/addskills" element={<APAddSkills />} />
            <Route
              path="/admin/skills/editskill/:slug"
              element={<APEditSkills />}
            />
            <Route path="/admin/skills" element={<APSkillsList />} />
  
            {/* Designations */}
            <Route path="/admin/designations" element={<APDesignationsList />} />
            <Route
              path="/admin/designations/adddesignations"
              element={<APAddDesignations />}
            />
            <Route
              path="/admin/designations/editdesignation/:slug"
              element={<APEditDesignations />}
            />
  
            {/* Jobs */}
            <Route path="/admin/jobs" element={<APJobsList />} />
            <Route path="/admin/jobs/addjob" element={<APAddJob />} />
            <Route path="/admin/jobs/editjob/:slug" element={<APEditJob />} />
            <Route
              path="/admin/jobs/candidates/:slug"
              element={<APInternalJobList />}
            />
            <Route path="/admin/jobs/addjob/copy/:slug" element={<APCopyJob />} />
            <Route path="/admin/jobs/import" element={<APImportJob />} />
            <Route
              path="/admin/jobs/importlist"
              element={<APAutoJobImportList />}
            />
  
  
            <Route path="/admin/jobs/newimportjob" element={<APNewImportJob />} />
  
  
            {/* Payment History */}
            <Route
              path="/admin/payments/history"
              element={<APTransactionList />}
            />
  
            {/* Currency */}
            <Route path="/admin/currencies" element={<APCurrencyList />} />
            <Route path="/admin/currencies/add" element={<APAddCurrency />} />
            <Route
              path="/admin/currencies/edit/:slug"
              element={<APEditCurrency />}
            />
  
            {/* Manage Newsletter */}
            <Route
              path="/admin/newsletters/index"
              element={<APNewsletterList />}
            />
            <Route
              path="/admin/newsletters/addNewsletter"
              element={<APAddNewsletter />}
            />
            <Route
              path="/admin/newsletters/editNewsletter/:slug"
              element={<APEditNewsletter />}
            />
            <Route
              path="/admin/newsletters/sendNewsletter"
              element={<APSendNewsLetterEmail />}
            />
            <Route path="/admin/newsletters/sentMail" element={<APEmailLogs />} />
            <Route
              path="/admin/newsletters/unsubscriberlist"
              element={<APUnsubscribeUserlist />}
            />
  
            {/* Banner Advertisement */}
            <Route
              path="/admin/banneradvertisements"
              element={<APBannerList />}
            />
            <Route
              path="/admin/banneradvertisements/addBanneradvertisement"
              element={<APAddBanner />}
            />
            <Route
              path="/admin/banneradvertisements/editBanneradvertisement/:slug"
              element={<APEditBanner />}
            />
  
            {/* Course */}
            <Route path="/admin/courses" element={<APCourseList />} />
            <Route path="/admin/courses/addcourse" element={<APAddCourse />} />
            <Route
              path="/admin/courses/editcourse/:slug"
              element={<APEditCourse />}
            />
            <Route
              path="/admin/specializations/index/:slug"
              element={<APSpecializationList />}
            />
            <Route
              path="/admin/specializations/addspecialization/:slug"
              element={<APAddSpecialization />}
            />
            <Route
              path="/admin/specializations/editspecialization/:slug1/:slug2"
              element={<APEditSpecializations />}
            />
  
            {/* Content */}
            <Route path="/admin/pages/index" element={<APTextPages />} />
            <Route
              path="/admin/pages/editPage/:slug"
              element={<APEditPageDetail />}
            />
  
            {/* Email Template */}
            <Route
              path="/admin/emailtemplates"
              element={<APEmailTemplateSetting />}
            />
            <Route
              path="/admin/emailtemplates/editEmailtemplate/:slug"
              element={<APEditEmailTemplate />}
            />
  
            {/* Blogs */}
            <Route path="/admin/blogs" element={<APBlogList />} />
            <Route path="/admin/blogs/addblogs" element={<APAddBlog />} />
            <Route path="/admin/blogs/editblogs/:slug" element={<APEditBlog />} />
  
            {/* Sliders */}
            <Route path="/admin/sliders" element={<APSliderList />} />
            <Route path="/admin/sliders/add" element={<APAddSlider />} />
            <Route path="/admin/sliders/edit/:slug" element={<APEditSlider />} />
  
            {/* Announcement */}
            <Route path="/admin/announcements" element={<APAnnouncementList />} />
            <Route
              path="/admin/announcements/add"
              element={<APAddAnnouncement />}
            />
            <Route
              path="/admin/announcements/edit/:slug"
              element={<APEditAnnouncement />}
            />
  
            {/* Keywords */}
            <Route path="/admin/keywords" element={<APSearchKeywordList />} />
            <Route path="/admin/keywords/add" element={<APAddSearchKeyword />} />
            <Route
              path="/admin/keywords/edit/:slug"
              element={<APEditSearchKeyword />}
            />
            <Route path="/admin/keywords/jobs" element={<APJobKeywordList />} />
            <Route path="/admin/keywords/addjobs" element={<APAddJobKeyword />} />
            <Route
              path="/admin/keywords/editjobs/:slug"
              element={<APEditJobKeyword />}
            />
            <Route
              path="/admin/keywords/requests"
              element={<APRequestedKeywordList />}
            />
          </Routes>
        </Router>
      </>
    );
  }
  
  export default App;
  
  