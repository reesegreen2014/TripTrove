import { expect } from 'chai';
const { getTripDetailsForTraveler, calculateTotalAmountSpent, categorizeTrips, filterTripsByTraveler } = require('../../src/Logic Functions/tripProcessor');
const { testData } = require('../Datasets for Tests/tripProcessor-data');

describe('Trip Processor Functions', () => {
  const { travelers, trips, destinations } = testData;
  describe('getTripDetailsForTraveler', () => {
    it('should be a function', () => {
      expect(getTripDetailsForTraveler).to.be.a('function');
    });

    it('should return trip details for a specific traveler', () => {
      const travelerId = 10;
      const traveler = travelers.find(traveler => traveler.id === travelerId);
      const expectedTrips = trips.filter(trip => traveler.trips.includes(trip.id));
      const expectedDetails = getTripDetailsForTraveler(travelerId, trips, destinations);

      expect(expectedDetails).to.deep.equal({
        pastTrips: categorizeTrips(expectedTrips).pastTrips,
        upcomingTrips: categorizeTrips(expectedTrips).upcomingTrips,
        pendingTrips: categorizeTrips(expectedTrips).pendingTrips,
        totalAmountSpent: calculateTotalAmountSpent(categorizeTrips(expectedTrips).pastTrips, destinations, 2024)
      });
    });

    it('should return null if travelerId is not found', () => {
      const travelerId = 99; 
      const expectedDetails = getTripDetailsForTraveler(travelerId, trips, destinations);
      expect(expectedDetails).to.be.null;
    });
  });

  describe('filterTripsByTraveler', () => {
    it('should return an empty array if no trips exist for the traveler', () => {
      const travelerId = 99; 
      const filteredTrips = filterTripsByTraveler(trips, travelerId);
      expect(filteredTrips).to.be.an('array').that.is.empty;
    });

    it('should return trips associated with the specified traveler', () => {
      const travelerId = 20; 
      const filteredTrips = filterTripsByTraveler(trips, travelerId);
      expect(filteredTrips).to.be.an('array').that.is.not.empty;
      expect(filteredTrips.every(trip => trip.userID === travelerId)).to.be.true;
    });
  });

  describe('calculateTotalAmountSpent', () => {
    it('should be a function', () => {
      expect(calculateTotalAmountSpent).to.be.a('function');
    });

    it('should calculate the total amount spent for a traveler in a given year', () => {
      const pastTrips = testData.trips.filter(trip => trip.status === 'past');
      const expectedAmount = calculateTotalAmountSpent(pastTrips, testData.destinations, 2024);
      expect(expectedAmount).to.equal(0);
    });

    it('should return 0 if pastTrips is empty', () => {
      const expectedAmount = calculateTotalAmountSpent([], testData.destinations, 2024);
      expect(expectedAmount).to.equal(0);
    });
  });

  describe('categorizeTrips', () => {
    it('should be a function', () => {
      expect(categorizeTrips).to.be.a('function');
    });

    it('should categorize trips into past, upcoming, and pending', () => {
      const categorized = categorizeTrips(trips);
      expect(categorized).to.have.property('pastTrips');
      expect(categorized).to.have.property('upcomingTrips');
      expect(categorized).to.have.property('pendingTrips');
    });

    it('should return empty arrays for all categories if no trips are provided', () => {
      const categorized = categorizeTrips([]);
      expect(categorized.pastTrips).to.be.an('array').that.is.empty;
      expect(categorized.upcomingTrips).to.be.an('array').that.is.empty;
      expect(categorized.pendingTrips).to.be.an('array').that.is.empty;
    });
  });
});