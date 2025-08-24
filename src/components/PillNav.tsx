import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items: NavItem[];
  activeHref: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
}

const PillNav = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className,
  baseColor = "hsl(var(--foreground))",
  pillColor = "hsl(var(--primary))",
  hoveredPillTextColor = "hsl(var(--primary-foreground))",
  pillTextColor = "hsl(var(--foreground))",
}: PillNavProps) => {
  const [activeIndex, setActiveIndex] = useState(
    items.findIndex(item => item.href === activeHref)
  );
  const [pillStyle, setPillStyle] = useState({});
  const navRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const activeIdx = items.findIndex(item => item.href === activeHref);
    setActiveIndex(activeIdx);
  }, [activeHref, items]);

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex] && navRef.current) {
      const activeItem = itemRefs.current[activeIndex];
      const nav = navRef.current;
      
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      
      setPillStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
        height: itemRect.height,
      });
    }
  }, [activeIndex]);

  const handleItemHover = (index: number) => {
    if (itemRefs.current[index] && navRef.current) {
      const item = itemRefs.current[index];
      const nav = navRef.current;
      
      const navRect = nav.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      
      setPillStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
        height: itemRect.height,
      });
    }
  };

  const handleNavLeave = () => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex] && navRef.current) {
      const activeItem = itemRefs.current[activeIndex];
      const nav = navRef.current;
      
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      
      setPillStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
        height: itemRect.height,
      });
    }
  };

  return (
    <nav className={cn("flex items-center gap-8", className)}>
      {logo && (
        <div className="flex items-center">
          <img src={logo} alt={logoAlt} className="h-8 w-auto" />
        </div>
      )}
      
      <div className="relative">
        <motion.div
          className="absolute top-0 rounded-full transition-all duration-300 ease-out"
          style={{
            backgroundColor: pillColor,
            ...pillStyle,
          }}
          initial={false}
        />
        
        <ul
          ref={navRef}
          className="relative flex items-center space-x-1 p-1 rounded-full border border-border bg-background/50 backdrop-blur-sm"
          onMouseLeave={handleNavLeave}
        >
          {items.map((item, index) => (
            <li
              key={item.href}
              ref={(el) => (itemRefs.current[index] = el)}
              onMouseEnter={() => handleItemHover(index)}
            >
              <Link
                to={item.href}
                className={cn(
                  "relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                  activeIndex === index
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={{
                  color: activeIndex === index ? hoveredPillTextColor : baseColor,
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default PillNav;