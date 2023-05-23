import axios from "axios";
import React, { useEffect } from "react";
import "./App.css";

interface IEnId {
  id?: string;
  en?: string;
}

interface IBaseApiResult {
  code: number;
  data: IQuranBaseData;
  messages: string;
  status: string;
}

interface IQuranBaseData {
  name: IQuranNameObj;
  number: number;
  numberOfVerses: number;
  verses: IQuranVerses[];
}

interface IQuranNameObj {
  long: string;
  short: string;
  translation: IEnId;
  transliteration: IEnId;
}

interface IQuranVerses {
  text: IQuranVersesText;
}

interface IQuranVersesText {
  arab: string;
  transliteration: IEnId;
}

function App() {
  const baseUrl = "https://api.quran.gading.dev/surah";

  // state
  // state simplenya variable, di sini di pecah menjadi variable dan assigment
  // contoh surahNumber sebagai statenya (variable)
  // setSurahNumber sebagai mutation/action (assigment)

  // contoh sederhana lagi
  // let a = 1
  // a adalah variable (state)
  // = adalah mutation / actionnya, atau meng assign variable a dengan value 1
  // bisa saja di jadikan function seperti ini agar dapat lebih mirip
  // let a;
  // function isia(isi: number) {
  //   return a=isi;
  // }
  const [quranResult, setQuranResult] = React.useState<IQuranBaseData | null>(
    null
  );
  const [surahNumber, setSurahNumber] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);

  // fungsi yang di gunakan untk mengambil data dari api
  const fetchSurah = async (surahNumber: number) => {
    setLoading(true);

    try {
      // kita dapat mengambil data menggunakan libray axios (untuk menghungkan fe dengan be via api)
      // ref: https://axios-http.com/docs/intro
      const { status, data: fetchResult } = await axios.get<IBaseApiResult>(
        `${baseUrl}/${surahNumber}`
      );

      if (status < 400) {
        if (fetchResult.code === 200) {
          setQuranResult(fetchResult.data);
        }
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error.message);
    }
  };

  // fungsi yang diguankan untuk melakuan operasi aritmatik saat button di tekan
  // simplenya sama seperti pengunaan DOM (document object model)
  const handleAddSurahNumber = (text: "next" | "prev") => {
    if (text === "next") {
      setSurahNumber(surahNumber + 1);
    } else setSurahNumber(surahNumber - 1);
  };

  // useEffect digunakan untuk mengawasi perubahan yang terjadi pada variable
  // useEffect ini di jalankan di saat suatu component terpanggil.
  // ref:
  // https://legacy.reactjs.org/docs/hooks-effect.html
  // https://www.w3schools.com/react/react_useeffect.asp

  // di sini yang di awasi perubahan valuenya adalah state(variabel) surahNumber.
  useEffect(() => {
    fetchSurah(surahNumber);
  }, [surahNumber]);

  useEffect(() => {
    // console.log(quranResult.data);
    if (quranResult) {
      console.log("data ada");
      console.log(quranResult);
      // console.log(quranResult.name);
      // console.log(quranResult.number);
      // console.log(quranResult.numberOfVerses);
      // console.log(quranResult.verses);
    }
  }, [quranResult]);

  return (
    // PS: dalam react kita menggunakan ternary sebagai perandaian "?" if, ":" else
    // PS2: dalam suatu function react kita hanya dapat mengembalikan satu value sama seperti menggunakan fuction
    <div className="bg-white w-[1400px] min-w-full">
      <div>
        {/* sedang loading data dari api (mengambil data dari backend via GET method REST API) */}
        {loading ? (
          "lagi loading ..."
        ) : (
          <div>
            {/* loading sudah selesai data di temukan */}
            {!loading && !!quranResult ? (
              <div className="text-black ">
                <div className=" flex flex-col mb-10">
                  <span>{quranResult.name.long || "long name not found!"}</span>
                  <span>
                    {quranResult.name.translation.id ||
                      "translation tidak di temukan"}
                  </span>
                  <span>
                    {quranResult.name.transliteration.id ||
                      "translation tidak di temukan"}
                  </span>
                </div>

                <div>
                  {quranResult.verses.length > 0 ? (
                    quranResult.verses.map((verse, index) => (
                      <div>
                        <div>{`${index + 1}, ${verse.text.arab}`}</div>
                        <div>{`${verse.text.transliteration.en}`}</div>
                      </div>
                    ))
                  ) : (
                    <span>ayat tidak di temukan!</span>
                  )}
                </div>
                <div className="flex flex-row  justify-evenly text-white ">
                  <button
                    disabled={surahNumber === 1}
                    onClick={() => {
                      // DOM, ketika di klik panggil fungsi
                      handleAddSurahNumber("prev");
                    }}
                  >
                    Mundur
                  </button>
                  <button
                    disabled={surahNumber === 114}
                    onClick={() => {
                      handleAddSurahNumber("next");
                    }}
                  >
                    Maju
                  </button>
                </div>
              </div>
            ) : (
              //  selain data ditemukan (si quran resultnya null)
              <span>Data tidak ditemukan</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
