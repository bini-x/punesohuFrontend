import Header from "./Header";
import ShpalljaCard from "./ShpalljaCard";
import "../index.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Kerkimi from "./Kerkimi";
import { useSearchParams } from "react-router-dom";

function ListaPuneve() {
  const [shpalljaData, setShpalljaData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
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
    setCurrentPage(1);
  }, [kerkoParams]);

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

  const totalPages = Math.ceil(shpalljaData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shpalljaData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="bg-gradient-to-br from-[#F7FBFC] to-[#B9D7EA] pb-16 backdrop-blur-sm">
        <Header />
        <div className="max-w-6xl mx-auto px-4 mt-20 mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              E ardhmja jote fillon këtu
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Zbulo mundësi të reja karriere dhe gjej punën që të përshtatet më
              së miri.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#0f4c75] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-800 font-semibold text-center mb-2">
                Punë në Të Gjithë Vendin
              </h3>
              <p className="text-gray-600 text-sm text-center">
                Shpallje nga qytete dhe rajone të ndryshme
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#6d94c5] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-white"
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
              <h3 className="text-gray-800 font-semibold text-center mb-2">
                Proces i Thjeshtë
              </h3>
              <p className="text-gray-600 text-sm text-center">
                Krijo profilin, gjej punën, apliko - E gjitha në një platformë
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#0f4c75] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-800 font-semibold text-center mb-2">
                Për Të Gjitha Nivelet
              </h3>
              <p className="text-gray-600 text-sm text-center">
                Nga praktikantë deri te pozicione senior dhe menaxhuese
              </p>
            </div>
          </div>
        </div>
        <Kerkimi />
      </div>
      <div className="m-10 md:m-20 lg:m-30">
        <div className="text-center mb-8 -mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
            Gjej punën që të përshtatet
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Shfleto qindra shpallje nga kompanitë më të mira dhe apliko për
            pozicionin që të inspiron
          </p>
        </div>

        <div className="shpalljaCard">
          {currentItems.map((shpallja) => (
            <ShpalljaCard key={shpallja._id} shpallja={shpallja} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 my-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            w-7 h-7 rounded-full font-medium transition-all duration-200
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
        {shpalljaData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            Nuk ka punë të disponueshme
          </p>
        )}
      </div>
    </div>
  );
}

export default ListaPuneve;
