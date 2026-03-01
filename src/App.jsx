import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertProvider } from "./contexts/AlertContext";
import CustomAlert from "./components/CustomAlert";
import Ballina from "./components/Ballina";
import ListaPuneve from "./components/ListaPuneve";
import "./index.css";
import ListaKompanive from "./components/ListaKompanive";
import RrethNesh from "./components/RrethNesh";
import Kycja from "./components/Kycja";
import Regjistrimi from "./components/Regjistrimi";
import PublikoPune from "./components/PublikoPune";
import Shpallja from "./components/Shpallja";
import Profili from "./components/Profili";
import VerifikoEmail from "./components/VerifikoEmail";
import Aplikimi from "./components/Aplikimi";
import Footeri from "./components/Footeri";
import MenaxhoShpalljet from "./components/MenaxhoShpalljet";
import KonfigurimetLlogarise from "./components/KonfigurimetLlogarise";
import BallinaMysafir from "./components/BallinaMysafir";
import Perdoruesi from "./PerdoruesiContext";
import MenaxhoAplikimet from "./components/MenaxhoAplikimet";
import PunetRuajtura from "./components/PunetRuajtura";
import { useEffect, useState } from "react";
import ProfiliKompaniseVizitor from "./components/ProfiliKompaniseVizitor";
import LlogaritPagen from "./components/LlogaritPagen";
import ProfiliAplikantitVizitor from "./components/ProfiliAplikantitVizitor";
import ListaAplikanteve from "./components/ListaAplikanteve";

function App() {
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const [eshteKycur, setEshteKycur] = useState(false);

  useEffect(() => {
    const kontrolloKycjen = () => {
      try {
        if (perdoruesiData) {
          setEshteKycur(true);
        } else {
          setEshteKycur(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    kontrolloKycjen();
  }, [perdoruesiData]);

  useEffect(() => {
    console.log("PERDORUESI: ", perdoruesiData);
  }, [perdoruesiData]);

  return (
    <AlertProvider>
      <CustomAlert />
      <div className="min-h-screen flex flex-col">
        <BrowserRouter>
          <div className="grow flex flex-col">
            <Routes>
              <Route
                path="/"
                element={eshteKycur ? <Ballina /> : <BallinaMysafir />}
              />
              <Route path="/listaPuneve" element={<ListaPuneve />} />
              <Route path="/listaKompanive" element={<ListaKompanive />} />
              <Route path="/listaAplikanteve" element={<ListaAplikanteve />} />
              <Route path="/rrethNesh" element={<RrethNesh />} />
              <Route path="/kycja" element={<Kycja />} />
              <Route path="/regjistrimi" element={<Regjistrimi />} />
              <Route path="/kycja" element={<Kycja />} />
              <Route path="/shpallja/:id" element={<Shpallja />} />
              <Route path="/profili/:id" element={<Profili />} />
              <Route path="/publikoPune" element={<PublikoPune />} />

              <Route
                path="/profili/:id/menaxhoShpalljet"
                element={<MenaxhoShpalljet />}
              />
              <Route
                path="/profili/:id/menaxhoAplikimet"
                element={<MenaxhoAplikimet />}
              />
              <Route
                path="/profili/:id/konfigurimet"
                element={<KonfigurimetLlogarise />}
              />
              <Route path="/verifiko" element={<VerifikoEmail />} />
              <Route path=":id/aplikimi" element={<Aplikimi />} />
              <Route
                path="/profili/:id/punetRuajtura"
                element={<PunetRuajtura />}
              />
              <Route
                path="/kompania/:id"
                element={<ProfiliKompaniseVizitor />}
              />
              <Route
                path="/profiliAplikantit/:id"
                element={<ProfiliAplikantitVizitor />}
              />
              <Route path="/llogaritpagen" element={<LlogaritPagen />} />
            </Routes>
            <Footeri />
          </div>
        </BrowserRouter>
      </div>
    </AlertProvider>
  );
}

export default App;
