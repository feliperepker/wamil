const GraphKnowledge = () => {
  return (
    <div className="mt-4 text-sm flex flex-col gap-1">
      <div className="flex items-center">
        <div className="w-[20px] h-5 bg-[#dc26264b] text-xs flex items-center justify-center max-sm:w-[15px]">
          5%
        </div>
        <p className="ml-3">Lecture</p>
      </div>
      <div className="flex items-center">
        <div className="w-[40px] h-5 bg-[#ea580c4b] text-xs flex items-center justify-center max-sm:w-[30px]">
          10%
        </div>
        <p className="ml-3">Reading</p>
      </div>
      <div className="flex items-center">
        <div className="w-[80px] h-5 bg-[#ca8a044b] text-xs flex items-center justify-center max-sm:w-[60px]">
          20%
        </div>
        <p className="ml-3">Audio-visual</p>
      </div>
      <div className="flex items-center">
        <div className="w-[120px] h-5 bg-[#16a34a4b] text-xs flex items-center justify-center max-sm:w-[90px]">
          30%
        </div>
        <p className="ml-3">Demonstration</p>
      </div>
      <div className="flex items-center">
        <div className="w-[200px] h-5 bg-[#0891b24b] text-xs flex items-center justify-center max-sm:w-[150px]">
          50%
        </div>
        <p className="ml-3">Discussion</p>
      </div>
      <div className="flex items-center">
        <div className="w-[260px] h-5 bg-[#2564eb4b] text-xs flex items-center justify-center max-sm:w-[195px]">
          75%
        </div>
        <p className="ml-3">Practice doing</p>
      </div>
      <div className="flex items-center">
        <div className="w-[360px] h-5 bg-[#9233ea4b] text-xs flex items-center justify-center max-sm:w-[270px]">
          90%
        </div>
        <p className="ml-3">Teach</p>
      </div>
    </div>
  );
};

export default GraphKnowledge;
