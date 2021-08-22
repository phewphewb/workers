const LOOP_LIMIT = 10000;

export const loop = () => {
  let i = 0;
  while (i < LOOP_LIMIT) {
    i++;
  }
};

export const delaySync = (cb) => {
  let j = 0;
  while (j < LOOP_LIMIT) {
    loop();
    j++;
  }
  cb();
};
