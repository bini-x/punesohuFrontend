import Header from "./Header";
import Kerkimi from "./Kerkimi";
import ShpalljaCard from "./ShpalljaCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  UserPen,
  TrendingUp,
  BookPlus,
  Users,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

function BallinaMysafir() {
  const navigate = useNavigate();
  const [shpalljaData, setShpalljaData] = useState([]);
  const [kerkoParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shpallja/kompania`,
        );
        if (response.data.success) {
          const shpalljetAktive = response.data.data.filter(
            (shpallja) => shpallja.status === "aktiv",
          );
          setShpalljaData(shpalljetAktive || []);
        }
      } catch (err) {
        console.error(err);
        setShpalljaData([]);
      }
    };
    fetchData();
  }, []);

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F7F8]">
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

        <div className="relative min-h-[600px] flex flex-col items-center justify-center py-20">
          <div className="absolute top-32 left-10 z-10 opacity-20">
            <Sparkles size={40} color="#ffffff" />
          </div>
          <div className="absolute bottom-32 right-20 z-10 opacity-20">
            <Sparkles size={50} color="#ffffff" />
          </div>

          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-white/90 mb-3 font-light tracking-wide">
              Platforma më e madhe e punësimit në Kosovë
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-2xl leading-tight">
              Gjeni punën perfekte për ju
            </h1>

            <p className="text-base md:text-lg text-white/80 mb-8 font-light max-w-2xl mx-auto">
              Mundësi pune nga kompanitë më të mira
            </p>

            <Kerkimi />
          </div>
        </div>
      </div>

      <div className="py-20 px-4 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-8 border border-gray-100 flex flex-col">
              <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                Po punësoni talentë?
              </h1>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Lidhu me kandidatë të kualifikuar dhe ndërto ekipin tënd.
                Publiko vende pune brenda pak minutash.
              </p>
              <div className="space-y-3 mb-6 grow">
                <h2 className="flex items-center gap-2 text-gray-600 font-medium">
                  <BookPlus size={20} className="text-gray-600" />
                  Publiko Punë
                </h2>
                <h2 className="flex items-center gap-2 text-gray-600 font-medium">
                  <Users size={20} className="text-gray-600" />
                  Rishikoni aplikantët
                </h2>
                <h2 className="flex items-center gap-2 text-gray-600 font-medium">
                  <BriefcaseBusiness size={20} className="text-gray-600" />
                  Menaxho Shpalljet
                </h2>
              </div>
              <button
                type="button"
                className="w-full px-6 py-3 bg-linear-to-r from-[#0f4c75] to-[#6d94c5] text-white font-semibold rounded-xl hover:from-[#0d3d5e] hover:to-[#5a7dad] transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/kycja")}
              >
                Kycu
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-8 border border-gray-100 flex flex-col">
              <h1 className="text-2xl font-semibold mb-7 text-gray-800">
                Po kërkoni punë?
              </h1>
              <p className="text-slate-700 mb-10 leading-relaxed">
                Gjeni mundësi të arta nga kompanit më të mira. Gjej punën e
                ëndrrave sot.
              </p>
              <div className="space-y-3 mb-6 grow">
                <h2 className="flex items-center gap-2 text-gray-600 font-medium">
                  <Search size={20} className="text-gray-600" />
                  Kërko Punë
                </h2>
                <h2 className="flex items-center gap-2 text-gray-600 font-medium">
                  <UserPen size={20} className="text-gray-600" />
                  Ndërto Profilin
                </h2>
                <h2 className="flex items-center gap-2 text-gray-600 font-medium">
                  <TrendingUp size={20} className="text-gray-600" />
                  Menaxho Aplikimet
                </h2>
              </div>
              <button
                type="button"
                className="w-full px-6 py-3 bg-linear-to-r from-[#0f4c75] to-[#6d94c5] text-white font-semibold rounded-xl hover:from-[#0d3d5e] hover:to-[#5a7dad] transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/kycja")}
              >
                Kycu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Pse të Zgjedhni Punësohu?
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
                Gjeni punën ideale me filtrat tanë të avancuar dhe platformën
                intuitive që kursen kohën tuaj
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-secondary/20 group">
              <div className="w-16 h-16 bg-linear-to-br from-secondary to-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
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
                Bashkëpunojmë vetëm me kompani të verifikuara dhe të besueshme
                që ofrojnë mundësi reale
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

          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Pozicione të Reja të Punës
            </h2>
            <p className="text-xl text-gray-600">
              Eksploroni mundësitë më të fundit të karrierës
            </p>
          </div>
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
    </div>
  );
}

export default BallinaMysafir;
