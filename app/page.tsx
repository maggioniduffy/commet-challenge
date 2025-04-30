import prisma from "@/lib/prisma";
import CustomTable from "./components/Table";
import PrettyFiles from "./components/PrettyFiles";
import { UpcomingCMR } from "@/models";
import { getContent } from "@/utils";

async function getFiles() {
  try {
    const data = await prisma.upcomingCRM.findMany({ skip: 0 });
    const files = await Promise.all(
      data.map(async (file) => {
        const response = await fetch(file.path);
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        return await getContent(file, response);
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
