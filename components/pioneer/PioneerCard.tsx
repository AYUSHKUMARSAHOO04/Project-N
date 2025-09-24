'use client';

import { useRef, useEffect,useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { TeamMember } from '@/types/team';

interface PioneerCardProps {
  member: TeamMember;
  direction: number;
  numofmem:number;
}

export default function PioneerCard({ member,numofmem }: PioneerCardProps) {
  const [colorCard, setColorCard] = useState({
    stroke: '#FFFFFF',
    bgColor:'#8FA0A8'
  })
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-50% 0px -50% 0px',
  });

  const controls = useAnimation();
  const dottedControls = useAnimation();
  const outerControls = useAnimation();
  const innerControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      // Initial slide-in animation
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
      }).then(() => {
        // All animations start simultaneously with same duration - faster and smoother
        const animationDuration = 6;
        
        // Dotted circle animation - smooth continuous square pattern
        const dottedRadius = 30;
        dottedControls.start({
          x: [dottedRadius, dottedRadius, -dottedRadius, -dottedRadius, dottedRadius], 
          y: [0, dottedRadius, dottedRadius, -dottedRadius, 0],
          transition: { 
            duration: animationDuration,
            ease: [0.45, 0, 0.55, 1], // Smooth easing for continuous flow
            repeat: Infinity,
            repeatType: "loop"
          }
        });
        
        // Outer (orange) circle animation - smooth continuous opposite pattern
        const outerRadius = 50;
        outerControls.start({
          x: [-outerRadius, -outerRadius, outerRadius, outerRadius, -outerRadius], 
          y: [0, -outerRadius, -outerRadius, outerRadius, 0],
          transition: { 
            duration: animationDuration,
            ease: [0.45, 0, 0.55, 1], // Same smooth easing
            repeat: Infinity,
            repeatType: "loop"
          }
        });
        
        // Inner (image) circle animation - smooth continuous quarter offset pattern
        const innerRadius = 40;
        innerControls.start({
          x: [0, innerRadius, innerRadius, -innerRadius, -innerRadius, 0], // Added extra point for smoother loop
          y: [-innerRadius, 0, innerRadius, innerRadius, -innerRadius, -innerRadius],
          transition: { 
            duration: animationDuration,
            ease: [0.45, 0, 0.55, 1], // Same smooth easing
            repeat: Infinity,
            repeatType: "loop"
          }
        });
      });
    }
  }, [isInView, controls, dottedControls, outerControls, innerControls]);
  useEffect(() => {
    // const colors = [
    //   { stroke: '#FF2D55', bgColor: '#FF2D55' },
    //   { stroke: '#FF9500', bgColor: '#FF9500' },
    //   { stroke: '#4CD964', bgColor: '#4CD964' },
    //   { stroke: '#5AC8FA', bgColor: '#5AC8FA' },
    //   { stroke: '#5856D6', bgColor: '#5856D6' },
    // ];
    // setColorCard(colors[numofmem % colors.length]);
    if(numofmem%2==0){
      setColorCard({
        stroke: '#FFFFFF',
        bgColor: '#8FA0A8'
      });
    }
    else{
      setColorCard({
        stroke: '#FF2D55',
        bgColor: '#D4A089'
      });
    }
  }, [numofmem]);
  
  return (
    <section
      ref={ref}
      className="w-full mt-7 flex flex-col items-center justify-center gap-12 md:flex-row md:gap-24 min-h-screen px-4 sm:px-8 md:px-12 lg:px-16"
    >
      {/* Animated Image & Background - First on Mobile */}
      <div className="relative w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] flex items-center justify-center rounded-full overflow-visible order-1 md:order-2">
        {/* Moving Dotted Circle */}
        <motion.div
          initial={{ x: 900, opacity: 0 }}
          animate={controls}
          className="absolute w-full h-full z-0"
        >
          <motion.svg
            className="absolute w-full h-full"
            viewBox="0 0 320 320"
            fill="none"
            initial={{ x: 30, y: 0 }}
            animate={dottedControls}
            style={{
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%'
            }}
          >
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke={colorCard.stroke}
              strokeWidth="1"
              strokeDasharray="10 10"
            />
          </motion.svg>
        </motion.div>

        {/* Moving Container */}
        <motion.div
          initial={{ x: 900, opacity: 0 }}
          animate={controls}
          className="absolute w-full h-full"
        >
          {/* Orange Background Circle (outer movement) - opposite pattern */}
          <motion.div 
            className={`absolute w-[75%] h-[75%] md:w-[80%] md:h-[80%] rounded-full   z-5 `}
            initial={{ x: -50, y: 0 }} // Start position opposite to dotted
            animate={outerControls}
            style={{
              background: ` ${colorCard.bgColor} `,
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%'
            }}
          />

          {/* Image Circle (inner movement) - quarter offset pattern, stays within bounds */}
          <motion.div
            className="absolute w-[75%] h-[75%] md:w-[80%] md:h-[80%] rounded-full overflow-hidden z-10 ring-2 ring-white/20"
            initial={{ x: 0, y: -40 }} // Start position at top
            animate={innerControls}
            style={{
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%'
            }}
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Content - Second on Mobile */}
      <div className="w-full md:w-1/2 space-y-4 text-center md:text-left order-2 md:order-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">{member.name}</h2>
        <h3 className="text-sm sm:text-base font-bold text-[#668bb0]">{member.role}</h3>
        <p className="text-base sm:text-lg text-gray-400">{member.description}</p>
      </div>
    </section>
  );
}