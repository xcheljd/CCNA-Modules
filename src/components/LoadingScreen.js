import React from 'react';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-loading flex justify-center items-center z-[40]">
      <div className="text-center text-loading-foreground">
        <div className="mb-[30px] flex justify-center">
          <div className="w-[100px] h-[100px] relative flex items-center justify-center bg-white/10 rounded-full backdrop-blur-[10px]">
            <div className="network-lines w-[60px] h-[60px] relative">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <h1 className="text-[32px] mb-10 font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
          CCNA 200-301 Course
        </h1>
        <div className="w-[200px] mx-auto">
          <div className="w-full h-1 bg-white/20 rounded overflow-hidden">
            <div className="h-full bg-white rounded animate-[loadingPulse_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
