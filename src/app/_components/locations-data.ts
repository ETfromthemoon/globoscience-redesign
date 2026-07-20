export interface Location {
  region: string;
  city: string;
  addr: string;
  phone: string;
  photo: string;
  lat: number;
  lng: number;
}

/** El índice 0 es el HQ — origen de los arcos de conexión del globo */
export const LOCATIONS: Location[] = [
  {
    region: "North America", city: "Boston",
    addr: "One Washington Mall, Suite #1066, Government Center, Boston, MA 02108",
    phone: "+1 617 583 5727",
    photo: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    lat: 42.36, lng: -71.06,
  },
  {
    region: "Europe", city: "London",
    addr: "11 Westferry Circus, London E14 8RH, United Kingdom",
    phone: "+44 74 5128 6444",
    photo: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    lat: 51.51, lng: -0.13,
  },
  {
    region: "EU Headquarters", city: "Amsterdam",
    addr: "World Trade Center, Strawinskylaan 1, 1077 XW Amsterdam",
    phone: "+31 9 700 503 3004",
    photo: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
    lat: 52.37, lng: 4.90,
  },
  {
    region: "France", city: "Lyon",
    addr: "Tour Part-Dieu, 129 Rue Servient, 69326 Lyon Cedex 3",
    phone: "+33 7 5793 5000",
    photo: "https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=1200&q=80",
    lat: 45.76, lng: 4.84,
  },
  {
    region: "Canada", city: "Toronto",
    addr: "181 University Ave, Toronto, ON M5H 3M7",
    phone: "+1 416 907 9455",
    photo: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1200&q=80",
    lat: 43.65, lng: -79.38,
  },
  {
    region: "Latin America", city: "Santiago",
    addr: "Entrevalle #62 G-864-F, Alhue, Curacavi, Region Metropolitana, Chile",
    phone: "+56 2 2582 9330",
    photo: "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=1200&q=80",
    lat: -33.45, lng: -70.67,
  },
  {
    region: "South Asia", city: "Rawalpindi",
    addr: "Office # M-91, First Floor, Midway Centrum, 6th Rd, Rawalpindi 46000",
    phone: "+92 301 9333400",
    photo: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80",
    lat: 33.60, lng: 73.04,
  },
];
