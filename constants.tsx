
import React from 'react';
import { CabType, CabOption } from './types';

const SedanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-indigo-500">
    <path d="M5.625 3.75a2.25 2.25 0 0 0-2.25 2.25V12.75A2.25 2.25 0 0 0 5.625 15h12.75A2.25 2.25 0 0 0 20.625 12.75V6A2.25 2.25 0 0 0 18.375 3.75H5.625ZM1.5 12.75a.75.75 0 0 0-.75.75v2.25a.75.75 0 0 0 .75.75h.75v-.75A2.25 2.25 0 0 1 4.5 13.5h15a2.25 2.25 0 0 1 2.25 2.25V16.5h.75a.75.75 0 0 0 .75-.75v-2.25a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v.75H6v-.75a.75.75 0 0 0-.75-.75h-3Z" />
    <path fillRule="evenodd" d="M6 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
  </svg>
);

const SuvIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-teal-500">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm19.5 0a9.75 9.75 0 1 1-19.5 0 9.75 9.75 0 0 1 19.5 0ZM8.25 10.875a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5H9Z" clipRule="evenodd" /> {/* Placeholder for SUV, using a generic car icon for now */}
    <path d="M3.375 9.375A1.875 1.875 0 0 0 1.5 11.25v1.5A1.875 1.875 0 0 0 3.375 14.625H4.5V18h-2.25a.75.75 0 0 0-.75.75V21a.75.75 0 0 0 .75.75H6a.75.75 0 0 0 .75-.75v-2.25A.75.75 0 0 0 6 18h12a.75.75 0 0 0 .75.75v2.25a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V18.75a.75.75 0 0 0-.75-.75H19.5V14.625h1.125a1.875 1.875 0 0 0 1.875-1.875v-1.5A1.875 1.875 0 0 0 20.625 9.375H3.375Z" />
    <path fillRule="evenodd" d="M6.75 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
  </svg>
);

const LuxuryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-amber-500">
    <path fillRule="evenodd" d="M6.143 4.012a.75.75 0 0 1 .75.105l2.75 1.75a.75.75 0 0 1 0 1.266l-2.75 1.75a.75.75 0 0 1-1.008-.52V4.635a.75.75 0 0 1 .508-.728Zm11.714 0a.75.75 0 0 0-.508-.728L14.6 3.259a.75.75 0 0 0-1.008.52v3.932a.75.75 0 0 0 1.008.52l2.75-1.75a.75.75 0 0 0 0-1.266l-2.75-1.75a.75.75 0 0 0-1.008.52V4.635a.75.75 0 0 0 .508.728l2.75 1.022a.75.75 0 0 0 .75-.105l2.75-1.75a.75.75 0 0 0 0-1.266L17.857 4.012Z" clipRule="evenodd" /> {/* Placeholder - using a star like icon for luxury */}
    <path d="M3 9.375A1.875 1.875 0 0 1 1.125 7.5V6A1.875 1.875 0 0 1 3 4.125h18A1.875 1.875 0 0 1 22.875 6v1.5A1.875 1.875 0 0 1 21 9.375H3ZM1.5 12.75V15A1.875 1.875 0 0 0 3.375 16.875h17.25A1.875 1.875 0 0 0 22.5 15v-2.25H1.5Z" />
     <path fillRule="evenodd" d="M5.25 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
  </svg>
);

const MinivanIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-cyan-500">
  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V17.625c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V6.375c0-1.036-.84-1.875-1.875-1.875H3.375ZM10.5 7.875c0-.414.336-.75.75-.75h4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-1.5ZM4.875 9c.414 0 .75-.336.75-.75V7.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V9a.75.75 0 0 0 .75.75h1.5ZM4.875 12.75c.414 0 .75-.336.75-.75V11.25a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v.75c0 .414.336.75.75.75h1.5ZM18.375 9c.414 0 .75-.336.75-.75V7.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V9a.75.75 0 0 0 .75.75h1.5ZM18.375 12.75c.414 0 .75-.336.75-.75V11.25a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v.75c0 .414.336.75.75.75h1.5Z" />
  <path fillRule="evenodd" d="M5.25 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM18.75 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
</svg>
);


export const AVAILABLE_CAB_OPTIONS: CabOption[] = [
  {
    id: 'sedan_comfort',
    type: CabType.SEDAN,
    name: 'Comfort Sedan',
    description: 'A comfortable and reliable choice for city rides. Perfect for solo travelers or couples.',
    capacity: 4,
    baseFare: 5.00,
    perKmRate: 1.20,
    perMinuteRate: 0.20,
    icon: <SedanIcon />,
    image: 'https://picsum.photos/seed/sedan/300/200',
  },
  {
    id: 'suv_family',
    type: CabType.SUV,
    name: 'Family SUV',
    description: 'Spacious and robust, ideal for families or groups with extra luggage.',
    capacity: 6,
    baseFare: 8.00,
    perKmRate: 1.80,
    perMinuteRate: 0.30,
    icon: <SuvIcon />,
    image: 'https://picsum.photos/seed/suv/300/200',
  },
  {
    id: 'luxury_premium',
    type: CabType.LUXURY,
    name: 'Premium Luxury',
    description: 'Travel in style and comfort with our top-of-the-line luxury vehicles.',
    capacity: 3,
    baseFare: 15.00,
    perKmRate: 3.00,
    perMinuteRate: 0.50,
    icon: <LuxuryIcon />,
    image: 'https://picsum.photos/seed/luxury/300/200',
  },
  {
    id: 'minivan_group',
    type: CabType.MINIVAN,
    name: 'Group Minivan',
    description: 'The best option for larger groups, ensuring everyone travels together comfortably.',
    capacity: 8,
    baseFare: 10.00,
    perKmRate: 2.20,
    perMinuteRate: 0.35,
    icon: <MinivanIcon />,
    image: 'https://picsum.photos/seed/minivan/300/200',
  },
];

export const DUMMY_DRIVERS = [
  { name: "Alex Johnson", vehicleModel: "Toyota Camry", contact: "555-0101" },
  { name: "Maria Rodriguez", vehicleModel: "Honda CR-V", contact: "555-0102" },
  { name: "David Lee", vehicleModel: "Mercedes S-Class", contact: "555-0103" },
  { name: "Sarah Chen", vehicleModel: "Ford Transit", contact: "555-0104" },
  { name: "Mike Brown", vehicleModel: "Tesla Model 3", contact: "555-0105" },
];

export const API_REQUEST_DELAY = 1500; // ms
