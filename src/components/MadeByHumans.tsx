
import React from "react";

const MadeByHumans = () => {
  return (
    <section id="made-by-humans" className="w-full bg-white py-0">
      <div className="section-container opacity-0 animate-on-scroll pb-2">
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden relative mt-6 sm:mt-8">
          <div className="bg-no-repeat bg-cover bg-center p-4 sm:p-5 min-h-[250px] sm:min-h-[350px] flex flex-col justify-between" style={{
            background: 'linear-gradient(135deg, #134F4F 0%, #2AABAB 100%)'
          }}>
            <div className="flex items-center text-white">
              <img src="/logo.svg" alt="Reklamix AI Logo" className="h-5 sm:h-6 w-auto mr-3 invert" />
              <span className="text-white text-xl font-medium"></span>
            </div>
            
            <div className="overflow-hidden max-h-[80px] mt-10">
              <h2 className="sm:text-5xl font-playfair text-white italic mt-0 mx-0 font-thin text-6xl md:text-7xl py-0 px-0 text-center lg:text-7xl mb-[-30px] pb-[100px]">
                Made By AI & Human
              </h2>
            </div>
            
            <div className="absolute left-0 bottom-0 w-full bg-white h-10 rounded-t-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MadeByHumans;
