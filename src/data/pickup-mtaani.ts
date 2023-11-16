import { supabase } from "../supabase.ts";

interface MtaaniLocation {
  location: string;
  agents: {
    name: string;
  }[];
}

export const PICKUP_MTAANI_NETWORK: MtaaniLocation[] = [
  {
    location: "Allsops, Ruaraka",
    agents: [{ name: "Qwanza laundry dry cleaners" }],
  },
  { location: "Banana", agents: [{ name: "Classic auto spares" }] },
  {
    location: "Buruburu",
    agents: [
      { name: "Karacare pharamacy Buruburu" },
      { name: "Blackpoint Buruburu" },
      { name: "Chravin auto spares" },
      { name: "Hope Salon" },
    ],
  },
  { location: "Banana", agents: [{ name: "Classic auto spares" }] },
  {
    location: "Cbd - town Nairobi",
    agents: [
      { name: "Philadelphia house" },
      { name: "Pickup mtaani star-mall" },
    ],
  },
  { location: "Choka", agents: [{ name: "Poa Dealz Investments" }] },
  { location: "Donholm", agents: [{ name: "ARCADE LINK" }] },
  { location: "Eastleigh", agents: [{ name: "Jafa Shoe Collection" }] },
  { location: "Fedha", agents: [{ name: "Battery center" }] },
  { location: "Garden Estate", agents: [{ name: "Kitu White" }] },
  { location: "Gigiri", agents: [{ name: "Halfprice books Village Market" }] },
  { location: "Githurai", agents: [{ name: "Sanfarm Pharmacy" }] },
  {
    location: "Great Wall Gardens(Athi River)",
    agents: [{ name: "The Corner Hub" }, { name: "Urbanika Enterprises" }],
  },
  {
    location: "Imara Daima",
    agents: [
      { name: "Imara Daima-Mwaniki Clothing Store" },
      { name: "Mwaniki Clothing Store" },
    ],
  },
  {
    location: "Industrial Area",
    agents: [{ name: "Karacare pharmacy Lusaka road" }],
  },
  { location: "Jamhuri Estate", agents: [{ name: "SHOPDIRECT" }] },
  {
    location: "Juja",
    agents: [
      { name: "Jimngash Phones and Accessories" },
      { name: "Anaya Pharmacy" },
      {
        name: "Crown Beauty shop",
      },
    ],
  },
  { location: "Kahawa Sukari", agents: [{ name: "Shades of beauty" }] },
  { location: "Kahawa Wendani", agents: [{ name: "Everything Mystique" }] },
  { location: "Kahawa West", agents: [{ name: "Calfix Phone Repair" }] },
  { location: "Kangemi", agents: [{ name: "Flexnett Cyber" }] },
  {
    location: "Karen",
    agents: [
      { name: "The Bottle O liquor store" },
      { name: "Meditas" },
      { name: "Karen Shopping Center @ SHOP" },
    ],
  },
  {
    location: "Kasarani",
    agents: [
      { name: "Pinky Rosy" },
      { name: "Janpharm Paramaceuticals" },
      { name: "A & S Baby World and Party Essentials" },
      { name: "Fancy Mitumba" },
    ],
  },
  {
    location: "Kenyatta University(Ku)",
    agents: [{ name: "YOUnique stationery" }],
  },
  {
    location: "Kiambu",
    agents: [
      { name: "Kellah Beauty" },
      { name: "Andy Kids" },
      { name: "Vitahealth chemist" },
    ],
  },
  { location: "Kikuyu", agents: [{ name: "The college" }] },
  {
    location: "Kimbo",
    agents: [
      { name: "Daisy laundry service and cleaning" },
      { name: "GLACIER FASHIONS" },
    ],
  },
  { location: "Kinoo", agents: [{ name: "Aigle Pharmacy" }] },
  { location: "Kiserian", agents: [{ name: "Xtreme Media Kiserian" }] },
  { location: "Kitengela", agents: [{ name: "Suds and duds Kitengela" }] },
  { location: "Kitisuru", agents: [{ name: "Fyty barber & Spa" }] },
  {
    location: "Komarock",
    agents: [{ name: "Haki kids collection" }, { name: "Endless Fancy Wear" }],
  },
  {
    location: "Langata",
    agents: [
      { name: "Geoline K Limited" },
      { name: "Karacare Parmacy Langata" },
      { name: "NABZ Kids Fashion" },
      { name: "Meissy Beauty" },
      { name: "Trend M Salon" },
    ],
  },
  {
    location: "Lavington",
    agents: [{ name: "Halfpriced Books, Lavington Mall" }],
  },
  { location: "Lower Kabete", agents: [{ name: "SNC Beauty" }] },
  {
    location: "Lucky Summer",
    agents: [{ name: "Qwanza Dry Cleaners, Lucky Summer" }],
  },
  {
    location: "Madaraka",
    agents: [{ name: "Madaraka Shopping Ctr-Makeos Auto Spare" }],
  },
  { location: "Marurui", agents: [{ name: "Duka Moja" }] },
  { location: "Matasia", agents: [{ name: "The Scotts Entertainment" }] },
  { location: "Mirema Drive", agents: [{ name: "Licks and Sips" }] },
  { location: "Mlolongo", agents: [{ name: "Cyber studio" }] },
  {
    location: "Nairobi",
    agents: [{ name: "Tubes Shelves" }, { name: "Be Shelved" }],
  },
  { location: "Nairobi West", agents: [{ name: "Samken Electronic" }] },
  { location: "Ngara", agents: [{ name: "Melbur Foods" }] },
  {
    location: "Ngong Racecourse",
    agents: [
      { name: "GESMAT ENT." },
      { name: "Karacare pharmacy Ngong Racecourse" },
    ],
  },
  {
    location: "Ngong Road",
    agents: [{ name: "Karacare pharmacy Ngong road" }],
  },
  {
    location: "Ngong Town",
    agents: [{ name: "African Gift Shop" }, { name: "The Yard Movie shop" }],
  },
  {
    location: "Nyayo(Embakasi)",
    agents: [{ name: "Nyayo Estate-The Link Cyber" }],
  },
  { location: "Parklands", agents: [{ name: "Silicone shop" }] },
  { location: "Ridgeways", agents: [{ name: "Bizsure insurance agency" }] },
  { location: "Riruta", agents: [{ name: "Shop500" }] },
  { location: "Roasters", agents: [{ name: "Winks Electricals" }] },
  {
    location: "Rongai",
    agents: [
      { name: "Xtreme Media-Behind Former Tumaini" },
      { name: "Xtreme media Tuskys" },
      { name: "Extreme media maasai lodge" },
      { name: "Xtreme media Kobil" },
      { name: "Xtreme Media Kware" },
    ],
  },
  { location: "Roysambu Flyover", agents: [{ name: "DMPOLIN" }] },
  {
    location: "Roysambu Lumumba Drive",
    agents: [{ name: "Cindy's happytoes collection" }],
  },
  {
    location: "Ruaka",
    agents: [
      { name: "Barbz barber shop" },
      { name: "Homecare and Hardware Two rivers" },
      { name: "Baby paradise 254" },
      { name: "Allqute dynasty cosmetic" },
      { name: "Kandy's Beauty Salon" },
      { name: "Sukiebeautyshop" },
    ],
  },
];

export const uploadLocations = async () => {
  for (const i in PICKUP_MTAANI_NETWORK) {
    await supabase
      .from("pickup mtaani locations")
      .insert([{ name: PICKUP_MTAANI_NETWORK[i].location }]);
  }
};

export const uploadAgents = async () => {
  for (const i in PICKUP_MTAANI_NETWORK) {
    for (const j in PICKUP_MTAANI_NETWORK[i].agents) {
      await supabase
        .from("pickup mtaani agents")
        .insert([
          {
            location: PICKUP_MTAANI_NETWORK[i].location,
            agent_name: PICKUP_MTAANI_NETWORK[i].agents[j].name,
          },
        ]);
    }
  }
};
