import { useState } from "react";
import "../index.css";
import Header from "./Header";
import { useAlert } from "../contexts/AlertContext";

function LlogaritPagen() {
  const [punaDhënesi, setPunaDhënesi] = useState("Primar");
  const { showAlert } = useAlert();
  const [bruto, setBruto] = useState("");
  const [kontributPunëtor, setKontributPunëtor] = useState("5");
  const [kontributPunëdhënes, setKontributPunëdhënes] = useState("5");
  const [rezultati, setRezultati] = useState(null);

  const handleBrutoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    value = value.replace(/^0+(?=\d)/, "");
    setBruto(value);
  };

  const handleKontributPunëtorChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    value = value.replace(/^0+(?=\d)/, "");
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 15)) {
      setKontributPunëtor(value);
    }
  };

  const handleKontributPunëdhënesChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    value = value.replace(/^0+(?=\d)/, "");
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 15)) {
      setKontributPunëdhënes(value);
    }
  };

  const llogarit = () => {
    const brutoNum = parseFloat(bruto) || 0;
    const kontributPunëtorNum = parseFloat(kontributPunëtor) || 5;
    const kontributPunëdhënesNum = parseFloat(kontributPunëdhënes) || 5;

    if (kontributPunëtorNum < 5 || kontributPunëtorNum > 15) {
      showAlert("Kontributi i punëtorit duhet të jetë 5% - 15%", "error");
      return;
    }
    if (kontributPunëdhënesNum < 5 || kontributPunëdhënesNum > 15) {
      showAlert("Kontributi i punëdhënësit duhet të jetë 5% - 15%", "error");
      return;
    }

    const kontributPunëtorVlera = brutoNum * (kontributPunëtorNum / 100);
    const kontributPunëdhënesVlera = brutoNum * (kontributPunëdhënesNum / 100);
    const kontributetTotal = kontributPunëtorVlera + kontributPunëdhënesVlera;

    const pagaTatuese = brutoNum - kontributPunëtorVlera;

    let tatimi = 0;
    let tatimi0_80 = 0;
    let tatimi80_250 = 0;
    let tatimi250_450 = 0;
    let tatimiMbi450 = 0;

    if (pagaTatuese > 450) {
      tatimiMbi450 = (pagaTatuese - 450) * 0.1;
      tatimi250_450 = 200 * 0.08;
      tatimi80_250 = 170 * 0.04;
      tatimi = tatimiMbi450 + tatimi250_450 + tatimi80_250;
    } else if (pagaTatuese > 250) {
      tatimi250_450 = (pagaTatuese - 250) * 0.08;
      tatimi80_250 = 170 * 0.04;
      tatimi = tatimi250_450 + tatimi80_250;
    } else if (pagaTatuese > 80) {
      tatimi80_250 = (pagaTatuese - 80) * 0.04;
      tatimi = tatimi80_250;
    }

    const neto = brutoNum - kontributPunëtorVlera - tatimi;

    setRezultati({
      kontributPunëtorVlera,
      kontributPunëdhënesVlera,
      kontributetTotal,
      pagaTatuese,
      tatimi,
      neto,
      tatimi0_80,
      tatimi80_250,
      tatimi250_450,
      tatimiMbi450,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header withGradient={true} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Llogaritja e Pagës
          </h1>
          <p className="paragraf mt-2">Llogarit pagën tuaj nga BRUTO në NETO</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            <div>
              <label className="labelTabela">
                Punëdhënësi <span className="text-red-500">*</span>
              </label>
              <select
                value={punaDhënesi}
                onChange={(e) => setPunaDhënesi(e.target.value)}
                className="input-ShpalljaProfil"
              >
                <option value="Primar">Primar</option>
                <option value="Privat">Privat</option>
                <option value="Publik">Publik</option>
              </select>
            </div>

            <div>
              <label className="labelTabela">
                Paga BRUTO <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={bruto}
                  onChange={handleBrutoChange}
                  className="input-ShpalljaProfil pr-12"
                  placeholder="Shkruaj pagen bruto"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  €
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Kontributet Pensionale
              </h3>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <div className="space-y-4">
                  <div>
                    <label className="labelTabela text-blue-900">
                      Kontributi i Punëtorit %{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={kontributPunëtor}
                        onChange={handleKontributPunëtorChange}
                        className="input-ShpalljaProfil pr-12"
                        placeholder="5"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        %
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Kontributi pensional duhet të jetë prej 5% - 15%. Për
                      shtetasit e huaj nuk llogaritet.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Gjithsej kontributi i punëtorit
                      </span>
                      <span className="text-lg font-bold text-blue-700">
                        {rezultati
                          ? `${rezultati.kontributPunëtorVlera.toFixed(2)} €`
                          : "0.00 €"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 rounded-xl border border-emerald-200">
                <div className="space-y-4">
                  <div>
                    <label className="labelTabela text-emerald-900">
                      Kontributi i Punëdhënësit %{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={kontributPunëdhënes}
                        onChange={handleKontributPunëdhënesChange}
                        className="input-ShpalljaProfil pr-12"
                        placeholder="5"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        %
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Kontributi pensional duhet të jetë prej 5% - 15%. Për
                      shtetasit e huaj nuk llogaritet.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-emerald-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Gjithsej kontributi i punëdhënësit
                      </span>
                      <span className="text-lg font-bold text-emerald-700">
                        {rezultati
                          ? `${rezultati.kontributPunëdhënesVlera.toFixed(2)} €`
                          : "0.00 €"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    Gjithsej Kontributet
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {rezultati
                      ? `${rezultati.kontributetTotal.toFixed(2)} €`
                      : "0.00 €"}
                  </span>
                </div>
              </div>
            </div>

            <button onClick={llogarit} className="publikoPune w-full">
              Llogarit Pagën
            </button>

            {rezultati && (
              <div className="mt-8 p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Paga që Tatohet
                  </h4>
                  <div className="text-3xl font-bold text-blue-600">
                    {rezultati.pagaTatuese.toFixed(2)} €
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Shkallët Tatimore
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 px-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gray-700 font-medium">
                        Paga prej 0 - 80 €
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {rezultati.tatimi0_80.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gray-700 font-medium">
                        Paga prej 80 - 250 €
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {rezultati.tatimi80_250.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gray-700 font-medium">
                        Paga prej 250 - 450 €
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {rezultati.tatimi250_450.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gray-700 font-medium">
                        Paga mbi 450 €
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {rezultati.tatimiMbi450.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm">
                    <span className="text-lg font-semibold text-gray-800">
                      Gjithsej Tatimi
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      {rezultati.tatimi.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-[#0F4C75] to-[#3282B8] p-6 rounded-xl text-white shadow-lg">
                    <span className="text-xl font-bold">Paga NETO</span>
                    <span className="text-3xl font-bold">
                      {rezultati.neto.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LlogaritPagen;
