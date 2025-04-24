import prisma from "@/lib/prisma";
import { UpcomingCMR } from "@/models";
import Table from "./components/Table";

export async function getFiles() {
  try {
    const data: UpcomingCMR[] = await prisma.upcomingCRM.findMany();
    const files = await Promise.all(
      data.map(async (file) => {
        const response = await fetch(file.path);
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        if (file.mimeType == "json") {
          const fileContent = await response.json();
          return { file: JSON.stringify(fileContent), type: file.mimeType };
        }
        if (file.mimeType == "csv") {
          const fileContent = await response.text();
          return { file: fileContent, type: file.mimeType };
        }
      })
    );

    console.log("files", await files[1]);
    return files;
  } catch (error) {
    console.log("Error fetching files:", error);
  }
}

export default async function Home() {
  const files = await getFiles();
  console.log("files client", files);
  return (
    <div className="flex flex-col items-center bg-gray-200 justify-items-center min-h-screen h-screen w-screen">
      <main className="w-full text-center gap-5 flex flex-col items-center justify-center p-10 min-h-92">
        <h3 className="text-black text-2xl font-bold"> Files to transform </h3>
        <div className="flex gap-2 justify-center min-w-full h-fit w-fit">
          {files && files.length > 0 ? (
            files.map((file) => (
              <p
                key={file?.file}
                className="text-gray-800 font-medium shadow w-6/12 border rounded-lg p-2 bg-gray-100"
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
