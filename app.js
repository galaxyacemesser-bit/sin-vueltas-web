const SUPABASE_URL = "https://ewjpqmjheohnzzybpshk.supabase.co";
const SUPABASE_KEY = "sb_publishable_wDCAqHFH7FcU0Jl6SlF9HQ_Pws13cKK";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

window.supabaseClient = supabaseClient;


// ======================================================
// ZONAS INICIALES SIN VUELTAS
// ======================================================

const ZONAS_INICIALES = [
  "Escobar",
  "Belén de Escobar",
  "Matheu",
  "Garín",
  "Pilar",
  "Campana",
  "Zárate"
];


// ======================================================
// CONTADOR TOTAL
// ======================================================

async function cargarDisponibles() {

  const texto =
    document.getElementById("availability-text");

  if (!texto) return;

  const { count, error } = await supabaseClient
    .from("profesionales")
    .select("*", {
      count: "exact",
      head: true
    })
    .in("localidad", ZONAS_INICIALES)
    .eq("disponible", true)
    .eq("activo", true);

  if (error) {

    console.error(
      "Error al consultar Supabase:",
      error
    );

    texto.textContent =
      "No se pudo cargar la disponibilidad";

    return;
  }

  texto.textContent =
    count === 1
      ? "1 profesional disponible ahora"
      : `${count} profesionales disponibles ahora`;
}


// ======================================================
// CONTADORES POR OFICIO
// ======================================================

async function contarPorOficio(
  oficio,
  elementoId
) {

  const elemento =
    document.getElementById(elementoId);

  if (!elemento) return;

  const { count, error } = await supabaseClient
    .from("profesionales")
    .select("*", {
      count: "exact",
      head: true
    })
    .in("localidad", ZONAS_INICIALES)
    .eq("disponible", true)
    .eq("activo", true)
    .eq("oficio", oficio);

  if (error) {

    console.error(
      `Error consultando ${oficio}:`,
      error
    );

    elemento.textContent = "—";

    return;
  }

  elemento.textContent = count;
}


// ======================================================
// CARGAMOS CONTADORES
// ======================================================

cargarDisponibles();

contarPorOficio(
  "Electricista",
  "electricistas-count"
);

contarPorOficio(
  "Plomero",
  "plomeros-count"
);

contarPorOficio(
  "Aire acondicionado",
  "aires-count"
);

contarPorOficio(
  "Herrero",
  "herreros-count"
);


// ======================================================
// PROFESIONALES DISPONIBLES
// ======================================================

async function cargarProfesionales() {

  const contenedor =
    document.getElementById(
      "professionals-container"
    );

  if (!contenedor) return;

  const { data, error } = await supabaseClient
    .from("profesionales")
    .select(
      "nombre, oficio, localidad, radio_km"
    )
    .in("localidad", ZONAS_INICIALES)
    .eq("disponible", true)
    .eq("activo", true)
    .limit(6);

  if (error) {

    console.error(
      "Error cargando profesionales:",
      error
    );

    contenedor.innerHTML =
      "<p>No pudimos cargar los profesionales.</p>";

    return;
  }

  if (!data || data.length === 0) {

    contenedor.innerHTML =
      "<p>No hay profesionales disponibles en este momento.</p>";

    return;
  }

  contenedor.innerHTML = "";

  data.forEach((profesional) => {

    const tarjeta =
      document.createElement("article");

    tarjeta.className =
      "professional-card";

    tarjeta.innerHTML = `
      <div class="professional-top">

        <div class="professional-avatar">
          👤
        </div>

        <div class="professional-info">
          <h3>${profesional.nombre}</h3>
          <p>${profesional.oficio}</p>
        </div>

        <span class="available-badge">
          ● DISPONIBLE
        </span>

      </div>

      <div class="professional-details">

        <span>
          📍 ${profesional.localidad}
        </span>

        <span>
          📡 Hasta ${profesional.radio_km} km
        </span>

      </div>

      <button
        class="profile-button"
        type="button"
      >
        Ver profesional
      </button>
    `;

    contenedor.appendChild(tarjeta);

  });
}


// ======================================================
// INICIAR CARGA
// ======================================================

cargarProfesionales();
