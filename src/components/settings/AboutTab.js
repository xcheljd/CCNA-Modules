import React from 'react';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import CourseCreditContent from '../CourseCreditContent';

function AboutTab() {
  return (
    <div className="p-2">
      <div className="flex items-center gap-4 mb-6 pb-4">
        <Heart className="text-primary shrink-0" size={32} />
        <h3 className="m-0 text-2xl font-semibold text-foreground">Course Credit</h3>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-col gap-6">
        <CourseCreditContent />

        <div className="bg-primary/8 border-l-4 border-primary rounded-xl p-5 mt-2">
          <p className="m-0 text-base text-foreground font-medium text-center">
            Thank you, Jeremy, for making quality networking education accessible to everyone!
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutTab;
