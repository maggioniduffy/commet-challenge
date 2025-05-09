"use client";

import { columns } from "@/constants";
import { Sale, File } from "@/models";
import { parseCSV, parseJSON } from "@/utils";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import SaveMessage from "./SaveMessage";

interface Props {
  files?: (File | undefined)[];
}

const CustomTable = ({ files }: Props) => {
  const [sales, setSales] = useState<Sale[]>();
  const [totalComissions, setTotalComissions] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const transform = () => {
    const aux_sales: Sale[] = [];

    files?.forEach((file) => {
      if (file?.type == "json") {
        const json = parseJSON(file.content);
        json.forEach((j) => {
          aux_sales.push(j);
        });
      }
      if (file?.type == "csv") {
        const csv = parseCSV(file.content);
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
      setLoading(true);
      console.log("Saving sales", sales);
      const response = await fetch("/api/prisma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sales, files }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      console.log("CRM created");

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1000);
        reset();
      }, 500);
    } catch (err) {
      console.error(err);

      setLoading(false);
      setError("Failed to save sales");
      setTimeout(() => {
        setError(null);
      }, 1000);
    }
  };

  const reset = () => {
    setSales(undefined);
    setTotalComissions(0);
  };

  return (
    <div className="flex place-items-center flex-col flex-wrap justify-center w-full md:p-10">
      <div className="flex gap-4">
        <button
          className="rounded bg-cyan-600 rounded shadow p-2 text-white font-semibold cursor-pointer text-md hover:bg-gray-200 hover:text-cyan-600 mt-4"
          onClick={transform}
        >
          {" "}
          Transform{" "}
        </button>
        <button
          onClick={reset}
          className="rounded bg-gray-200 rounded shadow p-2 text-cyan-600 font-semibold cursor-pointer text-md hover:bg-cyan-600 hover:text-gray-200 mt-4"
        >
          Reset
        </button>
      </div>
      <Table className="bg-white min-h-56 my-8 shadow-xl rounded-lg overflow-x-scroll mx-0 w-full">
        <TableHeader className="flex justify-between rounded-t-lg">
          {columns.map((column) => (
            <TableRow
              key={column}
              className="bg-gray-100 w-full border-b-2 border w-32 md:w-full"
            >
              <TableCell className="p-4 text-left text-cyan-600 font-semibold">
                {column}
              </TableCell>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="rounded-xl flex flex-col">
          {sales && sales.length > 0 && (
            <>
              {sales.map((sale, i) => {
                return (
                  <TableRow
                    key={sale + " " + i}
                    className="text-gray-500 flex justify-between"
                  >
                    {Object.values(sale).map((value, i) => {
                      return (
                        <TableCell
                          key={value + " " + i}
                          className="p-4 text-left text-gray-600 font-medium h-20 w-32 md:w-fit"
                        >
                          <p> {value} </p>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              <TableRow className="bg-cyan-600 font-semibold h-12 rounded-b-xl px-4 hover:bg-cyan-700">
                <TableCell className="flex place-items-center justify-end h-full gap-3 text-white">
                  <p> Total comissions: </p>
                  <p> {totalComissions > 0 && totalComissions} </p>
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
      <SaveMessage
        loading={loading}
        success={success}
        error={error}
        save={save}
      />
    </div>
  );
};

export default CustomTable;
