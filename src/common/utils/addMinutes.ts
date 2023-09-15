import addSeconds from './addSeconds';

export default (date: Date, minutes: number): Date => {
  return addSeconds(date, minutes * 60);
};
