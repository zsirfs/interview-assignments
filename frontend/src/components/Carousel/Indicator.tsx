import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import styles from './Indicator.module.css';

export interface IndicatorProps {
  duration?: number;
  active?: boolean;
  width?: number;
}

/** 跑马灯指示 */
const MemoIndicator = memo<IndicatorProps>(({ duration = 0, active, width = 40 }) => {
  const [innerWidth, updateInnerWidth] = useState(0);

  const start = useRef(0);
  const interval = useRef(1000 / 60);
  const play = (t: DOMHighResTimeStamp) => {
    if (!start.current) start.current = t;
    const d = t - start.current;
    // 控制时间，在duration内执行动画
    if (d < duration) {
      requestAnimationFrame(play);
      // 更新逻辑 每秒多少宽度(px/ms)，然后根据60fps来计算获取每次需要更新的宽度
      updateInnerWidth((prev) => prev + (width / duration) * interval.current);
    } else {
      start.current = 0;
      updateInnerWidth(0);
    }
  };

  useEffect(() => {
    if (!active) return;
    const animationId = requestAnimationFrame(play);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [active]);

  return (
    <div className={styles.indicator} style={{ width }}>
      <div className={styles.indicatorInner} style={{ width: innerWidth }}></div>
    </div>
  );
});

MemoIndicator.displayName = 'Indicator';

export const Indicator = MemoIndicator;
