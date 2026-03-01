import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./Header";
import AplikantiCard from "./AplikantiCard";
import "../index.css";
import Kerkimi from "./Kerkimi";
import { useSearchParams } from "react-router-dom";

function ListaAplikanteve() {
  const [aplikantet, setAplikantet] = useState([]);
  const [aplikantetPaKerkim, setAplikantetPaKerkim] = useState([]);
  const [aplikimet, setAplikimet] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [kerkoParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/aplikantet/`,
        );
        if (response.data.success) {
          setAplikantetPaKerkim(response.data.data);
        }
      } catch (error) {
        console.error(error);
        setAplikantetPaKerkim([]);
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
            `${import.meta.env.VITE_API_URL}/api/kerkoAplikantin?${params.toString()}`,
          );
          if (response.data.success) {
            setAplikantet(response.data.data || []);
          } else {
            console.error("Gabim ne kerkim:  ", response.data.error);
          }
        } else {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/aplikantet/`,
          );
          if (response.data.success) {
            setAplikantet(response.data.data || []);
          }
        }
      } catch (err) {
        console.error(err);
        setAplikantet([]);
      }
    };

    fetchData();
  }, [kerkoParams]);

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shpallja/aplikimet`,
        );
        if (response.data.success) {
          setAplikimet(response.data.data);
        }
      } catch (error) {
        console.error(error);
        setAplikimet([]);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(aplikantet.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = aplikantet.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <div className="bg-gradient-to-br from-[#F7FBFC] to-[#B9D7EA] pb-16 backdrop-blur-sm">
        <Header withGradient={false} />

        <div className="max-w-6xl mx-auto px-4 mt-20 mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              Aplikantët
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Zbulo kandidatët më të mirë që kërkojnë mundësi pune në platformën
              tonë
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-800 font-semibold text-center mb-2">
                {aplikantetPaKerkim.length}+ Aplikantë
              </h3>
              <p className="text-gray-600 text-sm text-center">
                Aplikantë të regjistruar në platformë
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-800 font-semibold text-center mb-2">
                {aplikimet.length}+ Aplikime
              </h3>
              <p className="text-gray-600 text-sm text-center">
                Aplikime aktive në platform
              </p>
            </div>
          </div>

          <div className="mt-20">
            <Kerkimi showLocation={false} showCategory={false} compact={true} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
            Gjej talentin që kërkon
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Shfleto kandidatët dhe gjej aplikantin perfekt për pozicionin që po
            rekruton
          </p>
        </div>

        {aplikantet.length === 0 ? (
          <div className="text-center mt-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-lg mx-auto shadow-lg">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Asnjë aplikant i regjistruar ende
              </p>
              <p className="text-gray-500">
                Kthehu më vonë për të parë aplikantët e rinj
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentItems.map((a) => (
                <AplikantiCard key={a._id} aplikanti={a} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`
                    w-9 h-9 rounded-full border transition
                    ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white"
                    }
                  `}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                      w-9 h-9 rounded-full font-medium transition
                      ${
                        currentPage === page
                          ? "bg-primary text-white shadow-md scale-110"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }
                    `}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`
                    w-9 h-9 rounded-full border transition
                    ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white"
                    }
                  `}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ListaAplikanteve;
