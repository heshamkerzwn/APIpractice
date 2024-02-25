const api = `https://mp3quran.net/api/v3`;
const language = `ar`;
const radios = `radios`;
const chooseCategory = document.querySelector(`#chooseCategory`);
const chooseRewaya = document.querySelector(`#chooseRewaya`);
const chooseSurah = document.querySelector(`#chooseSurah`);

async function fetchData() {
  let myData = await fetch(
    " https://www.mp3quran.net/api/v3/reciters?language=ar"
  );
  let data = await myData.json();
  data.reciters.forEach((element) => {
    chooseCategory.innerHTML += `<option value="${element.id}">${element.name}</option>`;
  });
  chooseCategory.addEventListener("change", (e) => getMoshaf(e.target.value));
}

fetchData();

async function getMoshaf(re) {
  chooseRewaya.innerHTML = "";
  const url = await fetch(
    ` https://www.mp3quran.net/api/v3/reciters?language=${language}&reciter=${re}`
  );
  const moshaf = await url.json();
  const moshafs = moshaf.reciters[0].moshaf;
  moshafs.forEach((element) => {
    chooseRewaya.innerHTML += `<option value="${element.id}" data-server="${element.server}" data-surahlist = "${element.surah_list}">${element.name}</option>`;
  });
  chooseRewaya.addEventListener("click", (e) => {
    const selectedMoshaf = chooseRewaya.options[chooseRewaya.selectedIndex];
    const server = selectedMoshaf.dataset.server;
    const surah = selectedMoshaf.dataset.surahlist;
    getSurah(server, surah);
  });
}
async function getSurah(server, surah) {
  chooseSurah.innerHTML = "";
  const listSurah = await fetch(`https://mp3quran.net/api/v3/suwar`);
  const data = await listSurah.json();
  surah = surah.split(",");
  let surahName = data.suwar;
  surah.forEach((s) => {
    let padSurah = s.padStart(3, "0");
    surahName.forEach((surah) => {
      if (surah.id == s) {
        chooseSurah.innerHTML += `<option value='${server}${padSurah}.mp3'> ${surah.name} </option>`;
      }
    });
  });
  chooseSurah.addEventListener("click", (e) => {
    const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
    playSurah(selectedSurah.value);
  });
}
function playSurah(url) {
  const audioElement = document.querySelector(".audio");
  audioElement.src = url;
}

// function playLive(channel) {
//   if (Hls.isSupported()) {
//     var video = document.getElementById("video");
//     var hls = new Hls();
//     hls.loadSource(`${channel}`);
//     hls.attachMedia(video);
//     hls.on(Hls.Events.MANIFEST_PARSED, function () {
//       video.play();
//     });
//   }
// }
