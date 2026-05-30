import { useState, useEffect } from 'react';
import { getMenuVisibilityMap } from '../services/menuSettingsDB';

export function useMenuVisibility() {
  const [visibilityMap, setVisibilityMap] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisibility();
  }, []);

  const loadVisibility = async () => {
    const map = await getMenuVisibilityMap();
    setVisibilityMap(map);
    setIsLoading(false);
  };

  const isVisible = (menuKey: string): boolean => {
    return visibilityMap.get(menuKey) !== false;
  };

  return { isVisible, isLoading, refresh: loadVisibility };
}
