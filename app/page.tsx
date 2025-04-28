import prisma from "@/lib/prisma";
import CustomTable from "./components/Table";

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
        <div className="flex justify-center h-full w-full md:w-fit flex-wrap gap-2">
          {files && files.length > 0 ? (
            files.map((file) => (
              <div key={file?.id} className="text-left h-full">
                {file?.type == "csv" ? (
                  <p
                    key={file?.content}
                    className="w-fit text-gray-800 font-mono shadow my-2 border border-cyan-100 rounded-lg p-1 bg-white"
                  >
                    {file &&
                      file.content?.split("\r\n").map((line, i) => {
                        return (
                          <span key={line + i}>
                            {line.split(",").map((item) => {
                              return <span key={item + i}>{item + ", "}</span>;
                            })}
                            <br />
                          </span>
                        );
                      })}
                  </p>
                ) : (
                  <pre
                    key={file?.content}
                    className="text-gray-800 font-mono shadow my-2 border border-cyan-100 rounded-lg p-1 bg-white"
                  >
                    {file && JSON.stringify(JSON.parse(file.content), null, 2)}
                  </pre>
                )}
              </div>
            ))
          ) : (
            <span></span>
          )}
        </div>
        <CustomTable files={files} />
      </main>
    </div>
  );
}
