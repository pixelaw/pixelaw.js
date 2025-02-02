// src/DojoSqlPixelStore.webworker.ts
self.onmessage = async (event) => {
  const query = event.data.query;
  try {
    const result = {};
    const response = await fetch(`http://localhost:8080/sql?query=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const json = await response.json();
    for (const p of json) {
      const x = p.v >> 16;
      const y = p.v & 65535;
      const pixel = { color: p.c, x, y, text: p.t };
      const key = `${x}_${y}`;
      result[key] = pixel;
    }
    self.postMessage({ success: true, data: result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
