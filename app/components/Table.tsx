"use client";

import { columns } from "@/constants";
import { Sale } from "@/models";
import { parseCSV, parseJSON } from "@/utils";
import React, { useState } from "react";

interface Props {
  files?: ({ file: any; type: string } | undefined)[];
}

const props = new Map<number, any>();
props.set(1, "id");
props.set(2, "amount");
props.set(3, "salesperson");
props.set(4, "date");
props.set(5, "comission");

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
        className="rounded bg-gray-100 rounded shadow p-2 text-black font-medium cursor-pointer text-xl hover:bg-gray-300"
        onClick={() => transform()}
      >
        {" "}
        Transform{" "}
      </button>
      <table className="w-full h-full bg-white min-h-56">
        <thead className="flex w-full justify-between">
          {columns.map((column) => (
            <tr key={column} className="bg-gray-100 w-full border-b-2 border">
              <th className="p-4 text-left text-gray-600 font-semibold">
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
                  className="w-full border-b-2 border text-black"
                >
                  {Object.values(sale).map((value, i) => {
                    return (
                      <td
                        key={value + " " + i}
                        className="p-4 text-left text-gray-600 font-semibold"
                      >
                        {value}
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
