/**
 * Static location hierarchy for Telangana and manual entry fallback.
 * Easily extensible for more states and districts.
 */

export interface BlockData {
  id: string;
  name: string;
  villages: string[];
}

export interface DistrictData {
  id: string;
  name: string;
  blocks: BlockData[];
}

export interface StateData {
  id: string;
  name: string;
  districts: DistrictData[];
}

export const STATIC_LOCATIONS: StateData[] = [
  {
    id: 'telangana',
    name: 'Telangana',
    districts: [
      {
        id: 'jangaon',
        name: 'Jangaon',
        blocks: [
          {
            id: 'jangaon_mandal',
            name: 'Jangaon Mandal',
            villages: ['Pembarthi', 'Yeshwanthapur', 'Vadlakonda', 'Shamirpet', 'Jangaon Rural'],
          },
          {
            id: 'bachannapet',
            name: 'Bachannapet',
            villages: ['Alimpur', 'Bachannapet', 'Kodavatoor', 'Ramachandrapur'],
          },
          {
            id: 'devaruppula',
            name: 'Devaruppula',
            villages: ['Devaruppula', 'Singarajupalle', 'Madaram', 'Chinnaramcherla'],
          },
          {
            id: 'station_ghanpur',
            name: 'Station Ghanpur',
            villages: ['Station Ghanpur', 'Chaggal', 'Shivunipally', 'Ippaguda'],
          },
          {
            id: 'palakurthy',
            name: 'Palakurthy',
            villages: ['Palakurthy', 'Valmidi', 'Vasanthapur', 'Dardapally'],
          },
        ],
      },
      {
        id: 'warangal',
        name: 'Warangal',
        blocks: [
          {
            id: 'warangal_urban',
            name: 'Warangal',
            villages: ['Deshaipet', 'Enamamula', 'Paidipally', 'Ursu'],
          },
          {
            id: 'khila_warangal',
            name: 'Khila Warangal',
            villages: ['Fort Warangal', 'Mamnoor', 'Bolikunta', 'Timmapur'],
          },
          {
            id: 'geesugonda',
            name: 'Geesugonda',
            villages: ['Geesugonda', 'Mogilicherla', 'Gorrekunta', 'Dharmaram'],
          },
          {
            id: 'wardhannapet',
            name: 'Wardhannapet',
            villages: ['Wardhannapet', 'Bandautlapally', 'Kakkiralapally', 'Inavolu'],
          },
        ],
      },
      {
        id: 'nizamabad',
        name: 'Nizamabad',
        blocks: [
          {
            id: 'nizamabad_north',
            name: 'Nizamabad North',
            villages: ['Kanteshwar', 'Mubaraknagar', 'Pangra', 'Sarangapur'],
          },
          {
            id: 'nizamabad_south',
            name: 'Nizamabad South',
            villages: ['Arsapally', 'Dubba', 'Madhavnagar', 'Manikbhandar'],
          },
          {
            id: 'armoor',
            name: 'Armoor',
            villages: ['Armoor', 'Mamidipally', 'Perkit', 'Issapally'],
          },
          {
            id: 'bodhan',
            name: 'Bodhan',
            villages: ['Bodhan', 'Salura', 'Rakasipet', 'Shakarnagar'],
          },
        ],
      },
      {
        id: 'karimnagar',
        name: 'Karimnagar',
        blocks: [
          {
            id: 'karimnagar_mandal',
            name: 'Karimnagar',
            villages: ['Rekurthi', 'Theegalaguttapally', 'Chinthakunta', 'Bommakal'],
          },
          {
            id: 'choppadandi',
            name: 'Choppadandi',
            villages: ['Choppadandi', 'Gumlapur', 'Vedurugatta', 'Kolimikunta'],
          },
          {
            id: 'gangadhara',
            name: 'Gangadhara',
            villages: ['Gangadhara', 'Kurikyala', 'Venkatayapally', 'Sarvareddypally'],
          },
          {
            id: 'huzurabad',
            name: 'Huzurabad',
            villages: ['Huzurabad', 'Bornapalli', 'Kanaparthi', 'Sirsapalli'],
          },
        ],
      },
      {
        id: 'medak',
        name: 'Medak',
        blocks: [
          {
            id: 'medak_mandal',
            name: 'Medak',
            villages: ['Medak Rural', 'Ausulapally', 'Kuchanpally', 'Rayanpally'],
          },
          {
            id: 'havelighanpur',
            name: 'Havelighanpur',
            villages: ['Havelighanpur', 'Burugupally', 'Thogita', 'Nagapur'],
          },
          {
            id: 'ramayampet',
            name: 'Ramayampet',
            villages: ['Ramayampet', 'D. Dharmaram', 'Jhansilingapur', 'Raylapur'],
          },
          {
            id: 'chegunta',
            name: 'Chegunta',
            villages: ['Chegunta', 'Makkarajpet', 'Polampally', 'Wadiyaram'],
          },
        ],
      },
    ],
  },
];

export const OTHER_OPTION_VALUE = '__OTHER__';

export const BUSINESS_CATEGORIES = [
  'Dairy',
  'Retail / Kirana',
  'Textiles / Tailoring',
  'Food processing',
  'Poultry',
  'Mobile repair',
  'Agri-inputs',
  'Other'
];

