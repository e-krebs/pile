import { FC, useMemo } from 'react';
import { Icon as FeatherIcon, ChevronDown, ChevronUp } from 'react-feather';

import { useItemContext } from './ItemContext';

export const Chevron: FC = () => {
  const { isOpen, setIsOpen } = useItemContext();

  const Chevron: FeatherIcon = useMemo(() => isOpen ? ChevronUp : ChevronDown, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Chevron
      className="w-8 h-8 p-2 flex-shrink-0 cursor-pointer"
      onClick={toggleOpen}
    />
  );
};
