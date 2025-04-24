"use client";

import { columns } from "@/constants";
import { Sale } from "@/models";
import { parseCSV, parseJSON } from "@/utils";
import React, { useState } from "react";

interface Props {
  files?: ({ file: any; type: string } | undefined)[];
}

const Table = ({ files }: Props) => {
  const [sales, setSales] = useState<Sale[]>();

  const transform = () => {
    let cmr: Sale[] = [];
    files?.forEach((file) => {
      if (file?.type == "json") {
        const json = parseJSON(file.file);
        json.forEach((j) => {
          cmr.push(j);
        });
      }
      if (file?.type == "csv") {
        const csv = parseCSV(file.file);
        console.log("csv", csv);
        csv.forEach((j) => {
          cmr.push(j);
        });
      }
    });

    console.log("sales", sales?.length);
    setSales(cmr);
  };

  return (
    <>
      <button
        className="rounded bg-cyan-600 rounded shadow p-2 text-white font-semibold cursor-pointer text-md hover:bg-gray-200 hover:text-cyan-600 mt-4"
        onClick={() => transform()}
      >
        {" "}
        Transform{" "}
      </button>
      <table className="w-full md:w-fit h-full bg-white min-h-56 my-8 shadow-md rounded-lg mx-2">
        <thead className="flex w-full justify-between">
          {columns.map((column) => (
            <tr key={column} className="bg-gray-100 w-full border-b-2 border">
              <th className="p-4 text-left text-cyan-600 font-semibold">
                {column}
              </th>
            </tr>
          ))}
        </thead>

        {sales && sales.length > 0 && (
          <>
            {sales.map((sale, i) => {
              return (
                <tr
                  key={sale + " " + i}
                  className="w-full text-gray-500 flex justify-between"
                >
                  {Object.values(sale).map((value, i) => {
                    return (
                      <td
                        key={value + " " + i}
                        className="p-4 text-left text-gray-600 font-medium h-20 w-full md:w-32"
                      >
                        <p> {value} </p>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </>
        )}
      </table>
    </>
  );
};

export default Table;
