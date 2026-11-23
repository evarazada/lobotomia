/* =========================================================
   LOBOTOMÍA - Reproductor (JavaScript mínimo)
   ========================================================= */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const DURACION = 200;
  const pantalla = $("pantalla");
  const contenedor = document.querySelector(".reproductor");
  const btnPlay = $("btnPlay");
  const barra = $("barra");
  const relleno = $("relleno");
  const tiempoLabel = $("tiempo");
  const subtitulo = $("subtitulo");

  let tiempo = 0;
  let reproduciendo = false;
  let timer = null;

  function formato(seg) {
    const s = Math.floor(seg);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  function actualizarProgreso() {
    if (relleno) relleno.style.width = (tiempo / DURACION * 100) + "%";
    if (tiempoLabel) tiempoLabel.textContent = formato(tiempo) + " / " + formato(DURACION);
    if (barra) barra.setAttribute("aria-valuenow", String(Math.floor(tiempo)));
  }

  function reproducir() {
    if (!pantalla) return;
    reproduciendo = true;
    pantalla.classList.add("reproduciendo");
    if (btnPlay) btnPlay.textContent = "❚❚";
    if (!timer) {
      timer = setInterval(() => {
        tiempo += 0.25;
        if (tiempo >= DURACION) { tiempo = DURACION; pausar(); }
        actualizarProgreso();
      }, 250);
    }
  }

  function pausar() {
    reproduciendo = false;
    if (pantalla) pantalla.classList.remove("reproduciendo");
    if (btnPlay) btnPlay.textContent = "▶";
    clearInterval(timer);
    timer = null;
  }

  function alternar() { reproduciendo ? pausar() : reproducir(); }

  btnPlay?.addEventListener("click", (e) => { e.stopPropagation(); alternar(); });
  pantalla?.addEventListener("click", alternar);

  barra?.addEventListener("click", (e) => {
    const r = barra.getBoundingClientRect();
    tiempo = Math.min(DURACION, Math.max(0, (e.clientX - r.left) / r.width * DURACION));
    actualizarProgreso();
  });
  barra?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      tiempo = Math.min(DURACION, Math.max(0, tiempo + (e.key === "ArrowRight" ? 5 : -5)));
      actualizarProgreso();
    }
  });

  $("btnVolumen")?.addEventListener("click", (e) => {
    e.currentTarget.textContent = e.currentTarget.textContent === "🔊" ? "🔇" : "🔊";
  });
  $("btnSubtitulos")?.addEventListener("click", (e) => {
    const oculto = subtitulo?.classList.toggle("oculto");
    e.currentTarget.style.background = oculto ? "#fff" : "#ffff66";
  });
  const calidades = ["360p", "480p", "240p", "144p"];
  let i = 0;
  $("btnCalidad")?.addEventListener("click", (e) => {
    i = (i + 1) % calidades.length;
    e.currentTarget.textContent = calidades[i];
  });
  $("btnPantalla")?.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (contenedor?.requestFullscreen) contenedor.requestFullscreen().catch(() => {});
  });
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (e.code === "Space" && tag !== "INPUT" && tag !== "BUTTON") { e.preventDefault(); alternar(); }
  });

  actualizarProgreso();
})();
