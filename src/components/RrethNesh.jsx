import Header from "./Header";

function RrethNesh() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#F7FBFC] via-[#D6E6F2] to-[#B9D7EA]">
      <Header />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-5xl font-extrabold mb-6 text-gray-800">
              Rreth Nesh
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Ne besojmë se një punë e mirë mund ta ndryshojë jetën e një
              njeriu, dhe një kandidat i mirë mund ta ndryshojë një kompani.
              Platforma jonë lidh talentin me mundësinë në mënyrë moderne, të
              shpejtë dhe të drejtë.
            </p>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Team work"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-indigo-500 opacity-10"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="backdrop-blur bg-white/60 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-3"> Kush jemi ne?</h3>
            <p className="text-gray-600">
              Jemi një platformë moderne për punësim që lidh talentin me
              mundësinë në mënyrë të thjeshtë, të shpejtë dhe të drejtë.
            </p>
          </div>

          <div className="backdrop-blur bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-3"> Misioni ynë</h3>
            <p className="text-gray-600">
              Të ndihmojmë njerëzit të gjejnë punën e duhur dhe kompanitë të
              gjejnë talentin e duhur në kohën e duhur.
            </p>
          </div>

          <div className="backdrop-blur bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-3"> Vizioni ynë</h3>
            <p className="text-gray-600">
              Të bëhemi platforma më e besueshme dhe më e përdorur për punësim
              në rajon.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-24 backdrop-blur bg-white/70 p-10 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Çfarë na bën të veçantë?
          </h2>
          <ul className="text-gray-700 space-y-3">
            <li>✔ Fokus në cilësi, jo vetëm në sasi</li>
            <li>✔ Platformë për tregun lokal me standarde ndërkombëtare</li>
            <li>✔ Përvojë e thjeshtë dhe intuitive për përdoruesit</li>
            <li>✔ Mbështetje reale dhe përmirësime të vazhdueshme</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default RrethNesh;
