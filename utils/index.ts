import { Sale } from "@/models";

const keys = ["id", "amount", "salesperson", "date"];

export function parseJSON(data: string): Sale[] {
  try {
    const objects = data.replaceAll("[", "").replace("]", "").split("},");

    const cmr = objects.map((data) => {
      let txt = data.trim();
      const i = txt.lastIndexOf("}");
      if (i < 0) {
        txt = txt + "}";
      }

      const raw = JSON.parse(txt);
      const values = Object.values(raw);
      let map = new Map();
      keys.forEach((key, i) => map.set(key, values[i]));

      map.set("comission", map.get("amount") * 0.1);
      return Object.fromEntries(map) as Sale;
    });

    return cmr;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Invalid JSON data");
  }
}

export function parseCSV(data: string): Sale[] {
  try {
    const lines = data.split("\r\n");
    lines.shift();
    const cmr: Sale[] = lines.map((line) => {
      const values = line.split(",");
      let map = new Map();
      keys?.forEach((key, i) => map.set(key, values[i]));

      map.set("comission", map.get("amount") * 0.1);
      return Object.fromEntries(map) as Sale;
    });

    return cmr;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw new Error("Invalid csv data");
  }
}
