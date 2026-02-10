import "./ScrollDownButton.css";

import { ArrowDown } from 'lucide-react';

type ScrollDownProps = {
  targetId: string;
};

export function ScrollDownButton({ targetId }: ScrollDownProps) {

  return (
    <a className="scroll-down-button" href={`#${targetId}`} aria-label="Scroll">
      <ArrowDown strokeWidth={3} className="scroll-down-button__icon"/>
    </a>
  )
}