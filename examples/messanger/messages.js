const messanger = {
  input: async (value) =>
    await com.run({
      module: "messanger",
      method: "input",
      data: value,
      notify: {
        port: -1,
        events: ["/messanger/current"],
      },
    }),
  add: async (value) =>
    await com.run({
      module: "messanger",
      method: "add",
      data: value,
      notify: {
        port: -1,
        events: ["/messanger"],
      },
    }),
};

export default messanger;
