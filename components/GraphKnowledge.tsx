const GraphKnowledge = () => {
  return (
    <div className="mt-4 text-sm flex flex-col gap-1">
      <p className="mx-auto">Learning retention</p>
      <div className="flex items-center">
        <div className="w-[20px] h-5 bg-red-800 text-xs flex items-center justify-center">
          5%
        </div>
        <p className="ml-3">Lecture</p>
      </div>
      <div className="flex items-center">
        <div className="w-[40px] h-5 bg-orange-800 text-xs flex items-center justify-center">
          10%
        </div>
        <p className="ml-3">Reading</p>
      </div>
      <div className="flex items-center">
        <div className="w-[80px] h-5 bg-yellow-800 text-xs flex items-center justify-center">
          20%
        </div>
        <p className="ml-3">Audio-visual</p>
      </div>
      <div className="flex items-center">
        <div className="w-[120px] h-5 bg-green-800 text-xs flex items-center justify-center">
          30%
        </div>
        <p className="ml-3">Demonstration</p>
      </div>
      <div className="flex items-center">
        <div className="w-[200px] h-5 bg-cyan-800 text-xs flex items-center justify-center">
          50%
        </div>
        <p className="ml-3">Discussion</p>
      </div>
      <div className="flex items-center">
        <div className="w-[260px] h-5 bg-blue-800 text-xs flex items-center justify-center">
          75%
        </div>
        <p className="ml-3">Practice doing</p>
      </div>
      <div className="flex items-center">
        <div className="w-[360px] h-5 bg-purple-800 text-xs flex items-center justify-center">
          90%
        </div>
        <p className="ml-3">Teach others</p>
      </div>
    </div>
  );
};

export default GraphKnowledge;
