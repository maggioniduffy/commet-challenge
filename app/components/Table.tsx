"use client";

import { columns } from "@/constants";
import { Sale, File } from "@/models";
import { parseCSV, parseJSON } from "@/utils";
import React, { useState } from "react";

interface Props {
  files?: (File | undefined)[];
}

const Table = ({ files }: Props) => {
  const [sales, setSales] = useState<Sale[]>();
  const [totalComissions, setTotalComissions] = useState<number>(0);

  const transform = () => {
    let aux_sales: Sale[] = [];

    files?.forEach((file) => {
      if (file?.type == "json") {
        const json = parseJSON(file.file);
        json.forEach((j) => {
          aux_sales.push(j);
        });
      }
      if (file?.type == "csv") {
        const csv = parseCSV(file.file);
        console.log("csv", csv);
        csv.forEach((j) => {
          aux_sales.push(j);
        });
      }
    });

    setSales(aux_sales);

    const total = aux_sales.reduce(
      (acc, sale) => acc + (sale.comission || 0),
      0
    );
    setTotalComissions(total);
  };

  const save = async () => {
    try {
      console.log("Saving sales", sales);
      const response = await fetch("/api/prisma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sales, files }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      console.log("CRM created");

      setTimeout(() => reset(), 1000);
    } catch (err) {
      console.error(err);
      alert("Failed to save CRM.");
    }
  };

  const reset = () => {
    setSales(undefined);
    setTotalComissions(0);
  };

  return (
    <>
      <div className="flex gap-4">
        <button
          className="rounded bg-cyan-600 rounded shadow p-2 text-white font-semibold cursor-pointer text-md hover:bg-gray-200 hover:text-cyan-600 mt-4"
          onClick={() => transform()}
        >
          {" "}
          Transform{" "}
        </button>
        <button
          onClick={() => reset()}
          className="rounded bg-gray-200 rounded shadow p-2 text-cyan-600 font-semibold cursor-pointer text-md hover:bg-cyan-600 hover:text-gray-200 mt-4"
        >
          Reset
        </button>
      </div>
      <table className="w-full md:w-fit h-full bg-white min-h-56 my-8 shadow-xl rounded-lg mx-2">
        <thead className="flex w-full justify-between">
          {columns.map((column) => (
            <tr key={column} className="bg-gray-100 w-full border-b-2 border">
              <th className="p-4 text-left text-cyan-600 font-semibold">
                {column}
              </th>
            </tr>
          ))}
        </thead>
        <tbody className="rounded-xl flex flex-col gap-2">
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
              <tr className="bg-cyan-600 font-semibold h-12 rounded-b-xl  px-4">
                <td className="flex place-items-center justify-end h-full gap-3 ">
                  <p> Total comissions: </p>
                  <p> {totalComissions > 0 && totalComissions} </p>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <button
        className="rounded bg-cyan-600 w-20 rounded-lg shadow p-2 text-white font-semibold cursor-pointer text-md hover:bg-gray-200 hover:text-cyan-600 mt-4"
        onClick={() => save()}
      >
        {" "}
        Save
      </button>
    </>
  );
};

export default Table;
