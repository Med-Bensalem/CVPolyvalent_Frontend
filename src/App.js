import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './Authentification/Login';
import RegisterPage from './Authentification/Register';
import HomePage from './Client/Home';
import ListJobsPage from './Client/List-jobs';
import ContactPage from './Authentification/Contact';
import NoPage from './Authentification/NoPage';
import Dashboard from './Admin/Dashboard';
import Profile from './Admin/Profile';
import Setting from './Admin/Setting';
import SingleJob from './Client/Single-Job';
import ListComptes from './Admin/List-comptes';
import MonCV from './Admin/MonCV';
import AddJob from './Admin/Add-Job';
import Offres from './Admin/Offres';
import SuivieCandidat from './Admin/Suivie-Candidature-candidat';
import SuivieEntreprise from './Admin/Suivie-candidature-Entreprise';
import About from './Admin/About';
import ViewCV from './Admin/ViewCv';
import ListContacts from './Admin/List-contacts';
import ListSecteurs from './Admin/List-secteurs';
import ListTypeEmplois from './Admin/List-type-emplois';
import ListNiveauEtudes from './Admin/List-niveau-etudes';
import ListTypeExperience from './Admin/List-type-experiences';
import EditJob from './Admin/edit-job';
import Protected from "./protected";
import Process from "./Admin/Process";
import ListTests from "./Admin/List-test";
import ListDomaines from "./Admin/List-domaines";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<ListJobsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/single-job/:id" element={<SingleJob />} />

          <Route element={<Protected />}>

            <Route path="/Add-Job" element={<AddJob />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
            <Route path="/offres" element={<Offres />} />
            <Route path="/tests" element={<ListTests />} />

            <Route path="/Entreprise-Suivie/:id" element={<SuivieEntreprise />} />
            <Route path="/Process/:offreId" element={<Process />} />
            <Route path="/about/:id" element={<About />} />
            <Route path="/comptes" element={<ListComptes />} />
            <Route path="/contacts" element={<ListContacts />} />
            <Route path="/secteurs" element={<ListSecteurs />} />
            <Route path="/domaines" element={<ListDomaines />} />
            <Route path="/type-emplois" element={<ListTypeEmplois />} />
            <Route path="/type-experiences" element={<ListTypeExperience />} />
            <Route path="/niveau-etudes" element={<ListNiveauEtudes />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/candidat-Suivie" element={<SuivieCandidat />} />

            <Route path="/visualiser" element={<ViewCV />} />
            <Route path="/cv" element={<MonCV />} />


            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setting" element={<Setting />} />

          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
