import { File, Sale, UpcomingCMR } from "@/models";

const keys = ["id", "amount", "salesperson", "date"];

// Format 1: "YYYY-MM-DD"
const dateRegex = /^\d{4}\d{2}-\d{2}$/;

function checkAndParseDate(dateString: string) {
  const parsedDate = new Date(dateString as string);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getObject(values: any[]) {
  let map = new Map<string, any>();
  keys?.forEach((key, i) => {
    let value = values[i];
    if (key === "date" && !dateRegex.test(value as string)) {
      value = checkAndParseDate(value as string);
    }

    if (key === "amount" && typeof value === "string") {
      map.set(key, parseFloat(value));
    } else {
      map.set(key, value);
    }
  });

  map.set("comission", map.get("amount") * 0.1);
  return Object.fromEntries(map) as Sale;
}

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
      return getObject(values);
    });

    return cmr;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Something went wrong or invalid data");
  }
}

export function parseCSV(data: string): Sale[] {
  try {
    const lines = data.split("\r\n");
    lines.shift();
    const cmr: Sale[] = lines.map((line) => {
      const values = line.split(",");
      return getObject(values);
    });

    return cmr;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw new Error("Something went wrong or invalid data");
  }
}

export async function getContent(
  file: UpcomingCMR,
  response: Response
): Promise<File> {
  let fileContent = "";
  let content;
  console.log("file", file.mimeType == "csv");
  if (file.mimeType == "json") {
    fileContent = await response.json();
    content = JSON.stringify(fileContent);
  } else {
    if (file.mimeType == "csv") {
      const fileContent = await response.text();
      content = fileContent;
    } else {
      console.log;
      throw new Error("Invalid file type");
    }
  }

  const type = file.mimeType;
  const id = file.id;
  return {
    content,
    type,
    id,
  };
}
