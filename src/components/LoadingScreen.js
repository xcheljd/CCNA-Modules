import React from 'react';

function LoadingScreen({ status = 'Loading...', progress = 0 }) {
  return (
    <div className="fixed inset-0 bg-loading flex justify-center items-center z-[40] animate-[fadeIn_0.3s_ease-in]">
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
        <div className="mx-auto mb-5 w-[50px] h-[50px]">
          <div className="loading-spinner-el w-[50px] h-[50px] border-4 border-white/30 border-t-white rounded-full animate-[spin_1s_linear_infinite] relative"></div>
        </div>
        <p className="loading-status text-base opacity-90 font-normal tracking-[0.5px] mb-5">
          {status}
        </p>
        <div className="w-[200px] mx-auto">
          <div
            className="w-full h-1 bg-white/20 rounded overflow-hidden mb-2"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading progress"
          >
            <div
              className="progress-fill h-full bg-white rounded transition-[width] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="block text-center text-sm opacity-80 font-normal">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
