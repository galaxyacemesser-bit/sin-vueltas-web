const SUPABASE_URL = "https://ewjpqmjheohnzzybpshk.supabase.co";
const SUPABASE_KEY = "sb_publishable_wDCAqHFH7FcU0Jl6SlF9HQ_Pws13cKK";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
window.supabaseClient =
  supabaseClient;

// CONTADOR TOTAL

async function cargarDisponibles() {

  const texto = document.getElementById("availability-text");

  const { count, error } = await supabaseClient
    .from("profesionales")
    .select("*", { count: "exact", head: true })
    .eq("localidad", "Escobar")
    .eq("disponible", true);

  if (error) {
    console.error("Error al consultar Supabase:", error);
    texto.textContent = "No se pudo cargar la disponibilidad";
    return;
  }

texto.textContent =
  count === 1
    ? "1 profesional disponible ahora en Escobar"
    : `${count} profesionales disponibles ahora en Escobar`;
}


// CONTADORES POR OFICIO

async function contarPorOficio(oficio, elementoId) {

  const elemento = document.getElementById(elementoId);

  const { count, error } = await supabaseClient
    .from("profesionales")
    .select("*", { count: "exact", head: true })
    .eq("localidad", "Escobar")
    .eq("disponible", true)
    .eq("oficio", oficio);

  if (error) {
    console.error(`Error consultando ${oficio}:`, error);
    elemento.textContent = "—";
    return;
  }

  elemento.textContent = count;
}


// CARGAMOS LOS DATOS

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
async function cargarProfesionales() {

  const contenedor =
    document.getElementById("professionals-container");

  const { data, error } = await supabaseClient
    .from("profesionales")
    .select("nombre, oficio, localidad, radio_km")
    .eq("localidad", "Escobar")
    .eq("disponible", true)
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

    tarjeta.className = "professional-card";

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

      <button class="profile-button">
        Ver profesional
      </button>
    `;

    contenedor.appendChild(tarjeta);

  });
}

cargarProfesionales();
