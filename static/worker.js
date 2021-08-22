const run = (body, params, args) => new Function(params, body)(...args);

onmessage = (e) => {
  const body = e.data.body;
  const params = e.data.params;
  const args = e.data.args;
  const result = run(body, params, args);
  postMessage(result);
};
