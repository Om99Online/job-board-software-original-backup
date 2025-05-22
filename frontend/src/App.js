import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import React, { Suspense } from "react";
// import UserPage from "./Components/home/UserPage";
// import AboutUs from "./Components/aboutUs/AboutUs";
// import Faq from "./Components/faq/Faq";
// import BlogPage from "./Components/blog/BlogPage";
// import DynamicBlogPage from "./Components/blog/DynamicBlogPage";
// import SearchJobPage from "./Components/searchJob/SearchJobPage";
// import Contact from "./Components/contactUs/Contact";
// import CreateJob from "./Components/employersSide/CreateJob";
// import ManageJob from "./Components/employersSide/ManageJob";
// import CopyJob from "./Components/employersSide/CopyJob";
// import FavouriteList from "./Components/employersSide/FavouriteList";
// import PaymentHistory from "./Components/employersSide/PaymentHistory";
// import MailHistory from "./Components/employersSide/MailHistory";
// import MailDetail from "./Components/employersSide/MailDetail";
// import MyProfile from "./Components/employersSide/MyProfile";
// import EditProfile from "./Components/employersSide/EditProfile";
// import ChangePassword from "./Components/employersSide/ChangePassword";
// import ChangeLogo from "./Components/employersSide/ChangeLogo";
// import EmployerLogin from "./Components/login/EmployerLogin";
// import JobseekerLogin from "./Components/login/JobseekerLogin"; ask
// import ImportJobseekers from "./Components/employersSide/ImportJobseekers";
// import JobDescription from "./Components/element/JobDescription";
// import AllCategoryPage from "./Components/home/AllCategoryPage";
// import CompanyProfile from "./Components/home/CompanyProfile";
// import InnerAccountdetail from "./Components/employersSide/InnerAccountdetail";
// import JSEditProfile from "./Components/jobseekersSide/JSEditProfile";
// import JSMyProfile from "./Components/jobseekersSide/JSMyProfile";
// import JSEducation from "./Components/jobseekersSide/JSEducation";
// import JSExperience from "./Components/jobseekersSide/JSExperience";
// import JSProfessionalRegistration from "./Components/jobseekersSide/JSProfessionalRegistration";
// import JSVideoCV from "./Components/jobseekersSide/JSVideoCV";
// import JSMakeCV from "./Components/jobseekersSide/JSMakeCV";
// import JSAddDocuments from "./Components/jobseekersSide/JSAddDocument";

// import JSPaymentHistory from "./Components/jobseekersSide/JSPaymentHistory";
// import JSManageAlerts from "./Components/jobseekersSide/JSManageAlerts";
// import JSSavedJobs from "./Components/jobseekersSide/JSSavedJobs";
// import JSAppliedJobs from "./Components/jobseekersSide/JSAppliedJobs";
// import JSMailHistory from "./Components/jobseekersSide/JSMailHistory";
// import JSChangePassword from "./Components/jobseekersSide/JSChangePassword";
// import JSChangePhoto from "./Components/jobseekersSide/JSChangePhoto";
// import JSEditAlert from "./Components/jobseekersSide/JSEditAlert";
// import JSMailDetail from "./Components/jobseekersSide/JSMailDetail";
// import FavouriteListProfile from "./Components/employersSide/FavouriteListProfile";
// import JSAddAlert from "./Components/jobseekersSide/JSAddAlert";
// import EmployerRegister from "./Components/register/EmployerRegister";
// import JobseekerRegister from "./Components/register/JobseekerRegister";
// import APChangeUsername from "./Components/adminpanel/Configuration/APChangeUsername";
// import APChangePassword from "./Components/adminpanel/Configuration/APChangePassword";
// import APChangeEmail from "./Components/adminpanel/Configuration/APChangeEmail";
// import InnerMembershipPlan from "./Components/employersSide/InnerMembershipPlan";
// import APSecurityQuestions from "./Components/adminpanel/Configuration/APSecurityQuestions";
// import APSetContactAddress from "./Components/adminpanel/Configuration/APSetContactAddress";
// import APSloganText from "./Components/adminpanel/Configuration/APSloganText";
// import APChangeLogo from "./Components/adminpanel/Configuration/APChangeLogo";
// import APChangePaymentDetail from "./Components/adminpanel/Configuration/APChangePaymentDetail";
// import APChangeFavicon from "./Components/adminpanel/Configuration/APChangeFavicon";
// import APMetaManagement from "./Components/adminpanel/Configuration/APMetaManagement";
// import APSMTPsettings from "./Components/adminpanel/Configuration/APSMTPsettings";
// import APSiteSetting from "./Components/adminpanel/Setting/APSiteSetting";
// import APManageEmailSetting from "./Components/adminpanel/Setting/APManageEmailSetting";
// import APAddEmployer from "./Components/adminpanel/Employers/APAddEmployer";
// import APEmployerList from "./Components/adminpanel/Employers/APEmployerList";
// import APAddJobseekers from "./Components/adminpanel/Jobseekers/APAddJobseekers";
// import APAddCategory from "./Components/adminpanel/Categories/APAddCategory";
// import APAddSwearWords from "./Components/adminpanel/Swearwords/APAddSwearWords";
// import APAddSkills from "./Components/adminpanel/Skills/APAddSkills";
// import DetailEditInner from "./Components/employersSide/DetailEditInner";
// import PrivacyPolicy from "./Components/element/PrivacyPolicy";
// import SiteMap from "./Components/element/SiteMap";
// import TermsConditions from "./Components/element/TermsConditions";
// import Companies from "./Components/element/Companies";
// import CareerTools from "./Components/element/CareerTools";
// import CareerResources from "./Components/element/CareerResources";
// import Benefits from "./Components/element/Benefits";
// import HowItWorks from "./Components/howItWorks/HowItWorks";
// import AdminLogin from "./Components/adminpanel/login/AdminLogin";
// import Dashboard from "./Components/adminpanel/Dashboard/Dashboard";
// import APAddSubAdmin from "./Components/adminpanel/Configuration/APAddSubAdmin";
// import APManageSubAdmins from "./Components/adminpanel/Configuration/APManageSubAdmins";
// import APManagePlans from "./Components/adminpanel/Configuration/APManagePlans";
// import APEditSubAdmin from "./Components/adminpanel/Configuration/APEditSubAdmin";
// import APAddPlan from "./Components/adminpanel/Configuration/APAddPlan";
// import HomePageSlider from "./Components/adminpanel/Employers/HomePageSlider";
// import APJobseekerList from "./Components/adminpanel/Jobseekers/APJobseekersList";
// import APEditEmailSetting from "./Components/adminpanel/Setting/APEditEmailSetting";
// import APEditEmployer from "./Components/adminpanel/Employers/APAddEmployer";
// import APManageCertificate from "./Components/adminpanel/Jobseekers/APManageCertificate";
// import APAppliedJobsList from "./Components/adminpanel/Jobseekers/APAppliedJobsList";
// import APAddSubCategory from "./Components/adminpanel/Categories/APAddSubCategory";
// import APCategoryList from "./Components/adminpanel/Categories/CategoryList";
// import SubCategoryList from "./Components/adminpanel/Categories/SubCategoryList";
// import APEditSubCategory from "./Components/adminpanel/Categories/APEditSubCategory";
// import APEditCategory from "./Components/adminpanel/Categories/APEditCategory";
// import APSwearWordsList from "./Components/adminpanel/Swearwords/APSwearWordsList";
// import APEditSwearWords from "./Components/adminpanel/Swearwords/APEditSwearWords";
// import APEditSkills from "./Components/adminpanel/Skills/APEditSkills";
// import APSkillsList from "./Components/adminpanel/Skills/APSkillsList";
// import APDesignationsList from "./Components/adminpanel/Designations/APDesignationsList";
// import APAddDesignations from "./Components/adminpanel/Designations/APAddDesignations";
//  import APEditDesignations from "./Components/adminpanel/Designations/APEditDesignations";
// import APCurrencyList from "./Components/adminpanel/Currency/APCurrencyList";
// import APAddCurrency from "./Components/adminpanel/Currency/APAddCurrency";
// import APEditCurrency from "./Components/adminpanel/Currency/APEditCurrency";
// import APBannerList from "./Components/adminpanel/Banner Advertisement/APBannerList";
// import APAddBanner from "./Components/adminpanel/Banner Advertisement/APAddBanner";
// import APEditBanner from "./Components/adminpanel/Banner Advertisement/APEditBanner";
// import APCourseList from "./Components/adminpanel/Course/APCourseList";
// import APAddCourse from "./Components/adminpanel/Course/APAddCourse";
// import APEditCourse from "./Components/adminpanel/Course/APEditCourse";
// import APSpecializationList from "./Components/adminpanel/Course/APSpecializationList";
// import APAddSpecialization from "./Components/adminpanel/Course/APAddSpecialization";
// import APBlogList from "./Components/adminpanel/Blogs/APBlogList";
// import APAddBlog from "./Components/adminpanel/Blogs/APAddBlog";
// import APEditBlog from "./Components/adminpanel/Blogs/APEditBlog";
// import APSliderList from "./Components/adminpanel/Sliders/APSliderList";
// import APAddSlider from "./Components/adminpanel/Sliders/APAddSlider";
// import APEditSlider from "./Components/adminpanel/Sliders/APEditSlider";
// import APAnnouncementList from "./Components/adminpanel/Announcements/APAnnouncementList";
// import APAddAnnouncement from "./Components/adminpanel/Announcements/APAddAnnouncement";
// import APEditAnnouncement from "./Components/adminpanel/Announcements/APEditAnnouncement";
// import APTransactionList from "./Components/adminpanel/Payment History/APTransactionList";
// import APTextPages from "./Components/adminpanel/Contents/APTextPages";
// import APEditPageDetail from "./Components/adminpanel/Contents/APEditPageDetail";
// import APSearchKeywordList from "./Components/adminpanel/Keywords/APSearchKeywordList";
// import APAddSearchKeyword from "./Components/adminpanel/Keywords/APAddSearchKeyword";
// import APEditSearchKeyword from "./Components/adminpanel/Keywords/APEditSearchKeyword";
// import APJobKeywordList from "./Components/adminpanel/Keywords/APJobKeywordList";
// import APAddJobKeyword from "./Components/adminpanel/Keywords/APAddJobKeyword";
// import APEditJobKeyword from "./Components/adminpanel/Keywords/APEditJobKeyword";
// import APRequestedKeywordList from "./Components/adminpanel/Keywords/APRequestedKeywordList";
// import APJobsList from "./Components/adminpanel/Jobs/APJobsList";
// import APAddJob from "./Components/adminpanel/Jobs/APAddJob";
// import APEditJob from "./Components/adminpanel/Jobs/APEditJob";
// import APInternalJobList from "./Components/adminpanel/Jobs/APInternalJobList";
// import APCopyJob from "./Components/adminpanel/Jobs/APCopyJob";
// import APImportJob from "./Components/adminpanel/Jobs/APImportJob";
// import APAutoJobImportList from "./Components/adminpanel/Jobs/APAutoJobImportList";
// import APNewsletterList from "./Components/adminpanel/Manage Newsletter/APNewsletterList";
// import APAddNewsletter from "./Components/adminpanel/Manage Newsletter/APAddNewsletter";
// import APEditNewsletter from "./Components/adminpanel/Manage Newsletter/APEditNewsletter";
// import APSendNewsLetterEmail from "./Components/adminpanel/Manage Newsletter/APSendNewsLetterEmail";
// import APEmailLogs from "./Components/adminpanel/Manage Newsletter/APEmailLogs";
// import APUnsubscribeUserlist from "./Components/adminpanel/Manage Newsletter/APUnsubscribeUserlist";
// import APEditJobseeker from "./Components/adminpanel/Jobseekers/APEditJobseeker";
// import Jobseekers from "./Components/employersSide/Jobseekers";
// import APEmailTemplateSetting from "./Components/adminpanel/Email Templates/APEmailTemplateSetting";
// import APEditEmployerDetails from "./Components/adminpanel/Employers/APEditEmployerDetails";
// import APEditSpecializations from "./Components/adminpanel/Course/APEditSpecializations";
// import APEditPlan from "./Components/adminpanel/Configuration/APEditPlan";
// import APManageRoles from "./Components/adminpanel/Configuration/APManageRoles";
// import APEditEmailTemplate from "./Components/adminpanel/Email Templates/APEditEmailTemplate";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
// import Error from "./Components/element/Error";
import BaseApi from "./Components/api/BaseApi";
import axios from "axios";
// import APChangeColorTheme from "./Components/adminpanel/Configuration/APChangeColorTheme";
// import APHomePageSlider from "./Components/adminpanel/Employers/APHomePageSlider";
import Swal from "sweetalert2";
// import BlankPage from "./Components/element/BlankPage";
// import JSDeleteAccount from "./Components/jobseekersSide/JSDeleteAccount";
// import MyProfileNew from "./Components/employersSide/MyProfileNew";
// import DeleteAccount from "./Components/employersSide/DeleteAccount";
// import Success from "./Components/element/Success";
// import CheckoutForm from "./Components/element/CheckoutForm";
// import PaymentOption from "./Components/element/PaymentOption";
// import ForgotPassword from "./Components/element/ForgotPassword";
// import ResetPassword from "./Components/element/ResetPassword";
// import APNewImportJob from "./Components/adminpanel/Jobs/APNewImportJob";
// import APImportJobUpdated from "./Components/adminpanel/Jobs/APImportJobUpdated";
// import APImportJobElements from "./Components/adminpanel/Jobs/APImportJobElements";
import Loading from "./Components/element/Loading";
import ApiKey from "../src/Components/api/ApiKey";
import ImportCSVJob from "./Components/adminpanel/Jobs/ImportCSVJob";

const UserPage = React.lazy(() => import("./Components/home/UserPage"));
const AboutUs = React.lazy(() => import("./Components/aboutUs/AboutUs"));
const Faq = React.lazy(() => import("./Components/faq/Faq"));
const BlogPage = React.lazy(() => import("./Components/blog/BlogPage"));
const DynamicBlogPage = React.lazy(() =>
  import("./Components/blog/DynamicBlogPage")
);
const SearchJobPage = React.lazy(() =>
  import("./Components/searchJob/SearchJobPage")
);
const Contact = React.lazy(() => import("./Components/contactUs/Contact"));
const CreateJob = React.lazy(() =>
  import("./Components/employersSide/CreateJob")
);
const ManageJob = React.lazy(() =>
  import("./Components/employersSide/ManageJob")
);
const CopyJob = React.lazy(() => import("./Components/employersSide/CopyJob"));
const FavouriteList = React.lazy(() =>
  import("./Components/employersSide/FavouriteList")
);
const PaymentHistory = React.lazy(() =>
  import("./Components/employersSide/PaymentHistory")
);
const MailHistory = React.lazy(() =>
  import("./Components/employersSide/MailHistory")
);
const MailDetail = React.lazy(() =>
  import("./Components/employersSide/MailDetail")
);
const MyProfile = React.lazy(() =>
  import("./Components/employersSide/MyProfile")
);
const EditProfile = React.lazy(() =>
  import("./Components/employersSide/EditProfile")
);
const ChangePassword = React.lazy(() =>
  import("./Components/employersSide/ChangePassword")
);
const ChangeLogo = React.lazy(() =>
  import("./Components/employersSide/ChangeLogo")
);
const EmployerLogin = React.lazy(() =>
  import("./Components/login/EmployerLogin")
);
const JobseekerLogin = React.lazy(() =>
  import("./Components/login/JobseekerLogin")
);
const ImportJobseekers = React.lazy(() =>
  import("./Components/employersSide/ImportJobseekers")
);
const JobDescription = React.lazy(() =>
  import("./Components/element/JobDescription")
);
const AllCategoryPage = React.lazy(() =>
  import("./Components/home/AllCategoryPage")
);
const CompanyProfile = React.lazy(() =>
  import("./Components/home/CompanyProfile")
);
const InnerAccountdetail = React.lazy(() =>
  import("./Components/employersSide/InnerAccountdetail")
);

// Jobseeker side
const JSEditProfile = React.lazy(() =>
  import("./Components/jobseekersSide/JSEditProfile")
);
const JSMyProfile = React.lazy(() =>
  import("./Components/jobseekersSide/JSMyProfile")
);
const JSEducation = React.lazy(() =>
  import("./Components/jobseekersSide/JSEducation")
);
const JSExperience = React.lazy(() =>
  import("./Components/jobseekersSide/JSExperience")
);
const JSProfessionalRegistration = React.lazy(() =>
  import("./Components/jobseekersSide/JSProfessionalRegistration")
);
const JSVideoCV = React.lazy(() =>
  import("./Components/jobseekersSide/JSVideoCV")
);
const JSMakeCV = React.lazy(() =>
  import("./Components/jobseekersSide/JSMakeCV")
);
const JSAddDocuments = React.lazy(() =>
  import("./Components/jobseekersSide/JSAddDocument")
);
const JSPaymentHistory = React.lazy(() =>
  import("./Components/jobseekersSide/JSPaymentHistory")
);
const JSManageAlerts = React.lazy(() =>
  import("./Components/jobseekersSide/JSManageAlerts")
);
const JSSavedJobs = React.lazy(() =>
  import("./Components/jobseekersSide/JSSavedJobs")
);
const JSAppliedJobs = React.lazy(() =>
  import("./Components/jobseekersSide/JSAppliedJobs")
);
const JSMailHistory = React.lazy(() =>
  import("./Components/jobseekersSide/JSMailHistory")
);
const JSChangePassword = React.lazy(() =>
  import("./Components/jobseekersSide/JSChangePassword")
);
const JSChangePhoto = React.lazy(() =>
  import("./Components/jobseekersSide/JSChangePhoto")
);
const JSEditAlert = React.lazy(() =>
  import("./Components/jobseekersSide/JSEditAlert")
);
const JSMailDetail = React.lazy(() =>
  import("./Components/jobseekersSide/JSMailDetail")
);
const FavouriteListProfile = React.lazy(() =>
  import("./Components/employersSide/FavouriteListProfile")
);
const JSAddAlert = React.lazy(() =>
  import("./Components/jobseekersSide/JSAddAlert")
);
const EmployerRegister = React.lazy(() =>
  import("./Components/register/EmployerRegister")
);
const JobseekerRegister = React.lazy(() =>
  import("./Components/register/JobseekerRegister")
);
const APChangeUsername = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APChangeUsername")
);
const APChangePassword = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APChangePassword")
);
const APChangeEmail = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APChangeEmail")
);
const InnerMembershipPlan = React.lazy(() =>
  import("./Components/employersSide/InnerMembershipPlan")
);
const APSecurityQuestions = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APSecurityQuestions")
);
const APSetContactAddress = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APSetContactAddress")
);
const APSloganText = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APSloganText")
);
const APChangeLogo = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APChangeLogo")
);
const APChangePaymentDetail = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APChangePaymentDetail")
);
const APChangeFavicon = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APChangeFavicon")
);
const APMetaManagement = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APMetaManagement")
);
const APSMTPsettings = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APSMTPsettings")
);
const APSiteSetting = React.lazy(() =>
  import("./Components/adminpanel/Setting/APSiteSetting")
);
const APManageEmailSetting = React.lazy(() =>
  import("./Components/adminpanel/Setting/APManageEmailSetting")
);
const APAddEmployer = React.lazy(() =>
  import("./Components/adminpanel/Employers/APAddEmployer")
);
const APEmployerList = React.lazy(() =>
  import("./Components/adminpanel/Employers/APEmployerList")
);
const APAddJobseekers = React.lazy(() =>
  import("./Components/adminpanel/Jobseekers/APAddJobseekers")
);
const APAddCategory = React.lazy(() =>
  import("./Components/adminpanel/Categories/APAddCategory")
);
const APAddSwearWords = React.lazy(() =>
  import("./Components/adminpanel/Swearwords/APAddSwearWords")
);
const APAddSkills = React.lazy(() =>
  import("./Components/adminpanel/Skills/APAddSkills")
);
const DetailEditInner = React.lazy(() =>
  import("./Components/employersSide/DetailEditInner")
);
const PrivacyPolicy = React.lazy(() =>
  import("./Components/element/PrivacyPolicy")
);
const SiteMap = React.lazy(() => import("./Components/element/SiteMap"));
const TermsConditions = React.lazy(() =>
  import("./Components/element/TermsConditions")
);
const Companies = React.lazy(() => import("./Components/element/Companies"));
const CareerTools = React.lazy(() =>
  import("./Components/element/CareerTools")
);
const CareerResources = React.lazy(() =>
  import("./Components/element/CareerResources")
);
const Benefits = React.lazy(() => import("./Components/element/Benefits"));
const HowItWorks = React.lazy(() =>
  import("./Components/howItWorks/HowItWorks")
);
const AdminLogin = React.lazy(() =>
  import("./Components/adminpanel/login/AdminLogin")
);
const Dashboard = React.lazy(() =>
  import("./Components/adminpanel/Dashboard/Dashboard")
);
const APAddSubAdmin = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APAddSubAdmin")
);
const APManageSubAdmins = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APManageSubAdmins")
);
const APManagePlans = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APManagePlans")
);
const APEditSubAdmin = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APEditSubAdmin")
);
const APAddPlan = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APAddPlan")
);
const HomePageSlider = React.lazy(() =>
  import("./Components/adminpanel/Employers/HomePageSlider")
);
const APJobseekerList = React.lazy(() =>
  import("./Components/adminpanel/Jobseekers/APJobseekersList")
);
const APEditEmailSetting = React.lazy(() =>
  import("./Components/adminpanel/Setting/APEditEmailSetting")
);
const APEditEmployer = React.lazy(() =>
  import("./Components/adminpanel/Employers/APAddEmployer")
);
const APManageCertificate = React.lazy(() =>
  import("./Components/adminpanel/Jobseekers/APManageCertificate")
);
const APAppliedJobsList = React.lazy(() =>
  import("./Components/adminpanel/Jobseekers/APAppliedJobsList")
);
const APAddSubCategory = React.lazy(() =>
  import("./Components/adminpanel/Categories/APAddSubCategory")
);
const APCategoryList = React.lazy(() =>
  import("./Components/adminpanel/Categories/CategoryList")
);
const SubCategoryList = React.lazy(() =>
  import("./Components/adminpanel/Categories/SubCategoryList")
);
const APEditSubCategory = React.lazy(() =>
  import("./Components/adminpanel/Categories/APEditSubCategory")
);
const APEditCategory = React.lazy(() =>
  import("./Components/adminpanel/Categories/APEditCategory")
);
const APSwearWordsList = React.lazy(() =>
  import("./Components/adminpanel/Swearwords/APSwearWordsList")
);
const APEditSwearWords = React.lazy(() =>
  import("./Components/adminpanel/Swearwords/APEditSwearWords")
);
const APEditSkills = React.lazy(() =>
  import("./Components/adminpanel/Skills/APEditSkills")
);
const APSkillsList = React.lazy(() =>
  import("./Components/adminpanel/Skills/APSkillsList")
);
const APDesignationsList = React.lazy(() =>
  import("./Components/adminpanel/Designations/APDesignationsList")
);
const APAddDesignations = React.lazy(() =>
  import("./Components/adminpanel/Designations/APAddDesignations")
);
const APEditDesignations = React.lazy(() =>
  import("./Components/adminpanel/Designations/APEditDesignations")
);
const APCurrencyList = React.lazy(() =>
  import("./Components/adminpanel/Currency/APCurrencyList")
);
const APAddCurrency = React.lazy(() =>
  import("./Components/adminpanel/Currency/APAddCurrency")
);
const APEditCurrency = React.lazy(() =>
  import("./Components/adminpanel/Currency/APEditCurrency")
);
const APBannerList = React.lazy(() =>
  import("./Components/adminpanel/Banner Advertisement/APBannerList")
);
const APAddBanner = React.lazy(() =>
  import("./Components/adminpanel/Banner Advertisement/APAddBanner")
);
const APEditBanner = React.lazy(() =>
  import("./Components/adminpanel/Banner Advertisement/APEditBanner")
);
const APCourseList = React.lazy(() =>
  import("./Components/adminpanel/Course/APCourseList")
);
const APAddCourse = React.lazy(() =>
  import("./Components/adminpanel/Course/APAddCourse")
);
const APEditCourse = React.lazy(() =>
  import("./Components/adminpanel/Course/APEditCourse")
);
const APSpecializationList = React.lazy(() =>
  import("./Components/adminpanel/Course/APSpecializationList")
);
const APAddSpecialization = React.lazy(() =>
  import("./Components/adminpanel/Course/APAddSpecialization")
);
const APBlogList = React.lazy(() =>
  import("./Components/adminpanel/Blogs/APBlogList")
);
const APAddBlog = React.lazy(() =>
  import("./Components/adminpanel/Blogs/APAddBlog")
);
const APEditBlog = React.lazy(() =>
  import("./Components/adminpanel/Blogs/APEditBlog")
);
const APSliderList = React.lazy(() =>
  import("./Components/adminpanel/Sliders/APSliderList")
);
const APAddSlider = React.lazy(() =>
  import("./Components/adminpanel/Sliders/APAddSlider")
);
const APEditSlider = React.lazy(() =>
  import("./Components/adminpanel/Sliders/APEditSlider")
);
const APAnnouncementList = React.lazy(() =>
  import("./Components/adminpanel/Announcements/APAnnouncementList")
);
const APAddAnnouncement = React.lazy(() =>
  import("./Components/adminpanel/Announcements/APAddAnnouncement")
);
const APEditAnnouncement = React.lazy(() =>
  import("./Components/adminpanel/Announcements/APEditAnnouncement")
);
const APTransactionList = React.lazy(() =>
  import("./Components/adminpanel/Payment History/APTransactionList")
);
const APTextPages = React.lazy(() =>
  import("./Components/adminpanel/Contents/APTextPages")
);
const APEditPageDetail = React.lazy(() =>
  import("./Components/adminpanel/Contents/APEditPageDetail")
);
const APSearchKeywordList = React.lazy(() =>
  import("./Components/adminpanel/Keywords/APSearchKeywordList")
);
const APAddSearchKeyword = React.lazy(() =>
  import("./Components/adminpanel/Keywords/APAddSearchKeyword")
);
const APEditSearchKeyword = React.lazy(() =>
  import("./Components/adminpanel/Keywords/APEditSearchKeyword")
);
const APJobKeywordList = React.lazy(() =>
  import("./Components/adminpanel/Keywords/APJobKeywordList")
);
const APAddJobKeyword = React.lazy(() =>
  import("./Components/adminpanel/Keywords/APAddJobKeyword")
);
const APEditJobKeyword = React.lazy(() =>
  import("./Components/adminpanel/Keywords/APEditJobKeyword")
);
const APRequestedKeywordList = React.lazy(() =>
  import("./Components/adminpanel/Keywords/APRequestedKeywordList")
);
const APJobsList = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APJobsList")
);
const APAddJob = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APAddJob")
);
const APEditJob = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APEditJob")
);
const APInternalJobList = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APInternalJobList")
);
const APCopyJob = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APCopyJob")
);
const APImportJob = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APImportJob")
);
const APAutoJobImportList = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APAutoJobImportList")
);
const APNewsletterList = React.lazy(() =>
  import("./Components/adminpanel/Manage Newsletter/APNewsletterList")
);
const APAddNewsletter = React.lazy(() =>
  import("./Components/adminpanel/Manage Newsletter/APAddNewsletter")
);
const APEditNewsletter = React.lazy(() =>
  import("./Components/adminpanel/Manage Newsletter/APEditNewsletter")
);
const APSendNewsLetterEmail = React.lazy(() =>
  import("./Components/adminpanel/Manage Newsletter/APSendNewsLetterEmail")
);
const APEmailLogs = React.lazy(() =>
  import("./Components/adminpanel/Manage Newsletter/APEmailLogs")
);
const APUnsubscribeUserlist = React.lazy(() =>
  import("./Components/adminpanel/Manage Newsletter/APUnsubscribeUserlist")
);
const APEditJobseeker = React.lazy(() =>
  import("./Components/adminpanel/Jobseekers/APEditJobseeker")
);
const Jobseekers = React.lazy(() =>
  import("./Components/employersSide/Jobseekers")
);
const APEmailTemplateSetting = React.lazy(() =>
  import("./Components/adminpanel/Email Templates/APEmailTemplateSetting")
);
const APEditEmployerDetails = React.lazy(() =>
  import("./Components/adminpanel/Employers/APEditEmployerDetails")
);
const APEditSpecializations = React.lazy(() =>
  import("./Components/adminpanel/Course/APEditSpecializations")
);
const APEditPlan = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APEditPlan")
);
const APManageRoles = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APManageRoles")
);
const APEditEmailTemplate = React.lazy(() =>
  import("./Components/adminpanel/Email Templates/APEditEmailTemplate")
);
const Error = React.lazy(() => import("./Components/element/Error"));
const APChangeColorTheme = React.lazy(() =>
  import("./Components/adminpanel/Configuration/APChangeColorTheme")
);
const APHomePageSlider = React.lazy(() =>
  import("./Components/adminpanel/Employers/APHomePageSlider")
);
const BlankPage = React.lazy(() => import("./Components/element/BlankPage"));
const JSDeleteAccount = React.lazy(() =>
  import("./Components/jobseekersSide/JSDeleteAccount")
);
const MyProfileNew = React.lazy(() =>
  import("./Components/employersSide/MyProfileNew")
);
const DeleteAccount = React.lazy(() =>
  import("./Components/employersSide/DeleteAccount")
);
const Success = React.lazy(() => import("./Components/element/Success"));
const CheckoutForm = React.lazy(() =>
  import("./Components/element/CheckoutForm")
);
const PaymentOption = React.lazy(() =>
  import("./Components/element/PaymentOption")
);
const ForgotPassword = React.lazy(() =>
  import("./Components/element/ForgotPassword")
);
const ResetPassword = React.lazy(() =>
  import("./Components/element/ResetPassword")
);
const APNewImportJob = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APNewImportJob")
);
const APImportJobUpdated = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APImportJobUpdated")
);
const APImportJobElements = React.lazy(() =>
  import("./Components/adminpanel/Jobs/APImportJobElements")
);

function App() {
  const [adminAuthentication, setAdminAuthentication] = useState(false);
  const [employerAuthentication, setEmployerAuthentication] = useState(false);
  const [jobseekerAuthentication, setJobseekerAuthentication] = useState(false);
  // const location = useLocation();

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
      const response = await axios.get(BaseApi + "/getconstant");
      const responseData = response.data.response;
      // Set cookies
      Cookies.set("siteLogo", responseData.site_logo);
      Cookies.set("siteLink", responseData.site_link);
      Cookies.set("siteTitle", responseData.site_title); // Store site title in cookies
      Cookies.set("siteFavicon", responseData.site_favicon);
      Cookies.set("siteEmail", responseData.site_email);
      Cookies.set("captchaKey", responseData.captcha_public_key);
      Cookies.set("primaryColor", responseData.primary_color);
      Cookies.set("secondaryColor", responseData.secondary_color);
      Cookies.set("mapKey", responseData.map_key);
      Cookies.set("curr", responseData.curr);
      Cookies.set("stripe_pk", responseData.stripe_key);

      // Set document title
      document.title = responseData.site_title;
    } catch (error) {
      console.log("Error getting constant information:", error);
    }
  };

  const getMeteData = async () => {
    try {
      const response = await axios.get(BaseApi + "/getMetaData");

      // console.log(response.data.response);

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

    // console.log(baseApi, "API");

    if (url.includes("/users/confirmation")) {
      // console.log("The URL contains email link.");
      let actualURLFirstPart = `/users`;
      let secondURLfetch = url.split("/users");
      let actualURLSecondPart = secondURLfetch[1];

      let actualURL = actualURLFirstPart + actualURLSecondPart;
      // console.log(actualURL);
      // window.location.href = actualURL;
      handleMailURL(actualURL);

      // console.log(actualURLSecondPart);
    }
    if (url.includes("/candidates/resetPassword")) {
      // console.log("The URL contains reset link.");
      let URLSplit = url.split("/candidates/resetPassword"); // This is spliting the total URL into two parts from /candidates. The left side of /candidates has the BASE API and the right side has the remaining link.
      let URLRightPart = URLSplit[1]; // Here the acctual part of the link is achieved, that is the right part of the link. Now we need to get data from this part of the link

      console.log(URLRightPart);

      // Remove the leading "/" and split the URL by "/"
      const parts = URLRightPart.slice(1).split("/");

      // Extract values
      const id = parts[0];
      const md5id = parts[1];
      const email = parts[2];

      // console.log("id:", id);
      // console.log("mdid:", md5id);
      // console.log("email:", email);

      // Construct the URL using the dynamic base API
      const resetPasswordURL = `${baseApi}/users/resetPassword/${id}/${md5id}/${email}`;

      // console.log(resetPasswordURL);

      // Use the constructed URL
      window.location.href = resetPasswordURL;

      // window.location.href = `/users/resetPassword/${id}/${md5id}/${email}`;
    }
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (window.location.href.includes("/admin")) {
  //       try {
  //           const response = await axios.post(
  //             BaseApi + "/admin/getadminroles",
  //             null,
  //             {
  //               headers: {
  //                 "Content-Type": "application/json",
  //                 key: ApiKey,
  //                 token: tokenKey,
  //                 adminid: adminID,
  //               },
  //             }
  //           );
          

  //         console.log(response.data);

  //         let access = JSON.stringify(response.data.response.access);
  //         console.log(access);
  //         Cookies.set("access", access);
  //       } catch (error) {
  //         console.error("Error fetching data: ", error.message);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [window.location.href]);

  useEffect(() => {
    const fetchData = async () => {
      if (window.location.href.includes("/admin")) {
        try {
          const response = await axios.post(
            BaseApi + "/admin/getadminroles",
            null,
            {
              headers: {
                "Content-Type": "application/json",
                key: ApiKey,
                token: tokenKey,
                adminid: adminID,
              },
            }
          );

          // console.log(response.data);

          let access = JSON.stringify(response.data.response.access);
          console.log(access);
          Cookies.set("access", access);
        } catch (error) {
          console.error("Error fetching data: ", error.message);
        }
      }
    };

    fetchData(); // Fetch immediately on mount

    const intervalId = setInterval(fetchData, 4000); // Set interval for fetching every 4 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [BaseApi, ApiKey, tokenKey, adminID]);

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

  const [faviconURL, setFaviconURL] = useState("");

  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const response = await axios.get(BaseApi + "/getconstant");
        const faviconUrl = response.data.response.site_favicon;

        // Create a new link element for the favicon
        const link =
          document.querySelector("link[rel*='icon']") ||
          document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = faviconUrl;

        // Update the HTML head with the new favicon link
        document.head.appendChild(link);

        // Set the favicon URL state
        setFaviconURL(faviconUrl);
      } catch (error) {
        console.error("Error fetching favicon URL:", error);
      }
    };

    fetchFavicon();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* <Route
            path="/admin/jobs/importlistxml"
            element={<APImportJobUpdated />}
          /> */}
          <Route
            path="/admin/jobs/importlistxml"
            element={
              <Suspense fallback={<Loading />}>
                <APImportJobUpdated />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/jobs/importlistupdated"
            element={<APImportJobElements />}
          /> */}
          <Route
            path="/admin/jobs/importlistupdated"
            element={
              <Suspense fallback={<Loading />}>
                <APImportJobElements />
              </Suspense>
            }
          />

          {/* <Route
            path="/users/confirmation/:slug1/:slug2/:slug3"
            element={<BlankPage />}
          /> */}
          <Route
            path="/users/confirmation/:slug1/:slug2/:slug3"
            element={
              <Suspense fallback={<Loading />}>
                <BlankPage />
              </Suspense>
            }
          />

          {/* <Route
            path="//candidates/resetPassword/:slug1/:slug2/:slug3"
            element={<BlankPage />}
          /> */}
          <Route
            path="//candidates/resetPassword/:slug1/:slug2/:slug3"
            element={
              <Suspense fallback={<Loading />}>
                <BlankPage />
              </Suspense>
            }
          />

          {/* Stripe */}
          {/* <Route path="/paymentwithstripe/success" element={<Success />} /> */}
          <Route
            path="/paymentwithstripe/success"
            element={
              <Suspense fallback={<Loading />}>
                <Success />
              </Suspense>
            }
          />

          {/* <Route
            path="/paymentwithstripe/checkout"
            element={<CheckoutForm />}
          /> */}
          <Route
            path="/paymentwithstripe/checkout"
            element={
              <Suspense fallback={<Loading />}>
                <CheckoutForm />
              </Suspense>
            }
          />

          {/* <Route
            path="/payment/paymentoption/:slug"
            element={<PaymentOption />}
          /> */}
          <Route
            path="/payment/paymentoption/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <PaymentOption />
              </Suspense>
            }
          />

          <Route path="*" element={<Error />} />
          {/* <Route path="/" element={<UserPage />} /> */}
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <UserPage />
              </Suspense>
            }
          />
          {/* <Route path="/aboutus" element={<AboutUs />} /> */}
          <Route
            path="/aboutus"
            element={
              <Suspense fallback={<Loading />}>
                <AboutUs />
              </Suspense>
            }
          />

          {/* <Route path="/how-it-works" element={<HowItWorks />} /> */}
          <Route
            path="/how-it-works"
            element={
              <Suspense fallback={<Loading />}>
                <HowItWorks />
              </Suspense>
            }
          />

          {/* <Route path="/faq" element={<Faq />} /> */}
          <Route
            path="/faq"
            element={
              <Suspense fallback={<Loading />}>
                <Faq />
              </Suspense>
            }
          />

          {/* <Route path="/blog" element={<BlogPage />} /> */}
          <Route
            path="/blog"
            element={
              <Suspense fallback={<Loading />}>
                <BlogPage />
              </Suspense>
            }
          />

          {/* <Route path="/dynamicblogpage/:slug" element={<DynamicBlogPage />} /> */}
          <Route
            path="/dynamicblogpage/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <DynamicBlogPage />
              </Suspense>
            }
          />

          {/* <Route path="/searchjob" element={<SearchJobPage />} /> */}
          <Route
            path="/searchjob"
            element={
              <Suspense fallback={<Loading />}>
                <SearchJobPage />
              </Suspense>
            }
          />

          {/* <Route path="/jobs/searchjob/:slug" element={<SearchJobPage />} /> */}
          <Route
            path="/jobs/searchjob/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <SearchJobPage />
              </Suspense>
            }
          />

          {/* <Route
            path="/jobdescription/:slug/:catslug"
            element={<JobDescription />}
          /> */}
          <Route
            path="/jobdescription/:slug/:catslug"
            element={
              <Suspense fallback={<Loading />}>
                <JobDescription />
              </Suspense>
            }
          />

          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route
            path="/contact"
            element={
              <Suspense fallback={<Loading />}>
                <Contact />
              </Suspense>
            }
          />

          {/* <Route path="/allcategory" element={<AllCategoryPage />} /> */}
          <Route
            path="/allcategory"
            element={
              <Suspense fallback={<Loading />}>
                <AllCategoryPage />
              </Suspense>
            }
          />

          {/* <Route path="/companyprofile/:slug" element={<CompanyProfile />} /> */}
          <Route
            path="/companyprofile/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <CompanyProfile />
              </Suspense>
            }
          />

          {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<Loading />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />

          {/* <Route path="/sitemap" element={<SiteMap />} /> */}
          <Route
            path="/sitemap"
            element={
              <Suspense fallback={<Loading />}>
                <SiteMap />
              </Suspense>
            }
          />

          {/* <Route path="/terms-and-conditions" element={<TermsConditions />} /> */}
          <Route
            path="/terms_and_conditions"
            element={
              <Suspense fallback={<Loading />}>
                <TermsConditions />
              </Suspense>
            }
          />

          {/* <Route path="/companies" element={<Companies />} /> */}
          <Route
            path="/companies"
            element={
              <Suspense fallback={<Loading />}>
                <Companies />
              </Suspense>
            }
          />
          {/* 
          <Route path="/career-tools" element={<CareerTools />} /> */}
          <Route
            path="/career-tools"
            element={
              <Suspense fallback={<Loading />}>
                <CareerTools />
              </Suspense>
            }
          />

          {/* <Route path="/career-resources" element={<CareerResources />} /> */}
          <Route
            path="/career-resources"
            element={
              <Suspense fallback={<Loading />}>
                <CareerResources />
              </Suspense>
            }
          />

          {/* <Route path="/benefits" element={<Benefits />} /> */}
          <Route
            path="/benefits"
            element={
              <Suspense fallback={<Loading />}>
                <Benefits />
              </Suspense>
            }
          />

          {/* <Route path="/terms_and_conditions" element={<TermsConditions />} /> */}

          {/* Employer Authentication */}
          {employerAuthentication ? (
            <Route
              path="/user/employerlogin"
              element={<Navigate to="/user/myprofile" />}
            />
          ) : (
            // <Route path="/user/employerlogin" element={<EmployerLogin />} />
            <Route
              path="/user/employerlogin"
              element={
                <Suspense fallback={<Loading />}>
                  <EmployerLogin />
                </Suspense>
              }
            />
          )}
          {employerAuthentication ? (
            <Route
              path="/user/jobseekerlogin"
              element={<Navigate to="/user/myprofile" />}
            />
          ) : (
            // <Route path="/user/employerlogin" element={<EmployerLogin />} />
            <Route
              path="/user/employerlogin"
              element={
                <Suspense fallback={<Loading />}>
                  <EmployerLogin />
                </Suspense>
              }
            />
          )}

          {/* Authentication for Jobseeker Login */}
          {jobseekerAuthentication ? (
            <Route
              path="/user/jobseekerlogin"
              element={<Navigate to="/candidates/myaccount" />}
            />
          ) : (
            // <Route path="/user/jobseekerlogin" element={<JobseekerLogin />} />
            <Route
              path="/user/jobseekerlogin"
              element={
                <Suspense fallback={<Loading />}>
                  <JobseekerLogin />
                </Suspense>
              }
            />
          )}
          {jobseekerAuthentication ? (
            <Route
              path="/user/employerlogin"
              element={<Navigate to="/candidates/myaccount" />}
            />
          ) : (
            // <Route path="/user/jobseekerlogin" element={<JobseekerLogin />} />
            <Route
              path="/user/jobseekerlogin"
              element={
                <Suspense fallback={<Loading />}>
                  <JobseekerLogin />
                </Suspense>
              }
            />
          )}

          {/* <Route path="/user/employerlogin" element={<EmployerLogin />} /> */}

          {/* <Route path="/user/jobseekerlogin" element={<JobseekerLogin />} /> */}

          {/* <Route
            path="/user/register/employer"
            element={<EmployerRegister />}
          /> */}
          <Route
            path="/user/register/employer"
            element={
              <Suspense fallback={<Loading />}>
                <EmployerRegister />
              </Suspense>
            }
          />

          {/* <Route
            path="/user/register/jobseeker"
            element={<JobseekerRegister />}
          /> */}
          <Route
            path="/user/register/jobseeker"
            element={
              <Suspense fallback={<Loading />}>
                <JobseekerRegister />
              </Suspense>
            }
          />

          {/* <Route path="/users/forgotPassword" element={<ForgotPassword />} /> */}
          <Route
            path="/users/forgotPassword"
            element={
              <Suspense fallback={<Loading />}>
                <ForgotPassword />
              </Suspense>
            }
          />

          {/* <Route
            path="/users/resetPassword/:slug1/:slug2/:slug3"
            element={<ResetPassword />}
          /> */}
          <Route
            path="/users/resetPassword/:slug1/:slug2/:slug3"
            element={
              <Suspense fallback={<Loading />}>
                <ResetPassword />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/listing" element={<Jobseekers />} /> */}
          <Route
            path="/candidates/listing"
            element={
              <Suspense fallback={<Loading />}>
                <Jobseekers />
              </Suspense>
            }
          />

          {/* <Route path="/user/createjob" element={<CreateJob />} /> */}
          <Route
            path="/user/createjob"
            element={
              <Suspense fallback={<Loading />}>
                <CreateJob />
              </Suspense>
            }
          />

          {/* <Route path="/user/managejob" element={<ManageJob />} /> */}
          <Route
            path="/user/managejob"
            element={
              <Suspense fallback={<Loading />}>
                <ManageJob />
              </Suspense>
            }
          />

          {/* <Route
            path="/user/managejob/accdetail/:slug"
            element={<InnerAccountdetail />}
          /> */}
          <Route
            path="/user/managejob/accdetail/:slug"
            element={
              <Suspense fallback={<Loading />}>
                {" "}
                <InnerAccountdetail />
              </Suspense>
            }
          />

          {/* <Route path="/job/edit/:slug" element={<DetailEditInner />} /> */}
          <Route
            path="/job/edit/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <DetailEditInner />
              </Suspense>
            }
          />

          {/* <Route path="/jobs/createJob/:slug" element={<CopyJob />} /> */}
          <Route
            path="/jobs/createJob/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <CopyJob />
              </Suspense>
            }
          />

          {/* <Route path="/user/paymenthistory" element={<PaymentHistory />} /> */}
          <Route
            path="/user/paymenthistory"
            element={
              <Suspense fallback={<Loading />}>
                <PaymentHistory />
              </Suspense>
            }
          />

          {/* <Route path="/user/favouritelist" element={<FavouriteList />} /> */}
          <Route
            path="/user/favouritelist"
            element={
              <Suspense fallback={<Loading />}>
                <FavouriteList />
              </Suspense>
            }
          />

          {/* <Route
            path="/candidates/profile/:slug"
            element={<FavouriteListProfile />}
          /> */}
          <Route
            path="/candidates/profile/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <FavouriteListProfile />
              </Suspense>
            }
          />

          {/* <Route path="/user/importjobseekers" element={<ImportJobseekers />} /> */}
          <Route
            path="/user/importjobseekers"
            element={
              <Suspense fallback={<Loading />}>
                <ImportJobseekers />
              </Suspense>
            }
          />

          {/* <Route path="/user/mailhistory" element={<MailHistory />} /> */}
          <Route
            path="/user/mailhistory"
            element={
              <Suspense fallback={<Loading />}>
                <MailHistory />
              </Suspense>
            }
          />

          {/* <Route path="/user/maildetail/:slug" element={<MailDetail />} /> */}
          <Route
            path="/user/maildetail/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <MailDetail />
              </Suspense>
            }
          />

          {/* <Route path="/user/myprofile" element={<MyProfileNew />} /> */}
          <Route
            path="/user/myprofile"
            element={
              <Suspense fallback={<Loading />}>
                <MyProfileNew />
              </Suspense>
            }
          />

          {/* <Route path="/plans/purchase" element={<InnerMembershipPlan />} /> */}
          <Route
            path="/plans/purchase"
            element={
              <Suspense fallback={<Loading />}>
                <InnerMembershipPlan />
              </Suspense>
            }
          />

          {/* <Route path="/user/editprofile" element={<EditProfile />} /> */}
          <Route
            path="/user/editprofile"
            element={
              <Suspense fallback={<Loading />}>
                <EditProfile />
              </Suspense>
            }
          />

          {/* <Route path="/user/changepassword" element={<ChangePassword />} /> */}
          <Route
            path="/user/changepassword"
            element={
              <Suspense fallback={<Loading />}>
                <ChangePassword />
              </Suspense>
            }
          />
          {/* <Route path="/user/changelogo" element={<ChangeLogo />} /> */}
          <Route
            path="/user/changelogo"
            element={
              <Suspense fallback={<Loading />}>
                <ChangeLogo />
              </Suspense>
            }
          />

          {/* <Route path="/user/deleteaccount" element={<DeleteAccount />} /> */}
          <Route
            path="/user/deleteaccount"
            element={
              <Suspense fallback={<Loading />}>
                <DeleteAccount />
              </Suspense>
            }
          />

          {/* Jobseekers */}
          {/* <Route path="/candidates/myaccount" element={<JSMyProfile />} /> */}
          <Route
            path="/candidates/myaccount"
            element={
              <Suspense fallback={<Loading />}>
                <JSMyProfile />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/editprofile" element={<JSEditProfile />} /> */}
          <Route
            path="/candidates/editprofile"
            element={
              <Suspense fallback={<Loading />}>
                <JSEditProfile />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/editEducation" element={<JSEducation />} /> */}
          <Route
            path="/candidates/editEducation"
            element={
              <Suspense fallback={<Loading />}>
                <JSEducation />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/editExperience" element={<JSExperience />} /> */}
          <Route
            path="/candidates/editExperience"
            element={
              <Suspense fallback={<Loading />}>
                <JSExperience />
              </Suspense>
            }
          />

          {/* <Route
            path="/candidates/editProfessional"
            element={<JSProfessionalRegistration />}
          /> */}
          <Route
            path="/candidates/editProfessional"
            element={
              <Suspense fallback={<Loading />}>
                <JSProfessionalRegistration />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/addvideocv" element={<JSVideoCV />} /> */}
          <Route
            path="/candidates/addvideocv"
            element={
              <Suspense fallback={<Loading />}>
                <JSVideoCV />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/makecv" element={<JSMakeCV />} /> */}
          <Route
            path="/candidates/makecv"
            element={
              <Suspense fallback={<Loading />}>
                <JSMakeCV />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/addcvdocuments" element={<JSAddDocuments />} /> */}
          <Route
            path="/candidates/addcvdocuments"
            element={
              <Suspense fallback={<Loading />}>
                <JSAddDocuments />
              </Suspense>
            }
          />

          {/* <Route path="/payments/history" element={<JSPaymentHistory />} /> */}
          <Route
            path="/payments/history"
            element={
              <Suspense fallback={<Loading />}>
                <JSPaymentHistory />
              </Suspense>
            }
          />

          {/* <Route path="/alerts/index" element={<JSManageAlerts />} /> */}
          <Route
            path="/alerts/index"
            element={
              <Suspense fallback={<Loading />}>
                <JSManageAlerts />
              </Suspense>
            }
          />

          {/* <Route path="/alerts/add" element={<JSAddAlert />} /> */}
          <Route
            path="/alerts/add"
            element={
              <Suspense fallback={<Loading />}>
                <JSAddAlert />
              </Suspense>
            }
          />

          {/* <Route path="/alerts/edit/:slug" element={<JSEditAlert />} /> */}
          <Route
            path="/alerts/edit/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <JSEditAlert />
              </Suspense>
            }
          />

          {/* <Route path="/jobs/savedjobs" element={<JSSavedJobs />} /> */}
          <Route
            path="/jobs/savedjobs"
            element={
              <Suspense fallback={<Loading />}>
                <JSSavedJobs />
              </Suspense>
            }
          />

          {/* <Route path="/jobs/applied" element={<JSAppliedJobs />} /> */}
          <Route
            path="/jobs/applied"
            element={
              <Suspense fallback={<Loading />}>
                <JSAppliedJobs />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/mailhistory" element={<JSMailHistory />} /> */}
          <Route
            path="/candidates/mailhistory"
            element={
              <Suspense fallback={<Loading />}>
                <JSMailHistory />
              </Suspense>
            }
          />

          {/* <Route
            path="/candidates/maildetail/:slug"
            element={<JSMailDetail />}
          /> */}
          <Route
            path="/candidates/maildetail/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <JSMailDetail />
              </Suspense>
            }
          />

          {/* <Route
            path="/candidates/changepassword"
            element={<JSChangePassword />}
          /> */}
          <Route
            path="/candidates/changepassword"
            element={
              <Suspense fallback={<Loading />}>
                <JSChangePassword />
              </Suspense>
            }
          />

          {/* <Route path="/candidates/uploadPhoto" element={<JSChangePhoto />} /> */}
          <Route
            path="/candidates/uploadPhoto"
            element={
              <Suspense fallback={<Loading />}>
                <JSChangePhoto />
              </Suspense>
            }
          />

          {/* <Route
            path="/candidates/deleteAccount"
            element={<JSDeleteAccount />}
          /> */}
          <Route
            path="/candidates/deleteAccount"
            element={
              <Suspense fallback={<Loading />}>
                <JSDeleteAccount />
              </Suspense>
            }
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
            // <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<Loading />}>
                  <AdminLogin />
                </Suspense>
              }
            />
          )}

          {/* Admin Dashboard */}
          {/* <Route path="/admin/admins/dashboard" element={<Dashboard />} /> */}
          <Route
            path="/admin/admins/dashboard"
            element={
              <Suspense fallback={<Loading />}>
                <Dashboard />
              </Suspense>
            }
          />

          {/* Configuration */}
          {/* <Route
            path="/admin/admins/changeusername"
            element={<APChangeUsername />}
          /> */}
          <Route
            path="/admin/admins/changeusername"
            element={
              <Suspense fallback={<Loading />}>
                <APChangeUsername />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/changepassword"
            element={<APChangePassword />}
          /> */}
          <Route
            path="/admin/admins/changepassword"
            element={
              <Suspense fallback={<Loading />}>
                <APChangePassword />
              </Suspense>
            }
          />

          {/* <Route path="/admin/admins/changeemail" element={<APChangeEmail />} /> */}
          <Route
            path="/admin/admins/changeemail"
            element={
              <Suspense fallback={<Loading />}>
                <APChangeEmail />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/securityQuestions"
            element={<APSecurityQuestions />}
          /> */}
          <Route
            path="/admin/admins/securityQuestions"
            element={
              <Suspense fallback={<Loading />}>
                <APSecurityQuestions />
              </Suspense>
            }
          />

          {/* <Route path="/admin/plans/index" element={<APManagePlans />} /> */}
          <Route
            path="/admin/plans/index"
            element={
              <Suspense fallback={<Loading />}>
                <APManagePlans />
              </Suspense>
            }
          />

          {/* <Route path="/admin/plans/addplan" element={<APAddPlan />} /> */}
          <Route
            path="/admin/plans/addplan"
            element={
              <Suspense fallback={<Loading />}>
                <APAddPlan />
              </Suspense>
            }
          />

          {/* <Route path="/admin/plans/editPlan/:slug" element={<APEditPlan />} /> */}
          <Route
            path="/admin/plans/editPlan/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditPlan />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/settings"
            element={<APSetContactAddress />}
          /> */}
          <Route
            path="/admin/admins/settings"
            element={
              <Suspense fallback={<Loading />}>
                <APSetContactAddress />
              </Suspense>
            }
          />

          {/* <Route path="/admin/admins/changeSlogan" element={<APSloganText />} /> */}
          <Route
            path="/admin/admins/changeSlogan"
            element={
              <Suspense fallback={<Loading />}>
                <APSloganText />
              </Suspense>
            }
          />

          {/* <Route path="/admin/admins/uploadLogo" element={<APChangeLogo />} /> */}
          <Route
            path="/admin/admins/uploadLogo"
            element={
              <Suspense fallback={<Loading />}>
                <APChangeLogo />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/changecolorscheme"
            element={<APChangeColorTheme />}
          /> */}
          <Route
            path="/admin/admins/changecolorscheme"
            element={
              <Suspense fallback={<Loading />}>
                <APChangeColorTheme />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/changePaymentdetail"
            element={<APChangePaymentDetail />}
          /> */}
          <Route
            path="/admin/admins/changePaymentdetail"
            element={
              <Suspense fallback={<Loading />}>
                <APChangePaymentDetail />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/changeFavicon"
            element={<APChangeFavicon />}
          /> */}
          <Route
            path="/admin/admins/changeFavicon"
            element={
              <Suspense fallback={<Loading />}>
                <APChangeFavicon />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/metaManagement"
            element={<APMetaManagement />}
          /> */}
          <Route
            path="/admin/admins/metaManagement"
            element={
              <Suspense fallback={<Loading />}>
                <APMetaManagement />
              </Suspense>
            }
          />

          {/* <Route path="/admin/admins/manage" element={<APManageSubAdmins />} /> */}
          <Route
            path="/admin/admins/manage"
            element={
              <Suspense fallback={<Loading />}>
                <APManageSubAdmins />
              </Suspense>
            }
          />

          {/* <Route path="/admin/admins/addsubadmin" element={<APAddSubAdmin />} /> */}
          <Route
            path="/admin/admins/addsubadmin"
            element={
              <Suspense fallback={<Loading />}>
                <APAddSubAdmin />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/editadmins/:slug"
            element={<APEditSubAdmin />}
          /> */}
          <Route
            path="/admin/admins/editadmins/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditSubAdmin />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/admins/managerole/:slug"
            element={<APManageRoles />}
          /> */}
          <Route
            path="/admin/admins/managerole/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APManageRoles />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/smtpsettings/configuration"
            element={<APSMTPsettings />}
          /> */}
          <Route
            path="/admin/smtpsettings/configuration"
            element={
              <Suspense fallback={<Loading />}>
                <APSMTPsettings />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/settings/siteSettings"
            element={<APSiteSetting />}
          /> */}
          <Route
            path="/admin/settings/siteSettings"
            element={
              <Suspense fallback={<Loading />}>
                <APSiteSetting />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/settings/manageMails"
            element={<APManageEmailSetting />}
          /> */}
          <Route
            path="/admin/settings/manageMails"
            element={
              <Suspense fallback={<Loading />}>
                <APManageEmailSetting />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/settings/editMails/:slug"
            element={<APEditEmailSetting />}
          /> */}
          <Route
            path="/admin/settings/editMails/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditEmailSetting />
              </Suspense>
            }
          />

          {/* Employer */}
          {/* <Route path="/admin/users/addusers" element={<APAddEmployer />} /> */}
          <Route
            path="/admin/users/addusers"
            element={
              <Suspense fallback={<Loading />}>
                <APAddEmployer />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/users/editusers/:slug"
            element={<APEditEmployerDetails />}
          /> */}
          <Route
            path="/admin/users/editusers/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditEmployerDetails />
              </Suspense>
            }
          />

          {/* <Route path="/admin/users" element={<APEmployerList />} /> */}
          <Route
            path="/admin/users"
            element={
              <Suspense fallback={<Loading />}>
                <APEmployerList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/users/selectforslider"
            element={<HomePageSlider />}
          /> */}
          <Route
            path="/admin/users/selectforslider"
            element={
              <Suspense fallback={<Loading />}>
                <HomePageSlider />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/users/addhomepageslider"
            element={<APHomePageSlider />}
          /> */}
          <Route
            path="/admin/users/addhomepageslider"
            element={
              <Suspense fallback={<Loading />}>
                <APHomePageSlider />
              </Suspense>
            }
          />

          {/* Jobseeker */}
          {/* <Route
            path="/admin/candidates/addcandidates"
            element={<APAddJobseekers />}
          /> */}
          <Route
            path="/admin/candidates/addcandidates"
            element={
              <Suspense fallback={<Loading />}>
                <APAddJobseekers />
              </Suspense>
            }
          />

          {/* <Route path="/admin/candidates" element={<APJobseekerList />} /> */}
          <Route
            path="/admin/candidates"
            element={
              <Suspense fallback={<Loading />}>
                <APJobseekerList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/candidates/certificates/:slug"
            element={<APManageCertificate />}
          /> */}
          <Route
            path="/admin/candidates/certificates/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APManageCertificate />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/jobs/applied/:slug"
            element={<APAppliedJobsList />}
          /> */}
          <Route
            path="/admin/jobs/applied/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APAppliedJobsList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/candidates/editcandidates/:slug"
            element={<APEditJobseeker />}
          /> */}
          <Route
            path="/admin/candidates/editcandidates/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditJobseeker />
              </Suspense>
            }
          />

          {/* Categories */}
          {/* <Route
            path="/admin/categories/addcategory"
            element={<APAddCategory />}
          /> */}
          <Route
            path="/admin/categories/addcategory"
            element={
              <Suspense fallback={<Loading />}>
                <APAddCategory />
              </Suspense>
            }
          />

          {/* <Route path="/admin/categories" element={<APCategoryList />} /> */}
          <Route
            path="/admin/categories"
            element={
              <Suspense fallback={<Loading />}>
                <APCategoryList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/categories/addsubcat/:slug"
            element={<APAddSubCategory />}
          /> */}
          <Route
            path="/admin/categories/addsubcat/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APAddSubCategory />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/categories/subindex/:slug"
            element={<SubCategoryList />}
          /> */}
          <Route
            path="/admin/categories/subindex/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <SubCategoryList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/categories/editsubcat/:slug1/:slug2"
            element={<APEditSubCategory />}
          /> */}
          <Route
            path="/admin/categories/editsubcat/:slug1/:slug2"
            element={
              <Suspense fallback={<Loading />}>
                <APEditSubCategory />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/categories/editcategory/:slug"
            element={<APEditCategory />}
          /> */}
          <Route
            path="/admin/categories/editcategory/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditCategory />
              </Suspense>
            }
          />

          {/* Swear Words */}
          {/* <Route path="/admin/swears/addswears" element={<APAddSwearWords />} /> */}
          <Route
            path="/admin/swears/addswears"
            element={
              <Suspense fallback={<Loading />}>
                <APAddSwearWords />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/swears/editswear/:slug"
            element={<APEditSwearWords />}
          /> */}
          <Route
            path="/admin/swears/editswear/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditSwearWords />
              </Suspense>
            }
          />

          {/* <Route path="/admin/swears" element={<APSwearWordsList />} /> */}
          <Route
            path="/admin/swears"
            element={
              <Suspense fallback={<Loading />}>
                <APSwearWordsList />
              </Suspense>
            }
          />

          {/* Skills */}
          {/* <Route path="/admin/skills/addskills" element={<APAddSkills />} /> */}
          <Route
            path="/admin/skills/addskills"
            element={
              <Suspense fallback={<Loading />}>
                <APAddSkills />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/skills/editskill/:slug"
            element={<APEditSkills />}
          /> */}
          <Route
            path="/admin/skills/editskill/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditSkills />
              </Suspense>
            }
          />

          {/* <Route path="/admin/skills" element={<APSkillsList />} /> */}
          <Route
            path="/admin/skills"
            element={
              <Suspense fallback={<Loading />}>
                <APSkillsList />
              </Suspense>
            }
          />

          {/* Designations */}
          {/* <Route path="/admin/designations" element={<APDesignationsList />} /> */}
          <Route
            path="/admin/designations"
            element={
              <Suspense fallback={<Loading />}>
                <APDesignationsList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/designations/adddesignations"
            element={<APAddDesignations />}
          /> */}
          <Route
            path="/admin/designations/adddesignations"
            element={
              <Suspense fallback={<Loading />}>
                <APAddDesignations />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/designations/editdesignation/:slug"
            element={<APEditDesignations />}
          /> */}
          <Route
            path="/admin/designations/editdesignation/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditDesignations />
              </Suspense>
            }
          />

          {/* Jobs */}
          {/* <Route path="/admin/jobs" element={<APJobsList />} /> */}
          <Route
            path="/admin/jobs"
            element={
              <Suspense fallback={<Loading />}>
                <APJobsList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/jobs/addjob" element={<APAddJob />} /> */}
          <Route
            path="/admin/jobs/addjob"
            element={
              <Suspense fallback={<Loading />}>
                <APAddJob />
              </Suspense>
            }
          />

          {/* <Route path="/admin/jobs/editjob/:slug" element={<APEditJob />} /> */}
          <Route
            path="/admin/jobs/editjob/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditJob />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/jobs/candidates/:slug"
            element={<APInternalJobList />}
          /> */}
          <Route
            path="/admin/jobs/candidates/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APInternalJobList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/jobs/addjob/copy/:slug" element={<APCopyJob />} /> */}
          <Route
            path="/admin/jobs/addjob/copy/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APCopyJob />
              </Suspense>
            }
          />

          {/* <Route path="/admin/jobs/import" element={<APImportJob />} /> */}
          <Route
            path="/admin/jobs/import"
            element={
              <Suspense fallback={<Loading />}>
                <APImportJob />
              </Suspense>
            }
          />
          <Route
            path="/admin/jobs/csv-upload"
            element={
              <Suspense fallback={<Loading />}>
                <ImportCSVJob />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/jobs/importlist"
            element={<APAutoJobImportList />}
          /> */}
          <Route
            path="/admin/jobs/importlist"
            element={
              <Suspense fallback={<Loading />}>
                <APAutoJobImportList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/jobs/newimportjob" element={<APNewImportJob />} /> */}
          <Route
            path="/admin/jobs/newimportjob"
            element={
              <Suspense fallback={<Loading />}>
                <APNewImportJob />
              </Suspense>
            }
          />

          {/* Payment History */}
          {/* <Route
            path="/admin/payments/history"
            element={<APTransactionList />}
          /> */}
          <Route
            path="/admin/payments/history"
            element={
              <Suspense fallback={<Loading />}>
                <APTransactionList />
              </Suspense>
            }
          />

          {/* Currency */}
          {/* <Route path="/admin/currencies" element={<APCurrencyList />} /> */}
          <Route
            path="/admin/currencies"
            element={
              <Suspense fallback={<Loading />}>
                <APCurrencyList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/currencies/add" element={<APAddCurrency />} /> */}
          <Route
            path="/admin/currencies/add"
            element={
              <Suspense fallback={<Loading />}>
                <APAddCurrency />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/currencies/edit/:slug"
            element={<APEditCurrency />}
          /> */}
          <Route
            path="/admin/currencies/edit/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditCurrency />
              </Suspense>
            }
          />

          {/* Manage Newsletter */}
          {/* <Route
            path="/admin/newsletters/index"
            element={<APNewsletterList />}
          /> */}
          <Route
            path="/admin/newsletters/index"
            element={
              <Suspense fallback={<Loading />}>
                <APNewsletterList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/newsletters/addNewsletter"
            element={<APAddNewsletter />}
          /> */}
          <Route
            path="/admin/newsletters/addNewsletter"
            element={
              <Suspense fallback={<Loading />}>
                <APAddNewsletter />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/newsletters/editNewsletter/:slug"
            element={<APEditNewsletter />}
          /> */}
          <Route
            path="/admin/newsletters/editNewsletter/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditNewsletter />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/newsletters/sendNewsletter"
            element={<APSendNewsLetterEmail />}
          /> */}
          <Route
            path="/admin/newsletters/sendNewsletter"
            element={
              <Suspense fallback={<Loading />}>
                <APSendNewsLetterEmail />
              </Suspense>
            }
          />

          {/* <Route path="/admin/newsletters/sentMail" element={<APEmailLogs />} /> */}
          <Route
            path="/admin/newsletters/sentMail"
            element={
              <Suspense fallback={<Loading />}>
                <APEmailLogs />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/newsletters/unsubscriberlist"
            element={<APUnsubscribeUserlist />}
          /> */}
          <Route
            path="/admin/newsletters/unsubscriberlist"
            element={
              <Suspense fallback={<Loading />}>
                <APUnsubscribeUserlist />
              </Suspense>
            }
          />

          {/* Banner Advertisement */}
          {/* <Route
            path="/admin/banneradvertisements"
            element={<APBannerList />}
          /> */}
          <Route
            path="/admin/banneradvertisements"
            element={
              <Suspense fallback={<Loading />}>
                <APBannerList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/banneradvertisements/addBanneradvertisement"
            element={<APAddBanner />}
          /> */}
          <Route
            path="/admin/banneradvertisements/addBanneradvertisement"
            element={
              <Suspense fallback={<Loading />}>
                <APAddBanner />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/banneradvertisements/editBanneradvertisement/:slug"
            element={<APEditBanner />}
          /> */}
          <Route
            path="/admin/banneradvertisements/editBanneradvertisement/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditBanner />
              </Suspense>
            }
          />

          {/* Course */}
          {/* <Route path="/admin/courses" element={<APCourseList />} /> */}
          <Route
            path="/admin/courses"
            element={
              <Suspense fallback={<Loading />}>
                <APCourseList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/courses/addcourse" element={<APAddCourse />} /> */}
          <Route
            path="/admin/courses/addcourse"
            element={
              <Suspense fallback={<Loading />}>
                <APAddCourse />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/courses/editcourse/:slug"
            element={<APEditCourse />}
          /> */}
          <Route
            path="/admin/courses/editcourse/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditCourse />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/specializations/index/:slug"
            element={<APSpecializationList />}
          /> */}
          <Route
            path="/admin/specializations/index/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APSpecializationList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/specializations/addspecialization/:slug"
            element={<APAddSpecialization />}
          /> */}
          <Route
            path="/admin/specializations/addspecialization/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APAddSpecialization />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/specializations/editspecialization/:slug1/:slug2"
            element={<APEditSpecializations />}
          /> */}
          <Route
            path="/admin/specializations/editspecialization/:slug1/:slug2"
            element={
              <Suspense fallback={<Loading />}>
                <APEditSpecializations />
              </Suspense>
            }
          />

          {/* Content */}
          {/* <Route path="/admin/pages/index" element={<APTextPages />} /> */}
          <Route
            path="/admin/pages/index"
            element={
              <Suspense fallback={<Loading />}>
                <APTextPages />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/pages/editPage/:slug"
            element={<APEditPageDetail />}
          /> */}
          <Route
            path="/admin/pages/editPage/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditPageDetail />
              </Suspense>
            }
          />

          {/* Email Template */}
          {/* <Route
            path="/admin/emailtemplates"
            element={<APEmailTemplateSetting />}
          /> */}
          <Route
            path="/admin/emailtemplates"
            element={
              <Suspense fallback={<Loading />}>
                <APEmailTemplateSetting />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/emailtemplates/editEmailtemplate/:slug"
            element={<APEditEmailTemplate />}
          /> */}
          <Route
            path="/admin/emailtemplates/editEmailtemplate/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditEmailTemplate />
              </Suspense>
            }
          />

          {/* Blogs */}
          {/* <Route path="/admin/blogs" element={<APBlogList />} /> */}
          <Route
            path="/admin/blogs"
            element={
              <Suspense fallback={<Loading />}>
                <APBlogList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/blogs/addblogs" element={<APAddBlog />} /> */}
          <Route
            path="/admin/blogs/addblogs"
            element={
              <Suspense fallback={<Loading />}>
                <APAddBlog />
              </Suspense>
            }
          />

          {/* <Route path="/admin/blogs/editblogs/:slug" element={<APEditBlog />} /> */}
          <Route
            path="/admin/blogs/editblogs/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditBlog />
              </Suspense>
            }
          />

          {/* Sliders */}
          {/* <Route path="/admin/sliders" element={<APSliderList />} /> */}
          <Route
            path="/admin/sliders"
            element={
              <Suspense fallback={<Loading />}>
                <APSliderList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/sliders/add" element={<APAddSlider />} /> */}
          <Route
            path="/admin/sliders/add"
            element={
              <Suspense fallback={<Loading />}>
                <APAddSlider />
              </Suspense>
            }
          />

          {/* <Route path="/admin/sliders/edit/:slug" element={<APEditSlider />} /> */}
          <Route
            path="/admin/sliders/edit/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditSlider />
              </Suspense>
            }
          />

          {/* Announcement */}
          {/* <Route path="/admin/announcements" element={<APAnnouncementList />} /> */}
          <Route
            path="/admin/announcements"
            element={
              <Suspense fallback={<Loading />}>
                <APAnnouncementList />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/announcements/add"
            element={<APAddAnnouncement />}
          /> */}
          <Route
            path="/admin/announcements/add"
            element={
              <Suspense fallback={<Loading />}>
                <APAddAnnouncement />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/announcements/edit/:slug"
            element={<APEditAnnouncement />}
          /> */}
          <Route
            path="/admin/announcements/edit/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditAnnouncement />
              </Suspense>
            }
          />

          {/* Keywords */}
          {/* <Route path="/admin/keywords" element={<APSearchKeywordList />} /> */}
          <Route
            path="/admin/keywords"
            element={
              <Suspense fallback={<Loading />}>
                <APSearchKeywordList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/keywords/add" element={<APAddSearchKeyword />} /> */}
          <Route
            path="/admin/keywords/add"
            element={
              <Suspense fallback={<Loading />}>
                <APAddSearchKeyword />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/keywords/edit/:slug"
            element={<APEditSearchKeyword />}
          /> */}
          <Route
            path="/admin/keywords/edit/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditSearchKeyword />
              </Suspense>
            }
          />

          {/* <Route path="/admin/keywords/jobs" element={<APJobKeywordList />} /> */}
          <Route
            path="/admin/keywords/jobs"
            element={
              <Suspense fallback={<Loading />}>
                <APJobKeywordList />
              </Suspense>
            }
          />

          {/* <Route path="/admin/keywords/addjobs" element={<APAddJobKeyword />} /> */}
          <Route
            path="/admin/keywords/addjobs"
            element={
              <Suspense fallback={<Loading />}>
                <APAddJobKeyword />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/keywords/editjobs/:slug"
            element={<APEditJobKeyword />}
          /> */}
          <Route
            path="/admin/keywords/editjobs/:slug"
            element={
              <Suspense fallback={<Loading />}>
                <APEditJobKeyword />
              </Suspense>
            }
          />

          {/* <Route
            path="/admin/keywords/requests"
            element={<APRequestedKeywordList />}
          /> */}
          <Route
            path="/admin/keywords/requests"
            element={
              <Suspense fallback={<Loading />}>
                <APRequestedKeywordList />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
