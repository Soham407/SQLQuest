import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Lesson } from '@/lib/api';

// Extend Lesson with extra fields used in the list
export type AnimatedLesson = Lesson & { isCompleted?: boolean; isLocked?: boolean };

interface AnimatedListProps {
  items: AnimatedLesson[];
  onItemSelect: (item: AnimatedLesson, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onItemSelect(items[selectedIndex], selectedIndex);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableArrowNavigation, items, selectedIndex, onItemSelect]);

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/20 text-success border-success/30';
      case 'Intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'Advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (lesson: AnimatedLesson) => {
    if (lesson.isCompleted) {
      return <CheckCircle className="w-5 h-5 text-success" />;
    }
    if (lesson.isLocked) {
      return <Lock className="w-5 h-5 text-muted-foreground" />;
    }
    return <Play className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="relative">
      {showGradients && (
        <>
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        </>
      )}
      
      <div
        ref={listRef}
        className={`space-y-3 max-h-96 overflow-y-hidden overflow-x-hidden ${
          displayScrollbar ? 'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent' : 'scrollbar-hide'
        }`}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          msOverflowStyle: displayScrollbar ? 'auto' : 'none',
        }}
      >
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              ref={(el) => (itemRefs.current[index] = el)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onItemSelect(item, index)}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  selectedIndex === index
                    ? 'ring-2 ring-primary bg-primary/5 border-primary/30'
                    : hoveredIndex === index
                    ? 'ring-1 ring-border bg-muted/30'
                    : 'hover:bg-muted/20'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getStatusIcon(item)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 min-w-0">
                          <CardTitle className="text-lg font-semibold truncate min-w-0">
                            {item.title}
                          </CardTitle>
                          <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                            {item.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>⏱️ {item.estimatedTime} min</span>
                          <span>📊 {item.category}</span>
                          {item.isCompleted && (
                            <span className="text-success">✅ Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ChevronRight 
                        className={`w-5 h-5 transition-transform ${
                          selectedIndex === index ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {enableArrowNavigation && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Use ↑↓ arrows to navigate, Enter to select
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimatedList;
