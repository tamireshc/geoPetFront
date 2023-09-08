var map = L.map("map").setView([-19.8235803, -43.9811087], 6);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const select = document.getElementById("name");
const selectPet = document.getElementById("petName");

const fetchOwers = async () => {
  const url = "https://localhost:7225/Ower";

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.owerId;
      option.text = item.name;
      select.appendChild(option);
    });
    const selectedIndex = select.value;
    console.log("select ower index", selectedIndex);
    fetchPets(selectedIndex);
  } catch (error) {
    console.log(`Algo deu errado :( \n${error}`);
  }
};

fetchOwers();

function valorOwerSelecionadoAlterado() {
  const selectedValue = select.value;
  fetchPets(selectedValue);
  console.log(selectedValue);
}

select.onchange = valorOwerSelecionadoAlterado;

const fetchPets = async (id) => {
  const url = `https://localhost:7225/Ower/${id}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    while (selectPet.firstChild) {
      selectPet.removeChild(selectPet.firstChild);
    }

    data.pets.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.petId;
      option.text = item.name;
      selectPet.appendChild(option);
    });
    const selectedIndex = selectPet.value;
    console.log("select pet index", selectedIndex);
    fetchPetsPositions(selectedIndex);
  } catch (error) {
    console.log(`Algo deu errado :( \n${error}`);
  }
};

function valorPetSelecionadoAlterado() {
  const selectedValue = selectPet.value;
  fetchPetsPositions(selectedValue);
  console.log(selectedValue);
}

selectPet.onchange = valorPetSelecionadoAlterado;

const fetchPetsPositions = async (id) => {
  const url = `https://localhost:7225/Pet/${id}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("positions", data);

    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    data.positions.forEach((item) => {
      L.marker([item.latitude, item.longitude]).addTo(map);
    });
  } catch (error) {
    console.log(`Algo deu errado :( \n${error}`);
  }
};

const fetchAddress = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data.display_name;
  } catch (error) {
    console.log(`Algo deu errado :( \n${error}`);
  }
};

var popup = L.popup();

async function onMapClick(e) {
  const values = await fetchAddress(e.latlng.lat, e.latlng.lng);
  console.log("e", e.latlng.lat);
  console.log(values);
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at:  " + values)
    .openOn(map);
}

map.on("click", onMapClick);
