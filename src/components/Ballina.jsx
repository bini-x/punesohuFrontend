import Header from "./Header";
import Kerkimi from "./Kerkimi";
import "../index.css";
import ShpalljaCard from "./ShpalljaCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Perdoruesi from "../PerdoruesiContext";
import BallinaPundhenesit from "./BallinaPundhenesit";
import { useNavigate } from "react-router-dom";

function Ballina() {
  const navigate = useNavigate();
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const [shpalljaData, setShpalljaData] = useState([]);
  const [kerkoParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(kerkoParams);

        if (params.toString()) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/kerkoShpalljen?${params.toString()}`,
          );
          if (response.data.success) {
            setShpalljaData(response.data.data || []);
          } else {
            console.error("Gabim ne kerkim:  ", response.data.error);
          }
        } else {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shpallja/kompania`,
          );
          if (response.data.success) {
            const shpalljetAktive = response.data.data.filter(
              (shpallja) => shpallja.status === "aktiv",
            );
            setShpalljaData(shpalljetAktive || []);
          }
        }
      } catch (err) {
        console.error(err);
        setShpalljaData([]);
      }
    };

    fetchData();
  }, [kerkoParams]);

  useEffect(() => {
    console.log(perdoruesiData);
  }, [perdoruesiData]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F7F8]">
      {perdoruesiData?.tipiPerdoruesit === "punedhenes" ? (
        <BallinaPundhenesit />
      ) : (
        <>
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
              }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#0f4c75]/90 via-[#0f4c75]/85 to-[#6d94c5]/80" />

              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-linear(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255, 255, 255, 0.05) 10px,
                    rgba(255, 255, 255, 0.05) 20px
                  )`,
                }}
              />
            </div>

            <div className="relative z-10 header-white-text">
              <Header />
            </div>

            <div className="relative h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-4xl mx-auto px-6 text-center">
                <div className="text-white z-10">
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Gjeni Punën e Ëndrrave Tuaja
                  </h1>
                  <p className="text-xl lg:text-2xl mb-10 text-white/95 max-w-2xl leading-relaxed mx-auto">
                    Lidhuni me mundësi të shkëlqyera karriere në kompani të
                    njohura të Kosovës
                  </p>

                  <div className="flex flex-wrap gap-4 mb-16 justify-center">
                    <button
                      onClick={() => navigate("/ListaPuneve")}
                      className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Shfleto Punët
                    </button>
                    <button
                      onClick={() => navigate("/ListaKompanive")}
                      className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border border-white hover:bg-white hover:text-primary transition-all duration-300"
                    >
                      Shfleto Kompanitë
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="py-4">
                      <div className="text-3xl font-bold mb-3">
                        Punë të Verifikuara
                      </div>
                      <div className="text-base text-white/90 font-medium leading-relaxed">
                        Vetëm oferta të besueshme
                      </div>
                    </div>
                    <div className="py-4">
                      <div className="text-3xl font-bold mb-3">100% Falas</div>
                      <div className="text-base text-white/90 font-medium leading-relaxed">
                        Pa tarifa të fshehura
                      </div>
                    </div>
                    <div className="py-4">
                      <div className="text-3xl font-bold mb-3">
                        Mbështetje 24/7
                      </div>
                      <div className="text-base text-white/90 font-medium leading-relaxed">
                        Jemi këtu për ty
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-20 px-4 ">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Pse të Zgjedhni Punesohu?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Platforma më e besueshme për kërkimin e punës në Kosovë
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
                  <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    Kërkim i Thjeshtë
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Gjeni punën ideale me filtrat tanë të avancuar dhe
                    platformën intuitive që kursen kohën tuaj
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-secondary/20 group">
                  <div className="w-16 h-16 bg-linear-to-br from- to-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    Kompani të Verifikuara
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bashkëpunojmë vetëm me kompani të verifikuara dhe të
                    besueshme që ofrojnë mundësi reale
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
                  <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    Aplikim i Shpejtë
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Aplikoni për pozicione me vetëm disa klikime dhe merrni
                    përgjigje të shpejta nga punëdhënësit
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="py-8 px-4">
            <div className="max-w-5xl mx-auto">
              <Kerkimi />
            </div>
          </div>
          <div className="pb-20 px-4">
            <div className="shpalljaCard max-w-7xl mx-auto">
              {shpalljaData.slice(0, 9).map((shpallja, index) => {
                return (
                  <div
                    key={shpallja._id}
                    className="animate-fade-in-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ShpalljaCard shpallja={shpallja} />
                  </div>
                );
              })}
              {shpalljaData.length === 0 && (
                <div className="col-span-full">
                  <div className="text-center p-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <svg
                      className="w-24 h-24 text-gray-400 mx-auto mb-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                      {kerkoParams.toString()
                        ? "Nuk u gjet asnjë punë"
                        : "Momentalisht nuk ka punë"}
                    </h3>
                    <p className="text-gray-500 text-lg">
                      {kerkoParams.toString()
                        ? "Provoni të ndryshoni kriteret e kërkimit"
                        : "Kontrolloni më vonë për pozicione të reja"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {shpalljaData.length > 9 && (
              <div className="flex justify-center mt-16">
                <button
                  type="button"
                  className="px-12 py-4 bg-primary hover:bg-[#0a3652] text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate("/ListaPuneve")}
                >
                  Shfaq Më Shumë Punë
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Ballina;
