import { PassengerConfig } from './types';

export const passengerConfig: PassengerConfig = {
  congestionRanges: {
    MEDIUM: {
      MIN: parseInt(process.env.REACT_APP_MEDIUM_CONGESTION_PERCENTAGE_MIN || '150', 10),
      MAX: parseInt(process.env.REACT_APP_MEDIUM_CONGESTION_PERCENTAGE_MAX || '200', 10),
      COLOR_RANGE: `train-passenger-medium`
    },
    HIGH: {
      MIN: parseInt(process.env.REACT_APP_HIGH_CONGESTION_PERCENTAGE_MAX || '200', 10),
      COLOR_RANGE: `train-passenger-high`
    },
    LOW: {
      MIN: parseInt(process.env.REACT_APP_LOW_CONGESTION_PERCENTAGE_MIN || '100', 10),
      MAX: parseInt(process.env.REACT_APP_LOW_CONGESTION_PERCENTAGE_MAX || '150', 10),
      COLOR_RANGE: `train-passenger-low`
    }
  }
};
