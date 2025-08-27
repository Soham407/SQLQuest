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
  maxHeight?: string;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
  maxHeight = '24rem', // 384px default
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
          if (items[selectedIndex]) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
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
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (lesson: AnimatedLesson) => {
    if (lesson.isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
    }
    if (lesson.isLocked) {
      return <Lock className="w-5 h-5 text-muted-foreground" />;
    }
    return <Play className="w-5 h-5 text-primary" />;
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No lessons available</h3>
          <p className="text-muted-foreground">Check back later for new content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animated-list-container relative px-8 mx-auto overflow-y-auto overflow-x-hidden  ">
      {showGradients && (
        <>
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        </>
      )}
      
                           <div
          ref={listRef}
          className="space-y-3 overflow-y-auto overflow-x-visible scrollbar-hide"
          style={{
            maxHeight,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
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
               transition={{ delay: index * 0.05, duration: 0.3 }}
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.99 }}
               onMouseEnter={() => setHoveredIndex(index)}
               onMouseLeave={() => setHoveredIndex(null)}
               onClick={() => onItemSelect(item, index)}
                               className="animated-list-card-container px-12 py-1"
             >
              <Card
                className={`animated-list-card cursor-pointer transition-all duration-200 border ${
                  selectedIndex === index
                    ? 'ring-2 ring-primary bg-primary/5 border-primary/30 shadow-md selected'
                    : hoveredIndex === index
                    ? 'ring-1 ring-border bg-muted/30 shadow-sm'
                    : 'hover:bg-muted/20 hover:shadow-sm'
                } ${item.isCompleted ? 'border-green-200 dark:border-green-800' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getStatusIcon(item)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 min-w-0">
                          <CardTitle className="text-lg font-semibold truncate min-w-0">
                            {item.title}
                          </CardTitle>
                          <Badge variant="outline" className={`${getDifficultyColor(item.difficulty)} text-xs`}>
                            {item.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span>⏱️</span>
                            <span>{item.estimatedTime} min</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📊</span>
                            <span>{item.category}</span>
                          </span>
                          {item.isCompleted && (
                            <span className="text-green-600 dark:text-green-400 font-medium">✅ Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
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
      
      {enableArrowNavigation && items.length > 0 && (
        <div className="mt-6 mb-4 text-center">
          <p className="text-xs text-muted-foreground">
            Use ↑↓ arrows to navigate, Enter to select
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimatedList;
