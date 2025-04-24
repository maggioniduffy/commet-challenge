import prisma from "@/lib/prisma";
import Table from "./components/Table";

async function getFiles() {
  try {
    const data = await prisma.upcomingCRM.findMany();
    const files = await Promise.all(
      data.map(async (file) => {
        const response = await fetch(file.path);
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        if (file.mimeType == "json") {
          const fileContent = await response.json();
          return {
            file: JSON.stringify(fileContent),
            type: file.mimeType,
            id: file.id,
          };
        }
        if (file.mimeType == "csv") {
          const fileContent = await response.text();
          return { file: fileContent, type: file.mimeType, id: file.id };
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
    <div className="flex flex-col items-center justify-items-center min-h-screen h-screen w-screen">
      <main className="w-full text-center gap-2 flex flex-col items-center justify-center md:p-10 min-h-92">
        <h1 className="text-4xl text-gray-900 font-bold w-full p-2 drop-shadow-md">
          {" "}
          COMMET{" "}
        </h1>
        <h3 className="text-cyan-700 text-xl font-medium text-left w-full p-2 drop-shadow-md">
          {" "}
          Files to transform:{" "}
        </h3>
        <div className="flex gap-2 justify-center h-fit w-full md:w-96 flex-wrap">
          {files && files.length > 0 ? (
            files.map((file) => (
              <p
                key={file?.file}
                className="text-gray-800 font-mono shadow mx-8 my-2 border border-cyan-100 rounded-lg p-1 bg-white"
              >
                {" "}
                {file?.file}
              </p>
            ))
          ) : (
            <span></span>
          )}
        </div>
        <Table files={files} />
      </main>
    </div>
  );
}
