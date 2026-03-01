import AplikantiCard from "./AplikantiCard";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Search, CircleCheck, MessageCircleMore } from "lucide-react";
import axios from "axios";
import Kerkimi from "./Kerkimi";
import { useSearchParams } from "react-router-dom";

function BallinaPundhenesit() {
  const [aplikantet, setAplikantet] = useState([]);
  const [aplikantetPaKerkim, setAplikantetPaKerkim] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [kerkoParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [kerkoParams]);

  useEffect(() => {
    const fetchAplikantet = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(kerkoParams);
        let response;

        if (params.toString()) {
          response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/kerkoAplikantin?${params.toString()}`,
          );
        } else {
          response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/aplikantet`,
          );
        }

        if (response.data.success || response.data.data) {
          setAplikantet(response.data.data || []);
        } else {
          setError("Gabim gjatë kërkimit të aplikantëve");
          setAplikantet([]);
        }
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError(err.response?.data?.message || "Gabim në lidhjen me serverin");
        setAplikantet([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAplikantet();
  }, [kerkoParams]);

  useEffect(() => {
    const fetchTotalApplicants = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/aplikantet`,
        );
        if (response.data.data) {
          setAplikantetPaKerkim(response.data.data);
        }
      } catch (err) {
        console.error(err);
        setAplikantetPaKerkim([]);
      }
    };

    fetchTotalApplicants();
  }, []);

  const totalPages = Math.ceil(aplikantet.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = aplikantet.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-[#F5F7F8] min-h-screen font-sans">
      <div className="relative overflow-hidden bg-linear-to-br from-[#F7FBFC] via-[#D6E6F2] to-[#B9D7EA] backdrop-blur-2xl">
        <Header forceNonHomePage={true} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#769FCD]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0F4C75]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-5xl mb-6 leading-tight text-gray-800 font-bold text-left">
                Menaxho kandidatët dhe gjej profesionistët e duhur
              </h1>
              <p className="text-xl text-gray-600 font-light mb-8 leading-relaxed">
                Platforma profesionale për të eksploruar, vlerësuar dhe
                kontaktuar kandidatët më të mirë për ekipin tuaj.
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-[#D6E6F2]">
                  <div className="text-3xl font-bold text-gray-800">
                    {aplikantetPaKerkim.length}
                  </div>
                  <div className="text-sm mt-1 text-gray-600 font-light">
                    Kandidatë aktivë
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-[#D6E6F2]">
                  <div className="text-3xl font-bold text-gray-800">100%</div>
                  <div className="text-sm mt-1 text-gray-600 font-light">
                    Të verifikuar
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-[#D6E6F2]">
                  <div className="text-3xl font-bold text-gray-800">Shpejt</div>
                  <div className="text-sm mt-1 text-gray-600 font-light">
                    Përgjigje
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block flex-1">
              <div className="relative">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#D6E6F2]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4  rounded-xl p-4 transition-all">
                      <div className="text-white w-12 h-12 bg-[#0F4C75] rounded-lg flex items-center justify-center">
                        <CircleCheck />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          Profile të plota
                        </div>
                        <div className="text-sm text-gray-600 font-light">
                          CV dhe dokumentacione
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4  rounded-xl p-4 ">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Search />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          Kërkim i avancuar
                        </div>
                        <div className="text-sm text-gray-600 font-light">
                          Filtro sipas kritereve
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4  rounded-xl p-4 ">
                      <div className="text-white w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <MessageCircleMore />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          Komunikim direkt
                        </div>
                        <div className="text-sm text-gray-600 font-light">
                          Kontakto kandidatët
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 flex justify-center my-5">
        <Kerkimi showLocation={false} showCategory={false} compact={true} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-1">
              Kandidatët e disponueshëm
            </h2>
            <p className="text-sm text-gray-600 font-extralight">
              {aplikantet.length}{" "}
              {aplikantet.length === 1 ? "rezultat" : "rezultate"}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f4c75]"></div>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center max-w-2xl mx-auto mb-8">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm underline hover:no-underline"
            >
              Provo përsëri
            </button>
          </div>
        )}

        {!isLoading && kerkoParams.toString() && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              U gjetën{" "}
              <span className="font-semibold text-[#0f4c75]">
                {aplikantet.length}
              </span>{" "}
              rezultate
            </p>
          </div>
        )}

        {!isLoading && !error && aplikantet.length > 0 && (
          <>
            <div className="rounded-2xl grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((a, index) => (
                <div
                  key={a._id}
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`,
                  }}
                >
                  <AplikantiCard aplikanti={a} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`
                    px-3 py-1 rounded-full border transition-all duration-200
                    flex items-center gap-1
                    ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }
                  `}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`
                          w-9 h-9 rounded-full font-medium transition-all duration-200
                          ${
                            currentPage === page
                              ? "bg-primary text-white shadow-md scale-105"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }
                        `}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`
                    px-3 py-1 rounded-full border transition-all duration-200
                    flex items-center gap-1
                    ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }
                  `}
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && !error && aplikantet.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#D6E6F2]">
            <svg
              className="w-16 h-16 mx-auto text-[#B9D7EA] mb-4"
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
            <h3 className="text-xl font-bold text-[#0F4C75] mb-2">
              {kerkoParams.toString()
                ? "Nuk u gjetën rezultate"
                : "Asnjë aplikant ende"}
            </h3>
            <p className="text-[#6D94C5]">
              {kerkoParams.toString()
                ? "Provo të ndryshosh kriteret e kërkimit"
                : "Kthehu më vonë për të parë aplikantët e rinj"}
            </p>
            {kerkoParams.toString() && (
              <button
                onClick={() => (window.location.href = "/listaAplikanteve")}
                className="mt-6 px-6 py-2.5 bg-[#0f4c75] text-white rounded-lg hover:bg-[#0a3a5a] transition-colors"
              >
                Shiko të gjithë aplikantët
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BallinaPundhenesit;
