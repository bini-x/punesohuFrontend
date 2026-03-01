import "../index.css";
import Header from "./Header";
import Perdoruesi from "../PerdoruesiContext";
import ProfiliAplikantit from "./ProfiliAplikantit";
import ProfiliKompanise from "./ProfiliKompanise";

function Profili() {
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();

  if (!perdoruesiData) {
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
              Vetëm përdoruesit mund të shohin profilin. Nëse keni llogari, ju
              lutemi kycuni.
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
    <div className="relative overflow-hidden ">
      <Header withGradient={true} />
      {perdoruesiData?.tipiPerdoruesit === "aplikant" ? (
        <ProfiliAplikantit />
      ) : (
        <ProfiliKompanise />
      )}
    </div>
  );
}

export default Profili;
