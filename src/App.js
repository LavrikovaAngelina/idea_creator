import "./App.css";
import RegistrationForm from './components/auth/RegistrationForm/RegistrationForm.js';
import EmailConfirmation from './components/auth/EmailConfirmation/EmailConfirmation.js'
import VerifyComponent from "./components/auth/VerifyComponent/VerifyComponent.js";
import SignInForm from "./components/auth/SignInForm/SignInForm.js";
import { AppLayout } from "./components/common/Layout/Layout.js";
import { AppLayoutUnauthorized } from "./components/common/LayoutUnauthorized/LayoutUnauthorized.js";
import ResetPasswordForm from "./components/auth/ResetPassword/ResetPassword.js"
import ForgetPasswordForm from "./components/auth/ForgetPassword/ForgetPassword.js"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilesTable from "./components/profiles/ProfilesTable/ProfilesTable.js";
import RolesTable from "./components/roles/RolesTable/RolesTable.js";
import ProjectsPage from "./components/projects/ProjectsPage/ProjectsPage.js";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="sign-up" element={<AppLayoutUnauthorized><RegistrationForm/></AppLayoutUnauthorized>} />
        <Route path="email-confirmation" element={<AppLayoutUnauthorized auth={false}><EmailConfirmation/></AppLayoutUnauthorized>} />
        <Route path="auth/email-verify" element={<AppLayoutUnauthorized><VerifyComponent/></AppLayoutUnauthorized>} />
        <Route path="sign-in" element={<AppLayoutUnauthorized><SignInForm/></AppLayoutUnauthorized>}/>
        <Route path="auth/approve-password-change" element={<AppLayoutUnauthorized><ResetPasswordForm/></AppLayoutUnauthorized>} />
        <Route path="auth/request-password-change" element={<AppLayoutUnauthorized><ForgetPasswordForm/></AppLayoutUnauthorized>} />
        
        <Route path="profiles" element={<AppLayout><ProfilesTable/></AppLayout>} />
        <Route path="roles" element={<AppLayout><RolesTable/></AppLayout>} />
        <Route path="projects" element={<AppLayout><ProjectsPage/></AppLayout>} />
        <Route path="" element={<AppLayout></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
