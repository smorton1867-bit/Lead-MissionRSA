import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  "Barbers","Nail Shops","Phone Shops","Car Valets","Beauty Salons","Hair Salons","Cleaning Companies","Dentists","Estate Agents","Plumbers","Electricians","Roofers","Locksmiths","Pest Control","Window Cleaners","Dog Groomers","Chiropractors","Painters","Takeaways","Gyms","Sunbed Shops"
];

const cities = [
  "London","Manchester","Birmingham","Leeds","Liverpool","Sheffield","Bristol","Nottingham","Newcastle","Leicester",
  "Coventry","Brighton","Derby","Southampton","Reading","Hull","Bradford","Stoke-on-Trent","Wolverhampton","Plymouth",
  "Portsmouth","Preston","Sunderland","Norwich","York","Cambridge","Oxford","Milton Keynes","Luton","Swindon",
  "Blackpool","Bolton","Warrington","Huddersfield","Oldham","Rochdale","Stockport","Wigan","Salford","Telford",
  "Gloucester","Cheltenham","Exeter","Torquay","Barnsley","Doncaster","Rotherham","Chesterfield","Worksop","Grimsby",
  "Scunthorpe","Lincoln","Boston","Skegness","Ipswich","Colchester","Chelmsford","Southend","Basildon","Harlow",
  "Canterbury","Maidstone","Dover","Ashford","Folkestone","Worthing","Eastbourne","Hastings","Bognor Regis","Chichester",
  "Poole","Bournemouth","Weymouth","Dorchester","Yeovil","Taunton","Bridgwater","Weston-super-Mare","Bath","Chippenham",
  "Salisbury","Andover","Winchester","Basingstoke","Aldershot","Farnborough","Guildford","Woking","Epsom","Croydon",
  "Slough","High Wycombe","Aylesbury","Hemel Hempstead","Watford","St Albans","Stevenage","Letchworth","Hitchin","Bedford",
  "Northampton","Kettering","Corby","Rugby","Nuneaton","Tamworth","Burton upon Trent","Cannock","Stafford","Shrewsbury",
  "Oswestry","Hereford","Worcester","Kidderminster","Redditch","Solihull","Sutton Coldfield","Dudley","Halesowen","West Bromwich",
  "Burnley","Blackburn","Accrington","Lancaster","Morecambe","Barrow-in-Furness","Carlisle","Penrith","Workington","Whitehaven",
  "Darlington","Hartlepool","Middlesbrough","Scarborough","Whitby","Harrogate","Skipton","Keighley","Halifax","Brighouse",
  "Wakefield","Castleford","Pontefract","Selby","Goole","Beverley","Malton","Pickering","Thirsk","Ripon"
];

const callTargets = [100, 120, 150, 180, 200];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getColor(calls) {
  if (calls <= 120) return "bg-green-500";
  if (calls <= 150) return "bg-yellow-500";
  return "bg-red-500";
}

const sounds = {
  click: typeof Audio !== "undefined" ? new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3") : null
};

export default function LeadMissionGenerator() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const [total, setTotal] = useState(null);
  const [inputCalls, setInputCalls] = useState("");
  const [completed, setCompleted] = useState(false);

  const generate = (carryOver = null) => {
    if (locked && carryOver === null) return;

    sounds.click && sounds.click.play();
    setLoading(true);

    setTimeout(() => {
      const category = getRandom(categories);
      const city = getRandom(cities);
      const calls = carryOver ?? getRandom(callTargets);
      const date = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long"
      });

      setMission({ category, city, calls, date });
      setRemaining(calls);
      setTotal(prev => carryOver ? prev : calls);
      setCompleted(false);
      setLoading(false);
    }, 1200);
  };

  const lockMission = () => setLocked(true);
  const unlockMission = () => setLocked(false);

  const completeCalls = () => {
    const done = parseInt(inputCalls);
    if (!done || done <= 0) return;

    const left = remaining - done;

    if (left > 0) {
      setRemaining(left);
      generate(left);
    } else {
      setRemaining(0);
      setCompleted(true);
    }

    setInputCalls("");
  };

  const progress = total ? ((total - remaining) / total) * 100 : 0;

  return (
    <div className="p-6 max-w-3xl mx-auto text-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Daily Lead Mission 🎯</h1>

      <button
        onClick={() => generate()}
        disabled={locked}
        className="px-6 py-3 bg-blue-600 rounded-2xl shadow-lg text-lg disabled:opacity-50"
      >
        Generate Mission 🚀
      </button>

      {locked && (
        <button
          onClick={unlockMission}
          className="ml-2 px-4 py-2 bg-gray-600 rounded-xl"
        >
          Unlock 🔓
        </button>
      )}

      {loading && (
        <motion.div
          className="mt-8 text-lg"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          Finding best opportunity...
        </motion.div>
      )}

      {mission && !loading && !completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-6 border-2 rounded-2xl shadow bg-gray-800"
        >
          <p className="text-sm text-gray-400 mb-2">{mission.date}</p>

          <h2 className="text-xl font-semibold mb-4">🔥 TODAY'S TARGET</h2>

          <p className="text-2xl font-bold">{mission.category}</p>
          <p className="text-lg mt-1">📍 {mission.city}</p>

          <div className="mt-6">
            <p className="text-lg font-semibold">📞 Calls Left</p>
            <p className="text-3xl font-bold mt-1">
              {remaining}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`${getColor(total)} h-4 transition-all`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button
            onClick={lockMission}
            className="mt-6 px-4 py-2 bg-red-600 rounded-xl"
          >
            Lock Mission 🔒
          </button>

          <div className="mt-6">
            <input
              type="number"
              placeholder="Calls completed"
              value={inputCalls}
              onChange={(e) => setInputCalls(e.target.value)}
              className="px-3 py-2 rounded text-black"
            />
            <button
              onClick={completeCalls}
              className="ml-2 px-4 py-2 bg-green-600 rounded-xl"
            >
              Submit ✅
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            No excuses. Get it done.
          </p>
        </motion.div>
      )}

      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 text-center"
        >
          <h2 className="text-3xl font-bold text-green-400">✅ Mission Complete</h2>
          <p className="mt-2 text-gray-400">You finished your calls today.</p>
        </motion.div>
      )}
    </div>
  );
}
