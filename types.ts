import React from 'react';

export enum CabType {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  LUXURY = 'Luxury',
  MINIVAN = 'Minivan',
}

export interface CabOption {
  id: string;
  type: CabType;
  name: string;
  description: string;
  capacity: number;
  baseFare: number;
  perKmRate: number; // Cost per kilometer
  perMinuteRate: number; // Cost per minute of travel
  icon: React.ReactNode;
  image: string; // URL for a representative image
}

export interface BookingRequestData {
  pickupLocation: string;
  destination: string;
  cabId: string; // To identify the specific cab option selected
}

export interface EstimatedFareDetails {
  cab: CabOption;
  distance: number; // in km
  duration: number; // in minutes
  fare: number;
  eta: number; // in minutes to arrival
}

export enum BookingStatus {
  PENDING_CONFIRMATION = 'Pending Confirmation',
  CONFIRMED = 'Confirmed - Driver En Route',
  ARRIVED = 'Driver Arrived',
  IN_PROGRESS = 'Trip In Progress',
  COMPLETED = 'Trip Completed',
  CANCELLED = 'Trip Cancelled',
  FAILED = 'Booking Failed',
}

export interface BookingDetails {
  bookingId: string;
  pickupLocation: string;
  destination: string;
  cab: CabOption;
  fare: number;
  eta: number; // ETA of driver to pickup
  driverName: string;
  vehicleModel: string;
  vehicleNumber: string;
  driverContact: string;
  status: BookingStatus;
  driverGreeting?: string; // Optional AI generated greeting
}

export type AppView = 'LOGIN' | 'REGISTER' | 'HOME' | 'SELECTING_CAB' | 'CONFIRMATION' | 'LOADING' | 'ERROR';