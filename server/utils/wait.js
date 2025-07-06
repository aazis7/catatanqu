export const wait = async (dur = 500) =>
  new Promise((res) => setTimeout(res, dur));
