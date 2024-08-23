'use client';

import { type CSSProperties, type ReactNode } from 'react';

type DeviceType = 'iphone-15-pro' | 'iphone-se' | 'pixel-8' | 'ipad-mini';

interface DeviceDimensions {
  width: number;
  height: number;
  borderRadius: number;
  label: string;
}

const DEVICE_SPECS: Record<DeviceType, DeviceDimensions> = {
  'iphone-15-pro': { width: 393, height: 852, borderRadius: 55, label: 'iPhone 15 Pro' },
  'iphone-se': { width: 375, height: 667, borderRadius: 44, label: 'iPhone SE' },
  'pixel-8': { width: 412, height: 915, borderRadius: 40, label: 'Pixel 8' },
  'ipad-mini': { width: 744, height: 1133, borderRadius: 20, label: 'iPad mini' },
};

export interface DeviceFrameProps {
  children: ReactNode;
  device?: DeviceType;
  /** Scale factor (default: 0.5) */
  scale?: number;
  /** Show device label */
  showLabel?: boolean;
  className?: string;
}

/**
 * <DeviceFrame /> — Renders children inside a simulated device bezel.
 * Useful for previewing mobile experiments/Expo screens on the web.
 *
 * @example
 * <DeviceFrame device="iphone-15-pro" scale={0.6}>
 *   <MobileExperimentPreview />
 * </DeviceFrame>
 */
export function DeviceFrame({
  children,
  device = 'iphone-15-pro',
  scale = 0.5,
  showLabel = true,
  className,
}: DeviceFrameProps) {
  const spec = DEVICE_SPECS[device];

  const outerStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    transform: `scale(${scale})`,
    transformOrigin: 'top center',
  };

  const frameStyle: CSSProperties = {
    position: 'relative',
    width: spec.width,
    height: spec.height,
    borderRadius: spec.borderRadius,
    border: '10px solid #1a1a2c',
    boxShadow: `
      0 0 0 2px #2a2a3e,
      0 40px 120px rgba(0,0,0,0.8),
      inset 0 0 0 1px rgba(255,255,255,0.05)
    `,
    overflow: 'hidden',
    background: '#050507',
  };

  const notchStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 120,
    height: 34,
    background: '#1a1a2c',
    borderRadius: '0 0 20px 20px',
    zIndex: 10,
  };

  const screenStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: spec.borderRadius - 10,
  };

  return (
    <div style={outerStyle} className={className}>
      <div style={frameStyle}>
        {device.startsWith('iphone') && <div style={notchStyle} aria-hidden />}
        <div style={screenStyle}>{children}</div>
      </div>
      {showLabel && (
        <span
          style={{
            color: '#606090',
            fontSize: 13,
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
          }}
        >
          {spec.label}
        </span>
      )}
    </div>
  );
}
