import { FC, useMemo } from 'react';
import { Icon as FeatherIcon, ChevronDown, ChevronUp } from 'react-feather';

import { useItemContext } from './ItemContext';

export const Chevron: FC = () => {
  const { isOpen, setIsOpen } = useItemContext();

  const Chevron: FeatherIcon = useMemo(() => (isOpen ? ChevronUp : ChevronDown), [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return <Chevron className="ml-0! h-8 w-8 shrink-0 cursor-pointer p-2" onClick={toggleOpen} />;
};
