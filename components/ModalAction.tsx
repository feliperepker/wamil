import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { set } from "sanity";

const ModalAction = ({
  title,
  setModalOpen,
  handleAction,
}: {
  title: string;
  setModalOpen: (close: boolean) => void;
  handleAction: () => void;
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#000] bg-opacity-20 z-50"
      onClick={(e) => {
        e.stopPropagation();
        setModalOpen(false);
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-black overflow-y-auto p-4 rounded-lg shadow-lg "
      >
        <div className="flex justify-between items-start">
          <h2 className="font-oxanium text-xl font-semibold max-w-[90%]">
            {title}
          </h2>
          <button
            onClick={() => {
              setModalOpen(false);
            }}
          >
            <X
              width={18}
              className="hover:text-gray-600 transiton duration-500"
            />
          </button>
        </div>

        <div className="mt-4 flex gap-2 mx-auto">
          <Button
            onClick={async () => {
              setIsPending(true);
              try {
                await handleAction();
              } finally {
                setIsPending(false);
              }
            }}
            disabled={isPending}
            className="btn-secondary self-end"
            size="sm"
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              setModalOpen(false);
            }}
            disabled={isPending}
            className="btn-cancel self-end"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalAction;
