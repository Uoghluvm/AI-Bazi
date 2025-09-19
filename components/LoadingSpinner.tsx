
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="text-amber-300 animate-spin-slow"
      >
        <path
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity=".25"
          fill="currentColor"
        />
        <path
          d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
          className="animate-spin"
          fill="currentColor"
          style={{ animationDuration: '1.2s' }}
        />
      </svg>
      <p className="mt-4 text-lg text-amber-200 tracking-wider">
        正在连接AI命理大师...
      </p>
      <p className="text-sm text-amber-200/70">
        天机推演中，请稍候
      </p>
    </div>
  );
};
