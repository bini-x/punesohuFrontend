import { useState, useEffect } from "react";
import axios from "axios";
import ShpalljaCard from "../components/ShpalljaCard";
import Perdoruesi from "../PerdoruesiContext";
import Header from "./Header";

function PunetRuajtura() {
  const [shpalljetRuajtura, setShpalljetRuajtura] = useState([]);
  const [duke_ngarkuar, setDuke_ngarkuar] = useState(true);
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();

  useEffect(() => {
    merreShpalljetRuajtura();
  }, []);

  const merreShpalljetRuajtura = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/punetRuajtura/shpalljet-e-ruajtura`,
      );

      if (response.data.success) {
        setShpalljetRuajtura(response.data.data);
      }
    } catch (error) {
      console.error("Gabim gjatë marrjes së shpalljeve të ruajtura:", error);
    } finally {
      setDuke_ngarkuar(false);
    }
  };

  if (duke_ngarkuar) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-[28px] px-12 py-12 flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-[3px] border-gray-300 border-t-gray-900"></div>
          </div>
          <p className="text-lg font-semibold tracking-wide text-gray-700">
            Duke ngarkuar...
          </p>
        </div>
      </div>
    );
  }

  if (perdoruesiData?.tipiPerdoruesit !== "aplikant") {
    return (
      <div className="min-h-screen">
        <Header withGradient={true} />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Qasje e ndaluar
            </h2>
            <p className="text-gray-600 mb-6">
              Vetëm aplikantët mund të ruajnë punë. Nëse jeni aplikant, ju
              lutemi kycuni/regjistrohuni si i tillë.
            </p>
            <a
              href="/kycja"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg font-semibold hover:from-[#3282B8] hover:to-[#0F4C75] transition-all duration-300"
            >
              Kycu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <Header withGradient={true} />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-linear(circle_at_top,_rgba(0,0,0,0.04),_transparent_60%)]"></div>

        <div className="relative container mx-auto px-4 py-12 max-w-7xl">
          <div className="mb-12">
            <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-linear-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent text-left">
                  Punët e Ruajtura
                </h1>
                <p className="text-gray-500 text-lg mt-3 max-w-xl">
                  Këtu mund të shihni të gjitha punët që keni ruajtur
                </p>
              </div>

              {shpalljetRuajtura.length > 0 && (
                <div className="flex flex-col items-center justify-center bg-linear-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-md px-8 py-5">
                  <span className="text-sm uppercase tracking-wider text-gray-400">
                    Totali
                  </span>
                  <span className="text-3xl font-bold text-gray-900 mt-1">
                    {shpalljetRuajtura.length}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {shpalljetRuajtura.length === 1
                      ? "punë e ruajtur"
                      : "punë të ruajtura"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {shpalljetRuajtura.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-[32px] py-24 px-6 text-center flex flex-col items-center gap-6">
              <h2 className="w-full text-center text-2xl md:text-3xl font-semibold text-gray-800">
                Nuk keni punë të ruajtura
              </h2>
              <p className="text-gray-500 text-lg max-w-md">
                Klikoni ikonën e bookmark-ut për të ruajtur punë që ju
                interesojnë
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {shpalljetRuajtura.map((sh) => (
                <div className="group relative">
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-gray-200/40 to-gray-100/40 opacity-0 group-hover:opacity-100 blur-xl transition duration-500"></div>
                  <div className="relative transform transition duration-300 group-hover:-translate-y-1">
                    <ShpalljaCard key={sh._id} shpallja={sh} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PunetRuajtura;
