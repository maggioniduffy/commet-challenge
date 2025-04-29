import prisma from "@/lib/prisma";
import CustomTable from "./components/Table";
import PrettyFiles from "./components/PrettyFiles";

async function getFiles() {
  try {
    let data;
    try {
      data = await prisma.upcomingCRM.findMany({ skip: 0 });
    } catch (error: { code: string } | any) {
      if (error.code === "42P05") {
        // Retry once if we hit the prepared statement error
        data = await prisma.upcomingCRM.findMany({
          skip: 0,
        });
      } else {
        throw error;
      }
    }
    const files = await Promise.all(
      data.map(async (file) => {
        const response = await fetch(file.path);
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        if (file.mimeType == "json") {
          const fileContent = await response.json();
          return {
            content: JSON.stringify(fileContent),
            type: file.mimeType,
            id: file.id,
          };
        }
        if (file.mimeType == "csv") {
          const fileContent = await response.text();
          return { content: fileContent, type: file.mimeType, id: file.id };
        }
      })
    );

    return files;
  } catch (error) {
    console.log("Error fetching files:", error);
  }
}

export default async function Home() {
  const files = await getFiles();

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen w-11/12 mx-auto">
      <main className="w-full text-center flex flex-col items-center justify-center min-h-92">
        <h1 className="text-5xl text-gray-900 font-extrabold w-full p-2 drop-shadow-md">
          {" "}
          Commet Challenge{" "}
        </h1>
        <p className="text-gray-400"> by Faustino Maggioni Duffy </p>
        <h3 className="text-cyan-600 text-xl font-medium text-center w-full p-2 drop-shadow-md">
          {" "}
          Files to transform:{" "}
        </h3>
        <PrettyFiles files={files} />
        <CustomTable files={files} />
      </main>
    </div>
  );
}
