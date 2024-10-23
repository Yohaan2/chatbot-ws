const activeHours = {
  start: 8,  // 8:00 AM
  end: 22    // 10:00 PM
};

export const isWithinActiveHours = () => {
  const currentHour = new Date().getHours();
  return currentHour >= activeHours.start && currentHour < activeHours.end;
};