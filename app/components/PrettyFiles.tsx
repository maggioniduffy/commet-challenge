import { File } from "@/models";

interface Props {
  files?: (File | undefined)[];
}

const PrettyFiles = ({ files }: Props) => {
  return (
    <div className="flex justify-center h-full w-full md:w-fit flex-wrap gap-2">
      {files &&
        files.length > 0 &&
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
        ))}
    </div>
  );
};

export default PrettyFiles;
