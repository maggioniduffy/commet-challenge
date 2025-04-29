"use client";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  error: string | null;
  loading: boolean;
  success: boolean;
  save: () => void;
}

const SaveMessage = ({ error, loading, success, save }: Props) => {
  let bg = "bg-cyan-600";
  let message = "Save";
  let disabled = false;

  if (error) {
    bg = "bg-red-400";
    message = error;
    disabled = true;
  } else {
    if (loading) {
      bg = "bg-transparent";
      message = "Saving...";
      disabled = true;
    }
    if (success) {
      bg = "bg-green-400";
      message = "Saved!";
      disabled = true;
    }
  }

  return (
    <button
      className={`rounded ${bg} w-fit rounded-lg shadow p-2 text-white font-semibold cursor-pointer text-sm mt-4`}
      onClick={save}
      disabled={disabled}
    >
      {loading ? (
        <Skeleton className="h-full w-full rounded-xl text-gray-700 flex place-items-center text-sm justify-center">
          {" "}
          Saving...{" "}
        </Skeleton>
      ) : (
        <p> {message} </p>
      )}
    </button>
  );
};

export default SaveMessage;
